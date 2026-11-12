/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The headless game engine. No DOM, no Lit: the same code runs in the browser
// and in Node for rapid simulation. Units are feet and seconds. x runs across
// the rink, y along it, with the top goal line at y = surface.goalLine.
//
// Usage:
//   const game = new Game({ level: '10U', home: 'icers', away: 'saber-cats' })
//   game.step(1 / 60, inputs)   // inputs: { [controllerId]: { x, y, pass, shoot, check, stick } }
//   game.drainEvents()          // [{ type: 'goal', ... }, ...]
//   game.snapshot()             // plain object for the renderer and replays
import { buildRules } from './ages.js'
import { getTeam, getRoster, ratePlayer } from './teams.js'
import { createRng } from './rng.js'
import { PENALTIES, judgeAction } from './penalties.js'
import { INTERMISSION_EVENTS } from './events.js'
import { aiSkater, aiGoalie } from './ai.js'
import { GUESTS, EQUIPMENT } from './cheats.js'

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

const SKATER_RADIUS = 1.2
const PUCK_REACH = 2.1

class Team {
  constructor(game, side, teamId, kitName) {
    this.game = game
    this.side = side
    this.def = getTeam(teamId)
    this.kitName = kitName
    this.kit = this.def.kits[kitName] || this.def.kits.home
    this.score = 0
    this.shots = 0
    this.chemistry = 0
    this.box = []
    this.lineIndex = 0
    this.lineTime = 0
    const ageIndex = game.rules.ageIndex
    this.entities = getRoster(teamId).map((player) => ({
      uid: ++game.uidCounter,
      id: player.id,
      side,
      player,
      rating: ratePlayer(player, ageIndex),
      isGoalie: player.goalie,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      dir: side === 'home' ? -Math.PI / 2 : Math.PI / 2,
      onIce: false,
      inBox: false,
      ejected: false,
      stun: 0,
      slow: 0,
      fighting: false,
      stamina: 1,
      exposure: player.influence,
      boost: 0,
      doubleShift: false,
      aiTimer: 0,
      cooldown: { pass: 0, shot: 0, poke: 0, stick: 0, check: 0, pickup: 0 },
      discipline: true,
      controller: null,
      stats: { goals: 0, assists: 0, shots: 0, passes: 0, hits: 0, pim: 0, toi: 0, touches: 0, possession: 0 },
    }))
    this.applyLoadout(game)
    // starting goalie is the first; the backup sits. No goalies at the pond.
    this.goalie = this.entities.find((e) => e.isGoalie)
    this.goalie.onIce = game.rules.goalies
  }

  // venue boost, cheat-code equipment and a guest star
  applyLoadout(game) {
    const loadout = (game.opts.loadout && game.opts.loadout[this.side]) || {}
    const boost = game.rules.boost || 0
    const eq = loadout.equipment ? EQUIPMENT[loadout.equipment] : null
    this.equipment = eq
    const STATS = ['speed', 'shot', 'pass', 'hands', 'check', 'stamina', 'reflex', 'position']
    for (const e of this.entities) {
      for (const k of STATS) {
        // the venue boost is for skaters; goalies stay human
        let v = e.rating[k] + (e.isGoalie ? 0 : boost)
        if (eq && eq.bonus[k] && !e.isGoalie) v += eq.bonus[k]
        e.rating[k] = clamp(v, 20, 99)
      }
    }
    const guest = loadout.guest ? GUESTS[loadout.guest] : null
    if (guest) {
      // the guest takes the place of the first forward and never leaves the ice
      const e = this.entities.find((x) => x.player.position === 'F')
      e.guest = guest.id
      e.look = guest.look
      e.player = Object.assign({}, e.player, {
        first: guest.first,
        last: guest.last,
        name: guest.name,
        number: guest.number,
        skin: guest.look.skin || e.player.skin,
        influence: 0,
        coachability: 99,
        curve: 'steady',
      })
      e.rating = Object.assign({ coachability: 99, influence: 0, overall: 95 }, guest.ratings)
      e.exposure = 0
      e.doubleShift = true
    }
  }

  // positions for the skaters on the ice, so the AI can spread out:
  // forwards C / LW / RW, defense LD / RD
  assignRoles() {
    const on = this.onIceSkaters()
    const n = on.length
    const wantD = n >= 4 ? 2 : 1
    const ds = on.filter((e) => e.player.position === 'D')
    const fs = on.filter((e) => e.player.position !== 'D')
    while (ds.length > wantD) fs.push(ds.pop())
    while (ds.length < wantD && fs.length > 1) ds.push(fs.pop())
    const fRoles = fs.length === 1 ? ['C'] : fs.length === 2 ? ['C', 'W'] : ['C', 'LW', 'RW', 'W', 'W']
    const dRoles = ds.length === 1 ? ['D'] : ['LD', 'RD', 'D']
    fs.forEach((e, i) => {
      e.role = fRoles[i] || 'W'
    })
    ds.forEach((e, i) => {
      e.role = dRoles[i] || 'D'
    })
  }

  skaters() {
    return this.entities.filter((e) => !e.isGoalie && !e.ejected)
  }

  onIceSkaters() {
    return this.entities.filter((e) => !e.isGoalie && e.onIce)
  }

  available() {
    return this.skaters().filter((e) => !e.inBox)
  }

  // how many skaters this team may have on the ice right now
  strength() {
    const n = this.game.rules.skaters
    const boxed = Math.min(2, this.box.filter((b) => !PENALTIES[b.type].ejection).length)
    return Math.max(1, Math.min(n - boxed, this.available().length))
  }

  attackDir() {
    // home attacks up (toward y = 0) in odd periods, down in even ones
    const odd = this.game.period % 2 === 1
    return (this.side === 'home') === odd ? -1 : 1
  }

  targetNetY() {
    const s = this.game.rules.surface
    return this.attackDir() < 0 ? s.goalLine : s.length - s.goalLine
  }

  ownNetY() {
    const s = this.game.rules.surface
    return this.attackDir() < 0 ? s.length - s.goalLine : s.goalLine
  }

  // put the next group of skaters on the ice
  changeLine(keepPositions) {
    const n = this.strength()
    const pool = this.available()
    if (pool.length === 0) return
    const leaving = this.onIceSkaters()
    const spots = leaving.map((e) => ({ x: e.x, y: e.y, vx: e.vx, vy: e.vy, dir: e.dir }))
    leaving.forEach((e) => {
      e.onIce = false
    })
    const forced = pool.filter((e) => e.doubleShift)
    const rest = pool.filter((e) => !e.doubleShift)
    const next = forced.slice(0, n)
    const groups = Math.max(1, Math.ceil(rest.length / n))
    this.lineIndex = (this.lineIndex + 1) % groups
    let i = this.lineIndex * n
    while (next.length < n && rest.length > 0) {
      const e = rest[i % rest.length]
      if (!next.includes(e)) next.push(e)
      i++
      if (i > this.lineIndex * n + rest.length * 2) break
    }
    next.forEach((e, idx) => {
      e.onIce = true
      if (keepPositions && spots[idx]) {
        Object.assign(e, spots[idx])
      } else if (keepPositions) {
        this.game.placeAtBench(e)
      }
    })
    this.lineTime = 0
    this.assignRoles()
    // a leaving carrier drops the puck where they were
    const puck = this.game.puck
    if (puck.carrier && !puck.carrier.onIce) this.game.loosePuck(0, 0)
    // humans follow the change
    this.game.reassignControllers()
  }

  // fill up to strength after a penalty ends
  fillToStrength() {
    const n = this.strength()
    let on = this.onIceSkaters()
    const bench = this.available().filter((e) => !e.onIce)
    while (on.length < n && bench.length > 0) {
      const e = bench.shift()
      e.onIce = true
      this.game.placeAtBench(e)
      on = this.onIceSkaters()
    }
    while (on.length > n) {
      const e = on.pop()
      e.onIce = false
      if (this.game.puck.carrier === e) this.game.loosePuck(0, 0)
    }
    this.assignRoles()
    this.game.reassignControllers()
  }
}

