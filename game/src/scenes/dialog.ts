import { fonts, scenes } from '@/core/consts'

export class DialogScene extends Phaser.Scene {
  constructor() {
    super(scenes.dialog)
  }

  public create() {
    this.drawDialog()
  }

  private drawDialog() {
    const tileFrames = {
      topLeft: 'tile-36.png',
      top: 'tile-37.png',
      topRight: 'tile-38.png',
      left: 'tile-49.png',
      center: 'tile-50.png',
      right: 'tile-51.png',
      bottomLeft: 'tile-59.png',
      bottom: 'tile-60.png',
      bottomRight: 'tile-61.png'
    }

    const blockSize = 16

    const boxPosition = {
      x: blockSize * 4,
      y: blockSize * -1.5
    }

    this.add
      .sprite(boxPosition.x, boxPosition.y, 'gui-tileset', tileFrames.topLeft)
      .setOrigin(0)
      .setScale(2)

    this.add
      .tileSprite(
        boxPosition.x + blockSize * 2,
        boxPosition.y,
        this.cameras.main.width / 2 - blockSize * 6,
        blockSize,
        'gui-tileset',
        tileFrames.top
      )
      .setOrigin(0)
      .setScale(2)

    this.add
      .sprite(
        boxPosition.x + blockSize * 38,
        boxPosition.y,
        'gui-tileset',
        tileFrames.topRight
      )
      .setOrigin(0)
      .setScale(2)

    this.add
      .tileSprite(
        boxPosition.x,
        boxPosition.y + blockSize * 2,
        blockSize,
        blockSize,
        'gui-tileset',
        tileFrames.left
      )
      .setOrigin(0)
      .setScale(2)

    this.add
      .tileSprite(
        boxPosition.x + blockSize * 2,
        boxPosition.y + blockSize * 2,
        this.cameras.main.width / 2 - 16 * 6,
        16,
        'gui-tileset',
        tileFrames.center
      )
      .setOrigin(0)
      .setScale(2)

    this.add
      .tileSprite(
        boxPosition.x + blockSize * 38,
        boxPosition.y + blockSize * 2,
        blockSize,
        blockSize,
        'gui-tileset',
        tileFrames.right
      )
      .setOrigin(0)
      .setScale(2)

    this.add
      .tileSprite(
        boxPosition.x,
        boxPosition.y + blockSize * 4,
        blockSize,
        blockSize,
        'gui-tileset',
        tileFrames.bottomLeft
      )
      .setOrigin(0)
      .setScale(2)

    this.add
      .tileSprite(
        boxPosition.x + blockSize * 2,
        boxPosition.y + blockSize * 4,
        this.cameras.main.width / 2 - 16 * 6,
        16,
        'gui-tileset',
        tileFrames.bottom
      )
      .setOrigin(0)
      .setScale(2)

    this.add
      .tileSprite(
        boxPosition.x + blockSize * 38,
        boxPosition.y + blockSize * 4,
        blockSize,
        blockSize,
        'gui-tileset',
        tileFrames.bottomRight
      )
      .setOrigin(0)
      .setScale(2)

    // Render content
    this.add.bitmapText(
      boxPosition.x + blockSize * 4,
      boxPosition.y + blockSize * 2,
      fonts.pixel,
      'Los triángulos equiláteros son aquellos que tienen todos sus lados \niguales.\nRecolecta todos los triángulos equiláteros'
    )

    this.add
      .sprite(
        boxPosition.x + blockSize * 2.5,
        boxPosition.y + blockSize * 3,
        'objects',
        'equilatero-1.png'
      )
      .setOrigin(0.5)
      .setScale(2)

    // Controls
    const closeButton = this.add.sprite(
      boxPosition.x + blockSize * 38,
      boxPosition.y + blockSize * 4,
      'buttons-tileset',
      'orange-square.png'
    )
    closeButton.setOrigin(0.5).setScale(2).setInteractive().setScrollFactor(0)

    const iconOffset = 4

    const closeButtonIcon = this.add.sprite(
      closeButton.x,
      closeButton.y - iconOffset,
      'gui-tileset',
      'icon-10.png'
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
