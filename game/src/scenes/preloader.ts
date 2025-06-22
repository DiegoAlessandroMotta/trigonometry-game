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
    this.loadPlayerAssets('assets/player')
  }

  loadPlayerAssets(path: string) {
    this.load.setPath(path)
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
}
