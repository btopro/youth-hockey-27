/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The parent brawl: when the ref misses a call, a parent from each kid's
// section squares off in the stands, boxing-game style. You play your kid's
// parent. Nobody actually wins.
//
// Them: guard high or low, then telegraph a punch ("!"), then throw it.
// You: dodge left/right or block, then counter while they are open.
// Landing a counter earns a star; the star punch hits hard.

export const BRAWL_SECONDS = 45

export class Brawl {
  /**
   * @param {object} opts { rng: { next, chance, range }, toughness: 0-1 }
   */
  constructor(opts) {
    this.rng = opts.rng
    this.toughness = typeof opts.toughness === 'number' ? opts.toughness : 0.5
    this.time = BRAWL_SECONDS
    this.you = { hp: 100, stars: 0, dodge: null, block: false, stun: 0, punch: null, cooldown: 0 }
    this.them = { hp: 100, state: 'idle', timer: 1.2, guard: 'high', punch: null }
    this.result = null
    this.messages = []
    this.hits = { you: 0, them: 0 }
  }

  say(text) {
    this.messages.push({ text, at: this.time })
    if (this.messages.length > 4) this.messages.shift()
  }

  // one frame. input: { left, right, down, jab, hook, up, star } (left/right/
  // down held; jab/hook/star pressed this frame; up held makes a punch go high)
  update(dt, input) {
    if (this.result) return
    const i = input || {}
    const you = this.you
    const them = this.them
    this.time -= dt
    you.cooldown = Math.max(0, you.cooldown - dt)
    you.stun = Math.max(0, you.stun - dt)
    if (you.punch) {
      you.punch.t -= dt
      if (you.punch.t <= 0) you.punch = null
    }
    // defense is held
    you.dodge = you.stun > 0 ? null : i.left ? 'left' : i.right ? 'right' : null
    you.block = you.stun <= 0 && !you.dodge && !!i.down
    // offense is pressed
    if (you.stun <= 0 && you.cooldown <= 0 && !you.dodge) {
      if (i.star && you.stars > 0) this.youPunch('star', !!i.up)
      else if (i.jab) this.youPunch('jab', !!i.up)
      else if (i.hook) this.youPunch('hook', !!i.up)
    }
    this.themUpdate(dt)
    if (them.hp <= 0 && !this.result) {
      them.hp = 0
      them.state = 'down'
      this.finish('you', 'KO')
    } else if (you.hp <= 0 && !this.result) {
      you.hp = 0
      this.finish('them', 'KO')
    } else if (this.time <= 0 && !this.result) {
      this.time = 0
      const diff = you.hp - them.hp
      this.finish(diff > 5 ? 'you' : diff < -5 ? 'them' : 'draw', 'TIME')
    }
  }

  youPunch(kind, high) {
    const you = this.you
    const them = this.them
    you.cooldown = kind === 'star' ? 0.8 : kind === 'hook' ? 0.45 : 0.3
    you.punch = { kind, high, t: 0.18 }
    const open = them.state === 'stunned'
    const interrupt = them.state === 'tell' && this.rng.chance(0.35)
    const unguarded = (them.state === 'idle' || them.state === 'hit') && (high ? them.guard === 'low' : them.guard === 'high')
    let dmg = kind === 'star' ? 26 : kind === 'hook' ? 9 : 6
    if (high && kind !== 'star') dmg += 2
    if (kind === 'star') you.stars -= 1
    if (open || interrupt || unguarded || (kind === 'star' && this.rng.chance(0.5))) {
      if (open) dmg = Math.round(dmg * 1.5)
      them.hp -= dmg
      this.hits.you++
      if (open && !this.counterStar) {
        // the first clean counter in each opening earns a star
        you.stars = Math.min(3, you.stars + 1)
        this.counterStar = true
        this.say('COUNTER! ★')
      } else if (kind === 'star') {
        this.say('STAR PUNCH!')
      }
      if (!open) {
        them.state = 'hit'
        them.timer = 0.25
      }
    } else {
      this.say('BLOCKED')
    }
  }

  themUpdate(dt) {
    const them = this.them
    const you = this.you
    them.timer -= dt
    if (them.timer > 0) return
    switch (them.state) {
      case 'idle':
      case 'hit':
        // wind up a punch
        them.state = 'tell'
        them.punch = { high: this.rng.chance(0.55), side: this.rng.chance(0.5) ? 'left' : 'right' }
        // tougher parents telegraph less
        them.timer = 0.75 - this.toughness * 0.3
        break
      case 'tell':
        them.state = 'punch'
        them.timer = 0.14
        break
      case 'punch': {
        // the moment of impact
        const p = them.punch
        if (you.dodge) {
          them.state = 'stunned'
          them.timer = 1.3
          this.counterStar = false
          this.say('DODGE!')
        } else if (you.block) {
          you.hp -= p.high ? 4 : 2
          them.state = 'idle'
          them.timer = 0.6
          this.say('BLOCK')
        } else {
          you.hp -= p.high ? 13 : 9
          you.stun = 0.4
          this.hits.them++
          them.state = 'idle'
          them.timer = 0.5 + this.rng.next() * 0.6
          this.say('OOF')
        }
        them.punch = null
        break
      }
      case 'stunned':
      default:
        them.state = 'idle'
        them.guard = this.rng.chance(0.5) ? 'high' : 'low'
        them.timer = 0.6 + this.rng.next() * (0.9 - this.toughness * 0.4)
        break
    }
  }

  finish(winner, how) {
    this.result = { winner, how, you: Math.max(0, Math.round(this.you.hp)), them: Math.max(0, Math.round(this.them.hp)) }
  }
}
