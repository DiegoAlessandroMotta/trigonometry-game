export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setup()
  }

  private setup() {
    this.setBounce(0)
    this.setCollideWorldBounds(true)
    this.body?.setSize(22, 32)
  }

  public idle() {
    this.setVelocityX(0)
  }

  left() {
    this.setVelocityX(-100)
    this.setFlipX(true)
  }

  right() {
    this.setVelocityX(100)
    this.setFlipX(false)
  }

  jump() {
    if (this.body?.blocked.down) {
      this.setVelocityY(-340)
    }
  }

  update() {
    if (this.body != null) {
      if (this.body.blocked.down) {
        if (this.body.velocity.x !== 0) {
          this.anims.play('run', true)
        } else {
          this.anims.play('idle', true)
        }
      } else {
        if (
          !this.body.blocked.left &&
          !this.body.blocked.right &&
          this.body.velocity.y < 0
        ) {
          this.anims.play('jump', true)
        } else if (
          !this.body.blocked.left &&
          !this.body.blocked.right &&
          this.body.velocity.y > 0
        ) {
          this.anims.play('fall', true)
        } else {
          this.anims.play('stopped', true)
        }
      }
    }
  }
}
