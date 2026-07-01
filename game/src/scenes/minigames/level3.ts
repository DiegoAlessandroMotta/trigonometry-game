import { customEvents, scenes } from '@/core/consts'
import { PlayerInputController } from '@/game-objects/controllers/PlayerInputController'
import { Player } from '@/game-objects/player'
import dialogInitial from '@/dialogs-pages/level3.json'
import dialogFinal from '@/dialogs-pages/level3-complete.json'

export class Level3Scene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  oneWayPlatforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  player2?: Player
  map?: Phaser.Tilemaps.Tilemap
  itemsGroup?: Phaser.Physics.Arcade.Group
  isPaused = false
  playerInputController?: PlayerInputController
  endFlagGroup?: Phaser.Physics.Arcade.Group
  totalItems: number = 0
  itemsCollected: number = 0

  // moveRight = false
  // moveLeft = false
  // jump = false

  constructor() {
    super(scenes.level3)
  }

  init() {
    this.isPaused = false
    this.totalItems = 0
    this.itemsCollected = 0
  }

  create() {
    this.isPaused = false
    this.itemsGroup = this.physics.add.group()
    this.endFlagGroup = this.physics.add.group()

    this.drawMap()

    this.player = new Player(this, 16 * 3, 16 * 22)
    this.playerInputController = new PlayerInputController(this, this.player)

    this.player.setGravityY(1000)

    if (this.itemsGroup == null) {
      throw new Error(
        'Items group is undefined, did you forget to initialize it?'
      )
    }

    this.addMapCollides()

    this.physics.add.overlap(
      this.player,
      this.itemsGroup,
      this.collectItem,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.player,
      this.endFlagGroup,
      this.endLevel,
      undefined,
      this
    )

    this.scene.launch(scenes.hud)

    this.scene.launch(scenes.dialog, {
      height: 16 * 10,
      pages: dialogInitial
    })

    this.registerEvents()
  }

  collectItem: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    item
  ) => {
    const itemSprite = item as Phaser.Physics.Arcade.Sprite

    //   if (itemSprite?.body instanceof Phaser.Physics.Arcade.Body) {
    const alreadyCollected = Boolean(itemSprite.data.get('collected'))

    if (!alreadyCollected) {
      itemSprite.data.set('collected', true)
      itemSprite.setVisible(false)
      this.itemsCollected++
    }
    // }
  }

  endLevel: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    item
  ) => {
    if (this.itemsCollected < this.totalItems) {
      return
    }

    const itemSprite = item as Phaser.Physics.Arcade.Sprite

    if (itemSprite?.body instanceof Phaser.Physics.Arcade.Body) {
      itemSprite.play('flag-idle', true)

      this.time.delayedCall(50, () => {
        if (this.player != null) {
          this.player.controlsEnabled = false
          this.player.idle()
        }
      })

      this.time.delayedCall(250, () => {
        this.scene.launch(scenes.dialog, {
          height: 16 * 12,
          pages: dialogFinal,
          nextScene: scenes.mainMenu
        })
      })
    }
  }

  update(time: number, delta: number) {
    if (this.isPaused) {
      return
    }

    this.playerInputController?.update(time, delta)
  }

  togglePause() {
    this.isPaused = !this.isPaused

    if (this.isPaused) {
      this.physics.pause()
      this.scene.pause(scenes.level3)
    } else {
      this.physics.resume()
      this.scene.resume(scenes.level3)
    }
  }

  drawMap() {
    this.add
      .tileSprite(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        'bg-tileset',
        '4.png'
      )
      .setOrigin(0)

    this.map = this.make.tilemap({ key: 'level3' })

    const tileset = this.map.addTilesetImage('platforms', 'tiles')
    if (tileset == null) {
      throw new Error('tileset image not found')
    }

    const objectsLayer = this.map?.getObjectLayer('objects')

    objectsLayer?.objects.forEach((obj) => {
      if (obj.gid == null) {
        this.drawBackgroundShape(obj)
      }
    })

    this.map.createLayer('platforms', tileset, 0, 0)

    const usedGids = new Set<number>()
    objectsLayer?.objects.forEach((obj) => {
      if (obj.gid != null) {
        usedGids.add(obj.gid)
      }
    })

    usedGids.forEach((gid) => {
      this.map
        ?.createFromObjects('objects', { key: 'objects', gid })
        .forEach((sprite) => {
          if (sprite instanceof Phaser.GameObjects.Sprite) {
            this.setupObjectSprite(sprite)
          }
        })
    })
  }

  drawBackgroundShape(obj: Phaser.Types.Tilemaps.TiledObject) {
    const bgColorProp = (obj.properties ?? []).find(
      (p: { name: string; value: string }) => p.name === 'bg-color'
    )
    if (bgColorProp == null) {
      return
    }

    const tiledHex = bgColorProp.value.replace('#', '')
    const alpha = parseInt(tiledHex.slice(0, 2), 16) / 255
    const colorInt = parseInt(tiledHex.slice(2, 8), 16)

    const x = obj.x ?? 0
    const y = obj.y ?? 0
    const width = obj.width ?? 0
    const height = obj.height ?? 0

    const graphics = this.add.graphics().fillStyle(colorInt, alpha)

    if (obj.polygon != null) {
      const points = obj.polygon.map((p: { x: number; y: number }) => ({
        x: x + p.x,
        y: y + p.y
      }))
      graphics.fillPoints(points, true)
    } else {
      graphics.fillRect(x, y, width, height)
    }
  }

  setupObjectSprite(sprite: Phaser.GameObjects.Sprite) {
    let totalFrames = 1
    let animationKey = ''

    const triangleType = sprite.data?.get('triangleType')
    const objType = sprite.data?.get('objType')

    if (triangleType != null) {
      if (triangleType === 'equilatero') {
        animationKey = 'equilatero-floating'
        totalFrames = 7
      } else if (triangleType === 'isoceles') {
        animationKey = 'isoceles-floating'
        totalFrames = 7
      } else if (triangleType === 'escaleno') {
        animationKey = 'escaleno-floating'
        totalFrames = 7
      } else {
        throw new Error('Unkown object type (triangle object)')
      }
    } else if (objType != null) {
      switch (objType) {
        case 'pointer':
          animationKey = 'pointer-idle'
          totalFrames = 7
          break
        case 'flag':
          animationKey = 'white-flag-idle'
          totalFrames = 7
          break
        default:
          throw new Error('Unkown object type (general object)')
      }
    }

    const randomStartFrame = Phaser.Math.Between(0, totalFrames - 1)
    sprite.setScale(1)

    if (animationKey !== '') {
      sprite.play({
        key: animationKey,
        startFrame: randomStartFrame,
        repeat: -1
      })
    }

    if (triangleType != null) {
      this.itemsGroup?.add(sprite)
      this.totalItems++
    } else if (objType === 'flag') {
      this.endFlagGroup?.add(sprite)
    }
  }

  addMapCollides() {
    this.platforms = this.physics.add.staticGroup()
    this.oneWayPlatforms = this.physics.add.staticGroup()

    this.map?.getObjectLayer('collides')?.objects.forEach((obj) => {
      let platform: Phaser.GameObjects.Sprite | undefined

      if (
        obj.properties?.find(
          (i: { name: string; value: any }) => i.name === 'oneWay'
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
    playerRef,
    platform
  ) => {
    if (!(playerRef instanceof Player)) {
      throw new Error('player is not an instance of Player')
    }

    if (!(platform instanceof Phaser.GameObjects.Sprite)) {
      throw new Error('The platform is not an sprite')
    }

    if (!(platform.body instanceof Phaser.Physics.Arcade.StaticBody)) {
      throw new Error("The platform doesn't have a body")
    }

    if (!(playerRef.body instanceof Phaser.Physics.Arcade.Body)) {
      throw new Error("The player doesn't have a body")
    }

    const playerVelocityY = playerRef?.body?.velocity.y
    const playerVelocityX = playerRef?.body?.velocity.x

    if (
      (playerVelocityY != null && playerVelocityY <= 0) ||
      (playerVelocityY === 0 && playerVelocityX !== 0)
    ) {
      return false
    }

    const playerBottom = playerRef.body.bottom - 16
    const platformBottom = platform.body.bottom

    if (playerBottom != null && playerBottom > platformBottom) {
      return false
    }

    return true
  }

  endGame(nextScene?: string) {
    this.scene.stop(scenes.dialog)
    this.scene.stop(scenes.hud)
    this.scene.start(nextScene ?? scenes.mainMenu)
  }

  // moveR() {
  //   this.moveRight = true
  // }

  // stopR() {
  //   this.moveRight = false
  // }

  // moveL() {
  //   this.moveLeft = true
  // }

  // stopL() {
  //   this.moveLeft = false
  // }

  // jumpNow() {
  //   this.jump = true
  // }

  // stopJ() {
  //   this.jump = false
  // }

  registerEvents() {
    this.events.on(customEvents.scenes.shutdown, this.clearEvents, this)

    this.game.events.on(customEvents.pauseGame, this.togglePause, this)
    this.game.events.on(customEvents.endGame, this.endGame, this)

    // this.game.events.on(customEvents.moveLeft, this.moveL, this)
    // this.game.events.on(customEvents.stopLeft, this.stopL, this)
    // this.game.events.on(customEvents.moveRight, this.moveR, this)
    // this.game.events.on(customEvents.stopRight, this.stopR, this)
    // this.game.events.on(customEvents.jump, this.jumpNow, this)
    // this.game.events.on(customEvents.stopJump, this.stopJ, this)
  }

  clearEvents() {
    this.events.off(customEvents.scenes.shutdown, this.clearEvents, this)

    this.game.events.off(customEvents.pauseGame, this.togglePause, this)
    this.game.events.off(customEvents.endGame, this.endGame, this)

    // this.game.events.off(customEvents.moveLeft, this.moveL, this)
    // this.game.events.off(customEvents.stopLeft, this.stopL, this)
    // this.game.events.off(customEvents.moveRight, this.moveR, this)
    // this.game.events.off(customEvents.stopRight, this.stopR, this)
    // this.game.events.off(customEvents.jump, this.jumpNow, this)
    // this.game.events.off(customEvents.stopJump, this.stopJ, this)
  }
}
