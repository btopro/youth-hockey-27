/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The opening: an old TV clicks on, static, then YOUTH and SPORTS slam in as
// huge extruded chrome letters and a gold 27 drops from the sky while the
// crowd roars. Scanlines, a rolling bar and flicker the whole way through.
import { drawText, textWidth } from './font.js'

const makeCanvas = (w, h) => {
  const c = globalThis.document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// a word as bitmap: chrome face, dark extrusion, black outline
const wordArt = (text, scale, faceStops, sideColor) => {
  const w = textWidth(text, scale) + scale * 8
  const h = 7 * scale + scale * 8
  const mask = makeCanvas(w, h)
  const m = mask.getContext('2d')
  drawText(m, text, scale * 2, scale * 2, '#ffffff', { scale })
  const tint = (fill) => {
    const c = makeCanvas(w, h)
    const g = c.getContext('2d')
    g.drawImage(mask, 0, 0)
    g.globalCompositeOperation = 'source-atop'
    g.fillStyle = fill(g)
    g.fillRect(0, 0, w, h)
    return c
  }
  const face = tint((g) => {
    const grad = g.createLinearGradient(0, scale * 2, 0, scale * 9)
    faceStops.forEach(([at, color]) => grad.addColorStop(at, color))
    return grad
  })
  const side = tint(() => sideColor)
  const ink = tint(() => '#05060c')
  const out = makeCanvas(w + scale * 4, h + scale * 4)
  const o = out.getContext('2d')
  o.imageSmoothingEnabled = false
  const depth = Math.max(3, Math.round(scale * 1.2))
  // outline all the way around the extrusion
  for (let d = depth; d >= 0; d--) {
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) o.drawImage(ink, d + dx * 2, d + dy * 2)
  }
  for (let d = depth; d > 0; d--) o.drawImage(side, d, d)
  o.drawImage(face, 0, 0)
  // a hard shine across the top third
  o.globalCompositeOperation = 'source-atop'
  o.fillStyle = 'rgba(255,255,255,0.35)'
  o.fillRect(0, scale * 2, out.width, Math.round(scale * 1.6))
  return out
}

const CHROME = [
  [0, '#ffffff'],
  [0.45, '#b9d6ff'],
  [0.55, '#2a5bd7'],
  [1, '#e8f1ff'],
]
const GOLD = [
  [0, '#fff6c8'],
  [0.45, '#f2c94c'],
  [0.55, '#b07b10'],
  [1, '#ffe27a'],
]

// the timeline, in seconds
export const INTRO = { lineOn: 0.25, staticEnd: 1.4, youth: 1.6, sports: 2.15, num: 2.75, tagline: 3.4, prompt: 4.4, length: 4.4 }

