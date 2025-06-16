import { Player } from '@/game-objects/player'

export class Game extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  stars?: Phaser.Physics.Arcade.Group
  score: number = 0
  scoreText?: Phaser.GameObjects.Text
  bombs?: Phaser.Physics.Arcade.Group

  constructor() {
    super('GameScene')
  }

  create() {
    const bg = this.add.image(0, 0, 'sky')
    bg.setOrigin(0)
    bg.setDisplaySize(1280, 720)

    this.platforms = this.physics.add.staticGroup()

    // suelo
    this.platforms.create(200, 704, 'ground')
    this.platforms.create(600, 704, 'ground')
    this.platforms.create(1000, 704, 'ground')
    this.platforms.create(1400, 704, 'ground')

    // plataformas bajas
    this.platforms.create(0, 550, 'ground')
    this.platforms.create(900, 550, 'ground')

    // plataformas medias
    this.platforms.create(400, 400, 'ground')
    this.platforms.create(1400, 400, 'ground')

    // plataformas altas
    this.platforms.create(-150, 250, 'ground')
    this.platforms.create(900, 250, 'ground')
    this.platforms.create(1450, 250, 'ground')

    // Es importante llamar a refreshBody() después de cambiar el tamaño
    this.platforms.refresh()

    this.player = new Player(this, 640, 600)

    this.physics.add.collider(this.player, this.platforms)

    this.cursors = this.input.keyboard?.createCursorKeys()

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 17,
      setXY: { x: 12, y: 0, stepX: 70 }
    })

    this.stars.children.iterate((child) => {
      ;(child as Phaser.Physics.Arcade.Sprite).setBounceY(
        Phaser.Math.FloatBetween(0.8, 0.9)
      )
      return null
    })

    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this
    )

    this.score = 0
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#000'
    })

    this.bombs = this.physics.add.group()

    this.physics.add.collider(this.bombs, this.platforms)
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this
    )
  }

  update() {
    if (this.cursors?.left.isDown) {
      this.player?.moveLeft()
    } else if (this.cursors?.right.isDown) {
      this.player?.moveRight()
    } else {
      this.player?.idle()
    }

    if (this.cursors?.up.isDown) {
      this.player?.jump()
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true)

    this.score += 10
    this.scoreText?.setText('Score: ' + this.score)

    if (this.stars?.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        ;(child as Phaser.Physics.Arcade.Sprite).enableBody(
          true,
          child.x,
          0,
          true,
          true
        )
      })

      this.releaseBomb()
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')

    // this.time.delayedCall(2000, () => {
    //   this.scene.start('GameOver')
    // })
  }

  releaseBomb() {
    if (this.player !== undefined) {
      let x =
        this.player?.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400)

      let bomb = this.bombs?.create(x, 16, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
  }
}
