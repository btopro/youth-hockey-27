/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */
// The look: "bold arcade" menus (slanted plates, hard shadows, a section
// colour per screen, key chips along the bottom) over the game's 16-bit rink.
import { css } from '@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js'

export const styles = css`
  :host {
    display: block;
    --yh-pink: #ff3fa4;
    --yh-ink: #07060e;
    --yh-panel: #14112a;
    --yh-panel2: #1c1838;
    --yh-edge: #e8e4ff;
    --yh-dim: #8a87a3;
    --yh-gold: #ffd23f;
    --yh-accent: #5ad0ff;
    --yh-font: 'Press Start 2P', var(--ddd-font-navigation, monospace);
    color: #ffffff;
    font-family: var(--yh-font);
    max-width: 820px;
    margin: 0 auto;
    -webkit-font-smoothing: none;
  }
  :host(:fullscreen) {
    max-width: none;
    width: 100vw;
    height: 100vh;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :host(:fullscreen) .shell {
    width: min(100vw, calc((100vh - 150px) * 1.143 + 0px));
    max-height: 100vh;
  }
  :host(:fullscreen) .menu {
    min-height: min(100vh, calc(100vw * 0.66));
  }
  .shell {
    background: var(--yh-ink);
    border: 3px solid var(--yh-accent);
    box-shadow: 6px 6px 0 #000;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  :host([attract]) .shell {
    border-width: 1px;
    box-shadow: none;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* ---------- intro ---------- */
  .intro {
    position: relative;
    cursor: pointer;
    background: #000;
  }
  .intro canvas {
    display: block;
    width: 100%;
    aspect-ratio: 512 / 448;
    image-rendering: pixelated;
  }
  .intro button.skip {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    cursor: pointer;
  }

  .intro-start {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    pointer-events: none;
    color: var(--yh-gold);
    font-size: 18px;
    text-shadow: 3px 3px 0 #000;
    background: repeating-linear-gradient(#000 0 2px, rgba(30, 30, 40, 0.6) 2px 4px);
    animation: tvidle 1.2s steps(2) infinite;
  }
  .intro-start small {
    font-size: 8px;
    color: #c9c4dc;
  }
  @keyframes tvidle {
    50% {
      opacity: 0.6;
    }
  }

  /* ---------- menus ---------- */
  .menu {
    position: relative;
    min-height: 560px;
    padding: 56px 18px 46px;
    box-sizing: border-box;
  }
  .menu canvas.bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    image-rendering: pixelated;
  }
  .menu > *:not(canvas) {
    position: relative;
    z-index: 1;
  }
  .topbar {
    position: absolute !important;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    z-index: 3 !important;
  }
  button,
  a.btn {
    font-family: var(--yh-font);
    font-size: 10px;
    color: #fff;
    background: #2e246c;
    border: 0;
    padding: 9px 14px;
    cursor: pointer;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
    filter: drop-shadow(3px 3px 0 #000);
    text-decoration: none;
    display: inline-block;
    line-height: 1.3;
  }
  button:hover,
  button:focus-visible,
  a.btn:hover,
  a.btn:focus-visible {
    background: #5a46d8;
    outline: none;
    box-shadow: inset 0 -2px 0 var(--yh-gold);
  }
  button[disabled] {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button.go,
  a.btn.go {
    background: var(--yh-accent);
    color: #07060e;
    font-size: 12px;
    padding: 12px 22px;
  }
  button.go:focus-visible,
  button.go:hover {
    background: var(--yh-gold);
  }
  .logo {
    text-align: center;
    margin: 0 0 18px;
    font-size: 30px;
    letter-spacing: 2px;
    line-height: 1.1;
    text-shadow: 4px 4px 0 #07060e;
  }
  .logo .small {
    display: block;
    font-size: 10px;
    color: #78a0c6;
    letter-spacing: 6px;
    margin-bottom: 6px;
    text-shadow: 2px 2px 0 #000;
  }
  .logo .ch {
    display: inline-block;
    animation: rainbow 2.4s linear infinite;
    -webkit-text-stroke: 2px #07060e;
  }
  @keyframes rainbow {
    0% {
      color: #ff5a6e;
    }
    20% {
      color: #ffd23f;
    }
    40% {
      color: #6fe3a8;
    }
    60% {
      color: #5ad0ff;
    }
    80% {
      color: #c77dff;
    }
    100% {
      color: #ff5a6e;
    }
  }
  .hub {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .tile {
    --c: var(--yh-accent);
    --d: #0d1830;
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 150px;
    padding: 18px 24px 18px 30px;
    background: color-mix(in srgb, var(--c) 55%, #000);
    clip-path: polygon(18px 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
    filter: drop-shadow(7px 7px 0 rgba(0, 0, 0, 0.6));
    text-align: left;
    transition: transform 0.12s ease-out;
  }
  .tile::before {
    content: '';
    position: absolute;
    inset: 4px;
    background: repeating-linear-gradient(115deg, transparent 0 34px, color-mix(in srgb, var(--c) 18%, transparent) 34px 48px), var(--d);
    clip-path: polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
    background-size: 200% 100%;
    animation: stripes 6s linear infinite;
    z-index: -1;
  }
  .tile:focus-visible,
  .tile:hover,
  .tile.on {
    background: var(--c);
    transform: scale(1.03) translate(-3px, -3px);
    box-shadow: none;
  }
  .tile:focus-visible::before,
  .tile.on::before {
    animation-duration: 1.6s;
    opacity: 0.85;
  }
  @keyframes stripes {
    to {
      background-position: -200% 0;
    }
  }
  .tile img {
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
    flex: none;
  }
  .tile .name {
    font-size: 20px;
    display: block;
    text-shadow: 3px 3px 0 #07060e;
  }
  .tile .sub {
    font-size: 8px;
    color: #c9c4dc;
    display: block;
    margin-top: 10px;
    line-height: 1.6;
  }
  .banner {
    display: inline-block;
    font-size: 16px;
    padding: 10px 46px 10px 18px;
    background: linear-gradient(110deg, var(--yh-accent) 0 85%, #fff 85% 88%, var(--yh-accent) 88% 91%, rgba(255, 255, 255, 0.5) 91% 93%, var(--yh-accent) 93%);
    clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
    filter: drop-shadow(5px 5px 0 #000);
    text-shadow: 3px 3px 0 #07060e;
    margin-bottom: 4px;
    animation: slidein 0.26s cubic-bezier(0.2, 1.4, 0.5, 1);
  }
  .crumb {
    font-size: 7px;
    color: var(--yh-accent);
    margin-left: 12px;
  }
  @keyframes slidein {
    from {
      transform: translateX(-120%);
    }
  }
  .panels {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 16px;
    margin-top: 16px;
  }
  .panel {
    position: relative;
    background: var(--yh-panel);
    padding: 22px 16px 16px;
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    filter: drop-shadow(5px 5px 0 rgba(0, 0, 0, 0.55));
    border-bottom: 3px solid var(--yh-accent);
  }
  .panel h3 {
    position: absolute;
    top: -2px;
    left: 12px;
    margin: 0;
    font-size: 8px;
    padding: 4px 14px;
    background: var(--yh-accent);
    color: #07060e;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
  }
  .rows {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
    width: 100%;
    font-size: 9px;
    color: #c9c4dc;
    background: var(--yh-panel2);
    padding: 9px 12px 9px 26px;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
    filter: none;
    text-align: left;
    position: relative;
  }
  .row .val {
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .row .val img {
    width: 18px;
    height: 18px;
    image-rendering: pixelated;
  }
  .row .arrows {
    color: var(--yh-gold);
  }
  .row:focus-visible,
  .row.on {
    background: var(--yh-accent);
    color: #fff;
    box-shadow: inset 0 -2px 0 rgba(255, 255, 255, 0.25);
  }
  .row:focus-visible::before,
  .row.on::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 50%;
    border: 5px solid transparent;
    border-left: 6px solid #fff;
    transform: translateY(-50%);
    animation: nudge 0.5s ease-in-out infinite alternate;
  }
  @keyframes nudge {
    to {
      left: 14px;
    }
  }
  .row.back {
    color: var(--yh-gold);
  }
  .matchup {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    text-align: center;
    gap: 8px;
    font-size: 8px;
    line-height: 1.6;
  }
  .matchup img {
    width: 84px;
    height: 84px;
    image-rendering: pixelated;
    display: block;
    margin: 0 auto 6px;
    filter: drop-shadow(4px 4px 0 #000);
  }
  .vs {
    font-size: 18px;
    color: var(--yh-gold);
    text-shadow: 3px 3px 0 #000;
  }
  .note {
    font-size: 8px;
    line-height: 1.8;
    color: #c9c4dc;
    margin: 12px 0 0;
  }
  .note.warn {
    color: #ff8fd0;
  }
  .hint {
    position: absolute !important;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.72);
    border-top: 1px solid var(--yh-accent);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    padding: 7px 10px;
    font-size: 7px;
    color: #c9c4dc;
  }
  .hint kbd {
    font-family: var(--yh-font);
    font-size: 7px;
    background: var(--yh-edge);
    color: #07060e;
    padding: 2px 4px;
    margin-right: 4px;
    box-shadow: inset 0 -1px 0 var(--yh-accent);
  }
  .list {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    margin-top: 16px;
  }
  .detail h4 {
    font-size: 14px;
    margin: 4px 0 14px;
    text-shadow: 3px 3px 0 #000;
  }
  .detail p,
  .detail li {
    font-size: 8px;
    line-height: 2;
    color: #e8e4f4;
  }
  .detail ul {
    padding-left: 16px;
  }
  .cheat {
    display: grid;
    gap: 10px;
  }
  .cheat input {
    font-family: var(--yh-font);
    font-size: 14px;
    text-transform: uppercase;
    background: #07060e;
    color: var(--yh-gold);
    border: 2px solid var(--yh-accent);
    padding: 10px;
    letter-spacing: 4px;
  }
  .cheat input:focus-visible {
    outline: 2px solid var(--yh-gold);
  }
  .keys {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 4px;
  }
  .keys button {
    padding: 7px 0;
    font-size: 9px;
  }
  .keys button.wide {
    grid-column: span 2;
  }
  .unlocked {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 6px;
  }
  .unlocked .row {
    grid-template-columns: 1fr auto;
  }
  .toast {
    position: absolute !important;
    left: 50%;
    bottom: 54px;
    transform: translateX(-50%);
    background: #16132a;
    color: var(--yh-gold);
    font-size: 9px;
    padding: 10px 14px;
    border: 2px solid var(--yh-gold);
    z-index: 5 !important;
    white-space: nowrap;
  }

  /* ---------- the game ---------- */
  .stands {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: #0b0e16;
    height: 104px;
    overflow: hidden;
    border-bottom: 2px solid var(--yh-gold);
  }
  .stands.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    color: #c9c4dc;
    background: repeating-linear-gradient(90deg, #121624 0 30px, #0f1220 30px 60px);
    line-height: 1.8;
    text-align: center;
  }
  .side {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-end;
    padding: 2px 6px 0;
    position: relative;
  }
  .side.away {
    justify-content: flex-end;
  }
  .section {
    display: flex;
    align-items: flex-end;
    position: relative;
    margin: 0 2px;
  }
  .section .tag {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 7px;
    background: rgba(0, 0, 0, 0.7);
    padding: 1px 3px;
    z-index: 2;
    white-space: nowrap;
  }
  .fan {
    position: relative;
    width: 30px;
    height: 46px;
    margin: 0 -5px;
  }
  .fan rpg-character {
    width: 36px;
    height: 46px;
    display: block;
  }
  .fan.jump {
    animation: hop 0.5s ease-in-out infinite;
  }
  .fan.wild {
    animation: wild 0.35s ease-in-out infinite;
    z-index: 3;
  }
  .fan.fight {
    animation: shake 0.12s linear infinite;
    z-index: 3;
  }
  .fan.fight::after {
    content: '!!';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    color: #ff5252;
    font-size: 10px;
    text-shadow: 1px 1px 0 #000;
  }
  .fan .bill {
    position: absolute;
    top: 2px;
    left: 50%;
    width: 18px;
    height: 9px;
    margin-left: -9px;
    background: #4caf50;
    border: 1px solid #1b5e20;
    color: #0b3d0e;
    font-size: 7px;
    line-height: 8px;
    text-align: center;
    animation: wave 0.3s ease-in-out infinite alternate;
    z-index: 4;
  }
  @keyframes hop {
    50% {
      transform: translateY(-4px);
    }
  }
  @keyframes wild {
    0% {
      transform: translateY(0) rotate(-6deg);
    }
    50% {
      transform: translateY(-12px) rotate(6deg);
    }
    100% {
      transform: translateY(0) rotate(-6deg);
    }
  }
  @keyframes shake {
    0% {
      transform: translateX(-2px);
    }
    50% {
      transform: translateX(2px);
    }
  }
  @keyframes wave {
    from {
      transform: rotate(-15deg) translateY(0);
    }
    to {
      transform: rotate(15deg) translateY(-3px);
    }
  }
  .stage {
    position: relative;
    outline: none;
  }
  .stage:focus-visible {
    box-shadow: inset 0 0 0 2px var(--yh-gold);
  }
  canvas#rink {
    display: block;
    width: 100%;
    aspect-ratio: 256 / 224;
    image-rendering: pixelated;
    background: #141826;
  }
  :host(:fullscreen) canvas#rink {
    width: auto;
    height: calc(100vh - 150px);
    margin: 0 auto;
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(7, 6, 14, 0.62);
    padding: 14px;
    z-index: 5;
  }
  .card {
    background: var(--yh-panel);
    border-bottom: 3px solid var(--yh-accent);
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    filter: drop-shadow(6px 6px 0 #000);
    padding: 22px 24px;
    max-width: 480px;
    width: 100%;
    font-size: 9px;
    line-height: 1.9;
  }
  .card h3 {
    font-size: 13px;
    margin: 0 0 10px;
    text-shadow: 3px 3px 0 #000;
  }
  .card .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
  .card .actions.stack {
    flex-direction: column;
  }
  .card .actions.stack button {
    text-align: left;
  }
  .card .kicker {
    font-size: 7px;
    color: var(--yh-accent);
  }
  .penalty .label {
    font-size: 16px;
    color: #ffd740;
    text-shadow: 3px 3px 0 #000;
  }
  .intermission .people {
    display: flex;
    gap: 8px;
    float: right;
    margin-left: 12px;
  }
  .intermission .people rpg-character {
    width: 56px;
    height: 72px;
  }
  .phone-wrap {
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }
  .phone {
    background: #111;
    border-radius: 14px;
    padding: 14px 6px;
    border: 2px solid #444;
    position: relative;
  }
  .phone canvas {
    display: block;
    width: 160px;
    height: 266px;
    image-rendering: pixelated;
    border-radius: 4px;
  }
  .phone .rec {
    position: absolute;
    top: 20px;
    left: 12px;
    font-size: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .phone .rec::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d8343c;
  }
  .bubble {
    background: #fff;
    color: #111;
    border-radius: 10px;
    padding: 12px;
    max-width: 210px;
    font-size: 8px;
    line-height: 1.8;
    margin-bottom: 80px;
  }
  .caller rpg-character {
    width: 64px;
    height: 82px;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    background: #0b0e16;
    align-items: center;
  }
  .toolbar .spacer {
    flex: 1;
  }
  .toolbar button {
    font-size: 8px;
    padding: 7px 12px;
  }
  .help {
    font-size: 7px;
    line-height: 1.8;
    color: #a2aaad;
    padding: 0 10px 8px;
    background: #0b0e16;
    margin: 0;
  }
  :host(:fullscreen) .help {
    display: none;
  }
  .touch {
    display: none;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #0b0e16;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .touch.on {
    display: flex;
  }
  .joy {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #182035;
    border: 2px solid #2b3a55;
    position: relative;
  }
  .knob {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--yh-pink);
    left: 36px;
    top: 36px;
    pointer-events: none;
  }
  .pad-buttons {
    display: grid;
    grid-template-columns: repeat(2, 64px);
    gap: 10px;
  }
  .pad-buttons button {
    height: 52px;
    clip-path: none;
    border-radius: 26px;
    padding: 0;
    font-size: 8px;
  }

  /* stick break: a picture-in-picture close-up */
  .pip {
    position: absolute;
    top: 22px;
    right: 14px;
    width: 34%;
    aspect-ratio: 4 / 3;
    border: 3px solid #fff;
    box-shadow: 4px 4px 0 #000;
    overflow: hidden;
    z-index: 4;
    pointer-events: none;
    background: #000;
    animation: pipin 0.25s ease-out;
  }
  @keyframes pipin {
    from {
      transform: scale(0.2);
      opacity: 0;
    }
  }
  .pip canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
  .pip .burst {
    position: absolute;
    inset: -40%;
    background: repeating-conic-gradient(from 0deg, rgba(90, 200, 255, 0.85) 0 6deg, rgba(255, 255, 255, 0) 6deg 14deg);
    mix-blend-mode: screen;
    animation: spin 0.6s linear infinite, flash 0.5s ease-out 2 alternate;
    mask-image: radial-gradient(circle, transparent 18%, #000 30%);
    -webkit-mask-image: radial-gradient(circle, transparent 18%, #000 30%);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes flash {
    from {
      filter: brightness(2.2);
    }
  }
  .pip .half {
    position: absolute;
    top: 46%;
    left: 46%;
    width: 22%;
    height: 5%;
    background: #a0522d;
    box-shadow: 2px 2px 0 #000;
  }
  .pip .half.a {
    animation: snapA 0.9s ease-out forwards;
  }
  .pip .half.b {
    animation: snapB 0.9s ease-out forwards;
  }
  @keyframes snapA {
    to {
      transform: translate(-140%, -260%) rotate(-260deg);
    }
  }
  @keyframes snapB {
    to {
      transform: translate(150%, -200%) rotate(300deg);
    }
  }
  .pip .money {
    position: absolute;
    top: 45%;
    left: 50%;
    font-size: 18px;
    animation: money 1.6s ease-out forwards;
    opacity: 0;
  }
  @keyframes money {
    0% {
      opacity: 1;
      transform: translate(-50%, 0) scale(0.4);
    }
    100% {
      opacity: 0;
      transform: translate(var(--dx), var(--dy)) rotate(var(--r)) scale(1.2);
    }
  }
  .pip .cap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    font-size: 7px;
    text-align: center;
    padding: 4px;
    color: #fff;
  }
  .pip .cap strong {
    color: #5ad0ff;
  }

  /* the brawl */
  .brawl {
    position: absolute;
    inset: 0;
    z-index: 6;
    background: linear-gradient(#1a1430, #07060e 70%);
    overflow: hidden;
    font-size: 8px;
  }
  .brawl .bleachers {
    position: absolute;
    left: 0;
    right: 0;
    top: 34px;
    height: 34%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 8px;
    background: repeating-linear-gradient(#2b2450 0 6px, #1f1a3c 6px 30px);
    opacity: 0.85;
  }
  .brawl .bleachers rpg-character {
    width: 44px;
    height: 56px;
  }
  .brawl .bleachers .fan.fight {
    animation: shake 0.1s linear infinite;
  }
  .brawl .kids {
    position: absolute;
    left: 4%;
    bottom: 6%;
    display: flex;
    gap: 2px;
    align-items: flex-end;
  }
  .brawl .kids rpg-character {
    width: 46px;
    height: 58px;
  }
  .brawl .kids .tear {
    position: absolute;
    top: -12px;
    font-size: 8px;
    color: #9fe4ff;
  }
  .brawl .them {
    position: absolute;
    left: 50%;
    bottom: 20%;
    transform: translateX(-50%);
    transition: transform 0.08s;
  }
  .brawl .them rpg-character {
    width: 190px;
    height: 240px;
    display: block;
  }
  .brawl .them.tell {
    animation: shake 0.1s linear infinite;
    filter: drop-shadow(0 0 10px #ff3b4e);
  }
  .brawl .them.punch {
    transform: translateX(-50%) scale(1.18) translateY(14px);
  }
  .brawl .them.stunned {
    filter: drop-shadow(0 0 12px #ffd23f);
  }
  .brawl .them.hit {
    filter: brightness(2.5);
  }
  .brawl .them.down {
    transform: translateX(-50%) rotate(80deg) translateY(30%);
    transition: transform 0.6s;
  }
  .brawl .bang {
    position: absolute;
    top: -6%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    color: #ff3b4e;
    text-shadow: 3px 3px 0 #000;
  }
  .brawl .dizzy {
    position: absolute;
    top: -2%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: #ffd23f;
    animation: spin 1s linear infinite;
  }
  .brawl .you {
    position: absolute;
    left: 50%;
    bottom: -8%;
    width: 150px;
    height: 170px;
    transform: translateX(-50%);
    transition: transform 0.08s;
  }
  .brawl .you.left {
    transform: translateX(-120%);
  }
  .brawl .you.right {
    transform: translateX(20%);
  }
  .brawl .you.block {
    transform: translateX(-50%) translateY(18px);
  }
  .brawl .you.stun {
    filter: brightness(2) saturate(0);
  }
  .brawl .you .head {
    position: absolute;
    left: 50%;
    top: 0;
    width: 70px;
    height: 74px;
    margin-left: -35px;
    border-radius: 45% 45% 40% 40%;
    background: var(--hair, #4a3020);
    box-shadow: inset -8px -6px 0 rgba(0, 0, 0, 0.3);
  }
  .brawl .you .body {
    position: absolute;
    left: 50%;
    top: 60px;
    width: 150px;
    height: 120px;
    margin-left: -75px;
    border-radius: 50px 50px 0 0;
    background: var(--jersey, #ff3fa4);
    box-shadow: inset -12px 0 0 rgba(0, 0, 0, 0.25);
  }
  .brawl .you .fist {
    position: absolute;
    top: 52px;
    width: 40px;
    height: 36px;
    border-radius: 12px;
    background: #f3d2a2;
    border: 3px solid #07060e;
    transition: transform 0.06s;
  }
  .brawl .you .fist.l {
    left: 0;
  }
  .brawl .you .fist.r {
    right: 0;
  }
  .brawl .you .fist.go {
    transform: translateY(-120px) scale(1.4);
  }
  .brawl .you .fist.go.high {
    transform: translateY(-170px) scale(1.4);
  }
  .brawl .hud {
    position: absolute;
    top: 8px;
    left: 10px;
    right: 10px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
    align-items: center;
    z-index: 2;
  }
  .brawl .bar {
    height: 12px;
    background: #2a2448;
    border: 2px solid #fff;
    position: relative;
  }
  .brawl .bar span {
    position: absolute;
    inset: 0;
    background: linear-gradient(#ff8fd0, #ff3fa4);
    transform-origin: left;
  }
  .brawl .bar.them span {
    background: linear-gradient(#ffb36b, #ff7a1a);
  }
  .brawl .clock {
    font-size: 14px;
    color: var(--yh-gold);
    text-shadow: 2px 2px 0 #000;
  }
  .brawl .who {
    font-size: 7px;
    margin-bottom: 3px;
  }
  .brawl .stars {
    color: var(--yh-gold);
    letter-spacing: 2px;
  }
  .brawl .msg {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    color: #fff;
    text-shadow: 3px 3px 0 #000;
    z-index: 3;
    white-space: nowrap;
  }
  .brawl .hint {
    z-index: 3;
  }

  /* BookFace */
  .bf {
    background: #f0f2f5;
    color: #1c1e21;
    width: 100%;
    max-width: 520px;
    max-height: 100%;
    overflow: auto;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    box-shadow: 6px 6px 0 #000;
  }
  .bf header {
    background: #3b5ad9;
    color: #fff;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -1px;
  }
  .bf header small {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0;
  }
  .bf .post {
    background: #fff;
    margin: 10px;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .bf .who {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
  }
  .bf .who rpg-character {
    width: 36px;
    height: 44px;
    background: #e4e6eb;
    border-radius: 50%;
    overflow: hidden;
  }
  .bf .who small {
    display: block;
    font-weight: 400;
    color: #65676b;
    font-size: 11px;
  }
  .bf .text {
    white-space: pre-line;
    margin: 10px 0;
    line-height: 1.4;
  }
  .bf .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .bf .thumb {
    position: relative;
    padding: 0;
    border: 3px solid transparent;
    background: #000;
    clip-path: none;
    filter: none;
    cursor: pointer;
    border-radius: 4px;
  }
  .bf .thumb[aria-pressed='true'] {
    border-color: #3b5ad9;
  }
  .bf .thumb canvas {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    image-rendering: pixelated;
  }
  .bf .thumb span {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 11px;
    padding: 3px 5px;
    text-align: left;
  }
  .bf .likes {
    display: flex;
    justify-content: space-between;
    color: #65676b;
    border-bottom: 1px solid #ced0d4;
    padding: 6px 0;
    font-size: 12px;
  }
  .bf .comment {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }
  .bf .comment div {
    background: #f0f2f5;
    border-radius: 14px;
    padding: 6px 10px;
  }
  .bf .comment b {
    display: block;
    font-size: 12px;
  }
  .bf .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 0 10px 10px;
  }
  .bf button {
    font-family: system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    background: #3b5ad9;
    clip-path: none;
    filter: none;
    border-radius: 6px;
  }
  .bf button.plain {
    background: #e4e6eb;
    color: #1c1e21;
  }

  /* final, bracket */
  .scoreline {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 14px;
    margin: 14px 0;
    text-align: center;
    font-size: 9px;
    line-height: 1.6;
  }
  .scoreline img {
    width: 70px;
    height: 70px;
    image-rendering: pixelated;
    display: block;
    margin: 0 auto 6px;
  }
  .scoreline .big {
    font-size: 28px;
    color: var(--yh-gold);
    text-shadow: 4px 4px 0 #000;
  }
  table.stats {
    width: 100%;
    border-collapse: collapse;
    font-size: 8px;
    margin: 10px 0;
  }
  table.stats th,
  table.stats td {
    border: none;
    border-bottom: 1px solid #2c2650;
    padding: 6px;
    text-align: center;
    background: transparent;
    color: inherit;
  }
  table.stats th:first-child,
  table.stats td:first-child {
    text-align: left;
  }
  .awards {
    list-style: none;
    padding: 0;
    margin: 12px 0;
    display: grid;
    gap: 8px;
    font-size: 8px;
    line-height: 1.8;
  }
  .awards strong {
    display: block;
    color: var(--yh-gold);
    font-size: 7px;
  }
  .round ul {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  .round li {
    background: var(--yh-panel2);
    padding: 9px 14px;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 8px;
  }
  .round li.mine {
    background: color-mix(in srgb, var(--yh-accent) 40%, var(--yh-panel2));
  }
  .round h3 {
    font-size: 10px;
    margin: 14px 0 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .fan.jump,
    .fan.wild,
    .fan.fight,
    .fan .bill,
    .tile::before,
    .logo .ch,
    .pip .burst,
    .row::before,
    .banner {
      animation: none !important;
    }
    .fan.wild,
    .fan.jump {
      filter: brightness(1.4);
    }
  }
  @media (max-width: 640px) {
    .menu {
      padding: 50px 10px 60px;
      min-height: 0;
    }
    .hub,
    .panels,
    .list {
      grid-template-columns: 1fr;
    }
    .tile {
      min-height: 96px;
    }
    .tile .name {
      font-size: 15px;
    }
    .logo {
      font-size: 20px;
    }
    .stands {
      height: 72px;
    }
    .fan {
      width: 22px;
      height: 34px;
    }
    .fan rpg-character {
      width: 26px;
      height: 34px;
    }
    .phone canvas {
      width: 120px;
      height: 200px;
    }
    .bubble {
      margin-bottom: 40px;
    }
    .brawl .them rpg-character {
      width: 130px;
      height: 165px;
    }
    .brawl .you {
      transform: translateX(-50%) scale(0.7);
      transform-origin: bottom center;
    }
  }
`