export class Intro {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.t = 0
    this.seed = 7
    this.art = null
    this.sparks = Array.from({ length: 40 }, (_, i) => ({ a: (i * 137.5) % 360, r: 0.3 + ((i * 53) % 70) / 100, s: 1 + (i % 3) }))
  }

  rand() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff
    return this.seed / 0x7fffffff
  }

  build() {
    const W = this.canvas.width
    const big = Math.max(4, Math.floor(W / 64))
    this.art = {
      youth: wordArt('YOUTH', big, CHROME, '#0d1f5c'),
      sports: wordArt('SPORTS', big, CHROME, '#0d1f5c'),
      num: wordArt('27', Math.round(big * 1.75), GOLD, '#6b3f00'),
    }
    this.big = big
    this.numScale = Math.round(big * 1.75)
  }

  // ease out with a little overshoot, for a slam
  static slam(p) {
    if (p <= 0) return 0
    if (p >= 1) return 1
    const c = 1.7
    return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2)
  }

  draw(t, opts) {
    const o = opts || {}
    if (!this.art) this.build()
    this.t = t
    const g = this.ctx
    const W = this.canvas.width
    const H = this.canvas.height
    g.save()
    g.fillStyle = '#04050a'
    g.fillRect(0, 0, W, H)
    if (t < INTRO.lineOn) {
      // the tube warming up: a dot
      g.fillStyle = 'rgba(200,220,255,0.8)'
      g.fillRect(W / 2 - 1, H / 2 - 1, 2, 2)
    } else if (t < INTRO.lineOn + 0.3) {
      // a white line opening up into the picture
      const p = (t - INTRO.lineOn) / 0.3
      const h = Math.max(2, p * p * H)
      g.fillStyle = '#e8f1ff'
      g.fillRect(0, H / 2 - h / 2, W, h)
    } else {
      // a rink-blue glow behind everything
      const glow = g.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H * 0.45, W * 0.75)
      glow.addColorStop(0, '#1d2f6b')
      glow.addColorStop(1, '#04050a')
      g.fillStyle = glow
      g.fillRect(0, 0, W, H)
      // spotlight sweeps
      for (let i = 0; i < 2; i++) {
        const a = Math.sin(t * 0.9 + i * 2.2) * 0.5
        g.save()
        g.translate(W * (0.25 + i * 0.5), H + 10)
        g.rotate(a + (i ? 0.25 : -0.25))
        g.fillStyle = 'rgba(180,210,255,0.06)'
        g.beginPath()
        g.moveTo(-6, 0)
        g.lineTo(6, 0)
        g.lineTo(70, -H * 1.3)
        g.lineTo(-70, -H * 1.3)
        g.fill()
        g.restore()
      }
      if (t < INTRO.staticEnd) this.static(g, W, H, 1 - (t - INTRO.lineOn - 0.3) / (INTRO.staticEnd - INTRO.lineOn - 0.3))
      this.logo(g, W, H, t)
    }
    this.tv(g, W, H, t)
    g.restore()
    if (o.prompt && t > INTRO.prompt && Math.floor(t * 2.5) % 2 === 0) {
      drawText(g, o.prompt, W / 2, Math.round(H * 0.86), '#ffffff', { align: 'center', scale: Math.max(2, Math.floor(W / 200)), shadow: '#000' })
    }
  }

  static(g, W, H, amount) {
    const a = Math.max(0, Math.min(1, amount))
    const size = 3
    for (let y = 0; y < H; y += size) {
      for (let x = 0; x < W; x += size) {
        const v = this.rand()
        if (v < 0.5 * a + 0.1) {
          const c = Math.floor(v * 255 * a + 40)
          g.fillStyle = `rgba(${c},${c},${c + 20},${0.85 * a + 0.1})`
          g.fillRect(x, y, size, size)
        }
      }
    }
  }

  logo(g, W, H, t) {
    const { youth, sports, num } = this.art
    // where each word's letters sit (their centers); the bitmaps carry
    // padding for the outline and extrusion, 4 scale units below center
    const big = this.big
    const ns = this.numScale
    const youthY = Math.round(H * 0.14)
    const sportsY = youthY + big * 10.5
    const numY = sportsY + big * 3.5 + big * 2 + ns * 3.5
    const place = (img, startT, from, x, glyphY, sc) => {
      const y = glyphY + 4 * sc
      if (t < startT) return
      const p = Intro.slam(Math.min(1, (t - startT) / 0.28))
      const dx = from === 'left' ? -W * (1 - p) : from === 'right' ? W * (1 - p) : 0
      const dy = from === 'top' ? -H * (1 - p) : 0
      const s = from === 'top' ? 1 + (1 - p) * 0.6 : 1
      g.save()
      g.translate(Math.round(x + dx), Math.round(y + dy))
      g.scale(s, s)
      g.drawImage(img, Math.round(-img.width / 2), Math.round(-img.height / 2))
      g.restore()
    }
    place(youth, INTRO.youth, 'left', W / 2, youthY, big)
    place(sports, INTRO.sports, 'right', W / 2, sportsY, big)
    place(num, INTRO.num, 'top', W / 2, numY, ns)
    // shockwave when the 27 lands
    const land = INTRO.num + 0.28
    if (t > land && t < land + 0.6) {
      const p = (t - land) / 0.6
      g.strokeStyle = `rgba(255,226,122,${1 - p})`
      g.lineWidth = 6 * (1 - p) + 1
      g.beginPath()
      g.ellipse(W / 2, numY, W * 0.6 * p, H * 0.25 * p, 0, 0, Math.PI * 2)
      g.stroke()
    }
    // sparkles around the 27
    if (t > land) {
      const cx = W / 2
      const ny = numY
      this.sparks.forEach((sp, i) => {
        const a = ((sp.a + t * 40 * (i % 2 ? 1 : -1)) * Math.PI) / 180
        const r = (num.width * 0.5 + 10) * sp.r + Math.sin(t * 3 + i) * 6
        const tw = (Math.sin(t * 8 + i * 1.3) + 1) / 2
        g.fillStyle = `rgba(255,240,180,${0.3 + tw * 0.7})`
        g.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(ny + Math.sin(a) * r * 0.5), sp.s, sp.s)
      })
    }
    if (t > INTRO.tagline) {
      const scale = Math.max(2, Math.floor(W / 220))
      const full = "IT'S IN THE MINIVAN."
      const n = Math.min(full.length, Math.floor((t - INTRO.tagline) * 24))
      drawText(g, full.slice(0, n), W / 2, Math.round(numY + ns * 3.5 + big * 4.5), '#ff3fa4', { align: 'center', scale, shadow: '#000' })
    }
  }

  // the old TV: scanlines, a rolling bar, flicker, a dark curved edge
  tv(g, W, H, t) {
    g.fillStyle = 'rgba(0,0,0,0.28)'
    for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1)
    const barY = ((t * 0.35) % 1.3) * H - H * 0.15
    const bar = g.createLinearGradient(0, barY, 0, barY + H * 0.15)
    bar.addColorStop(0, 'rgba(255,255,255,0)')
    bar.addColorStop(0.5, 'rgba(255,255,255,0.06)')
    bar.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = bar
    g.fillRect(0, barY, W, H * 0.15)
    // flicker
    const flick = Math.sin(t * 60) * 0.02 + (this.rand() < 0.03 ? 0.08 : 0)
    if (flick > 0) {
      g.fillStyle = `rgba(255,255,255,${flick})`
      g.fillRect(0, 0, W, H)
    }
    const vig = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.75)')
    g.fillStyle = vig
    g.fillRect(0, 0, W, H)
  }
}
