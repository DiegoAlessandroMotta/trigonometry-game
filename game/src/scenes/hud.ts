import { customEvents, scenes } from '@/core/consts'

export class HudScene extends Phaser.Scene {
  pauseButton?: Phaser.GameObjects.Sprite
  pauseButtonIcon?: Phaser.GameObjects.Sprite
  pauseButtonIconOffset = 4

  constructor() {
    super(scenes.hud)
  }

  public create() {
    this.pauseButton = this.add.sprite(
      this.cameras.main.width - 20,
      20,
      'buttons-tileset',
      'green-square.png'
    )

    this.add
      .sprite(
        70,
        this.cameras.main.height - 30,
        'buttons-tileset',
        'gray-square.png'
      )
      .setScale(4)
      .setInteractive()
      .on('pointerdown', () => {
        console.log('pointer down')
        this.game.events.emit(customEvents.moveLeft)
      })
      .on('pointerup', () => {
        this.game.events.emit(customEvents.stopLeft)
      })

    this.add
      .sprite(
        70 * 2,
        this.cameras.main.height - 30,
        'buttons-tileset',
        'gray-square.png'
      )
      .setScale(4)
      .setInteractive()
      .on('pointerdown', () => {
        this.game.events.emit(customEvents.moveRight)
      })
      .on('pointerup', () => {
        this.game.events.emit(customEvents.stopRight)
      })

    this.add
      .sprite(
        this.cameras.main.width - 60,
        this.cameras.main.height - 30,
        'buttons-tileset',
        'gray-square.png'
      )
      .setScale(4)
      .setInteractive()
      .on('pointerdown', () => {
        this.game.events.emit(customEvents.jump)
      })
      .on('pointerup', () => {
        this.game.events.emit(customEvents.stopJump)
      })

    this.pauseButton
      .setOrigin(0.5)
      .setScale(2)
      .setInteractive()
      .setScrollFactor(0)

    this.pauseButtonIcon = this.add.sprite(
      this.pauseButton.x,
      this.pauseButton.y - this.pauseButtonIconOffset,
      'gui-tileset',
      'icon-15.png'
    )

    this.pauseButtonIcon.setOrigin(0.5).setScale(2).setScrollFactor(0)

    this.pauseButton.on('pointerdown', () => {
      this.pauseButton?.setTexture(
        'buttons-tileset',
        'green-square-pressed.png'
      )
      this.pauseButtonIcon?.setY(this.pauseButton?.y)
    })

    this.pauseButton.on('pointerup', () => {
      this.pauseButton?.setTexture('buttons-tileset', 'green-square.png')
      this.pauseButtonIcon?.setY(
        this.pauseButton != null
          ? this.pauseButton.y - this.pauseButtonIconOffset
          : undefined
      )
      this.handleClickPauseButton()
    })

    this.pauseButton.on('pointerout', () => {
      this.pauseButton?.setTexture('buttons-tileset', 'green-square.png')
      this.pauseButtonIcon?.setY(
        this.pauseButton != null
          ? this.pauseButton.y - this.pauseButtonIconOffset
          : undefined
      )
    })
  }

  private handleClickPauseButton() {
    this.game.events.emit(customEvents.pauseGame)
    this.scene.launch(scenes.pauseMenu)
  }
}
