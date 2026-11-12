/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Remembers which cheat codes this browser has unlocked, and which modifiers
// are switched on. Browser storage can be missing or blocked, so every read
// and write is guarded and the game works without it.
import { ALL_UNLOCKS } from '../engine/cheats.js'

const KEY = 'youth-sports-27:unlocks'

const read = () => {
  try {
    const raw = globalThis.localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : null
    if (data && Array.isArray(data.unlocked)) return data
  } catch (e) {
    // storage unavailable or corrupt: start fresh
  }
  return { unlocked: [], active: [] }
}

const write = (data) => {
  try {
    globalThis.localStorage.setItem(KEY, JSON.stringify(data))
  } catch (e) {
    // storage unavailable: unlocks last for this visit only
  }
}

export class Unlocks {
  constructor() {
    this.data = read()
  }

  has(key) {
    return this.data.unlocked.includes(key)
  }

  // returns true when this is new
  add(key) {
    if (this.has(key)) return false
    this.data.unlocked.push(key)
    write(this.data)
    return true
  }

  addAll() {
    const added = ALL_UNLOCKS.filter((k) => this.add(k))
    return added
  }

  list(type) {
    return this.data.unlocked.filter((k) => !type || k.startsWith(`${type}:`)).map((k) => k.split(':')[1])
  }

  // modifiers can be switched on and off
  isActive(id) {
    return (this.data.active || []).includes(id)
  }

  toggle(id) {
    const active = new Set(this.data.active || [])
    if (active.has(id)) active.delete(id)
    else active.add(id)
    this.data.active = Array.from(active)
    write(this.data)
    return active.has(id)
  }

  activeModifiers() {
    return (this.data.active || []).filter((id) => this.has(`modifier:${id}`))
  }
}
