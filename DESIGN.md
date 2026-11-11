# Youth Hockey '27 — design

A 16-bit, NHL 93-style hockey game for the players and families of our association. It is fun first, and it is also a way to show why the USA Hockey American Development Model (ADM) recommendations matter, and to poke at the darker patterns of youth sports: money, influence and exposure, as opposed to kids just having a great time.

Everything here is original: art, music and sound are ours, and nothing comes from EA's NHL 93 beyond the style of game.

## Where it lives

- The repo is a HAXsite. HAX pages document the rules, the age levels and the resources for families, and the game is the `<youth-hockey-27>` web component placed on the Play page.
- The element is built in `custom/src/` and bundled to `custom/build/custom.es6.js`, which the site loads on every page.
- The engine (`custom/src/youth-hockey-27/engine/`) has no DOM or Lit dependency, so the same code runs in the browser and headless in Node for rapid simulation (`npm run sim`).
- Lit is bundled into the custom build because the site's import map only maps `@haxtheweb/*` for custom code. `@haxtheweb/d-d-d` and `@haxtheweb/rpg-character` stay external and load from the site's build/CDN.
- Two changes to the scaffold's `custom/rollup.config.js`: the esbuild target is `es2020` (the stock Chrome 64 / Safari 11.1 targets cannot build destructuring), and `../` imports count as local (the stock check only treated `./` as local).

## Teams

The four teams from the rpg-character jersey work, with home and away kits:

| Team | Home | Away | Crest |
|---|---|---|---|
| AAAA Sparkle Selects | neon pink `#ff3fa4`, yellow `#ffde46`, blue `#2e80ff` | white with pink | `sparkle-selects` |
| B Squad | black `#151217` with pink | pink with black | `b-squad` |
| Saber Cats | black `#111` with green `#8dff3a` | grey-black with green | `saber-cats` |
| Icers | navy `#1d3a78` with white | white `#f4f7fc` with navy | `icers` |

Crests are vendored from webcomponents `elements/rpg-character/lib/crest/`.

### Rosters

- Rosters are made up: invented names and invented jersey numbers, 13 skaters and 2 goalies per team. No real players.
- The same player keeps the same name and number at every age level, so families can follow "their" kid up the levels.
- Ratings: speed, shot, passing, hands, checking, stamina and (goalies) reflexes and positioning, plus two social ratings:
  - **Coachability**: how well a player keeps position, respects offsides and passes when told to.
  - **Parental influence**: money and pressure from the stands. It drives the player's **exposure**.
- **Late bloomers (easter egg).** Each player has a development curve. The players who are the best at 8U, 10U and 12U are the worst by 16U and 18U, and the quiet late bloomers become the stars. The numbers are deterministic, so this holds every game.

## Age levels

Picking an age level changes the playing surface, the number of players and the rules that are enforced.

| Level | Surface | Skaters | Nets | Offsides & icing | Body checking | Shift buzzer | Score kept | Period (real time) |
|---|---|---|---|---|---|---|---|---|
| 8U | ⅓ ice, cross-ice | 3v3 + goalies | small | off | no | 90 s | no | 3 × 2:00 |
| 10U | ½ ice | 4v4 + goalies | small | off | no | 90 s | no | 3 × 2:30 |
| 12U | ½ ice | 3v3 + goalies | regulation | off | no | 120 s | yes | 3 × 3:00 |
| 14U | full ice | 5v5 + goalies | regulation | on | yes | — | yes | 3 × 3:30 |
| 16U | full ice | 5v5 + goalies | regulation | on | yes | — | yes | 3 × 4:00 |
| 18U | full ice | 5v5 + goalies | regulation | on | yes | — | yes | 3 × 4:30 |
| AAA & Beer League | full ice | 5v5 + goalies | regulation | on | yes | — | yes | 3 × 4:30 |

- Game length, skating speed and CPU difficulty scale up with age.
- Clocks show game minutes compressed into the real time above; a minor penalty is two game minutes.
- At 8U and 10U there is no scoreboard. When a kid scores, their parents wave dollar bills in the stands instead.
- Small-ice restarts: after a goal the other team restarts from behind its own net (no faceoff). Full ice uses faceoffs.
- **Roller** is a surface toggle for any level: full roller rink, 4v4, no offsides, no icing, no body checking.

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
- The select screen picks home and away teams, age level, ice or roller, game mode, ref strictness, and which side each controller plays for.

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
- **Phone replay**: after some goals, a short replay plays from the perspective of a parent filming on their phone while calling the kid's agent to argue for spending more money on exposure.

## Intermissions (branching events)

Between periods one event fires, with a choice that changes the rest of the game:

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

- 12U is ½ ice 3v3 as specified, which differs from USA Hockey's full-ice 12U; it is one line in `engine/ages.js` to change.
- Scores are hidden at 8U and 10U and kept from 12U up.
- Roller turns off body checking at every level.
- AAA & Beer League is its own level (adult, full ice) rather than an option on youth levels.
