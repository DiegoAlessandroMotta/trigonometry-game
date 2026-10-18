import { customEvents, echoDelayMs, scenes } from '@/core/consts'
import { PlayerInputController } from '@/game-objects/controllers/PlayerInputController'
import { EchoPlayer } from '@/game-objects/echo-player'
import { Player } from '@/game-objects/player'
import dialogGameOver from '@/dialogs-pages/platformer-game-over.json'
import type { DialogPage } from '@/scenes/dialog'

export type PlatformerSceneConfig = {
  playerSpawn: { x: number; y: number }
  mapKey: string
  bgFrame: string
  initialDialog: DialogPage[]
  finalDialog: DialogPage[]
  nextSceneOnWin: string
}

export class BasePlatformerScene extends Phaser.Scene {
  protected readonly playerSpawn: { x: number; y: number }
  protected readonly mapKey: string
  protected readonly bgFrame: string
  protected readonly initialDialog: DialogPage[]
  protected readonly finalDialog: DialogPage[]
  protected readonly nextSceneOnWin: string

  protected platforms?: Phaser.Physics.Arcade.StaticGroup
  protected oneWayPlatforms?: Phaser.Physics.Arcade.StaticGroup
  protected player?: Player
  protected echoPlayer?: EchoPlayer
  protected echoPlayerSpawned = false
  protected map?: Phaser.Tilemaps.Tilemap
  protected itemsGroup?: Phaser.Physics.Arcade.Group
  protected isPaused = false
  protected playerInputController?: PlayerInputController
  protected endFlagGroup?: Phaser.Physics.Arcade.Group
  protected totalItems = 0
  protected itemsCollected = 0

  constructor(sceneKey: string, config: PlatformerSceneConfig) {
    super(sceneKey)
    this.playerSpawn = config.playerSpawn
    this.mapKey = config.mapKey
    this.bgFrame = config.bgFrame
    this.initialDialog = config.initialDialog
    this.finalDialog = config.finalDialog
    this.nextSceneOnWin = config.nextSceneOnWin
  }

  init() {
    this.isPaused = false
    this.totalItems = 0
    this.itemsCollected = 0
    this.echoPlayerSpawned = false
  }

  create() {
    this.isPaused = false
    this.itemsGroup = this.physics.add.group()
    this.endFlagGroup = this.physics.add.group()

    this.drawMap()

    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y)
    this.playerInputController = new PlayerInputController(this, this.player)

    this.player.setGravityY(1000)

    this.echoPlayer = new EchoPlayer(
      this,
      this.playerSpawn.x,
      this.playerSpawn.y,
      echoDelayMs
    )

    this.time.delayedCall(echoDelayMs, () => {
      this.echoPlayer?.spawn()
      this.echoPlayerSpawned = true
    })

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

    this.physics.add.overlap(
      this.player,
      this.echoPlayer,
      this.onEchoOverlap,
      undefined,
      this
    )

    this.scene.launch(scenes.hud)

    this.scene.launch(scenes.dialog, {
      height: 16 * 10,
      pages: this.initialDialog
    })

    this.registerEvents()
  }

  collectItem: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    item
  ) => {
    const itemSprite = item as Phaser.Physics.Arcade.Sprite

    const alreadyCollected = Boolean(itemSprite.data.get('collected'))

    if (!alreadyCollected) {
      itemSprite.data.set('collected', true)
      itemSprite.setVisible(false)
      this.itemsCollected++
    }
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
          pages: this.finalDialog,
          nextScene: this.nextSceneOnWin
        })
      })
    }
  }

  onEchoOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    _echo
  ) => {
    if (!this.echoPlayerSpawned || this.isPaused) {
      return
    }

    if (this.player == null) {
      return
    }

    this.player.controlsEnabled = false
    this.player.idle()

    this.scene.launch(scenes.dialog, {
      height: 16 * 10,
      pages: dialogGameOver,
      nextScene: this.scene.key
    })
  }

  update(time: number, delta: number) {
    if (this.isPaused) {
      return
    }

    this.playerInputController?.update(time, delta)

    if (this.player != null) {
      this.echoPlayer?.record(this.player)
      this.echoPlayer?.update(time, delta)
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused

    if (this.isPaused) {
      this.physics.pause()
      this.scene.pause(this.scene.key)
    } else {
      this.physics.resume()
      this.scene.resume(this.scene.key)
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
        this.bgFrame
      )
      .setOrigin(0)

    this.map = this.make.tilemap({ key: this.mapKey })

    const tileset = this.map.addTilesetImage('platforms', 'tiles')
    if (tileset == null) {
      throw new Error('tileset image not found')
    }

    this.map.createLayer('platforms', tileset, 0, 0)

    this.loadObjects()
  }

  protected loadObjects() {
    this.map
      ?.createFromObjects('objects', { key: 'objects' })
      .forEach((obj) => {
        if (obj instanceof Phaser.GameObjects.Sprite) {
          this.setupObjectSprite(obj)
        }
      })
  }

  protected setupObjectSprite(sprite: Phaser.GameObjects.Sprite) {
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

  registerEvents() {
    this.events.on(customEvents.scenes.shutdown, this.clearEvents, this)

    this.game.events.on(customEvents.pauseGame, this.togglePause, this)
    this.game.events.on(customEvents.endGame, this.endGame, this)
  }

  clearEvents() {
    this.events.off(customEvents.scenes.shutdown, this.clearEvents, this)

    this.game.events.off(customEvents.pauseGame, this.togglePause, this)
    this.game.events.off(customEvents.endGame, this.endGame, this)
  }
}