export class Game {
  /**
   * @param {object} opts
   *  level, home, away (team ids), homeKit, awayKit,
   *  roller, ruleset ('standard' | 'jay'), strictness (0-1),
   *  seed, controllers ({ id: 'home' | 'away' }), focusSide,
   *  autoIntermission (sim picks choices), needWinner
   */
  constructor(opts = {}) {
    this.opts = opts
    this.rules = buildRules(opts.level || '8U', opts)
    this.rng = createRng(opts.seed || `game:${opts.home}:${opts.away}:${opts.level}`)
    this.events = []
    this.time = 0
    this.period = 1
    this.clock = this.rules.periodSeconds
    this.phase = 'faceoff'
    this.phaseTimer = 1
    this.crowd = { mood: 0.6, fightRate: 1 }
    this.pending = []
    this.intermission = null
    this.result = null
    this.buzzerTimer = this.rules.buzzer
    this.nextRestart = null
    this.fight = null
    this.controllers = Object.assign({}, opts.controllers || {})
    this.uidCounter = 0
    this.modifiers = (opts.loadout && opts.loadout.modifiers) || []
    // one stick breaks every game, sometime in regulation
    this.playTime = 0
    this.stickBreakAt = this.rng.range(0.15, 0.85) * this.rules.periods * this.rules.periodSeconds
    this.stickBroken = false
    this.control = {}
    const homeKit = opts.homeKit || 'home'
    let awayKit = opts.awayKit || 'away'
    this.teams = {
      home: new Team(this, 'home', opts.home || 'sparkle-selects', homeKit),
      away: new Team(this, 'away', opts.away || 'jesus-selects', awayKit),
    }
    this.puck = {
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0,
      carrier: null,
      shot: null,
      pass: null,
      icing: null,
      lastTouch: null,
      chain: [],
      prevY: 0,
    }
    for (const side of ['home', 'away']) {
      this.teams[side].changeLine(false)
    }
    this.startFaceoff(this.centerDot())
  }

  emit(type, data) {
    this.events.push(Object.assign({ type, t: this.time, period: this.period, clock: this.clock }, data || {}))
  }

  drainEvents() {
    const out = this.events
    this.events = []
    return out
  }

  other(side) {
    return side === 'home' ? 'away' : 'home'
  }

  allOnIce() {
    return [...this.teams.home.entities, ...this.teams.away.entities].filter((e) => e.onIce)
  }

  findEntity(uid) {
    return [...this.teams.home.entities, ...this.teams.away.entities].find((e) => e.uid === uid)
  }

  // ---------- geometry ----------

  centerDot() {
    const s = this.rules.surface
    return { x: s.width / 2, y: s.length / 2 }
  }

  // keep a point inside the rounded rink; returns the normal when it hit
  clampToRink(x, y, pad) {
    const s = this.rules.surface
    const r = s.cornerRadius
    const W = s.width
    const L = s.length
    let nx = 0
    let ny = 0
    let hit = false
    const cx = clamp(x, r, W - r)
    const cy = clamp(y, r, L - r)
    if ((x < r || x > W - r) && (y < r || y > L - r)) {
      const dx = x - cx
      const dy = y - cy
      const d = Math.hypot(dx, dy)
      const max = r - pad
      if (d > max) {
        nx = -dx / d
        ny = -dy / d
        x = cx + (dx / d) * max
        y = cy + (dy / d) * max
        hit = true
      }
    } else {
      if (x < pad) {
        x = pad
        nx = 1
        hit = true
      } else if (x > W - pad) {
        x = W - pad
        nx = -1
        hit = true
      }
      if (y < pad) {
        y = pad
        ny = 1
        hit = true
      } else if (y > L - pad) {
        y = L - pad
        ny = -1
        hit = true
      }
    }
    return { x, y, nx, ny, hit }
  }

  // the two nets: top defended by whoever attacks down, bottom by whoever attacks up
  nets() {
    const s = this.rules.surface
    const w = this.rules.net.width
    const d = this.rules.net.depth
    const cx = s.width / 2
    return [
      { id: 'top', cx, lineY: s.goalLine, x0: cx - w / 2, x1: cx + w / 2, y0: s.goalLine - d, y1: s.goalLine, mouth: 1 },
      { id: 'bottom', cx, lineY: s.length - s.goalLine, x0: cx - w / 2, x1: cx + w / 2, y0: s.length - s.goalLine, y1: s.length - s.goalLine + d, mouth: -1 },
    ]
  }

  // which side attacks a net
  attackerOfNet(net) {
    const homeUp = this.teams.home.attackDir() < 0
    if (net.id === 'top') return homeUp ? 'home' : 'away'
    return homeUp ? 'away' : 'home'
  }

  zoneDots(side, which) {
    // which: 'defensive' | 'offensive' end zone dots for a side
    const s = this.rules.surface
    const team = this.teams[side]
    const y = which === 'defensive' ? team.ownNetY() : team.targetNetY()
    const inward = y < s.length / 2 ? 1 : -1
    const off = Math.min(20, s.length * 0.2)
    const dx = Math.min(22, s.width * 0.26)
    const side2 = this.puck.x < s.width / 2 ? -1 : 1
    return { x: s.width / 2 + side2 * dx, y: y + inward * off }
  }

  placeAtBench(e) {
    const s = this.rules.surface
    e.x = 3
    e.y = s.length / 2 + (e.side === 'home' ? -6 : 6)
    e.vx = 0
    e.vy = 0
  }

  // ---------- restarts ----------

  startFaceoff(dot) {
    const s = this.rules.surface
    this.phase = 'faceoff'
    this.phaseTimer = 0.9
    this.nextRestart = null
    const p = this.puck
    p.carrier = null
    p.shot = null
    p.pass = null
    p.icing = null
    p.x = dot.x
    p.y = dot.y
    p.prevY = dot.y
    p.z = 0
    p.vx = 0
    p.vy = 0
    p.vz = 0
    this.faceoffDot = dot
    for (const side of ['home', 'away']) {
      const team = this.teams[side]
      const d = team.attackDir()
      const sk = team.onIceSkaters()
      const spots = [
        { x: 0, y: 2.5 },
        { x: -14, y: 5 },
        { x: 14, y: 5 },
        { x: -10, y: 16 },
        { x: 10, y: 16 },
      ]
      sk.forEach((e, i) => {
        const spot = spots[i % spots.length]
        const pos = this.clampToRink(dot.x + spot.x, dot.y - d * spot.y, 3)
        e.x = pos.x
        e.y = pos.y
        e.vx = 0
        e.vy = 0
        e.dir = d < 0 ? -Math.PI / 2 : Math.PI / 2
        e.stun = 0
        e.slow = 0
      })
      this.placeGoalie(team)
    }
    this.emit('faceoff', { x: dot.x, y: dot.y })
    if (s && this.opts.debug) this.emit('debug', { msg: 'faceoff' })
  }

  placeGoalie(team) {
    const g = team.goalie
    if (!g || !g.onIce) return
    const s = this.rules.surface
    const netY = team.ownNetY()
    g.x = s.width / 2
    g.y = netY + (netY < s.length / 2 ? 2.5 : -2.5)
    g.vx = 0
    g.vy = 0
    g.stun = 0
  }

  // small ice: a side restarts with the puck behind its own net, the other
  // team backs off past the middle
  startRestart(side) {
    const s = this.rules.surface
    const team = this.teams[side]
    const opp = this.teams[this.other(side)]
    const d = team.attackDir()
    const netY = team.ownNetY()
    this.phase = 'faceoff'
    this.phaseTimer = 1.2
    this.nextRestart = null
    const p = this.puck
    p.shot = null
    p.pass = null
    p.icing = null
    const sk = team.onIceSkaters()
    const behind = Math.min(4.5, s.goalLine * 0.6)
    sk.forEach((e, i) => {
      if (i === 0) {
        e.x = s.width / 2 + 5
        e.y = netY - d * behind
      } else {
        const pos = this.clampToRink(s.width * (i % 2 ? 0.25 : 0.75), netY + d * (8 + i * 4), 3)
        e.x = pos.x
        e.y = pos.y
      }
      e.vx = 0
      e.vy = 0
      e.dir = d < 0 ? -Math.PI / 2 : Math.PI / 2
    })
    opp.onIceSkaters().forEach((e, i) => {
      const pos = this.clampToRink(s.width * (0.2 + 0.3 * (i % 3)), s.length / 2 + d * (4 + i * 3), 3)
      e.x = pos.x
      e.y = pos.y
      e.vx = 0
      e.vy = 0
      e.dir = d < 0 ? Math.PI / 2 : -Math.PI / 2
    })
    this.placeGoalie(team)
    this.placeGoalie(opp)
    const carrier = sk[0]
    if (carrier) this.takePuck(carrier, true)
    this.emit('restart', { side })
  }

