/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The last 20 seconds of the game as snapshots, and a recorder that turns a
// stretch of them into a video file to share with fans.
import { Renderer } from './renderer.js'
import { drawText } from './font.js'

export class ReplayBuffer {
  constructor(seconds, fps) {
    this.fps = fps || 30
    this.max = Math.round((seconds || 20) * this.fps)
    this.frames = []
    this.acc = 0
  }

  clear() {
    this.frames = []
    this.acc = 0
  }

  // call every rendered frame; keeps fps snapshots per second
  push(snap, dt) {
    this.acc += dt
    if (this.acc < 1 / this.fps && this.frames.length) return
    this.acc = 0
    this.frames.push(snap)
    if (this.frames.length > this.max) this.frames.shift()
  }

  last(seconds) {
    const n = Math.round(seconds * this.fps)
    return this.frames.slice(Math.max(0, this.frames.length - n))
  }
}

const pickMime = () => {
  const MR = globalThis.MediaRecorder
  if (!MR) return null
  const list = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']
  return list.find((m) => MR.isTypeSupported(m)) || null
}

export const canRecordClips = () => {
  const c = globalThis.document.createElement('canvas')
  return !!(c.captureStream && pickMime())
}

/**
 * Render frames to a video. Plays in real time, so a 10 second clip takes
 * 10 seconds; onFrame(i, total) reports progress.
 * @returns {Promise<{ blob, ext }>}
 */
export const recordClip = (frames, match, opts) => {
  const o = opts || {}
  const mime = pickMime()
  if (!mime || frames.length === 0) return Promise.reject(new Error('Clips are not supported in this browser'))
  const small = globalThis.document.createElement('canvas')
  small.width = 256
  small.height = 224
  const big = globalThis.document.createElement('canvas')
  big.width = 768
  big.height = 672
  const bg = big.getContext('2d')
  bg.imageSmoothingEnabled = false
  const renderer = new Renderer(small, { hud: true })
  renderer.setMatch(match.rules, match.teams)
  const stream = big.captureStream(30)
  const chunks = []
  const rec = new globalThis.MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4000000 })
  rec.ondataavailable = (e) => {
    if (e.data && e.data.size) chunks.push(e.data)
  }
  return new Promise((resolve, reject) => {
    rec.onstop = () => resolve({ blob: new globalThis.Blob(chunks, { type: mime.split(';')[0] }), ext: mime.indexOf('mp4') >= 0 ? 'mp4' : 'webm' })
    rec.onerror = (e) => reject(e.error || new Error('recording failed'))
    rec.start()
    let i = 0
    const tail = 45
    const tick = () => {
      if (i < frames.length) {
        renderer.draw(frames[i], { dt: 1 / 30, snapCamera: i === 0 })
        // a little REPLAY tag in the corner
        const ctx = small.getContext('2d')
        if (Math.floor(i / 15) % 2 === 0) {
          ctx.fillStyle = '#d8343c'
          ctx.fillRect(6, 22, 5, 5)
        }
        drawText(ctx, 'REPLAY', 14, 21, '#ffffff', { shadow: '#000' })
      } else {
        // closing title card
        const ctx = small.getContext('2d')
        ctx.fillStyle = '#10131c'
        ctx.fillRect(0, 0, 256, 224)
        drawText(ctx, "YOUTH HOCKEY '27", 128, 90, '#ff3fa4', { align: 'center', scale: 2, shadow: '#000' })
        drawText(ctx, o.caption || '', 128, 120, '#ffffff', { align: 'center', shadow: '#000' })
      }
      bg.drawImage(small, 0, 0, 768, 672)
      if (o.onFrame) o.onFrame(i, frames.length + tail)
      i++
      if (i < frames.length + tail) globalThis.setTimeout(tick, 1000 / 30)
      else globalThis.setTimeout(() => rec.stop(), 100)
    }
    tick()
  })
}
