/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// <youth-hockey-27>: Youth Sports 27, a 16-bit youth hockey game. The age
// level sets the surface, the team size and the rules; the stands hold up a
// mirror to what money and pressure do to kids' sports.
//
// Lit comes through the HAXcms theme module so the site's import map serves
// it, the same copy every other HAX element on the page uses.
import { html } from '@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js'
import { DDD } from '@haxtheweb/d-d-d/d-d-d.js'
import '@haxtheweb/rpg-character/rpg-character.js'
import { Game } from './engine/game.js'
import { LEVELS, VENUES, getLevel, buildRules } from './engine/ages.js'
import { TEAMS, getTeam } from './engine/teams.js'
import { PENALTIES } from './engine/penalties.js'
import { createRng } from './engine/rng.js'
import { GUESTS, EQUIPMENT, MODIFIERS, COMBO, lookupCode, unlockKey, describeUnlock, ALL_UNLOCKS } from './engine/cheats.js'
import { Renderer, CONTROLLER_COLORS, CONTROLLER_LABELS } from './lib/renderer.js'
import { ChipAudio } from './lib/audio.js'
import { InputManager } from './lib/input.js'
import { ReplayBuffer, recordClip, canRecordClips } from './lib/replay.js'
import { Tournament } from './lib/tournament.js'
import { colorDistance } from './lib/sprites.js'
import { drawCrest, CRESTS } from './lib/crests.js'
import { Intro, INTRO } from './lib/intro.js'
import { ArcadeBg, SECTIONS, iconUrl } from './lib/arcade.js'
import { Brawl } from './lib/brawl.js'
import { Unlocks } from './lib/unlocks.js'
import { pickHighlights, composePost, highlightLabel, commentsFor, likesFor } from './lib/bookface.js'
import { styles } from './lib/styles.js'

const DT = 1 / 60
const OPTIONS_KEY = 'youth-sports-27:options'

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

const BRAWL_LINES = [
  'Rink security walks both of them to the parking lot.',
  'The snack bar lady breaks it up with a mop.',
  'A grandparent films the whole thing. It has more views than any goal.',
  'Both parents are banned for the rest of the game. The kids pretend not to know them.',
]

const stripEdges = (inputs) => {
  const out = {}
  for (const id of Object.keys(inputs)) {
    out[id] = Object.assign({}, inputs[id], { pass: false, shoot: false, check: false, stick: false, pause: false, clip: false, confirm: false, back: false })
  }
  return out
}

const loadOptions = () => {
  const base = { intro: true, brawls: true, bookface: true }
  try {
    const raw = globalThis.localStorage.getItem(OPTIONS_KEY)
    if (raw) return Object.assign(base, JSON.parse(raw))
  } catch (e) {
    // storage unavailable: defaults for this visit
  }
  return base
}

const saveOptions = (opts) => {
  try {
    globalThis.localStorage.setItem(OPTIONS_KEY, JSON.stringify(opts))
  } catch (e) {
    // storage unavailable: the setting lasts for this visit
  }
}

// cycle through a list, wrapping
const step = (list, cur, d) => {
  const i = Math.max(0, list.indexOf(cur))
  return list[(i + d + list.length) % list.length]
}

const HOWTO = [
  {
    id: 'controls',
    title: 'Controls',
    body: [
      'Arrows or WASD skate. Z passes, or switches to the skater nearest the puck when you do not have it.',
      'X shoots, or poke checks on defense. C body checks (only where checking is allowed). V is a stick play: it might take the puck, it might take a penalty.',
      'P pauses. R saves the last 10 seconds as a clip. F goes full screen.',
      'Gamepads: A pass, B shoot, X check, Y stick, Start pause. Up to four, plus touch controls on phones.',
    ],
  },
  {
    id: 'levels',
    title: 'Age levels',
    body: [
      '8U plays cross-ice, 3 on 3, with small nets and no scoreboard. 10U and 12U play half ice. 14U and up play full ice, 5 on 5, with offsides, icing and body checking.',
      'Every period is five minutes. The buzzer at the younger levels changes everyone at once: everybody plays.',
      'AAA and the Beer League are the only places fights happen. Fight, and you are ejected.',
    ],
  },
  {
    id: 'venues',
    title: 'Venues',
    body: [
      'The rink has refs, a crowd and all the pressure that comes with them.',
      'Roller: 4 on 4, no offsides, no icing.',
      'Pond hockey and street hockey: no refs, no crowd, no scoreboard operator. Nobody comes to watch, so every kid plays way better. Pond has no goalies, just tiny nets and whoever is closest.',
    ],
  },
  {
    id: 'parents',
    title: 'The stands',
    body: [
      'Every kid has 1 to 8 fans in the stands. The kids with the most exposure have the loudest fans, and they pass the least.',
      'Score a pretty one and a parent may film it for the agent. At the youngest levels, nobody keeps score: the parents wave dollar bills instead.',
      'Between periods a parent gets an idea. You decide what happens.',
    ],
  },
  {
    id: 'brawl',
    title: 'Parent brawls',
    body: [
      'When the ref misses a call, two parents may square off in the stands. You play your kid’s parent.',
      'Hold LEFT or RIGHT to dodge, DOWN to block. Z jabs, X hooks, hold UP to punch high. Dodge a punch and counter for a star, then C throws the star punch.',
      'Nobody wins. The crowd sours, both kids are rattled and both parents are banned.',
    ],
  },
  {
    id: 'bookface',
    title: 'BookFace',
    body: [
      'After the first and second periods, a parent posts highlights from the period to BookFace. Pick up to four.',
      'The post never matches the clips. Losing? Billy has played a lot today. Up by one? The coaches are amazing.',
    ],
  },
  {
    id: 'sticks',
    title: 'Sticks',
    body: [
      'One composite stick breaks every game. It costs $349. You get a close-up.',
      'The kid has no stick until the next whistle. Wooden sticks never break, if you can find the code.',
    ],
  },
  {
    id: 'cheats',
    title: 'Cheats',
    body: [
      'Type codes on the EXTRAS screen. A few hints: the guy who drives the ice machine. Who brought the orange slices. A tall hairy legend. Every team has a mascot.',
      'Equipment: a $400 stick made of gold. Skates with ROCKETS. The way it was done in the OLD SCHOOL.',
      'Game changers: everyone gets BIG HEADS, the ice turns pink, the puck catches fire, goalies shrink.',
      'Old gamers know a certain button code works on any menu. Here it ends with check and stick.',
    ],
  },
]

export class YouthHockey27 extends DDD {
  static get tag() {
    return 'youth-hockey-27'
  }

  static get properties() {
    return {
      ...super.properties,
      level: { type: String, reflect: true },
      home: { type: String },
      away: { type: String },
      venue: { type: String },
      roller: { type: Boolean },
      mode: { type: String },
      ruleset: { type: String },
      strictness: { type: Number },
      attract: { type: Boolean, reflect: true },
      skipIntro: { type: Boolean, attribute: 'skip-intro' },
      _screen: { state: true },
      _menu: { state: true },
      _howto: { state: true },
      _guest: { state: true },
      _equipment: { state: true },
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
      _toast: { state: true },
      _pip: { state: true },
      _book: { state: true },
      _opts: { state: true },
      _introStarted: { state: true },
      _cheat: { state: true },
      _fullscreen: { state: true },
    }
  }

  constructor() {
    super()
    this.level = '10U'
    this.home = 'sparkle-selects'
    this.away = 'jesus-selects'
    this.venue = 'rink'
    this.roller = false
    this.mode = 'exhibition'
    this.ruleset = 'standard'
    this.strictness = 50
    this.attract = false
    this.skipIntro = false
    this._opts = loadOptions()
    this._screen = 'intro'
    this._menu = 'hub'
    this._howto = 0
    this._guest = ''
    this._equipment = ''
    this._overlay = null
    this._assign = { kb: 'home', touch: 'home', pad0: 'home', pad1: 'away', pad2: 'home', pad3: 'away' }
    this._pads = []
    this._lineup = { home: [], away: [] }
    this._fx = {}
    this._fanFx = {}
    this._banned = new Set()
    this._intermission = null
    this._penalty = null
    this._phone = null
    this._clip = null
    this._final = null
    this._announce = ''
    this._toast = null
    this._pip = null
    this._book = null
    this._brawl = null
    this._cheat = ''
    this._combo = []
    this._fullscreen = false
    this._introStarted = false
    this._introCues = new Set()
    this.audio = new ChipAudio()
    this._muted = this.audio.muted
    this.input = new InputManager(this)
    this.unlocks = new Unlocks()
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
    this._moments = []
    this._streak = { side: null, n: 0 }
    this.t = {
      title: 'Youth Sports 27',
      pause: 'Pause',
      resume: 'Resume',
      quit: 'Quit to menu',
      saveClip: 'Save clip',
      fullscreen: 'Full screen',
      exitFullscreen: 'Exit full screen',
      mute: 'Sound off',
      unmute: 'Sound on',
      touchHelp: 'Joystick skates. PASS passes or switches player, SHOOT shoots or poke checks, CHECK body checks, STICK is a stick play.',
      controlsHelp: 'Arrows skate. Z pass or switch player. X shoot or poke check. C body check. V stick play. P pause. R save a clip. F full screen.',
    }
  }

  // ---------- lifecycle ----------

