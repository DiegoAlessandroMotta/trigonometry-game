import type { Player } from '@/game-objects/player'

export class PlayerInputController {
  private player: Player
  private scene: Phaser.Scene
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private jumpKey?: Phaser.Input.Keyboard.Key

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene
    this.player = player

    this.setupCursors()
  }

  private setupCursors() {
    this.cursors = this.scene.input.keyboard?.createCursorKeys()

    this.jumpKey = this.scene.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    )

    this.jumpKey?.on('down', this.handleJumpInput, this)
  }

  private handleJumpInput() {
    if (this.player != null && this.player.controlsEnabled) {
      this.player.jump(this.scene.time.now)
    }
  }

  public update(time: number, delta: number) {
    if (
      this.player != null &&
      this.player.controlsEnabled &&
      this.cursors != null
    ) {
      if (this.cursors.left.isDown) {
        this.player.left()
      } else if (this.cursors.right.isDown) {
        this.player.right()
      } else {
        this.player.idle()
      }

      if (this.cursors.up.isDown) {
        this.player.checkContinuousJump(time)
      }
    }

    this.player.update(time, delta)
  }

  public destroy() {
    if (this.jumpKey) {
      this.jumpKey.off('down', this.handleJumpInput, this)
      this.jumpKey.destroy()
    }
  }
}