  whistle(reason, restart, data) {
    if (this.phase !== 'play') return
    this.phase = 'whistle'
    this.phaseTimer = 1.4
    this.nextRestart = restart
    const p = this.puck
    p.carrier = null
    p.shot = null
    p.pass = null
    p.icing = null
    p.vx *= 0.3
    p.vy *= 0.3
    this.emit('whistle', Object.assign({ reason }, data || {}))
    // penalties waiting on a whistle get served now
    this.assessPending()
    // AAA & Beer League: whistles are where fights start
    if (this.rules.fights && this.phase === 'whistle') this.maybeFight(null, null, 0.2)
  }

  doRestart() {
    // anyone with a broken stick grabs a new one on the bench
    for (const e of [...this.teams.home.entities, ...this.teams.away.entities]) {
      if (e.brokenStick) {
        e.brokenStick = false
        this.emit('new-stick', { side: e.side, uid: e.uid })
      }
    }
    const r = this.nextRestart
    if (!r) {
      this.startFaceoff(this.centerDot())
      return
    }
    // line changes happen at stoppages on full sheets
    if (!this.rules.buzzer) {
      for (const side of ['home', 'away']) {
        const team = this.teams[side]
        const on = team.onIceSkaters()
        const avg = on.reduce((s, e) => s + e.stamina, 0) / Math.max(1, on.length)
        if (team.lineTime > 40 || avg < 0.62) team.changeLine(false)
      }
    }
    for (const side of ['home', 'away']) this.teams[side].fillToStrength()
    if (r.type === 'restart' && !this.rules.faceoffs) this.startRestart(r.side)
    else if (r.type === 'restart') this.startFaceoff(this.zoneDots(r.side, 'defensive'))
    else this.startFaceoff({ x: r.x, y: r.y })
  }

  dropPuck() {
    const dot = this.faceoffDot
    const home = this.teams.home.onIceSkaters()[0]
    const away = this.teams.away.onIceSkaters()[0]
    this.phase = 'play'
    if (!home || !away) return
    const hw = home.rating.hands + home.boost
    const aw = away.rating.hands + away.boost
    const winner = this.rng.chance(hw / (hw + aw)) ? home : away
    const team = this.teams[winner.side]
    // the puck goes back to a teammate behind the draw
    const d = team.attackDir()
    this.puck.x = dot.x
    this.puck.y = dot.y
    this.puck.vx = this.rng.range(-6, 6)
    this.puck.vy = -d * this.rng.range(10, 16) * this.rules.speed
    this.puck.lastTouch = { side: winner.side, uid: winner.uid, y: dot.y }
    this.puck.chain = [winner.uid]
    winner.cooldown.pickup = 0.3
    this.emit('faceoff-won', { side: winner.side, uid: winner.uid })
  }

  // ---------- puck ----------

  takePuck(e, silent) {
    const p = this.puck
    const prevSide = p.lastTouch ? p.lastTouch.side : null
    p.carrier = e
    p.shot = null
    p.pass = null
    p.icing = null
    p.z = 0
    p.vz = 0
    if (prevSide !== e.side) p.chain = []
    if (p.chain[p.chain.length - 1] !== e.uid) p.chain.push(e.uid)
    if (p.chain.length > 3) p.chain.shift()
    p.lastTouch = { side: e.side, uid: e.uid, y: e.y }
    e.heldSince = this.time
    e.stats.touches++
    if (!silent) this.emit('pickup', { side: e.side, uid: e.uid })
    // delayed penalty: the offending team touched the puck
    if (this.pending.some((pp) => pp.offender.side === e.side)) {
      this.whistle('penalty', this.penaltyRestart())
      return
    }
    this.reassignControllers()
  }

  loosePuck(vx, vy) {
    const p = this.puck
    if (p.carrier) {
      p.carrier.cooldown.pickup = 0.45
      p.lastTouch = { side: p.carrier.side, uid: p.carrier.uid, y: p.carrier.y }
    }
    p.carrier = null
    p.vx = vx
    p.vy = vy
  }

  netFor(side) {
    // the net a side attacks
    const y = this.teams[side].targetNetY()
    return this.nets().find((n) => n.lineY === y)
  }

  ownNetFor(side) {
    const y = this.teams[side].ownNetY()
    return this.nets().find((n) => n.lineY === y)
  }

  shoot(e, aimBias) {
    const p = this.puck
    if (p.carrier !== e || e.cooldown.shot > 0 || e.brokenStick) return
    const team = this.teams[e.side]
    const net = this.netFor(e.side)
    const d = dist(e, { x: net.cx, y: net.lineY })
    const shotR = e.rating.shot + e.boost
    let errorFt = (1 - shotR / 100) * 3.2 + d * 0.035 + (1 - this.rules.ai) * 0.6
    if (e.controller) errorFt *= 0.55
    const half = this.rules.net.width / 2
    let aimX = net.cx + (aimBias || 0) * half * 0.7 + this.rng.range(-1, 1) * (half * 0.55 + errorFt)
    const onTarget = Math.abs(aimX - net.cx) < half - 0.25
    // aim just inside the goal line
    const aimY = net.lineY - net.mouth * 1.5
    const dx = aimX - p.x
    const dy = aimY - p.y
    const len = Math.hypot(dx, dy) || 1
    const power = (55 + shotR * 0.45) * this.rules.speed
    this.loosePuck((dx / len) * power, (dy / len) * power)
    p.vz = this.rng.range(2, 8)
    p.shot = { uid: e.uid, side: e.side, power, rating: shotR, from: d, rolled: false, onTarget, human: !!e.controller }
    this.setIcingWatch(e)
    e.cooldown.shot = 0.6
    e.cooldown.pickup = 0.35
    if (onTarget) {
      e.stats.shots++
      team.shots++
    }
    this.emit('shot', { side: e.side, uid: e.uid, onTarget, distance: Math.round(d) })
  }

  pass(e, to) {
    const p = this.puck
    if (p.carrier !== e || e.cooldown.pass > 0 || !to || e.brokenStick) return
    const d = dist(e, to)
    const speed = clamp(d * 2.4 + 16, 22, (38 + (e.rating.pass + e.boost) * 0.32) * Math.sqrt(this.rules.speed))
    const t = d / speed
    // lead the receiver; worse passers miss by more
    const err = (1 - (e.rating.pass + e.boost) / 100) * 4 + (1 - this.rules.ai) * 1.5
    const tx = to.x + to.vx * t + this.rng.range(-err, err)
    const ty = to.y + to.vy * t + this.rng.range(-err, err)
    const target = this.clampToRink(tx, ty, 2)
    const dx = target.x - p.x
    const dy = target.y - p.y
    const len = Math.hypot(dx, dy) || 1
    this.loosePuck((dx / len) * speed, (dy / len) * speed)
    p.pass = { from: e.uid, to: to.uid, side: e.side }
    this.setIcingWatch(e)
    e.cooldown.pass = 0.45
    e.cooldown.pickup = 0.4
    e.stats.passes++
    this.emit('pass', { side: e.side, uid: e.uid, to: to.uid })
  }

  // clear the zone: fire it up the boards (can be icing)
  dump(e) {
    const p = this.puck
    if (p.carrier !== e) return
    const s = this.rules.surface
    const team = this.teams[e.side]
    const ty = team.targetNetY() - team.attackDir() * (this.rng.chance(0.5) ? 8 : -2)
    const tx = e.x < s.width / 2 ? s.width - 6 : 6
    const dx = tx - p.x
    const dy = ty - p.y
    const len = Math.hypot(dx, dy) || 1
    const power = (62 + e.rating.shot * 0.4) * this.rules.speed
    this.loosePuck((dx / len) * power, (dy / len) * power)
    this.setIcingWatch(e)
    e.cooldown.pickup = 0.4
    this.emit('dump', { side: e.side, uid: e.uid })
  }

