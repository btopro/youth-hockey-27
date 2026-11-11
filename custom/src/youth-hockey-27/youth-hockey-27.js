/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// <youth-hockey-27>: a 16-bit youth hockey game. The age level sets the
// surface, the team size and the rules; the stands hold up a mirror to what
// money and pressure do to kids' sports.
import { LitElement, html, css, nothing } from 'lit'
import { DDDSuper } from '@haxtheweb/d-d-d/d-d-d.js'
import '@haxtheweb/rpg-character/rpg-character.js'
import { Game } from './engine/game.js'
import { LEVELS, getLevel, buildRules } from './engine/ages.js'
import { TEAMS, getTeam } from './engine/teams.js'
import { Renderer, CONTROLLER_COLORS, CONTROLLER_LABELS } from './lib/renderer.js'
import { ChipAudio } from './lib/audio.js'
import { InputManager } from './lib/input.js'
import { ReplayBuffer, recordClip, canRecordClips } from './lib/replay.js'
import { Tournament } from './lib/tournament.js'
import { colorDistance } from './lib/sprites.js'
import { drawCrest, CRESTS } from './lib/crests.js'

const DT = 1 / 60

const crestUrls = new Map()
const crestUrl = (id) => {
  if (crestUrls.has(id)) return crestUrls.get(id)
  const c = CRESTS[id]
  if (!c) return ''
  const canvas = globalThis.document.createElement('canvas')
  canvas.width = c.w * 4
  canvas.height = c.h * 4
  drawCrest(canvas.getContext('2d'), id, 0, 0, 4)
  const url = canvas.toDataURL()
  crestUrls.set(id, url)
  return url
}

const PHONE_LINES = [
  'Did you SEE that? We need the Elite Showcase package.',
  'Sending this to the agent right now. Top line, every shift.',
  'That is going on the highlight reel. And the other highlight reel.',
  'Coach better be watching. I am uploading this tonight.',
  'Ten-year-old? D1 commit. I am calling it.',
]

const stripEdges = (inputs) => {
  const out = {}
  for (const id of Object.keys(inputs)) {
    out[id] = Object.assign({}, inputs[id], { pass: false, shoot: false, check: false, stick: false, pause: false, clip: false, confirm: false, back: false })
  }
  return out
}

export class YouthHockey27 extends DDDSuper(LitElement) {
  static get tag() {
    return 'youth-hockey-27'
  }

  static get properties() {
    return {
      ...super.properties,
      level: { type: String, reflect: true },
      home: { type: String },
      away: { type: String },
      roller: { type: Boolean },
      mode: { type: String },
      ruleset: { type: String },
      strictness: { type: Number },
      attract: { type: Boolean, reflect: true },
      _screen: { state: true },
      _overlay: { state: true },
      _assign: { state: true },
      _pads: { state: true },
      _lineup: { state: true },
      _fx: { state: true },
      _intermission: { state: true },
      _penalty: { state: true },
      _phone: { state: true },
      _clip: { state: true },
      _final: { state: true },
      _muted: { state: true },
      _announce: { state: true },
    }
  }

  constructor() {
    super()
    this.level = '10U'
    this.home = 'sparkle-selects'
    this.away = 'icers'
    this.roller = false
    this.mode = 'exhibition'
    this.ruleset = 'standard'
    this.strictness = 50
    this.attract = false
    this._screen = 'title'
    this._overlay = null
    this._assign = { kb: 'home', touch: 'home', pad0: 'home', pad1: 'away', pad2: 'home', pad3: 'away' }
    this._pads = []
    this._lineup = { home: [], away: [] }
    this._fx = {}
    this._fanFx = {}
    this._intermission = null
    this._penalty = null
    this._phone = null
    this._clip = null
    this._final = null
    this._announce = ''
    this.audio = new ChipAudio()
    this._muted = this.audio.muted
    this.input = new InputManager(this)
    this.replay = new ReplayBuffer(20, 30)
    this.game = null
    this.tournament = null
    this.renderer = null
    this._raf = null
    this._acc = 0
    this._last = 0
    this._banners = []
    this._visible = true
    this._lineupKey = ''
    this.t = {
      title: "Youth Hockey '27",
      tagline: 'Pick your age level. The rink, the rules and the parents change with it.',
      start: 'Start',
      play: 'Drop the puck',
      homeTeam: 'Home team',
      awayTeam: 'Away team',
      ageLevel: 'Age level',
      surface: 'Surface',
      ice: 'Ice',
      rollerLabel: 'Roller (4 on 4, no offsides, no icing)',
      modeLabel: 'Mode',
      exhibition: 'Exhibition',
      tournamentLabel: 'Tournament',
      ref: 'Referee',
      standard: 'Standard',
      jay: 'Jay mode (no penalties)',
      strictnessLabel: 'Ref strictness',
      controllers: 'Controllers',
      keyboard: 'Keyboard',
      touch: 'Touch',
      gamepad: 'Gamepad',
      cpu: 'CPU',
      pause: 'Pause',
      resume: 'Resume',
      quit: 'Quit to menu',
      saveClip: 'Save clip',
      mute: 'Sound off',
      unmute: 'Sound on',
      touchHelp: 'Joystick skates. PASS passes or switches player, SHOOT shoots or poke checks, CHECK body checks, STICK is a stick play. A keyboard or gamepad works too.',
      controlsHelp: 'Arrows skate. Z pass or switch player. X shoot or poke check. C body check. V stick play. P pause. R save the last 10 seconds as a clip.',
    }
  }

  // ---------- lifecycle ----------

  connectedCallback() {
    super.connectedCallback()
    this.input.attach()
    this._onPad = () => {
      this._pads = this.input.pads()
    }
    globalThis.addEventListener('gamepadconnected', this._onPad)
    globalThis.addEventListener('gamepaddisconnected', this._onPad)
    this._onVisibility = () => {
      if (globalThis.document.hidden && this._screen === 'playing' && !this._overlay && !this.attract) this._overlay = 'pause'
    }
    globalThis.document.addEventListener('visibilitychange', this._onVisibility)
    if ('IntersectionObserver' in globalThis) {
      this._io = new IntersectionObserver((entries) => {
        this._visible = entries.some((e) => e.isIntersecting)
      })
      this._io.observe(this)
    }
    this._pads = this.input.pads()
    this._loop = this._loop.bind(this)
    this._raf = globalThis.requestAnimationFrame(this._loop)
  }

  disconnectedCallback() {
    this.input.detach()
    globalThis.removeEventListener('gamepadconnected', this._onPad)
    globalThis.removeEventListener('gamepaddisconnected', this._onPad)
    globalThis.document.removeEventListener('visibilitychange', this._onVisibility)
    if (this._io) this._io.disconnect()
    if (this._raf) globalThis.cancelAnimationFrame(this._raf)
    this.audio.stop()
    if (this._clip && this._clip.url) globalThis.URL.revokeObjectURL(this._clip.url)
    super.disconnectedCallback()
  }

  firstUpdated(changed) {
    if (super.firstUpdated) super.firstUpdated(changed)
    if (this.attract) this.startAttract()
  }

  // the input manager asks before taking a key
  capturesKeys(e) {
    if (this.attract) return false
    const path = e.composedPath ? e.composedPath() : []
    const target = path[0] || e.target
    const tag = target && target.tagName ? target.tagName.toLowerCase() : ''
    const typing = ['input', 'textarea', 'select'].includes(tag) || (target && target.isContentEditable)
    if (this._screen === 'playing') {
      // typing somewhere else on the page wins
      if (typing && !path.includes(this)) return false
      return path.includes(this) || globalThis.document.activeElement === globalThis.document.body
    }
    return false
  }

  // ---------- setup ----------

