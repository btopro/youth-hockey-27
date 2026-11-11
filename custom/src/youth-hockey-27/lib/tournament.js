/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Tournament mode: a four-team bracket where every game you are not in is
// simulated instantly with the headless engine. At levels with no score
// (8U, 10U) it is a jamboree instead: three games, no bracket, a medal for
// everyone.
import { buildRules } from '../engine/ages.js'
import { TEAMS } from '../engine/teams.js'
import { simulateGame } from '../engine/game.js'
import { createRng } from '../engine/rng.js'

export class Tournament {
  /**
   * @param {object} opts { level, roller, ruleset, strictness, team, seed }
   */
  constructor(opts) {
    this.opts = opts
    this.rules = buildRules(opts.level, opts)
    this.jamboree = !this.rules.keepScore
    this.team = opts.team
    this.rng = createRng(opts.seed || `tournament:${opts.team}:${opts.level}`)
    const others = this.rng.shuffle(TEAMS.map((t) => t.id).filter((id) => id !== opts.team))
    this.others = others
    this.done = false
    this.champion = null
    if (this.jamboree) {
      this.rounds = [
        {
          name: 'Jamboree',
          games: others.map((id) => ({ home: opts.team, away: id, user: true, played: false })),
        },
      ]
    } else {
      this.rounds = [
        {
          name: 'Semifinals',
          games: [
            { home: opts.team, away: others[0], user: true, played: false },
            { home: others[1], away: others[2], user: false, played: false },
          ],
        },
      ]
      this.simulatePending()
    }
  }

  gameOptions(game) {
    return {
      level: this.opts.level,
      roller: this.opts.roller,
      ruleset: this.opts.ruleset,
      strictness: this.opts.strictness,
      needWinner: !this.jamboree,
      home: game.home,
      away: game.away,
    }
  }

  simulatePending() {
    for (const round of this.rounds) {
      for (const g of round.games) {
        if (g.user || g.played) continue
        const { result } = simulateGame(Object.assign({ seed: `${this.opts.seed || 't'}:${g.home}:${g.away}` }, this.gameOptions(g)))
        this.record(g, result)
      }
    }
  }

  record(game, result) {
    game.played = true
    game.score = { home: result.home, away: result.away }
    game.winner = result.winner ? game[result.winner] : null
    game.reason = result.reason
  }

  // the user's next game, or null
  next() {
    for (const round of this.rounds) {
      const g = round.games.find((x) => x.user && !x.played)
      if (g) return g
    }
    return null
  }

  // record the user's game and move the bracket along
  recordUser(result) {
    const g = this.next()
    if (!g) return
    this.record(g, result)
    if (this.jamboree) {
      if (!this.next()) this.done = true
      return
    }
    const round = this.rounds[this.rounds.length - 1]
    if (round.name === 'Semifinals') {
      const winners = round.games.map((x) => x.winner)
      const userIn = winners.includes(this.team)
      const final = { home: winners[0], away: winners[1], user: userIn, played: false }
      this.rounds.push({ name: 'Final', games: [final] })
      if (!userIn) {
        this.simulatePending()
        this.champion = final.winner
        this.done = true
      }
    } else {
      this.champion = g.winner
      this.done = true
    }
  }
}