  setIcingWatch(e) {
    const p = this.puck
    if (!this.rules.icing) return
    const s = this.rules.surface
    const team = this.teams[e.side]
    const ownHalf = team.attackDir() < 0 ? e.y > s.length / 2 : e.y < s.length / 2
    const shorthanded = team.strength() < this.teams[this.other(e.side)].strength()
    p.icing = ownHalf && !shorthanded ? { side: e.side } : null
  }

  // ---------- stick plays, checks, penalties ----------

  nearestOpponent(e, maxDist) {
    let best = null
    let bd = maxDist
    for (const o of this.teams[this.other(e.side)].onIceSkaters()) {
      const d = dist(e, o)
      if (d < bd && !o.fighting) {
        bd = d
        best = o
      }
    }
    return best
  }

  fromBehind(actor, target) {
    const fx = Math.cos(target.dir)
    const fy = Math.sin(target.dir)
    const dx = actor.x - target.x
    const dy = actor.y - target.y
    const d = Math.hypot(dx, dy) || 1
    return (fx * dx + fy * dy) / d < -0.5
  }

  pokeCheck(e) {
    if (e.cooldown.poke > 0 || e.brokenStick) return
    e.cooldown.poke = 0.7
    const c = this.puck.carrier
    this.emit('poke', { side: e.side, uid: e.uid })
    if (!c || c.side === e.side || dist(e, c) > 4) return
    const chance = clamp(0.32 + (e.rating.hands - c.rating.hands) * 0.004, 0.1, 0.6)
    if (this.rng.chance(chance)) {
      const dx = e.x - c.x
      const dy = e.y - c.y
      this.loosePuck(dx * 2 + this.rng.range(-6, 6), dy * 2 + this.rng.range(-6, 6))
      this.emit('poked', { side: e.side, uid: e.uid, from: c.uid })
    }
    this.judge(e, 'poke', c)
  }

  stickPlay(e, aimed) {
    if (e.cooldown.stick > 0 || e.brokenStick) return
    e.cooldown.stick = 0.9
    const target = aimed && dist(e, aimed) < 4.5 ? aimed : this.nearestOpponent(e, 4.5)
    this.emit('stick', { side: e.side, uid: e.uid, target: target ? target.uid : null })
    if (!target) return
    const onCarrier = this.puck.carrier === target
    if (onCarrier) {
      target.slow = 0.5
      if (this.rng.chance(0.5)) {
        this.loosePuck(target.vx * 0.4 + this.rng.range(-8, 8), target.vy * 0.4 + this.rng.range(-8, 8))
        this.emit('poked', { side: e.side, uid: e.uid, from: target.uid })
      }
    } else {
      target.slow = 1
    }
    this.judge(e, 'stick', target)
  }

  bodyCheck(e, aimed) {
    if (e.cooldown.check > 0) return
    e.cooldown.check = 1.1
    const target = aimed && dist(e, aimed) < 3.4 ? aimed : this.nearestOpponent(e, 3.4)
    if (!target) {
      // a lunge at nothing
      e.vx += Math.cos(e.dir) * 6
      e.vy += Math.sin(e.dir) * 6
      this.emit('whiff', { side: e.side, uid: e.uid })
      return
    }
    const onCarrier = this.puck.carrier === target
    const behind = this.fromBehind(e, target)
    const force = (0.6 + e.rating.check / 100) * 10 * this.rules.speed
    const dx = target.x - e.x
    const dy = target.y - e.y
    const d = Math.hypot(dx, dy) || 1
    target.vx += (dx / d) * force
    target.vy += (dy / d) * force
    target.stun = 0.9
    e.vx *= 0.4
    e.vy *= 0.4
    e.stats.hits++
    if (onCarrier) this.loosePuck(target.vx * 0.6 + this.rng.range(-6, 6), target.vy * 0.6 + this.rng.range(-6, 6))
    const legal = this.rules.checking && onCarrier && !behind
    this.emit('hit', { side: e.side, uid: e.uid, target: target.uid, legal, onCarrier })
    this.judge(e, 'check', target)
    if (this.rules.fights) this.maybeFight(e, target, 0.2)
    this.maybeStandsFight(e, target, 0.15)
  }

  judge(actor, action, target) {
    const verdict = judgeAction(this.rules, action, {
      onCarrier: this.puck.carrier === target || (action === 'check' && target && this.puck.lastTouch && this.puck.lastTouch.uid === target.uid && !this.puck.carrier),
      fromBehind: target ? this.fromBehind(actor, target) : false,
      rng: this.rng,
    })
    if (!verdict.infraction) return
    if (!verdict.called) {
      // the ref missed it; the parents did not
      this.emit('missed-call', { side: actor.side, uid: actor.uid, victim: target ? target.uid : null, penalty: verdict.infraction })
      return
    }
    const call = verdict.infraction
    if (this.pending.some((p) => p.offender === actor)) return
    this.pending.push({ offender: actor, type: call, victim: target ? target.uid : null, at: this.time, action })
    this.emit('delayed-penalty', { side: actor.side, uid: actor.uid, penalty: call, action, human: !!actor.controller })
    // the offender's team has the puck: blow it right away
    if (this.puck.carrier && this.puck.carrier.side === actor.side) {
      this.whistle('penalty', this.penaltyRestart())
    }
  }

  penaltyRestart() {
    const offender = this.pending[0] ? this.pending[0].offender.side : 'home'
    // the offending team restarts in its own end on full ice; on small ice the
    // other team gets the puck
    if (this.rules.faceoffs) {
      const dot = this.zoneDots(offender, 'defensive')
      return { type: 'faceoff', x: dot.x, y: dot.y }
    }
    return { type: 'restart', side: this.other(offender) }
  }

  assessPending() {
    if (this.pending.length === 0) return
    for (const p of this.pending) {
      const pen = PENALTIES[p.type]
      const e = p.offender
      const team = this.teams[e.side]
      e.stats.pim += pen.minutes
      if (pen.ejection) {
        this.eject(e)
      } else {
        e.inBox = true
        e.onIce = false
        team.box.push({ uid: e.uid, type: p.type, remaining: this.rules.minorSeconds })
      }
      this.emit('penalty', {
        side: e.side,
        uid: e.uid,
        number: e.player.number,
        name: e.player.name,
        penalty: p.type,
        label: pen.label,
        signal: pen.signal,
        explain: pen.explain,
        minutes: pen.minutes,
      })
      this.maybeStandsFight(e, p.victim ? this.findEntity(p.victim) : null, 0.25)
    }
    this.pending = []
    for (const side of ['home', 'away']) this.teams[side].fillToStrength()
  }

  eject(e) {
    e.ejected = true
    e.onIce = false
    e.fighting = false
    if (this.puck.carrier === e) this.loosePuck(0, 0)
    this.emit('ejection', { side: e.side, uid: e.uid, number: e.player.number, name: e.player.name })
  }

  // AAA & Beer League
  maybeFight(a, b, chance) {
    if (!this.rules.fights || this.fight) return
    if (!this.rng.chance(chance)) return
    if (!a || !b) {
      // pick the closest opposing pair
      let best = null
      for (const x of this.teams.home.onIceSkaters()) {
        for (const y of this.teams.away.onIceSkaters()) {
          const d = dist(x, y)
          if (!best || d < best.d) best = { a: x, b: y, d }
        }
      }
      if (!best || best.d > 14) return
      a = best.a
      b = best.b
    }
    if (a.isGoalie || b.isGoalie) return
    this.fight = { a, b }
    a.fighting = true
    b.fighting = true
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    a.x = mx - 1.4
    b.x = mx + 1.4
    a.y = my
    b.y = my
    a.vx = a.vy = b.vx = b.vy = 0
    if (this.puck.carrier === a || this.puck.carrier === b) this.loosePuck(0, 0)
    if (this.phase === 'play') {
      this.emit('whistle', { reason: 'fight' })
      this.puck.shot = null
      this.puck.pass = null
    }
    this.phase = 'fight'
    this.phaseTimer = 3.2
    this.nextRestart = { type: 'faceoff', x: this.centerDot().x, y: this.centerDot().y }
    this.emit('fight', { a: a.uid, b: b.uid, home: a.side === 'home' ? a.uid : b.uid })
  }

