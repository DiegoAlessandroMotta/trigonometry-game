import Phaser from 'phaser'
import '@/style.css'
import { gameConfig } from './core/game-config'

const app = document.querySelector<HTMLDivElement>('#app')
if (!(app instanceof HTMLDivElement)) {
  throw new Error('App root element not found')
}

const $gameCanvas = document.createElement('canvas')
app.appendChild($gameCanvas)

new Phaser.Game({ ...gameConfig, canvas: $gameCanvas })
