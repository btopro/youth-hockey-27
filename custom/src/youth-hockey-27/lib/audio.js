/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// Chiptune sound, synthesized with WebAudio: pulse and triangle voices, an
// arena organ, the goal horn, whistles, the shift buzzer and a crowd bed
// that follows the crowd's mood. All melodies are original.

const NOTE = (name) => {
  // 'C4', 'F#5', 'Bb3' -> frequency
  const m = /^([A-G])([#b]?)(\d)$/.exec(name)
  if (!m) return 0
  const base = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[m[1]]
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0
  const semis = base + acc + (parseInt(m[3], 10) - 4) * 12
  return 440 * Math.pow(2, semis / 12)
}

// [note | null, beats]
const STINGS = {
  // after a goal
  goal: [['C5', 0.5], ['E5', 0.5], ['G5', 0.5], ['C6', 1], [null, 0.25], ['G5', 0.5], ['C6', 1.5]],
  // rally the crowd (original; not the stadium "charge" fanfare)
  rally: [['G4', 0.5], ['G4', 0.5], ['B4', 0.5], ['D5', 0.5], [null, 0.5], ['B4', 0.5], ['D5', 1.5]],
  // a penalty on the other team
  penalty: [['E5', 0.25], ['D#5', 0.25], ['E5', 0.25], ['B4', 0.75]],
  // the period ends
  period: [['C5', 0.75], ['G4', 0.75], ['E4', 0.75], ['C4', 1.5]],
  // money waved in the stands: a cash register on the organ
  money: [['C6', 0.25], ['E6', 0.25], ['G6', 0.5]],
}

// menu and intermission loop: lead, bass
const LOOP = {
  bpm: 132,
  lead: [
    ['E5', 1], ['G5', 0.5], ['A5', 0.5], ['G5', 1], ['E5', 1],
    ['D5', 1], ['E5', 0.5], ['G5', 0.5], ['E5', 2],
    ['C5', 1], ['D5', 0.5], ['E5', 0.5], ['G5', 1], ['A5', 1],
    ['G5', 1], ['E5', 0.5], ['D5', 0.5], ['C5', 2],
  ],
  bass: [
    ['C3', 1], ['C3', 1], ['G2', 1], ['G2', 1],
    ['A2', 1], ['A2', 1], ['E2', 1], ['E2', 1],
    ['F2', 1], ['F2', 1], ['C3', 1], ['C3', 1],
    ['G2', 1], ['G2', 1], ['C3', 1], ['C3', 1],
  ],
}

export class ChipAudio {
  constructor() {
    this.ctx = null
    this.master = null
    this.crowdGain = null
    this.muted = false
    this.loopTimer = null
    try {
      this.muted = globalThis.localStorage.getItem('youth-hockey-27:muted') === '1'
    } catch (e) {
      this.muted = false
    }
  }

  // must be called from a user gesture
  start() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.5
    this.master.connect(this.ctx.destination)
    this.startCrowd()
  }

  setMuted(muted) {
    this.muted = muted
    try {
      globalThis.localStorage.setItem('youth-hockey-27:muted', muted ? '1' : '0')
    } catch (e) {
      // storage unavailable; the setting lasts for this visit
    }
    if (this.master) this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.05)
  }

  get ready() {
    return !!this.ctx
  }

  tone(type, freq, start, dur, vol, opts) {
    const o = opts || {}
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, start + dur)
    if (o.vibrato) {
      const lfo = this.ctx.createOscillator()
      const lg = this.ctx.createGain()
      lfo.frequency.value = o.vibrato
      lg.gain.value = freq * 0.03
      lfo.connect(lg)
      lg.connect(osc.frequency)
      lfo.start(start)
      lfo.stop(start + dur + 0.05)
    }
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(vol, start + Math.min(0.02, dur / 4))
    gain.gain.setValueAtTime(vol, start + dur * (o.hold || 0.7))
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    let node = osc
    if (o.filter) {
      const f = this.ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = o.filter
      osc.connect(f)
      node = f
    }
    node.connect(gain)
    gain.connect(o.dest || this.master)
    osc.start(start)
    osc.stop(start + dur + 0.05)
  }

  noiseBuffer() {
    if (this._noise) return this._noise
    const len = this.ctx.sampleRate
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    let s = 12345
    for (let i = 0; i < len; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      d[i] = (s / 0x7fffffff) * 2 - 1
    }
    this._noise = buf
    return buf
  }

  burst(start, dur, vol, freq, type) {
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer()
    const f = this.ctx.createBiquadFilter()
    f.type = type || 'bandpass'
    f.frequency.value = freq
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(vol, start)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    src.connect(f)
    f.connect(g)
    g.connect(this.master)
    src.start(start)
    src.stop(start + dur + 0.05)
  }

  organ(freq, start, dur, vol) {
    // two square voices an octave apart with a tremolo: a rink organ
    const v = vol || 0.07
    this.tone('square', freq, start, dur, v, { filter: 2400, vibrato: 6, hold: 0.85 })
    this.tone('triangle', freq * 2, start, dur, v * 0.6, { filter: 3200, hold: 0.85 })
    this.tone('sine', freq / 2, start, dur, v * 0.8, { hold: 0.85 })
  }

  play(name) {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime + 0.01
    switch (name) {
      case 'shot':
        this.burst(t, 0.09, 0.5, 1800, 'highpass')
        this.tone('square', 220, t, 0.05, 0.05)
        break
      case 'pass':
        this.burst(t, 0.05, 0.25, 2500, 'highpass')
        break
      case 'boards':
        this.tone('sine', 90, t, 0.18, 0.25, { slideTo: 50 })
        this.burst(t, 0.12, 0.25, 300, 'lowpass')
        break
      case 'hit':
        this.tone('square', 110, t, 0.12, 0.12, { slideTo: 60, filter: 900 })
        this.burst(t, 0.15, 0.35, 500, 'lowpass')
        break
      case 'post':
        this.tone('triangle', 1760, t, 0.4, 0.12, { hold: 0.1 })
        this.tone('triangle', 2637, t, 0.3, 0.06, { hold: 0.1 })
        break
      case 'whistle':
        this.tone('sine', 2900, t, 0.22, 0.12, { vibrato: 45 })
        this.tone('sine', 2900, t + 0.28, 0.35, 0.12, { vibrato: 45 })
        break
      case 'buzzer':
        this.tone('square', 180, t, 1.1, 0.08, { filter: 1200, hold: 0.95 })
        this.tone('square', 183, t, 1.1, 0.08, { filter: 1200, hold: 0.95 })
        break
      case 'horn':
        for (const f of [110, 138.6, 164.8]) this.tone('sawtooth', f, t, 1.8, 0.06, { filter: 900, hold: 0.9 })
        this.crowdSurge(1)
        break
      case 'save':
        this.burst(t, 0.07, 0.3, 900)
        this.crowdSurge(0.3)
        break
      case 'fight':
        this.crowdSurge(1)
        this.playSting('rally')
        break
      case 'menu':
        this.tone('square', 660, t, 0.05, 0.05, { filter: 3000 })
        break
      case 'select':
        this.tone('square', 880, t, 0.06, 0.06, { filter: 3000 })
        this.tone('square', 1320, t + 0.06, 0.08, 0.06, { filter: 3000 })
        break
      case 'back':
        this.tone('square', 520, t, 0.06, 0.05, { filter: 2400 })
        this.tone('square', 330, t + 0.06, 0.08, 0.05, { filter: 2400 })
        break
      case 'tv-on':
        // the tube whine and a burst of static
        this.tone('sine', 15600, t, 0.5, 0.02, { hold: 0.9 })
        this.burst(t + 0.25, 1.1, 0.35, 3000, 'bandpass')
        break
      case 'slam':
        this.tone('sine', 110, t, 0.45, 0.4, { slideTo: 40 })
        this.burst(t, 0.3, 0.5, 400, 'lowpass')
        break
      case 'roar':
        this.roar()
        break
      case 'punch':
        this.burst(t, 0.12, 0.6, 600, 'lowpass')
        this.tone('square', 90, t, 0.1, 0.12, { slideTo: 50, filter: 800 })
        break
      case 'whoosh':
        this.burst(t, 0.18, 0.25, 2200, 'bandpass')
        break
      case 'bell':
        for (const k of [0, 0.35, 0.7]) {
          this.tone('triangle', 1318, t + k, 0.6, 0.12, { hold: 0.05 })
          this.tone('sine', 2637, t + k, 0.4, 0.05, { hold: 0.05 })
        }
        break
      case 'snap':
        // composite stick cracks, then the cash register
        this.burst(t, 0.06, 0.9, 3500, 'highpass')
        this.burst(t + 0.03, 0.2, 0.5, 900, 'bandpass')
        this.playSting('money')
        break
      case 'posted':
        this.tone('sine', 988, t, 0.12, 0.08, { hold: 0.3 })
        this.tone('sine', 1319, t + 0.1, 0.2, 0.08, { hold: 0.3 })
        break
      case 'cheat':
        ;['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'].forEach((n, i) => this.tone('square', NOTE(n), t + i * 0.06, 0.08, 0.05, { filter: 4000 }))
        break
      default:
        if (STINGS[name]) this.playSting(name)
    }
  }

  // the big intro roar: the crowd swells, then the organ hits
  roar() {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer()
    src.loop = true
    const f = this.ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.Q.value = 0.5
    f.frequency.setValueAtTime(400, t)
    f.frequency.linearRampToValueAtTime(1400, t + 1.6)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.5, t + 1.4)
    g.gain.setTargetAtTime(0.0001, t + 2.4, 0.6)
    src.connect(f)
    f.connect(g)
    g.connect(this.master)
    src.start(t)
    src.stop(t + 5)
  }

  // a synthesized announcer, when the browser has a voice to lend
  announce(text) {
    if (this.muted) return
    try {
      const synth = globalThis.speechSynthesis
      if (!synth) return
      const u = new globalThis.SpeechSynthesisUtterance(text)
      u.pitch = 0.4
      u.rate = 0.85
      u.volume = 0.9
      synth.cancel()
      synth.speak(u)
    } catch (e) {
      // no speech here; the logo carries it
    }
  }

  playSting(name) {
    if (!this.ctx || this.muted) return
    const seq = STINGS[name]
    const beat = 60 / 150
    let t = this.ctx.currentTime + 0.02
    for (const [n, beats] of seq) {
      const dur = beats * beat
      if (n) this.organ(NOTE(n), t, dur * 0.95)
      t += dur
    }
  }

  // the menu / intermission tune
  startLoop() {
    if (!this.ctx || this.loopTimer) return
    const beat = 60 / LOOP.bpm
    const total = LOOP.lead.reduce((s, [, b]) => s + b, 0)
    const schedule = () => {
      if (this.muted) return
      let t = this.ctx.currentTime + 0.05
      for (const [n, b] of LOOP.lead) {
        if (n) this.tone('square', NOTE(n), t, b * beat * 0.9, 0.035, { filter: 3000, hold: 0.6 })
        t += b * beat
      }
      t = this.ctx.currentTime + 0.05
      for (const [n, b] of LOOP.bass) {
        if (n) this.tone('triangle', NOTE(n), t, b * beat * 0.9, 0.08, { hold: 0.8 })
        // hi-hat on the off beat
        this.burst(t + (b * beat) / 2, 0.03, 0.06, 7000, 'highpass')
        t += b * beat
      }
    }
    schedule()
    this.loopTimer = globalThis.setInterval(schedule, total * beat * 1000)
  }

  stopLoop() {
    if (this.loopTimer) globalThis.clearInterval(this.loopTimer)
    this.loopTimer = null
  }

  startCrowd() {
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer()
    src.loop = true
    const f = this.ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 700
    f.Q.value = 0.6
    this.crowdGain = this.ctx.createGain()
    this.crowdGain.gain.value = 0
    src.connect(f)
    f.connect(this.crowdGain)
    this.crowdGain.connect(this.master)
    src.start()
  }

  // mood 0-1 sets the steady murmur
  setCrowd(mood, playing) {
    if (!this.crowdGain) return
    const level = playing ? 0.02 + mood * 0.05 : 0.01
    this.crowdGain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.4)
  }

  crowdSurge(amount) {
    if (!this.crowdGain) return
    const now = this.ctx.currentTime
    const g = this.crowdGain.gain
    g.cancelScheduledValues(now)
    g.setValueAtTime(g.value, now)
    g.linearRampToValueAtTime(0.06 + amount * 0.16, now + 0.15)
    g.setTargetAtTime(0.04, now + 0.8, 0.8)
  }

  stop() {
    this.stopLoop()
    if (this.ctx) this.ctx.close()
    this.ctx = null
    this.crowdGain = null
  }
}
