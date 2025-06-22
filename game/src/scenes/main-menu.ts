import { Button } from '@/components/button'

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene')
  }

  preload() {}

  create() {
    const bg = this.add.image(0, 0, 'main-menu-bg')
    bg.setOrigin(0)
    bg.setDisplaySize(this.scale.width, this.scale.height)

    new Button(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      {
        text: 'Jugar'
      },
      this.onPlayButtonClick,
      this
    )

    new Button(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 50,
      {
        text: '...'
      },
      this.onOptionsButtonClick,
      this
    )
  }

  onPlayButtonClick() {
    this.scene.start('PlatformerScene')
  }

  onOptionsButtonClick() {}
}
