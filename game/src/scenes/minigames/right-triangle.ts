import { Button } from '@/components/button'
import { scenes } from '@/core/consts'

export class RightTriangleScene extends Phaser.Scene {
  private triangle?: Phaser.GameObjects.Graphics
  private questionText?: Phaser.GameObjects.Text
  private answerText?: Phaser.GameObjects.Text
  private scoreText?: Phaser.GameObjects.Text
  private inputText?: Phaser.GameObjects.Text
  private questionCounterText?: Phaser.GameObjects.Text
  private currentTriangle: {
    a: number
    b: number
    c: number
    A: number
    B: number
  } = { a: 0, b: 0, c: 0, A: 0, B: 0 }
  private currentQuestion: string = ''
  private currentAnswer: number = 0
  private score: number = 0
  private questions: Array<{
    triangle: any
    question: string
    answer: number
    type: string
  }> = []
  private currentQuestionIndex: number = 0
  private inputValue: string = ''
  private labelTexts: Phaser.GameObjects.Text[] = []
  private gameOverElements: Phaser.GameObjects.GameObject[] = []
  private feedbackOverlay?: Phaser.GameObjects.Rectangle
  private feedbackText?: Phaser.GameObjects.Text
  private particles: Phaser.GameObjects.GameObject[] = []
  private isTransitioning: boolean = false

  constructor() {
    super('RightTriangleScene')
  }

  init() {
    this.currentTriangle = { a: 0, b: 0, c: 0, A: 0, B: 0 }
    this.currentQuestion = ''
    this.currentAnswer = 0
    this.score = 0
    this.questions = []
    this.currentQuestionIndex = 0
    this.inputValue = ''
    this.isTransitioning = false
  }

  create() {
    this.createBackground()
    this.createUI()
    this.generateQuestions()
    this.showNextQuestion()
  }

