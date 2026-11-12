/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Invariants for the headless engine. Run with `npm test`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Game, simulateGame } from '../custom/src/youth-hockey-27/engine/game.js'
import { LEVELS, buildRules } from '../custom/src/youth-hockey-27/engine/ages.js'
import { TEAMS, getRoster, ratePlayer } from '../custom/src/youth-hockey-27/engine/teams.js'
import { PENALTIES } from '../custom/src/youth-hockey-27/engine/penalties.js'

const play = (opts, n) => {
  const runs = []
  for (let i = 0; i < n; i++) {
    runs.push(simulateGame(Object.assign({ home: TEAMS[i % TEAMS.length].id, away: TEAMS[(i + 1) % TEAMS.length].id, seed: `t:${opts.level}:${opts.ruleset || ''}:${opts.roller ? 'r' : ''}:${i}` }, opts)))
  }
  return runs
}
const types = (runs, type) => runs.flatMap((r) => r.events.filter((e) => e.type === type))

test('every level plays to a finish with sane positions', () => {
  for (const level of LEVELS) {
    for (const run of play({ level: level.id }, 2)) {
      assert.ok(run.result, `${level.id} finished`)
      assert.equal(run.game.phase, 'final')
      for (const e of run.game.allOnIce()) {
        assert.ok(Number.isFinite(e.x) && Number.isFinite(e.y), 'finite skater')
      }
      assert.ok(Number.isFinite(run.game.puck.x) && Number.isFinite(run.game.puck.y), 'finite puck')
    }
  }
})

test('the age level sets the surface and the number of skaters', () => {
  const expected = { '8U': ['third', 3], '10U': ['half', 4], '12U': ['half', 3], '14U': ['full', 5], '16U': ['full', 5], '18U': ['full', 5] }
  for (const [level, [surface, skaters]] of Object.entries(expected)) {
    const g = new Game({ level, home: 'jesus-selects', away: 'd1-or-bust' })
    assert.equal(g.rules.surface.id, surface, level)
    assert.equal(g.teams.home.onIceSkaters().length, skaters, level)
    assert.equal(g.teams.away.onIceSkaters().length, skaters, level)
  }
  const roller = new Game({ level: '8U', roller: true })
  assert.equal(roller.rules.surface.id, 'roller')
  assert.equal(roller.teams.home.onIceSkaters().length, 4)
  assert.equal(roller.rules.offsides, false)
  assert.equal(roller.rules.icing, false)
  assert.equal(roller.rules.checking, false)
})

test('scores are kept from 12U up', () => {
  assert.equal(buildRules('8U').keepScore, false)
  assert.equal(buildRules('10U').keepScore, false)
  assert.equal(buildRules('12U').keepScore, true)
  assert.equal(buildRules('18U').keepScore, true)
})

test('Jay mode calls nothing', () => {
  const runs = play({ level: '16U', ruleset: 'jay' }, 4).concat(play({ level: '8U', ruleset: 'jay' }, 4))
  assert.equal(types(runs, 'penalty').length, 0)
  assert.equal(types(runs, 'delayed-penalty').length, 0)
})

test('body checking is only a penalty below 14U or on roller', () => {
  const young = play({ level: '10U' }, 6)
  const old = play({ level: '16U' }, 6)
  assert.equal(types(old, 'penalty').filter((p) => p.penalty === 'body-checking').length, 0)
  for (const p of types(young, 'penalty')) assert.ok(PENALTIES[p.penalty], 'known penalty')
  // a legal hit at 14U+ is on the puck carrier, from the front
  for (const h of types(old, 'hit').filter((x) => x.legal)) assert.equal(h.onCarrier, true)
  for (const h of types(young, 'hit')) assert.equal(h.legal, false)
})

test('fights only happen in AAA & Beer League, and they empty the bench', () => {
  for (const level of ['8U', '12U', '18U']) {
    assert.equal(types(play({ level }, 3), 'fight').length, 0, level)
  }
  const beer = play({ level: 'beer' }, 4)
  assert.ok(types(beer, 'fight').length > 0)
  for (const run of beer) {
    const ejections = run.events.filter((e) => e.type === 'ejection').length
    const fights = run.events.filter((e) => e.type === 'fight').length
    assert.equal(ejections, fights * 2, 'both fighters are tossed')
    if (run.result.reason.startsWith('called')) {
      const short = ['home', 'away'].some((s) => run.game.teams[s].skaters().length < 2)
      assert.ok(short, 'a called game means someone ran out of players')
    }
  }
})

test('no offsides or icing where the level turns them off', () => {
  for (const opts of [{ level: '8U' }, { level: '10U' }, { level: '12U' }, { level: '16U', roller: true }]) {
    const runs = play(opts, 3)
    assert.equal(types(runs, 'offside').length, 0, JSON.stringify(opts))
    assert.equal(types(runs, 'icing').length, 0, JSON.stringify(opts))
  }
  const full = play({ level: '18U' }, 4)
  assert.ok(types(full, 'offside').length + types(full, 'icing').length > 0, 'full ice whistles them')
})

