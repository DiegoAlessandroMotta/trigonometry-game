import { Player } from '@/game-objects/player'

export class PlatformerScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  oneWayPlatforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  map?: Phaser.Tilemaps.Tilemap
  itemsGroup?: Phaser.Physics.Arcade.Group

  constructor() {
    super('PlatformerScene')
  }

  create() {
    this.itemsGroup = this.physics.add.group()

    this.drawMap()

    this.player = new Player(this, 16 * 6, 16 * 18)
    this.player.setGravityY(1000)

    if (this.itemsGroup == null) {
      throw new Error(
        'Items group is undefined, did you forget to initialize it?'
      )
    }

    this.physics.add.overlap(
      this.player,
      this.itemsGroup,
      this.collectItem,
      undefined,
      this
    )

    this.cursors = this.input.keyboard?.createCursorKeys()

    this.addMapCollides()
  }

  collectItem: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    item
  ) => {
    const itemSprite = item as Phaser.Physics.Arcade.Sprite

    if (itemSprite?.body instanceof Phaser.Physics.Arcade.Body) {
      itemSprite.setVisible(false) // Deshabilita el cuerpo de física y lo hace invisible
    }

    // item.destroy() // Si quieres eliminar el objeto completamente de la escena
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

    const objectsTileset = this.map.addTilesetImage('objects', 'objects')
    if (objectsTileset == null) {
      throw new Error('objectsTileset image not found')
    }

    this.map.createLayer('bg', bgTileset, 0, -48)
    this.map.createLayer('platforms', tileset, 0, 0)

    this.anims.create({
      key: 'equilatero-floating',
      frames: this.anims.generateFrameNames('objects', {
        prefix: 'equilatero-',
        suffix: '.png',
        start: 1,
        end: 7,
        zeroPad: 0
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'isoceles-floating',
      frames: this.anims.generateFrameNames('objects', {
        prefix: 'isoceles-',
        suffix: '.png',
        start: 1,
        end: 7,
        zeroPad: 0
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'escaleno-floating',
      frames: this.anims.generateFrameNames('objects', {
        prefix: 'escaleno-',
        suffix: '.png',
        start: 1,
        end: 16,
        zeroPad: 0
      }),
      frameRate: 8,
      repeat: -1
    })

    this.map
      .createFromObjects('triangles', {
        key: 'gems',
        frame: 'triangle-1.png'
      })
      .forEach((triangle) => {
        if (
          triangle instanceof Phaser.GameObjects.Sprite ||
          triangle instanceof Phaser.Physics.Arcade.Sprite
        ) {
          const totalFrames = 7
          const randomStartFrame = Phaser.Math.Between(0, totalFrames - 1)

          triangle.play({
            key: 'triangle-1-floating',
            startFrame: randomStartFrame,
            repeat: -1
          })

          this.physics.world.enable(triangle)
        }
      })

    this.map
      .createFromObjects('objects', {
        key: 'objects'
        // frame: 'triangle-1.png'
      })
      .forEach((obj) => {
        if (obj instanceof Phaser.GameObjects.Sprite) {
          const totalFrames = 7
          const randomStartFrame = Phaser.Math.Between(0, totalFrames - 1)

          let animationKey = ''
          const triangleType = obj.data?.get('triangleType')

          if (triangleType === 'equilatero') {
            animationKey = 'equilatero-floating'
          } else if (triangleType === 'isoceles') {
            animationKey = 'isoceles-floating'
          } else if (triangleType === 'escaleno') {
            animationKey = 'escaleno-floating'
          } else {
            throw new Error('Unkown object type (triangle object)')
          }

          // obj.setScale(2)

          obj.play({
            key: animationKey,
            startFrame: randomStartFrame,
            repeat: -1
          })

          // this.physics.world.enable(obj)

          this.itemsGroup?.add(obj)
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
          (i: { name: string; value: any }) => (i.name = 'oneWay')
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
