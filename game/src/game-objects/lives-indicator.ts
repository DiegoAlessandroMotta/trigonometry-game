import { heartTexture } from '@/core/consts'

const HEART_DISPLAY_SIZE = 7
const HEART_SPACING = 10
const HEART_OFFSET_Y = -22
const LOSE_ANIM_DURATION = 300
const LOSE_ANIM_RISE = 4
const INDICATOR_DEPTH = 100

export class LivesIndicator {
  private readonly container: Phaser.GameObjects.Container
  private readonly hearts: Phaser.GameObjects.Image[]
  private remaining: number

  constructor(scene: Phaser.Scene, maxLives: number) {
    this.remaining = maxLives
    this.container = scene.add.container(0, 0)
    this.container.setDepth(INDICATOR_DEPTH)
    this.hearts = []

    const startX = -((maxLives - 1) * HEART_SPACING) / 2

    for (let i = 0; i < maxLives; i++) {
      const heart = scene.add.image(
        startX + i * HEART_SPACING,
        0,
        heartTexture.key,
        heartTexture.frame
      )
      heart.setDisplaySize(HEART_DISPLAY_SIZE, HEART_DISPLAY_SIZE)
      this.container.add(heart)
      this.hearts.push(heart)
    }
  }

  public followPlayer(player: { x: number; y: number }) {
    this.container.setPosition(player.x, player.y + HEART_OFFSET_Y)
  }

  public loseLife() {
    if (this.remaining <= 0) {
      return
    }
    const heart = this.hearts[this.remaining - 1]
    this.remaining--
    if (heart == null) {
      return
    }

    this.container.scene.tweens.add({
      targets: heart,
      y: heart.y - LOSE_ANIM_RISE,
      alpha: 0,
      duration: LOSE_ANIM_DURATION,
      onComplete: () => {
        heart.setVisible(false)
      }
    })
  }

  public destroy() {
    this.container.destroy()
  }
}
