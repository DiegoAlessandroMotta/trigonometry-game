export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    // Establecer fondo
    this.cameras.main.setBackgroundColor('#87CEEB')

    // Título del juego
    this.add
      .text(400, 200, 'Juego de Trigonometría', {
        fontSize: '32px',
        color: '#000000',
        fontStyle: 'bold'
      })
      .setOrigin(0.5)

    // Texto de carga
    const loadingText = this.add
      .text(400, 300, 'Cargando...', {
        fontSize: '24px',
        color: '#000000'
      })
      .setOrigin(0.5)

    // Contenedor de la barra de progreso
    this.add
      .rectangle(400, 350, 300, 30)
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0.5)

    // Barra de progreso
    const progressBar = this.add
      .rectangle(250, 350, 0, 20, 0x3498db)
      .setOrigin(0, 0.5)

    // Actualizar la barra de progreso
    this.load.on('progress', (value: number) => {
      progressBar.width = 300 * value
      loadingText.setText(`Cargando... ${Math.round(value * 100)}%`)
    })

    // Cuando la carga está completa
    this.load.on('complete', () => {
      loadingText.setText('¡Carga completa!')
      this.time.delayedCall(500, () => {
        this.scene.start('BranchScene')
      })
    })
  }

  preload() {
    this.load.setPath('assets')

    // Assets básicos
    this.load.image('sky', 'sky.png')
    this.load.image('ground', 'platform.png')
    this.load.image('star', 'star.png')
    this.load.image('bomb', 'bomb.png')
    this.load.spritesheet('dude', 'dude.png', {
      frameWidth: 32,
      frameHeight: 48
    })

    // Assets de branch-sorting
    this.load.setPath('assets/scenes/branch-sorting')
    this.load.image('branch-bg', 'bg.jpg')
    this.load.atlas('branches', 'branches.png', 'branches.json')

    // Volver a la ruta base para otros assets
    // this.load.setPath('assets')
  }
}
