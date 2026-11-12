# Youth Sports 27

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
- `lib/`: renderer, sprites, bitmap font, chiptune audio, input (keyboard, 4 gamepads, touch), replays and clips, tournament, the TV intro, the arcade menu backdrop and icons, the parent brawl, BookFace, saved unlocks and the styles.
- `youth-hockey-27.js`: the element: intro, menus, the game, the stands, overlays.

Lit comes from the site, not the bundle: the element imports `html` from `@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js` and extends `DDD` from `@haxtheweb/d-d-d/d-d-d.js`, both served by the site's import map.

## Simulate and test

From the repo root:

```bash
npm run sim                     # CPU vs CPU at every level, with stats
npm run sim -- --games 50 --level 8U
npm test                        # engine invariants
```

## Embed a demo

Any HAX page can show a CPU vs CPU demo of a level and venue (`venue` is `rink`, `roller`, `pond` or `street`):

```html
<youth-hockey-27 attract level="8U" home="sparkle-selects" away="jesus-selects"></youth-hockey-27>
<youth-hockey-27 attract level="12U" venue="pond" home="d1-or-bust" away="elite-prospects"></youth-hockey-27>
```

Add `skip-intro` to a playable game to go straight to the menu:

```html
<youth-hockey-27 skip-intro></youth-hockey-27>
```
