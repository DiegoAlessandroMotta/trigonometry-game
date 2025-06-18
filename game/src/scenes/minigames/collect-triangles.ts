import { Player } from '@/game-objects/player'

export class CollectTriangles extends Phaser.Scene {
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

  create(): void {
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

    // Crear una textura de triángulo una sola vez
    const triangleGraphics = this.add.graphics()
    triangleGraphics.lineStyle(2, 0x000000)
    triangleGraphics.fillStyle(0x000000)

    // Dibujar un triángulo equilátero desde la esquina superior izquierda
    const size = 32
    const height = (size * Math.sqrt(3)) / 2
    triangleGraphics.beginPath()
    triangleGraphics.moveTo(size / 2, 0) // Punto superior
    triangleGraphics.lineTo(0, height) // Punto inferior izquierdo
    triangleGraphics.lineTo(size, height) // Punto inferior derecho
    triangleGraphics.closePath()
    triangleGraphics.fill()

    // Generar textura desde el gráfico
    triangleGraphics.generateTexture('triangle', size, size)
    triangleGraphics.destroy()

    // Crear grupo de triángulos
    this.stars = this.physics.add.group()

    // Crear los sprites de triángulo
    for (let i = 0; i < 18; i++) {
      const x = 12 + i * 70
      const y = 0
      const triangleSprite = this.stars.create(x, y, 'triangle')
      triangleSprite
        .setOrigin(0, 0) // Establecer el origen en la esquina superior izquierda
        .setBounceY(Phaser.Math.Between(0.7, 0.9))
        .setVelocity(Phaser.Math.Between(-50, 50), 10)
        .setCollideWorldBounds(true)
    }

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

  update(): void {
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

  collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    star
  ): void => {
    const starSprite = star as Phaser.Physics.Arcade.Sprite
    starSprite.disableBody(true, true)

    this.score += 10
    this.scoreText?.setText('Score: ' + this.score)

    if (this.stars?.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        const sprite = child as Phaser.Physics.Arcade.Sprite
        sprite.enableBody(true, sprite.x, 0, true, true)
        return true
      })

      this.releaseBomb()
    }
  }

  hitBomb: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    _bomb
  ): void => {
    this.physics.pause()

    if (this.player) {
      this.player.setTint(0xff0000)
      this.player.anims.play('turn')

      this.time.delayedCall(1000, () => {
        this.scene.start('MainMenuScene')
      })
    }
  }

  releaseBomb(): void {
    if (!this.player || !this.bombs) return

    const x =
      this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400)

    const bomb = this.bombs.create(
      x,
      16,
      'bomb'
    ) as Phaser.Physics.Arcade.Sprite
    bomb.setBounce(1)
    bomb.setCollideWorldBounds(true)
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
  }
}