  connectedCallback() {
    super.connectedCallback()
    // the arcade font lives in the page so the shadow DOM can use it
    const d = globalThis.document
    if (!d.querySelector('link[data-youth-sports-font]')) {
      const link = d.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
      link.setAttribute('data-youth-sports-font', '')
      d.head.appendChild(link)
    }
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
    this._onFullscreen = () => {
      const d = globalThis.document
      this._fullscreen = (d.fullscreenElement || d.webkitFullscreenElement) === this
    }
    globalThis.document.addEventListener('fullscreenchange', this._onFullscreen)
    globalThis.document.addEventListener('webkitfullscreenchange', this._onFullscreen)
    this._onKey = (e) => this.onKey(e)
    this.addEventListener('keydown', this._onKey)
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
    globalThis.document.removeEventListener('fullscreenchange', this._onFullscreen)
    globalThis.document.removeEventListener('webkitfullscreenchange', this._onFullscreen)
    this.removeEventListener('keydown', this._onKey)
    if (this._io) this._io.disconnect()
    if (this._raf) globalThis.cancelAnimationFrame(this._raf)
    this.audio.stop()
    if (this._clip && this._clip.url) globalThis.URL.revokeObjectURL(this._clip.url)
    super.disconnectedCallback()
  }

  firstUpdated(changed) {
    if (super.firstUpdated) super.firstUpdated(changed)
    if (this.roller && this.venue === 'rink') this.venue = 'roller'
    if (this.home === this.away) this.away = TEAMS.find((t) => t.id !== this.home).id
    if (this.attract) this.startAttract()
    else if (this.skipIntro || !this._opts.intro) this._screen = 'menu'
  }

