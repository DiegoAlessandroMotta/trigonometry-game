import { Boot } from '@/scenes/boot'
import { MainMenuScene } from '@/scenes/menus/main-menu'
import { PlatformerScene } from '@/scenes/minigames/platformer'
import { PauseMenuScene } from '@/scenes/menus/pause-menu'
import { HudScene } from '@/scenes/hud'

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 768,
  height: 432,
  // width: 576,
  // height: 384,
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
  scene: [Boot, MainMenuScene, PlatformerScene, PauseMenuScene, HudScene]
}
