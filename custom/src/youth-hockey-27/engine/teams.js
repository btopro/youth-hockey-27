/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Teams, kits and made-up rosters. Names and numbers are invented and are
// generated from a fixed seed per team, so the same kid keeps the same name
// and number at every age level.
//
// The late bloomer easter egg lives here: each player has a development
// curve. Early bloomers are the stars at 8U-12U and the worst players by
// 16U-18U; late bloomers do the opposite. The curves are deterministic so
// the numbers are consistent every game.
import { createRng } from './rng.js'

// the human skin tones from rpg-character's palette, so players match the crowd
export const SKIN_TONES = [
  '#f7dece',
  '#f3d2a2',
  '#d5ab88',
  '#af7e57',
  '#7c533e',
]

export const TEAMS = [
  {
    id: 'sparkle-selects',
    name: 'AAAA Sparkle Selects',
    short: 'SPK',
    crest: 'sparkle-selects',
    kits: {
      home: {
        jersey: '#ff3fa4',
        trim: '#ffde46',
        stripe: '#2e80ff',
        number: '#111111',
        helmet: '#ff3fa4',
        pants: '#111111',
      },
      away: {
        jersey: '#f4f7fc',
        trim: '#ff3fa4',
        stripe: '#ffde46',
        number: '#ff3fa4',
        helmet: '#ff3fa4',
        pants: '#111111',
      },
    },
  },
  {
    id: 'b-squad',
    name: 'B Squad',
    short: 'BSQ',
    crest: 'b-squad',
    kits: {
      home: {
        jersey: '#151217',
        trim: '#ff3fa4',
        stripe: '#7a7a7a',
        number: '#ff3fa4',
        helmet: '#ff3fa4',
        pants: '#151217',
      },
      away: {
        jersey: '#ff3fa4',
        trim: '#151217',
        stripe: '#7a7a7a',
        number: '#151217',
        helmet: '#151217',
        pants: '#151217',
      },
    },
  },
  {
    id: 'saber-cats',
    name: 'Saber Cats',
    short: 'SAB',
    crest: 'saber-cats',
    kits: {
      home: {
        jersey: '#111111',
        trim: '#8dff3a',
        stripe: '#6b6b70',
        number: '#8dff3a',
        helmet: '#111111',
        pants: '#111111',
      },
      away: {
        jersey: '#8dff3a',
        trim: '#111111',
        stripe: '#6b6b70',
        number: '#111111',
        helmet: '#111111',
        pants: '#111111',
      },
    },
  },
  {
    id: 'icers',
    name: 'Icers',
    short: 'ICE',
    crest: 'icers',
    kits: {
      home: {
        jersey: '#1d3a78',
        trim: '#ffffff',
        stripe: '#9fb3d1',
        number: '#ffffff',
        helmet: '#1d3a78',
        pants: '#1d3a78',
      },
      away: {
        jersey: '#f4f7fc',
        trim: '#1d3a78',
        stripe: '#9fb3d1',
        number: '#1d3a78',
        helmet: '#1d3a78',
        pants: '#1d3a78',
      },
    },
  },
]

export const getTeam = (id) => TEAMS.find((t) => t.id === id) || TEAMS[0]

const FIRST_NAMES = [
  'Avery', 'Bo', 'Cam', 'Dez', 'Eli', 'Finn', 'Gigi', 'Hollis', 'Iggy', 'Jo',
  'Kit', 'Lux', 'Mo', 'Nico', 'Ozzy', 'Pip', 'Quinn', 'Remy', 'Sasha', 'Teddy',
  'Uma', 'Vic', 'Wren', 'Xan', 'Yuki', 'Zed', 'Bea', 'Gus', 'Ivy', 'Rory',
  'Milo', 'Nell', 'Otis', 'Pia', 'Rex', 'Tova', 'Ash', 'Coco', 'Duke', 'Elle',
]
const LAST_NAMES = [
  'Pucksworth', 'Snipeski', 'Bardown', 'Dangleton', 'Wristerly', 'Slapsky',
  'Crossbarr', 'Zambonie', 'Benchley', 'Bluelino', 'Faceoffski', 'Breakaway',
  'Toecurl', 'Glovesave', 'Iceberg', 'Kneepad', 'Backcheck', 'Tapeworth',
  'Onetimer', 'Hatcher', 'Lacesley', 'Rinkman', 'Stickley', 'Mittens',
  'Crease', 'Biscuit', 'Celly', 'Wheelson', 'Sauce', 'Cellydance', 'Pylon',
  'Tilly', 'Skatesby', 'Edgework', 'Linemate', 'Wristwell', 'Puckett',
  'Boardman', 'Gretz', 'Snowmore',
]

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

