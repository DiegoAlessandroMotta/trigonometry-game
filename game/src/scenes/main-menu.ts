import { Button } from '@/components/button'

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene')
  }

  preload() {}

  create() {
    const bg = this.add.image(0, 0, 'main-menu-bg')
    bg.setOrigin(0)
    bg.setDisplaySize(1280, 720)

    // Crear el botón de Jugar usando nuestra clase Button
    const playButton = new Button(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 50,
      {
        borderColor: 0xffffff
      },
      this.onPlayButtonClick,
      this
    )

    // Crear el botón de Opciones
    const optionsButton = new Button(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 50,
      undefined,
      this.onOptionsButtonClick,
      this
    )
  }

  onPlayButtonClick() {
    console.log('¡Se hizo clic en Jugar!')
    // this.scene.start('GameScene');
  }

  onOptionsButtonClick() {
    console.log('¡Se hizo clic en Opciones!')
    // this.scene.start('OptionsScene');
  }
}
