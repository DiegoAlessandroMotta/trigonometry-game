import { Player } from '@/game-objects/player'

export class PlatformerScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('PlatformerScene')
  }

  create() {
    this.platforms = this.physics.add.staticGroup()

    this.player = new Player(this, 640, 200)
    this.player.setGravityY(1000)

    this.physics.add.collider(this.player, this.platforms)

    this.cursors = this.input.keyboard?.createCursorKeys()
  }

  update() {
    if (this.player != null && this.cursors != null) {
      if (this.cursors.left.isDown) {
        this.player.left()
      } else if (this.cursors.right.isDown) {
        this.player.right()
      } else {
        this.player.idle()
      }

      if (this.cursors.up.isDown) {
        this.player.jump()
      }

      this.player.update()
    }
  }
}
