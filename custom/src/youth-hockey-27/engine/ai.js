/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// CPU skaters and goalies. Each skater returns the velocity it wants and,
// at its own decision rate, may shoot, pass, poke, hook or hit.
//
// The social ratings matter here:
// - exposure (parental influence, showcases, bribes) makes a carrier pass less
// - coachability keeps players in position and onside; low coachability
//   chases the puck (the 8U beehive) and takes more stick penalties

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

// arrive at a point: full speed far away, easing in close
const toward = (e, tx, ty, gain) => {
  const dx = tx - e.x
  const dy = ty - e.y
  return { vx: dx * (gain || 2.4), vy: dy * (gain || 2.4) }
}

const front = (net, k) => ({ x: net.cx, y: net.lineY + net.mouth * k })

// shortest distance from point to the segment a-b
const segDist = (p, a, b) => {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const l2 = abx * abx + aby * aby || 1
  const t = clamp(((p.x - a.x) * abx + (p.y - a.y) * aby) / l2, 0, 1)
  return Math.hypot(p.x - (a.x + abx * t), p.y - (a.y + aby * t))
}

export const aiGoalie = (game, g) => {
  const s = game.rules.surface
  const p = game.puck
  const net = game.ownNetFor(g.side)
  const cx = net.cx
  const dx = p.x - cx
  const dy = p.y - net.lineY
  const d = Math.hypot(dx, dy) || 1
  const depth = clamp(1.4 + (g.rating.position / 100) * 2.4, 1.4, 4)
  let tx = cx + (dx / d) * depth
  let ty = net.lineY + (dy / d) * depth
  if ((ty - net.lineY) * net.mouth < 0.8) ty = net.lineY + net.mouth * 0.8
  tx = clamp(tx, net.x0 - 1.5, net.x1 + 1.5)
  if (s.width < 0) return { vx: 0, vy: 0 }
  return toward(g, tx, ty, 7)
}

const inZone = (game, team, y) => {
  const s = game.rules.surface
  const d = team.attackDir()
  const line = d < 0 ? s.blueLines : s.length - s.blueLines
  return d < 0 ? y < line : y > line
}

// keep a target onside when the puck is not in the zone yet
const holdOnside = (game, team, e, target) => {
  if (!game.rules.offsides || !e.discipline) return target
  const p = game.puck
  if (inZone(game, team, p.y)) return target
  const s = game.rules.surface
  const d = team.attackDir()
  const line = d < 0 ? s.blueLines : s.length - s.blueLines
  if (inZone(game, team, target.y)) target.y = line - d * 2
  return target
}

// anywhere on the ice, corners and behind the nets included
const clampTarget = (game, t) => game.clampToRink(t.x, t.y, 1.5)

const pickPass = (game, e, team, net) => {
  const opp = game.teams[game.other(e.side)]
  const opps = opp.onIceSkaters()
  let best = null
  let bs = 0.25
  const eNet = dist(e, front(net, 4))
  for (const m of team.onIceSkaters()) {
    if (m === e || m.stun > 0) continue
    const open = Math.min(15, Math.min(...opps.map((o) => dist(o, m)).concat([15])))
    const lane = Math.min(...opps.map((o) => segDist(o, e, m)).concat([10]))
    const progress = (eNet - dist(m, front(net, 4))) / 30
    const d = dist(e, m)
    let score = open / 15 + progress + (lane < 2.5 ? -0.8 : 0) - (d > 60 ? 0.4 : 0) + team.chemistry
    // over the offside line before the puck: no
    if (game.rules.offsides && inZone(game, team, m.y) && !inZone(game, team, e.y)) score -= 1
    if (score > bs) {
      bs = score
      best = m
    }
  }
  return best
}

