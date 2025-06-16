interface ButtonConfig {
  width?: number
  height?: number
  texture?: string
  backgroundColor?: number
  hoverColor?: number
  borderColor?: number
  borderWidth?: number
  text?: string
  textColor?: number
  textSize?: number
  fontFamily?: string
}

export class Button extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Rectangle
  private border!: Phaser.GameObjects.Rectangle
  private buttonImage?: Phaser.GameObjects.Image
  private buttonText?: Phaser.GameObjects.Text
  private callback?: Function
  private scope?: any
  private readonly defaultConfig: Required<ButtonConfig> = {
    width: 200,
    height: 50,
    texture: '',
    backgroundColor: 0xffae0a,
    hoverColor: 0xffce0a,
    borderColor: 0xda5700,
    borderWidth: 4,
    text: '',
    textColor: 0xffffff,
    textSize: 24,
    fontFamily: 'Arial'
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: ButtonConfig = {},
    callback?: Function,
    scope?: any
  ) {
    super(scene, x, y)

    const finalConfig: Required<ButtonConfig> = {
      ...this.defaultConfig,
      ...config
    }
    this.callback = callback
    this.scope = scope

    // Create border (if specified)
    if (finalConfig.borderWidth > 0) {
      this.border = scene.add.rectangle(
        0,
        0,
        finalConfig.width,
        finalConfig.height,
        finalConfig.borderColor
      )
      this.add(this.border)
    }

    // Create background
    this.background = scene.add.rectangle(
      0,
      0,
      finalConfig.width - finalConfig.borderWidth * 2,
      finalConfig.height - finalConfig.borderWidth * 2,
      finalConfig.backgroundColor
    )
    this.add(this.background)

    // Add texture if provided
    if (finalConfig.texture) {
      this.buttonImage = scene.add.image(0, 0, finalConfig.texture)
      this.buttonImage.setDisplaySize(
        finalConfig.width - finalConfig.borderWidth * 4,
        finalConfig.height - finalConfig.borderWidth * 4
      )
      this.add(this.buttonImage)
    }

    // Add text if provided
    if (finalConfig.text) {
      this.buttonText = scene.add.text(0, 0, finalConfig.text, {
        fontSize: `${finalConfig.textSize}px`,
        fontFamily: finalConfig.fontFamily,
        color: `#${finalConfig.textColor.toString(16).padStart(6, '0')}`
      })
      this.buttonText.setOrigin(0.5)
      this.add(this.buttonText)
    }

    this.scene.add.existing(this)
    this.setSize(finalConfig.width, finalConfig.height)
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, finalConfig.width, finalConfig.height),
      Phaser.Geom.Rectangle.Contains
    )

    this.on('pointerover', this.onHover, this)
    this.on('pointerout', this.onOut, this)
    this.on('pointerdown', this.onClick, this)
  }

  onHover() {
    this.background.setFillStyle(this.defaultConfig.hoverColor)
  }

  onOut() {
    this.background.setFillStyle(this.defaultConfig.backgroundColor)
  }

  onClick() {
    if (this.callback) {
      this.callback.call(this.scope || this)
    }
  }
}
