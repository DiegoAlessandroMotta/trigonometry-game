import { animationsNames } from '@/core/consts'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private needsUpdate = false

  private readonly hitBoxWidth = 22
  private readonly hitBoxHeight = 32

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setup()
  }

  private setup() {
    this.body?.setSize(this.hitBoxWidth, this.hitBoxHeight, true)

    this.setBounce(0)
    this.setCollideWorldBounds(true)

    this.appear()

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      this.handleAnimationComplete,
      this
    )
  }

  private handleAnimationComplete(anim: Phaser.Animations.Animation) {
    if (anim.key === animationsNames.player.appearing) {
      this.needsUpdate = true
      this.anims.play('idle', true)
      this.body?.setSize(this.hitBoxWidth, this.hitBoxHeight, true)
    }

    if (anim.key === animationsNames.player.disappearing) {
      this.visible = false
    }
  }

  public appear() {
    this.needsUpdate = false
    this.play(animationsNames.player.appearing)
    this.body?.setSize(this.hitBoxWidth, this.hitBoxHeight, true)
  }

  public disappear() {
    this.needsUpdate = false
    this.play(animationsNames.player.disappearing)
    this.body?.setSize(this.hitBoxWidth, this.hitBoxHeight, true)
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
      this.setVelocityY(-280)
    }
  }

  update() {
    if (!this.needsUpdate) {
      return
    }

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

  destroy(fromScene?: boolean): void {
    this.removeAllListeners()
    super.destroy(fromScene)
  }
}