  humans() {
    const ids = ['kb']
    this._pads.forEach((p) => ids.push(p.id))
    const out = {}
    ids.forEach((id) => {
      const side = this._assign[id]
      if (side === 'home' || side === 'away') out[id] = side
    })
    return out
  }

  kitsFor(homeId, awayId) {
    const h = getTeam(homeId)
    const a = getTeam(awayId)
    let awayKit = 'away'
    if (colorDistance(h.kits.home.jersey, a.kits.away.jersey) < 140) awayKit = 'home'
    return { homeKit: 'home', awayKit }
  }

  newGame(homeId, awayId, extra) {
    const controllers = this.attract ? {} : this.humans()
    const sides = Object.values(controllers)
    const opts = Object.assign(
      {
        level: this.level,
        roller: this.roller,
        ruleset: this.ruleset,
        strictness: this.strictness / 100,
        home: homeId,
        away: awayId,
        controllers,
        focusSide: sides[0] || 'home',
        autoIntermission: this.attract,
        seed: `${homeId}:${awayId}:${this.level}:${Date.now()}`,
      },
      this.kitsFor(homeId, awayId),
      extra || {},
    )
    this.game = new Game(opts)
    this.replay.clear()
    this._banners = []
    this._fx = {}
    this._fanFx = {}
    this._final = null
    this._penalty = null
    this._phone = null
    this._intermission = null
    this._overlay = null
    const team = (side) => {
      const t = this.game.teams[side]
      return { kit: t.kit, short: t.def.short, crest: t.def.crest, name: t.def.name }
    }
    this.match = { rules: this.game.rules, teams: { home: team('home'), away: team('away') } }
    this._screen = 'playing'
    this.updateComplete.then(() => {
      const canvas = this.shadowRoot.querySelector('#rink')
      this.renderer = new Renderer(canvas, { hud: true })
      this.renderer.setMatch(this.match.rules, this.match.teams)
      const phone = this.shadowRoot.querySelector('#phone-canvas')
      if (phone) this.phoneRenderer = new Renderer(phone, { hud: false, zoom: 3 })
      if (!this.attract) {
        const stage = this.shadowRoot.querySelector('.stage')
        if (stage) stage.focus()
      }
    })
    this.updateLineup(true)
    this.audio.stopLoop()
    this.say(`${this.match.teams.home.name} versus ${this.match.teams.away.name}, ${getLevel(this.level).label}. Drop the puck.`)
  }

  startAttract() {
    const ids = TEAMS.map((t) => t.id)
    const home = ids.includes(this.home) ? this.home : ids[0]
    let away = ids.includes(this.away) ? this.away : ids[1]
    if (away === home) away = ids.find((id) => id !== home)
    this.newGame(home, away, { seed: `attract:${this.level}:${Date.now()}` })
  }

  startFromSelect() {
    this.audio.start()
    if (this.home === this.away) return
    if (this.mode === 'tournament') {
      this.tournament = new Tournament({
        level: this.level,
        roller: this.roller,
        ruleset: this.ruleset,
        strictness: this.strictness / 100,
        team: this.home,
        seed: `${Date.now()}`,
      })
      this._screen = 'bracket'
      this.audio.startLoop()
      return
    }
    this.tournament = null
    this.newGame(this.home, this.away)
  }

  playNextTournamentGame() {
    const g = this.tournament.next()
    if (!g) return
    this.newGame(g.home, g.away, { needWinner: !this.tournament.jamboree })
  }

  // ---------- loop ----------

  _loop(now) {
    this._raf = globalThis.requestAnimationFrame(this._loop)
    const elapsed = this._last ? Math.min(0.1, (now - this._last) / 1000) : DT
    this._last = now
    const inputs = this.input.poll()
    if (this._screen === 'select') this.selectInput(inputs)
    if (this._screen !== 'playing' || !this.game || !this.renderer) return
    if (this.attract && !this._visible) return
    this.overlayInput(inputs)
    const paused = !!this._overlay || this.game.phase === 'intermission'
    if (!paused) {
      // pause / clip buttons from any human controller
      const ids = Object.keys(this.game.controllers)
      if (!this.attract && (inputs.kb || ids.length)) {
        const all = Object.keys(inputs)
        if (all.some((id) => inputs[id].pause)) {
          this._overlay = 'pause'
          return
        }
        if (all.some((id) => inputs[id].clip)) {
          this.saveClip()
          return
        }
      }
      this._acc += elapsed
      let first = true
      while (this._acc >= DT) {
        this.game.step(DT, first ? inputs : stripEdges(inputs))
        first = false
        this._acc -= DT
        this.handleEvents(this.game.drainEvents())
        if (this._overlay) {
          this._acc = 0
          break
        }
      }
      const snap = this.game.snapshot()
      this.replay.push(snap, elapsed)
      this.updateLineup(false)
      this.updateCarrierFans()
    }
    this.tickFx(elapsed)
    this.drawFrame(elapsed)
    this.audio.setCrowd(this.game.crowd.mood, !paused)
  }

  drawFrame(dt) {
    const snap = this.game.snapshot()
    const now = performance.now()
    this._banners = this._banners.filter((b) => b.until > now)
    const b = this._banners[0]
    const shake = b && b.shake && !this.reducedMotion() ? 1 : 0
    this.renderer.draw(snap, { dt, banner: b ? b.text : null, bannerColor: b ? b.color : null, sub: b ? b.sub : null, shake })
    if (this._phone && this.phoneRenderer) this.drawPhone(dt)
  }

