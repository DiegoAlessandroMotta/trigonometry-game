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
  borderRadius?: number // nuevo para esquinas redondeadas
}

export class Button extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Rectangle
  private border!: Phaser.GameObjects.Rectangle
  private buttonImage?: Phaser.GameObjects.Image
  private buttonText?: Phaser.GameObjects.BitmapText
  private callback?: Function
  private scope?: any
  private readonly defaultConfig: Required<ButtonConfig> = {
    width: 110, // más grande
    height: 48, // más alto
    texture: '',
    backgroundColor: 0xffae0a, // naranja vibrante
    hoverColor: 0xffd700, // amarillo vibrante
    borderColor: 0xda5700, // borde naranja oscuro
    borderWidth: 3,
    text: '',
    textColor: 0xffffff,
    textSize: 18,
    fontFamily: 'Arial',
    borderRadius: 18 // bordes redondeados por defecto
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

    // --- Sombra visual detrás del botón ---
    const shadow = scene.add.graphics()
    shadow.fillStyle(0x000000, 0.28)
    shadow.fillRoundedRect(-finalConfig.width/2 + 4, -finalConfig.height/2 + 6, finalConfig.width - 8, finalConfig.height - 8, finalConfig.borderRadius)
    this.addAt(shadow, 0)

    // Create border (if specified)
    if (finalConfig.borderWidth > 0 && finalConfig.borderRadius === 0) {
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
      this.buttonText = scene.add
        .bitmapText(0, 0, 'raster-forge', finalConfig.text)
        .setOrigin(0.5)
        .setCenterAlign()
        .setScale(2)

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
    this.setScale(1.13)
    this.scene.tweens.add({
      targets: this,
      alpha: 0.92,
      duration: 120,
      yoyo: true
    })
  }

  onOut() {
    this.background.setFillStyle(this.defaultConfig.backgroundColor)
    this.setScale(1)
    this.setAlpha(1)
  }

  onClick() {
    // Efecto de pulsación
    this.scene.tweens.add({
      targets: this,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      yoyo: true,
      onComplete: () => {
    if (this.callback) {
      this.callback.call(this.scope || this)
    }
      }
    })
  }
}
