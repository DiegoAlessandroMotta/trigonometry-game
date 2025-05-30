export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  create() {
    this.add.image(400, 300, 'sky')
    this.add.text(400, 400, 'Game Over', {
      fontSize: '32px',
      color: '#000'
    })

    this.add.text(400, 500, 'Starting soon...', {
      fontSize: '32px',
      color: '#000'
    })

    this.time.delayedCall(2000, () => {
      this.scene.start('Game')
    })
  }
}
