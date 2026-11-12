/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Cheat codes: type one on the Extras screen (or punch in the button combo)
// to unlock crazy characters, equipment and game modifiers.

// a guest star joins your team in place of a skater
export const GUESTS = {
  zamboni: {
    id: 'zamboni',
    name: 'Zed the Zamboni Driver',
    first: 'Zed',
    last: 'Zamboni',
    number: 0,
    blurb: 'Has been resurfacing this ice since 1987. Shoots like a cannon, skates like a Zamboni.',
    look: { jersey: '#ff7a1a', trim: '#f2f2f2', helmet: '#3a3a3a', skin: '#d5ab88', scale: 1.15 },
    ratings: { speed: 55, shot: 99, pass: 70, hands: 75, check: 99, stamina: 99, reflex: 50, position: 50 },
  },
  grandma: {
    id: 'grandma',
    name: 'Grandma Pucksworth',
    first: 'Grandma',
    last: 'Pucksworth',
    number: 88,
    blurb: 'Brought orange slices. Sees the whole ice. Passes like a dream, skates like a grandma.',
    look: { helmet: '#d9d9e0', skin: '#f3d2a2', scale: 0.95 },
    ratings: { speed: 45, shot: 75, pass: 99, hands: 99, check: 30, stamina: 70, reflex: 50, position: 50 },
  },
  sasquatch: {
    id: 'sasquatch',
    name: 'The Sasquatch',
    first: 'The',
    last: 'Sasquatch',
    number: 99,
    blurb: 'Showed up at tryouts. Nobody asked for a birth certificate.',
    look: { jersey: '#6b4423', trim: '#3d2614', helmet: '#6b4423', skin: '#6b4423', pants: '#3d2614', scale: 1.4 },
    ratings: { speed: 85, shot: 92, pass: 60, hands: 70, check: 99, stamina: 99, reflex: 50, position: 50 },
  },
  mascot: {
    id: 'mascot',
    name: 'Sparky the Mascot',
    first: 'Sparky',
    last: 'Mascot',
    number: 1,
    blurb: 'The suit is very warm. Sparky is very fast. Nobody knows who is in there.',
    look: { helmet: '#ff3fa4', skin: '#ffde46', bigHead: true, scale: 1.05 },
    ratings: { speed: 99, shot: 70, pass: 80, hands: 85, check: 40, stamina: 60, reflex: 50, position: 50 },
  },
}

// equipment upgrades a whole team
export const EQUIPMENT = {
  'gold-stick': {
    id: 'gold-stick',
    name: 'Golden sticks',
    blurb: '$400 each. The parents insisted. Harder shots, crisper passes.',
    bonus: { shot: 15, pass: 10 },
    stick: '#f2c94c',
  },
  'rocket-skates': {
    id: 'rocket-skates',
    name: 'Rocket skates',
    blurb: 'Custom molded, heat treated, possibly jet powered.',
    bonus: { speed: 18 },
  },
  'wood-stick': {
    id: 'wood-stick',
    name: 'Wooden sticks',
    blurb: 'Like Grandpa used. Soft hands, heavy shots, unbreakable.',
    bonus: { hands: 12, shot: 5 },
    stick: '#c28a4a',
    unbreakable: true,
  },
}

// modifiers change the whole game
export const MODIFIERS = {
  'big-heads': { id: 'big-heads', name: 'Big heads', blurb: 'Everyone gets a giant head. Just like the parents.' },
  'pink-ice': { id: 'pink-ice', name: 'Pink ice', blurb: 'The Sparkle Selects booster club paid for it.' },
  'fire-puck': { id: 'fire-puck', name: 'Puck on fire', blurb: 'Score twice in a row and the puck catches fire.' },
  'tiny-goalies': { id: 'tiny-goalies', name: 'Tiny goalies', blurb: 'Goalies shrink to the size of a mite. Goals for everyone.' },
}

// codes are typed, case and spacing ignored
export const CODES = {
  ZAMBONI: { type: 'guest', id: 'zamboni' },
  GRANDMA: { type: 'guest', id: 'grandma' },
  BIGFOOT: { type: 'guest', id: 'sasquatch' },
  SPARKY: { type: 'guest', id: 'mascot' },
  GOLDSTICK: { type: 'equipment', id: 'gold-stick' },
  ROCKETS: { type: 'equipment', id: 'rocket-skates' },
  OLDSCHOOL: { type: 'equipment', id: 'wood-stick' },
  BIGHEADS: { type: 'modifier', id: 'big-heads' },
  PINKICE: { type: 'modifier', id: 'pink-ice' },
  ONFIRE: { type: 'modifier', id: 'fire-puck' },
  TINYGOALIE: { type: 'modifier', id: 'tiny-goalies' },
}

// the button combo for gamepads and the keyboard: unlocks everything.
// up up down down left right left right, check stick
// (C V on the keyboard, X Y on a gamepad: not the menu's confirm and back)
export const COMBO = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'check', 'stick']

export const normalizeCode = (text) => String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '')

// what a code unlocks, or null
export const lookupCode = (text) => CODES[normalizeCode(text)] || null

export const unlockKey = (entry) => `${entry.type}:${entry.id}`

export const ALL_UNLOCKS = Object.values(CODES).map(unlockKey)

export const describeUnlock = (key) => {
  const [type, id] = key.split(':')
  const table = type === 'guest' ? GUESTS : type === 'equipment' ? EQUIPMENT : MODIFIERS
  const item = table[id]
  return item ? Object.assign({ type, key }, item) : null
}
