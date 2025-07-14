export class PauseMenuScene extends Phaser.Scene {
  constructor() {
    super('PauseMenuScene')
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setInteractive()

    this.add
      .bitmapText(400, 50, 'raster-forge', 'Juego Pausado')
      .setOrigin(0.5)
      .setScale(4)

    this.add
      .bitmapText(400, 150, 'raster-forge', 'Reanudar')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.resumeGame()
      })
      .setScale(2)

    this.add
      .bitmapText(400, 200, 'raster-forge', 'Opciones')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        console.log('Abrir opciones')
      })
      .setScale(2)

    this.add
      .bitmapText(400, 250, 'raster-forge', 'Menú Principal')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.stop('PlatformerScene')
        this.scene.stop('PauseMenuScene')
        this.scene.start('MainMenuScene')
      })
      .setScale(2)

    this.input.keyboard?.on('keydown-ESC', () => {
      this.resumeGame()
    })
  }

  resumeGame() {
    const gameScene = this.scene.get('PlatformerScene')

    if (gameScene != null) {
      gameScene?.resumeGame()
    }
    this.scene.stop('PauseMenuScene')
  }
}