const carrierAI = (game, e, team, decide) => {
  const rng = game.rng
  const net = game.netFor(e.side)
  const opp = game.teams[game.other(e.side)]
  const opps = opp.onIceSkaters()
  const coach = e.rating.coachability
  const toNet = dist(e, { x: net.cx, y: net.lineY })
  const inFront = (e.y - net.lineY) * net.mouth > 1.5
  const angleOk = inFront && Math.abs(e.x - net.cx) < toNet * 0.85
  const pressure = Math.min(...opps.map((o) => dist(o, e)).concat([99]))
  if (decide) {
    const range = (10 + 20 * game.rules.speed) * (0.8 + e.rating.shot / 260)
    const held = game.time - (e.heldSince || 0)
    if (angleOk && toNet < range && held > 0.45) {
      let pShoot = 0.06 + e.rating.shot / 700 + (toNet < range * 0.5 ? 0.16 : 0) + (pressure < 4 ? 0.06 : 0)
      // a defender in the shooting lane: look for something better
      const netPt = { x: net.cx, y: net.lineY }
      if (opps.some((o) => segDist(o, e, netPt) < 1.8 && dist(o, e) < toNet)) pShoot *= 0.3
      if (rng.chance(pShoot)) {
        game.shoot(e, 0)
        return { vx: e.vx, vy: e.vy }
      }
    }
    // passing: exposure makes kids hold on to it
    let passWill = (0.2 + coach * 0.0035 + team.chemistry) * (1 - (e.exposure / 100) * 0.8)
    if (pressure < 6) passWill *= 1.8
    if (e.stamina < 0.35) passWill *= 1.3
    if (rng.chance(clamp(passWill, 0, 0.95) * 0.55)) {
      const to = pickPass(game, e, team, net)
      if (to) {
        game.pass(e, to)
        return { vx: e.vx, vy: e.vy }
      }
    }
    // full ice: get it out of trouble
    if (game.rules.faceoffs && pressure < 4.5) {
      const own = game.ownNetFor(e.side)
      if (dist(e, front(own, 0)) < 40 && rng.chance(0.05)) {
        game.dump(e)
        return { vx: e.vx, vy: e.vy }
      }
    }
  }
  // skate at the net, sliding away from the closest defender in the way
  let tgt = front(net, Math.max(5, Math.min(12, toNet * 0.3)))
  if (!inFront) tgt = { x: e.x < net.cx ? net.x0 - 6 : net.x1 + 6, y: net.lineY + net.mouth * 8 }
  const ahead = opps
    .filter((o) => dist(o, e) < 10)
    .sort((a, b) => dist(a, e) - dist(b, e))[0]
  if (ahead) {
    const side = ahead.x > e.x ? -1 : 1
    tgt = { x: tgt.x + side * 8, y: tgt.y }
  }
  const t = clampTarget(game, tgt)
  return toward(e, t.x, t.y, 4)
}

// ---------- positions ----------

// the rink from one team's point of view: u is distance up the ice from its
// own goal line toward the net it attacks, x is across
const frame = (game, team) => {
  const s = game.rules.surface
  const own = team.ownNetY()
  const dirn = team.attackDir()
  const length = Math.abs(team.targetNetY() - own)
  // where the offensive zone starts: the blue line on full ice, halfway on small ice
  const oz = s.blueLines ? length - (s.blueLines - s.goalLine) : length * 0.5
  return {
    W: s.width,
    length,
    oz,
    dz: length - oz,
    u: (y) => (y - own) * dirn,
    y: (u) => own + dirn * u,
  }
}

const isD = (e) => e.role === 'LD' || e.role === 'RD' || e.role === 'D'

