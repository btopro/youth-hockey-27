/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// BookFace: between periods, a parent picks highlights from the last period
// to post. What the post says depends on the score, not on what happened.

// which moments are worth posting, and how proud the parent is of each
const WORTH = { goal: 5, save: 3, hit: 2, block: 2, 'stick-break': 4, 'faceoff-won': 1 }

export const highlightLabel = (h) => {
  const who = `#${h.number}`
  switch (h.type) {
    case 'goal':
      return `${who} SCORES 🚨`
    case 'save':
      return `${who} with the robbery 🧤`
    case 'hit':
      return `${who} lays the body 💥`
    case 'block':
      return `${who} sacrifices the body 🫡`
    case 'stick-break':
      return `${who} broke a $349 stick 💸`
    default:
      return `${who} doing ${who} things`
  }
}

/**
 * Pick up to four highlights for one side from a period's moments. Prefers
 * the kid of the posting parent, then the biggest moments.
 */
export const pickHighlights = (moments, side, max) => {
  return moments
    .filter((m) => m.side === side && WORTH[m.type])
    .sort((a, b) => WORTH[b.type] - WORTH[a.type] || b.t - a.t)
    .slice(0, max || 4)
}

// what the post says: the score decides
export const composePost = (opts) => {
  const { ours, theirs, kid, keepScore, chosen, period } = opts
  const diff = ours - theirs
  const lines = []
  if (!keepScore && diff > 0) lines.push(`Nobody keeps score at this age but we're up ${Math.max(ours, theirs)}-${Math.min(ours, theirs)} 😉`)
  if (diff < 0) {
    lines.push("Tough one so far. Not gonna say anything, but Billy has played A LOT today. 🙄 #justsaying #icetime")
  } else if (diff === 1) {
    lines.push('Shoutout to the AMAZING coaches!!! 🙌 Best staff in the league, so blessed to have them 💙 #coachappreciation')
  } else if (diff >= 2) {
    lines.push(`${kid} carrying the team AGAIN 💪 Scouts please take note #future #D1bound`)
  } else {
    lines.push('Refs are BLIND today. Just saying. 🦓 #zebras #ridiculous')
  }
  if (chosen && chosen.length) lines.push(chosen.map(highlightLabel).join(' / '))
  lines.push(`After ${period === 1 ? 'the 1st' : 'the 2nd'} period 🏒`)
  return lines.join('\n')
}

const COMMENTS = {
  losing: [
    ["Billy's mom", '👀'],
    ['Coach Dave', 'Reminder: please see the team social media policy.'],
    ['Hockey Dad Rick', 'Ice time is earned. Just saying.'],
    ['Aunt Linda', 'Which one is Billy?'],
  ],
  close: [
    ['Coach Dave', 'Thank you! 🙏 (please stop tagging me)'],
    ['Team Manager', 'Reminder: snack schedule is in the group chat.'],
    ['Grandma', 'So proud!! Which one is he?'],
  ],
  winning: [
    ['Hockey Dad Rick', 'Elite showcase this summer?? DM me'],
    ['Grandma', 'So proud!! Which one is he?'],
    ['Skills Coach Brayden', 'Private lessons paying off 😤 $95/hr, link in bio'],
  ],
  tied: [
    ['Other Team Mom', 'Refs called it both ways tbh'],
    ['Coach Dave', 'Reminder: please see the team social media policy.'],
    ['Grandma', 'Who are the zebras?'],
  ],
}

export const commentsFor = (diff) => {
  if (diff < 0) return COMMENTS.losing
  if (diff === 1) return COMMENTS.close
  if (diff >= 2) return COMMENTS.winning
  return COMMENTS.tied
}

// likes go up with the drama
export const likesFor = (diff, chosen) => {
  const base = diff < 0 ? 40 : diff === 1 ? 18 : diff >= 2 ? 64 : 27
  return base + (chosen ? chosen.length * 11 : 0)
}