test('small ice restarts from behind the net; full ice uses faceoffs after goals', () => {
  const small = play({ level: '8U' }, 2)
  assert.ok(types(small, 'restart').length > 0)
  assert.equal(new Game({ level: '8U' }).rules.faceoffs, false)
  assert.equal(new Game({ level: '14U' }).rules.faceoffs, true)
})

test('the same seed plays the same game', () => {
  const a = simulateGame({ level: '12U', home: 'jesus-selects', away: 'b-squad', seed: 'same' })
  const b = simulateGame({ level: '12U', home: 'jesus-selects', away: 'b-squad', seed: 'same' })
  assert.deepEqual(a.result, b.result)
  assert.equal(a.events.length, b.events.length)
})

test('rosters are made up, fixed, and the late bloomers overtake the early stars', () => {
  for (const team of TEAMS) {
    const roster = getRoster(team.id)
    assert.equal(roster.length, 15)
    assert.equal(roster.filter((p) => p.goalie).length, 2)
    const numbers = new Set(roster.map((p) => p.number))
    assert.equal(numbers.size, 15, 'unique numbers')
    const early = roster.filter((p) => p.curve === 'early' && !p.goalie)
    const late = roster.filter((p) => p.curve === 'late' && !p.goalie)
    const avgAt = (list, a) => list.reduce((s, p) => s + ratePlayer(p, a).overall, 0) / list.length
    assert.ok(avgAt(early, 0) > avgAt(late, 0), `${team.id}: early stars lead at 8U`)
    assert.ok(avgAt(early, 5) < avgAt(late, 5), `${team.id}: late bloomers lead at 18U`)
    for (const p of early) {
      assert.ok(ratePlayer(p, 5).overall < ratePlayer(p, 0).overall, 'early stars fade')
    }
  }
})

test('kids with the most exposure pass the least', () => {
  let high = 0
  let highPoss = 0
  let low = 0
  let lowPoss = 0
  for (const run of play({ level: '16U' }, 6)) {
    for (const side of ['home', 'away']) {
      for (const e of run.game.teams[side].skaters()) {
        if (e.exposure >= 60) {
          high += e.stats.passes
          highPoss += e.stats.possession
        } else if (e.exposure <= 35) {
          low += e.stats.passes
          lowPoss += e.stats.possession
        }
      }
    }
  }
  assert.ok(high / highPoss < (low / lowPoss) * 0.8, 'high exposure passes less per second of possession')
})

test('taking the envelope double-shifts the kid and sours the crowd', () => {
  const g = new Game({ level: '12U', home: 'sparkle-selects', away: 'jesus-selects', seed: 'bribe' })
  g.beginIntermission()
  // force the bribe event
  const team = g.teams.home
  const subject = team.skaters().slice().sort((a, b) => b.player.influence - a.player.influence)[0]
  g.intermission = { id: 'bribe', side: 'home', subject: subject.uid, title: '', body: '', choices: [] }
  const mood = g.crowd.mood
  g.chooseIntermission(0)
  assert.equal(subject.doubleShift, true)
  assert.ok(g.crowd.mood < mood)
  assert.equal(g.period, 2)
  assert.ok(subject.onIce, 'double-shifted kid is on the ice')
})

test('a human on the keyboard can shoot', () => {
  const g = new Game({ level: '10U', home: 'jesus-selects', away: 'd1-or-bust', seed: 'human', controllers: { kb: 'home' } })
  const shots = []
  for (let i = 0; i < 60 * 40 && shots.length === 0; i++) {
    const me = g.control.kb
    const hasPuck = g.puck.carrier && g.puck.carrier === me
    const p = g.puck
    const dx = me ? p.x - me.x : 0
    const dy = me ? p.y - me.y : 0
    const l = Math.hypot(dx, dy) || 1
    g.step(1 / 60, { kb: { x: hasPuck ? 0 : dx / l, y: hasPuck ? g.teams.home.attackDir() : dy / l, shoot: hasPuck && i % 20 === 0, pass: false, check: false, stick: false } })
    for (const e of g.drainEvents()) if (e.type === 'shot' && e.side === 'home' && g.findEntity(e.uid).controller === 'kb') shots.push(e)
  }
  assert.ok(shots.length > 0, 'the controlled skater got a shot off')
})

test('every period is five minutes', () => {
  for (const level of LEVELS) {
    const r = buildRules(level.id)
    assert.equal(r.periodSeconds, 300, level.id)
    assert.equal(r.periodMinutes, 5, level.id)
  }
})

