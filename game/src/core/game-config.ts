import { Preloader } from '@/scenes/preloader'
import { MainMenuScene } from '@/scenes/main-menu'
import { CollectTriangles } from '@/scenes/minigames/collect-triangles'
import { PlatformerScene } from '@/scenes/minigames/platformer'

/* Resoluciones con radio de aspecto de 16/9
 * 1600/900
 * 1280/720
 * 960/540
 * 640/360
 */

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  canvas: undefined,
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
  scene: [Preloader, MainMenuScene, CollectTriangles, PlatformerScene]
}
