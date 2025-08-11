import { fonts } from '@/core/consts'
import type { Scene } from 'phaser'

interface ButtonConfig {
  width?: number
  height?: number
  backgroundColor?: number
  hoverColor?: number
  borderColor?: number
  borderWidth?: number
  text?: string
  textColor?: number
  textSize?: number
  borderRadius?: number
  hoverScale?: number
  animationsEnabled?: boolean
}

export class Button extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Rectangle
  private border!: Phaser.GameObjects.Rectangle
  private buttonText?: Phaser.GameObjects.BitmapText
  private callback?: Function
  private scope?: any
  private hoverTween?: Phaser.Tweens.Tween
  private clickTween?: Phaser.Tweens.Tween

  private readonly defaultConfig: Required<ButtonConfig> = {
    width: 110,
    height: 48,
    backgroundColor: 0xffae0a,
    hoverColor: 0xffc70a,
    borderColor: 0xda5700,
    borderWidth: 3,
    text: '',
    textColor: 0xffffff,
    textSize: 18,
    borderRadius: 18,
    hoverScale: 1.12,
    animationsEnabled: true
  }
  private readonly finalConfig: Required<ButtonConfig>

  constructor(
    scene: Scene,
    x: number,
    y: number,
    config: ButtonConfig = {},
    callback?: Function,
    scope?: any
  ) {
    super(scene, x, y)

    this.finalConfig = {
      ...this.defaultConfig,
      ...config
    }

    this.callback = callback
    this.scope = scope

    this.renderButton(scene)
    this.addInteractions()
  }

  renderButton(scene: Scene) {
    if (
      this.finalConfig.borderWidth > 0 &&
      this.finalConfig.borderRadius === 0
    ) {
      this.border = scene.add.rectangle(
        0,
        0,
        this.finalConfig.width,
        this.finalConfig.height,
        this.finalConfig.borderColor
      )
      this.add(this.border)
    }

    this.background = scene.add.rectangle(
      0,
      0,
      this.finalConfig.width - this.finalConfig.borderWidth * 2,
      this.finalConfig.height - this.finalConfig.borderWidth * 2,
      this.finalConfig.backgroundColor
    )
    this.add(this.background)

    if (this.finalConfig.text) {
      this.buttonText = scene.add
        .bitmapText(0, 0, fonts.pixel, this.finalConfig.text)
        .setOrigin(0.5)
        .setCenterAlign()
        .setScale(2)

      this.add(this.buttonText)
    }

    this.scene.add.existing(this)
    this.setSize(this.finalConfig.width, this.finalConfig.height)
  }

  addInteractions() {
    const interactiveArea = new Phaser.Geom.Rectangle(
      0,
      0,
      this.finalConfig.width,
      this.finalConfig.height
    )

    this.setInteractive(interactiveArea, Phaser.Geom.Rectangle.Contains)

    this.on('pointerover', this.onHover, this)
    this.on('pointerout', this.onOut, this)
    this.on('pointerdown', this.onClick, this)
    this.on('pointerup', this.onPointerUp, this)
  }

  onHover() {
    if (this.clickTween && this.clickTween.isPlaying()) {
      this.clickTween.stop()
    }

    if (this.hoverTween && this.hoverTween.isPlaying()) {
      this.hoverTween.stop()
    }

    this.background.setFillStyle(this.finalConfig.hoverColor)

    if (this.finalConfig.animationsEnabled) {
      this.hoverTween = this.scene.tweens.add({
        targets: this,
        scaleX: this.finalConfig.hoverScale,
        scaleY: this.finalConfig.hoverScale,
        duration: 150,
        ease: 'Power2'
      })
    }
  }

  onOut() {
    if (this.hoverTween && this.hoverTween.isPlaying()) {
      this.hoverTween.stop()
    }
    if (this.clickTween && this.clickTween.isPlaying()) {
      this.clickTween.stop()
    }

    this.background.setFillStyle(this.finalConfig.backgroundColor)

    if (this.finalConfig.animationsEnabled) {
      this.hoverTween = this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      })
    }
  }

  onClick() {
    if (this.hoverTween && this.hoverTween.isPlaying()) {
      this.hoverTween.stop()
    }

    if (this.finalConfig.animationsEnabled) {
      this.clickTween = this.scene.tweens.add({
        targets: this,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 80,
        ease: 'Power1'
      })
    }
  }

  onPointerUp() {
    if (this.clickTween && this.clickTween.isPlaying()) {
      this.clickTween.stop()
    }

    if (this.callback) {
      this.callback.call(this.scope || this)
    }
  }

  public disable() {
    this.setInteractive(false)
    this.setAlpha(0.6)
  }

  public enable() {
    this.setInteractive(true)
    this.setAlpha(1)
  }
}
