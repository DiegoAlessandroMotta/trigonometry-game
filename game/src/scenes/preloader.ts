export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    this.add.image(512, 384, 'background')
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

    const bar = this.add.rectangle(512 - 230, 384, 4, 20, 0xffffff)

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')
    this.load.image('sky', 'sky.png')
    this.load.image('ground', 'platform.png')
    this.load.image('star', 'star.png')
    this.load.image('bomb', 'bomb.png')
    this.load.spritesheet('dude', 'dude.png', {
      frameWidth: 32,
      frameHeight: 48
    })
  }

  create() {
    // this.scene.start('Game')
    this.scene.start('Custom Pointer')
  }
}
