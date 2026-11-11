/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Team crests as pixel grids, extracted from the crest SVGs (assets/crests/,
// vendored from rpg-character) so the canvas can draw them crisply at any scale.
export const CRESTS = {
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
  'icers': {
    w: 21,
    h: 12,
    palette: { a: '#1d3a78', b: '#9fb3d1', c: '#fff' },
    rows: [
      '...cc............c...',
      '....cc.........cc....',
      '.....cc.......cc.....',
      '..ccaccacccccccacccc.',
      '..ccccaaccaacccacccc.',
      '.ccccccccccacccccccca',
      'accaaaacaaaaacaaacccc',
      '.aa...ccaaaaacc...aa.',
      '.caacca.caaaa..ccaac.',
      '.....a..aabbaaa......',
      '..........b...b......',
      '..........a..........',
    ],
  },
  'saber-cats': {
    w: 18,
    h: 17,
    palette: { a: '#111', b: '#6b6b70', c: '#8dff3a', d: '#f2f2f2' },
    rows: [
      '....aaaaaaaa......',
      '....aaaaaaaa......',
      '.aaaadaaadaa......',
      '.acaadddadaaa.....',
      'aaacaaaaaabaaa....',
      'aaaadaadaaaaaaa...',
      'aaaaddaaaaacccaaaa',
      'aaaadddaaaaaaaaaca',
      'aaaaaaaaaaaaaacaca',
      '.aadaaaaaaaaacaaaa',
      '.accaddddaaaddaaa.',
      'aadddddddaaddddca.',
      'acdddddddadddddca.',
      'acddddaacaaaaadda.',
      'acaaccacaaaccddca.',
      'aacaaaaaaaaaaaaca.',
      '.aaa........aaaaa.',
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
