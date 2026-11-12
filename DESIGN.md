# Youth Sports 27 — design

A 16-bit, NHL 93-style hockey game for the players and families of our association. It is fun first, and it is also a way to show why the USA Hockey American Development Model (ADM) recommendations matter, and to poke at the darker patterns of youth sports: money, influence and exposure, as opposed to kids just having a great time.

Everything here is original: art, music and sound are ours, and nothing comes from EA's NHL 93 beyond the style of game.

## Where it lives

- The repo is a HAXsite. HAX pages document the rules, the age levels and the resources for families, and the game is the `<youth-hockey-27>` web component placed on the Play page.
- The element is built in `custom/src/` and bundled to `custom/build/custom.es6.js`, which the site loads on every page.
- The engine (`custom/src/youth-hockey-27/engine/`) has no DOM or Lit dependency, so the same code runs in the browser and headless in Node for rapid simulation (`npm run sim`).
- Lit is not bundled. The element extends `DDD` from `@haxtheweb/d-d-d/d-d-d.js` and takes `html` and `css` from `@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js`, so the site's import map (which maps `@haxtheweb/*`) serves the same Lit every other HAX element on the page uses. `@haxtheweb/rpg-character` is external too.
- Two changes to the scaffold's `custom/rollup.config.js`: the esbuild target is `es2020` (the stock Chrome 64 / Safari 11.1 targets cannot build destructuring), and `../` imports count as local (the stock check only treated `./` as local).

## Teams

Five teams with home and away kits:

| Team | Home | Away | Crest |
|---|---|---|---|
| AAAA Sparkle Selects | neon pink `#ff3fa4`, yellow `#ffde46`, blue `#2e80ff` | white with pink | `sparkle-selects` |
| B Squad | black `#151217` with pink | pink with black | `b-squad` |
| Jesus Selects | white `#f7f7f2`, gold `#f2c94c` trim, royal `#2a4bd7` stripe | royal with white and gold | `jesus-selects` (a halo over a puck) |
| Elite Prospects | black `#0e0e10`, gold `#d4af37`, silver `#c0c4cc` | gold with black | `elite-prospects` (a crown over a diamond) |
| D1 or Bust | blaze orange `#ff7a1a` with navy `#13213f` | navy with orange | `d1-or-bust` (a D1 shield) |

The Sparkle Selects and B Squad crests are vendored from webcomponents `elements/rpg-character/lib/crest/`; the other three are original pixel grids in `lib/crests.js`, exported to `files/crests/` for the site.

### Rosters

- Rosters are made up: invented names and invented jersey numbers, 13 skaters and 2 goalies per team. No real players.
- The same player keeps the same name and number at every age level, so families can follow "their" kid up the levels.
- Ratings: speed, shot, passing, hands, checking, stamina and (goalies) reflexes and positioning, plus two social ratings:
  - **Coachability**: how well a player keeps position, respects offsides and passes when told to.
  - **Parental influence**: money and pressure from the stands. It drives the player's **exposure**.
- **Late bloomers (easter egg).** Each player has a development curve. The players who are the best at 8U, 10U and 12U are the worst by 16U and 18U, and the quiet late bloomers become the stars. The numbers are deterministic, so this holds every game.

## Age levels

Picking an age level changes the playing surface, the number of players and the rules that are enforced.

| Level | Surface | Skaters | Nets | Offsides & icing | Body checking | Shift buzzer | Score kept |
|---|---|---|---|---|---|---|---|
| 8U | ⅓ ice, cross-ice | 3v3 + goalies | small | off | no | 90 s | no |
| 10U | ½ ice | 4v4 + goalies | small | off | no | 90 s | no |
| 12U | ½ ice | 3v3 + goalies | regulation | off | no | 120 s | yes |
| 14U | full ice | 5v5 + goalies | regulation | on | yes | — | yes |
| 16U | full ice | 5v5 + goalies | regulation | on | yes | — | yes |
| 18U | full ice | 5v5 + goalies | regulation | on | yes | — | yes |
| AAA & Beer League | full ice | 5v5 + goalies | regulation | on | yes | — | yes |

- Every level plays three 5-minute periods. Skating speed and CPU difficulty scale up with age.
- A minor penalty is 40 seconds: the same share of a 5-minute period that two minutes is of a 15-minute youth period.
- Nets are bigger than real scale (small 6 ft, regulation 8 ft) and goalies a little leakier, because at true scale nobody could score.
- At 8U and 10U there is no scoreboard. When a kid scores, their parents wave dollar bills in the stands instead.
- Small-ice restarts: after a goal the other team restarts from behind its own net (no faceoff). Full ice uses faceoffs.