/**
 * Overall development multiplier for a curve at an age index (0-5).
 * early: strong at 8U, weakest at 18U. late: the reverse. steady: flat-ish.
 */
export const curveOffset = (curve, ageIndex) => {
  if (curve === 'early') return 18 - 7 * ageIndex
  if (curve === 'late') return -15 + 7 * ageIndex
  return 0
}

// build the fixed 15 player roster for a team (13 skaters, 2 goalies)
const buildRoster = (team) => {
  const rng = createRng(`roster:${team.id}`)
  const firsts = rng.shuffle(FIRST_NAMES)
  const lasts = rng.shuffle(LAST_NAMES)
  const usedNumbers = new Set()
  const number = () => {
    let n = rng.int(2, 98)
    while (usedNumbers.has(n)) n = rng.int(2, 98)
    usedNumbers.add(n)
    return n
  }
  // 3 early bloomers, 3 late bloomers, the rest steady; shuffled so the
  // stars are not always the first line
  const curves = rng.shuffle([
    'early', 'early', 'early', 'late', 'late', 'late',
    'steady', 'steady', 'steady', 'steady', 'steady', 'steady', 'steady',
  ])
  const players = []
  for (let i = 0; i < 15; i++) {
    const goalie = i >= 13
    const curve = goalie ? rng.pick(['early', 'late', 'steady']) : curves[i]
    // parents who got in early spend early; late bloomers' parents mostly
    // just drive them to the rink
    const influence =
      curve === 'early'
        ? rng.int(60, 95)
        : curve === 'late'
          ? rng.int(5, 40)
          : rng.int(20, 65)
    const coachability = clamp(
      rng.int(30, 95) + (curve === 'late' ? 10 : curve === 'early' ? -8 : 0),
      20,
      99,
    )
    players.push({
      id: `${team.id}-${i}`,
      teamId: team.id,
      first: firsts[i],
      last: lasts[i],
      name: `${firsts[i]} ${lasts[i]}`,
      number: number(),
      position: goalie ? 'G' : i < 8 ? 'F' : 'D',
      goalie,
      curve,
      talent: rng.int(55, 80),
      skin: rng.pick(SKIN_TONES),
      hand: rng.chance(0.65) ? 'L' : 'R',
      coachability,
      influence,
      // 1-8 fans in the stands for this kid, seeds for rpg-character
      fans: Array.from({ length: rng.int(1, 8) }, (_, f) => `${team.id}-${i}-fan-${f}`),
      // stat personality: offsets added to the overall rating
      offsets: {
        speed: rng.int(-8, 8),
        shot: rng.int(-8, 8),
        pass: rng.int(-8, 8),
        hands: rng.int(-8, 8),
        check: rng.int(-10, 10),
        stamina: rng.int(-8, 8),
        reflex: rng.int(-6, 6),
        position: rng.int(-6, 6),
      },
    })
  }
  return players
}

const rosterCache = new Map()
export const getRoster = (teamId) => {
  if (!rosterCache.has(teamId)) rosterCache.set(teamId, buildRoster(getTeam(teamId)))
  return rosterCache.get(teamId)
}

/**
 * A player's ratings at an age index. Deterministic.
 */
export const ratePlayer = (player, ageIndex) => {
  const overall = clamp(player.talent + curveOffset(player.curve, ageIndex), 25, 99)
  const r = {}
  for (const key of Object.keys(player.offsets)) {
    r[key] = clamp(overall + player.offsets[key], 20, 99)
  }
  r.overall = overall
  r.coachability = player.coachability
  r.influence = player.influence
  return r
}
