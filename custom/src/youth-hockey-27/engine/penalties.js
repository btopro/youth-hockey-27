/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The core set of USA Hockey penalties, translated into the game. Each one
// carries the one-line explanation shown when it is called, so the game
// teaches the rule as it enforces it.

export const PENALTIES = {
  tripping: {
    id: 'tripping',
    label: 'Tripping',
    minutes: 2,
    signal: 'Strikes the leg below the knee',
    explain: 'Using your stick, knee or foot to make another player fall.',
  },
  hooking: {
    id: 'hooking',
    label: 'Hooking',
    minutes: 2,
    signal: 'Tugs both arms toward the body',
    explain: 'Using the blade of your stick to pull or hold back another player.',
  },
  slashing: {
    id: 'slashing',
    label: 'Slashing',
    minutes: 2,
    signal: 'Chops one forearm across the other',
    explain: 'Swinging your stick at another player, even if you only hit their stick or gloves.',
  },
  holding: {
    id: 'holding',
    label: 'Holding',
    minutes: 2,
    signal: 'Grabs one wrist',
    explain: 'Grabbing another player or their stick to slow them down.',
  },
  interference: {
    id: 'interference',
    label: 'Interference',
    minutes: 2,
    signal: 'Crosses arms in front of the chest',
    explain: 'Hitting, holding or blocking a player who does not have the puck.',
  },
  'high-sticking': {
    id: 'high-sticking',
    label: 'High-sticking',
    minutes: 2,
    signal: 'Holds both fists up, one above the other',
    explain: 'Carrying your stick above your shoulders and making contact with another player.',
  },
  'cross-checking': {
    id: 'cross-checking',
    label: 'Cross-checking',
    minutes: 2,
    signal: 'Pushes both fists forward from the chest',
    explain: 'Hitting another player with the shaft of your stick held in both hands.',
  },
  roughing: {
    id: 'roughing',
    label: 'Roughing',
    minutes: 2,
    signal: 'Extends a clenched fist to the side',
    explain: 'Extra pushing, shoving or punching, usually after the whistle.',
  },
  'body-checking': {
    id: 'body-checking',
    label: 'Body checking',
    minutes: 2,
    signal: 'Pats the chest with a closed fist',
    explain:
      'Body checking is not allowed until 14U. Younger players learn body contact and angling first, so they are ready for it.',
  },
  fighting: {
    id: 'fighting',
    label: 'Fighting',
    minutes: 0,
    ejection: true,
    signal: 'Throws a punch in the air',
    explain: 'Dropping the gloves earns a game misconduct: you are done for the night.',
  },
}

// stick play on a puck carrier: mostly a gamble on getting the puck
const STICK_ON_CARRIER = [
  { id: 'hooking', weight: 4 },
  { id: 'slashing', weight: 3 },
  { id: 'tripping', weight: 3 },
  { id: 'holding', weight: 1 },
  { id: 'high-sticking', weight: 1 },
]
// stick play on someone without the puck: tying them up away from the play
const STICK_OFF_PUCK = [
  { id: 'interference', weight: 3 },
  { id: 'holding', weight: 3 },
  { id: 'hooking', weight: 2 },
  { id: 'high-sticking', weight: 1 },
]

/**
 * Decide whether an action draws a call and which penalty it is.
 * @param {object} rules game rules (buildRules)
 * @param {string} action 'poke' | 'stick' | 'check'
 * @param {object} ctx { onCarrier: bool, fromBehind: bool, rng }
 * @returns {string|null} penalty id or null
 */
export const judgeAction = (rules, action, ctx) => {
  if (!rules.penalties) return null
  const rng = ctx.rng
  // 50% strictness = the base chances below, 100% doubles them
  const scale = rules.strictness * 2
  const roll = (base) => rng.chance(Math.min(0.95, base * scale))
  if (action === 'poke') {
    return roll(0.005) ? 'slashing' : null
  }
  if (action === 'stick') {
    if (ctx.onCarrier) {
      return roll(0.15) ? rng.weighted(STICK_ON_CARRIER).id : null
    }
    return roll(0.45) ? rng.weighted(STICK_OFF_PUCK).id : null
  }
  if (action === 'check') {
    if (!rules.checking) {
      return roll(0.8) ? 'body-checking' : null
    }
    if (!ctx.onCarrier) {
      return roll(0.6) ? 'interference' : null
    }
    if (ctx.fromBehind) {
      return roll(0.35) ? 'cross-checking' : null
    }
    return roll(0.025) ? 'roughing' : null
  }
  return null
}
