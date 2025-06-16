import Phaser from 'phaser'
import '@/style.css'
import { Preloader } from '@/scenes/preloader'
import { BranchSortingScene } from '@/scenes/branch-sorting'
import { Game } from './scenes/game'
import { MainMenuScene } from './scenes/main-menu'

const app = document.querySelector<HTMLDivElement>('#app')
if (!(app instanceof HTMLDivElement)) {
  throw new Error('App root element not found')
}

const $gameCanvas = document.createElement('canvas')
app.appendChild($gameCanvas)

/* Resolutions with aspect radio of 16/9
 * 1600/900
 * 1280/720
 * 960/540
 * 640/360
 */

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  canvas: $gameCanvas,
  backgroundColor: '#111',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 1100,
        x: 0
      },
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Preloader, MainMenuScene, BranchSortingScene, Game]
}

new Phaser.Game(config)
