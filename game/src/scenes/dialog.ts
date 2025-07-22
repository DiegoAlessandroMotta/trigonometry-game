import { fonts, scenes } from '@/core/consts'

export class DialogScene extends Phaser.Scene {
  constructor() {
    super(scenes.dialog)
  }

  public create() {
    this.drawDialog()
  }

  private drawDialog() {
    const dialogTextureTheme = 'green'

    const tileFrames = {
      topLeft: `ui-${dialogTextureTheme}-1.png`,
      top: `ui-${dialogTextureTheme}-2.png`,
      topRight: `ui-${dialogTextureTheme}-3.png`,
      left: `ui-${dialogTextureTheme}-4.png`,
      center: `ui-${dialogTextureTheme}-5.png`,
      right: `ui-${dialogTextureTheme}-6.png`,
      bottomLeft: `ui-${dialogTextureTheme}-7.png`,
      bottom: `ui-${dialogTextureTheme}-8.png`,
      bottomRight: `ui-${dialogTextureTheme}-9.png`
    }

    const tileBaseSize = 16

    const boxPosition = {
      x: tileBaseSize * 4,
      y: tileBaseSize * -1.5
    }

    const boxConfig = {
      x: boxPosition.x + tileBaseSize * 2,
      y: boxPosition.y + tileBaseSize * 2,
      width: tileBaseSize * 37,
      height: tileBaseSize * 2.8
    }

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y,
        boxConfig.width,
        boxConfig.height,
        'gui-tileset',
        tileFrames.center
      )
      .setOrigin(0)

    this.add
      .sprite(boxConfig.x, boxConfig.y, 'gui-tileset', tileFrames.topLeft)
      .setOrigin(1, 1)

    this.add
      .sprite(
        boxConfig.x + boxConfig.width,
        boxConfig.y,
        'gui-tileset',
        tileFrames.topRight
      )
      .setOrigin(0, 1)

    this.add
      .sprite(
        boxConfig.x,
        boxConfig.y + boxConfig.height,
        'gui-tileset',
        tileFrames.bottomLeft
      )
      .setOrigin(1, 0)

    this.add
      .sprite(
        boxConfig.x + boxConfig.width,
        boxConfig.y + boxConfig.height,
        'gui-tileset',
        tileFrames.bottomRight
      )
      .setOrigin(0, 0)

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y,
        boxConfig.width,
        tileBaseSize,
        'gui-tileset',
        tileFrames.top
      )
      .setOrigin(0, 1)

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y,
        tileBaseSize,
        boxConfig.height,
        'gui-tileset',
        tileFrames.left
      )
      .setOrigin(1, 0)

    this.add
      .tileSprite(
        boxConfig.x + boxConfig.width,
        boxConfig.y,
        tileBaseSize,
        boxConfig.height,
        'gui-tileset',
        tileFrames.right
      )
      .setOrigin(0)

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y + boxConfig.height,
        boxConfig.width,
        tileBaseSize,
        'gui-tileset',
        tileFrames.bottom
      )
      .setOrigin(0, 0)

    // Render content
    this.add.bitmapText(
      boxPosition.x + tileBaseSize * 4,
      boxPosition.y + tileBaseSize * 2,
      fonts.pixel,
      'Los triángulos equiláteros son aquellos que tienen todos sus lados \niguales.\nRecolecta todos los triángulos equiláteros'
    )

    this.add
      .sprite(
        boxPosition.x + tileBaseSize * 2.5,
        boxPosition.y + tileBaseSize * 3,
        'objects',
        'equilatero-1.png'
      )
      .setOrigin(0.5)
      .setScale(2)

    // Controls
    const closeButton = this.add.sprite(
      boxPosition.x + tileBaseSize * 38,
      boxPosition.y + tileBaseSize * 4,
      'buttons-tileset',
      'orange-square.png'
    )
    closeButton.setOrigin(0.5).setScale(2).setInteractive().setScrollFactor(0)

    const iconOffset = 4

    const closeButtonIcon = this.add.sprite(
      closeButton.x,
      closeButton.y - iconOffset,
      'gui-tileset',
      'icon-x-mark.png'
    )

    closeButtonIcon.setOrigin(0.5).setScale(2).setScrollFactor(0)

    closeButton.on('pointerdown', () => {
      closeButton.setTexture('buttons-tileset', 'orange-square-pressed.png')
      closeButtonIcon?.setY(closeButton.y)
    })

    closeButton.on('pointerup', () => {
      closeButton.setTexture('buttons-tileset', 'orange-square.png')
      closeButtonIcon.setY(closeButton.y - iconOffset)
      this.handleClickCloseButton()
    })

    closeButton.on('pointerout', () => {
      closeButton.setTexture('buttons-tileset', 'orange-square.png')
      closeButtonIcon.setY(closeButton.y - iconOffset)
    })
  }

  private handleClickCloseButton() {
    this.scene.stop()
  }
}
