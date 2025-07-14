import { Button } from '@/components/button'

export class MainMenuScene extends Phaser.Scene {
  titleBitmap?: Phaser.GameObjects.BitmapText

  constructor() {
    super('MainMenuScene')
  }

  private createAnimatedBackground() {
    // Fondo degradado
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0a0a2e, 0x1a1a4e, 0x2a2a6e, 0x3a3a8e, 1)
    bg.fillRect(0, 0, 768, 432)
    
    // Partículas matemáticas flotantes
    const symbols = ['sin', 'cos', 'tan', 'π', 'θ', 'α', 'β', '°', 'rad']
    for (let i = 0; i < 20; i++) {
      const symbol = this.add.text(
        Math.random() * 768,
        Math.random() * 432,
        symbols[Math.floor(Math.random() * symbols.length)],
        {
          fontSize: '24px',
          color: '#4444ff',
          fontStyle: 'bold'
        }
      )
      
      this.tweens.add({
        targets: symbol,
        y: symbol.y - 150,
        alpha: 0,
        duration: 5000 + Math.random() * 3000,
        repeat: -1,
        delay: Math.random() * 5000
      })
    }
    
    // Líneas de conexión animadas
    for (let i = 0; i < 8; i++) {
      const line = this.add.graphics()
      line.lineStyle(2, 0x4444ff, 0.3)
      line.moveTo(Math.random() * 768, Math.random() * 432)
      line.lineTo(Math.random() * 768, Math.random() * 432)
      
      this.tweens.add({
        targets: line,
        alpha: 0,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 3000
      })
    }
  }

  create() {
    // Fondo animado
    this.createAnimatedBackground()
    
    // Título principal con efectos
    this.titleBitmap = this.add
      .bitmapText(
        this.cameras.main.width / 2,
        80,
        'raster-forge',
        'Juegos de\nTrigonometría'
      )
      .setOrigin(0.5)
      .setScale(3)
      .setCenterAlign()
      .setTint(0x00ffff)
    
    // Animación del título
    this.tweens.add({
      targets: this.titleBitmap,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1
    })
    
    // Efecto de brillo en el título
    this.tweens.add({
      targets: this.titleBitmap,
      alpha: 0.8,
      duration: 1500,
      yoyo: true,
      repeat: -1
    })

    // Botones para los diferentes mini juegos con efectos
    const buttonConfigs = [
      { text: 'Círculo Unitario', scene: 'UnitCircleScene', color: 0xff4444 },
      { text: 'Triángulos Rectángulos', scene: 'RightTriangleScene', color: 0x44ff44 },
      { text: 'Conversión de Ángulos', scene: 'AngleConverterScene', color: 0x4444ff },
      { text: 'Identidades Trigonométricas', scene: 'TrigIdentitiesScene', color: 0xffaa44 },
      { text: 'Tipos de Triángulos', scene: 'PlatformerScene', color: 0xff44ff }
    ]
    
    buttonConfigs.forEach((config, index) => {
      const button = new Button(
      this,
      this.cameras.main.width / 2,
        180 + index * 50,
      {
          text: config.text,
          width: 220,
          height: 35
      },
        () => this.scene.start(config.scene),
      this
    )

      // Efecto de brillo en los botones
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        delay: index * 200
      })
    })

    // Botón de pantalla completa
    const fullscreenButton = new Button(
      this,
      this.cameras.main.width / 2,
      430,
      {
        text: 'Pantalla\ncompleta',
        width: 120,
        height: 42
      },
      this.onOptionsButtonClick,
      this
    )
    
    // Efecto especial para el botón de pantalla completa
    this.tweens.add({
      targets: fullscreenButton,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
    
    // Botón para volver a la pantalla de inicio
    const backButton = new Button(
      this,
      50, 50,
      {
        text: '← Inicio',
        width: 80,
        height: 30
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

  onOptionsButtonClick() {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen()
    } else {
      this.scale.startFullscreen()
    }
  }
}