test('pond and street: no crowd, no refs, better players; no goalies at the pond', () => {
  const pond = new Game({ level: '14U', venue: 'pond', home: 'b-squad', away: 'elite-prospects', seed: 'pond' })
  const rink = new Game({ level: '14U', home: 'b-squad', away: 'elite-prospects', seed: 'pond' })
  assert.equal(pond.rules.crowd, false)
  assert.equal(pond.rules.penalties, false)
  assert.equal(pond.rules.goalies, false)
  assert.equal(pond.teams.home.goalie.onIce, false)
  const avg = (g) => g.teams.home.skaters().reduce((s, e) => s + e.rating.speed, 0) / g.teams.home.skaters().length
  assert.ok(avg(pond) > avg(rink) + 10, 'everyone skates better when nobody is watching')
  const street = new Game({ level: '14U', venue: 'street', seed: 'street' })
  assert.equal(street.rules.crowd, false)
  assert.equal(street.rules.goalies, true)
  for (const venue of ['pond', 'street']) {
    const runs = play({ level: '12U', venue }, 2)
    assert.equal(types(runs, 'penalty').length, 0, `${venue}: no refs`)
    runs.forEach((r) => assert.ok(r.result, `${venue} finished`))
  }
})

test('exactly one stick breaks every game, and a wooden stick never breaks', () => {
  for (const run of play({ level: '10U' }, 4)) {
    assert.equal(run.events.filter((e) => e.type === 'stick-break').length, 1)
  }
  const wood = simulateGame({ level: '10U', home: 'b-squad', away: 'b-squad', seed: 'wood', loadout: { home: { equipment: 'wood-stick' }, away: { equipment: 'wood-stick' } } })
  assert.equal(wood.events.filter((e) => e.type === 'stick-break').length, 0)
  assert.equal(wood.events.filter((e) => e.type === 'stick-held').length, 1)
})

test('a player with a broken stick cannot shoot or pass until the next whistle', () => {
  const g = new Game({ level: '10U', home: 'b-squad', away: 'd1-or-bust', seed: 'snap' })
  for (let i = 0; i < 60 * 3; i++) g.step(1 / 60)
  g.breakStick()
  const e = [...g.teams.home.entities, ...g.teams.away.entities].find((x) => x.brokenStick)
  assert.ok(e, 'someone broke a stick')
  g.puck.carrier = e
  g.shoot(e, 0)
  assert.equal(g.drainEvents().filter((x) => x.type === 'shot').length, 0)
  g.phase = 'play'
  g.whistle('test', { type: 'faceoff', x: 30, y: 50 })
  for (let i = 0; i < 60 * 2; i++) g.step(1 / 60)
  assert.equal(e.brokenStick, false, 'new stick at the stoppage')
})

test('a blind ref misses calls, and the misses are reported', () => {
  const runs = play({ level: '10U', strictness: 0 }, 3)
  assert.equal(types(runs, 'penalty').length, 0)
  assert.ok(types(runs, 'missed-call').length > 0)
})

test('cheat codes unlock guests, equipment and modifiers', async () => {
  const { lookupCode, GUESTS, ALL_UNLOCKS } = await import('../custom/src/youth-hockey-27/engine/cheats.js')
  assert.deepEqual(lookupCode(' grandma '), { type: 'guest', id: 'grandma' })
  assert.deepEqual(lookupCode('gold-stick'), { type: 'equipment', id: 'gold-stick' })
  assert.equal(lookupCode('nope'), null)
  assert.ok(ALL_UNLOCKS.length >= 10)
  const g = new Game({ level: '12U', home: 'b-squad', away: 'd1-or-bust', seed: 'guest', loadout: { home: { guest: 'sasquatch', equipment: 'rocket-skates' }, modifiers: ['tiny-goalies'] } })
  const guest = g.teams.home.entities.find((e) => e.guest === 'sasquatch')
  assert.ok(guest, 'the guest joined the team')
  assert.equal(guest.player.name, GUESTS.sasquatch.name)
  assert.ok(guest.onIce, 'guests never leave the ice')
  const plain = new Game({ level: '12U', home: 'b-squad', away: 'd1-or-bust', seed: 'guest' })
  const sk = (game) => game.teams.home.skaters().filter((e) => !e.guest)
  assert.ok(sk(g)[0].rating.speed > sk(plain)[0].rating.speed, 'rocket skates')
  assert.ok(g.modifiers.includes('tiny-goalies'))
})

test('the AI plays positions: forwards and D spread out', () => {
  // no penalties, so the lineup stays at full strength
  const g = new Game({ level: '16U', ruleset: 'jay', home: 'b-squad', away: 'd1-or-bust', seed: 'spacing' })
  const gaps = []
  for (let i = 0; i < 60 * 90; i++) {
    g.step(1 / 60)
    if (g.phase === 'play' && i % 30 === 0) {
      const on = g.teams.home.onIceSkaters()
      let min = Infinity
      for (let a = 0; a < on.length; a++) for (let b = a + 1; b < on.length; b++) min = Math.min(min, Math.hypot(on[a].x - on[b].x, on[a].y - on[b].y))
      gaps.push(min)
    }
  }
  const roles = g.teams.home.onIceSkaters().map((e) => e.role).sort()
  assert.deepEqual(roles, ['C', 'LD', 'LW', 'RD', 'RW'])
  const avg = gaps.reduce((s, v) => s + v, 0) / gaps.length
  assert.ok(avg > 8, `closest teammates average ${avg.toFixed(1)} ft apart`)
})