  private createBackground() {
    // Fondo degradado animado y oscuro
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x181c2b, 0x2c274d, 0x1a2a3a, 0x23243a, 1) // Gradiente oscuro
    bg.fillRect(0, 0, 768, 432)
    // Partículas de colores vibrantes
    const particleColors = [
      0x43cea2, 0x185a9d, 0xd76d77, 0xffaf7b, 0x00c3ff, 0xff61a6, 0x7f53ac,
      0x00ffb0
    ]
    for (let i = 0; i < 40; i++) {
      const color = Phaser.Utils.Array.GetRandom(particleColors)
      const size = 2 + Math.random() * 4
      const particle = this.add.circle(
        Math.random() * 768,
        Math.random() * 432,
        size,
        color,
        0.7 + Math.random() * 0.3
      )
      // Animación de movimiento y parpadeo
      this.tweens.add({
        targets: particle,
        y: particle.y + Phaser.Math.Between(-40, 40),
        x: particle.x + Phaser.Math.Between(-40, 40),
        alpha: 0.2 + Math.random() * 0.8,
        duration: 3500 + Math.random() * 2500,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 3000,
        ease: 'Sine.easeInOut'
      })
    }
  }

  private createUI() {
    this.add
      .text(384, 20, 'TRIANGULOS RECTANGULOS', {
        fontSize: '24px',
        color: '#00ffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      })
      .setOrigin(0.5)

    // --- MOVER EL TEXTO DEL EJERCICIO ARRIBA ---
    this.questionText = this.add
      .text(384, 55, '', {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      })
      .setOrigin(0.5)

    // Puntuación y pregunta más abajo del texto de ejercicio
    this.scoreText = this.add.text(60, 90, 'PUNTUACION: 0', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    })
    this.questionCounterText = this.add.text(600, 90, '', {
      fontSize: '18px',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    })

    this.add.rectangle(384, 150, 300, 12, 0x222244, 0.7).setOrigin(0.5)
    this.add.rectangle(234, 150, 0, 12, 0x00ffff, 1).setOrigin(0, 0.5)

    this.answerText = this.add
      .text(384, 330, '', {
        fontSize: '16px',
        color: '#ffff00',
        align: 'center',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      })
      .setOrigin(0.5)

    this.inputText = this.add
      .text(384, 300, 'RESPUESTA: ', {
        fontSize: '16px',
        color: '#ffffff',
        align: 'center',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      })
      .setOrigin(0.5)

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C']
    let x = 150
    let y = 350
    let col = 0
    numbers.forEach((num) => {
      new Button(
        this,
        x + col * 70,
        y,
        { text: num, width: 60, height: 40 },
        () => this.handleInput(num),
        this
      )
      col++
      if (col >= 6) {
        col = 0
        y += 50
      }
    })

    new Button(
      this,
      600,
      350,
      { text: 'ENVIAR', width: 120, height: 40 },
      () => this.checkAnswer(),
      this
    )

    new Button(
      this,
      600,
      400,
      { text: 'VOLVER', width: 120, height: 40 },
      () => this.scene.start('MainMenuScene'),
      this
    )
  }

  private handleInput(value: string) {
    if (value === 'C') {
      this.inputValue = ''
    } else {
      this.inputValue += value
    }
    this.inputText?.setText(`RESPUESTA: ${this.inputValue}`)

    this.inputText?.setScale(1.1)
    this.tweens.add({
      targets: this.inputText,
      scale: 1,
      duration: 150
    })
  }

  private generateQuestions() {
    const questionsCount = 5
    this.questions = []
    for (let i = 0; i < questionsCount; i++) {
      const a = Math.floor(Math.random() * 10) + 3
      const b = Math.floor(Math.random() * 10) + 3
      const c = Math.sqrt(a * a + b * b)
      const A = (Math.atan2(a, b) * 180) / Math.PI
      const B = 90 - A
      const triangle = { a, b, c, A, B }
      const questionTypes = [
        {
          type: 'sin',
          question: `Si sen(A) = ${a}/${c.toFixed(
            2
          )}, ¿cuál es el valor de A en grados?`,
          answer: A
        },
        {
          type: 'cos',
          question: `Si cos(A) = ${b}/${c.toFixed(
            2
          )}, ¿cuál es el valor de A en grados?`,
          answer: A
        },
        {
          type: 'tan',
          question: `Si tan(A) = ${a}/${b}, ¿cuál es el valor de A en grados?`,
          answer: A
        },
        {
          type: 'side',
          question: `Si a = ${a} y b = ${b}, ¿cuál es la longitud de la hipotenusa?`,
          answer: Math.round(c * 100) / 100
        },
        {
          type: 'pythagoras',
          question: `Si a = ${a} y c = ${c.toFixed(
            2
          )}, ¿cuál es la longitud del cateto b?`,
          answer: Math.round(b * 100) / 100
        }
      ]
      const selectedType =
        questionTypes[Math.floor(Math.random() * questionTypes.length)]
      this.questions.push({
        triangle,
        question: selectedType.question,
        answer: selectedType.answer,
        type: selectedType.type
      })
    }
  }

  private showNextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showGameOver()
      return
    }

    const question = this.questions[this.currentQuestionIndex]
    this.currentTriangle = question.triangle
    this.currentQuestion = question.question
    this.currentAnswer = question.answer
    this.inputValue = ''

    // Animación de salida del texto de pregunta y respuesta
    this.tweens.add({
      targets: [this.questionText, this.answerText],
      alpha: 0,
      scale: 0.9,
      duration: 200,
      onComplete: () => {
        // Actualizar texto de pregunta y respuesta
        this.questionText?.setText(this.currentQuestion)
        this.answerText?.setText('')
        // Animación de entrada
        this.tweens.add({
          targets: [this.questionText, this.answerText],
          alpha: 1,
          scale: 1,
          duration: 350,
          ease: 'Back.Out'
        })
      }
    })
    this.questionText?.setScale(0.9)
    this.answerText?.setScale(0.9)

    // Dibujar triángulo con entrada animada
    this.drawTriangle()

    // Mostrar contador de preguntas
    this.showQuestionCounter()
  }

  private drawTriangle() {
    const centerX = 384
    const centerY = 220
    const scale = 5
    const labelOffset = 70 // Aún mayor separación para etiquetas
    const angleYOffset = 100 // Más separación vertical para ángulos
    const labelFontSize = '18px'
    const angleFontSize = '18px'

    // Limpiar etiquetas anteriores
    this.labelTexts.forEach((text) => text.destroy())
    this.labelTexts = []

    this.triangle?.destroy()
    this.triangle = this.add.graphics()
    // Animación de entrada
    this.triangle.alpha = 0
    this.triangle.scale = 1
    this.tweens.add({
      targets: this.triangle,
      alpha: 1,
      scale: 1,
      duration: 700,
      ease: 'Back.Out'
    })
    // Triángulo principal
    this.triangle.lineStyle(6, 0x00ffff)
    this.triangle.moveTo(centerX, centerY)
    this.triangle.lineTo(centerX + this.currentTriangle.b * scale, centerY)
    this.triangle.lineTo(
      centerX + this.currentTriangle.b * scale,
      centerY - this.currentTriangle.a * scale
    )
    this.triangle.lineTo(centerX, centerY)
    this.triangle.fillStyle(0x00ffff)
    this.triangle.fillTriangle(
      centerX,
      centerY,
      centerX + this.currentTriangle.b * scale,
      centerY,
      centerX + this.currentTriangle.b * scale,
      centerY - this.currentTriangle.a * scale
    )
    // Ángulo recto
    this.triangle.lineStyle(3, 0xffff00)
    const rectSize = 18
    this.triangle.moveTo(
      centerX + this.currentTriangle.b * scale - rectSize,
      centerY
    )
    this.triangle.lineTo(
      centerX + this.currentTriangle.b * scale - rectSize,
      centerY - rectSize
    )
    this.triangle.lineTo(
      centerX + this.currentTriangle.b * scale,
      centerY - rectSize
    )

    const labelA = this.add
      .text(
        centerX + this.currentTriangle.b * scale + labelOffset,
        centerY - (this.currentTriangle.a * scale) / 2,
        `a = ${this.currentTriangle.a}`,
        {
          fontSize: labelFontSize,
          color: '#ff4444',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 3
        }
      )
      .setOrigin(0.5)
    // Subir la etiqueta b para que no tape la respuesta
    const labelB = this.add
      .text(
        centerX + (this.currentTriangle.b * scale) / 2,
        centerY + labelOffset - 40,
        `b = ${this.currentTriangle.b}`,
        {
          fontSize: labelFontSize,
          color: '#00ffb0',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 3
        }
      )
      .setOrigin(0.5)
    const labelC = this.add
      .text(
        centerX - labelOffset,
        centerY - (this.currentTriangle.a * scale) / 2,
        `c = ${this.currentTriangle.c.toFixed(2)}`,
        {
          fontSize: labelFontSize,
          color: '#4488ff',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 3
        }
      )
      .setOrigin(0.5)

    // Etiquetas de ángulos (más separadas y fuente más pequeña)
    const angleA = this.add
      .text(
        centerX + angleYOffset,
        centerY - angleYOffset,
        `A = ${this.currentTriangle.A.toFixed(1)}°`,
        {
          fontSize: angleFontSize,
          color: '#ffe066',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 2
        }
      )
      .setOrigin(0.5)
    const angleB = this.add
      .text(
        centerX + this.currentTriangle.b * scale - angleYOffset,
        centerY - angleYOffset,
        `B = ${this.currentTriangle.B.toFixed(1)}°`,
        {
          fontSize: angleFontSize,
          color: '#ff61a6',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 2
        }
      )
      .setOrigin(0.5)

    // // Guardar referencias para limpiar después
    this.labelTexts = [labelA, labelB, labelC, angleA, angleB]
    // // Animaciones de aparición y latido
    // this.labelTexts.forEach((text, index) => {
    //   text.alpha = 0
    //   text.setScale(0.7)
    //   this.tweens.add({
    //     targets: text,
    //     alpha: 1,
    //     scale: 1.1,
    //     duration: 400,
    //     delay: 100 + index * 80,
    //     ease: 'Back.Out',
    //     onComplete: () => {
    //       this.tweens.add({
    //         targets: text,
    //         scaleX: 1.08,
    //         scaleY: 1.08,
    //         duration: 900,
    //         yoyo: true,
    //         repeat: -1,
    //         delay: Math.random() * 800
    //       })
    //     }
    //   })
    // })
  }

  private checkAnswer() {
    const userAnswer = parseFloat(this.inputValue)
    if (isNaN(userAnswer)) {
      this.showFeedback('Por favor ingresa un número válido', '#ff0000', false)
      return
    }

    // En checkAnswer, mejorar la comparación para aceptar respuestas como 12 y 12.00 como equivalentes
    const tolerance = 0.1
    const isCorrect =
      Math.abs(userAnswer - this.currentAnswer) <= tolerance ||
      Math.abs(userAnswer - Math.round(this.currentAnswer)) <= tolerance

    if (isCorrect) {
      this.score += 10
      this.showFeedback('¡Correcto! +10 puntos', '#00ff00', true)
      this.createParticleEffect(true)
      this.animateTriangleSuccess()
    } else {
      this.showFeedback(
        `Incorrecto. Respuesta: ${
          typeof this.currentAnswer === 'number'
            ? this.currentAnswer.toFixed(2)
            : this.currentAnswer
        }`,
        '#ff0000',
        false
      )
      this.createParticleEffect(false)
      this.animateTriangleError()
    }

    this.scoreText?.setText(`Puntuación: ${this.score}`)

    // Transición suave a la siguiente pregunta
    this.time.delayedCall(2000, () => {
      this.transitionToNextQuestion()
    })
  }

  private showGameOver() {
    // Limpiar elementos anteriores del game over
    this.gameOverElements.forEach((element) => element.destroy())
    this.gameOverElements = []

    const totalPossible = this.questions.length * 10
    const percentage = (this.score / totalPossible) * 100
    const isVictory = percentage >= 70

    const overlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.8)
    this.gameOverElements.push(overlay)

    const titleText = this.add
      .text(384, 150, isVictory ? '¡VICTORIA!' : '¡DERROTA!', {
        fontSize: '48px',
        color: isVictory ? '#00ff00' : '#ff0000',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      })
      .setOrigin(0.5)
    this.gameOverElements.push(titleText)

    this.tweens.add({
      targets: titleText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })

    const messages = isVictory
      ? [
          '¡Excelente trabajo!',
          '¡Dominas los triángulos rectángulos!',
          '¡Pitágoras estaría orgulloso!',
          '¡Perfecto! ¡Sigue así!'
        ]
      : [
          '¡No te rindas!',
          '¡La práctica hace al maestro!',
          '¡Inténtalo de nuevo!',
          '¡Cada error es una oportunidad de aprender!'
        ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    const messageText = this.add
      .text(384, 200, randomMessage, {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      })
      .setOrigin(0.5)
    this.gameOverElements.push(messageText)

    const scoreText = this.add
      .text(384, 250, `Puntuación: ${this.score}/${totalPossible}`, {
        fontSize: '28px',
        color: isVictory ? '#00ff00' : '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      })
      .setOrigin(0.5)
    this.gameOverElements.push(scoreText)

    const percentageText = this.add
      .text(384, 280, `(${percentage.toFixed(1)}%)`, {
        fontSize: '20px',
        color: isVictory ? '#00ff00' : '#ffaa00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      })
      .setOrigin(0.5)
    this.gameOverElements.push(percentageText)

    const replayButton = new Button(
      this,
      384 - 120,
      350,
      { text: 'Jugar\nde nuevo', width: 160, height: 64 },
      () => {
        this.cleanupAndRestart()
      },
      this
    )
    this.gameOverElements.push(replayButton)

    const menuButton = new Button(
      this,
      384 + 120,
      350,
      { text: 'Menú\nprincipal', width: 160, height: 64 },
      () => this.scene.start(scenes.mainMenu),
      this
    )
    this.gameOverElements.push(menuButton)

    this.tweens.add({
      targets: [titleText, messageText, scoreText, percentageText],
      alpha: 0,
      y: '-=50',
      duration: 0,
      onComplete: () => {
        this.tweens.add({
          targets: [titleText, messageText, scoreText, percentageText],
          alpha: 1,
          y: '+=50',
          duration: 800,
          stagger: 200
        })
      }
    })
  }

  private cleanupAndRestart() {
    // Limpiar todos los elementos del game over
    this.gameOverElements.forEach((element) => element.destroy())
    this.gameOverElements = []

    // Limpiar etiquetas del triángulo
    this.labelTexts.forEach((text) => text.destroy())
    this.labelTexts = []

    // Limpiar triángulo
    this.triangle?.destroy()

    // Reiniciar variables
    this.score = 0
    this.currentQuestionIndex = 0
    this.inputValue = ''

    // Regenerar preguntas y mostrar la primera
    this.generateQuestions()
    this.showNextQuestion()
  }

  private showFeedback(message: string, color: string, isSuccess: boolean) {
    // Limpiar feedback anterior
    this.feedbackOverlay?.destroy()
    this.feedbackText?.destroy()
    // --- DESTELLO EN PANTALLA ---
    const flash = this.add.rectangle(
      384,
      216,
      768,
      432,
      isSuccess ? 0x00ff88 : 0xff0033,
      0.25
    )
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 350,
      onComplete: () => flash.destroy()
    })
    // Crear overlay de feedback
    this.feedbackOverlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.3)
    this.feedbackText = this.add
      .text(384, 216, message, {
        fontSize: '32px',
        color: color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      })
      .setOrigin(0.5)
    // Animación de entrada
    this.feedbackText.setScale(0.5)
    this.tweens.add({
      targets: this.feedbackText,
      scale: 1.2,
      duration: 300,
      ease: 'Back.Out',
      onComplete: () => {
        this.tweens.add({
          targets: this.feedbackText,
          scale: 1,
          duration: 200
        })
      }
    })
    // Auto-destruir después de 2 segundos
    this.time.delayedCall(2000, () => {
      this.feedbackOverlay?.destroy()
      this.feedbackText?.destroy()
    })
  }

  private createParticleEffect(isSuccess: boolean) {
    // Limpiar partículas anteriores
    this.particles.forEach((particle) => particle.destroy())
    this.particles = []
    const centerX = 384
    const centerY = 220
    // --- MÁS COLORES EN PARTÍCULAS ---
    const colors = isSuccess
      ? [0x00ff00, 0x00ffd0, 0x00c3ff, 0x43cea2, 0xffff00]
      : [0xff0000, 0xff61a6, 0xffaf7b, 0xd76d77, 0xff0033]
    for (let i = 0; i < 18; i++) {
      const color = Phaser.Utils.Array.GetRandom(colors)
      const particle = this.add.circle(
        centerX + (Math.random() - 0.5) * 100,
        centerY + (Math.random() - 0.5) * 100,
        2 + Math.random() * 3,
        color
      )
      this.particles.push(particle)
      this.tweens.add({
        targets: particle,
        x: centerX + (Math.random() - 0.5) * 220,
        y: centerY + (Math.random() - 0.5) * 220,
        alpha: 0,
        scale: 0,
        duration: 1000 + Math.random() * 500,
        ease: 'Power2'
      })
    }
  }

  private animateTriangleSuccess() {
    if (!this.triangle) return
    // Efecto de brillo verde
    this.tweens.add({
      targets: this.triangle,
      tint: 0x00ff00,
      duration: 200,
      yoyo: true,
      repeat: 1
    })
    // Efecto de rebote más notorio
    this.tweens.add({
      targets: this.triangle,
      scaleX: 1.18,
      scaleY: 1.18,
      duration: 180,
      yoyo: true,
      repeat: 1,
      ease: 'Back.Out'
    })
  }

  private animateTriangleError() {
    if (!this.triangle) return
    // Efecto de vibración más notorio
    this.tweens.add({
      targets: this.triangle,
      x: '+=10',
      duration: 50,
      yoyo: true,
      repeat: 5
    })
    // Efecto de color rojo
    this.tweens.add({
      targets: this.triangle,
      tint: 0xff0000,
      duration: 200,
      yoyo: true,
      repeat: 1
    })
  }

  private transitionToNextQuestion() {
    if (this.isTransitioning) return
    this.isTransitioning = true

    // Fade out de elementos actuales
    const fadeOutTargets = [this.triangle, ...this.labelTexts].filter(Boolean)

    this.tweens.add({
      targets: fadeOutTargets,
      alpha: 0,
      scale: 0.8,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.currentQuestionIndex++
        this.showNextQuestion()
        this.isTransitioning = false
      }
    })
  }

  private showQuestionCounter() {
    const current = this.currentQuestionIndex + 1
    const total = this.questions.length
    this.questionCounterText?.setText(`PREGUNTA ${current}/${total}`)

    // Animación de entrada
    this.questionCounterText?.setScale(0.8)
    this.tweens.add({
      targets: this.questionCounterText,
      scale: 1,
      duration: 300,
      ease: 'Back.Out'
    })
  }
}
