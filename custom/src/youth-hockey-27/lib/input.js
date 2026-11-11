/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Keyboard, up to four gamepads and touch, reduced to one shape per
// controller: { x, y, pass, shoot, check, stick, pause, clip, confirm, back }
// where the buttons are true only on the frame they are pressed.

const KEYS = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  a: 'left',
  d: 'right',
  w: 'up',
  s: 'down',
  z: 'pass',
  x: 'shoot',
  ' ': 'shoot',
  c: 'check',
  v: 'stick',
  p: 'pause',
  Escape: 'pause',
  r: 'clip',
  Enter: 'confirm',
  Backspace: 'back',
}

const BUTTONS = ['pass', 'shoot', 'check', 'stick', 'pause', 'clip', 'confirm', 'back']

const empty = () => ({ x: 0, y: 0, pass: false, shoot: false, check: false, stick: false, pause: false, clip: false, confirm: false, back: false })

export class InputManager {
  constructor(host) {
    this.host = host
    this.keys = new Set()
    // buttons pressed since the last poll, so a quick tap between frames counts
    this.tapped = new Set()
    this.prev = {}
    this.touch = { x: 0, y: 0, pass: false, shoot: false, check: false, stick: false, pause: false, clip: false, active: false }
    this.onKeyDown = (e) => {
      const k = KEYS[e.key] || KEYS[e.key.toLowerCase()]
      if (!k || !this.enabled) return
      // only take keys when the game has focus or is playing
      if (!this.host.capturesKeys(e)) return
      this.keys.add(k)
      this.tapped.add(k)
      if (['up', 'down', 'left', 'right', 'shoot'].includes(k)) e.preventDefault()
    }
    this.onKeyUp = (e) => {
      const k = KEYS[e.key] || KEYS[e.key.toLowerCase()]
      if (k) this.keys.delete(k)
    }
    this.onBlur = () => {
      this.keys.clear()
      this.tapped.clear()
    }
    this.enabled = true
  }

  attach() {
    globalThis.addEventListener('keydown', this.onKeyDown)
    globalThis.addEventListener('keyup', this.onKeyUp)
    globalThis.addEventListener('blur', this.onBlur)
  }

  detach() {
    globalThis.removeEventListener('keydown', this.onKeyDown)
    globalThis.removeEventListener('keyup', this.onKeyUp)
    globalThis.removeEventListener('blur', this.onBlur)
  }

  // connected gamepad slots, as controller ids pad0-pad3
  pads() {
    const out = []
    const list = globalThis.navigator && globalThis.navigator.getGamepads ? globalThis.navigator.getGamepads() : []
    for (let i = 0; i < Math.min(4, list.length); i++) {
      if (list[i] && list[i].connected) out.push({ id: `pad${i}`, index: i, name: list[i].id })
    }
    return out
  }

  rawKeyboard() {
    const s = empty()
    s.x = (this.keys.has('right') ? 1 : 0) - (this.keys.has('left') ? 1 : 0)
    s.y = (this.keys.has('down') ? 1 : 0) - (this.keys.has('up') ? 1 : 0)
    BUTTONS.forEach((b) => {
      s[b] = this.keys.has(b)
    })
    return s
  }

  rawPad(index) {
    const list = globalThis.navigator.getGamepads()
    const p = list[index]
    const s = empty()
    if (!p) return s
    const dead = (v) => (Math.abs(v) < 0.25 ? 0 : v)
    s.x = dead(p.axes[0] || 0)
    s.y = dead(p.axes[1] || 0)
    const b = (i) => !!(p.buttons[i] && p.buttons[i].pressed)
    if (b(14)) s.x = -1
    if (b(15)) s.x = 1
    if (b(12)) s.y = -1
    if (b(13)) s.y = 1
    s.pass = b(0)
    s.shoot = b(1)
    s.check = b(2)
    s.stick = b(3)
    s.pause = b(9)
    s.clip = b(8)
    s.confirm = b(0)
    s.back = b(1)
    return s
  }

  // called on a touch button press so a quick tap between frames counts
  tap(button) {
    this.tapped.add(button)
  }

  rawTouch() {
    const s = empty()
    s.x = this.touch.x
    s.y = this.touch.y
    BUTTONS.forEach((k) => {
      s[k] = !!this.touch[k]
    })
    s.confirm = this.touch.pass
    return s
  }

  /**
   * Poll every controller. Returns { [id]: state } with button edges and,
   * for menus, nav edges (navX / navY: -1, 0 or 1 on the frame it moves).
   */
  poll() {
    const raw = { kb: this.rawKeyboard() }
    this.pads().forEach((p) => {
      raw[p.id] = this.rawPad(p.index)
    })
    // touch is another way to drive player 1, same as the keyboard
    if (this.touch.active) {
      const t = this.rawTouch()
      const k = raw.kb
      if (t.x || t.y) {
        k.x = t.x
        k.y = t.y
      }
      BUTTONS.forEach((btn) => {
        k[btn] = k[btn] || t[btn]
      })
    }
    const out = {}
    for (const id of Object.keys(raw)) {
      const cur = raw[id]
      const prev = this.prev[id] || empty()
      const edge = Object.assign({}, cur)
      BUTTONS.forEach((b) => {
        edge[b] = (cur[b] && !prev[b]) || (id === 'kb' && this.tapped.has(b))
      })
      // normalize diagonals
      const len = Math.hypot(cur.x, cur.y)
      if (len > 1) {
        edge.x = cur.x / len
        edge.y = cur.y / len
      }
      const dir = (v) => (v > 0.5 ? 1 : v < -0.5 ? -1 : 0)
      edge.navX = dir(cur.x) !== dir(prev.x) ? dir(cur.x) : 0
      edge.navY = dir(cur.y) !== dir(prev.y) ? dir(cur.y) : 0
      out[id] = edge
      this.prev[id] = cur
    }
    this.tapped.clear()
    return out
  }
}
