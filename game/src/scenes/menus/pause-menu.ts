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
        // Aquí podrías lanzar otra escena para las opciones o mostrar un panel de opciones
        console.log('Abrir opciones')
        // this.scene.launch('OptionsScene'); // Para un submenú de opciones
      })
      .setScale(2)

    this.add
      .bitmapText(400, 250, 'raster-forge', 'Menú Principal')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.stop('PlatformerScene')
        // this.scene.remove('PlatformerScene')

        this.scene.stop('PauseMenuScene')
        this.scene.start('MainMenuScene')
      })
      .setScale(2)

    // Si usas el teclado para cerrar el menú
    this.input.keyboard?.on('keydown-ESC', () => {
      this.resumeGame()
    })
  }

  resumeGame() {
    // Obtiene una referencia a la escena de juego para llamarle a un método público
    const gameScene = this.scene.get('PlatformerScene')

    if (gameScene != null) {
      gameScene?.resumeGame() // Llama al método de reanudación en la escena del juego
    }
    this.scene.stop('PauseMenuScene') // Detiene esta escena de menú de pausa
  }
}
