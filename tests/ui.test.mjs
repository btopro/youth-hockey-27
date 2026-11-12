/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The game-side pieces that run without a DOM: the parent brawl, BookFace
// posts and the cheat code lookups. Run with `npm test`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Brawl, BRAWL_SECONDS } from '../custom/src/youth-hockey-27/lib/brawl.js'
import { pickHighlights, composePost, highlightLabel, likesFor } from '../custom/src/youth-hockey-27/lib/bookface.js'
import { lookupCode, ALL_UNLOCKS, CODES, COMBO, describeUnlock } from '../custom/src/youth-hockey-27/engine/cheats.js'
import { createRng } from '../custom/src/youth-hockey-27/engine/rng.js'

const run = (brawl, policy, maxSeconds) => {
  const dt = 1 / 60
  for (let t = 0; t < (maxSeconds || BRAWL_SECONDS + 1) && !brawl.result; t += dt) brawl.update(dt, policy(brawl))
  return brawl.result
}

test('a brawl always ends, by KO or on time', () => {
  for (let i = 0; i < 20; i++) {
    const b = new Brawl({ rng: createRng(`b${i}`), toughness: i / 20 })
    const r = run(b, () => ({}))
    assert.ok(r, 'brawl has a result')
    assert.ok(['you', 'them', 'draw'].includes(r.winner))
    assert.ok(['KO', 'TIME'].includes(r.how))
  }
})

test('standing still in a brawl loses', () => {
  const b = new Brawl({ rng: createRng('still'), toughness: 0.5 })
  const r = run(b, () => ({}))
  assert.equal(r.winner, 'them')
})

test('dodging the tell and countering wins, and earns stars', () => {
  let wins = 0
  let stars = 0
  for (let i = 0; i < 10; i++) {
    const b = new Brawl({ rng: createRng(`dodge${i}`), toughness: 0.3 })
    let frame = 0
    const r = run(b, (br) => {
      frame++
      const them = br.them
      if (them.state === 'tell' || them.state === 'punch') return { left: true }
      if (them.state === 'stunned') return { jab: frame % 4 === 0, star: br.you.stars > 0 && frame % 4 === 2 }
      return {}
    })
    stars += b.hits.you
    if (r.winner === 'you') wins++
  }
  assert.ok(wins >= 8, `dodge and counter wins most brawls (${wins}/10)`)
  assert.ok(stars > 0)
})

test('BookFace: the caption follows the score, not the clips', () => {
  const clips = [
    { type: 'goal', side: 'home', number: 9, t: 10 },
    { type: 'save', side: 'home', number: 30, t: 20 },
    { type: 'hit', side: 'away', number: 4, t: 30 },
    { type: 'pass', side: 'home', number: 9, t: 40 },
  ]
  const picks = pickHighlights(clips, 'home', 4)
  assert.deepEqual(
    picks.map((p) => p.type),
    ['goal', 'save'],
  )
  const post = (ours, theirs) => composePost({ ours, theirs, kid: 'Ava', keepScore: true, chosen: picks, period: 1 })
  assert.match(post(1, 3), /Billy has played A LOT today/)
  assert.match(post(2, 1), /AMAZING coaches/)
  assert.match(post(4, 1), /Ava carrying the team/)
  assert.match(post(1, 1), /Refs are BLIND/)
  assert.match(post(2, 1), /#9 SCORES/)
  assert.match(post(0, 0), /After the 1st period/)
  // no "up 0-0" when nobody is keeping score and it's tied
  assert.doesNotMatch(composePost({ ours: 0, theirs: 0, kid: 'Ava', keepScore: false, chosen: [], period: 2 }), /up 0-0/)
  assert.match(highlightLabel({ type: 'stick-break', number: 12 }), /\$349/)
  assert.ok(likesFor(-2, [0, 1]) > likesFor(-2, []))
})

test('cheat codes: case and spacing do not matter, every code unlocks something real', () => {
  assert.deepEqual(lookupCode('zam boni'), { type: 'guest', id: 'zamboni' })
  assert.equal(lookupCode('NOTACODE'), null)
  assert.equal(ALL_UNLOCKS.length, Object.keys(CODES).length)
  for (const key of ALL_UNLOCKS) assert.ok(describeUnlock(key), key)
  assert.equal(COMBO.length, 10)
})
