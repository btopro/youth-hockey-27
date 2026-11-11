/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Intermission events: one fires between periods, with a choice that changes
// the rest of the game. They are where the social critique lives: money,
// influence and exposure against kids just having a great time.

const pickBy = (players, score) =>
  players.slice().sort((a, b) => score(b) - score(a))[0]

export const INTERMISSION_EVENTS = [
  {
    id: 'bribe',
    weight: 3,
    subject: (team) => pickBy(team.skaters(), (s) => s.player.influence),
    title: 'A parent wants a word',
    body: (s) =>
      `${s.player.first} ${s.player.last}'s parent slides you an envelope. "Just make sure #${s.player.number} gets more ice time. Power play. Every shift. You understand."`,
    choices: [
      {
        label: 'Take the envelope',
        result: (s) =>
          `#${s.player.number} is double-shifting now. Watch the legs go, and listen to the crowd.`,
        apply: (game, team, s) => {
          s.doubleShift = true
          s.exposure += 25
          game.crowd.mood -= 0.3
        },
      },
      {
        label: 'Ice time is earned',
        result: () => 'The envelope goes back. The bench notices, and so do the stands.',
        apply: (game) => {
          game.crowd.mood += 0.1
        },
      },
    ],
  },
  {
    id: 'interview',
    weight: 3,
    subject: (team) =>
      pickBy(team.skaters(), (s) => s.stats.goals * 3 + s.stats.assists + s.player.influence / 50),
    title: 'Mid-game interview',
    body: (s) =>
      `The local stream catches #${s.player.number} ${s.player.first} in the hallway. "I just want to thank my grandparents for the new bike they bought me for my hat trick last game..."`,
    choices: [
      {
        label: 'Keep talking about the bike',
        result: () => 'Exposure up. Somewhere a parent is already clipping this for an agent.',
        apply: (game, team, s) => {
          s.exposure += 15
          team.chemistry -= 0.05
        },
      },
      {
        label: '"...and my teammates set me up!"',
        result: () => 'The whole bench heard that. Watch the puck move.',
        apply: (game, team, s) => {
          s.exposure = Math.max(0, s.exposure - 10)
          team.chemistry += 0.15
        },
      },
    ],
  },
  {
    id: 'showcase',
    weight: 2,
    subject: (team) =>
      pickBy(team.skaters(), (s) => s.player.influence + (s.player.curve === 'early' ? 30 : 0)),
    title: 'The Elite Showcase package',
    body: (s) =>
      `A man in a quarter-zip hands ${s.player.first}'s parent a brochure: Elite Showcase, $4,800, "maximum exposure to scouts." They look at you. "Should we?"`,
    choices: [
      {
        label: 'Buy the package',
        result: (s) => `#${s.player.number} now plays for the cameras. Passing is for other people.`,
        apply: (game, team, s) => {
          s.exposure += 30
        },
      },
      {
        label: 'Save it for summer camp',
        result: (s) => `#${s.player.number} relaxes, and it shows.`,
        apply: (game, team, s) => {
          s.exposure = Math.max(0, s.exposure - 10)
          s.boost += 4
        },
      },
    ],
  },
  {
    id: 'stands',
    weight: 2,
    subject: () => null,
    title: 'Trouble in the stands',
    body: () =>
      'Two sets of parents are going at it over a missed offsides call. The kids are looking up from the bench.',
    choices: [
      {
        label: 'Ask them to settle down',
        result: () => 'The rink manager walks over. Things cool off.',
        apply: (game) => {
          game.crowd.mood += 0.1
          game.crowd.fightRate *= 0.5
        },
      },
      {
        label: 'Not my problem',
        result: () => 'It is a little bit your problem. The next one comes sooner.',
        apply: (game) => {
          game.crowd.mood -= 0.2
          game.crowd.fightRate *= 2
        },
      },
    ],
  },
  {
    id: 'oranges',
    weight: 2,
    subject: () => null,
    title: 'Orange slices!',
    body: () =>
      'The grandparents brought orange slices for everyone. Nobody is talking about scouts. Somebody is doing an orange-peel smile.',
    choices: [
      {
        label: 'Just have fun out there',
        result: () => 'Fresh legs, big smiles, and the puck starts moving.',
        apply: (game, team) => {
          team.skaters().forEach((s) => {
            s.stamina = 1
          })
          team.chemistry += 0.1
          game.crowd.mood += 0.1
        },
      },
    ],
  },
]

export const getEvent = (id) => INTERMISSION_EVENTS.find((e) => e.id === id)
