import { animationsNames, pixelFont } from '@/core/consts'

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    this.load.on('complete', () => {
      this.scene.start('MainMenuScene')
    })
  }

  preload() {
    this.loadPlayerAssets()
    this.loadTileAssets()

    this.load.setPath('assets/fonts')
    this.load.bitmapFont(pixelFont, 'pixel-emulator.png', 'pixel-emulator.fnt')
  }

  create() {
    this.registerAnimations()
  }

  loadPlayerAssets() {
    this.load.setPath('assets/player')
    this.load.atlas(
      'player-tileset',
      'player-tileset.png',
      'player-tileset.json'
    )
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
      key: animationsNames.player.stopped,
      frames: [{ key: 'player-tileset', frame: 'player-idle-1.png' }],
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: animationsNames.player.idle,
      frames: this.anims.generateFrameNames('player-tileset', {
        prefix: 'player-idle-',
        suffix: '.png',
        start: 1,
        end: 11,
        zeroPad: 0
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: animationsNames.player.run,
      frames: this.anims.generateFrameNames('player-tileset', {
        prefix: 'player-run-',
        suffix: '.png',
        start: 1,
        end: 12,
        zeroPad: 0
      }),
      frameRate: 24,
      repeat: -1
    })

    this.anims.create({
      key: animationsNames.player.jump,
      frames: [{ key: 'player-tileset', frame: 'player-jump.png' }],
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: animationsNames.player.airJump,
      frames: this.anims.generateFrameNames('player-tileset', {
        prefix: 'player-double-jump-',
        suffix: '.png',
        start: 1,
        end: 6,
        zeroPad: 0
      }),
      frameRate: 32,
      repeat: 0
    })

    this.anims.create({
      key: animationsNames.player.wallSlide,
      frames: this.anims.generateFrameNames('player-tileset', {
        prefix: 'player-wall-slide-',
        suffix: '.png',
        start: 1,
        end: 5,
        zeroPad: 0
      }),
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: animationsNames.player.fall,
      frames: [{ key: 'player-tileset', frame: 'player-fall.png' }],
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: animationsNames.player.appearing,
      frames: this.anims.generateFrameNames('player-tileset', {
        prefix: 'player-appearing-',
        suffix: '.png',
        start: 1,
        end: 7,
        zeroPad: 0
      }),
      frameRate: 16,
      repeat: 0
    })

    this.anims.create({
      key: animationsNames.player.disappearing,
      frames: this.anims
        .generateFrameNames('player-tileset', {
          prefix: 'player-appearing-',
          suffix: '.png',
          start: 1,
          end: 7,
          zeroPad: 0
        })
        .reverse(),
      frameRate: 16,
      repeat: 0
    })
  }
}
