import { Preloader } from '@/scenes/preloader'
import { MainMenuScene } from '@/scenes/main-menu'
import { PlatformerScene } from '@/scenes/minigames/platformer'

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 768,
  height: 512,
  render: {
    pixelArt: true
  },
  backgroundColor: '#111',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
        x: 0
      },
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Preloader, MainMenuScene, PlatformerScene]
}
