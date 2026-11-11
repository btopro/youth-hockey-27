#!/usr/bin/env node
/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Rapid headless simulation: plays CPU vs CPU games at every level and mode
// and reports whether the game is a playable experience.
//
//   npm run sim                       # 20 games per level
//   npm run sim -- --games 50         # more games
//   npm run sim -- --level 8U         # one level
//   npm run sim -- --json             # machine-readable output
import { simulateGame } from '../custom/src/youth-hockey-27/engine/game.js'
import { LEVELS } from '../custom/src/youth-hockey-27/engine/ages.js'
import { TEAMS, getRoster, ratePlayer } from '../custom/src/youth-hockey-27/engine/teams.js'

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const GAMES = parseInt(arg('games', '20'), 10)
const ONLY = arg('level', null)
const JSON_OUT = args.includes('--json')

const avg = (list) => (list.length ? list.reduce((s, v) => s + v, 0) / list.length : 0)
const fmt = (v, d = 1) => v.toFixed(d)

const scenarios = []
for (const level of LEVELS) {
  if (ONLY && level.id !== ONLY) continue
  scenarios.push({ name: `${level.id}`, opts: { level: level.id } })
  if (!ONLY || ONLY === level.id) {
    if (level.id === '10U' || level.id === '16U') {
      scenarios.push({ name: `${level.id} roller`, opts: { level: level.id, roller: true } })
      scenarios.push({ name: `${level.id} jay mode`, opts: { level: level.id, ruleset: 'jay' } })
      scenarios.push({ name: `${level.id} strict ref`, opts: { level: level.id, strictness: 1 } })
    }
  }
}

const report = []
for (const sc of scenarios) {
  const goals = []
  const shots = []
  const saves = []
  const penalties = []
  const passes = []
  const fights = []
  const offsides = []
  const icings = []
  const called = []
  const seconds = []
  const penaltyTypes = {}
  const exposurePasses = { high: [], low: [] }
  let nan = 0
  for (let i = 0; i < GAMES; i++) {
    const home = TEAMS[i % TEAMS.length].id
    const away = TEAMS[(i + 1 + Math.floor(i / TEAMS.length)) % TEAMS.length].id
    const { game, events, result } = simulateGame(
      Object.assign({ home, away: away === home ? TEAMS[(i + 2) % TEAMS.length].id : away, seed: `sim:${sc.name}:${i}` }, sc.opts),
    )
    const count = (type) => events.filter((e) => e.type === type).length
    goals.push(result.home + result.away)
    shots.push(events.filter((e) => e.type === 'shot' && e.onTarget).length)
    saves.push(count('save'))
    passes.push(count('pass'))
    fights.push(count('fight'))
    offsides.push(count('offside'))
    icings.push(count('icing'))
    seconds.push(game.time)
    called.push(result.reason.startsWith('called') ? 1 : 0)
    const pens = events.filter((e) => e.type === 'penalty')
    penalties.push(pens.length)
    pens.forEach((p) => {
      penaltyTypes[p.penalty] = (penaltyTypes[p.penalty] || 0) + 1
    })
    // passes per minute of possession by exposure
    for (const side of ['home', 'away']) {
      for (const e of game.teams[side].skaters()) {
        if (e.stats.possession < 5) continue
        const rate = e.stats.passes / (e.stats.possession / 60)
        if (e.exposure >= 60) exposurePasses.high.push(rate)
        else if (e.exposure <= 35) exposurePasses.low.push(rate)
        if (!Number.isFinite(e.x) || !Number.isFinite(e.y)) nan++
      }
    }
    if (!Number.isFinite(game.puck.x) || !Number.isFinite(game.puck.y)) nan++
  }
  report.push({
    scenario: sc.name,
    games: GAMES,
    goals: avg(goals),
    shotsOnGoal: avg(shots),
    savePct: avg(saves) / Math.max(1, avg(saves) + avg(goals)),
    passes: avg(passes),
    penalties: avg(penalties),
    penaltyTypes,
    fights: avg(fights),
    offsides: avg(offsides),
    icings: avg(icings),
    calledGames: avg(called),
    realMinutes: avg(seconds) / 60,
    passesPerMinHighExposure: avg(exposurePasses.high),
    passesPerMinLowExposure: avg(exposurePasses.low),
    nan,
  })
}

// the late bloomer easter egg, from the rosters themselves
const bloomers = []
for (const team of TEAMS) {
  for (const p of getRoster(team.id)) {
    if (p.goalie) continue
    if (p.curve === 'steady') continue
    bloomers.push({
      team: team.short,
      player: `#${p.number} ${p.name}`,
      curve: p.curve,
      ratings: [0, 1, 2, 3, 4, 5].map((a) => ratePlayer(p, a).overall),
    })
  }
}

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ report, bloomers }, null, 2) + '\n')
} else {
  console.log(`Youth Hockey '27 simulation, ${GAMES} games per scenario\n`)
  console.log(
    ['scenario', 'goals', 'SOG', 'sv%', 'passes', 'PEN', 'fights', 'offside', 'icing', 'called', 'min', 'pass/min hi-exp', 'pass/min lo-exp']
      .map((h, i) => (i === 0 ? h.padEnd(18) : h.padStart(8)))
      .join(''),
  )
  for (const r of report) {
    console.log(
      [
        r.scenario.padEnd(18),
        fmt(r.goals).padStart(8),
        fmt(r.shotsOnGoal).padStart(8),
        fmt(r.savePct * 100, 0).padStart(8),
        fmt(r.passes, 0).padStart(8),
        fmt(r.penalties).padStart(8),
        fmt(r.fights).padStart(8),
        fmt(r.offsides).padStart(8),
        fmt(r.icings).padStart(8),
        fmt(r.calledGames * 100, 0).padStart(7) + '%',
        fmt(r.realMinutes).padStart(8),
        fmt(r.passesPerMinHighExposure).padStart(8),
        fmt(r.passesPerMinLowExposure).padStart(8),
      ].join(''),
    )
  }
  console.log('\nPenalties by type')
  for (const r of report) {
    const types = Object.entries(r.penaltyTypes)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${fmt(v / r.games)}`)
      .join(', ')
    console.log(`  ${r.scenario.padEnd(16)} ${types || 'none'}`)
  }
  console.log('\nLate bloomers vs early stars (overall rating 8U → 18U)')
  const early = bloomers.filter((b) => b.curve === 'early')
  const late = bloomers.filter((b) => b.curve === 'late')
  const avgAt = (list, a) => fmt(avg(list.map((b) => b.ratings[a])), 0)
  console.log(`  early bloomers: ${[0, 1, 2, 3, 4, 5].map((a) => avgAt(early, a)).join(' → ')}`)
  console.log(`  late bloomers:  ${[0, 1, 2, 3, 4, 5].map((a) => avgAt(late, a)).join(' → ')}`)
  const nan = report.reduce((s, r) => s + r.nan, 0)
  if (nan) console.log(`\n!! ${nan} non-finite positions found`)
}
