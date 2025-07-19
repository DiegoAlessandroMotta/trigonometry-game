import { Button } from '@/components/button'
import { pixelFont } from '@/core/consts'

export class MainMenuScene extends Phaser.Scene {
  titleBitmap?: Phaser.GameObjects.BitmapText

  constructor() {
    super('MainMenuScene')
  }

  create() {
    this.titleBitmap = this.add
      .bitmapText(
        this.cameras.main.width / 2,
        120,
        pixelFont,
        'Juego de\ntrigonometría'
      )
      .setOrigin(0.5)
      .setScale(4)
      .setCenterAlign()

    new Button(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      {
        text: 'Jugar',
        width: 120,
        height: 24
      },
      this.onPlayButtonClick,
      this
    )

    new Button(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 50,
      {
        text: 'Pantalla\ncompleta',
        width: 120,
        height: 42
      },
      this.onOptionsButtonClick,
      this
    )
  }

  onPlayButtonClick() {
    this.scene.stop('MainMenuScene')
    this.scene.start('PlatformerScene')
  }

  onOptionsButtonClick() {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen()
    } else {
      this.scale.startFullscreen()
    }
  }
}
