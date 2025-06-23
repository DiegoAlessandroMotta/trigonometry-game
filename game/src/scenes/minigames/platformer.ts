import { Player } from '@/game-objects/player'

export class PlatformerScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('PlatformerScene')
  }

  create() {
    const map = this.make.tilemap({ key: 'level1' })

    const bgTileset = map.addTilesetImage('backgrounds', 'backgrounds')
    if (bgTileset == null) {
      throw new Error('bgTileset image not found')
    }

    const tileset = map.addTilesetImage('platforms', 'tiles')
    if (tileset == null) {
      throw new Error('tileset image not found')
    }

    map.createLayer('bg', bgTileset, 0, 0)

    const platformsLayer = map.createLayer('platforms', tileset, 0, 0)
    if (platformsLayer == null) {
      throw new Error('Platforms layer does not exists')
    }

    platformsLayer.setCollisionByProperty({ collides: true })

    this.player = new Player(this, 16, 512 - 48)
    this.player.setGravityY(1000)

    this.physics.add.collider(this.player, platformsLayer)

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
