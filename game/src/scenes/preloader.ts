export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    this.load.on('complete', () => {
      this.scene.start('StartScreenScene')
    })
  }

  preload() {
    this.loadPlayerAssets()
    this.loadTileAssets()

    this.load.setPath('assets/fonts')
    this.load.bitmapFont('raster-forge', 'raster-forge.png', 'raster-forge.fnt')

    // Sonido de éxito para el minijuego de triángulos
    this.load.setPath('assets')
    this.load.audio('success', 'success.mp3')
  }

  create() {
    this.registerAnimations()
  }

  loadPlayerAssets() {
    this.load.setPath('assets/player')
    this.load.spritesheet('player-idle', 'idle.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('player-run', 'run.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('player-jump', 'jump.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('player-double-jump', 'double-jump.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('player-wall-jump', 'wall-jump.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('player-fall', 'fall.png', {
      frameWidth: 32,
      frameHeight: 32
    })
  }

  loadTileAssets() {
    this.load.setPath('assets/tiles')
    this.load.tilemapTiledJSON('level1', 'level1.json')

    this.load.atlas('tiles', 'tileset.png', 'tileset.json')
    this.load.atlas('gems', 'gems-tileset.png', 'gems-tileset.json')
    this.load.atlas('objects', 'objects-tileset.png', 'objects-tileset.json')

    this.load.setPath('assets/backgrounds')
    this.load.atlas('backgrounds', 'bg-tileset.png', 'bg-tileset.json')
  }

  registerAnimations() {
    this.anims.create({
      key: 'equilatero-floating',
      frames: this.anims.generateFrameNames('objects', {
        prefix: 'equilatero-',
        suffix: '.png',
        start: 1,
        end: 7,
        zeroPad: 0
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'isoceles-floating',
      frames: this.anims.generateFrameNames('objects', {
        prefix: 'isoceles-',
        suffix: '.png',
        start: 1,
        end: 7,
        zeroPad: 0
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'escaleno-floating',
      frames: this.anims.generateFrameNames('objects', {
        prefix: 'escaleno-',
        suffix: '.png',
        start: 1,
        end: 16,
        zeroPad: 0
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'stopped',
      frames: [{ key: 'player-idle', frame: 5 }],
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player-idle', {
        start: 0,
        end: 10
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player-run', {
        start: 0,
        end: 11
      }),
      frameRate: 24,
      repeat: -1
    })

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player-jump', frame: 0 }],
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: 'double-jump',
      frames: this.anims.generateFrameNumbers('player-double-jump', {
        start: 0,
        end: 5
      }),
      frameRate: 16,
      repeat: 0
    })

    this.anims.create({
      key: 'wall-jump',
      frames: this.anims.generateFrameNumbers('player-wall-jump', {
        start: 0,
        end: 4
      }),
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: 'fall',
      frames: [{ key: 'player-fall', frame: 0 }],
      frameRate: 1,
      repeat: 0
    })
  }
}
