export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    // Establecer fondo
    this.cameras.main.setBackgroundColor('#d56800')

    // Título del juego
    this.add
      .text(640, 300, 'Rumbo al APU', {
        fontSize: '32px',
        color: '#fde34d',
        fontStyle: 'bold'
      })
      .setOrigin(0.5)

    // Texto de carga
    const loadingText = this.add
      .text(640, 360, 'Cargando...', {
        fontSize: '24px',
        color: '#fde34d'
      })
      .setOrigin(0.5)

    // Contenedor de la barra de progreso
    this.add
      .rectangle(640, 400, 300, 30)
      .setStrokeStyle(2, 0xfde34d)
      .setOrigin(0.5)

    // Barra de progreso
    const progressBar = this.add
      .rectangle(490, 400, 0, 30, 0xfde34d)
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
        this.scene.start('MainMenuScene')
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

    this.load.setPath('assets/scenes/main-menu')
    this.load.image('main-menu-bg', 'bg.webp')

    // Assets de branch-sorting
    this.load.setPath('assets/scenes/branch-sorting')
    this.load.image('branch-bg', 'bg.jpg')
    this.load.atlas('branches', 'branches.png', 'branches.json')

    // Volver a la ruta base para otros assets
    // this.load.setPath('assets')
  }
}
