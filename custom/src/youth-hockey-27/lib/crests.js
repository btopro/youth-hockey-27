/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Team crests as pixel grids, extracted from the crest SVGs (assets/crests/,
// vendored from rpg-character) so the canvas can draw them crisply at any scale.
export const CRESTS = {
  'jesus-selects': {
    w: 16,
    h: 12,
    palette: { a: '#f2c94c', b: '#ffffff', c: '#2a4bd7', d: '#111111' },
    rows: [
      '....aaaaaaaa....',
      '..aa........aa..',
      '....aaaaaaaa....',
      '................',
      '....dddddddd....',
      'a.dddddddddddd.a',
      'aadccccccccccdaa',
      '.adcccbbbbcccda.',
      'aadcccbbbbcccdaa',
      'a.dccccccccccd.a',
      '...dddddddddd...',
      '.....dddddd.....',
    ],
  },
  'elite-prospects': {
    w: 16,
    h: 14,
    palette: { a: '#d4af37', b: '#ffffff', e: '#7fe7ff', f: '#ffffff', g: '#3aa9c9' },
    rows: [
      '..a...a..a...a..',
      '..aa.aaaaaa.aa..',
      '..aaaaaaaaaaaa..',
      '..abaabaabaaba..',
      '...aaaaaaaaaa...',
      '................',
      '....eeeeeeee....',
      '...effeeeeeee...',
      '..eeeeeeeeeeee..',
      '...gegegegegg...',
      '....ggeeeegg....',
      '.....ggeegg.....',
      '......ggee......',
      '.......gg.......',
    ],
  },
  'd1-or-bust': {
    w: 16,
    h: 15,
    palette: { o: '#ff7a1a', n: '#13213f', w: '#ffffff' },
    rows: [
      'oooooooooooooooo',
      'onnnnnnnnnnnnnno',
      'onwwwnnnnnnwwnno',
      'onwnnwnnnnwwwnno',
      'onwnnwnnnnnwwnno',
      'onwnnwnnnnnwwnno',
      'onwnnwnnnnnwwnno',
      'onwwwnnnnnwwwwno',
      'onnnnnnnnnnnnnno',
      '.onnnnnnnnnnnno.',
      '..onnnnnnnnnno..',
      '...onnnnnnnno...',
      '....onnnnnno....',
      '.....oonnoo.....',
      '.......oo.......',
    ],
  },
  'b-squad': {
    w: 15,
    h: 15,
    palette: { a: '#111', b: '#7a7a7a', c: '#ff3fa4' },
    rows: [
      '.....ccccc.....',
      '...cccaacccc...',
      '..caaccccccac..',
      '.caccaaaaacccc.',
      'caacaaaaaaacaac',
      'caaaacaaacaaaac',
      'aaaaacaccaaaaaa',
      'aaaaacacacaaaaa',
      'aaaabcaccaaaaaa',
      'caabacaaaabaaaa',
      'caaabacaaabaaac',
      '.caaabaaaaaaac.',
      '..aaaaaaaaaca..',
      '...caaaaacac...',
      '.....caaacc....',
    ],
  },
  'sparkle-selects': {
    w: 16,
    h: 15,
    palette: { a: '#111', b: '#2e80ff', c: '#ff3fa4', d: '#ffde46', e: '#fff' },
    rows: [
      'eee...eeeeeeeee.',
      'eceeeeeccccacae.',
      'ecaecccccccccce.',
      'eecccccccccccaee',
      '.eacaccaddadddde',
      '.eaddddddddcbdae',
      '.eadddddddddddae',
      '.eaaddddddaabbbe',
      '.eddacabbabbbabe',
      '.eaaaccaaaaaaaee',
      '.eeeaacaaaaaeee.',
      '...eeabbdaaee...',
      '....edbbddee....',
      '....eeddeee.....',
      '.....eeee.......',
    ],
  },
}

// draw a crest with its top-left at x, y; each pixel is size x size
export const drawCrest = (ctx, id, x, y, size, alpha) => {
  const c = CRESTS[id]
  if (!c) return
  ctx.save()
  if (typeof alpha === 'number') ctx.globalAlpha = alpha
  c.rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const key = row[rx]
      if (key === '.') continue
      ctx.fillStyle = c.palette[key]
      ctx.fillRect(Math.round(x + rx * size), Math.round(y + ry * size), Math.ceil(size), Math.ceil(size))
    }
  })
  ctx.restore()
}
