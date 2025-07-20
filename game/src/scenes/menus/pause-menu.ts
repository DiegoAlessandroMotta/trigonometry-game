import { fonts } from '@/core/consts'

export class PauseMenuScene extends Phaser.Scene {
  constructor() {
    super('PauseMenuScene')
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setInteractive()

    this.add
      .bitmapText(400, 50, fonts.pixel, 'Juego Pausado')
      .setOrigin(0.5)
      .setScale(4)

    this.add
      .bitmapText(400, 150, fonts.pixel, 'Reanudar')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.resumeGame()
      })
      .setScale(2)

    this.add
      .bitmapText(400, 200, fonts.pixel, 'Opciones')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        console.log('Abrir opciones')
      })
      .setScale(2)

    this.add
      .bitmapText(400, 250, fonts.pixel, 'Menú Principal')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.stop('PlatformerScene')
        this.scene.stop('PauseMenuScene')
        this.scene.start('MainMenuScene')
      })
      .setScale(2)
  }

  resumeGame() {
    const gameScene = this.scene.get('PlatformerScene')

    if (gameScene != null) {
      gameScene?.resumeGame()
    }
    this.scene.stop('PauseMenuScene')
  }
}
