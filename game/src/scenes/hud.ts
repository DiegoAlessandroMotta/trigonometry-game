import { customEvents, scenes } from '@/core/consts'

export class HudScene extends Phaser.Scene {
  constructor() {
    super(scenes.hud)
  }

  public create() {
    const button = this.add.sprite(
      this.cameras.main.width - 20,
      20,
      'buttons-tileset',
      'green-square.png'
    )

    const iconYOffset = 4

    const icon = this.add.sprite(
      button.x,
      button.y - iconYOffset,
      'gui-tileset',
      'icon-15.png'
    )

    icon.setOrigin(0.5)
    icon.setScale(2)
    icon.setScrollFactor(0)

    button.setOrigin(0.5).setScale(2).setInteractive().setScrollFactor(0)

    button.on('pointerdown', () => {
      button.setTexture('buttons-tileset', 'green-square-pressed.png')
      icon.setY(button.y)
    })

    button.on('pointerup', () => {
      button.setTexture('buttons-tileset', 'green-square.png')
      icon.setY(button.y - iconYOffset)
      this.handleClickPauseButton()
    })

    button.on('pointerout', () => {
      button.setTexture('buttons-tileset', 'green-square.png')
      icon.setY(button.y - iconYOffset)
    })
  }

  private handleClickPauseButton() {
    this.game.events.emit(customEvents.pauseGame)
    this.scene.launch(scenes.pauseMenu)
  }
}
