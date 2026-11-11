# Youth Hockey '27

A 16-bit, NHL 93-style hockey game about youth hockey: age levels follow the USA Hockey American Development Model, the rulebook's penalties are in the game, and the stands hold up a mirror to what money and pressure do to kids' sports.

The repo is a HAXsite. The pages document the rules, the age levels and resources for families; the game is the `<youth-hockey-27>` web component on the Play page. See [DESIGN.md](DESIGN.md) for every design decision.

## Run the site

```bash
npm install --global @haxtheweb/create   # the HAX CLI, once
hax serve                                # http://localhost:3000
```

## Work on the game

The game lives in `custom/src/youth-hockey-27/` and is built into `custom/build/custom.es6.js`, which the site loads on every page.

```bash
cd custom
npm install
npm run build    # or npm start to rebuild on change
```

- `engine/`: the headless engine (rules, physics, AI, rosters, penalties, intermission events). No DOM, so it runs in Node too.
- `lib/`: renderer, sprites, bitmap font, chiptune audio, input (keyboard, 4 gamepads, touch), replays and clips, tournament.
- `youth-hockey-27.js`: the element: setup screen, the game, the stands, overlays.

## Simulate and test

From the repo root:

```bash
npm run sim                     # CPU vs CPU at every level, with stats
npm run sim -- --games 50 --level 8U
npm test                        # engine invariants
```

## Embed a demo

Any HAX page can show a CPU vs CPU demo of a level:

```html
<youth-hockey-27 attract level="8U" home="sparkle-selects" away="icers"></youth-hockey-27>
```