// where a role wants to be. mode: 'attack' (we have it), 'defend' (they do)
const roleSpot = (game, team, e, mode, anchor) => {
  const f = frame(game, team)
  const W = f.W
  const au = f.u(anchor.y)
  const leftSide = anchor.x < W / 2
  const role = e.role || 'C'
  let x = W / 2
  let u = au
  if (mode === 'attack') {
    if (au > f.oz - 4) {
      // set up in the zone: points, high slot, half wall, net front
      if (role === 'LD') [x, u] = [W * 0.25, f.oz + 4]
      else if (role === 'RD') [x, u] = [W * 0.75, f.oz + 4]
      else if (role === 'D') [x, u] = [W * 0.5, f.oz + 4]
      else if (role === 'C') [x, u] = [W * 0.5, f.length - 20]
      else {
        // wingers split: one on the puck-side wall, one at the net
        const wallSide = (role === 'LW') === leftSide || (role === 'W' && e.uid % 2 === 0)
        if (wallSide) [x, u] = [leftSide ? W * 0.16 : W * 0.84, f.length - 24]
        else [x, u] = [W / 2 + (leftSide ? 4 : -4), f.length - 7]
      }
    } else {
      // breakout: wingers wide and ahead, center underneath, D trail
      if (role === 'LW') [x, u] = [W * 0.12, au + 22]
      else if (role === 'RW') [x, u] = [W * 0.88, au + 22]
      else if (role === 'W') [x, u] = [leftSide ? W * 0.85 : W * 0.15, au + 22]
      else if (role === 'C') [x, u] = [W * 0.5, au + 12]
      else if (role === 'LD') [x, u] = [W * 0.3, au - 16]
      else if (role === 'RD') [x, u] = [W * 0.7, au - 16]
      else [x, u] = [W * 0.5, au - 16]
      u = Math.max(6, u)
    }
  } else {
    if (au < f.dz + 6) {
      // in our zone: D box the slot, forwards take the points, C low support
      // no goalie (the pond): the D on the puck side parks in front of the net
      const noGoalie = !game.rules.goalies
      const keeper = noGoalie && (role === 'D' || (role === 'LD') === leftSide)
      if (keeper) [x, u] = [W * 0.5, 3]
      else if (role === 'LD') [x, u] = [W * 0.38, 9]
      else if (role === 'RD') [x, u] = [W * 0.62, 9]
      else if (role === 'D') [x, u] = [W * 0.5, 8]
      else if (role === 'C') [x, u] = [W * 0.5, 18]
      else if (role === 'LW') [x, u] = [W * 0.25, f.dz - 4]
      else if (role === 'RW') [x, u] = [W * 0.75, f.dz - 4]
      else [x, u] = [leftSide ? W * 0.75 : W * 0.25, f.dz - 4]
    } else {
      // keep a gap: stay between the puck and the net
      if (isD(e)) {
        x = role === 'LD' ? W * 0.32 : role === 'RD' ? W * 0.68 : W * 0.5
        u = Math.max(8, au - 18)
      } else {
        x = role === 'LW' ? W * 0.28 : role === 'RW' ? W * 0.72 : W * 0.5
        u = Math.max(12, au - 8)
      }
    }
  }
  return { x, y: f.y(u) }
}

// nudge a target away from the nearest teammate so nobody stacks up
const spread = (game, team, e, t) => {
  let nx = 0
  let ny = 0
  for (const m of team.onIceSkaters()) {
    if (m === e) continue
    const dx = t.x - m.x
    const dy = t.y - m.y
    const d = Math.hypot(dx, dy)
    if (d > 0 && d < 9) {
      nx += (dx / d) * (9 - d)
      ny += (dy / d) * (9 - d)
    }
  }
  return { x: t.x + nx * 0.6, y: t.y + ny * 0.6 }
}

const supportAI = (game, e, team, carrierPos) => {
  let tgt = roleSpot(game, team, e, 'attack', carrierPos)
  // puck watchers drift toward the puck
  if (!e.discipline && e.rating.coachability < 45) {
    tgt = { x: (tgt.x + carrierPos.x) / 2, y: (tgt.y + carrierPos.y) / 2 }
  }
  // small wobble so nobody stands still
  tgt.x += Math.sin(game.time * 1.3 + e.uid) * 2
  tgt = spread(game, team, e, tgt)
  tgt = holdOnside(game, team, e, tgt)
  const t = clampTarget(game, tgt)
  return toward(e, t.x, t.y, 2.2)
}

