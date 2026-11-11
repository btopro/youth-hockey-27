/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Age levels, playing surfaces and how they change the rules. Picking an age
// level picks the surface, the number of skaters and the rules that are
// enforced; everything the engine needs to know comes out of buildRules().

// Playing surfaces in feet. x runs across the width, y along the length, with
// the top goal line at y = goalLine and the bottom one at y = length - goalLine.
export const SURFACES = {
  third: {
    id: 'third',
    label: '⅓ ice (cross-ice)',
    width: 66,
    length: 85,
    goalLine: 8,
    cornerRadius: 12,
    blueLines: null,
    centerLine: false,
  },
  half: {
    id: 'half',
    label: '½ ice',
    width: 85,
    length: 100,
    goalLine: 10,
    cornerRadius: 20,
    blueLines: null,
    centerLine: true,
  },
  full: {
    id: 'full',
    label: 'Full ice',
    width: 85,
    length: 200,
    goalLine: 11,
    cornerRadius: 28,
    // distance of each blue line from its end boards
    blueLines: 75,
    centerLine: true,
  },
  roller: {
    id: 'roller',
    label: 'Roller rink',
    width: 85,
    length: 185,
    goalLine: 12,
    cornerRadius: 26,
    blueLines: null,
    centerLine: true,
  },
}

export const NETS = {
  small: { width: 4, depth: 3 },
  regulation: { width: 6, depth: 3.5 },
}

// ageIndex drives development curves (0 = 8U ... 5 = 18U and adult)
export const LEVELS = [
  {
    id: '8U',
    label: '8U',
    ageIndex: 0,
    surface: 'third',
    skaters: 3,
    net: 'small',
    offsides: false,
    icing: false,
    checking: false,
    buzzer: 90,
    keepScore: false,
    periodSeconds: 120,
    periodMinutes: 10,
    speed: 0.55,
    ai: 0.35,
    saveBase: 0.45,
    fights: false,
    blurb:
      'Cross-ice, 3 on 3. More puck touches, more shots, more fun. No scoreboard: parents wave dollar bills instead.',
  },
  {
    id: '10U',
    label: '10U',
    ageIndex: 1,
    surface: 'half',
    skaters: 4,
    net: 'small',
    offsides: false,
    icing: false,
    checking: false,
    buzzer: 90,
    keepScore: false,
    periodSeconds: 150,
    periodMinutes: 12,
    speed: 0.65,
    ai: 0.45,
    saveBase: 0.5,
    fights: false,
    blurb: 'Half ice, 4 on 4. Small spaces build quick hands and quick decisions.',
  },
  {
    id: '12U',
    label: '12U',
    ageIndex: 2,
    surface: 'half',
    skaters: 3,
    net: 'regulation',
    offsides: false,
    icing: false,
    checking: false,
    buzzer: 120,
    keepScore: true,
    periodSeconds: 180,
    periodMinutes: 12,
    speed: 0.75,
    ai: 0.55,
    saveBase: 0.68,
    fights: false,
    blurb: 'Half ice, 3 on 3, and the scoreboard turns on.',
  },
  {
    id: '14U',
    label: '14U',
    ageIndex: 3,
    surface: 'full',
    skaters: 5,
    net: 'regulation',
    offsides: true,
    icing: true,
    checking: true,
    buzzer: 0,
    keepScore: true,
    periodSeconds: 210,
    periodMinutes: 15,
    speed: 0.85,
    ai: 0.65,
    saveBase: 0.7,
    fights: false,
    blurb: 'Full ice, 5 on 5, offsides and icing, and body checking begins.',
  },
  {
    id: '16U',
    label: '16U',
    ageIndex: 4,
    surface: 'full',
    skaters: 5,
    net: 'regulation',
    offsides: true,
    icing: true,
    checking: true,
    buzzer: 0,
    keepScore: true,
    periodSeconds: 240,
    periodMinutes: 15,
    speed: 0.92,
    ai: 0.75,
    saveBase: 0.72,
    fights: false,
    blurb: 'Faster, stronger, and the late bloomers are catching up.',
  },
  {
    id: '18U',
    label: '18U',
    ageIndex: 5,
    surface: 'full',
    skaters: 5,
    net: 'regulation',
    offsides: true,
    icing: true,
    checking: true,
    buzzer: 0,
    keepScore: true,
    periodSeconds: 270,
    periodMinutes: 17,
    speed: 1,
    ai: 0.85,
    saveBase: 0.74,
    fights: false,
    blurb: 'Top speed. Look who the best players are now.',
  },
  {
    id: 'beer',
    label: 'AAA & Beer League',
    ageIndex: 5,
    surface: 'full',
    skaters: 5,
    net: 'regulation',
    offsides: true,
    icing: true,
    checking: true,
    buzzer: 0,
    keepScore: true,
    periodSeconds: 270,
    periodMinutes: 15,
    speed: 0.95,
    ai: 0.7,
    saveBase: 0.68,
    fights: true,
    blurb:
      'Constant fights. Every fighter gets tossed until somebody runs out of players.',
  },
]

export const getLevel = (id) => LEVELS.find((l) => l.id === id) || LEVELS[0]

export const RULESETS = {
  standard: { id: 'standard', label: 'Standard', penalties: true },
  jay: { id: 'jay', label: 'Jay mode (no penalties)', penalties: false },
}

/**
 * Everything the engine needs for one game.
 * @param {string} levelId one of LEVELS ids
 * @param {object} opts { roller: bool, ruleset: 'standard' | 'jay', strictness: 0..1 }
 */
export const buildRules = (levelId, opts = {}) => {
  const level = getLevel(levelId)
  const roller = !!opts.roller
  const surface = SURFACES[roller ? 'roller' : level.surface]
  const ruleset = RULESETS[opts.ruleset] || RULESETS.standard
  const strictness =
    typeof opts.strictness === 'number'
      ? Math.max(0, Math.min(1, opts.strictness))
      : 0.5
  const rules = {
    level,
    levelId: level.id,
    ageIndex: level.ageIndex,
    roller,
    surface,
    net: NETS[roller ? 'regulation' : level.net],
    skaters: roller ? 4 : level.skaters,
    offsides: roller ? false : level.offsides && !!surface.blueLines,
    icing: roller ? false : level.icing,
    checking: roller ? false : level.checking,
    buzzer: level.buzzer,
    keepScore: level.keepScore,
    periods: 3,
    periodSeconds: level.periodSeconds,
    periodMinutes: level.periodMinutes,
    // a two minute minor in real seconds
    minorSeconds: (2 / level.periodMinutes) * level.periodSeconds,
    speed: level.speed,
    ai: level.ai,
    saveBase: level.saveBase,
    fights: level.fights,
    ruleset: ruleset.id,
    penalties: ruleset.penalties,
    strictness,
    // faceoffs everywhere on full sheets; small ice restarts from behind the net
    faceoffs: surface.id === 'full' || surface.id === 'roller',
    // need a winner (tournament play)
    needWinner: !!opts.needWinner,
  }
  return rules
}
