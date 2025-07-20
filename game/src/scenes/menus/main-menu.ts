import { Button } from '@/components/button'
import { fonts, scenes } from '@/core/consts'

export class MainMenuScene extends Phaser.Scene {
  titleBitmap?: Phaser.GameObjects.BitmapText

  constructor() {
    super(scenes.mainMenu)
  }

  create() {
    this.titleBitmap = this.add
      .bitmapText(
        this.cameras.main.width / 2,
        120,
        fonts.pixel,
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
        width: 140,
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
        width: 140,
        height: 48
      },
      this.onOptionsButtonClick,
      this
    )
  }

  onPlayButtonClick() {
    this.scene.stop(scenes.mainMenu)
    this.scene.start(scenes.platformer)
  }

  onOptionsButtonClick() {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen()
    } else {
      this.scale.startFullscreen()
    }
  }
}
