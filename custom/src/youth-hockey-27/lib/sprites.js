/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Procedural 16-bit skaters and goalies, colored from a team kit. Same skin
// palette as rpg-character so the players match the crowd. Sprites are
// 12 x 15 pixels, drawn once per kit / skin / view / frame and cached.

export const SPRITE_W = 12
export const SPRITE_H = 15

// h helmet, f skin, e eye, v cage, j jersey, t trim, s stripe, g glove,
// p pants, k boot, b blade, w goalie pads
const VIEWS = {
  down: [
    '....hhhh....',
    '...hhhhhh...',
    '...hffffh...',
    '...vfefev...',
    '....ffff....',
    '..tjjjjjjt..',
    '.gjjjjjjjjg.',
    '.gjjssssjjg.',
    '..jjjjjjjj..',
    '..tttttttt..',
    '..pppppppp..',
  ],
  up: [
    '....hhhh....',
    '...hhhhhh...',
    '...hhhhhh...',
    '...hhhhhh...',
    '....ffff....',
    '..tjjjjjjt..',
    '.gjjjjjjjjg.',
    '.gjjjjjjjjg.',
    '..jjjjjjjj..',
    '..tttttttt..',
    '..pppppppp..',
  ],
  side: [
    '....hhhh....',
    '...hhhhhh...',
    '...hhhfff...',
    '...hhfefv...',
    '....hfffv...',
    '...jjjjjt...',
    '..jjjjjjjg..',
    '..jjjjjjjg..',
    '..sssssss...',
    '..ttttttt...',
    '..ppppppp...',
  ],
}

const LEGS = {
  down: [
    ['..ppp..ppp..', '..pp....pp..', '..kk....kk..', '.bbb....bbb.'],
    ['..ppp..ppp..', '...pp..pp...', '...kk..kk...', '..bbb..bbb..'],
  ],
  up: [
    ['..ppp..ppp..', '..pp....pp..', '..kk....kk..', '.bbb....bbb.'],
    ['..ppp..ppp..', '...pp..pp...', '...kk..kk...', '..bbb..bbb..'],
  ],
  side: [
    ['...pp.pp....', '...pp..pp...', '...kk..kk...', '..bbb..bbbb.'],
    ['..pp...pp...', '..pp....pp..', '..kk....kk..', '.bbb....bbbb'],
  ],
}

const GOALIE = {
  down: [
    '....hhhh....',
    '...hhhhhh...',
    '...hvvvvh...',
    '...hvfvfh...',
    '....vvvv....',
    '.tjjjjjjjjt.',
    'gjjjjjjjjjjg',
    'gjjjsssjjjjg',
    '.jjjjjjjjjj.',
    '.tttttttttt.',
    '.wwwwppwwww.',
    '.wwww..wwww.',
    '.wtww..wwtw.',
    '.wwww..wwww.',
    '.kkkk..kkkk.',
  ],
  up: [
    '....hhhh....',
    '...hhhhhh...',
    '...hhhhhh...',
    '...hhhhhh...',
    '....hhhh....',
    '.tjjjjjjjjt.',
    'gjjjjjjjjjjg',
    'gjjjjjjjjjjg',
    '.jjjjjjjjjj.',
    '.tttttttttt.',
    '.wwwwppwwww.',
    '.wwww..wwww.',
    '.wtww..wwtw.',
    '.wwww..wwww.',
    '.kkkk..kkkk.',
  ],
}

// 3x5 digits for jersey numbers
const DIGITS = {
  0: ['###', '#.#', '#.#', '#.#', '###'],
  1: ['.#.', '##.', '.#.', '.#.', '###'],
  2: ['###', '..#', '###', '#..', '###'],
  3: ['###', '..#', '.##', '..#', '###'],
  4: ['#.#', '#.#', '###', '..#', '..#'],
  5: ['###', '#..', '###', '..#', '###'],
  6: ['###', '#..', '###', '#.#', '###'],
  7: ['###', '..#', '.#.', '.#.', '.#.'],
  8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '###'],
}

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

const normHex = (hex) => {
  if (hex.length === 4) return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  return hex
}

const colorsFor = (kit, skin) => ({
  h: kit.helmet,
  f: skin,
  e: '#222222',
  v: '#cfd8dc',
  j: kit.jersey,
  t: kit.trim,
  s: kit.stripe,
  g: shade(normHex(kit.pants), 30),
  p: kit.pants,
  k: '#222222',
  b: '#e8eef2',
  w: '#f4f4f4',
})

const makeCanvas = (w, h) => {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  const c = globalThis.document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// a 1px dark outline around everything opaque
const outline = (ctx, w, h) => {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0
  const add = []
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (solid(x, y)) continue
      if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) add.push([x, y])
    }
  }
  ctx.fillStyle = 'rgba(16, 20, 32, 0.75)'
  add.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1))
}

const cache = new Map()

/**
 * A cached sprite canvas, 2px bigger than SPRITE_W x SPRITE_H to hold the
 * outline. view: 'down' | 'up' | 'side'. frame: 0 | 1.
 */
export const getSprite = (kit, skin, view, frame, number, goalie) => {
  const key = `${kit.jersey}${kit.trim}${kit.helmet}${kit.stripe}${kit.pants}|${skin}|${view}|${frame}|${number}|${goalie ? 1 : 0}`
  if (cache.has(key)) return cache.get(key)
  const W = SPRITE_W + 2
  const H = SPRITE_H + 2
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const colors = colorsFor(kit, skin)
  let rows
  if (goalie) rows = GOALIE[view === 'up' ? 'up' : 'down']
  else rows = VIEWS[view].concat(LEGS[view][frame % 2])
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x]
      if (c === '.') continue
      ctx.fillStyle = colors[c]
      ctx.fillRect(x + 1, y + 1, 1, 1)
    }
  })
  // number on the back
  if (view === 'up' && number !== undefined && number !== null) {
    const digits = String(number).split('')
    const width = digits.length * 4 - 1
    let x = 1 + Math.round((SPRITE_W - width) / 2)
    ctx.fillStyle = kit.number
    digits.forEach((dch) => {
      const g = DIGITS[dch]
      g.forEach((line, gy) => {
        for (let gx = 0; gx < 3; gx++) if (line[gx] === '#') ctx.fillRect(x + gx, 1 + 5 + gy, 1, 1)
      })
      x += 4
    })
  }
  outline(ctx, W, H)
  cache.set(key, canvas)
  return canvas
}

// how far from a kit's jersey another jersey is (to avoid clashing kits)
export const colorDistance = (a, b) => {
  const pa = parseInt(normHex(a).slice(1), 16)
  const pb = parseInt(normHex(b).slice(1), 16)
  const dr = ((pa >> 16) & 255) - ((pb >> 16) & 255)
  const dg = ((pa >> 8) & 255) - ((pb >> 8) & 255)
  const db = (pa & 255) - (pb & 255)
  return Math.sqrt(dr * dr + dg * dg + db * db)
}
