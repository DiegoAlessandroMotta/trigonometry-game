import { animationsNames } from '@/core/consts'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly hitBoxWidth = 22
  private readonly hitBoxHeight = 32
  private needsAnimationUpdate = false
  public controlsEnabled = false

  private maxAirJumps = 1
  private currentAirJumps = 0

  private jumpCooldown = 70
  private lastJumpTime = 0
  private jumpStrength = 280
  private airJumpStrength = 280
  private walkSpeed = 110
  private wallSlideFallSpeed = 70

  private wallJumpStrengthX = 180
  private wallJumpStrengthY = 250
  private wallJumpLockoutTime = 150
  private lastWallJumpTime = 0

  private isTouchingWall = false
  private isOnTheFloor = false
  private isFalling = false
  private isRising = false
  private isWalking = false
  private isWallSliding = false
  private isWallJumping = false

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
      this.controlsEnabled = true
      this.needsAnimationUpdate = true
      this.anims.play(animationsNames.player.idle, true)
      this.body?.setSize(this.hitBoxWidth, this.hitBoxHeight, true)
    }

    if (anim.key === animationsNames.player.disappearing) {
      this.visible = false
    }
  }

  public appear() {
    this.controlsEnabled = false
    this.needsAnimationUpdate = false
    this.play(animationsNames.player.appearing)
    this.body?.setSize(this.hitBoxWidth, this.hitBoxHeight, true)
  }

  public disappear() {
    this.controlsEnabled = false
    this.needsAnimationUpdate = false
    this.play(animationsNames.player.disappearing)
    this.body?.setSize(this.hitBoxWidth, this.hitBoxHeight, true)
  }

  public idle() {
    if (!this.isWallJumping) {
      this.setVelocityX(0)
    }
  }

  public left() {
    if (!this.isWallJumping) {
      this.setVelocityX(-1 * this.walkSpeed)
    }
  }

  public right() {
    if (!this.isWallJumping) {
      this.setVelocityX(this.walkSpeed)
    }
  }

  public checkContinuousJump(time: number) {
    if (this.body == null || !this.body.blocked.down) {
      return
    }

    this.jump(time)
  }

  public jump(time: number) {
    if (this.body == null) {
      return
    }

    if (time < this.lastJumpTime + this.jumpCooldown) {
      return
    }

    if (this.isOnTheFloor) {
      this.setVelocityY(-1 * this.jumpStrength)
      this.currentAirJumps = 0
      this.lastJumpTime = time
      this.isWallJumping = false
    } else if (this.isTouchingWall && this.isWallSliding) {
      const jumpDirection = this.body.blocked.right ? -1 : 1

      this.setVelocityX(jumpDirection * this.wallJumpStrengthX)
      this.setVelocityY(-1 * this.wallJumpStrengthY)
      this.currentAirJumps++
      this.lastJumpTime = time
      this.isWallJumping = true
      this.lastWallJumpTime = time
    } else if (this.currentAirJumps < this.maxAirJumps) {
      this.setVelocityY(-1 * this.airJumpStrength)
      this.lastJumpTime = time
      this.play(animationsNames.player.airJump)
      this.currentAirJumps++
    }
  }

  public update(time: number, _delta: number) {
    if (!this.needsAnimationUpdate) {
      return
    }

    this.updateFlags(time)

    if (this.body == null) {
      return
    }

    if (this.isTouchingWall && this.isFalling && !this.isOnTheFloor) {
      if (this.body.velocity.y > this.wallSlideFallSpeed) {
        this.setVelocityY(this.wallSlideFallSpeed)
      }

      this.currentAirJumps = 0
    }

    if (this.body.velocity.x > 0) {
      this.setFlipX(false)
    } else if (this.body.velocity.x < 0) {
      this.setFlipX(true)
    }

    if (this.isOnTheFloor) {
      this.currentAirJumps = 0

      if (this.isWalking) {
        this.anims.play(animationsNames.player.run, true)
      } else {
        this.anims.play(animationsNames.player.idle, true)
      }
    } else {
      if (this.isRising) {
        if (this.anims.currentAnim?.key !== animationsNames.player.airJump) {
          this.anims.play(animationsNames.player.jump, true)
        }
      } else if (this.isFalling) {
        if (this.isTouchingWall) {
          this.anims.play(animationsNames.player.wallSlide, true)
        } else {
          this.anims.play(animationsNames.player.fall, true)
        }
      } else {
        this.anims.play(animationsNames.player.stopped, true)
      }
    }
  }

  private updateFlags(time: number) {
    if (this.body == null) {
      return
    }

    this.isTouchingWall = this.body.blocked.left || this.body.blocked.right
    this.isOnTheFloor = this.body.blocked.down
    this.isFalling = this.body.velocity.y > 0
    this.isRising = this.body.velocity.y < 0
    this.isWalking = this.body.velocity.x !== 0

    if (this.isTouchingWall && this.isFalling && !this.isOnTheFloor) {
      this.isWallSliding = true
      this.isWallJumping = false
    } else {
      this.isWallSliding = false
    }

    if (this.isOnTheFloor) {
      this.isWallJumping = false
      this.isWallSliding = false
    }

    if (
      this.isWallJumping &&
      time > this.lastWallJumpTime + this.wallJumpLockoutTime
    ) {
      this.isWallJumping = false
    }
  }

  public destroy(fromScene?: boolean) {
    this.removeAllListeners()
    super.destroy(fromScene)
  }
}