  endFight() {
    const { a, b } = this.fight
    this.fight = null
    for (const e of [a, b]) {
      e.stats.pim += 5
      this.emit('penalty', {
        side: e.side,
        uid: e.uid,
        number: e.player.number,
        name: e.player.name,
        penalty: 'fighting',
        label: PENALTIES.fighting.label,
        signal: PENALTIES.fighting.signal,
        explain: PENALTIES.fighting.explain,
        minutes: 0,
      })
      this.eject(e)
    }
    // can both teams still dress a team?
    const short = ['home', 'away'].filter((s) => this.teams[s].skaters().length < 2)
    if (short.length > 0) {
      this.endGame(short.length === 2 ? 'called-both' : 'called', short.length === 1 ? this.other(short[0]) : null)
      return
    }
    for (const side of ['home', 'away']) this.teams[side].fillToStrength()
    this.doRestart()
  }

  // parents in the stands react to what their kids do on the ice
  maybeStandsFight(a, b, chance) {
    if (!a || !b) return
    if (this.rng.chance(Math.min(0.9, chance * this.crowd.fightRate))) {
      this.emit('stands-fight', { a: a.uid, b: b.uid })
      this.crowd.mood -= 0.03
    }
  }

  // the one broken stick of the game: whoever has the puck, or whoever is closest
  breakStick() {
    const p = this.puck
    let e = p.carrier && !p.carrier.isGoalie ? p.carrier : null
    if (!e) {
      const near = this.allOnIce()
        .filter((x) => !x.isGoalie)
        .sort((a, b) => dist(a, p) - dist(b, p))
      e = near[0]
    }
    if (!e) return
    this.stickBroken = true
    const team = this.teams[e.side]
    if (team.equipment && team.equipment.unbreakable) {
      this.emit('stick-held', { side: e.side, uid: e.uid })
      return
    }
    e.brokenStick = true
    if (p.carrier === e) this.loosePuck(e.vx * 0.3 + this.rng.range(-5, 5), e.vy * 0.3 + this.rng.range(-5, 5))
    this.emit('stick-break', { side: e.side, uid: e.uid, number: e.player.number, name: e.player.name, x: e.x, y: e.y, exposure: e.exposure })
  }

  // ---------- controllers ----------

  reassignControllers() {
    for (const id of Object.keys(this.controllers)) {
      const side = this.controllers[id]
      const team = this.teams[side]
      const current = this.control[id]
      const carrier = this.puck.carrier
      const taken = Object.keys(this.control)
        .filter((k) => k !== id)
        .map((k) => this.control[k])
      // control the carrier when our team has it
      if (carrier && carrier.side === side && !taken.includes(carrier)) {
        this.setControl(id, carrier)
        continue
      }
      if (current && current.onIce && !current.ejected) continue
      this.switchPlayer(id)
    }
  }

  setControl(id, e) {
    const prev = this.control[id]
    if (prev === e) return
    if (prev) prev.controller = null
    // another human had this skater: swap
    for (const k of Object.keys(this.control)) {
      if (this.control[k] === e) this.control[k] = null
    }
    this.control[id] = e
    e.controller = id
  }

  switchPlayer(id) {
    const side = this.controllers[id]
    const team = this.teams[side]
    const taken = Object.keys(this.control)
      .filter((k) => k !== id)
      .map((k) => this.control[k])
    const p = this.puck
    let best = null
    let bd = Infinity
    for (const e of team.onIceSkaters()) {
      if (taken.includes(e) || e === this.control[id]) continue
      const d = dist(e, p)
      if (d < bd) {
        bd = d
        best = e
      }
    }
    if (!best) best = team.onIceSkaters().find((e) => !taken.includes(e))
    if (best) this.setControl(id, best)
  }

  // ---------- main loop ----------

  step(dt, inputs) {
    if (this.phase === 'intermission' || this.phase === 'final') return
    this.time += dt
    this.phaseTimer -= dt
    if (this.phase === 'faceoff') {
      this.updateMovement(dt, inputs, true)
      if (this.phaseTimer <= 0) {
        if (this.puck.carrier) this.phase = 'play'
        else this.dropPuck()
      }
      return
    }
    if (this.phase === 'whistle' || this.phase === 'goal') {
      this.updateMovement(dt, inputs, true)
      this.updatePuck(dt, true)
      if (this.phaseTimer <= 0) this.doRestart()
      return
    }
    if (this.phase === 'fight') {
      if (this.phaseTimer <= 0) this.endFight()
      return
    }
    // play
    this.clock -= dt
    this.playTime += dt
    if (!this.stickBroken && this.playTime >= this.stickBreakAt) this.breakStick()
    this.updateBox(dt)
    if (this.rules.buzzer) {
      this.buzzerTimer -= dt
      if (this.buzzerTimer <= 0) {
        this.buzzerTimer = this.rules.buzzer
        this.emit('buzzer')
        this.teams.home.changeLine(true)
        this.teams.away.changeLine(true)
      }
    }
    for (const side of ['home', 'away']) this.teams[side].lineTime += dt
    this.handleInputs(inputs)
    this.updateMovement(dt, inputs, false)
    this.updatePuck(dt, false)
    // delayed penalties do not wait forever
    if (this.pending.length && this.time - this.pending[0].at > 6) {
      this.whistle('penalty', this.penaltyRestart())
    }
    if (this.clock <= 0 && this.phase === 'play') this.endPeriod()
  }

  updateBox(dt) {
    for (const side of ['home', 'away']) {
      const team = this.teams[side]
      let changed = false
      team.box = team.box.filter((b) => {
        b.remaining -= dt
        if (b.remaining <= 0) {
          const e = this.findEntity(b.uid)
          if (e) e.inBox = false
          changed = true
          this.emit('penalty-over', { side, uid: b.uid })
          return false
        }
        return true
      })
      if (changed) team.fillToStrength()
    }
  }

  handleInputs(inputs) {
    if (!inputs) return
    for (const id of Object.keys(this.controllers)) {
      const input = inputs[id]
      let e = this.control[id]
      if (!input) continue
      if (!e || !e.onIce) {
        this.switchPlayer(id)
        e = this.control[id]
        if (!e) continue
      }
      if (e.stun > 0 || e.fighting) continue
      const hasPuck = this.puck.carrier === e
      if (hasPuck) {
        if (input.shoot) this.shoot(e, input.x)
        else if (input.pass) this.pass(e, this.pickPassTarget(e, input))
        if (input.stick) this.stickPlay(e)
      } else {
        const ourPuck = this.puck.carrier && this.puck.carrier.side === e.side
        if (input.pass && !ourPuck) this.switchPlayer(id)
        if (input.shoot) this.pokeCheck(e)
        if (input.check) this.bodyCheck(e)
        if (input.stick) this.stickPlay(e)
      }
    }
  }

  // human pass: the teammate closest to where the stick is pointing
  pickPassTarget(e, input) {
    const team = this.teams[e.side]
    let ax = input.x
    let ay = input.y
    if (!ax && !ay) {
      ax = 0
      ay = team.attackDir()
    }
    const al = Math.hypot(ax, ay) || 1
    let best = null
    let bs = -Infinity
    for (const o of team.onIceSkaters()) {
      if (o === e) continue
      const dx = o.x - e.x
      const dy = o.y - e.y
      const d = Math.hypot(dx, dy) || 1
      const dot = (dx * ax + dy * ay) / (d * al)
      const score = dot * 2 - d / 40
      if (score > bs) {
        bs = score
        best = o
      }
    }
    return best
  }

  maxSpeed(e) {
    const base = (17 + (e.rating.speed + e.boost) * 0.13) * this.rules.speed
    let m = 0.62 + 0.38 * e.stamina
    if (this.puck.carrier === e) m *= 0.92
    if (e.slow > 0) m *= 0.55
    return base * m
  }

