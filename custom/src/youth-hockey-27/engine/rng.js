/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Seeded random numbers so a game, a roster or a simulation can be replayed
// exactly. Gameplay randomness only: nothing here is security-sensitive.

// string -> 32 bit unsigned hash (FNV-1a)
export const hashString = (str) => {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// mulberry32 generator with a few helpers
export const createRng = (seed) => {
  let a = (typeof seed === 'string' ? hashString(seed) : seed >>> 0) || 1
  const next = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const rng = {
    next,
    // float in [min, max)
    range: (min, max) => min + (max - min) * next(),
    // integer in [min, max]
    int: (min, max) => Math.floor(min + (max - min + 1) * next()),
    chance: (p) => next() < p,
    pick: (list) => list[Math.floor(next() * list.length)],
    // pick from [{ weight, ... }] by weight
    weighted: (list) => {
      const total = list.reduce((s, i) => s + i.weight, 0)
      let r = next() * total
      for (const item of list) {
        r -= item.weight
        if (r <= 0) return item
      }
      return list[list.length - 1]
    },
    shuffle: (list) => {
      const out = list.slice()
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        const tmp = out[i]
        out[i] = out[j]
        out[j] = tmp
      }
      return out
    },
  }
  return rng
}
