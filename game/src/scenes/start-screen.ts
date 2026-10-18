import { Button } from '@/components/button'
import { createAnimatedBackground } from '@/core/utils'

export class StartScreenScene extends Phaser.Scene {
  private titleText?: Phaser.GameObjects.Text
  private subtitleText?: Phaser.GameObjects.Text

  constructor() {
    super('StartScreenScene')
  }

  create() {
    createAnimatedBackground(this)
    this.createTitle()
    this.createMenuButtons()
  }

  private createTitle() {
    // Título principal con efectos especiales
    this.titleText = this.add
      .text(384, 80, 'TRIGONOMETRÍA', {
        fontSize: '48px',
        color: '#00ffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      })
      .setOrigin(0.5)

    // Animación del título principal
    this.tweens.add({
      targets: this.titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1
    })

    // Efecto de brillo en el título
    this.tweens.add({
      targets: this.titleText,
      alpha: 0.8,
      duration: 1500,
      yoyo: true,
      repeat: -1
    })

    // Subtítulo
    this.subtitleText = this.add
      .text(384, 130, 'Juegos Educativos', {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      })
      .setOrigin(0.5)

    // Animación del subtítulo
    this.tweens.add({
      targets: this.subtitleText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      delay: 500
    })
  }

  private createMenuButtons() {
    const buttonConfigs = [
      {
        text: 'JUGAR',
        action: () => this.scene.start('MainMenuScene'),
        color: 0xff4444,
        icon: '🎮'
      },
      // {
      //   text: 'MANUAL',
      //   action: () => this.showManual(),
      //   color: 0x44ff44,
      //   icon: '📖'
      // },
      {
        text: 'CRÉDITOS',
        action: () => this.showCredits(),
        color: 0x4444ff,
        icon: '👥'
      },
      {
        text: 'PRUEBA',
        action: () => this.showTest(),
        color: 0xffaa44,
        icon: '🧪'
      }
      // {
      //   text: 'SALIR',
      //   action: () => this.exitGame(),
      //   color: 0xff44ff,
      //   icon: '🚪'
      // }
    ]

    buttonConfigs.forEach((config, index) => {
      // Crear contenedor para el botón
      const buttonContainer = this.add.container(384, 200 + index * 50)

      // Fondo del botón con efecto de brillo
      const buttonBg = this.add.rectangle(0, 0, 300, 40, config.color, 0.8)
      buttonContainer.add(buttonBg)

      // Efecto de brillo adicional
      const buttonGlow = this.add.rectangle(0, 0, 310, 50, config.color, 0.3)
      buttonContainer.add(buttonGlow)

      // Icono
      const iconText = this.add
        .text(-120, 0, config.icon, {
          fontSize: '20px'
        })
        .setOrigin(0.5)
      buttonContainer.add(iconText)

      // Texto del botón
      const buttonText = this.add
        .text(0, 0, config.text, {
          fontSize: '18px',
          color: '#ffffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2
        })
        .setOrigin(0.5)
      buttonContainer.add(buttonText)

      // Hacer interactivo
      buttonContainer.setSize(300, 40)
      buttonContainer.setInteractive()

      // Efectos de hover
      buttonContainer.on('pointerover', () => {
        this.tweens.add({
          targets: buttonContainer,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200
        })
        buttonBg.setFillStyle(config.color, 1)
      })

      buttonContainer.on('pointerout', () => {
        this.tweens.add({
          targets: buttonContainer,
          scaleX: 1,
          scaleY: 1,
          duration: 200
        })
        buttonBg.setFillStyle(config.color, 0.8)
      })

      buttonContainer.on('pointerdown', () => {
        this.tweens.add({
          targets: buttonContainer,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            config.action()
          }
        })
      })

      // Animación de entrada escalonada
      buttonContainer.setScale(0)
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 500,
        delay: index * 200
      })

      // Efecto de brillo continuo
      this.tweens.add({
        targets: buttonGlow,
        alpha: 0.1,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        delay: index * 300
      })
    })
  }

  private showManual() {
    // Crear overlay para el manual
    const overlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.9)

    const title = this.add
      .text(384, 30, 'MANUAL DE JUEGO', {
        fontSize: '32px',
        color: '#00ffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      })
      .setOrigin(0.5)

    const content = this.add
      .text(
        384,
        200,
        '🎮 CÍRCULO UNITARIO\n' +
          'Aprende seno, coseno y tangente\n\n' +
          '📐 TRIÁNGULOS RECTÁNGULOS\n' +
          'Practica el teorema de Pitágoras\n\n' +
          '🔄 CONVERSIÓN DE ÁNGULOS\n' +
          'Convierte entre grados y radianes\n\n' +
          '📚 IDENTIDADES TRIGONOMÉTRICAS\n' +
          'Domina las fórmulas fundamentales',
        {
          fontSize: '16px',
          color: '#ffffff',
          align: 'center',
          lineSpacing: 10
        }
      )
      .setOrigin(0.5)

    const backButton = new Button(
      this,
      384,
      380,
      { text: 'Volver', width: 120, height: 35 },
      () => {
        overlay.destroy()
        title.destroy()
        content.destroy()
        backButton.destroy()
      },
      this
    )
  }

  private showCredits() {
    // Crear overlay para los créditos
    const overlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.9)

    const title = this.add
      .text(384, 30, 'CRÉDITOS', {
        fontSize: '32px',
        color: '#00ffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      })
      .setOrigin(0.5)

    const content = this.add
      .text(
        384,
        200,
        // '🎓 DESARROLLADO POR\n' +
        //   'Leandro Pinto\n\n' +
          '🎨 DISEÑO Y PROGRAMACIÓN\n' +
          'Phaser.js + TypeScript\n\n' +
          '📚 CONCEPTOS MATEMÁTICOS\n' +
          'Trigonometría Educativa\n\n' +
          '🎮 MOTOR DE JUEGOS\n' +
          'Phaser 3 Framework',
        {
          fontSize: '16px',
          color: '#ffffff',
          align: 'center',
          lineSpacing: 10
        }
      )
      .setOrigin(0.5)

    const backButton = new Button(
      this,
      384,
      380,
      { text: 'Volver', width: 120, height: 35 },
      () => {
        overlay.destroy()
        title.destroy()
        content.destroy()
        backButton.destroy()
      },
      this
    )
  }

  private showTest() {
    // Crear overlay para la prueba
    const overlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.9)

    const title = this.add
      .text(384, 30, 'MODO PRUEBA', {
        fontSize: '32px',
        color: '#ffaa44',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      })
      .setOrigin(0.5)

    const content = this.add
      .text(
        384,
        200,
        '🧪 FUNCIONALIDADES DE PRUEBA\n\n' +
          '• Prueba todos los mini juegos\n' +
          '• Sin límite de tiempo\n' +
          '• Puntuación ilimitada\n' +
          '• Modo de práctica libre\n\n' +
          '¡Perfecto para aprender!',
        {
          fontSize: '16px',
          color: '#ffffff',
          align: 'center',
          lineSpacing: 10
        }
      )
      .setOrigin(0.5)

    const playButton = new Button(
      this,
      300,
      380,
      { text: 'Jugar\nPrueba', width: 120, height: 64 },
      () => this.scene.start('MainMenuScene'),
      this
    )

    const backButton = new Button(
      this,
      468,
      380,
      { text: 'Volver', width: 120, height: 35 },
      () => {
        overlay.destroy()
        title.destroy()
        content.destroy()
        playButton.destroy()
        backButton.destroy()
      },
      this
    )
  }

  // private exitGame() {
  //   // Crear overlay de confirmación
  //   const overlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.9)

  //   const title = this.add
  //     .text(384, 150, '¿SALIR DEL JUEGO?', {
  //       fontSize: '32px',
  //       color: '#ff4444',
  //       fontStyle: 'bold',
  //       stroke: '#000000',
  //       strokeThickness: 3
  //     })
  //     .setOrigin(0.5)

  //   const message = this.add
  //     .text(384, 200, '¿Estás seguro de que quieres salir?', {
  //       fontSize: '18px',
  //       color: '#ffffff',
  //       align: 'center'
  //     })
  //     .setOrigin(0.5)

  //   const yesButton = new Button(
  //     this,
  //     300,
  //     280,
  //     { text: 'Sí, Salir', width: 100, height: 35 },
  //     () => {
  //       // Cerrar la ventana del navegador
  //       window.close()
  //       // Alternativa: redirigir a una página en blanco
  //       window.location.href = 'about:blank'
  //     },
  //     this
  //   )

  //   const noButton = new Button(
  //     this,
  //     468,
  //     280,
  //     { text: 'No, Cancelar', width: 100, height: 35 },
  //     () => {
  //       overlay.destroy()
  //       title.destroy()
  //       message.destroy()
  //       yesButton.destroy()
  //       noButton.destroy()
  //     },
  //     this
  //   )
  // }
}
