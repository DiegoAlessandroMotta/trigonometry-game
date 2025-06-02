import Phaser from 'phaser'
import '@/style.css'
import { Preloader } from '@/scenes/preloader'
import { StarSortingScene } from '@/scenes/star-sorting-scene'
import { BranchScene } from '@/scenes/branch-scene'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/ `
  <div>
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
  scene: [Preloader, BranchScene, StarSortingScene]
}

new Phaser.Game(config)