### Venues

| Venue | Surface | Skaters | Goalies | Refs | Crowd | Ratings |
|---|---|---|---|---|---|---|
| Rink | by level | by level | yes | yes | yes | as rated |
| Roller | full roller rink | 4v4 | yes | yes | yes | as rated |
| Pond hockey | 70 × 130 ft pond, snowbanks, no lines | 4v4 | no: tiny 3.5 ft nets, the nearest skater covers the net | no | nobody comes | +18 for every skater |
| Street hockey | 60 × 120 ft street, curbs, orange nets | 4v4 | yes | no | nobody comes | +18 for every skater |

No refs means no penalties, no fights and no missed calls; no crowd means no stands, no phone replays, no BookFace and a quiet "hot chocolate break" between periods. The kids play a lot better when nobody is watching.

## Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Skate | arrows | left stick / d-pad | left joystick |
| Pass / switch player | Z | A | PASS |
| Shoot / poke check | X | B | SHOOT |
| Body check | C | X | CHECK |
| Stick play (hook, lift, tie up) | V | Y | STICK |
| Pause | P / Esc | Start | ❚❚ |
| Save clip | R | Select | ⏺ |

- 1 player on keyboard, up to 4 players on gamepads, with CPU filling the rest. Touch controls show on touch screens.
- F, or the FULL SCREEN button on any screen, puts the whole element in full screen (iPhone has no full screen for web pages; the game says to add it to the Home Screen).

## Title and menus

- **Intro**: an old TV clicks on, static, then chrome YOUTH and SPORTS slam in and a gold 27 drops with a shockwave while the crowd roars and a synthesized announcer says the name. Scanlines, a rolling bar and flicker the whole way. Browsers block sound until a click, so the TV waits for PRESS START. It can be skipped, and turned off in OPTIONS or with the `skip-intro` attribute.
- **Menus** follow Operation REBIRTH's bold arcade look: a 2×2 hub of slanted section tiles (PLAY red, OPTIONS blue, EXTRAS purple, HOW TO PLAY green) over a drifting backdrop of slanted slabs, speed stripes and sparks in the section colour; a slanted title plate with a breadcrumb; setting rows with a sliding chevron that cycle with left and right; a key-chip hint bar; BACK top left and FULL SCREEN top right. Everything is real buttons, so it works with a mouse, touch, the keyboard, a screen reader or any gamepad.
- **PLAY** sets mode, age level, venue, home and away, referee and strictness, a guest star and equipment (once unlocked) and which side each controller plays for, with the matchup and rules beside it.
- **OPTIONS**: sound, full screen, the title intro, parent brawls and BookFace posts. Saved in the browser.

## Cheat codes

Typed on EXTRAS (or with the on-screen keyboard), saved in the browser:

| Code | Unlocks |
|---|---|
| ZAMBONI, GRANDMA, BIGFOOT, SPARKY | a guest star who replaces your first forward and never leaves the ice |
| GOLDSTICK, ROCKETS, OLDSCHOOL | team equipment: gold sticks (shot and pass), rocket skates (speed), wooden sticks (hands, and they never break) |
| BIGHEADS, PINKICE, ONFIRE, TINYGOALIE | game changers, switched on and off on EXTRAS |

Up, up, down, down, left, right, left, right, check, stick on any menu (C and V on the keyboard, X and Y on a gamepad) unlocks everything. HOW TO PLAY gives riddles for the codes.

## Stick breaks

One composite stick breaks per game, at a random point in regulation. A picture-in-picture close-up zooms in on the kid, NHL 93 faceoff style, with a blue anime burst, the stick snapping in two and 💵 💸 pouring out. That kid can't shoot, pass or play the puck until the next whistle, when a new stick comes over the boards. Wooden sticks hold.

## Penalties

The core set from the USA Hockey rulebook, translated into the game. Rarely-occurring calls (too many players, delay of game, abuse of officials) are left out on purpose.

| Penalty | When it can happen |
|---|---|
| Tripping, hooking, slashing, holding | stick play button (or AI stick play) on a skater |
| Interference | body check or stick play on a skater who does not have the puck |
| High-sticking | stick play with a lifted stick near another player |
| Cross-checking, roughing | rough checks, extra contact after the whistle |
| Body checking | any body check below 14U |
| Fighting (game misconduct) | AAA & Beer League only |

