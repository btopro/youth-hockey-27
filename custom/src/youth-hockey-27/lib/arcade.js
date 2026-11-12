/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The menu backdrop, in the "bold arcade" look the menus share: a dark base,
// big slanted slabs of the section colour drifting, speed stripes racing
// across, twinkling sparks and a dark frame. The menus themselves are DOM
// (buttons, focus, screen readers) drawn over this canvas.

// each menu section has a colour
export const SECTIONS = {
  play: { color: '#ff3b4e', dark: '#3a0a14', lit: '#ff6a72' },
  options: { color: '#3b8bff', dark: '#0e1e3e', lit: '#78a0ff' },
  extras: { color: '#b45cff', dark: '#22103a', lit: '#c77dff' },
  howto: { color: '#2fe08a', dark: '#0c2a1e', lit: '#6fe3a8' },
  title: { color: '#5ad0ff', dark: '#0d1830', lit: '#9fe4ff' },
  gold: { color: '#ffd23f', dark: '#3a2c06', lit: '#ffe27a' },
}

const slant = (g, x, y, w, h, sk) => {
  g.beginPath()
  g.moveTo(x + sk, y)
  g.lineTo(x + w, y)
  g.lineTo(x + w - sk, y + h)
  g.lineTo(x, y + h)
  g.closePath()
  g.fill()
}

export class ArcadeBg {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.accent = SECTIONS.title.color
    this.second = SECTIONS.title.lit
    this.sparks = Array.from({ length: 30 }, (_, i) => [((i * 7919) % 997) / 997, ((i * 104729) % 991) / 991, 0.3 + ((i * 31) % 97) / 140])
  }

  setSection(id) {
    const s = SECTIONS[id] || SECTIONS.title
    this.accent = s.color
    this.second = s.lit
  }

  draw(t, still) {
    const g = this.ctx
    const W = this.canvas.width
    const H = this.canvas.height
    const f = still ? 0 : t * 60
    g.fillStyle = '#07060e'
    g.fillRect(0, 0, W, H)
    for (let i = 0; i < 6; i++) {
      g.fillStyle = `rgba(13,11,26,${1 - i * 0.12})`
      g.fillRect(0, H - 60 + i * 10, W, 10)
    }
    const d = (f * 0.25) % 80
    g.globalAlpha = 0.08
    g.fillStyle = this.accent
    slant(g, W * 0.58 + d * 0.5, -10, W * 0.55, H + 20, H * 0.45)
    g.globalAlpha = 0.07
    g.fillStyle = this.second
    slant(g, W * 0.72 + d * 0.5, -10, W * 0.18, H + 20, H * 0.45)
    g.globalAlpha = 0.05
    g.fillStyle = this.accent
    slant(g, -W * 0.3 - d * 0.3, -10, W * 0.42, H + 20, H * 0.45)
    g.globalAlpha = 1
    for (let i = 0; i < 12; i++) {
      const s = this.sparks[i]
      const y = 20 + s[1] * (H - 40)
      const len = 30 + s[2] * 90
      const x = ((s[0] * W * 2 + f * (3 + s[2] * 6)) % (W + len * 2)) - len
      g.globalAlpha = 0.06 + s[2] * 0.08
      g.fillStyle = i % 3 ? this.accent : '#e8e4ff'
      g.fillRect(x, y, len, 1)
    }
    for (let i = 12; i < this.sparks.length; i++) {
      const s = this.sparks[i]
      const a = (Math.sin(f * 0.05 + i * 1.7) + 1) / 2
      g.globalAlpha = 0.15 + a * 0.4
      g.fillStyle = i % 2 ? this.accent : '#e8e4ff'
      const sz = a > 0.8 ? 2 : 1
      g.fillRect(s[0] * W, s[1] * H, sz, sz)
    }
    g.globalAlpha = 1
    for (let i = 0; i < 4; i++) {
      g.fillStyle = 'rgba(0,0,0,0.12)'
      g.fillRect(0, i * 4, W, 4)
      g.fillRect(0, H - (i + 1) * 4, W, 4)
    }
  }
}

// chunky pixel icons for menu tiles, as SVG rect lists ('#' = colour, '*' = accent)
export const ICONS = {
  play: ['..........', '.##....##.', '..##..##..', '...####...', '....##....', '...####...', '..##..##..', '.##....##.', '..........'],
  puck: ['..........', '..######..', '.########.', '.#******#.', '.########.', '..######..', '..........'],
  options: ['....##....', '.#.####.#.', '..######..', '.###..###.', '###....###', '.###..###.', '..######..', '.#.####.#.', '....##....'],
  extras: ['...####...', '..#....#..', '##########', '#........#', '#..****..#', '#..*..*..#', '#..****..#', '#........#', '##########'],
  howto: ['##########', '#........#', '#.******.#', '#........#', '#.****...#', '#........#', '#.*****..#', '#........#', '##########'],
  trophy: ['##########', '#.######.#', '#.######.#', '.#.####.#.', '...####...', '....##....', '....##....', '..######..', '..######..'],
  back: ['...#......', '..##......', '.#######..', '########..', '.#######..', '..##...#..', '...#...#..', '.......#..', '..#####...'],
}

export const iconSvg = (id, color, accent) => {
  const rows = ICONS[id] || ICONS.puck
  const w = rows[0].length
  const h = rows.length
  let rects = ''
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      if (r[x] === '.') continue
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${r[x] === '*' ? accent || '#ffffff' : color}"/>`
    }
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`
}

// as an image URL, so templates can use <img> without unsafe HTML
export const iconUrl = (id, color, accent) => `data:image/svg+xml,${encodeURIComponent(iconSvg(id, color, accent))}`
