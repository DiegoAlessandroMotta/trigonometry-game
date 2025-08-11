import { Button } from '@/components/button'
import { fonts, scenes } from '@/core/consts'
import { createAnimatedBackground } from '@/core/utils'

export class MainMenuScene extends Phaser.Scene {
  titleBitmap?: Phaser.GameObjects.BitmapText

  constructor() {
    super(scenes.mainMenu)
  }

  create() {
    createAnimatedBackground(this)

    // Título principal con efectos
    this.titleBitmap = this.add
      .bitmapText(
        this.cameras.main.width / 2,
        50,
        fonts.pixel,
        'Juegos de\ntrigonometría'
      )
      .setOrigin(0.5)
      .setScale(3)
      .setCenterAlign()
    // .setTint(0x00ffff)

    // // Animación del título
    // this.tweens.add({
    //   targets: this.titleBitmap,
    //   scaleX: 1.1,
    //   scaleY: 1.1,
    //   duration: 2000,
    //   yoyo: true,
    //   repeat: -1
    // })

    // // Efecto de brillo en el título
    // this.tweens.add({
    //   targets: this.titleBitmap,
    //   alpha: 0.8,
    //   duration: 1500,
    //   yoyo: true,
    //   repeat: -1
    // })

    // Botones para los diferentes mini juegos con efectos
    const buttonConfigs = [
      { text: 'CIRCULO UNITARIO', scene: 'UnitCircleScene', color: 0xff4444 },
      {
        text: 'TRIANGULOS RECTANGULOS',
        scene: 'RightTriangleScene',
        color: 0x22aa44
      },
      {
        text: 'CONVERSION DE ANGULOS',
        scene: 'AngleConverterScene',
        color: 0x4444ff
      },
      {
        text: 'IDENTIDADES TRIGONOMETRICAS',
        scene: 'TrigIdentitiesScene',
        color: 0xffaa44
      },
      { text: 'Tipos de triángulos', scene: scenes.platformer, color: 0xaa55ff }
    ]

    buttonConfigs.forEach((config, index) => {
      // const button =
      new Button(
        this,
        this.cameras.main.width / 2,
        120 + index * 50,
        {
          text: config.text,
          width: 440,
          height: 44,
          // animationsEnabled: false,
          backgroundColor: config.color,
          hoverColor: config.color
        },
        () => this.scene.start(config.scene),
        this
      )

      // Efecto de brillo en los botones
      // this.tweens.add({
      //   targets: button,
      //   scaleX: 1.05,
      //   scaleY: 1.05,
      //   duration: 1500,
      //   yoyo: true,
      //   repeat: -1,
      //   delay: index * 200
      // })
    })

    // Botón de pantalla completa
    new Button(
      this,
      this.cameras.main.width / 2,
      140 + buttonConfigs.length * 50,
      {
        text: 'Pantalla\nCompleta',
        width: 160,
        height: 52
      },
      this.onFullScreenButtonClick,
      this
    )

    // Botón para volver a la pantalla de inicio
    const backButton = new Button(
      this,
      70,
      25,
      {
        text: 'Inicio',
        width: 120,
        height: 36,
        animationsEnabled: false
      },
      () => this.scene.start('StartScreenScene'),
      this
    )

    // Efecto para el botón de volver
    this.tweens.add({
      targets: backButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1
    })
  }

  onFullScreenButtonClick() {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen()
    } else {
      this.scale.startFullscreen()
    }
  }
}
