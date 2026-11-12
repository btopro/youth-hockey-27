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
  // a frozen pond: snowbank edges, no lines
  pond: {
    id: 'pond',
    label: 'Pond',
    width: 70,
    length: 130,
    goalLine: 10,
    cornerRadius: 30,
    blueLines: null,
    centerLine: false,
  },
  // a cul-de-sac: curbs for boards, asphalt for ice
  street: {
    id: 'street',
    label: 'Street',
    width: 60,
    length: 120,
    goalLine: 10,
    cornerRadius: 6,
    blueLines: null,
    centerLine: false,
  },
}

// nets are bigger than real ones: an arcade game needs goals
export const NETS = {
  small: { width: 6, depth: 3 },
  regulation: { width: 8, depth: 3.5 },
  // pond nets are small, low boxes: no goalies out there
  pond: { width: 3.5, depth: 2.5 },
  street: { width: 7, depth: 3 },
}

// where the game is played. Pond and street: nobody comes to watch, there
// are no refs, and everyone plays way better without an audience.
export const VENUES = {
  rink: { id: 'rink', label: 'Rink', crowd: true, refs: true },
  roller: { id: 'roller', label: 'Roller rink', crowd: true, refs: true, surface: 'roller', skaters: 4 },
  pond: { id: 'pond', label: 'Pond hockey', crowd: false, refs: false, surface: 'pond', skaters: 4, goalies: false, net: 'pond', boost: 18 },
  street: { id: 'street', label: 'Street hockey', crowd: false, refs: false, surface: 'street', skaters: 4, net: 'street', boost: 18 },
}

// every period is five minutes on the clock, at every level
export const PERIOD_SECONDS = 300

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
    periodSeconds: PERIOD_SECONDS,
    periodMinutes: 5,
    speed: 0.55,
    ai: 0.35,
    saveBase: 0.65,
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
    periodSeconds: PERIOD_SECONDS,
    periodMinutes: 5,
    speed: 0.65,
    ai: 0.45,
    saveBase: 0.64,
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
    periodSeconds: PERIOD_SECONDS,
    periodMinutes: 5,
    speed: 0.75,
    ai: 0.55,
    saveBase: 0.75,
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
    periodSeconds: PERIOD_SECONDS,
    periodMinutes: 5,
    speed: 0.85,
    ai: 0.65,
    saveBase: 0.78,
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
    periodSeconds: PERIOD_SECONDS,
    periodMinutes: 5,
    speed: 0.92,
    ai: 0.75,
    saveBase: 0.8,
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
    periodSeconds: PERIOD_SECONDS,
    periodMinutes: 5,
    speed: 1,
    ai: 0.85,
    saveBase: 0.82,
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
    periodSeconds: PERIOD_SECONDS,
    periodMinutes: 5,
    speed: 0.95,
    ai: 0.7,
    saveBase: 0.75,
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
  // older callers pass roller: true; venue wins when both are given
  const venue = VENUES[opts.venue] || (opts.roller ? VENUES.roller : VENUES.rink)
  const special = venue.id !== 'rink'
  const surface = SURFACES[venue.surface || level.surface]
  const ruleset = RULESETS[opts.ruleset] || RULESETS.standard
  const strictness =
    typeof opts.strictness === 'number'
      ? Math.max(0, Math.min(1, opts.strictness))
      : 0.5
  const periodSeconds = level.periodSeconds
  const rules = {
    level,
    levelId: level.id,
    ageIndex: level.ageIndex,
    venue: venue.id,
    roller: venue.id === 'roller',
    surface,
    net: NETS[venue.net || (special ? 'regulation' : level.net)],
    skaters: venue.skaters || level.skaters,
    goalies: venue.goalies !== false,
    offsides: special ? false : level.offsides && !!surface.blueLines,
    icing: special ? false : level.icing,
    checking: special ? false : level.checking,
    buzzer: special ? 0 : level.buzzer,
    keepScore: level.keepScore,
    periods: 3,
    periodSeconds,
    periodMinutes: level.periodMinutes,
    // a minor is the same share of a period as two minutes of a real
    // 15-minute youth period: 40 seconds of a 5 minute period
    minorSeconds: (2 / 15) * periodSeconds,
    speed: level.speed,
    ai: level.ai,
    saveBase: level.saveBase,
    fights: level.fights && venue.refs,
    ruleset: ruleset.id,
    // no refs at the pond or in the street
    penalties: ruleset.penalties && venue.refs,
    strictness,
    // nobody comes to watch the pond or the street
    crowd: venue.crowd,
    // everybody plays better when nobody is watching
    boost: venue.boost || 0,
    // faceoffs everywhere on full sheets; small ice restarts from behind the net
    faceoffs: surface.id === 'full' || surface.id === 'roller',
    // need a winner (tournament play)
    needWinner: !!opts.needWinner,
  }
  return rules
}
