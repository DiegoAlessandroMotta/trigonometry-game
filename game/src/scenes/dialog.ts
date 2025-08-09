import { customEvents, fonts, scenes } from '@/core/consts'

interface DialogPage {
  title: string
  textContent: string
  illustrations: {
    texture: string
    animationKey?: string
    frame?: string
    width?: number
    height?: number
    scale?: number
  }[]
}

interface DialogProps {
  width: number
  height: number
  pages: DialogPage[]
  initialPage?: number
}

interface Position {
  x: number
  y: number
}

export class DialogScene extends Phaser.Scene {
  private position: Position = { x: 0, y: 0 }
  private width: number
  private height: number
  private pages: DialogPage[]
  private currentPage: number

  private pageContentContainer!: Phaser.GameObjects.Container
  private nextButton!: Phaser.GameObjects.Sprite
  private nextButtonIcon!: Phaser.GameObjects.Sprite
  private prevButton!: Phaser.GameObjects.Sprite
  private prevButtonIcon!: Phaser.GameObjects.Sprite

  private textureTheme = 'green'
  private buttonsTextureTheme = {
    normal: 'blue-square.png',
    pressed: 'blue-square-pressed.png'
  }
  private nextButtonIconTexture = 'icon-arrow-right.png'
  private prevButtonIconTexture = 'icon-arrow-left.png'
  private closeButtonIconTexture = 'icon-x-mark.png'
  private backgroundScale = 2
  private padding = 8
  private iconButtonYOffset = 4

  constructor() {
    super(scenes.dialog)

    this.width = 0
    this.height = 0
    this.pages = []
    this.currentPage = 0
  }

  public init({ width, height, pages, initialPage }: DialogProps) {
    this.width = width ?? 16 * 32
    this.height = height ?? 16 * 8
    this.pages = pages ?? []
    this.currentPage = initialPage ?? 0

    this.position.x = (this.cameras.main.width - this.width) / 2
    this.position.y =
      (this.cameras.main.height - this.height) / 2 - this.backgroundScale * 8
  }

  public create() {
    this.game.events.emit(customEvents.pauseGame)

    this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.7
      )
      .setInteractive()
      .setOrigin(0)

    this.drawDialogBackground()
    this.drawNavigationButtons()

    const dialogInnerX = this.position.x
    const dialogInnerY = this.position.y
    const dialogInnerWidth = this.width
    const dialogInnerHeight = this.height

    this.pageContentContainer = this.add.container(
      dialogInnerX + dialogInnerWidth / 2,
      dialogInnerY + dialogInnerHeight / 2
    )

