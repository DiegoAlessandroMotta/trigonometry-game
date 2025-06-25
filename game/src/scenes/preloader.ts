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

    this.load.setPath('assets/backgrounds')
    this.load.atlas('backgrounds', 'bg-tileset.png', 'bg-tileset.json')
  }
}
