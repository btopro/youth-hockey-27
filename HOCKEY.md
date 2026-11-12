# HOCKEY.md — the coach's worldview, and what it means for this game

Read this before changing gameplay, the AI, ratings, rosters, the stands, the satire or the site's copy. Youth Sports 27 is a game by a youth hockey coach for the players and families of his association. It should feel like his bench, not like a generic hockey game.

The worldview below comes from Bryan Ollendyke's (btopro) own writing on his blog, https://btopro.com (source: https://github.com/btopro/blog). Quotes are his words. Where this file turns them into rules for the game, those rules are the lessons; keep them.

- [Welcome to the 25-26 season!](https://btopro.com/life/welcome-to-the-25-26-season-) — his priorities as association president
- [Finding the edge](https://btopro.com/life/finding-the-edge) — the park, getting cut, and a national championship
- [The Teachable](https://btopro.com/life/the-teachable) — coaching a team (and his own kid) to grind
- [I, Developed.](https://btopro.com/life/i-developed-) — the end-of-season speech
- [Benevolent restrictions](https://btopro.com/hax/benevolent-restrictions) — why constraints make the game

## Who is behind it

- In love with hockey since the Penguins' first Stanley Cup in 1990. Played 20 hours a week at a neighborhood roller rink the kids lobbied the local government to build. Priced out of travel hockey at 13, cut in high school at 17.
- Made Penn State Roller Hockey at 20, rescued the club with the paperwork 24 hours before it was cancelled, played 5 years and coached it to its first and only national championship in 2010: "I went from the park, to cut in high school, to a national champion coach in 10 years."
- Head, assistant and guest coach across 10U, 12U and 14U; association president. Still shoots on the backyard rink.
- Two hats: "Have a Day" (fun above all, "the day you make of it") and "Engineered to Destroy" (structured, grinding hockey).

## Lessons, and what they mean for the game

### 1. Develop everyone

> "I didn't develop only the best, but they developed too, because I developed everyone."
> "I didn't develop to win, we don't even use that word, I hate that word... but we won most of our games, because I developed everyone."

- Everybody plays. Keep the shift buzzer at the younger levels, keep lines rotating, never let the AI or the line changes bench the low-rated kids.
- Awards and stats celebrate passing and the team (most passes, puck hog award as a joke at the hog's expense), not just goals.
- The highest-exposure kids pass the least; the game should show that this costs the team.

### 2. We don't know who the best is yet

> "We don't know who the best is yet, I intend to create the conditions to find out!"
> A brand new player "jumping everyone in a single season" at 12U.

- Late bloomers stay in. Ratings at a young age are not destiny; a low-rated 8U kid can be the best 14U player. Don't flatten the late-bloomer curves into "talent".
- "Few, if any, are actually born with what we commonly called 'talent'." Skill is "the learned behavior of repetition and desire to improve". Coachability (being teachable) matters as much as any rating.

### 3. Structure and grinding beat flash

From The Teachable, how his team plays (and how the AI should):

- Everyone back in position, so the other team has to dump it in.
- D goes behind the net toward the corner; the center and a wing come low to support the D; the other D and wing stay home near the net.
- Breakouts: D puts it up the wall (the safe play) to the center, who wins the battle and chips it out to the wing.
- The shooter is in shooting position the whole time and attacks from the dots in, which pulls the defender and opens the middle.
- Crash the net: D and center fill the vacuum, one low for the rebound, one high in case it pops out.
- Win by committee: out-shoot them, wear them down. "It's not flashy, it's effective and it's grinding."

When tuning `engine/ai.js` (`roleSpot`, `supportAI`, breakouts), aim for this picture, not for highlight-reel solo rushes.

### 4. Constraints make the game

> "Hockey is a simple game that is difficult to play... play it without nets and you can't envision how it works. Without lines and it's too easy to defeat. Play within the constraints, and it's a symphony of sport."

- The age-level rules (cross-ice, half ice, small nets, no body checking, offsides and icing only when the kids are ready) are the point of the game, not obstacles. They follow the USA Hockey ADM; keep them faithful.
- When a rule makes the game worse, fix the tuning (net size, goalie odds, AI spacing), not the rule.

### 5. Free play is where kids get better

> "A seemingly infinite source of time to play hockey for free. No rink fees, no ice times, no jersey costs, no coaches."
> "50 goal lead and we play to 100" — anything to get more players to grind against.

- That is why pond and street hockey exist: no refs, no crowd, nobody watching, and everybody plays way better. Keep that contrast with the rink, where the money and the stands are.

### 6. The money and the parents are the critique, not the kids

- He grew up unable to afford travel hockey. The satire (dollar bills in the stands, the $349 stick, showcase brochures, BookFace posts, "D1 or Bust", "Elite Prospects") targets the adults and the system that sells exposure to kids.
- Kids are never the joke. They look sad when their parents brawl; they are rattled, not punished; they keep playing.
- "Coach does not offer praise in the same way" as dad. Parent coaches who skew to their own kid are part of the critique.
- Dreams of every size are fine: "Some kids want to score a goal or fall down less this year, others want to win PAHL banners or play in the NHL. No dream is too big or too small." The game mocks the selling of the dream, not the dream.

### 7. Fun above all

- "Have a Day." The game is fun first. The lessons ride along; never lecture inside the game. Short lines, a joke, then back to the ice.

## Rules for agents

- Rosters, teams and numbers are made up. Do not use real players, real kids' names or real association teams. The coach's own association uses the names Icers, Wild and Saber Cats; that is why they were removed from the game. Don't bring them back or use other real local team names.
- Don't invent quotes for him. Quote the posts above or leave it out.
- Keep the voice: plain, warm, a little funny, coach-like. "Let's go."
- Respect the ADM. When in doubt, link the USA Hockey resources on the site rather than paraphrasing rules from memory.

## Build lessons learned (this repo)

- Lit: import `html`/`css` from `@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js` and extend `DDD` from `@haxtheweb/d-d-d/d-d-d.js`. A bare `lit` import does not resolve on the site (the import map only covers `@haxtheweb/*` for custom code).
- Lit's `ReactiveElement` owns `renderOptions`; don't name a method that (it broke the OPTIONS screen once).
- Import our own modules with explicit `.js` paths; no optional chaining.
- The HAX CLI page commands can `git add -A` and commit, and they strip inline `style` from page HTML. Commit your work first, check `git log` after, and put any styling inside SVGs or the element.
- After editing a page's `index.html`, regenerate its `index.md`/`.json`/`.xml`/`.yaml` alternates and `lunrSearchIndex.json` (HAXcms `writePageAlternateFormats` and `lunrSearchIndex`); the CLI doesn't.
- The engine is headless and seeded: keep it DOM-free so `npm run sim` and `npm test` run in Node, and keep randomness on the game's RNG so sims are repeatable. Check balance changes with the sim, not by feel.