const defendAI = (game, e, team, decide) => {
  const rng = game.rng
  const p = game.puck
  const c = p.carrier
  const opp = game.teams[game.other(e.side)]
  const own = game.ownNetFor(e.side)
  const ownFront = front(own, 4)
  const coach = e.rating.coachability
  const mates = team.onIceSkaters()
  const byDist = mates.slice().sort((a, b) => dist(a, c) - dist(b, c))
  const beehive = !e.discipline && game.rules.ageIndex <= 1 && coach < 55
  const pursuer = byDist[0] === e || beehive
  if (pursuer) {
    const dx = ownFront.x - c.x
    const dy = ownFront.y - c.y
    const l = Math.hypot(dx, dy) || 1
    const d = dist(e, c)
    if (decide && d < 4) {
      const behind = game.fromBehind(e, c)
      const checkP = game.rules.checking ? 0.04 + e.rating.check / 900 : (100 - coach) / 9000
      const stickP = 0.012 + (100 - coach) / 4500 + (behind ? 0.02 : 0)
      const pokeP = 0.12 + 0.18 * game.rules.ai
      const r = rng.next()
      // coachable players do not hit from behind
      const cleanHit = !behind || rng.chance((100 - coach) / 500)
      // after a stick play a CPU player waits a while before the next one
      const rested = game.time >= (e.nextStickAt || 0)
      // pick one action by its band, then see if it is a good idea; a hit
      // passed up does not turn into a stick play
      if (r < checkP) {
        if (d < 3.3 && cleanHit) game.bodyCheck(e, c)
      } else if (r < checkP + stickP) {
        if (rested) {
          game.stickPlay(e, c)
          e.nextStickAt = game.time + 10 + coach / 6
        }
      } else if (r < checkP + stickP + pokeP) {
        game.pokeCheck(e)
      }
    }
    return toward(e, c.x + (dx / l) * 2, c.y + (dy / l) * 2, 4)
  }
  // positional defense: each role takes its spot, shading toward the attacker
  // nearest that spot
  let spot = roleSpot(game, team, e, 'defend', c)
  const attackers = opp.onIceSkaters().filter((o) => o !== c)
  const mark = attackers.slice().sort((a, b) => dist(a, spot) - dist(b, spot))[0]
  if (mark && dist(mark, spot) < 22) {
    spot = {
      x: spot.x + (mark.x + (ownFront.x - mark.x) * 0.35 - spot.x) * 0.55,
      y: spot.y + (mark.y + (ownFront.y - mark.y) * 0.35 - spot.y) * 0.55,
    }
    if (decide && dist(e, mark) < 3 && game.time >= (e.nextStickAt || 0) && rng.chance((100 - coach) / 400000)) {
      game.stickPlay(e, mark)
      e.nextStickAt = game.time + 10 + coach / 6
    } else if (decide && dist(e, mark) < 3 && game.rules.checking && rng.chance((100 - coach) / 12000)) {
      game.bodyCheck(e, mark)
    }
  }
  const t = clampTarget(game, spread(game, team, e, spot))
  return toward(e, t.x, t.y, 2.4)
}

const loosePuckAI = (game, e, team) => {
  const p = game.puck
  const mates = team.onIceSkaters().slice().sort((a, b) => dist(a, p) - dist(b, p))
  const rank = mates.indexOf(e)
  const swarm = !e.discipline && e.rating.coachability < 50
  const f = frame(game, team)
  const pu = f.u(p.y)
  // hold the zone: a loose puck at our offensive blue line, sliding out, is the
  // D's to keep in
  const atLine = pu > f.oz - 10 && pu < f.oz + 8
  const sliding = (p.vy * team.attackDir()) < 0
  const pinch = isD(e) && atLine && sliding && rank <= 1 && ((e.role === 'LD') === (p.x < f.W / 2) || e.role === 'D')
  if (rank === 0 || pinch || (rank === 1 && swarm) || (game.rules.ageIndex === 0 && swarm)) {
    const t = clampTarget(game, { x: p.x + p.vx * 0.3, y: p.y + p.vy * 0.3 })
    return toward(e, t.x, t.y, 5)
  }
  const ours = p.lastTouch && p.lastTouch.side === e.side
  let spot = roleSpot(game, team, e, ours ? 'attack' : 'defend', p)
  spot = spread(game, team, e, spot)
  if (ours) spot = holdOnside(game, team, e, spot)
  const t = clampTarget(game, spot)
  return toward(e, t.x, t.y, 2.4)
}

export const aiSkater = (game, e, dt) => {
  const rng = game.rng
  const team = game.teams[e.side]
  const p = game.puck
  e.aiTimer -= dt
  const decide = e.aiTimer <= 0
  if (decide) {
    e.aiTimer = 0.32 - 0.18 * game.rules.ai + rng.range(0, 0.08)
    if (rng.chance(0.12)) e.discipline = rng.chance(0.45 + e.rating.coachability / 180)
  }
  const c = p.carrier
  if (c === e) return carrierAI(game, e, team, decide)
  // no goalies (the pond): one D stays home in the net mouth whenever the
  // puck is in our half and not ours, unless it comes right to them
  if (!game.rules.goalies && (e.role === 'LD' || e.role === 'D')) {
    const f = frame(game, team)
    const ours = (c && c.side === e.side) || (!c && p.lastTouch && p.lastTouch.side === e.side)
    if (!ours && f.u(p.y) < f.length * 0.55 && dist(e, p) > 6) {
      const own = game.ownNetFor(e.side)
      const t = { x: own.cx + (p.x - own.cx) * 0.1, y: own.lineY + own.mouth * 2 }
      return toward(e, t.x, t.y, 4)
    }
  }
  if (c && c.side === e.side) return supportAI(game, e, team, c)
  if (c) return defendAI(game, e, team, decide)
  return loosePuckAI(game, e, team)
}