  updated(changed) {
    if (super.updated) super.updated(changed)
    if (this._overlay === 'bookface' && this._book && !this._book.drawn) this.drawThumbs()
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
      if (typing) return false
      return path.includes(this) || globalThis.document.activeElement === globalThis.document.body || this._fullscreen
    }
    return false
  }

  // ---------- keyboard for the intro, the menus and full screen ----------

  onKey(e) {
    if (this.attract) return
    const path = e.composedPath ? e.composedPath() : []
    const target = path[0] || e.target
    const tag = target && target.tagName ? target.tagName.toLowerCase() : ''
    if (tag === 'input' || tag === 'textarea') return
    const k = e.key
    // on the extras screen the keyboard types the code wherever focus is
    if (this._screen === 'menu' && this._menu === 'extras' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (/^[a-z]$/i.test(k)) {
        this._cheat = (this._cheat + k.toUpperCase()).slice(0, 16)
        e.preventDefault()
        return
      }
      if (k === 'Backspace') {
        this._cheat = this._cheat.slice(0, -1)
        e.preventDefault()
        return
      }
    }
    if (k === 'f' || k === 'F') {
      this.toggleFullscreen()
      e.preventDefault()
      return
    }
    if (this._screen === 'intro') {
      if (k === 'Enter' || k === ' ') {
        e.preventDefault()
        this.introPress()
      }
      return
    }
    if (this._screen === 'playing') return
    const dirs = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    if (dirs[k]) {
      e.preventDefault()
      this.comboPush(dirs[k])
      this.menuMove(dirs[k])
      return
    }
    if (k === 'c' || k === 'C') this.comboPush('check')
    else if (k === 'v' || k === 'V') this.comboPush('stick')
    else if (k === 'Escape' || k === 'Backspace') {
      e.preventDefault()
      this.menuBack()
    }
  }

  // ---------- full screen ----------

  toggleFullscreen() {
    const d = globalThis.document
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      if (d.exitFullscreen) d.exitFullscreen()
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen()
      return
    }
    const req = this.requestFullscreen || this.webkitRequestFullscreen
    if (!req) {
      this.toast('No full screen here. On iPhone: Share, then Add to Home Screen.')
      return
    }
    try {
      const p = req.call(this)
      if (p && p.catch) p.catch(() => this.toast('Full screen was blocked by the browser.'))
    } catch (err) {
      this.toast('Full screen was blocked by the browser.')
    }
    this.updateComplete.then(() => {
      const stage = this.shadowRoot.querySelector('.stage')
      if (stage && this._screen === 'playing') stage.focus()
    })
  }

  toast(text, ms) {
    this._toast = text
    globalThis.clearTimeout(this._toastTimer)
    this._toastTimer = globalThis.setTimeout(() => {
      this._toast = null
    }, ms || 2600)
    this.say(text)
  }

  // ---------- intro ----------

  introPress() {
    const t = this.introTime()
    if (!this._introStarted) {
      this.audio.start()
      this._introStarted = true
      this._introStart = performance.now()
      this._introCues = new Set()
      return
    }
    if (t < INTRO.prompt) {
      // skip ahead to the logo
      this._introStart = performance.now() - INTRO.prompt * 1000
      if (!this._introCues.has('roar')) {
        this._introCues = new Set(['tv', 'youth', 'sports', 'num', 'roar'])
        this.audio.play('slam')
        this.audio.roar()
      }
      return
    }
    this.audio.play('select')
    this.audio.startLoop()
    this.goMenu('hub')
  }

  introTime() {
    return this._introStarted ? (performance.now() - this._introStart) / 1000 : 0
  }

  // sounds land on the beats of the intro
  introCue(t) {
    const cue = (id, at, fn) => {
      if (t >= at && !this._introCues.has(id)) {
        this._introCues.add(id)
        fn()
      }
    }
    const a = this.audio
    cue('tv', INTRO.lineOn, () => a.play('tv-on'))
    cue('youth', INTRO.youth, () => a.play('slam'))
    cue('sports', INTRO.sports, () => a.play('slam'))
    cue('num', INTRO.num, () => {
      a.play('slam')
      a.roar()
    })
    cue('roar', INTRO.num + 0.4, () => a.announce('Youth Sports Twenty Seven'))
    cue('title', INTRO.tagline, () => this.say('Youth Sports 27. It’s in the minivan. Press start.'))
  }

  // ---------- menus ----------

  goMenu(id) {
    this._screen = 'menu'
    this._menu = id
    this.focusFirst()
  }

  focusFirst() {
    this.updateComplete.then(() => {
      const first = this.shadowRoot.querySelector('.menu [data-nav]')
      if (first) first.focus({ preventScroll: true })
    })
  }

  menuBack() {
    if (this._screen === 'menu') {
      if (this._menu === 'hub') return
      this.audio.play('back')
      this.goMenu('hub')
    } else if (this._screen === 'bracket' || this._screen === 'final') {
      this.audio.play('back')
      this.quit()
    }
  }

  navList() {
    return Array.from(this.shadowRoot.querySelectorAll('.menu [data-nav]')).filter((el) => !el.disabled)
  }

  menuMove(dir) {
    const list = this.navList()
    if (!list.length) return
    const cur = this.shadowRoot.activeElement
    let i = list.indexOf(cur)
    if (i < 0) {
      list[0].focus({ preventScroll: true })
      return
    }
    // left and right change a setting
    if ((dir === 'left' || dir === 'right') && cur.dataset.cycle) {
      this.cycleRow(cur.dataset.cycle, dir === 'left' ? -1 : 1)
      return
    }
    // grids (the hub tiles and the on-screen keyboard) move in two dimensions
    const cols = parseInt(cur.dataset.cols || '1', 10)
    let d = 0
    if (dir === 'up') d = -cols
    else if (dir === 'down') d = cols
    else if (cols > 1) d = dir === 'left' ? -1 : 1
    if (!d) return
    i = Math.max(0, Math.min(list.length - 1, i + d))
    if (list[i] !== cur) {
      list[i].focus({ preventScroll: true })
      this.audio.play('menu')
    }
  }

  // the konami-ish button code: unlocks everything
  comboPush(token) {
    this._combo.push(token)
    if (this._combo.length > COMBO.length) this._combo.shift()
    if (this._combo.length === COMBO.length && this._combo.every((t, i) => t === COMBO[i])) {
      this._combo = []
      const added = this.unlocks.addAll()
      this.audio.play('cheat')
      this.toast(added.length ? `BUTTON CODE! ${added.length} CHEATS UNLOCKED` : 'YOU ALREADY HAVE EVERYTHING', 3200)
      this.requestUpdate()
    }
  }

  // gamepads drive the menus the same way the keyboard does
  menuPadInput(inputs) {
    for (const p of this._pads) {
      const s = inputs[p.id]
      if (!s) continue
      if (this._screen === 'intro') {
        if (s.confirm || s.pause || s.shoot) this.introPress()
        continue
      }
      if (s.navY) {
        this.comboPush(s.navY < 0 ? 'up' : 'down')
        this.menuMove(s.navY < 0 ? 'up' : 'down')
      }
      if (s.navX) {
        this.comboPush(s.navX < 0 ? 'left' : 'right')
        this.menuMove(s.navX < 0 ? 'left' : 'right')
      }
      if (s.check) this.comboPush('check')
      if (s.stick) this.comboPush('stick')
      if (s.confirm) {
        const el = this.shadowRoot.activeElement
        if (el && el.click) el.click()
        else this.focusFirst()
      } else if (s.back) this.menuBack()
      else if (s.pause && this._screen === 'menu' && this._menu === 'setup') this.startFromSelect()
    }
  }

  yourSide() {
    const sides = Object.values(this.humans())
    return sides[0] || 'home'
  }

  venueRules() {
    return buildRules(this.level, { venue: this.venue, ruleset: this.ruleset })
  }

  // the rows on the setup screen: each one cycles through its values
  setupRows() {
    const rules = this.venueRules()
    const v = VENUES[this.venue]
    const teamIds = TEAMS.map((t) => t.id)
    const guests = ['', ...this.unlocks.list('guest')]
    const gear = ['', ...this.unlocks.list('equipment')]
    const rows = [
      { id: 'mode', label: 'Mode', value: this.mode === 'tournament' ? (rules.keepScore ? 'Tournament' : 'Jamboree') : 'Exhibition' },
      { id: 'level', label: 'Age level', value: getLevel(this.level).label },
      { id: 'venue', label: 'Venue', value: v.label },
      { id: 'home', label: 'Home', value: getTeam(this.home).name, img: crestUrl(getTeam(this.home).crest) },
      { id: 'away', label: 'Away', value: getTeam(this.away).name, img: crestUrl(getTeam(this.away).crest) },
      { id: 'ruleset', label: 'Referee', value: !v.refs ? 'No refs' : this.ruleset === 'jay' ? 'Jay mode' : 'Standard', off: !v.refs },
      { id: 'strictness', label: 'Strictness', value: !v.refs || this.ruleset === 'jay' ? '--' : `${this.strictness}%`, off: !v.refs || this.ruleset === 'jay' },
    ]
    if (guests.length > 1) rows.push({ id: 'guest', label: 'Guest star', value: this._guest ? GUESTS[this._guest].name : 'None' })
    if (gear.length > 1) rows.push({ id: 'equipment', label: 'Equipment', value: this._equipment ? EQUIPMENT[this._equipment].name : 'Stock' })
    const ctl = [{ id: 'kb', label: this._touchVisible() ? 'Keys / touch' : 'Keyboard' }]
    this._pads.forEach((p) => ctl.push({ id: p.id, label: `Pad ${p.index + 1}` }))
    ctl.forEach((c) => {
      const side = this._assign[c.id] || 'cpu'
      rows.push({
        id: `ctl:${c.id}`,
        label: `P${CONTROLLER_LABELS[c.id]} ${c.label}`,
        value: side === 'cpu' ? 'CPU' : getTeam(this[side]).short,
        dot: CONTROLLER_COLORS[c.id],
      })
    })
    this._setupLists = { teamIds, guests, gear }
    return rows
  }

  cycleRow(id, d) {
    const lists = this._setupLists || { teamIds: TEAMS.map((t) => t.id), guests: [''], gear: [''] }
    const v = VENUES[this.venue]
    switch (id) {
      case 'mode':
        this.mode = this.mode === 'tournament' ? 'exhibition' : 'tournament'
        break
      case 'level':
        this.level = step(
          LEVELS.map((l) => l.id),
          this.level,
          d,
        )
        break
      case 'venue':
        this.venue = step(Object.keys(VENUES), this.venue, d)
        break
      case 'home':
      case 'away': {
        const other = id === 'home' ? this.away : this.home
        let next = step(lists.teamIds, this[id], d)
        if (next === other) next = step(lists.teamIds, next, d)
        this[id] = next
        break
      }
      case 'ruleset':
        if (!v.refs) return
        this.ruleset = this.ruleset === 'jay' ? 'standard' : 'jay'
        break
      case 'strictness':
        if (!v.refs || this.ruleset === 'jay') return
        this.strictness = Math.max(0, Math.min(100, this.strictness + d * 10))
        break
      case 'guest':
        this._guest = step(lists.guests, this._guest, d)
        break
      case 'equipment':
        this._equipment = step(lists.gear, this._equipment, d)
        break
      default:
        if (id.startsWith('ctl:')) {
          const cid = id.slice(4)
          const next = step(['home', 'cpu', 'away'], this._assign[cid] || 'cpu', d)
          this._assign = Object.assign({}, this._assign, { [cid]: next })
        }
    }
    this.audio.play('menu')
    this.updateComplete.then(() => {
      const row = this.shadowRoot.querySelector(`[data-cycle="${id}"]`)
      if (row) this.say(row.getAttribute('aria-label'))
    })
  }

  optionRows() {
    return [
      { id: 'sound', label: 'Sound', value: this._muted ? 'Off' : 'On' },
      { id: 'fullscreen', label: 'Full screen', value: this._fullscreen ? 'On' : 'Off' },
      { id: 'intro', label: 'Title intro', value: this._opts.intro ? 'On' : 'Off' },
      { id: 'brawls', label: 'Parent brawls', value: this._opts.brawls ? 'On' : 'Off' },
      { id: 'bookface', label: 'BookFace posts', value: this._opts.bookface ? 'On' : 'Off' },
    ]
  }

  toggleOption(id) {
    if (id === 'sound') this.toggleMute()
    else if (id === 'fullscreen') this.toggleFullscreen()
    else {
      this._opts = Object.assign({}, this._opts, { [id]: !this._opts[id] })
      saveOptions(this._opts)
    }
    this.audio.play('menu')
  }

  enterCode(text) {
    const entry = lookupCode(text)
    this._cheat = ''
    if (!entry) {
      this.audio.play('back')
      this.toast('NOPE. NOT A CODE.')
      return
    }
    const key = unlockKey(entry)
    const item = describeUnlock(key)
    const fresh = this.unlocks.add(key)
    this.audio.play('cheat')
    if (entry.type === 'modifier' && fresh) this.unlocks.toggle(entry.id)
    this.toast(fresh ? `UNLOCKED: ${item.name.toUpperCase()}` : `ALREADY UNLOCKED: ${item.name.toUpperCase()}`, 3000)
    if (entry.type === 'guest') this._guest = entry.id
    if (entry.type === 'equipment') this._equipment = entry.id
    this.requestUpdate()
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

  // guest stars and equipment go to your team; modifiers change the game
  loadout() {
    if (this.attract) return { modifiers: [] }
    const mine = {}
    if (this._guest && this.unlocks.has(`guest:${this._guest}`)) mine.guest = this._guest
    if (this._equipment && this.unlocks.has(`equipment:${this._equipment}`)) mine.equipment = this._equipment
    return { [this.yourSide()]: mine, modifiers: this.unlocks.activeModifiers() }
  }

  newGame(homeId, awayId, extra) {
    const controllers = this.attract ? {} : this.humans()
    const sides = Object.values(controllers)
    const opts = Object.assign(
      {
        level: this.level,
        venue: this.venue,
        ruleset: this.ruleset,
        strictness: this.strictness / 100,
        home: homeId,
        away: awayId,
        controllers,
        focusSide: sides[0] || 'home',
        autoIntermission: this.attract,
        loadout: this.loadout(),
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
    this._banned = new Set()
    this._final = null
    this._penalty = null
    this._phone = null
    this._intermission = null
    this._overlay = null
    this._pip = null
    this._book = null
    this._brawl = null
    this._brawlPeriod = 0
    this._moments = []
    this._streak = { side: null, n: 0 }
    const team = (side) => {
      const t = this.game.teams[side]
      const eq = t.equipment
      return { kit: t.kit, short: t.def.short, crest: t.def.crest, name: t.def.name, stickColor: eq && eq.stick ? eq.stick : null }
    }
    this.match = { rules: this.game.rules, teams: { home: team('home'), away: team('away') } }
    this._screen = 'playing'
    this.updateComplete.then(() => {
      const canvas = this.shadowRoot.querySelector('#rink')
      this.renderer = new Renderer(canvas, { hud: true })
      this.renderer.setMatch(this.match.rules, this.match.teams)
      if (!this.attract) {
        const stage = this.shadowRoot.querySelector('.stage')
        if (stage) stage.focus({ preventScroll: true })
      }
    })
    this.updateLineup(true)
    this.audio.stopLoop()
    const venue = VENUES[this.game.rules.venue]
    this.say(`${this.match.teams.home.name} versus ${this.match.teams.away.name}, ${getLevel(this.level).label}, ${venue.label}. Drop the puck.`)
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
    this.audio.play('select')
    if (this.mode === 'tournament') {
      this.tournament = new Tournament({
        level: this.level,
        venue: this.venue,
        ruleset: this.ruleset,
        strictness: this.strictness / 100,
        team: this.home,
        seed: `${Date.now()}`,
      })
      this._screen = 'bracket'
      this.focusFirst()
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
    if (this._screen !== 'playing') {
      if (!this.attract) this.menuPadInput(inputs)
      this.drawMenuFrame(now)
      return
    }
    if (!this.game || !this.renderer) return
    if (this.attract && !this._visible) return
    if (this._overlay === 'brawl') {
      this.brawlStep(elapsed, inputs)
      return
    }
    this.overlayInput(inputs)
    const paused = !!this._overlay || this.game.phase === 'intermission'
    if (!paused) {
      // pause / clip buttons from any human controller
      if (!this.attract) {
        const all = Object.keys(inputs)
        if (all.some((id) => inputs[id].pause)) {
          this._overlay = 'pause'
          this.focusOverlay()
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
    this.audio.setCrowd(this.game.rules.crowd ? this.game.crowd.mood : 0, !paused && this.game.rules.crowd)
  }

  // intro, menus, bracket and final all share an animated backdrop
  drawMenuFrame(now) {
    if (this._screen === 'intro') {
      const c = this.shadowRoot && this.shadowRoot.querySelector('#intro')
      if (!c) return
      if (!this.intro || this.intro.canvas !== c) this.intro = new Intro(c)
      const t = this.reducedMotion() && this._introStarted ? Math.max(INTRO.prompt, this.introTime()) : this.introTime()
      if (this._introStarted) this.introCue(t)
      this.intro.draw(this._introStarted ? t : 0, { prompt: this._introStarted ? 'PRESS START' : '' })
      return
    }
    const c = this.shadowRoot && this.shadowRoot.querySelector('canvas.bg')
    if (!c) return
    if (!this.bg || this.bg.canvas !== c) this.bg = new ArcadeBg(c)
    this.bg.setSection(this.menuSection())
    this.bg.draw(now / 1000, this.reducedMotion())
  }

  menuSection() {
    if (this._screen === 'final') return 'gold'
    if (this._screen === 'bracket') return 'play'
    if (this._screen === 'menu') {
      if (this._menu === 'setup') return 'play'
      if (this._menu === 'hub') return 'title'
      return this._menu
    }
    return 'title'
  }

  drawFrame(dt) {
    const snap = this.game.snapshot()
    const now = performance.now()
    this._banners = this._banners.filter((b) => b.until > now)
    const b = this._banners[0]
    const shake = b && b.shake && !this.reducedMotion() ? 1 : 0
    const fire = this.game.modifiers.includes('fire-puck') && this._streak.n >= 2
    this.renderer.draw(snap, { dt, banner: b ? b.text : null, bannerColor: b ? b.color : null, sub: b ? b.sub : null, shake, fire })
    if (this._phone && this.phoneRenderer) this.drawPhone(dt)
    if (this._pip) this.drawPip(snap, dt)
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

  // the moments a parent might post between periods
  remember(type, uid, side) {
    const e = this.entity(uid)
    if (!e || this.attract) return
    const list = this._moments
    if (list.length > 60) list.shift()
    list.push({ type, uid, side: side || e.side, number: e.player.number, period: this.game.period, t: this.game.time, x: e.x, y: e.y, snap: this.game.snapshot() })
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
          this.remember('save', e.uid)
          break
        case 'block':
          this.remember('block', e.uid)
          break
        case 'hit':
          a.play('hit')
          this.react(e.uid, 'jump', 1.2)
          if (!e.legal) this.react(e.target, 'angry', 2.5)
          else this.remember('hit', e.uid)
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
          this._streak = this._streak.side === side ? { side, n: this._streak.n + 1 } : { side, n: 1 }
          const name = e.scorerNumber ? `#${e.scorerNumber} ${e.scorerName}` : 'Off a skate'
          const onFire = this.game.modifiers.includes('fire-puck') && this._streak.n === 2
          this.banner(onFire ? "HE'S ON FIRE!" : 'GOAL!', { sub: name, ms: 2400, color: teams[side].kit.jersey, shake: true })
          if (e.scorer) {
            this.remember('goal', e.scorer, side)
            this.react(e.scorer, 'wild', 4)
            if (!keep) {
              this.react(e.scorer, 'money', 4)
              a.playSting('money')
            }
          }
          ;(e.assists || []).forEach((uid) => this.react(uid, 'jump', 3))
          this.teamReact(side, 'jump', 2)
          this.say(keep ? `Goal, ${teams[side].name}. ${name}. ${teams.home.short} ${e.home}, ${teams.away.short} ${e.away}.` : `Goal by ${name}. Nobody is keeping score at this level, but the parents are.`)
          if (e.viral && e.scorer && !this.attract && this.game.rules.crowd) this.startPhone(e.scorer)
          break
        }
        case 'penalty': {
          const team = teams[e.side]
          this.react(e.uid, 'angry', 4)
          if (e.penalty === 'fighting') {
            this.banner('EJECTED', { sub: `#${e.number} ${team.short}`, ms: 1400, color: '#d8343c' })
            break
          }
          this.say(`Penalty, ${team.name}. Number ${e.number}, ${e.label}. ${e.explain}`)
          if (!this.attract) {
            this._penalty = Object.assign({ team: team.name, short: team.short, color: team.kit.jersey, until: performance.now() + 3600 }, e)
            this._overlay = 'penalty'
          } else {
            this.banner(e.label.toUpperCase(), { sub: `#${e.number} ${team.short}`, ms: 1600, color: '#ffd740' })
          }
          a.playSting('penalty')
          break
        }
        case 'missed-call':
          this.missedCall(e)
          break
        case 'stick-break':
          this.stickBreak(e)
          break
        case 'stick-held':
          this.banner('THE WOOD HOLDS', { sub: 'Grandpa was right', ms: 1600, color: '#c28a4a' })
          break
        case 'new-stick':
          this.banner('NEW STICK', { sub: 'Another $349 from the bench', ms: 1200, color: '#5ad0ff' })
          break
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
          if (!this.attract) this.startIntermission(e)
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
    this._overlay = null
    this._pip = null
    this.focusFirst()
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
    if (!this.game.rules.crowd) return
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
    if (!this.game.rules.crowd) return
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
    if (this._pip && this._pip.until < now) {
      this._pip = null
      this.pipRenderer = null
    }
  }

  // ---------- the stick break: a close-up, picture in picture ----------

  stickBreak(e) {
    this.audio.play('snap')
    this.remember('stick-break', e.uid)
    this.banner('SNAP!', { sub: `#${e.number} broke a $349 stick`, ms: 2000, color: '#5ad0ff', shake: true })
    this.say(`Number ${e.number}'s stick snaps. That was a three hundred and forty nine dollar stick.`)
    const money = Array.from({ length: this.reducedMotion() ? 4 : 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2 + (i % 3) * 0.3
      const r = 60 + (i % 4) * 22
      return { emoji: i % 3 ? '\u{1F4B5}' : '\u{1F4B8}', dx: `${Math.round(Math.cos(a) * r)}px`, dy: `${Math.round(Math.sin(a) * r - 30)}px`, r: `${(i % 2 ? 1 : -1) * (90 + i * 20)}deg`, delay: `${(i % 5) * 0.08}s` }
    })
    this._pip = { uid: e.uid, x: e.x, y: e.y, number: e.number, side: e.side, until: performance.now() + 2800, money }
    this.pipRenderer = null
  }

  drawPip(snap, dt) {
    const c = this.shadowRoot.querySelector('#pip-canvas')
    if (!c) return
    if (!this.pipRenderer || this.pipRenderer.canvas !== c) {
      this.pipRenderer = new Renderer(c, { hud: false, zoom: 5 })
      this.pipRenderer.setMatch(this.match.rules, this.match.teams)
    }
    const e = this.entity(this._pip.uid)
    const follow = e ? { x: e.x, y: e.y } : { x: this._pip.x, y: this._pip.y }
    this.pipRenderer.draw(snap, { dt, follow })
  }

  // ---------- the brawl: a missed call starts it ----------

  missedCall(e) {
    const label = PENALTIES[e.penalty] ? PENALTIES[e.penalty].label : 'Something'
    this.react(e.victim, 'angry', 3)
    this.banner('NO CALL?!', { sub: `${label}. The ref missed it.`, ms: 1500, color: '#ff5a6e' })
    const g = this.game
    if (this.attract || !g.rules.crowd || !this._opts.brawls || this._overlay) return
    if (this._brawlPeriod === g.period || Math.random() > 0.5) return
    const actor = this.entity(e.uid)
    const victim = this.entity(e.victim)
    if (!actor || !victim) return
    this._brawlPeriod = g.period
    globalThis.setTimeout(() => {
      if (this._screen === 'playing' && !this._overlay && this.game === g) this.startBrawl(actor, victim, label)
    }, 1000)
  }

  startBrawl(actor, victim, label) {
    const side = this.game.opts.focusSide || 'home'
    const mine = actor.side === side ? actor : victim
    const theirs = mine === actor ? victim : actor
    const fanOf = (k) => k.player.fans.find((s) => !this._banned.has(s)) || k.player.fans[0]
    const bystanders = (s) =>
      this.game.teams[s].entities
        .filter((x) => !x.isGoalie && x !== mine && x !== theirs)
        .slice(0, 2)
        .map((x) => ({ seed: x.player.id, crest: this.game.teams[s].def.crest, number: x.player.number }))
    this._brawl = {
      fight: new Brawl({ rng: createRng(`brawl:${this.game.time}:${mine.uid}`), toughness: Math.min(1, theirs.exposure / 100) }),
      you: fanOf(mine),
      them: fanOf(theirs),
      mine,
      theirs,
      label,
      jersey: this.match.teams[mine.side].kit.jersey,
      theirTeam: this.match.teams[theirs.side].short,
      kids: [
        { seed: mine.player.id, crest: this.game.teams[mine.side].def.crest, number: mine.player.number },
        { seed: theirs.player.id, crest: this.game.teams[theirs.side].def.crest, number: theirs.player.number },
        ...bystanders('home'),
        ...bystanders('away'),
      ],
      crowd: [...(this._lineup.home || []), ...(this._lineup.away || [])]
        .map((p) => p.fans[1] || p.fans[0])
        .filter((s) => s && !this._banned.has(s))
        .slice(0, 6),
      hits: { you: 0, them: 0 },
      state: 'idle',
      line: BRAWL_LINES[Math.floor(Math.random() * BRAWL_LINES.length)],
      applied: false,
    }
    this._overlay = 'brawl'
    this.audio.play('bell')
    this.say(`No call on the ${label}. Two parents square off in the stands. You are number ${mine.player.number}'s parent. Hold left or right to dodge, down to block, Z to jab, X to hook.`)
    this.updateComplete.then(() => {
      const el = this.shadowRoot.querySelector('.brawl')
      if (el) el.focus({ preventScroll: true })
    })
  }

  brawlStep(dt, inputs) {
    const b = this._brawl
    if (!b) return
    const f = b.fight
    if (!f.result) {
      const ids = Object.keys(inputs)
      const any = (k) => ids.some((id) => inputs[id][k])
      const held = (fn) => ids.some((id) => fn(inputs[id]))
      f.update(dt, {
        left: held((s) => s.x < -0.5),
        right: held((s) => s.x > 0.5),
        down: held((s) => s.y > 0.5),
        up: held((s) => s.y < -0.5),
        jab: any('pass'),
        hook: any('shoot'),
        star: any('check') || any('stick'),
      })
      if (f.hits.you !== b.hits.you || f.hits.them !== b.hits.them) this.audio.play('punch')
      if (f.them.state === 'tell' && b.state !== 'tell') this.audio.play('whoosh')
      b.hits = Object.assign({}, f.hits)
      b.state = f.them.state
      if (f.result) this.brawlOver()
    } else if (Object.keys(inputs).some((id) => inputs[id].confirm || inputs[id].pause)) {
      this.closeOverlay()
    }
    this.requestUpdate()
  }

  // nobody wins a brawl in the stands
  brawlOver() {
    const b = this._brawl
    if (b.applied) return
    b.applied = true
    this.audio.play('bell')
    const g = this.game
    g.crowd.mood = Math.max(0, g.crowd.mood - 0.2)
    for (const k of [b.mine, b.theirs]) {
      for (const stat of ['speed', 'shot', 'pass', 'hands']) k.rating[stat] = Math.max(20, k.rating[stat] - 3)
    }
    this._banned.add(b.you)
    this._banned.add(b.them)
    const r = b.fight.result
    const how = r.winner === 'you' ? 'You win the fight. ' : r.winner === 'them' ? 'You lose the fight. ' : 'A draw. '
    this.say(`${how}${b.line} Both kids are rattled.`)
    this.updateComplete.then(() => {
      const btn = this.shadowRoot.querySelector('.brawl .go')
      if (btn) btn.focus({ preventScroll: true })
    })
  }

  // ---------- intermission: BookFace, then the parent event ----------

  startIntermission(e) {
    this._intermission = Object.assign({ result: null }, e)
    this.audio.startLoop()
    if (e.id !== 'quiet' && this._opts.bookface && this.game.rules.crowd) {
      this.openBookFace(e.side)
      return
    }
    this._overlay = 'intermission'
    this.say(`End of period ${this.game.period}. ${e.title}. ${e.body}`)
    this.focusOverlay()
  }

  openBookFace(side) {
    const g = this.game
    const period = g.period
    const moments = this._moments.filter((m) => m.period === period)
    const highlights = pickHighlights(moments, side, 4)
    const team = g.teams[side]
    const kid = team
      .skaters()
      .slice()
      .sort((a, b) => b.exposure - a.exposure)[0]
    const other = side === 'home' ? 'away' : 'home'
    this._book = {
      side,
      period,
      highlights,
      chosen: highlights.slice(0, 2).map((_, i) => i),
      posted: false,
      drawn: false,
      kid: kid ? kid.player.first || kid.player.name : 'my kid',
      kidNumber: kid ? kid.player.number : '',
      poster: kid ? kid.player.fans[0] : 'parent',
      ours: team.score,
      theirs: g.teams[other].score,
    }
    this._overlay = 'bookface'
    this.say(`End of period ${period}. A parent opens BookFace to post highlights. Pick the clips to post.`)
    this.focusOverlay()
  }

  drawThumbs() {
    const b = this._book
    const canvases = this.shadowRoot.querySelectorAll('.bf .thumb canvas')
    if (!canvases.length && b.highlights.length) return
    canvases.forEach((c) => {
      const m = b.highlights[parseInt(c.dataset.i, 10)]
      if (!m) return
      const r = new Renderer(c, { hud: false, zoom: 3 })
      r.setMatch(this.match.rules, this.match.teams)
      r.draw(m.snap, { snapCamera: true, follow: { x: m.x, y: m.y } })
    })
    b.drawn = true
  }

  toggleHighlight(i) {
    const b = this._book
    const has = b.chosen.includes(i)
    const chosen = has ? b.chosen.filter((x) => x !== i) : [...b.chosen, i].slice(-4)
    this._book = Object.assign({}, b, { chosen })
    this.audio.play('menu')
  }

  bookPost() {
    const b = this._book
    this._book = Object.assign({}, b, { posted: true })
    this.audio.play('posted')
    const diff = b.ours - b.theirs
    this.say(`Posted. ${likesFor(diff, b.chosen)} likes. ${this.bookText()}`)
    this.updateComplete.then(() => {
      const btn = this.shadowRoot.querySelector('.bf .close')
      if (btn) btn.focus({ preventScroll: true })
    })
  }

  bookText() {
    const b = this._book
    return composePost({
      ours: b.ours,
      theirs: b.theirs,
      kid: b.kid,
      keepScore: this.game.rules.keepScore,
      chosen: b.chosen.map((i) => b.highlights[i]).filter(Boolean),
      period: b.period,
    })
  }

  closeBookFace() {
    this._book = null
    const m = this._intermission
    this._overlay = 'intermission'
    this.say(`${m.title}. ${m.body}`)
    this.focusOverlay()
  }

  // ---------- overlays ----------

  focusOverlay() {
    this.updateComplete.then(() => {
      const el = this.shadowRoot.querySelector('.overlay button, .overlay [tabindex]')
      if (el) el.focus({ preventScroll: true })
    })
  }

  overlayInput(inputs) {
    const any = (k) => Object.keys(inputs).some((id) => inputs[id][k])
    if (this._overlay === 'penalty' && (any('pass') || any('confirm') || any('shoot'))) this.closeOverlay()
    else if (this._overlay === 'phone' && (any('pass') || any('confirm') || any('shoot') || any('pause'))) this.closeOverlay()
    else if (this._overlay === 'pause' && any('pause')) this.closeOverlay()
    else if (this._overlay === 'intermission' || this._overlay === 'bookface' || this._overlay === 'pause') {
      // gamepads move through the buttons; the keyboard uses tab and enter
      const nav = Object.keys(inputs)
        .filter((id) => id !== 'kb')
        .map((id) => inputs[id].navY || inputs[id].navX)
        .find((v) => v)
      if (nav) {
        const list = Array.from(this.shadowRoot.querySelectorAll('.overlay button, .overlay a.btn'))
        const i = list.indexOf(this.shadowRoot.activeElement)
        const n = list[(i + nav + list.length) % list.length]
        if (n) n.focus({ preventScroll: true })
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
    if (was === 'brawl') {
      this._brawl = null
      this.audio.stopLoop()
    }
    this._last = 0
    this.updateComplete.then(() => {
      const stage = this.shadowRoot.querySelector('.stage')
      if (stage && !this.attract) stage.focus({ preventScroll: true })
    })
  }

  chooseIntermission(i) {
    const result = this.game.chooseIntermission(i)
    this.handleEvents(this.game.drainEvents())
    this._intermission = Object.assign({}, this._intermission, { result, chosen: i })
    this.say(result)
    this.updateComplete.then(() => {
      const b = this.shadowRoot.querySelector('.intermission .continue')
      if (b) b.focus({ preventScroll: true })
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
      if (this._phone && this._screen === 'playing' && !this._overlay) {
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
      this._clip = { progress: 100, url, name: `youth-sports-27-${t.home.short}-${t.away.short}.${clip.ext}`.toLowerCase() }
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
    this._pip = null
    this._brawl = null
    this._book = null
    this.audio.startLoop()
    this.goMenu('setup')
  }

  toggleMute() {
    this._muted = !this._muted
    this.audio.setMuted(this._muted)
    if (this._muted) this.audio.stopLoop()
  }

  // ---------- render ----------

  static get styles() {
    return [super.styles, styles]
  }

  render() {
    return html`
      <div class="shell">
        ${this._screen === 'intro' && !this.attract ? this.renderIntro() : ''} ${this._screen === 'menu' ? this.renderMenu() : ''}
        ${this._screen === 'bracket' ? this.renderBracket() : ''} ${this._screen === 'playing' ? this.renderGame() : ''}
        ${this._screen === 'final' ? this.renderFinal() : ''} ${this._toast ? html`<div class="toast" role="status">${this._toast}</div>` : ''}
        <div class="sr-only" aria-live="polite">${this._announce}</div>
      </div>
    `
  }

  renderIntro() {
    return html`
      <div class="intro">
        <canvas id="intro" width="512" height="448" aria-hidden="true"></canvas>
        <button class="skip" aria-label="${this._introStarted ? 'Youth Sports 27. Press start.' : 'Turn on the TV: press start'}" @click=${this.introPress}>
          ${this._introStarted ? '' : 'PRESS START'}
        </button>
        ${this._introStarted
          ? ''
          : html`<div class="intro-start" aria-hidden="true">
              <span>&#x23FB; PRESS START</span>
              <small>click, tap, enter or a gamepad button</small>
            </div>`}
      </div>
    `
  }

  // the shared arcade frame: backdrop, back + full screen, banner, hints
  menuFrame(opts, content) {
    const s = SECTIONS[opts.section] || SECTIONS.title
    return html`
      <div class="menu" style="--yh-accent:${s.color}">
        <canvas class="bg" width="400" height="300" aria-hidden="true"></canvas>
        <div class="topbar">
          ${opts.back ? html`<button @click=${opts.back} aria-label="Back">&lt; BACK</button>` : html`<span></span>`}
          <button @click=${this.toggleFullscreen} aria-pressed="${this._fullscreen ? 'true' : 'false'}">${this._fullscreen ? 'EXIT FULL' : 'FULL SCREEN'}</button>
        </div>
        ${opts.title
          ? html`<h2 class="banner">${opts.title}</h2>
              ${opts.crumb ? html`<span class="crumb">${opts.crumb}</span>` : ''}`
          : ''}
        ${content}
        <div class="hint" aria-hidden="true">${(opts.hints || []).map((h) => html`<span><kbd>${h[0]}</kbd>${h[1]}</span>`)}</div>
      </div>
    `
  }

  renderMenu() {
    switch (this._menu) {
      case 'setup':
        return this.renderSetup()
      case 'options':
        return this.renderOptionsMenu()
      case 'extras':
        return this.renderExtras()
      case 'howto':
        return this.renderHowto()
      default:
        return this.renderHub()
    }
  }

  renderHub() {
    const tiles = [
      { id: 'setup', name: 'PLAY', sub: 'Exhibition or tournament. 8U to the Beer League.', icon: 'play', section: 'play' },
      { id: 'options', name: 'OPTIONS', sub: 'Sound, full screen, brawls and BookFace.', icon: 'options', section: 'options' },
      { id: 'extras', name: 'EXTRAS', sub: 'Cheat codes, guest stars, big heads.', icon: 'extras', section: 'extras' },
      { id: 'howto', name: 'HOW TO PLAY', sub: 'Controls, rules and what the parents do.', icon: 'howto', section: 'howto' },
    ]
    const letters = 'YOUTH SPORTS 27'.split('')
    return this.menuFrame(
      {
        section: 'title',
        hints: [
          ['ARROWS', 'MOVE'],
          ['ENTER', 'SELECT'],
          ['F', 'FULL SCREEN'],
        ],
      },
      html`
        <h2 class="logo">
          <span class="small">THE YOUTH HOCKEY EXPERIENCE</span>
          <span class="sr-only">${this.t.title}</span>
          <span aria-hidden="true">${letters.map((c, i) => (c === ' ' ? html`<span> </span>` : html`<span class="ch" style="animation-delay:${-i * 0.16}s">${c}</span>`))}</span>
        </h2>
        <div class="hub">
          ${tiles.map((t) => {
            const s = SECTIONS[t.section]
            return html`<button
              class="tile"
              data-nav
              data-cols="2"
              style="--c:${s.color};--d:${s.dark}"
              @click=${() => {
                this.audio.start()
                this.audio.play('select')
                this.goMenu(t.id)
              }}
            >
              <img src="${iconUrl(t.icon, '#ffffff', s.lit)}" alt="" width="64" height="64" />
              <span><span class="name">${t.name}</span><span class="sub">${t.sub}</span></span>
            </button>`
          })}
        </div>
      `,
    )
  }

  renderRow(r, onClick) {
    return html`<li>
      <button
        class="row"
        data-nav
        data-cycle="${r.cycle === false ? '' : r.id}"
        ?disabled=${r.disabled}
        aria-label="${r.label}: ${r.value}${r.off ? ', not available' : ''}"
        @click=${onClick}
      >
        <span>${r.dot ? html`<span aria-hidden="true" style="color:${r.dot}">&#x25CF;</span> ` : ''}${r.label}</span>
        <span class="val">
          ${r.img ? html`<img src="${r.img}" alt="" width="18" height="18" />` : ''}${r.off ? html`<span style="opacity:.5">${r.value}</span>` : r.value}
          ${r.off || r.cycle === false ? '' : html`<span class="arrows" aria-hidden="true">&#x25C2;&#x25B8;</span>`}
        </span>
      </button>
    </li>`
  }

  renderSetup() {
    const rows = this.setupRows()
    const rules = this.venueRules()
    const level = getLevel(this.level)
    const v = VENUES[this.venue]
    const h = getTeam(this.home)
    const a = getTeam(this.away)
    const humans = Object.values(this.humans())
    const lo = this.loadout()
    const mine = lo[this.yourSide()] || {}
    return this.menuFrame(
      {
        section: 'play',
        title: 'PLAY',
        crumb: 'MAIN / PLAY',
        back: () => this.menuBack(),
        hints: [
          ['↑↓', 'MOVE'],
          ['←→', 'CHANGE'],
          ['ENTER', 'SELECT'],
          ['ESC', 'BACK'],
        ],
      },
      html`
        <div class="panels">
          <section class="panel">
            <h3>SETUP</h3>
            <ul class="rows">
              ${rows.map((r) => this.renderRow(r, () => this.cycleRow(r.id, 1)))}
            </ul>
          </section>
          <section class="panel">
            <h3>MATCHUP</h3>
            <div class="matchup">
              <div><img src="${crestUrl(h.crest)}" alt="" />${h.name}</div>
              <div class="vs" aria-hidden="true">VS</div>
              <div><img src="${crestUrl(a.crest)}" alt="" />${a.name}</div>
            </div>
            <p class="note">
              <strong>${level.label} at the ${v.label.toLowerCase()}: ${rules.surface.label}, ${rules.skaters} on ${rules.skaters}${rules.goalies ? '' : ', no goalies'}.</strong>
              ${rules.checking ? 'Body checking.' : 'No body checking.'} ${rules.offsides ? 'Offsides and icing.' : 'No offsides or icing.'}
              ${rules.keepScore ? 'Score is kept.' : 'No scoreboard.'} Three 5 minute periods.
            </p>
            <p class="note">${v.crowd ? level.blurb : 'Nobody comes to watch. No refs, no parents, no pressure: everybody plays way better.'}</p>
            ${mine.guest || mine.equipment || lo.modifiers.length
              ? html`<p class="note">
                  CHEATS: ${[mine.guest ? GUESTS[mine.guest].name : '', mine.equipment ? EQUIPMENT[mine.equipment].name : '', ...lo.modifiers.map((m) => MODIFIERS[m].name)].filter(Boolean).join(' / ')}
                </p>`
              : ''}
            ${humans.length === 0 ? html`<p class="note warn">Everyone is on CPU: you'll be watching.</p>` : ''}
            ${this._pads.length ? '' : html`<p class="note">Plug in up to four gamepads and press a button to add them.</p>`}
            <p style="margin:16px 0 0">
              <button class="go" data-nav @click=${this.startFromSelect} ?disabled=${this.home === this.away}>DROP THE PUCK &#x25B8;</button>
            </p>
          </section>
        </div>
      `,
    )
  }

  renderOptionsMenu() {
    return this.menuFrame(
      {
        section: 'options',
        title: 'OPTIONS',
        crumb: 'MAIN / OPTIONS',
        back: () => this.menuBack(),
        hints: [
          ['↑↓', 'MOVE'],
          ['ENTER', 'TOGGLE'],
          ['ESC', 'BACK'],
        ],
      },
      html`
        <div class="panels">
          <section class="panel">
            <h3>SETTINGS</h3>
            <ul class="rows">
              ${this.optionRows().map((r) => this.renderRow(Object.assign({ cycle: false }, r), () => this.toggleOption(r.id)))}
            </ul>
          </section>
          <section class="panel">
            <h3>ABOUT</h3>
            <p class="note">Youth Sports 27 is a made-up league with made-up kids. Any resemblance to your association's group chat is a coincidence.</p>
            <p class="note">Parent brawls start when a ref misses a call. BookFace posts happen between periods. Turn either off here.</p>
            <p class="note">Settings and unlocked cheats are saved in this browser only.</p>
          </section>
        </div>
      `,
    )
  }

  renderExtras() {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const unlocked = ALL_UNLOCKS.filter((k) => this.unlocks.has(k)).map(describeUnlock)
    return this.menuFrame(
      {
        section: 'extras',
        title: 'EXTRAS',
        crumb: 'MAIN / EXTRAS',
        back: () => this.menuBack(),
        hints: [
          ['TYPE', 'A CODE'],
          ['ENTER', 'TRY IT'],
          ['ESC', 'BACK'],
        ],
      },
      html`
        <div class="panels">
          <section class="panel">
            <h3>CHEAT CODES</h3>
            <form
              class="cheat"
              @submit=${(e) => {
                e.preventDefault()
                this.enterCode(this._cheat)
              }}
            >
              <label class="note" for="code" style="margin:0">Enter a code</label>
              <input
                id="code"
                data-nav
                autocomplete="off"
                spellcheck="false"
                maxlength="16"
                .value=${this._cheat}
                @input=${(e) => {
                  this._cheat = e.target.value.toUpperCase()
                }}
                @keydown=${(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    this.menuMove('down')
                  } else if (e.key === 'Escape') {
                    e.preventDefault()
                    this.menuBack()
                  }
                }}
              />
              <div class="keys" role="group" aria-label="On-screen keyboard">
                ${keys.map(
                  (k) => html`<button
                    type="button"
                    data-nav
                    data-cols="10"
                    @click=${() => {
                      this._cheat = (this._cheat + k).slice(0, 16)
                      this.audio.play('menu')
                    }}
                  >
                    ${k}
                  </button>`,
                )}
                <button
                  type="button"
                  class="wide"
                  data-nav
                  data-cols="10"
                  aria-label="Delete"
                  @click=${() => {
                    this._cheat = this._cheat.slice(0, -1)
                  }}
                >
                  DEL
                </button>
                <button type="submit" class="wide go" data-nav data-cols="10">OK</button>
              </div>
            </form>
            <p class="note">A gamepad works too. Old gamers know a certain button code.</p>
          </section>
          <section class="panel">
            <h3>UNLOCKED ${unlocked.length}/${ALL_UNLOCKS.length}</h3>
            ${unlocked.length
              ? html`<ul class="unlocked">
                  ${unlocked.map((u) =>
                    u.type === 'modifier'
                      ? this.renderRow({ id: u.key, label: u.name, value: this.unlocks.isActive(u.id) ? 'ON' : 'OFF', cycle: false }, () => {
                          this.unlocks.toggle(u.id)
                          this.audio.play('menu')
                          this.requestUpdate()
                        })
                      : this.renderRow({ id: u.key, label: u.name, value: u.type === 'guest' ? 'GUEST' : 'GEAR', cycle: false }, () => {
                          if (u.type === 'guest') this._guest = u.id
                          else this._equipment = u.id
                          this.audio.play('select')
                          this.goMenu('setup')
                        }),
                  )}
                </ul>
                <p class="note">Guest stars and equipment go to your team: pick them on the PLAY screen.</p>`
              : html`<p class="note">Nothing yet. HOW TO PLAY has a few hints.</p>`}
          </section>
        </div>
      `,
    )
  }

  renderHowto() {
    const cur = HOWTO[this._howto] || HOWTO[0]
    return this.menuFrame(
      {
        section: 'howto',
        title: 'HOW TO PLAY',
        crumb: 'MAIN / HOW TO PLAY',
        back: () => this.menuBack(),
        hints: [
          ['↑↓', 'MOVE'],
          ['ESC', 'BACK'],
        ],
      },
      html`
        <div class="list">
          <section class="panel">
            <h3>TOPICS</h3>
            <ul class="rows">
              ${HOWTO.map(
                (h, i) => html`<li>
                  <button
                    class="row ${i === this._howto ? 'on' : ''}"
                    data-nav
                    aria-current="${i === this._howto ? 'true' : 'false'}"
                    @focus=${() => {
                      this._howto = i
                    }}
                    @click=${() => {
                      this._howto = i
                    }}
                  >
                    <span>${h.title}</span>
                  </button>
                </li>`,
              )}
            </ul>
          </section>
          <section class="panel detail" aria-live="polite">
            <h3>${cur.title.toUpperCase()}</h3>
            <h4>${cur.title}</h4>
            ${cur.body.map((p) => html`<p>${p}</p>`)}
          </section>
        </div>
      `,
    )
  }

  renderStands() {
    if (this.game && !this.game.rules.crowd) {
      return html`<div class="stands empty" aria-hidden="true">
        <span>${this.game.rules.venue === 'pond' ? 'Snowbanks. A dog. Nobody else.' : 'Empty driveway. Somebody yells CAR!'}<br />Nobody came to watch. Everybody plays better.</span>
      </div>`
    }
    const fansOf = (p) =>
      p.fans
        .filter((seed) => !this._banned.has(seed))
        .map((seed) => {
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
              ${kind === 'money' && (p.superFans || (this.game && !this.game.rules.keepScore)) ? html`<span class="bill">$</span>` : ''}
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
      ${this.attract ? '' : this.renderStands()}
      <div class="stage" tabindex="0" role="application" aria-label="Hockey rink. ${this.t.controlsHelp}">
        <canvas id="rink" width="256" height="224"></canvas>
        ${this.renderPip()} ${this.renderOverlay()}
      </div>
      ${this.attract
        ? ''
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
              <button
                @click=${() => {
                  this._overlay = 'pause'
                  this.focusOverlay()
                }}
              >
                ${this.t.pause}
              </button>
              <button @click=${this.saveClip}>${this.t.saveClip}</button>
              <button @click=${this.toggleMute}>${this._muted ? this.t.unmute : this.t.mute}</button>
              <button @click=${this.toggleFullscreen}>${this._fullscreen ? this.t.exitFullscreen : this.t.fullscreen}</button>
              <span class="spacer"></span>
              <button @click=${this.quit}>${this.t.quit}</button>
            </div>
            <p class="help">${this._touchVisible() ? this.t.touchHelp : this.t.controlsHelp}</p>
          `}
    `
  }

  renderPip() {
    const p = this._pip
    if (!p) return ''
    return html`<div class="pip" aria-hidden="true">
      <canvas id="pip-canvas" width="96" height="72"></canvas>
      <div class="burst"></div>
      <div class="half a"></div>
      <div class="half b"></div>
      ${p.money.map((m) => html`<span class="money" style="--dx:${m.dx};--dy:${m.dy};--r:${m.r};animation-delay:${m.delay}">${m.emoji}</span>`)}
      <div class="cap"><strong>SNAP!</strong> #${p.number} &middot; $349</div>
    </div>`
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

  renderBrawl() {
    const b = this._brawl
    if (!b) return ''
    const f = b.fight
    const them = f.them
    const you = f.you
    const r = f.result
    const themCls = r && r.winner === 'you' ? 'down' : them.state
    const expression = r && r.winner === 'you' ? 'sleepy' : them.state === 'stunned' ? 'surprised' : 'angry'
    const youCls = [you.dodge || '', you.block ? 'block' : '', you.stun > 0 ? 'stun' : ''].join(' ')
    const punch = you.punch
    const msg = f.messages.length && f.messages[f.messages.length - 1].at - f.time < 0.8 ? f.messages[f.messages.length - 1].text : ''
    return html`<div class="brawl" tabindex="-1" role="dialog" aria-label="Brawl in the stands">
      <div class="hud">
        <div>
          <div class="who">#${b.mine.player.number}'S PARENT <span class="stars">${'★'.repeat(you.stars)}</span></div>
          <div class="bar"><span style="transform:scaleX(${you.hp / 100})"></span></div>
        </div>
        <div class="clock">${Math.ceil(f.time)}</div>
        <div>
          <div class="who">${b.theirTeam} PARENT</div>
          <div class="bar them"><span style="transform:scaleX(${them.hp / 100})"></span></div>
        </div>
      </div>
      <div class="bleachers" aria-hidden="true">
        ${b.crowd.map((s, i) => html`<div class="fan ${i % 2 ? 'fight' : 'wild'}"><rpg-character seed="${s}" height="56" width="44" expression="angry" reduce-motion></rpg-character></div>`)}
      </div>
      <div class="them ${themCls}" aria-hidden="true">
        ${them.state === 'tell' ? html`<span class="bang">!</span>` : ''} ${them.state === 'stunned' ? html`<span class="dizzy">&#x2605;</span>` : ''}
        <rpg-character seed="${b.them}" height="240" width="190" expression="${expression}" reduce-motion></rpg-character>
      </div>
      <div class="kids" aria-hidden="true">
        ${b.kids.map(
          (k) => html`<div style="position:relative"><span class="tear">#${k.number}</span><rpg-character seed="${k.seed}" preset="${k.crest}" height="58" width="46" expression="sad" reduce-motion></rpg-character></div>`,
        )}
      </div>
      <div class="you ${youCls}" style="--jersey:${b.jersey}" aria-hidden="true">
        <div class="body"></div>
        <div class="head"></div>
        <div class="fist l ${punch && (punch.kind === 'jab' || punch.kind === 'star') ? 'go' : ''} ${punch && punch.high ? 'high' : ''}"></div>
        <div class="fist r ${punch && (punch.kind === 'hook' || punch.kind === 'star') ? 'go' : ''} ${punch && punch.high ? 'high' : ''}"></div>
      </div>
      ${msg && !r ? html`<div class="msg" aria-hidden="true">${msg}</div>` : ''}
      ${r
        ? html`<div class="overlay">
            <div class="card" role="alert">
              <span class="kicker">NO CALL ON THE ${b.label.toUpperCase()}</span>
              <h3>${r.how === 'KO' ? (r.winner === 'you' ? 'K.O.! You win.' : 'K.O.! You lose.') : r.winner === 'draw' ? 'Time. A draw.' : r.winner === 'you' ? 'Time. You win on points.' : 'Time. You lose on points.'}</h3>
              <p>Nobody wins this one. ${b.line}</p>
              <p>The crowd sours. #${b.mine.player.number} and #${b.theirs.player.number} are rattled for the rest of the game. Both parents are banned from the stands.</p>
              <div class="actions"><button class="go" @click=${this.closeOverlay}>Back to the game</button></div>
            </div>
          </div>`
        : html`<div class="hint">
            <span><kbd>&#x2190;&#x2192;</kbd>DODGE</span><span><kbd>&#x2193;</kbd>BLOCK</span><span><kbd>Z</kbd>JAB</span><span><kbd>X</kbd>HOOK</span><span><kbd>&#x2191;</kbd>HIGH</span><span
              ><kbd>C</kbd>STAR</span
            >
          </div>`}
    </div>`
  }

  renderBookFace() {
    const b = this._book
    if (!b) return ''
    const diff = b.ours - b.theirs
    const text = this.bookText()
    const team = this.match.teams[b.side]
    return html`<div class="overlay">
      <div class="bf" role="dialog" aria-labelledby="bf-title">
        <header><span id="bf-title">bookface</span><small>End of period ${b.period}</small></header>
        <div class="post">
          <div class="who">
            <rpg-character seed="${b.poster}" height="44" width="36" expression="happy" reduce-motion aria-hidden="true"></rpg-character>
            <span>${team.short} Hockey Parent<small>${b.posted ? 'Just now · Public' : 'Draft · Public'}</small></span>
          </div>
          <div class="text">${text}</div>
          ${b.highlights.length
            ? html`<div class="grid">
                ${b.highlights.map(
                  (m, i) => html`<button class="thumb" aria-pressed="${b.chosen.includes(i) ? 'true' : 'false'}" ?disabled=${b.posted} @click=${() => this.toggleHighlight(i)}>
                    <canvas data-i="${i}" width="96" height="72" aria-hidden="true"></canvas>
                    <span>${b.chosen.includes(i) ? '✔ ' : ''}${highlightLabel(m)}</span>
                  </button>`,
                )}
              </div>`
            : html`<p>No highlights this period. Posting anyway.</p>`}
          ${b.posted
            ? html`<div class="likes"><span>&#x1F44D;&#x2764;&#xFE0F;&#x1F621; ${likesFor(diff, b.chosen)}</span><span>${commentsFor(diff).length} comments</span></div>
                ${commentsFor(diff).map(
                  (c) => html`<div class="comment">
                    <div><b>${c[0]}</b>${c[1]}</div>
                  </div>`,
                )}`
            : ''}
        </div>
        <div class="actions">
          ${b.posted ? html`<button class="close" @click=${this.closeBookFace}>Close BookFace</button>` : html`<button class="plain" @click=${this.closeBookFace}>Don't post</button><button @click=${this.bookPost}>Post</button>`}
        </div>
      </div>
    </div>`
  }

  renderOverlay() {
    if (this._overlay === 'brawl') return this.renderBrawl()
    if (this._overlay === 'bookface') return this.renderBookFace()
    if (this._overlay === 'pause') {
      return html`<div class="overlay">
        <div class="card" role="dialog" aria-label="${this.t.pause}">
          <span class="kicker">PAUSED</span>
          <h3>${this.t.pause}</h3>
          <p>${this.t.controlsHelp}</p>
          <div class="actions">
            <button class="go" @click=${this.closeOverlay}>${this.t.resume}</button>
            <button @click=${this.saveClip}>${this.t.saveClip}</button>
            <button @click=${this.toggleFullscreen}>${this._fullscreen ? this.t.exitFullscreen : this.t.fullscreen}</button>
            <button @click=${this.toggleMute}>${this._muted ? this.t.unmute : this.t.mute}</button>
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
          <p>Ref signal: ${p.signal}.</p>
          <p>${p.explain}</p>
          <p class="kicker">Press pass to continue.</p>
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
            : ''}
          <span class="kicker">END OF PERIOD ${this.game.period - (m.result ? 1 : 0)}</span>
          <h3 id="int-title">${m.title}</h3>
          <p>${m.body}</p>
          ${m.result
            ? html`<p><strong>${m.result}</strong></p>
                <div class="actions">
                  <button class="go continue" @click=${this.endIntermission}>Start period ${this.game.period}</button>
                </div>`
            : html`<div class="actions stack">${m.choices.map((c, i) => html`<button @click=${() => this.chooseIntermission(i)}>${c}</button>`)}</div>`}
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
            ${c.url ? html`<a class="btn go" href="${c.url}" download="${c.name}">Download clip</a>` : ''}
            <button @click=${this.closeClip} ?disabled=${!c.url && !c.error}>Back to the game</button>
          </div>
        </div>
      </div>`
    }
    return ''
  }

  renderFinal() {
    const f = this._final
    if (!f || !this.match) return ''
    const r = f.result
    const teams = this.match.teams
    const called = r.reason && r.reason.startsWith('called')
    let headline = 'FINAL'
    if (called) headline = 'GAME CALLED'
    else if (!r.keepScore) headline = 'GOOD GAME!'
    else if (r.reason === 'overtime') headline = 'FINAL / OT'
    else if (r.reason === 'shootout') headline = 'FINAL / SO'
    const t = this.tournament
    return this.menuFrame(
      {
        section: 'gold',
        title: headline,
        crumb: called ? 'Not enough players left' : !r.keepScore ? 'Nobody kept score' : '',
        hints: [
          ['ENTER', 'SELECT'],
          ['ESC', 'MENU'],
        ],
      },
      html`
        <div class="panels">
          <section class="panel">
            <h3>SCORE</h3>
            <div class="scoreline">
              <div><img src="${crestUrl(teams.home.crest)}" alt="" />${teams.home.name}</div>
              <div class="big">${r.keepScore ? html`${r.home}&ndash;${r.away}` : '\u{1F3C5}'}</div>
              <div><img src="${crestUrl(teams.away.crest)}" alt="" />${teams.away.name}</div>
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
                  ['Shots', 'shots'],
                  ['Passes', 'passes'],
                  ['Hits', 'hits'],
                  ['PIM', 'pim'],
                ].map(
                  (row) => html`<tr>
                    <th scope="row">${row[0]}</th>
                    <td>${f.stats.home[row[1]]}</td>
                    <td>${f.stats.away[row[1]]}</td>
                  </tr>`,
                )}
              </tbody>
            </table>
          </section>
          <section class="panel">
            <h3>AWARDS</h3>
            <ul class="awards">
              ${f.awards.map((a) => html`<li><strong>${a.label}</strong>${a.who}</li>`)}
            </ul>
            <div class="actions" style="display:flex;flex-wrap:wrap;gap:8px">
              ${t
                ? html`<button
                    class="go"
                    data-nav
                    @click=${() => {
                      this._screen = 'bracket'
                      this.focusFirst()
                    }}
                  >
                    ${t.done ? (t.jamboree ? 'MEDALS FOR EVERYONE' : 'RESULTS') : t.jamboree ? 'NEXT GAME' : 'BRACKET'}
                  </button>`
                : html`<button class="go" data-nav @click=${() => this.newGame(this.game.opts.home, this.game.opts.away)}>PLAY AGAIN</button>`}
              <button data-nav @click=${this.quit}>CHANGE TEAMS</button>
            </div>
          </section>
        </div>
      `,
    )
  }

  renderBracket() {
    const t = this.tournament
    if (!t) return ''
    const name = (id) => (id ? getTeam(id).name : 'TBD')
    const next = t.next()
    return this.menuFrame(
      {
        section: 'play',
        title: t.jamboree ? `${getLevel(this.level).label} JAMBOREE` : `${getLevel(this.level).label} TOURNAMENT`,
        crumb: VENUES[this.venue].label,
        back: () => this.menuBack(),
        hints: [
          ['ENTER', 'PLAY'],
          ['ESC', 'MENU'],
        ],
      },
      html`
        <section class="panel round" style="margin-top:16px">
          <h3>${t.jamboree ? 'NO STANDINGS' : 'BRACKET'}</h3>
          ${t.jamboree ? html`<p class="note">Three games, no standings, no bracket. Everybody plays, everybody gets a medal. Somebody's parent is still keeping score in a notebook.</p>` : ''}
          ${t.rounds.map(
            (round) => html`
              <h3 style="position:static;background:none;color:inherit;clip-path:none;padding:0">${round.name}</h3>
              <ul>
                ${round.games.map(
                  (g) => html`<li class="${g.user ? 'mine' : ''}">
                    <span>${name(g.home)} vs ${name(g.away)}</span>
                    <span>${g.played ? (t.jamboree ? 'Played' : `${g.score.home}–${g.score.away}${g.winner ? `, ${getTeam(g.winner).short} advance` : ''}`) : g.user ? 'Your game' : ''}</span>
                  </li>`,
                )}
              </ul>
            `,
          )}
          ${t.done
            ? html`<p class="note">${t.jamboree ? 'Everybody gets a medal \u{1F3C5}' : t.champion === t.team ? `${name(t.champion)} are champions! \u{1F3C6}` : `${name(t.champion)} win the tournament.`}</p>`
            : ''}
          <p style="margin:16px 0 0;display:flex;gap:8px;flex-wrap:wrap">
            ${next ? html`<button class="go" data-nav @click=${this.playNextTournamentGame}>PLAY ${getTeam(next.home).short} VS ${getTeam(next.away).short}</button>` : ''}
            <button data-nav @click=${this.quit}>BACK TO THE MENU</button>
          </p>
        </section>
      `,
    )
  }

  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: 'Youth Sports 27',
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
            property: 'venue',
            title: 'Venue',
            inputMethod: 'select',
            options: Object.values(VENUES).reduce((o, v) => Object.assign(o, { [v.id]: v.label }), {}),
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
          { property: 'attract', title: 'Attract mode (CPU demo)', inputMethod: 'boolean' },
          { property: 'skipIntro', title: 'Skip the title intro', inputMethod: 'boolean' },
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
