class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setBounce(0)
    this.setCollideWorldBounds(true)
    this.initAnimations()
  }

  initAnimations() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player-idle', {
        start: 0,
        end: 10
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player-run', {
        start: 0,
        end: 11
      }),
      frameRate: 24,
      repeat: -1
    })

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player-jump', frame: 0 }],
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: 'double-jump',
      frames: this.anims.generateFrameNumbers('player-double-jump', {
        start: 0,
        end: 5
      }),
      frameRate: 16,
      repeat: 0
    })

    this.anims.create({
      key: 'wall-jump',
      frames: this.anims.generateFrameNumbers('player-wall-jump', {
        start: 0,
        end: 4
      }),
      frameRate: 1,
      repeat: 0
    })

    this.anims.create({
      key: 'fall',
      frames: [{ key: 'player-fall', frame: 0 }],
      frameRate: 1,
      repeat: 0
    })
  }

  idle() {
    this.setVelocityX(0)
  }

  left() {
    this.setVelocityX(-200)
    this.setFlipX(true)
  }

  right() {
    this.setVelocityX(200)
    this.setFlipX(false)
  }

  jump() {
    if (this.body?.blocked.down) {
      this.setVelocityY(-500)
    }
  }

  update() {
    if (this.body != null) {
      if (this.body.blocked.down) {
        if (this.body.velocity.x !== 0) {
          if (this.body.blocked.left || this.body.blocked.right) {
            this.anims.play('idle', true)
          } else {
            this.anims.play('run', true)
          }
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
        }
      }
    }
  }
}

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
