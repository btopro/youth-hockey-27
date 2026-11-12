/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Draws engine snapshots to a canvas: a vertically scrolling rink in the
// style of 16-bit hockey games, sprites, sticks, puck, HUD and banners.
// It only reads snapshots, so the same renderer paints the live game, the
// parent's phone replay and downloadable clips.
import { SURFACES, NETS } from '../engine/ages.js'
import { getSprite, SPRITE_W, SPRITE_H } from './sprites.js'
import { drawText, textWidth } from './font.js'
import { drawCrest } from './crests.js'

export const CONTROLLER_COLORS = {
  kb: '#ff5252',
  touch: '#ff5252',
  pad0: '#ff5252',
  pad1: '#40c4ff',
  pad2: '#69f0ae',
  pad3: '#ffd740',
}
export const CONTROLLER_LABELS = { kb: '1', touch: '1', pad0: '1', pad1: '2', pad2: '3', pad3: '4' }

const HUD_H = 16
const ICE = '#eef4f8'
const RED = '#d8343c'
const BLUE = '#2a5bd7'

const makeCanvas = (w, h) => {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  const c = globalThis.document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// tiny seeded noise for ice scuffs and the crowd texture
const noise = (seed) => {
  let a = seed
  return () => {
    a = (a * 1103515245 + 12345) & 0x7fffffff
    return a / 0x7fffffff
  }
}

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} opts { hud: bool, zoom: px per foot (optional) }
   */
  constructor(canvas, opts) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.opts = Object.assign({ hud: true }, opts || {})
    this.camY = null
    this.stride = new Map()
    this.lastPos = new Map()
    this.rinkCache = new Map()
    this.teams = null
    this.rules = null
  }

  setMatch(rules, teams) {
    this.rules = rules
    this.teams = teams
    this.camY = null
    this.stride.clear()
    this.lastPos.clear()
  }

  get W() {
    return this.canvas.width
  }

  get H() {
    return this.canvas.height
  }

  get viewTop() {
    return this.opts.hud ? HUD_H : 0
  }

  scaleFor(surface) {
    if (this.opts.zoom) return this.opts.zoom
    return Math.max(1, (this.W - 60) / surface.width)
  }

  // ---------- the static rink layer ----------

  rinkLayer(surfaceId, scale, homeCrest, pink) {
    const key = `${surfaceId}|${scale}|${homeCrest}|${this.rules ? this.rules.net.width : 6}|${pink ? 1 : 0}`
    if (this.rinkCache.has(key)) return this.rinkCache.get(key)
    const s = SURFACES[surfaceId]
    const pad = 6
    const w = Math.round(s.width * scale) + pad * 2
    const h = Math.round(s.length * scale) + pad * 2
    const c = makeCanvas(w, h)
    const g = c.getContext('2d')
    g.imageSmoothingEnabled = false
    const X = (x) => pad + x * scale
    const Y = (y) => pad + y * scale
    const r = s.cornerRadius * scale
    const roundRect = (x, y, rw, rh, rr) => {
      g.beginPath()
      g.moveTo(x + rr, y)
      g.arcTo(x + rw, y, x + rw, y + rh, rr)
      g.arcTo(x + rw, y + rh, x, y + rh, rr)
      g.arcTo(x, y + rh, x, y, rr)
      g.arcTo(x, y, x + rw, y, rr)
      g.closePath()
    }
    const pond = surfaceId === 'pond'
    const street = surfaceId === 'street'
    // boards: snowbanks at the pond, curbs in the street
    roundRect(pad - 4, pad - 4, s.width * scale + 8, s.length * scale + 8, r + 4)
    g.fillStyle = pond ? '#b8cfe0' : street ? '#7c7f88' : '#2b3a55'
    g.fill()
    roundRect(pad - 2, pad - 2, s.width * scale + 4, s.length * scale + 4, r + 2)
    g.fillStyle = pond ? '#f7fbff' : street ? '#c9c9c9' : '#f2c94c'
    g.fill()
    // the playing surface
    roundRect(pad, pad, s.width * scale, s.length * scale, r)
    g.fillStyle = street ? '#3d4048' : pond ? '#cfe6f2' : surfaceId === 'roller' ? '#d9dde6' : pink ? '#ffd6ea' : ICE
    g.fill()
    g.save()
    roundRect(pad, pad, s.width * scale, s.length * scale, r)
    g.clip()
    const rnd = noise(7 + s.length)
    for (let i = 0; i < (s.width * s.length) / 18; i++) {
      if (street) g.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.18)'
      else g.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,0.6)' : 'rgba(150,170,190,0.18)'
      g.fillRect(Math.floor(pad + rnd() * s.width * scale), Math.floor(pad + rnd() * s.length * scale), Math.ceil(rnd() * 3), 1)
    }
    const hline = (y, color, thick) => {
      g.fillStyle = color
      g.fillRect(pad, Math.round(Y(y) - thick / 2), s.width * scale, thick)
    }
    const circle = (cx, cy, rad, color, fill) => {
      g.beginPath()
      g.arc(X(cx), Y(cy), rad * scale, 0, Math.PI * 2)
      if (fill) {
        g.fillStyle = color
        g.fill()
      } else {
        g.strokeStyle = color
        g.lineWidth = 1
        g.stroke()
      }
    }
    const lineW = Math.max(2, Math.round(scale))
    // center line and circle
    if (s.centerLine) {
      hline(s.length / 2, RED, lineW)
      circle(s.width / 2, s.length / 2, 15, BLUE)
      circle(s.width / 2, s.length / 2, 0.8, BLUE, true)
    } else {
      circle(s.width / 2, s.length / 2, 0.8, BLUE, true)
    }
    // blue lines
    if (s.blueLines) {
      hline(s.blueLines, BLUE, lineW + 1)
      hline(s.length - s.blueLines, BLUE, lineW + 1)
    }
    // goal lines
    hline(s.goalLine, RED, 1)
    hline(s.length - s.goalLine, RED, 1)
    // end zone faceoff circles on full sheets
    if (surfaceId === 'full' || surfaceId === 'roller') {
      const off = Math.min(20, s.length * 0.2)
      for (const cy of [s.goalLine + off, s.length - s.goalLine - off]) {
        for (const cx of [s.width / 2 - 22, s.width / 2 + 22]) {
          circle(cx, cy, 15, RED)
          circle(cx, cy, 1, RED, true)
        }
      }
      if (s.blueLines) {
        for (const cy of [s.blueLines + 5, s.length - s.blueLines - 5]) {
          for (const cx of [s.width / 2 - 22, s.width / 2 + 22]) circle(cx, cy, 1, RED, true)
        }
      }
    }
    if (street) {
      // faded paint and a manhole cover
      g.fillStyle = 'rgba(232,197,71,0.55)'
      for (let y = 4; y < s.length - 4; y += 9) g.fillRect(Math.round(X(s.width / 2) - 1), Math.round(Y(y)), 2, Math.round(4 * scale))
      g.fillStyle = '#2b2d33'
      g.beginPath()
      g.arc(X(s.width * 0.3), Y(s.length * 0.6), 2.5 * scale, 0, Math.PI * 2)
      g.fill()
    }
    if (pond) {
      // cracks in the ice
      g.strokeStyle = 'rgba(120,160,190,0.5)'
      g.lineWidth = 1
      for (let i = 0; i < 6; i++) {
        let x = X(rnd() * s.width)
        let y = Y(rnd() * s.length)
        g.beginPath()
        g.moveTo(x, y)
        for (let k = 0; k < 4; k++) {
          x += (rnd() - 0.5) * 30
          y += (rnd() - 0.5) * 30
          g.lineTo(x, y)
        }
        g.stroke()
      }
    }
    // creases
    const net = this.rules ? this.rules.net : NETS.regulation
    const creaseR = net.width === 4 ? 4.5 : 6
    for (const [ly, dir] of pond || street ? [] : [
      [s.goalLine, 1],
      [s.length - s.goalLine, -1],
    ]) {
      g.beginPath()
      g.arc(X(s.width / 2), Y(ly), creaseR * scale, dir > 0 ? 0 : Math.PI, dir > 0 ? Math.PI : Math.PI * 2)
      g.closePath()
      g.fillStyle = 'rgba(110, 180, 255, 0.45)'
      g.fill()
      g.strokeStyle = RED
      g.lineWidth = 1
      g.stroke()
    }
    // home crest at center ice
    if (homeCrest) {
      const px = Math.max(1, Math.round(scale * 0.55))
      drawCrest(g, homeCrest, X(s.width / 2) - 8 * px, Y(s.length / 2) - 8 * px, px, 0.35)
    }
    g.restore()
    // nets
    for (const [ly, dir] of [
      [s.goalLine, -1],
      [s.length - s.goalLine, 1],
    ]) {
      const x0 = X(s.width / 2 - net.width / 2)
      const x1 = X(s.width / 2 + net.width / 2)
      const y0 = Y(ly)
      const y1 = Y(ly + dir * net.depth)
      const top = Math.min(y0, y1)
      const nh = Math.abs(y1 - y0)
      g.fillStyle = 'rgba(255,255,255,0.85)'
      g.fillRect(Math.round(x0), Math.round(top), Math.round(x1 - x0), Math.round(nh))
      g.fillStyle = 'rgba(120,130,150,0.6)'
      for (let yy = Math.round(top) + 1; yy < top + nh; yy += 2) {
        for (let xx = Math.round(x0) + ((yy & 2) ? 1 : 0); xx < x1; xx += 2) g.fillRect(xx, yy, 1, 1)
      }
      const frameColor = street ? '#ff7a1a' : pond ? '#8b5a2b' : RED
      g.strokeStyle = frameColor
      g.lineWidth = 1
      g.strokeRect(Math.round(x0) + 0.5, Math.round(top) + 0.5, Math.round(x1 - x0) - 1, Math.round(nh) - 1)
      g.fillStyle = frameColor
      g.fillRect(Math.round(x0) - 1, Math.round(y0) - 1, 2, 2)
      g.fillRect(Math.round(x1) - 1, Math.round(y0) - 1, 2, 2)
    }
    const layer = { canvas: c, pad, scale, w, h }
    this.rinkCache.set(key, layer)
    return layer
  }

  // the crowd texture outside the boards
  drawStands(top, height, surfaceId) {
    const g = this.ctx
    if (surfaceId === 'pond' || surfaceId === 'street') {
      // nobody came: snow and pine trees at the pond, lawns in the street
      const pond = surfaceId === 'pond'
      g.fillStyle = pond ? '#eef5fb' : '#3f6b35'
      g.fillRect(0, top, this.W, height)
      const r = noise(pond ? 41 : 43)
      for (let i = 0; i < 70; i++) {
        const x = Math.floor(r() * this.W)
        const y = Math.floor(top + r() * height)
        if (pond) {
          g.fillStyle = '#2f5d3a'
          g.fillRect(x, y, 3, 5)
          g.fillRect(x - 1, y + 2, 5, 3)
        } else {
          g.fillStyle = r() > 0.5 ? '#4c7d41' : '#355c2d'
          g.fillRect(x, y, 4, 2)
        }
      }
      return
    }
    g.fillStyle = '#141826'
    g.fillRect(0, top, this.W, height)
    const rnd = noise(99)
    const colors = ['#3a4466', '#5a3a66', '#665a3a', '#3a665a', '#6b2a3a', '#2a4a6b']
    for (let y = top; y < top + height; y += 3) {
      for (let x = 0; x < this.W; x += 3) {
        if (rnd() > 0.55) {
          g.fillStyle = colors[Math.floor(rnd() * colors.length)]
          g.fillRect(x, y, 2, 2)
        }
      }
    }
  }

  // ---------- frame ----------

  /**
   * @param {object} snap engine snapshot
   * @param {object} opts { dt, banner, sub, flash, follow: {x, y}, shake }
   */
  draw(snap, opts) {
    const o = opts || {}
    const g = this.ctx
    const surface = SURFACES[snap.surface]
    const scale = this.scaleFor(surface)
    const homeCrest = this.teams ? this.teams.home.crest : null
    const layer = this.rinkLayer(snap.surface, scale, homeCrest, (snap.modifiers || []).includes('pink-ice'))
    const viewTop = this.viewTop
    const viewH = this.H - viewTop
    const rinkPxW = layer.w
    const rinkPxH = layer.h
    const ox = Math.round((this.W - rinkPxW) / 2)
    // camera follows the puck vertically, and horizontally when zoomed in
    const follow = o.follow || snap.puck
    const targetY = follow.y * scale + layer.pad - viewH / 2
    const maxY = rinkPxH - viewH
    let camY = maxY <= 0 ? maxY / 2 : Math.max(0, Math.min(maxY, targetY))
    if (this.camY === null || o.snapCamera) this.camY = camY
    else this.camY += (camY - this.camY) * Math.min(1, (o.dt || 1 / 60) * 6)
    camY = Math.round(this.camY)
    let camX = 0
    if (rinkPxW > this.W) {
      const tx = follow.x * scale + layer.pad - this.W / 2
      camX = Math.round(Math.max(0, Math.min(rinkPxW - this.W, tx)))
    }
    const shakeX = o.shake ? Math.round(Math.sin(snap.t * 70) * o.shake) : 0
    const shakeY = o.shake ? Math.round(Math.cos(snap.t * 53) * o.shake) : 0
    const baseX = (rinkPxW > this.W ? -camX : ox) + shakeX
    const baseY = viewTop - camY + shakeY
    g.save()
    g.beginPath()
    g.rect(0, viewTop, this.W, viewH)
    g.clip()
    this.drawStands(viewTop, viewH, snap.surface)
    g.drawImage(layer.canvas, baseX, baseY)
    const SX = (x) => Math.round(baseX + layer.pad + x * scale)
    const SY = (y) => Math.round(baseY + layer.pad + y * scale)
    // skaters, back to front
    const ents = snap.skaters.slice().sort((a, b) => a.y - b.y)
    const puck = snap.puck
    let puckDrawn = false
    // the puck on fire: a trail of embers
    if (!this.trail) this.trail = []
    this.trail.push({ x: puck.x, y: puck.y })
    if (this.trail.length > 12) this.trail.shift()
    const drawPuck = () => {
      const px = SX(puck.x)
      const py = SY(puck.y)
      if (o.fire) {
        this.trail.forEach((p, i) => {
          const k = i / this.trail.length
          g.fillStyle = i % 2 ? `rgba(255,${Math.round(120 + k * 120)},40,${k})` : `rgba(255,230,90,${k * 0.8})`
          const sz = 1 + Math.round(k * 3)
          g.fillRect(SX(p.x) - Math.floor(sz / 2) + (i % 3) - 1, SY(p.y) - Math.floor(sz / 2) - 1, sz, sz)
        })
      }
      if (puck.z > 0.2) {
        g.fillStyle = 'rgba(0,0,0,0.25)'
        g.fillRect(px - 1, py, 3, 1)
      }
      const lift = Math.round(puck.z * scale * 0.6)
      g.fillStyle = '#111111'
      g.fillRect(px - 1, py - 1 - lift, 3, 2)
      g.fillStyle = '#5a5a5a'
      g.fillRect(px - 1, py - 1 - lift, 3, 1)
      puckDrawn = true
    }
    for (const e of ents) {
      if (!puckDrawn && puck.y < e.y && !puck.uid) drawPuck()
      this.drawSkater(e, SX(e.x), SY(e.y), snap, o.dt || 1 / 60)
      if (puck.uid === e.uid) drawPuck()
    }
    if (!puckDrawn) drawPuck()
    g.restore()
    if (this.opts.hud) this.drawHud(snap)
    if (o.banner) this.drawBanner(o.banner, o.bannerColor, o.sub)
  }

  viewFor(e, snap) {
    if (e.goalie) {
      const s = SURFACES[snap.surface]
      return { view: e.y > s.length / 2 ? 'up' : 'down', flip: false }
    }
    const dx = Math.cos(e.dir)
    const dy = Math.sin(e.dir)
    if (Math.abs(dy) > Math.abs(dx) * 0.8) return { view: dy < 0 ? 'up' : 'down', flip: false }
    return { view: 'side', flip: dx < 0 }
  }

  drawSkater(e, sx, sy, snap, dt) {
    const g = this.ctx
    const team = this.teams ? this.teams[e.side] : null
    let kit = team ? team.kit : { jersey: '#888', trim: '#fff', stripe: '#444', number: '#fff', helmet: '#222', pants: '#222' }
    // a guest star wears their own look over the team kit
    const look = e.look || null
    if (look) kit = Object.assign({}, kit, look.jersey ? { jersey: look.jersey } : {}, look.trim ? { trim: look.trim } : {}, look.helmet ? { helmet: look.helmet } : {}, look.pants ? { pants: look.pants } : {})
    const mods = snap.modifiers || []
    // stride animation from distance skated
    const last = this.lastPos.get(e.uid)
    const moved = last ? Math.hypot(e.x - last.x, e.y - last.y) : 0
    this.lastPos.set(e.uid, { x: e.x, y: e.y })
    const acc = (this.stride.get(e.uid) || 0) + (moved < 20 ? moved : 0)
    this.stride.set(e.uid, acc)
    const frame = Math.floor(acc / 2.2) % 2
    const { view, flip } = this.viewFor(e, snap)
    const sprite = getSprite(kit, e.skin, view, e.goalie ? 0 : frame, e.number, e.goalie)
    let scale = look && look.scale ? look.scale : 1
    if (e.goalie && mods.includes('tiny-goalies')) scale = 0.6
    const bigHead = mods.includes('big-heads') || (look && look.bigHead)
    const w = Math.round((SPRITE_W + 2) * scale)
    const h = Math.round((SPRITE_H + 2) * scale)
    // shadow
    g.fillStyle = 'rgba(20, 40, 70, 0.22)'
    g.fillRect(sx - Math.round(4 * scale), sy - 1, Math.round(9 * scale), 2)
    // controlled marker under the feet
    if (e.controller && CONTROLLER_COLORS[e.controller]) {
      g.fillStyle = CONTROLLER_COLORS[e.controller]
      g.fillRect(sx - 5, sy, 11, 1)
      g.fillRect(sx - 4, sy + 1, 9, 1)
    }
    const stickBehind = view === 'up'
    const fx = Math.cos(e.dir)
    const fy = Math.sin(e.dir)
    const stickColor = team && team.stickColor ? team.stickColor : '#a0522d'
    const drawStick = () => {
      if (e.brokenStick) return
      if (e.goalie) {
        g.fillStyle = '#8b5a2b'
        const gx = sx + (view === 'up' ? -6 : 3)
        g.fillRect(gx, sy - 2, 4, 1)
        return
      }
      const hx = sx + (e.hand === 'L' ? -2 : 2)
      const hy = sy - Math.round(6 * scale)
      const len = Math.round(7 * scale)
      g.fillStyle = stickColor
      for (let i = 0; i < len; i++) g.fillRect(Math.round(hx + fx * i), Math.round(hy + fy * i * 0.8 + i * 0.5), 1, 1)
      const bx = Math.round(hx + fx * len)
      const by = Math.round(hy + fy * len * 0.8 + len * 0.5)
      g.fillStyle = '#222222'
      g.fillRect(bx - 1, by, 3, 1)
    }
    const top = sy - h + 1
    if (e.stun) {
      // knocked down: lying on the ice
      g.save()
      g.translate(sx, sy - 3)
      g.rotate(Math.PI / 2)
      g.drawImage(sprite, -Math.floor(w / 2), -Math.floor(h / 2), w, h)
      g.restore()
      return
    }
    let jx = 0
    if (e.fighting) jx = Math.round(Math.sin(snap.t * 40 + e.uid) * 1.5)
    if (stickBehind) drawStick()
    const drawBody = (dx) => {
      g.drawImage(sprite, dx, top, w, h)
      if (bigHead) {
        // the head rows of the sprite, blown up
        const hs = 1.9
        const hw = Math.round((SPRITE_W + 2) * scale * hs)
        const hh = Math.round(7 * scale * hs)
        g.drawImage(sprite, 0, 0, SPRITE_W + 2, 7, dx + Math.round((w - hw) / 2), top - hh + Math.round(7 * scale), hw, hh)
      }
    }
    if (flip) {
      g.save()
      g.translate(sx + jx, 0)
      g.scale(-1, 1)
      drawBody(-Math.floor(w / 2))
      g.restore()
    } else {
      drawBody(sx + jx - Math.floor(w / 2))
    }
    if (!stickBehind) drawStick()
    if (e.fighting) {
      // gloves on the ice and a scuffle cloud
      g.fillStyle = '#ffffff'
      const t = Math.floor(snap.t * 12) % 4
      g.fillRect(sx - 6 + t, top - 2, 2, 2)
      g.fillRect(sx + 4 - t, top, 2, 2)
    }
    // player number over the controlled player
    if (e.controller && CONTROLLER_LABELS[e.controller]) {
      const color = CONTROLLER_COLORS[e.controller]
      drawText(g, CONTROLLER_LABELS[e.controller], sx, top - (bigHead ? 18 : 9), color, { align: 'center', shadow: '#10131c' })
    }
  }

  drawHud(snap) {
    const g = this.ctx
    g.fillStyle = '#10131c'
    g.fillRect(0, 0, this.W, HUD_H)
    g.fillStyle = '#f2c94c'
    g.fillRect(0, HUD_H - 1, this.W, 1)
    const rules = this.rules
    const teams = this.teams
    if (!rules || !teams) return
    const keep = rules.keepScore
    const y = 4
    // home on the left
    drawCrest(g, teams.home.crest, 3, 1, 0.8)
    drawText(g, teams.home.short, 19, y, teams.home.kit.jersey === '#111111' || teams.home.kit.jersey === '#151217' ? teams.home.kit.trim : teams.home.kit.jersey, { shadow: '#000' })
    drawCrest(g, teams.away.crest, this.W - 16, 1, 0.8)
    drawText(g, teams.away.short, this.W - 19, y, teams.away.kit.jersey === '#111111' || teams.away.kit.jersey === '#151217' ? teams.away.kit.trim : teams.away.kit.jersey, { align: 'right', shadow: '#000' })
    if (keep) {
      drawText(g, snap.score.home, 42, y, '#ffffff', { shadow: '#000' })
      drawText(g, snap.score.away, this.W - 42, y, '#ffffff', { align: 'right', shadow: '#000' })
    }
    const per = snap.period > rules.periods ? 'OT' : ['1ST', '2ND', '3RD'][snap.period - 1] || `${snap.period}`
    const gameSeconds = Math.max(0, (snap.clock / rules.periodSeconds) * rules.periodMinutes * 60)
    const m = Math.floor(gameSeconds / 60)
    const sec = Math.floor(gameSeconds % 60)
    const clock = `${m}:${sec < 10 ? '0' : ''}${sec}`
    drawText(g, `${per} ${clock}`, this.W / 2, y, '#f2c94c', { align: 'center', shadow: '#000' })
    // strength and delayed penalty, along the bottom of the ice
    const msgs = []
    const hs = snap.strength.home
    const as = snap.strength.away
    if (hs !== as) {
      const pp = hs > as ? teams.home.short : teams.away.short
      msgs.push(`${pp} POWER PLAY ${Math.max(hs, as)}V${Math.min(hs, as)}`)
    }
    if (snap.delayed) msgs.push(`DELAYED PENALTY ${teams[snap.delayed].short}`)
    if (msgs.length) {
      const text = msgs.join('  ')
      const w = textWidth(text, 1) + 8
      g.fillStyle = 'rgba(16, 19, 28, 0.8)'
      g.fillRect(Math.round(this.W / 2 - w / 2), this.H - 12, w, 11)
      drawText(g, text, this.W / 2, this.H - 10, '#ffffff', { align: 'center' })
    }
  }

  drawBanner(text, color, sub) {
    const g = this.ctx
    const lines = String(text).split('\n')
    const big = 2
    const h = lines.length * 9 * big + (sub ? 12 : 0) + 8
    const top = Math.round(this.viewTop + (this.H - this.viewTop) * 0.36 - h / 2)
    g.fillStyle = 'rgba(16, 19, 28, 0.78)'
    g.fillRect(0, top, this.W, h)
    g.fillStyle = color || '#f2c94c'
    g.fillRect(0, top, this.W, 1)
    g.fillRect(0, top + h - 1, this.W, 1)
    lines.forEach((line, i) => {
      // shrink lines that would not fit
      const s = textWidth(line, big) > this.W - 8 ? 1 : big
      drawText(g, line, this.W / 2, top + 4 + i * 9 * big + (big - s) * 3, color || '#f2c94c', { align: 'center', scale: s, shadow: '#000' })
    })
    if (sub) drawText(g, sub, this.W / 2, top + h - 11, '#ffffff', { align: 'center', shadow: '#000' })
  }
}