- **Stick play is a gamble.** The stick button can slow the puck carrier or knock the puck loose, and you *might* get a penalty. On the puck carrier the chance is low; on a player without the puck it is high.
- **Ref strictness slider** scales every call from 0% to 100%.
- **Jay mode**: no penalties are called at all.
- **Delayed penalties**: the whistle goes when the offending team touches the puck, like the real rule.
- Every penalty pauses with a ref signal and a one-line explanation of the rule, so the game doubles as a rules teacher.
- **AAA & Beer League**: fights break out constantly, and both fighters are ejected. When a team can no longer dress enough players, the game is called.

## Modes

- **Exhibition**: one game.
- **Tournament**: your team plus the other three in a bracket (semifinals and a final). Other games are simulated instantly with the headless engine. At 8U and 10U the tournament becomes a **jamboree**: three games, no bracket, and a medal for everyone.

## The stands (social critique)

- Fans in the stands are random rpg-character characters: 1 to 8 per player, so every kid has their own section.
- When a player does well their super fans go wild, jumping far more than the rest of the crowd.
- Parents of high-exposure players wave dollar bills when their kid carries the puck, nudging them not to pass. In the AI, the players with the most exposure pass the least.
- Parents get into fights in the stands depending on what their kids do on the ice (a penalty, a big hit).
- **Missed calls start brawls.** When the ref sees an infraction and doesn't call it, a parent from each kid's section may square off (at most once a period, about half the time). You play your kid's parent, Punch-Out style: the other parent guards high or low, telegraphs with a "!", then swings; hold left or right to dodge, down to block, jab and hook back, and a dodge-and-counter earns a star for a star punch. Behind you the involved kids and their teammates watch, sad, while more parents brawl in the bleachers. Nobody wins: the crowd sours, both kids lose a step for the rest of the game, and both parents are banned from the stands.
- **Phone replay**: after some goals, a short replay plays from the perspective of a parent filming on their phone while calling the kid's agent to argue for spending more money on exposure.

## Intermissions (branching events)

Between periods, first a parent opens **BookFace** to post the period's highlights (goals, saves, hits, blocks, the broken stick), with real thumbnails from the game. You pick up to four clips; the post's caption depends only on the score: behind, "Billy has played A LOT today"; up by one, the AMAZING coaches; up by two or more, the kid carrying the team; tied, the refs are blind. Likes and comments follow. Then one event fires, with a choice that changes the rest of the game:

| Event | Choices and effects |
|---|---|
| A parent offers you money for more ice time for their kid | Take it: the kid double-shifts, their stamina and stats drop and the crowd turns sour. Decline: nothing changes, and the crowd respects it. |
| Mid-game interview: a player wants to thank their grandparents for the new bike they got for a hat trick last game | Talk about the bike: exposure up, passing down. Shout out the team: chemistry up, everyone passes more. |
| A parent wants to buy the elite showcase package | Buy it: exposure up for that player. Pass: the player relaxes and plays better. |
| Two sets of parents are arguing in the stands | Ask them to settle down: crowd calms. Ignore it: crowd mood drops and the next fight comes sooner. |
| Grandparents brought orange slices for everyone | Kids just have fun: stamina restored, more passing. |

## Replays and clips

- The engine keeps the last 20 seconds of snapshots.
- **Save clip** renders the last 10 seconds to a `.webm` video file you can download and share.

## Simulation

`npm run sim` plays many CPU-vs-CPU games at every level and mode, headless, and reports goals, shots, saves, passes, penalties by type, fights, ejections and how passing relates to exposure. `npm test` checks invariants such as: games end, no checking penalties are legal-hit calls at 14U+, Jay mode calls nothing, fights only happen in AAA & Beer League, and late bloomers overtake early stars.

## Site

- **Play**: the game.
- **How to play**: controls and modes.
- **Age levels and the ADM**: why the surface and team size change, with links to USA Hockey's ADM material.
- **Penalties**: each penalty, the rule behind it and how it shows up in the game, with links to the rulebook.
- **Behind the game**: what the stands, the intermissions and the late bloomers are saying.
- **For families**: resources that point to the path that helps kids most, which is to relax, enjoy watching and support them.
- **The teams**.

## Open decisions

- Brawls and BookFace only happen with a crowd, so never at the pond or in the street.

- 12U is ½ ice 3v3 as specified, which differs from USA Hockey's full-ice 12U; it is one line in `engine/ages.js` to change.
- Scores are hidden at 8U and 10U and kept from 12U up.
- Roller turns off body checking at every level.
- AAA & Beer League is its own level (adult, full ice) rather than an option on youth levels.