  reducedMotion() {
    return globalThis.matchMedia && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  banner(text, opts) {
    const o = opts || {}
    this._banners.push({ text, sub: o.sub || null, color: o.color, until: performance.now() + (o.ms || 1800), shake: o.shake })
    if (this._banners.length > 3) this._banners.shift()
  }

  say(text) {
    // aria-live announcer; re-set so the same text is read again
    this._announce = ''
    this.updateComplete.then(() => {
      this._announce = text
    })
  }

  // ---------- events from the engine ----------

  entity(uid) {
    return this.game ? this.game.findEntity(uid) : null
  }

  handleEvents(events) {
    const a = this.audio
    const teams = this.match.teams
    const keep = this.game.rules.keepScore
    for (const e of events) {
      switch (e.type) {
        case 'shot':
          a.play('shot')
          break
        case 'pass':
          a.play('pass')
          break
        case 'boards':
          a.play('boards')
          break
        case 'post':
          a.play('post')
          this.banner('POST!', { ms: 900, color: '#ffffff' })
          break
        case 'save':
          a.play('save')
          this.react(e.uid, 'jump', 1.5)
          break
        case 'hit':
          a.play('hit')
          this.react(e.uid, 'jump', 1.2)
          if (!e.legal) this.react(e.target, 'angry', 2.5)
          break
        case 'whistle':
          a.play('whistle')
          if (e.reason === 'offside') this.banner('OFFSIDE', { sub: 'Attackers went in ahead of the puck', color: '#ffffff' })
          if (e.reason === 'icing') this.banner('ICING', { sub: 'Shot from your own half went all the way down', color: '#ffffff' })
          break
        case 'buzzer':
          a.play('buzzer')
          this.banner('BUZZER!', { sub: 'Everybody changes. Everybody plays.', ms: 1500, color: '#69f0ae' })
          break
        case 'goal': {
          const side = e.side
          a.play('horn')
          a.playSting('goal')
          const name = e.scorerNumber ? `#${e.scorerNumber} ${e.scorerName}` : 'Off a skate'
          this.banner('GOAL!', { sub: name, ms: 2400, color: teams[side].kit.jersey, shake: true })
          if (e.scorer) {
            this.react(e.scorer, 'wild', 4)
            if (!keep) {
              this.react(e.scorer, 'money', 4)
              a.playSting('money')
            }
          }
          ;(e.assists || []).forEach((uid) => this.react(uid, 'jump', 3))
          this.teamReact(side, 'jump', 2)
          this.say(keep ? `Goal, ${teams[side].name}. ${name}. ${teams.home.short} ${e.home}, ${teams.away.short} ${e.away}.` : `Goal by ${name}. Nobody is keeping score at this level, but the parents are.`)
          if (e.viral && e.scorer && !this.attract) this.startPhone(e.scorer)
          break
        }
        case 'penalty': {
          const team = teams[e.side]
          this.react(e.uid, 'angry', 4)
          if (e.penalty === 'fighting') {
            this.banner('EJECTED', { sub: `#${e.number} ${team.short}`, ms: 1400, color: '#d8343c' })
            break
          }
          this.say(`Penalty, ${team.name}. Number ${e.number}, ${e.label}, two minutes. ${e.explain}`)
          if (!this.attract) {
            this._penalty = Object.assign({ team: team.name, short: team.short, color: team.kit.jersey, until: performance.now() + 3600 }, e)
            this._overlay = 'penalty'
          } else {
            this.banner(e.label.toUpperCase(), { sub: `#${e.number} ${team.short} 2:00`, ms: 1600, color: '#ffd740' })
          }
          a.playSting('penalty')
          break
        }
        case 'stands-fight':
          this.standsFight(e.a, e.b)
          break
        case 'fight':
          a.play('fight')
          this.banner('FIGHT!', { sub: 'Gloves are off', ms: 3000, color: '#d8343c', shake: true })
          this.teamReact('home', 'jump', 3)
          this.teamReact('away', 'jump', 3)
          this.say('Fight! Both players are ejected.')
          break
        case 'period-end':
          a.play('buzzer')
          a.playSting('period')
          break
        case 'overtime':
          this.banner('OVERTIME', { sub: 'Next goal wins', ms: 2500 })
          break
        case 'shootout':
          this.banner('SHOOTOUT', { sub: `${teams[e.winner].short} wins it`, ms: 2500 })
          break
        case 'intermission':
          if (!this.attract) {
            this._intermission = Object.assign({ result: null }, e)
            this._overlay = 'intermission'
            this.audio.startLoop()
            this.say(`End of period ${e.period}. ${e.title}. ${e.body}`)
          }
          break
        case 'period-start':
          this.banner(`PERIOD ${e.period}`, { ms: 1500 })
          break
        case 'final':
          this.finish(e)
          break
        default:
          break
      }
    }
  }

  finish(result) {
    if (this.attract) {
      // keep the demo running
      globalThis.setTimeout(() => this.startAttract(), 2500)
      this.banner(result.keepScore ? 'FINAL' : 'GOOD GAME', { ms: 2400 })
      return
    }
    this.audio.startLoop()
    const g = this.game
    const skaters = [...g.teams.home.skaters(), ...g.teams.away.skaters()]
    const top = (score) => skaters.slice().sort((x, y) => score(y) - score(x))[0]
    const star = top((e) => e.stats.goals * 3 + e.stats.assists * 2 + e.stats.passes * 0.1)
    const passer = top((e) => e.stats.passes)
    const hog = top((e) => e.stats.possession - e.stats.passes * 2)
    const sideStats = (side) => {
      const t = g.teams[side]
      const list = t.entities
      return {
        shots: t.shots,
        passes: list.reduce((s, e) => s + e.stats.passes, 0),
        hits: list.reduce((s, e) => s + e.stats.hits, 0),
        pim: list.reduce((s, e) => s + e.stats.pim, 0),
      }
    }
    const who = (e) => `#${e.player.number} ${e.player.name} (${g.teams[e.side].def.short})`
    this._final = {
      result,
      stats: { home: sideStats('home'), away: sideStats('away') },
      awards: [
        { label: 'Player of the game', who: who(star) },
        { label: 'Most passes', who: `${who(passer)}, ${passer.stats.passes}` },
        { label: 'Puck hog award', who: `${who(hog)}, ${Math.round(hog.stats.possession)} seconds with the puck, ${hog.stats.passes} passes` },
      ],
    }
    if (this.tournament) this.tournament.recordUser(result)
    this._screen = 'final'
    const teams = this.match.teams
    if (result.reason && result.reason.startsWith('called')) {
      this.say('Game called. Not enough players left to keep playing.')
    } else if (result.keepScore) {
      this.say(`Final. ${teams.home.name} ${result.home}, ${teams.away.name} ${result.away}.`)
    } else {
      this.say('Good game. Nobody kept score. Everybody played.')
    }
  }

  // ---------- the stands ----------

  updateLineup(force) {
    const g = this.game
    if (!g) return
    const list = (side) => g.teams[side].entities.filter((e) => e.onIce)
    const key = ['home', 'away'].map((s) => list(s).map((e) => e.uid).join(',')).join('|')
    if (!force && key === this._lineupKey) return
    this._lineupKey = key
    const view = (side) =>
      list(side).map((e) => ({
        uid: e.uid,
        number: e.player.number,
        goalie: e.isGoalie,
        fans: e.player.fans,
        superFans: e.exposure >= 60,
      }))
    this._lineup = { home: view('home'), away: view('away') }
  }

  react(uid, kind, seconds) {
    if (!uid) return
    this._fx = Object.assign({}, this._fx, { [uid]: { kind, until: performance.now() + seconds * 1000 } })
  }

  teamReact(side, kind, seconds) {
    const next = Object.assign({}, this._fx)
    for (const p of this._lineup[side] || []) {
      if (!next[p.uid] || next[p.uid].kind === kind) next[p.uid] = { kind, until: performance.now() + seconds * 1000 }
    }
    this._fx = next
  }

  // a parent of each kid involved gets into it
  standsFight(a, b) {
    const ea = this.entity(a)
    const eb = this.entity(b)
    const next = Object.assign({}, this._fanFx)
    const until = performance.now() + 3500
    if (ea) next[ea.player.fans[0]] = until
    if (eb) next[eb.player.fans[0]] = until
    this._fanFx = next
    this.requestUpdate()
    this.banner('TROUBLE IN THE STANDS', { ms: 1400, color: '#ffd740' })
  }

  // high-exposure kids with the puck: out come the dollar bills
  updateCarrierFans() {
    const c = this.game.puck.carrier
    if (!c || c.exposure < 60) return
    const cur = this._fx[c.uid]
    if (!cur || cur.kind !== 'money' || cur.until - performance.now() < 300) {
      if (!cur || cur.kind !== 'money') this.audio.playSting('money')
      this.react(c.uid, 'money', 1.2)
    }
  }

  tickFx() {
    const now = performance.now()
    let changed = false
    const next = {}
    for (const uid of Object.keys(this._fx)) {
      const f = this._fx[uid]
      if (f.until > now) next[uid] = f
      else changed = true
    }
    if (changed) this._fx = next
    let fanChanged = false
    for (const seed of Object.keys(this._fanFx)) {
      if (this._fanFx[seed] <= now) {
        delete this._fanFx[seed]
        fanChanged = true
      }
    }
    if (fanChanged) this.requestUpdate()
    if (this._penalty && this._overlay === 'penalty' && this._penalty.until < now) this.closeOverlay()
  }

  // ---------- overlays ----------

  overlayInput(inputs) {
    const any = (k) => Object.keys(inputs).some((id) => inputs[id][k])
    if (this._overlay === 'penalty' && (any('pass') || any('confirm') || any('shoot'))) this.closeOverlay()
    else if (this._overlay === 'phone' && (any('pass') || any('confirm') || any('shoot') || any('pause'))) this.closeOverlay()
    else if (this._overlay === 'pause' && any('pause')) this.closeOverlay()
    else if (this._overlay === 'intermission') {
      const nav = Object.keys(inputs).map((id) => inputs[id].navY).find((v) => v)
      if (nav) {
        const buttons = this.shadowRoot.querySelectorAll('.intermission button')
        const list = Array.from(buttons)
        const i = list.indexOf(this.shadowRoot.activeElement)
        const n = list[(i + nav + list.length) % list.length]
        if (n) n.focus()
      }
      if (Object.keys(inputs).some((id) => id !== 'kb' && inputs[id].confirm)) {
        const el = this.shadowRoot.activeElement
        if (el && el.click) el.click()
      }
    }
  }

  closeOverlay() {
    const was = this._overlay
    this._overlay = null
    this._penalty = null
    if (was === 'phone') this._phone = null
    this._last = 0
    this.updateComplete.then(() => {
      const stage = this.shadowRoot.querySelector('.stage')
      if (stage && !this.attract) stage.focus()
    })
  }

  chooseIntermission(i) {
    const result = this.game.chooseIntermission(i)
    this.handleEvents(this.game.drainEvents())
    this._intermission = Object.assign({}, this._intermission, { result, chosen: i })
    this.say(result)
    this.updateComplete.then(() => {
      const b = this.shadowRoot.querySelector('.intermission .continue')
      if (b) b.focus()
    })
  }

  endIntermission() {
    this._intermission = null
    this.audio.stopLoop()
    this.closeOverlay()
  }

  startPhone(scorerUid) {
    const e = this.entity(scorerUid)
    if (!e) return
    const frames = this.replay.last(3.5)
    if (frames.length < 10) return
    this._phone = {
      frames,
      i: 0,
      fan: e.player.fans[0],
      number: e.player.number,
      line: PHONE_LINES[Math.floor((e.uid * 7 + this.game.time) % PHONE_LINES.length)],
      acc: 0,
    }
    // let the goal banner land first
    globalThis.setTimeout(() => {
      if (this._phone && this._screen === 'playing') {
        this._overlay = 'phone'
        this.say(`A parent is filming the goal on their phone. "${this._phone.line}"`)
        this.updateComplete.then(() => {
          const phone = this.shadowRoot.querySelector('#phone-canvas')
          if (phone) {
            this.phoneRenderer = new Renderer(phone, { hud: false, zoom: 3 })
            this.phoneRenderer.setMatch(this.match.rules, this.match.teams)
          }
        })
      }
    }, 900)
  }

  drawPhone(dt) {
    if (this._overlay !== 'phone' || !this.phoneRenderer) return
    const p = this._phone
    p.acc += dt
    const idx = Math.min(p.frames.length - 1, Math.floor(p.acc * 30))
    const snap = p.frames[idx]
    const shake = this.reducedMotion() ? 0 : 1.5
    this.phoneRenderer.draw(snap, { dt, snapCamera: idx === 0, shake })
    if (p.acc * 30 > p.frames.length + 30) this.closeOverlay()
  }

  async saveClip() {
    if (!canRecordClips()) {
      this.banner('CLIPS NEED CHROME, EDGE OR FIREFOX', { ms: 2000, color: '#ffffff' })
      return
    }
    const frames = this.replay.last(10)
    if (frames.length < 15) return
    this._overlay = 'clip'
    this._clip = { progress: 0, url: null }
    const t = this.match.teams
    try {
      const clip = await recordClip(frames, this.match, {
        caption: `${t.home.short} VS ${t.away.short} - ${getLevel(this.level).label}`,
        onFrame: (i, n) => {
          this._clip = Object.assign({}, this._clip, { progress: Math.round((i / n) * 100) })
        },
      })
      const url = globalThis.URL.createObjectURL(clip.blob)
      this._clip = { progress: 100, url, name: `youth-hockey-27-${t.home.short}-${t.away.short}.${clip.ext}`.toLowerCase() }
      this.say('Clip ready to download.')
    } catch (err) {
      this._clip = { progress: 0, error: err.message }
    }
  }

  closeClip() {
    if (this._clip && this._clip.url) globalThis.URL.revokeObjectURL(this._clip.url)
    this._clip = null
    this.closeOverlay()
  }

  quit() {
    this.game = null
    this.renderer = null
    this._overlay = null
    this._screen = 'select'
    this.audio.startLoop()
  }

  toggleMute() {
    this._muted = !this._muted
    this.audio.setMuted(this._muted)
    if (this._muted) this.audio.stopLoop()
  }

  // gamepads move between sides on the select screen, NHL 93 style
  selectInput(inputs) {
    for (const p of this._pads) {
      const s = inputs[p.id]
      if (!s) continue
      if (s.navX) {
        const order = ['home', 'cpu', 'away']
        const cur = order.indexOf(this._assign[p.id] || 'cpu')
        const next = order[Math.max(0, Math.min(2, cur + s.navX))]
        this._assign = Object.assign({}, this._assign, { [p.id]: next })
      }
      if (s.pause || s.confirm) this.startFromSelect()
    }
  }

  // ---------- render ----------

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --yh-pink: #ff3fa4;
          --yh-ink: #10131c;
          --yh-gold: #f2c94c;
          color: var(--ddd-theme-default-white, #fff);
          font-family: var(--ddd-font-navigation, sans-serif);
          max-width: 800px;
          margin: 0 auto;
        }
        .shell {
          background: var(--yh-ink);
          border: var(--ddd-border-md, 2px solid) var(--yh-gold);
          border-radius: var(--ddd-radius-sm, 4px);
          overflow: hidden;
          position: relative;
        }
        :host([attract]) .shell {
          border-width: 1px;
        }
        h2,
        h3 {
          font-family: var(--ddd-font-navigation, sans-serif);
          margin: 0;
          letter-spacing: 0.04em;
        }
        .title-screen {
          padding: var(--ddd-spacing-12, 48px) var(--ddd-spacing-6, 24px);
          text-align: center;
          background: radial-gradient(circle at 50% 30%, #1d2a4a, var(--yh-ink) 70%);
        }
        .logo {
          font-size: var(--ddd-font-size-xl, 40px);
          font-weight: var(--ddd-font-weight-black, 900);
          color: var(--yh-pink);
          text-shadow: 3px 3px 0 #000, 6px 6px 0 var(--ddd-theme-default-skyBlue, #2e80ff);
          text-transform: uppercase;
        }
        .tagline {
          color: var(--ddd-theme-default-limestoneLight, #e4e5e7);
          margin: var(--ddd-spacing-4, 16px) 0 var(--ddd-spacing-8, 32px);
          font-size: var(--ddd-font-size-s, 18px);
        }
        .crest-row {
          display: flex;
          justify-content: center;
          gap: var(--ddd-spacing-4, 16px);
          margin-bottom: var(--ddd-spacing-8, 32px);
        }
        .crest-row img,
        .team img {
          image-rendering: pixelated;
        }
        button,
        .button {
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-xs, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          background: var(--ddd-theme-default-coalyGray, #262626);
          color: var(--ddd-theme-default-white, #fff);
          border: var(--ddd-border-sm, 1px solid) var(--ddd-theme-default-limestoneGray, #a2aaad);
          border-radius: var(--ddd-radius-xs, 2px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-4, 16px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        button:hover,
        button:focus-visible,
        .button:hover,
        .button:focus-visible {
          border-color: var(--yh-gold);
          outline: var(--ddd-border-md, 2px solid) var(--yh-gold);
          outline-offset: 2px;
        }
        button.primary,
        .button.primary {
          background: var(--yh-pink);
          border-color: var(--yh-pink);
          color: #000;
          font-size: var(--ddd-font-size-s, 18px);
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-8, 32px);
        }
        button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .select {
          padding: var(--ddd-spacing-6, 24px);
          display: grid;
          gap: var(--ddd-spacing-5, 20px);
        }
        fieldset {
          border: var(--ddd-border-sm, 1px solid) #2b3a55;
          border-radius: var(--ddd-radius-sm, 4px);
          margin: 0;
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
        }
        legend {
          color: var(--yh-gold);
          font-weight: var(--ddd-font-weight-bold, 700);
          padding: 0 var(--ddd-spacing-2, 8px);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .teams {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--ddd-spacing-4, 16px);
        }
        .choices {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
        }
        .choice {
          position: relative;
        }
        .choice input {
          position: absolute;
          opacity: 0;
          inset: 0;
          margin: 0;
          cursor: pointer;
        }
        .choice span {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          border: var(--ddd-border-sm, 1px solid) #2b3a55;
          border-radius: var(--ddd-radius-xs, 2px);
          background: #182035;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .choice input:checked + span {
          border-color: var(--yh-pink);
          background: #3a1530;
          box-shadow: inset 0 0 0 1px var(--yh-pink);
        }
        .choice input:focus-visible + span {
          outline: var(--ddd-border-md, 2px solid) var(--yh-gold);
          outline-offset: 2px;
        }
        .choice input:disabled + span {
          opacity: 0.4;
        }
        .blurb {
          margin: var(--ddd-spacing-2, 8px) 0 0;
          color: var(--ddd-theme-default-limestoneLight, #e4e5e7);
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .controllers {
          width: 100%;
          border: none;
          border-collapse: collapse;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .controllers th,
        .controllers td {
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          text-align: left;
          border: none;
          border-bottom: 1px solid #2b3a55;
          background: transparent;
          color: inherit;
        }
        .strict-label {
          display: block;
          text-align: left;
        }
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: var(--ddd-spacing-1, 4px);
        }
        input[type='range'] {
          width: 100%;
          accent-color: var(--yh-pink);
        }
        .start-row {
          display: flex;
          gap: var(--ddd-spacing-4, 16px);
          align-items: center;
          flex-wrap: wrap;
        }
        .warn {
          color: var(--ddd-theme-default-original87Pink, #ff8fd0);
        }
        /* the game */
        .stands {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: #0b0e16;
          height: 104px;
          overflow: hidden;
          border-bottom: 2px solid var(--yh-gold);
        }
        .side {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-end;
          padding: 2px 6px 0;
          position: relative;
        }
        .side.away {
          justify-content: flex-end;
        }
        .section {
          display: flex;
          align-items: flex-end;
          position: relative;
          margin: 0 2px;
        }
        .section .tag {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: var(--ddd-font-weight-bold, 700);
          background: rgba(0, 0, 0, 0.7);
          padding: 0 3px;
          border-radius: 2px;
          z-index: 2;
          white-space: nowrap;
        }
        .fan {
          position: relative;
          width: 30px;
          height: 46px;
          margin: 0 -5px;
        }
        .fan rpg-character {
          width: 36px;
          height: 46px;
          display: block;
        }
        .fan.jump {
          animation: hop 0.5s ease-in-out infinite;
        }
        .fan.wild {
          animation: wild 0.35s ease-in-out infinite;
          z-index: 3;
        }
        .fan.fight {
          animation: shake 0.12s linear infinite;
          z-index: 3;
        }
        .fan.fight::after {
          content: '!!';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          color: #ff5252;
          font-weight: 900;
          font-size: 14px;
          text-shadow: 1px 1px 0 #000;
        }
        .fan .bill {
          position: absolute;
          top: 2px;
          left: 50%;
          width: 18px;
          height: 9px;
          margin-left: -9px;
          background: #4caf50;
          border: 1px solid #1b5e20;
          color: #0b3d0e;
          font-size: 8px;
          line-height: 8px;
          font-weight: 900;
          text-align: center;
          animation: wave 0.3s ease-in-out infinite alternate;
          z-index: 4;
        }
        @keyframes hop {
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes wild {
          0% {
            transform: translateY(0) rotate(-6deg);
          }
          50% {
            transform: translateY(-12px) rotate(6deg);
          }
          100% {
            transform: translateY(0) rotate(-6deg);
          }
        }
        @keyframes shake {
          0% {
            transform: translateX(-2px);
          }
          50% {
            transform: translateX(2px);
          }
        }
        @keyframes wave {
          from {
            transform: rotate(-15deg) translateY(0);
          }
          to {
            transform: rotate(15deg) translateY(-3px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .fan.jump,
          .fan.wild,
          .fan.fight,
          .fan .bill {
            animation: none;
          }
          .fan.wild,
          .fan.jump {
            filter: brightness(1.4);
          }
        }
        .stage {
          position: relative;
          outline: none;
        }
        .stage:focus-visible {
          box-shadow: inset 0 0 0 2px var(--yh-gold);
        }
        canvas#rink {
          display: block;
          width: 100%;
          aspect-ratio: 256 / 224;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          background: #141826;
        }
        .overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 12, 20, 0.6);
          padding: var(--ddd-spacing-4, 16px);
        }
        .card {
          background: #182035;
          border: 2px solid var(--yh-gold);
          border-radius: var(--ddd-radius-sm, 4px);
          padding: var(--ddd-spacing-5, 20px);
          max-width: 460px;
          width: 100%;
          box-shadow: 6px 6px 0 #000;
        }
        .card p {
          margin: var(--ddd-spacing-3, 12px) 0;
          line-height: 1.4;
        }
        .card .actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-4, 16px);
        }
        .card .actions.stack {
          flex-direction: column;
        }
        .penalty .label {
          font-size: var(--ddd-font-size-m, 24px);
          color: #ffd740;
          text-transform: uppercase;
        }
        .penalty .signal {
          font-style: italic;
          color: var(--ddd-theme-default-limestoneLight, #e4e5e7);
        }
        .hint {
          font-size: 12px;
          color: #a2aaad;
        }
        .intermission .people {
          display: flex;
          gap: var(--ddd-spacing-2, 8px);
          float: right;
          margin-left: var(--ddd-spacing-3, 12px);
        }
        .intermission .people rpg-character {
          width: 56px;
          height: 72px;
        }
        .phone-wrap {
          display: flex;
          align-items: flex-end;
          gap: var(--ddd-spacing-3, 12px);
        }
        .phone {
          background: #111;
          border-radius: 14px;
          padding: 14px 6px;
          border: 2px solid #444;
          position: relative;
        }
        .phone canvas {
          display: block;
          width: 160px;
          height: 266px;
          image-rendering: pixelated;
          border-radius: 4px;
        }
        .phone .rec {
          position: absolute;
          top: 20px;
          left: 12px;
          color: #fff;
          font-size: 11px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .phone .rec::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d8343c;
        }
        .bubble {
          background: #fff;
          color: #111;
          border-radius: 10px;
          padding: var(--ddd-spacing-3, 12px);
          max-width: 200px;
          font-weight: var(--ddd-font-weight-bold, 700);
          position: relative;
          margin-bottom: 80px;
        }
        .caller rpg-character {
          width: 64px;
          height: 82px;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px);
          background: #0b0e16;
          align-items: center;
        }
        .toolbar .spacer {
          flex: 1;
        }
        .toolbar button {
          font-size: 13px;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-3, 12px);
        }
        .help {
          font-size: 12px;
          color: #a2aaad;
          padding: 0 var(--ddd-spacing-2, 8px) var(--ddd-spacing-2, 8px);
          background: #0b0e16;
          margin: 0;
        }
        .touch {
          display: none;
          justify-content: space-between;
          align-items: center;
          padding: var(--ddd-spacing-3, 12px);
          background: #0b0e16;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }
        .touch.on {
          display: flex;
        }
        .joy {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #182035;
          border: 2px solid #2b3a55;
          position: relative;
        }
        .knob {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--yh-pink);
          left: 36px;
          top: 36px;
          pointer-events: none;
        }
        .pad-buttons {
          display: grid;
          grid-template-columns: repeat(2, 64px);
          gap: 10px;
        }
        .pad-buttons button {
          height: 52px;
          border-radius: 26px;
          padding: 0;
          font-size: 12px;
        }
        .final,
        .bracket {
          padding: var(--ddd-spacing-6, 24px);
        }
        .scoreline {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: var(--ddd-spacing-4, 16px);
          margin: var(--ddd-spacing-4, 16px) 0;
          text-align: center;
        }
        .scoreline .big {
          font-size: var(--ddd-font-size-xl, 40px);
          font-weight: 900;
        }
        .team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
        }
        table.stats {
          width: 100%;
          border-collapse: collapse;
          margin: var(--ddd-spacing-4, 16px) 0;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        table.stats {
          border: none;
        }
        table.stats th,
        table.stats td {
          border: none;
          background: transparent;
          color: inherit;
          border-bottom: 1px solid #2b3a55;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          text-align: center;
        }
        table.stats th:first-child,
        table.stats td:first-child {
          text-align: left;
        }
        .awards {
          list-style: none;
          padding: 0;
          margin: var(--ddd-spacing-4, 16px) 0;
          display: grid;
          gap: var(--ddd-spacing-2, 8px);
        }
        .awards strong {
          color: var(--yh-gold);
          display: block;
          font-size: 12px;
          text-transform: uppercase;
        }
        .round {
          margin: var(--ddd-spacing-4, 16px) 0;
        }
        .round ul {
          list-style: none;
          margin: var(--ddd-spacing-2, 8px) 0 0;
          padding: 0;
          display: grid;
          gap: var(--ddd-spacing-2, 8px);
        }
        .round li {
          background: #182035;
          border: 1px solid #2b3a55;
          border-radius: var(--ddd-radius-xs, 2px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-2, 8px);
        }
        .round li.mine {
          border-color: var(--yh-pink);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .teams {
            grid-template-columns: 1fr;
          }
          .stands {
            height: 72px;
          }
          .fan {
            width: 22px;
            height: 34px;
          }
          .fan rpg-character {
            width: 26px;
            height: 34px;
          }
          .phone canvas {
            width: 120px;
            height: 200px;
          }
          .bubble {
            margin-bottom: 40px;
          }
        }
      `,
    ]
  }

  render() {
    return html`
      <div class="shell">
        ${this._screen === 'title' && !this.attract ? this.renderTitle() : nothing}
        ${this._screen === 'select' ? this.renderSelect() : nothing}
        ${this._screen === 'bracket' ? this.renderBracket() : nothing}
        ${this._screen === 'playing' ? this.renderGame() : nothing}
        ${this._screen === 'final' ? this.renderFinal() : nothing}
        <div class="sr-only" aria-live="polite">${this._announce}</div>
      </div>
    `
  }

  renderTitle() {
    return html`
      <div class="title-screen">
        <h2 class="logo">${this.t.title}</h2>
        <p class="tagline">${this.t.tagline}</p>
        <div class="crest-row" aria-hidden="true">
          ${TEAMS.map((t) => html`<img src="${crestUrl(t.crest)}" width="64" height="64" alt="" />`)}
        </div>
        <button
          class="primary"
          @click=${() => {
            this.audio.start()
            this.audio.startLoop()
            this._screen = 'select'
          }}
        >
          ${this.t.start}
        </button>
      </div>
    `
  }

  renderTeamPicker(which) {
    const value = which === 'home' ? this.home : this.away
    const other = which === 'home' ? this.away : this.home
    return html`
      <fieldset>
        <legend>${which === 'home' ? this.t.homeTeam : this.t.awayTeam}</legend>
        <div class="choices">
          ${TEAMS.map(
            (t) => html`
              <label class="choice">
                <input
                  type="radio"
                  name="${which}"
                  .checked=${value === t.id}
                  ?disabled=${other === t.id}
                  @change=${() => {
                    this[which] = t.id
                  }}
                />
                <span><img src="${crestUrl(t.crest)}" width="28" height="28" alt="" />${t.name}</span>
              </label>
            `,
          )}
        </div>
      </fieldset>
    `
  }

  renderSelect() {
    const level = getLevel(this.level)
    const rules = buildRules(this.level, { roller: this.roller })
    const rows = [{ id: 'kb', label: this._touchVisible() ? `${this.t.keyboard} / ${this.t.touch}` : this.t.keyboard }]
    this._pads.forEach((p) => rows.push({ id: p.id, label: `${this.t.gamepad} ${p.index + 1}` }))
    const homes = Object.values(this.humans())
    return html`
      <form
        class="select"
        @submit=${(e) => {
          e.preventDefault()
          this.startFromSelect()
        }}
      >
        <h2 class="logo" style="font-size: var(--ddd-font-size-l, 32px)">${this.t.title}</h2>
        <div class="teams">${this.renderTeamPicker('home')} ${this.renderTeamPicker('away')}</div>
        <fieldset>
          <legend>${this.t.ageLevel}</legend>
          <div class="choices">
            ${LEVELS.map(
              (l) => html`
                <label class="choice">
                  <input
                    type="radio"
                    name="level"
                    .checked=${this.level === l.id}
                    @change=${() => {
                      this.level = l.id
                    }}
                  />
                  <span>${l.label}</span>
                </label>
              `,
            )}
          </div>
          <p class="blurb">
            <strong>${rules.surface.label}, ${rules.skaters} on ${rules.skaters}.</strong>
            ${rules.checking ? 'Body checking allowed.' : 'No body checking.'} ${rules.offsides ? 'Offsides and icing.' : 'No offsides or icing.'}
            ${rules.keepScore ? 'Score is kept.' : 'No scoreboard.'} ${level.blurb}
          </p>
        </fieldset>
        <div class="teams">
          <fieldset>
            <legend>${this.t.surface}</legend>
            <div class="choices">
              <label class="choice"
                ><input type="radio" name="surface" .checked=${!this.roller} @change=${() => (this.roller = false)} /><span>${this.t.ice}</span></label
              >
              <label class="choice"
                ><input type="radio" name="surface" .checked=${this.roller} @change=${() => (this.roller = true)} /><span>${this.t.rollerLabel}</span></label
              >
            </div>
          </fieldset>
          <fieldset>
            <legend>${this.t.modeLabel}</legend>
            <div class="choices">
              <label class="choice"
                ><input type="radio" name="mode" .checked=${this.mode === 'exhibition'} @change=${() => (this.mode = 'exhibition')} /><span>${this.t.exhibition}</span></label
              >
              <label class="choice"
                ><input type="radio" name="mode" .checked=${this.mode === 'tournament'} @change=${() => (this.mode = 'tournament')} /><span
                  >${this.t.tournamentLabel}${rules.keepScore ? '' : ' (jamboree)'}</span
                ></label
              >
            </div>
          </fieldset>
        </div>
        <fieldset>
          <legend>${this.t.ref}</legend>
          <div class="choices">
            <label class="choice"
              ><input type="radio" name="ruleset" .checked=${this.ruleset === 'standard'} @change=${() => (this.ruleset = 'standard')} /><span>${this.t.standard}</span></label
            >
            <label class="choice"
              ><input type="radio" name="ruleset" .checked=${this.ruleset === 'jay'} @change=${() => (this.ruleset = 'jay')} /><span>${this.t.jay}</span></label
            >
          </div>
          <label class="blurb strict-label" for="strict">${this.t.strictnessLabel}: ${this.strictness}%</label>
          <input
            id="strict"
            type="range"
            min="0"
            max="100"
            step="5"
            .value=${String(this.strictness)}
            ?disabled=${this.ruleset === 'jay'}
            @input=${(e) => {
              this.strictness = parseInt(e.target.value, 10)
            }}
          />
        </fieldset>
        <fieldset>
          <legend>${this.t.controllers}</legend>
          <table class="controllers">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">${getTeam(this.home).short}</th>
                <th scope="col">${this.t.cpu}</th>
                <th scope="col">${getTeam(this.away).short}</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(
                (r) => html`
                  <tr>
                    <th scope="row">
                      <span class="dot" style="background:${CONTROLLER_COLORS[r.id]}"></span>${r.label} (P${CONTROLLER_LABELS[r.id]})
                    </th>
                    ${['home', 'cpu', 'away'].map(
                      (side) => html`
                        <td>
                          <input
                            type="radio"
                            name="ctl-${r.id}"
                            aria-label="${r.label}: ${side === 'cpu' ? this.t.cpu : getTeam(this[side]).name}"
                            .checked=${(this._assign[r.id] || 'cpu') === side}
                            @change=${() => {
                              this._assign = Object.assign({}, this._assign, { [r.id]: side })
                            }}
                          />
                        </td>
                      `,
                    )}
                  </tr>
                `,
              )}
            </tbody>
          </table>
          <p class="blurb">
            ${this._pads.length ? 'Gamepads: push left or right to pick a side, press A or Start to play.' : 'Plug in up to four gamepads and press a button to see them here.'}
            ${homes.length === 0 ? html`<span class="warn">Everyone is on CPU: you'll be watching.</span>` : nothing}
          </p>
        </fieldset>
        <div class="start-row">
          <button class="primary" type="submit" ?disabled=${this.home === this.away}>${this.t.play}</button>
          <button type="button" @click=${this.toggleMute}>${this._muted ? this.t.unmute : this.t.mute}</button>
        </div>
        <p class="blurb">${this.t.controlsHelp}</p>
      </form>
    `
  }

  renderStands() {
    const fansOf = (p) =>
      p.fans.map((seed) => {
        const fx = this._fx[p.uid]
        const kind = this._fanFx[seed] ? 'fight' : fx ? fx.kind : ''
        // super fans go further than everyone else
        let cls = ''
        if (kind === 'fight') cls = 'fight'
        else if (kind === 'wild') cls = p.superFans ? 'wild' : 'jump'
        else if (kind === 'jump') cls = p.superFans ? 'wild' : 'jump'
        else if (kind === 'money') cls = 'jump'
        const expression = kind === 'angry' || kind === 'fight' ? 'angry' : kind === 'wild' || kind === 'jump' ? 'happy' : 'none'
        return html`
          <div class="fan ${cls}">
            ${kind === 'money' && p.superFans ? html`<span class="bill">$</span>` : nothing}
            ${kind === 'money' && !p.superFans && this.game && !this.game.rules.keepScore ? html`<span class="bill">$</span>` : nothing}
            <rpg-character seed="${seed}" height="46" width="36" expression="${expression}" pose="${cls === 'wild' ? 'cheer' : 'none'}" reduce-motion></rpg-character>
          </div>
        `
      })
    const side = (s) =>
      html`<div class="side ${s}">
        ${(this._lineup[s] || []).map((p) => html`<div class="section">${fansOf(p)}<span class="tag">#${p.number}</span></div>`)}
      </div>`
    return html`<div class="stands" aria-hidden="true">${side('home')}${side('away')}</div>`
  }

  renderGame() {
    const touchOn = this._touch && !this.attract
    return html`
      ${this.attract ? nothing : this.renderStands()}
      <div class="stage" tabindex="0" role="application" aria-label="Hockey rink. ${this.t.controlsHelp}">
        <canvas id="rink" width="256" height="224"></canvas>
        ${this.renderOverlay()}
      </div>
      ${this.attract
        ? nothing
        : html`
            <div
              class="touch ${touchOn || this._touchVisible() ? 'on' : ''}"
              @pointerdown=${this.touchDown}
              @pointermove=${this.touchMove}
              @pointerup=${this.touchUp}
              @pointercancel=${this.touchUp}
            >
              <div class="joy" data-joy><div class="knob"></div></div>
              <div class="pad-buttons">
                <button data-btn="pass">PASS</button>
                <button data-btn="shoot">SHOOT</button>
                <button data-btn="check">CHECK</button>
                <button data-btn="stick">STICK</button>
              </div>
            </div>
            <div class="toolbar">
              <button @click=${() => (this._overlay = 'pause')}>${this.t.pause}</button>
              <button @click=${this.saveClip}>${this.t.saveClip}</button>
              <button @click=${this.toggleMute}>${this._muted ? this.t.unmute : this.t.mute}</button>
              <span class="spacer"></span>
              <button @click=${this.quit}>${this.t.quit}</button>
            </div>
            <p class="help">${this._touchVisible() ? this.t.touchHelp : this.t.controlsHelp}</p>
          `}
    `
  }

  _touchVisible() {
    return globalThis.matchMedia && globalThis.matchMedia('(pointer: coarse)').matches
  }

  touchDown(e) {
    if (!this._touch) {
      this._touch = true
      this.input.touch.active = true
      // touch drives player 1; if player 1 was left on CPU, put them on home
      if (this.game && !this.game.controllers.kb) {
        this._assign = Object.assign({}, this._assign, { kb: 'home' })
        this.game.controllers.kb = 'home'
        this.game.reassignControllers()
      }
    }
    const btn = e.target.closest ? e.target.closest('[data-btn]') : null
    if (btn) {
      this.input.touch[btn.dataset.btn] = true
      this.input.tap(btn.dataset.btn)
      e.preventDefault()
      return
    }
    if (e.target.closest && e.target.closest('[data-joy]')) {
      this._joyId = e.pointerId
      try {
        e.target.setPointerCapture(e.pointerId)
      } catch (err) {
        // capture is a nicety; the joystick works without it
      }
      this.touchMove(e)
    }
  }

  touchMove(e) {
    if (e.pointerId !== this._joyId) return
    const joy = this.shadowRoot.querySelector('[data-joy]')
    const r = joy.getBoundingClientRect()
    let dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    let dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    const l = Math.hypot(dx, dy)
    if (l > 1) {
      dx /= l
      dy /= l
    }
    this.input.touch.x = Math.abs(dx) < 0.15 ? 0 : dx
    this.input.touch.y = Math.abs(dy) < 0.15 ? 0 : dy
    const knob = joy.querySelector('.knob')
    knob.style.transform = `translate(${dx * 36}px, ${dy * 36}px)`
  }

  touchUp(e) {
    const btn = e.target.closest ? e.target.closest('[data-btn]') : null
    if (btn) this.input.touch[btn.dataset.btn] = false
    if (e.pointerId === this._joyId) {
      this._joyId = null
      this.input.touch.x = 0
      this.input.touch.y = 0
      const knob = this.shadowRoot.querySelector('.knob')
      if (knob) knob.style.transform = ''
    }
  }

  renderOverlay() {
    if (this._overlay === 'pause') {
      return html`<div class="overlay">
        <div class="card" role="dialog" aria-label="${this.t.pause}">
          <h3>${this.t.pause}</h3>
          <p>${this.t.controlsHelp}</p>
          <div class="actions">
            <button class="primary" @click=${this.closeOverlay}>${this.t.resume}</button>
            <button @click=${this.saveClip}>${this.t.saveClip}</button>
            <button @click=${this.quit}>${this.t.quit}</button>
          </div>
        </div>
      </div>`
    }
    if (this._overlay === 'penalty' && this._penalty) {
      const p = this._penalty
      return html`<div class="overlay" @click=${this.closeOverlay}>
        <div class="card penalty" role="alert">
          <div class="label">${p.label}</div>
          <p><strong>#${p.number} ${p.name}</strong>, ${p.team}. Two minutes.</p>
          <p class="signal">Ref signal: ${p.signal}.</p>
          <p>${p.explain}</p>
          <p class="hint">Press pass to continue.</p>
        </div>
      </div>`
    }
    if (this._overlay === 'intermission' && this._intermission) {
      const m = this._intermission
      const subject = m.subject ? this.entity(m.subject) : null
      const team = this.game.teams[m.side]
      return html`<div class="overlay">
        <div class="card intermission" role="dialog" aria-labelledby="int-title">
          ${subject
            ? html`<div class="people" aria-hidden="true">
                <rpg-character seed="${subject.player.fans[0]}" height="72" width="56" expression="${m.result ? 'happy' : 'none'}"></rpg-character>
                <rpg-character seed="${subject.player.id}" preset="${team.def.crest}" height="72" width="56"></rpg-character>
              </div>`
            : nothing}
          <div class="hint">End of period ${m.period}</div>
          <h3 id="int-title">${m.title}</h3>
          <p>${m.body}</p>
          ${m.result
            ? html`<p><strong>${m.result}</strong></p>
                <div class="actions">
                  <button class="primary continue" @click=${this.endIntermission}>Start period ${this.game.period}</button>
                </div>`
            : html`<div class="actions stack">
                ${m.choices.map((c, i) => html`<button @click=${() => this.chooseIntermission(i)}>${c}</button>`)}
              </div>`}
        </div>
      </div>`
    }
    if (this._overlay === 'phone' && this._phone) {
      return html`<div class="overlay" @click=${this.closeOverlay}>
        <div class="phone-wrap">
          <div class="caller" aria-hidden="true">
            <rpg-character seed="${this._phone.fan}" item="phone" height="82" width="64" expression="happy"></rpg-character>
          </div>
          <div class="phone">
            <span class="rec">REC #${this._phone.number}</span>
            <canvas id="phone-canvas" width="120" height="200"></canvas>
          </div>
          <div class="bubble">${this._phone.line}</div>
        </div>
      </div>`
    }
    if (this._overlay === 'clip' && this._clip) {
      const c = this._clip
      return html`<div class="overlay">
        <div class="card" role="dialog" aria-label="${this.t.saveClip}">
          <h3>${this.t.saveClip}</h3>
          ${c.error
            ? html`<p>${c.error}</p>`
            : c.url
              ? html`<p>Your last 10 seconds are ready to share.</p>`
              : html`<p>Recording the replay… ${c.progress}%</p>
                  <progress max="100" .value=${c.progress}></progress>`}
          <div class="actions">
            ${c.url ? html`<a class="button primary" href="${c.url}" download="${c.name}">Download clip</a>` : nothing}
            <button @click=${this.closeClip} ?disabled=${!c.url && !c.error}>Back to the game</button>
          </div>
        </div>
      </div>`
    }
    return nothing
  }

  renderFinal() {
    const f = this._final
    if (!f || !this.match) return nothing
    const r = f.result
    const teams = this.match.teams
    const called = r.reason && r.reason.startsWith('called')
    let headline = 'Final'
    if (called) headline = 'Game called: not enough players left'
    else if (!r.keepScore) headline = 'Good game! Nobody kept score.'
    else if (r.reason === 'overtime') headline = 'Final in overtime'
    else if (r.reason === 'shootout') headline = 'Final in a shootout'
    const t = this.tournament
    return html`
      <div class="final">
        <h2>${headline}</h2>
        <div class="scoreline">
          <div class="team"><img src="${crestUrl(teams.home.crest)}" width="56" height="56" alt="" />${teams.home.name}</div>
          <div class="big">${r.keepScore ? html`${r.home} – ${r.away}` : html`🏅`}</div>
          <div class="team"><img src="${crestUrl(teams.away.crest)}" width="56" height="56" alt="" />${teams.away.name}</div>
        </div>
        <table class="stats">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">${teams.home.short}</th>
              <th scope="col">${teams.away.short}</th>
            </tr>
          </thead>
          <tbody>
            ${[
              ['Shots on goal', 'shots'],
              ['Passes', 'passes'],
              ['Hits', 'hits'],
              ['Penalty minutes', 'pim'],
            ].map(
              (row) => html`<tr>
                <th scope="row">${row[0]}</th>
                <td>${f.stats.home[row[1]]}</td>
                <td>${f.stats.away[row[1]]}</td>
              </tr>`,
            )}
          </tbody>
        </table>
        <ul class="awards">
          ${f.awards.map((a) => html`<li><strong>${a.label}</strong>${a.who}</li>`)}
        </ul>
        <div class="start-row">
          ${t && !t.done
            ? html`<button
                class="primary"
                @click=${() => {
                  this._screen = 'bracket'
                }}
              >
                ${t.jamboree ? 'Next jamboree game' : 'See the bracket'}
              </button>`
            : nothing}
          ${t && t.done
            ? html`<button
                class="primary"
                @click=${() => {
                  this._screen = 'bracket'
                }}
              >
                ${t.jamboree ? 'Medals for everyone' : 'Tournament results'}
              </button>`
            : nothing}
          ${!t ? html`<button class="primary" @click=${() => this.newGame(this.game.opts.home, this.game.opts.away)}>Play again</button>` : nothing}
          <button @click=${this.quit}>Change teams</button>
        </div>
      </div>
    `
  }

  renderBracket() {
    const t = this.tournament
    if (!t) return nothing
    const name = (id) => (id ? getTeam(id).name : 'TBD')
    const next = t.next()
    return html`
      <div class="bracket">
        <h2>${t.jamboree ? `${getLevel(this.level).label} Jamboree` : `${getLevel(this.level).label} Tournament`}</h2>
        ${t.jamboree
          ? html`<p class="blurb">Three games, no standings, no bracket. Everybody plays, everybody gets a medal. Somebody's parent is still keeping score in a notebook.</p>`
          : nothing}
        ${t.rounds.map(
          (round) => html`
            <div class="round">
              <h3>${round.name}</h3>
              <ul>
                ${round.games.map(
                  (g) => html`<li class="${g.user ? 'mine' : ''}">
                    <span>${name(g.home)} vs ${name(g.away)}</span>
                    <span>${g.played ? (t.jamboree ? 'Played' : `${g.score.home} – ${g.score.away}${g.winner ? `, ${getTeam(g.winner).short} advance` : ''}`) : g.user ? 'Your game' : ''}</span>
                  </li>`,
                )}
              </ul>
            </div>
          `,
        )}
        ${t.done
          ? html`<h3>${t.jamboree ? 'Everybody gets a medal 🏅' : t.champion === t.team ? `${name(t.champion)} are champions! 🏆` : `${name(t.champion)} win the tournament.`}</h3>`
          : nothing}
        <div class="start-row">
          ${next ? html`<button class="primary" @click=${this.playNextTournamentGame}>Play ${name(next.home)} vs ${name(next.away)}</button>` : nothing}
          <button @click=${this.quit}>Back to the menu</button>
        </div>
      </div>
    `
  }

  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: "Youth Hockey '27",
        description: 'A 16-bit youth hockey game. Set attract mode to embed a CPU vs CPU demo of an age level.',
        icon: 'maps:directions-run',
        color: 'pink',
        tags: ['Interactive', 'game', 'hockey'],
        handles: [],
        meta: { author: 'btopro' },
      },
      settings: {
        configure: [
          {
            property: 'level',
            title: 'Age level',
            inputMethod: 'select',
            options: LEVELS.reduce((o, l) => Object.assign(o, { [l.id]: l.label }), {}),
          },
          {
            property: 'home',
            title: 'Home team',
            inputMethod: 'select',
            options: TEAMS.reduce((o, t) => Object.assign(o, { [t.id]: t.name }), {}),
          },
          {
            property: 'away',
            title: 'Away team',
            inputMethod: 'select',
            options: TEAMS.reduce((o, t) => Object.assign(o, { [t.id]: t.name }), {}),
          },
          { property: 'roller', title: 'Roller', inputMethod: 'boolean' },
          { property: 'attract', title: 'Attract mode (CPU demo)', inputMethod: 'boolean' },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: 'youth-hockey-27',
          properties: { level: '8U', attract: true },
          content: '',
        },
      ],
    }
  }
}

globalThis.customElements.define(YouthHockey27.tag, YouthHockey27)
