import Phaser from 'phaser'
import '@/style.css'
import { Game } from '@/scenes/game'
import { Preloader } from '@/scenes/preloader'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/ `
  <div>
    <h1>Juego de trigonometría</h1>
    <canvas id="game-canvas"></canvas>
  </div>
`

const $gameCanvas = document.querySelector<HTMLCanvasElement>('#game-canvas')

if (!($gameCanvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found D:')
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  canvas: $gameCanvas,
  backgroundColor: '#028af8',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 500,
        x: 0
      },
      debug: true
    }
  },
  scale: {
    // mode: Phaser.Scale.FIT
    // autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Preloader, Game]
}

new Phaser.Game(config)