    this.renderPageContent()
    this.updateNavigationButtons()
  }

  private drawDialogBackground() {
    const dialogTextureTheme = this.textureTheme
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

    const boxConfig = {
      x: this.position.x + tileBaseSize,
      y: this.position.y + tileBaseSize,
      width: this.width,
      height: this.height
    }

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y,
        boxConfig.width / this.backgroundScale,
        boxConfig.height / this.backgroundScale,
        'gui-tileset',
        tileFrames.center
      )
      .setOrigin(0)
      .setScale(this.backgroundScale)

    this.add
      .sprite(boxConfig.x, boxConfig.y, 'gui-tileset', tileFrames.topLeft)
      .setOrigin(1, 1)
      .setScale(this.backgroundScale)

    this.add
      .sprite(
        boxConfig.x + boxConfig.width,
        boxConfig.y,
        'gui-tileset',
        tileFrames.topRight
      )
      .setOrigin(0, 1)
      .setScale(this.backgroundScale)

    this.add
      .sprite(
        boxConfig.x,
        boxConfig.y + boxConfig.height,
        'gui-tileset',
        tileFrames.bottomLeft
      )
      .setOrigin(1, 0)
      .setScale(this.backgroundScale)

    this.add
      .sprite(
        boxConfig.x + boxConfig.width,
        boxConfig.y + boxConfig.height,
        'gui-tileset',
        tileFrames.bottomRight
      )
      .setOrigin(0, 0)
      .setScale(this.backgroundScale)

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y,
        boxConfig.width / this.backgroundScale,
        tileBaseSize,
        'gui-tileset',
        tileFrames.top
      )
      .setOrigin(0, 1)
      .setScale(this.backgroundScale)

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y,
        tileBaseSize,
        boxConfig.height / this.backgroundScale,
        'gui-tileset',
        tileFrames.left
      )
      .setOrigin(1, 0)
      .setScale(this.backgroundScale)

    this.add
      .tileSprite(
        boxConfig.x + boxConfig.width,
        boxConfig.y,
        tileBaseSize,
        boxConfig.height / this.backgroundScale,
        'gui-tileset',
        tileFrames.right
      )
      .setOrigin(0)
      .setScale(this.backgroundScale)

    this.add
      .tileSprite(
        boxConfig.x,
        boxConfig.y + boxConfig.height,
        boxConfig.width / this.backgroundScale,
        tileBaseSize,
        'gui-tileset',
        tileFrames.bottom
      )
      .setOrigin(0, 0)
      .setScale(this.backgroundScale)
  }

  private renderPageContent() {
    this.pageContentContainer.removeAll(true)

    if (this.currentPage >= this.pages.length) {
      console.warn('Attempted to render a page out of bounds.')
      return
    }

    const currentPageData = this.pages[this.currentPage]

    const padding = this.padding
    const contentAreaWidth = this.width - padding * 2
    const contentAreaHeight = this.height - padding * 2

    const contentTopLeftX = -contentAreaWidth / 2
    const contentTopLeftY = -contentAreaHeight / 2

    const titleText = this.add
      .bitmapText(
        contentTopLeftX + padding / 2,
        contentTopLeftY + padding / 2,
        fonts.pixel,
        currentPageData.title
      )
      .setOrigin(0)
      .setScale(2)
    this.pageContentContainer.add(titleText)

    const textContent = this.add
      .bitmapText(
        contentTopLeftX + padding / 2,
        titleText.y + titleText.height + padding / 2,
        fonts.pixel,
        currentPageData.textContent
      )
      .setOrigin(0)
      .setMaxWidth(contentAreaWidth)
    this.pageContentContainer.add(textContent)

    let currentIllustrationY = textContent.y + textContent.height + padding

    currentPageData.illustrations.forEach((illustration) => {
      const illustrationSprite = this.add.image(
        0,
        currentIllustrationY,
        illustration.texture,
        illustration.frame
      )

      illustrationSprite.setOrigin(0.5, 0)

      this.pageContentContainer.add(illustrationSprite)

      if (illustration.scale != null) {
        illustrationSprite.setScale(illustration.scale)
      } else if (illustration.width && illustration.height) {
        illustrationSprite.displayWidth = illustration.width
        illustrationSprite.displayHeight = illustration.height
      } else if (illustration.width) {
        illustrationSprite.displayWidth = illustration.width
        illustrationSprite.scaleY = illustrationSprite.scaleX
      } else if (illustration.height) {
        illustrationSprite.displayHeight = illustration.height
        illustrationSprite.scaleX = illustrationSprite.scaleY
      }

      currentIllustrationY += illustrationSprite.displayHeight + padding / 2
    })

    this.updateNavigationButtons()
  }

  private drawNavigationButtons() {
    const tileBaseSize = 16
    const dialogRightEdge = this.position.x + tileBaseSize + this.width
    const dialogBottomEdge = this.position.y + tileBaseSize + this.height

    this.nextButton = this.add.sprite(
      dialogRightEdge - tileBaseSize / 2,
      dialogBottomEdge - tileBaseSize / 2,
      'buttons-tileset',
      this.buttonsTextureTheme.normal
    )
    this.nextButton
      .setOrigin(0.5)
      .setScale(2)
      .setInteractive()
      .setScrollFactor(0)

    this.nextButtonIcon = this.add.sprite(
      this.nextButton.x,
      this.nextButton.y - this.iconButtonYOffset,
      'gui-tileset',
      this.nextButtonIconTexture
    )
    this.nextButtonIcon.setOrigin(0.5).setScrollFactor(0).setScale(2)

    this.nextButton.on('pointerdown', () => {
      this.nextButton.setTexture(
        'buttons-tileset',
        this.buttonsTextureTheme.pressed
      )
      this.nextButtonIcon.setY(this.nextButton.y)
    })

    this.nextButton.on('pointerup', () => {
      this.nextButton.setTexture(
        'buttons-tileset',
        this.buttonsTextureTheme.normal
      )
      this.nextButtonIcon.setY(this.nextButton.y - this.iconButtonYOffset)
      this.handleNextPage()
    })

    this.nextButton.on('pointerout', () => {
      this.nextButton.setTexture(
        'buttons-tileset',
        this.buttonsTextureTheme.normal
      )
      this.nextButtonIcon.setY(this.nextButton.y - this.iconButtonYOffset)
    })

    this.prevButton = this.add.sprite(
      dialogRightEdge - tileBaseSize * 3,
      dialogBottomEdge - tileBaseSize / 2,
      'buttons-tileset',
      this.buttonsTextureTheme.normal
    )
    this.prevButton
      .setOrigin(0.5)
      .setScale(2)
      .setInteractive()
      .setScrollFactor(0)

    this.prevButtonIcon = this.add.sprite(
      this.prevButton.x,
      this.prevButton.y - this.iconButtonYOffset,
      'gui-tileset',
      this.prevButtonIconTexture
    )
    this.prevButtonIcon.setOrigin(0.5).setScrollFactor(0).setScale(2)

    this.prevButton.on('pointerdown', () => {
      this.prevButton.setTexture(
        'buttons-tileset',
        this.buttonsTextureTheme.pressed
      )
      this.prevButtonIcon.setY(this.prevButton.y)
    })

    this.prevButton.on('pointerup', () => {
      this.prevButton.setTexture(
        'buttons-tileset',
        this.buttonsTextureTheme.normal
      )
      this.prevButtonIcon.setY(this.prevButton.y - this.iconButtonYOffset)
      this.handlePrevPage()
    })

    this.prevButton.on('pointerout', () => {
      this.prevButton.setTexture(
        'buttons-tileset',
        this.buttonsTextureTheme.normal
      )
      this.prevButtonIcon.setY(this.prevButton.y - this.iconButtonYOffset)
    })
  }

  private updateNavigationButtons() {
    if (this.currentPage === 0) {
      this.prevButton.disableInteractive().setAlpha(0.5)
      this.prevButtonIcon.setAlpha(0.5)
    } else {
      this.prevButton.setInteractive().setAlpha(1)
      this.prevButtonIcon.setAlpha(1)
    }

    if (this.currentPage === this.pages.length - 1) {
      this.nextButtonIcon.setTexture('gui-tileset', this.closeButtonIconTexture)
    } else {
      this.nextButtonIcon.setTexture('gui-tileset', this.nextButtonIconTexture)
    }
  }

  private handleNextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++
      this.renderPageContent()
    } else {
      this.handleClickCloseButton()
    }
  }

  private handlePrevPage() {
    if (this.currentPage > 0) {
      this.currentPage--
      this.renderPageContent()
    }
  }

  private handleClickCloseButton() {
    this.game.events.emit(customEvents.pauseGame)
    this.scene.stop()
  }
}
