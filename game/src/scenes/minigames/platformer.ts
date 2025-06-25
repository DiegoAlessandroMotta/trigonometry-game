import { Player } from '@/game-objects/player'

export class PlatformerScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  oneWayPlatforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  map?: Phaser.Tilemaps.Tilemap

  constructor() {
    super('PlatformerScene')
  }

  create() {
    this.drawMap()

    this.player = new Player(this, 16, 512 - 48)
    this.player.setGravityY(1000)

    this.cursors = this.input.keyboard?.createCursorKeys()

    this.addMapCollides()
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

  drawMap() {
    this.map = this.make.tilemap({ key: 'level1' })

    const bgTileset = this.map.addTilesetImage('backgrounds', 'backgrounds')
    if (bgTileset == null) {
      throw new Error('bgTileset image not found')
    }

    const tileset = this.map.addTilesetImage('platforms', 'tiles')
    if (tileset == null) {
      throw new Error('tileset image not found')
    }

    const gemTileset = this.map.addTilesetImage('gems', 'gems')
    if (gemTileset == null) {
      throw new Error('gemTileset image not found')
    }

    this.map.createLayer('bg', bgTileset, 0, -48)
    this.map.createLayer('platforms', tileset, 0, 0)
    this.map.createLayer('gems', gemTileset, 0, 0)

    this.anims.create({
      key: 'floating',
      frames: this.anims.generateFrameNames('gems', {
        prefix: 'triangle-',
        suffix: '.png',
        start: 1,
        end: 7,
        zeroPad: 0
      }),
      frameRate: 10,
      repeat: -1
    })

    const triangles = this.map.createFromObjects('triangles', {
      key: 'gems',
      frame: 'triangle-1.png'
    })

    triangles.forEach((triangle) => {
      if (
        triangle instanceof Phaser.GameObjects.Sprite ||
        triangle instanceof Phaser.Physics.Arcade.Sprite
      ) {
        const totalFrames = 7
        const randomStartFrame = Phaser.Math.Between(0, totalFrames - 1)

        triangle.play({
          key: 'floating',
          startFrame: randomStartFrame,
          repeat: -1
        })

        // this.physics.world.enable(triangle)
      }
    })
  }

  addMapCollides() {
    this.platforms = this.physics.add.staticGroup()
    this.oneWayPlatforms = this.physics.add.staticGroup()

    this.map?.getObjectLayer('collides')?.objects.forEach((obj) => {
      let platform: Phaser.GameObjects.Sprite | undefined

      if (
        obj.properties?.find(
          (i: { name: string; value: any; type: string }) => (i.name = 'oneWay')
        )?.value
      ) {
        platform = this.oneWayPlatforms?.create(obj.x, obj.y, '__DEFAULT')
      } else {
        platform = this.platforms?.create(obj.x, obj.y, '__DEFAULT')
      }

      platform
        ?.setOrigin(0, 0)
        .setDisplaySize(obj.width ?? 0, obj.height ?? 0)
        .setVisible(false)

      if (platform?.body instanceof Phaser.Physics.Arcade.StaticBody) {
        platform.body.setSize(obj.width, obj.height)
      }
    })

    this.platforms?.refresh()
    this.oneWayPlatforms?.refresh()

    if (this.player == null) {
      throw new Error('Player not created yet')
    }

    this.physics.add.collider(this.player, this.platforms)

    this.physics.add.collider(
      this.player,
      this.oneWayPlatforms,
      undefined,
      this.processOneWayPlatform,
      this
    )
  }

  processOneWayPlatform: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    platform
  ) => {
    if (this.player == null) {
      throw new Error('Player not created yet')
    }

    if (!(platform instanceof Phaser.GameObjects.Sprite)) {
      throw new Error('The platform is not an sprite')
    }

    if (!(platform.body instanceof Phaser.Physics.Arcade.StaticBody)) {
      throw new Error("The platform doesn't have a body")
    }

    const playerVelocityY = this.player?.body?.velocity.y
    const playerVelocityX = this.player?.body?.velocity.x

    if (
      (playerVelocityY != null && playerVelocityY <= 0) ||
      (playerVelocityY === 0 && playerVelocityX !== 0)
    ) {
      return false
    }

    const playerTop = this.player.body?.top
    const platformTop = platform.body.top

    if (playerTop != null && playerTop > platformTop) {
      return false
    }

    return true
  }
}
