import { animationsNames } from '@/core/consts'

type EchoFrame = {
  t: number
  x: number
  y: number
  flipX: boolean
  animKey: string
}

const HITBOX_WIDTH = 22
const HITBOX_HEIGHT = 32
const ECHO_TINT = 0x66ccff
const ECHO_ALPHA = 0.7
const BUFFER_SLACK_FACTOR = 2
const MIN_BUFFER_SLACK = 30
const FRAME_BUDGET_MS = 16.67

export class EchoPlayer extends Phaser.Physics.Arcade.Sprite {
  private readonly delayMs: number
  private readonly maxBufferSize: number
  private readonly buffer: EchoFrame[] = []
  private elapsedMs = 0
  private spawned = false
  private isMaterializing = false

  constructor(scene: Phaser.Scene, x: number, y: number, delayMs: number) {
    super(scene, x, y, 'player')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.delayMs = delayMs
    this.maxBufferSize =
      Math.ceil((delayMs * BUFFER_SLACK_FACTOR) / FRAME_BUDGET_MS) +
      MIN_BUFFER_SLACK

    const body = this.body
    if (!(body instanceof Phaser.Physics.Arcade.Body)) {
      throw new Error("EchoPlayer body wasn't initialized as an Arcade body")
    }

    body.setSize(HITBOX_WIDTH, HITBOX_HEIGHT, true)
    body.enable = false

    this.setBounce(0)
    this.setGravityY(0)
    this.setTint(ECHO_TINT)
    this.setAlpha(ECHO_ALPHA)
    this.setVisible(false)
  }

  public spawn() {
    if (this.spawned) {
      return
    }
    this.spawned = true

    const frame = this.findFrameAt(this.elapsedMs - this.delayMs)
    if (frame != null) {
      this.setPosition(frame.x, frame.y)
      this.setFlipX(frame.flipX)
    }

    this.body!.enable = true
    this.setVisible(true)

    this.play(animationsNames.player.appearing)
    this.isMaterializing = true

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      this.handleAnimationComplete,
      this
    )
  }

  public record(player: PlayerLike) {
    const currentAnim = player.anims.currentAnim
    if (currentAnim == null) {
      return
    }

    this.buffer.push({
      t: this.elapsedMs,
      x: player.x,
      y: player.y,
      flipX: player.flipX,
      animKey: currentAnim.key
    })

    while (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift()
    }
  }

  public update(_time: number, delta: number) {
    this.elapsedMs += delta

    if (!this.spawned || this.isMaterializing) {
      return
    }

    const frame = this.findFrameAt(this.elapsedMs - this.delayMs)
    if (frame == null) {
      return
    }

    this.setPosition(frame.x, frame.y)
    this.setFlipX(frame.flipX)

    if (this.anims.currentAnim?.key !== frame.animKey) {
      this.play(frame.animKey, true)
    }
  }

  private handleAnimationComplete(anim: Phaser.Animations.Animation) {
    if (anim.key === animationsNames.player.appearing) {
      this.isMaterializing = false
    }
  }

  private findFrameAt(targetT: number): EchoFrame | undefined {
    for (let i = this.buffer.length - 1; i >= 0; i--) {
      const frame = this.buffer[i]
      if (frame.t <= targetT) {
        return frame
      }
    }
    return undefined
  }

  public destroy(fromScene?: boolean) {
    this.removeAllListeners()
    super.destroy(fromScene)
  }
}

type PlayerLike = {
  x: number
  y: number
  flipX: boolean
  anims: Phaser.Animations.AnimationState
}