  updateMovement(dt, inputs, frozen) {
    const all = this.allOnIce()
    for (const e of all) {
      for (const k of Object.keys(e.cooldown)) e.cooldown[k] = Math.max(0, e.cooldown[k] - dt)
      e.stun = Math.max(0, e.stun - dt)
      e.slow = Math.max(0, e.slow - dt)
      let tx = 0
      let ty = 0
      let speedCap = this.maxSpeed(e)
      if (e.fighting) continue
      if (frozen && this.phase === 'faceoff') {
        // hold your spot, face the dot
        e.vx = 0
        e.vy = 0
        continue
      }
      if (e.stun > 0) {
        // knocked down: slide
        e.vx *= Math.exp(-3 * dt)
        e.vy *= Math.exp(-3 * dt)
      } else {
        let desired
        if (e.isGoalie) {
          desired = aiGoalie(this, e)
          speedCap = 14 * Math.sqrt(this.rules.speed)
        } else if (e.controller && inputs && inputs[e.controller] && !frozen) {
          const input = inputs[e.controller]
          desired = { vx: input.x * speedCap, vy: input.y * speedCap }
        } else if (frozen) {
          desired = { vx: e.vx * 0.5, vy: e.vy * 0.5 }
        } else {
          desired = aiSkater(this, e, dt)
        }
        tx = desired.vx
        ty = desired.vy
        const tl = Math.hypot(tx, ty)
        if (tl > speedCap) {
          tx = (tx / tl) * speedCap
          ty = (ty / tl) * speedCap
        }
        const accel = e.isGoalie ? 10 : 3.2
        const k = 1 - Math.exp(-accel * dt)
        e.vx += (tx - e.vx) * k
        e.vy += (ty - e.vy) * k
      }
      e.x += e.vx * dt
      e.y += e.vy * dt
      const sp = Math.hypot(e.vx, e.vy)
      if (sp > 1.2 && e.stun <= 0) e.dir = Math.atan2(e.vy, e.vx)
      else if (e.controller && inputs && inputs[e.controller]) {
        const input = inputs[e.controller]
        if (input.x || input.y) e.dir = Math.atan2(input.y, input.x)
      }
      if (!frozen && !e.isGoalie) {
        e.stats.toi += dt
        const work = sp / Math.max(1, speedCap)
        const drain = (0.008 + 0.02 * work) * (e.doubleShift ? 1.7 : 1) * (1.15 - e.rating.stamina / 200)
        e.stamina = clamp(e.stamina - drain * dt, 0.15, 1)
      }
      const pos = this.clampToRink(e.x, e.y, SKATER_RADIUS)
      if (pos.hit) {
        e.x = pos.x
        e.y = pos.y
        if (pos.nx) e.vx *= -0.2
        if (pos.ny) e.vy *= -0.2
      }
      this.collideNets(e, SKATER_RADIUS)
    }
    // bench rest
    for (const side of ['home', 'away']) {
      for (const e of this.teams[side].entities) {
        if (!e.onIce && !e.isGoalie) e.stamina = clamp(e.stamina + 0.06 * dt, 0, 1)
      }
    }
    // skaters push apart
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const a = all[i]
        const b = all[j]
        if (a.fighting || b.fighting) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        const min = SKATER_RADIUS * 2
        if (d > 0 && d < min) {
          const push = (min - d) / 2
          a.x -= (dx / d) * push
          a.y -= (dy / d) * push
          b.x += (dx / d) * push
          b.y += (dy / d) * push
        }
      }
    }
    // the carrier may have shot or passed during the loop: use who has it now
    const holder = this.puck.carrier
    if (holder && holder.onIce) {
      const carrier = holder
      const p = this.puck
      p.x = carrier.x + Math.cos(carrier.dir) * 1.7
      p.y = carrier.y + Math.sin(carrier.dir) * 1.7
      const pos = this.clampToRink(p.x, p.y, 0.4)
      p.x = pos.x
      p.y = pos.y
      p.vx = carrier.vx
      p.vy = carrier.vy
      carrier.stats.possession += dt
    }
  }

  collideNets(e, r) {
    for (const n of this.nets()) {
      if (e.x > n.x0 - r && e.x < n.x1 + r && e.y > n.y0 - r && e.y < n.y1 + r) {
        // push out the shortest way
        const opts = [
          { d: e.x - (n.x0 - r), ax: 'x', v: n.x0 - r },
          { d: n.x1 + r - e.x, ax: 'x', v: n.x1 + r },
          { d: e.y - (n.y0 - r), ax: 'y', v: n.y0 - r },
          { d: n.y1 + r - e.y, ax: 'y', v: n.y1 + r },
        ].sort((a, b) => a.d - b.d)
        const o = opts[0]
        e[o.ax] = o.v
        if (o.ax === 'x') e.vx *= -0.2
        else e.vy *= -0.2
      }
    }
  }

  updatePuck(dt, dead) {
    const p = this.puck
    if (p.carrier) {
      p.prevY = p.y
      return
    }
    const prevX = p.x
    const prevY = p.y
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.z = Math.max(0, p.z + p.vz * dt)
    p.vz = p.z > 0 ? p.vz - 30 * dt : 0
    // ice friction
    const sp = Math.hypot(p.vx, p.vy)
    if (sp > 0) {
      const ns = Math.max(0, sp * Math.exp(-0.22 * dt) - 3 * dt)
      p.vx = (p.vx / sp) * ns
      p.vy = (p.vy / sp) * ns
    }
    // boards
    const pos = this.clampToRink(p.x, p.y, 0.3)
    if (pos.hit) {
      p.x = pos.x
      p.y = pos.y
      const n = Math.hypot(pos.nx, pos.ny) || 1
      const nx = pos.nx / n
      const ny = pos.ny / n
      const vn = p.vx * nx + p.vy * ny
      if (vn < 0) {
        p.vx -= 1.55 * vn * nx
        p.vy -= 1.55 * vn * ny
        p.vx *= 0.85
        p.vy *= 0.85
        if (Math.abs(vn) > 14) this.emit('boards', { speed: Math.abs(vn) })
      }
    }
    if (dead) {
      p.prevY = p.y
      return
    }
    // nets: goals, posts and the back of the net
    for (const net of this.nets()) {
      const crossed = net.mouth > 0 ? prevY > net.lineY && p.y <= net.lineY : prevY < net.lineY && p.y >= net.lineY
      const tFrac = crossed ? (prevY - net.lineY) / (prevY - p.y || 1) : 0
      const crossX = prevX + (p.x - prevX) * tFrac
      if (crossed && crossX > net.x0 && crossX < net.x1 && p.z < 4) {
        this.goal(net)
        return
      }
      if (p.x > net.x0 - 0.3 && p.x < net.x1 + 0.3 && p.y > net.y0 && p.y < net.y1) {
        // hit the frame or the back: bounce out
        const fromFront = net.mouth > 0 ? prevY >= net.lineY : prevY <= net.lineY
        if (fromFront) {
          p.y = net.lineY + net.mouth * 0.4
          p.vy = -p.vy * 0.5
        } else if (prevX <= net.x0 - 0.3 || prevX >= net.x1 + 0.3) {
          p.x = prevX
          p.vx = -p.vx * 0.5
        } else {
          p.y = prevY
          p.vy = -p.vy * 0.5
        }
        if (p.shot) this.emit('post', { side: p.shot.side })
      }
    }
    this.checkBlock(prevX, prevY)
    this.checkGoalie(dt)
    this.checkPickup()
    this.checkOffside(prevY)
    this.checkIcing(prevY)
    p.prevY = p.y
  }

  // a skater in the lane can block a shot (once per skater per shot)
  checkBlock(prevX, prevY) {
    const p = this.puck
    const s = p.shot
    if (!s || p.carrier || s.blocked) return
    if (!s.tried) s.tried = []
    for (const e of this.teams[this.other(s.side)].onIceSkaters()) {
      if (e.stun > 0 || s.tried.includes(e.uid)) continue
      // distance from the skater to the puck's path this frame
      const ax = prevX
      const ay = prevY
      const bx = p.x - ax
      const by = p.y - ay
      const l2 = bx * bx + by * by || 1
      const t = clamp(((e.x - ax) * bx + (e.y - ay) * by) / l2, 0, 1)
      if (Math.hypot(e.x - (ax + bx * t), e.y - (ay + by * t)) > 1.6) continue
      s.tried.push(e.uid)
      // pond hockey lives and dies on blocked shots
      const chance = (this.rules.goalies ? 0.3 : 0.55) + (e.rating.position || 50) / 500
      if (this.rng.chance(chance)) {
        s.blocked = true
        p.vx = p.vx * -0.25 + this.rng.range(-6, 6)
        p.vy = p.vy * -0.25 + this.rng.range(-6, 6)
        p.shot = null
        p.lastTouch = { side: e.side, uid: e.uid, y: e.y }
        this.emit('block', { side: e.side, uid: e.uid })
        return
      }
    }
  }

  checkGoalie() {
    const p = this.puck
    if (p.carrier) return
    const tiny = this.modifiers.includes('tiny-goalies')
    for (const side of ['home', 'away']) {
      const net = this.ownNetFor(side)
      let g = this.teams[side].goalie
      let byCommittee = false
      if (!g || !g.onIce) {
        // no goalie (the pond): whoever is standing in the net mouth tries
        const mouth = { x: net.cx, y: net.lineY + net.mouth * 2 }
        g = this.teams[side]
          .onIceSkaters()
          .filter((x) => x.stun <= 0 && dist(x, mouth) < 5)
          .sort((a, b) => dist(a, mouth) - dist(b, mouth))[0]
        if (!g) continue
        byCommittee = true
      }
      const reach = byCommittee ? 1.6 : (1.8 + g.rating.reflex / 70) * (tiny ? 0.55 : 1)
      const d = dist(g, p)
      if (d > reach) continue
      const toward = (net.lineY - p.y) * p.vy > 0
      const fast = Math.hypot(p.vx, p.vy) > 18
      if (p.shot && p.shot.side !== side && !p.shot.rolled && toward) {
        p.shot.rolled = true
        const s = p.shot
        let pSave = this.rules.saveBase + (g.rating.reflex + g.rating.position - 120) * 0.0035 - (s.rating - 60) * 0.0028 + s.from * 0.004
        if (!s.onTarget) pSave += 0.25
        // a person picked the spot; the CPU guessed
        if (s.human) pSave -= 0.12
        if (tiny) pSave -= 0.15
        if (byCommittee) pSave = clamp(0.3 + (g.rating.position || 50) / 400, 0.2, 0.6)
        pSave = clamp(pSave, 0.28, 0.95)
        if (this.rng.chance(pSave)) {
          this.save(g, s)
        } else {
          // it gets by: let it go through
          s.beat = true
        }
        return
      }
      if (p.shot && p.shot.beat) continue
      if (byCommittee) continue
      // loose puck in the crease: the goalie covers it or plays it, but not
      // the pass it just made
      if (!fast && d < reach && g.cooldown.pickup <= 0) {
        this.goalieTakes(g)
        return
      }
    }
  }

  save(g, s) {
    const p = this.puck
    g.stats.touches++
    this.emit('save', { side: g.side, uid: g.uid, shooter: s.uid })
    p.shot = null
    p.icing = null
    const team = this.teams[g.side]
    if (g.isGoalie && this.rng.chance(this.rules.faceoffs ? 0.4 : 0.35)) {
      this.goalieTakes(g)
      return
    }
    // rebound
    const out = team.attackDir()
    p.vx = this.rng.range(-14, 14) * this.rules.speed
    p.vy = out * this.rng.range(6, 14) * this.rules.speed
    p.lastTouch = { side: g.side, uid: g.uid, y: g.y }
  }

  goalieTakes(g) {
    const p = this.puck
    p.shot = null
    p.icing = null
    p.lastTouch = { side: g.side, uid: g.uid, y: g.y }
    if (this.rules.faceoffs) {
      p.vx = 0
      p.vy = 0
      const dot = this.zoneDots(g.side, 'defensive')
      this.emit('freeze', { side: g.side, uid: g.uid })
      this.whistle('freeze', { type: 'faceoff', x: dot.x, y: dot.y })
      return
    }
    // small ice: the goalie plays it out to a teammate
    const team = this.teams[g.side]
    const mates = team.onIceSkaters()
    if (mates.length === 0) return
    const to = mates.reduce((a, b) => (dist(a, g) < dist(b, g) ? a : b))
    const dx = to.x - p.x
    const dy = to.y - p.y
    const len = Math.hypot(dx, dy) || 1
    const sp = 22 * Math.sqrt(this.rules.speed)
    p.x = g.x + (dx / len) * 2.5
    p.y = g.y + (dy / len) * 2.5
    p.vx = (dx / len) * sp
    p.vy = (dy / len) * sp
    p.pass = { from: g.uid, to: to.uid, side: g.side }
    g.cooldown.pickup = 1.2
    this.emit('goalie-pass', { side: g.side })
  }

  checkPickup() {
    const p = this.puck
    if (p.carrier || p.z > 1.5) return
    let best = null
    let bd = Infinity
    for (const e of this.allOnIce()) {
      if (e.isGoalie || e.stun > 0 || e.fighting || e.cooldown.pickup > 0 || e.brokenStick) continue
      const intended = p.pass && p.pass.to === e.uid
      const reach = PUCK_REACH + e.rating.hands / 120 + (intended ? 1 : 0)
      const d = dist(e, p)
      if (d > reach) continue
      // a hard shot is not easy to stop
      const rel = Math.hypot(p.vx - e.vx, p.vy - e.vy)
      const handle = intended ? 85 : 55
      if (rel > handle * Math.max(0.6, this.rules.speed)) continue
      if (d < bd) {
        bd = d
        best = e
      }
    }
    if (best) this.takePuck(best)
  }

  // offside: an attacker is already in the zone when the puck crosses the blue line
  checkOffside(prevY) {
    if (!this.rules.offsides) return
    const p = this.puck
    if (!p.lastTouch) return
    const s = this.rules.surface
    const side = p.lastTouch.side
    const team = this.teams[side]
    const d = team.attackDir()
    const line = d < 0 ? s.blueLines : s.length - s.blueLines
    const entered = d < 0 ? prevY >= line && p.y < line : prevY <= line && p.y > line
    if (!entered) return
    const offside = team.onIceSkaters().find((e) => (d < 0 ? e.y < line - 1 : e.y > line + 1))
    if (!offside) return
    const dot = { x: p.x < s.width / 2 ? s.width / 2 - 22 : s.width / 2 + 22, y: line - d * 5 }
    this.emit('offside', { side, uid: offside.uid })
    this.whistle('offside', { type: 'faceoff', x: dot.x, y: dot.y }, { side })
  }

  checkIcing(prevY) {
    const p = this.puck
    if (!p.icing || p.carrier) return
    const side = p.icing.side
    const team = this.teams[side]
    const goalY = team.targetNetY()
    const d = team.attackDir()
    const crossed = d < 0 ? prevY > goalY && p.y <= goalY : prevY < goalY && p.y >= goalY
    if (!crossed) return
    p.icing = null
    const dot = this.zoneDots(side, 'defensive')
    this.emit('icing', { side })
    this.whistle('icing', { type: 'faceoff', x: dot.x, y: dot.y }, { side })
  }

  goal(net) {
    const p = this.puck
    const side = this.attackerOfNet(net)
    const team = this.teams[side]
    const opp = this.teams[this.other(side)]
    team.score++
    // credit: the last skater on the scoring team to touch it, plus up to two assists
    const chain = p.chain.slice()
    const scorerUid = p.lastTouch && p.lastTouch.side === side ? p.lastTouch.uid : null
    const scorer = scorerUid ? this.findEntity(scorerUid) : null
    const assists = []
    if (scorer && p.lastTouch.side === side) {
      for (let i = chain.length - 2; i >= 0 && assists.length < 2; i--) {
        const a = this.findEntity(chain[i])
        if (a && a.side === side && a !== scorer && !assists.includes(a)) assists.push(a)
      }
    }
    if (scorer) scorer.stats.goals++
    assists.forEach((a) => a.stats.assists++)
    const ppg = team.strength() > opp.strength()
    if (ppg) {
      // a power play goal ends the first minor
      const idx = opp.box.findIndex((b) => !PENALTIES[b.type].ejection)
      if (idx >= 0) {
        const b = opp.box.splice(idx, 1)[0]
        const e = this.findEntity(b.uid)
        if (e) e.inBox = false
        this.emit('penalty-over', { side: opp.side, uid: b.uid })
      }
    }
    // the other team scored during a delayed penalty: the minor is wiped out
    this.pending = this.pending.filter((pp) => pp.offender.side === side)
    const exposure = scorer ? scorer.exposure : 0
    this.emit('goal', {
      side,
      scorer: scorer ? scorer.uid : null,
      scorerName: scorer ? scorer.player.name : 'Own goal',
      scorerNumber: scorer ? scorer.player.number : null,
      assists: assists.map((a) => a.uid),
      ppg,
      keepScore: this.rules.keepScore,
      viral: scorer ? this.rng.chance(0.25 + exposure / 200) : false,
      home: this.teams.home.score,
      away: this.teams.away.score,
    })
    if (scorer) {
      if (opp.goalie && opp.goalie.onIce) this.maybeStandsFight(scorer, opp.goalie, 0.06)
    }
    this.phase = 'goal'
    this.phaseTimer = 2.6
    p.carrier = null
    p.shot = null
    p.pass = null
    p.icing = null
    p.vx *= 0.2
    p.vy *= 0.2
    this.nextRestart = this.rules.faceoffs
      ? { type: 'faceoff', x: this.centerDot().x, y: this.centerDot().y }
      : { type: 'restart', side: opp.side }
    // sudden death
    if (this.period > this.rules.periods) this.endGame('overtime', side)
  }

  // ---------- periods ----------

  endPeriod() {
    this.emit('period-end', { period: this.period })
    this.pending = []
    const tied = this.teams.home.score === this.teams.away.score
    if (this.period < this.rules.periods) {
      this.beginIntermission()
      return
    }
    if (this.period === this.rules.periods && this.rules.needWinner && tied) {
      this.period++
      this.clock = this.rules.periodSeconds
      this.emit('overtime')
      this.startFaceoff(this.centerDot())
      return
    }
    if (this.period > this.rules.periods && tied) {
      // shootout, settled by the shooters and the goalies
      const homeR = this.teams.home.skaters().reduce((s, e) => s + e.rating.shot, 0) / this.teams.home.skaters().length
      const awayR = this.teams.away.skaters().reduce((s, e) => s + e.rating.shot, 0) / this.teams.away.skaters().length
      const gr = (t) => (t.goalie && t.goalie.onIce ? t.goalie.rating.reflex : 40)
      const homeWins = this.rng.chance(clamp(0.5 + (homeR - gr(this.teams.away) - (awayR - gr(this.teams.home))) * 0.01, 0.2, 0.8))
      this.emit('shootout', { winner: homeWins ? 'home' : 'away' })
      this.endGame('shootout', homeWins ? 'home' : 'away')
      return
    }
    this.endGame('final', null)
  }

  beginIntermission() {
    this.phase = 'intermission'
    const side = this.opts.focusSide || 'home'
    const team = this.teams[side]
    if (!this.rules.crowd) {
      // nobody came to the pond or the street, so nobody makes it weird
      this.intermission = {
        id: 'quiet',
        side,
        subject: null,
        title: 'Hot chocolate break',
        body: 'Nobody came to watch. No refs, no scoreboard operator, no parents. Everyone is having a great time.',
        choices: ['Back out there'],
      }
      this.emit('intermission', Object.assign({}, this.intermission))
      if (this.opts.autoIntermission) this.chooseIntermission(0)
      return
    }
    const ev = this.rng.weighted(INTERMISSION_EVENTS)
    const subject = ev.subject(team) || null
    this.intermission = {
      id: ev.id,
      side,
      subject: subject ? subject.uid : null,
      title: ev.title,
      body: ev.body(subject),
      choices: ev.choices.map((c) => c.label),
    }
    this.emit('intermission', Object.assign({}, this.intermission))
    if (this.opts.autoIntermission) this.chooseIntermission(this.rng.int(0, ev.choices.length - 1))
  }

  chooseIntermission(index) {
    if (!this.intermission) return null
    const ev = INTERMISSION_EVENTS.find((x) => x.id === this.intermission.id)
    const team = this.teams[this.intermission.side]
    const subject = this.intermission.subject ? this.findEntity(this.intermission.subject) : null
    // the quiet break has nothing to choose
    const choice = ev
      ? ev.choices[clamp(index, 0, ev.choices.length - 1)]
      : { label: 'Back out there', result: () => 'Back out there.', apply: () => {} }
    choice.apply(this, team, subject)
    this.crowd.mood = clamp(this.crowd.mood, 0, 1)
    team.chemistry = clamp(team.chemistry, -0.3, 0.5)
    const result = choice.result(subject)
    this.emit('intermission-choice', { id: this.intermission.id, choice: choice.label, result })
    this.intermission = null
    this.period++
    this.clock = this.rules.periodSeconds
    this.buzzerTimer = this.rules.buzzer
    for (const side of ['home', 'away']) {
      this.teams[side].changeLine(false)
      this.teams[side].entities.forEach((e) => {
        if (!e.onIce) e.stamina = clamp(e.stamina + 0.4, 0, 1)
      })
    }
    this.emit('period-start', { period: this.period })
    this.startFaceoff(this.centerDot())
    return result
  }

  endGame(reason, winner) {
    const h = this.teams.home.score
    const a = this.teams.away.score
    let w = winner
    if (!w && h !== a) w = h > a ? 'home' : 'away'
    this.phase = 'final'
    this.result = { reason, winner: w || null, home: h, away: a, keepScore: this.rules.keepScore }
    this.emit('final', Object.assign({}, this.result))
  }

  // ---------- views ----------

  snapshot() {
    const p = this.puck
    const ents = this.allOnIce().map((e) => ({
      uid: e.uid,
      side: e.side,
      number: e.player.number,
      skin: e.player.skin,
      hand: e.player.hand,
      x: e.x,
      y: e.y,
      vx: e.vx,
      vy: e.vy,
      dir: e.dir,
      goalie: e.isGoalie,
      stun: e.stun > 0,
      fighting: e.fighting,
      puck: p.carrier === e,
      controller: e.controller,
      exposure: e.exposure,
      role: e.role || null,
      brokenStick: !!e.brokenStick,
      guest: e.guest || null,
      look: e.look || null,
    }))
    return {
      t: this.time,
      phase: this.phase,
      period: this.period,
      clock: Math.max(0, this.clock),
      surface: this.rules.surface.id,
      skaters: ents,
      puck: { x: p.x, y: p.y, z: p.z, uid: p.carrier ? p.carrier.uid : null },
      score: { home: this.teams.home.score, away: this.teams.away.score },
      strength: { home: this.teams.home.strength(), away: this.teams.away.strength() },
      box: {
        home: this.teams.home.box.map((b) => ({ uid: b.uid, remaining: b.remaining })),
        away: this.teams.away.box.map((b) => ({ uid: b.uid, remaining: b.remaining })),
      },
      delayed: this.pending.length ? this.pending[0].offender.side : null,
      dir: { home: this.teams.home.attackDir(), away: this.teams.away.attackDir() },
      modifiers: this.modifiers,
      venue: this.rules.venue,
    }
  }

  // game clock in game minutes, mm:ss
  clockLabel() {
    const gameSeconds = Math.max(0, (this.clock / this.rules.periodSeconds) * this.rules.periodMinutes * 60)
    const m = Math.floor(gameSeconds / 60)
    const s = Math.floor(gameSeconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }
}

/**
 * Play a whole CPU vs CPU game headless. Used by the simulation harness and
 * to settle the other games in a tournament.
 */
export const simulateGame = (opts, onStep) => {
  const game = new Game(Object.assign({ autoIntermission: true }, opts))
  const dt = 1 / 60
  let guard = 0
  const events = []
  const maxSteps = 60 * 60 * 60
  while (game.phase !== 'final' && guard < maxSteps) {
    game.step(dt, null)
    const ev = game.drainEvents()
    for (const e of ev) events.push(e)
    if (onStep) onStep(game, ev)
    guard++
  }
  return { game, events, result: game.result, steps: guard }
}
