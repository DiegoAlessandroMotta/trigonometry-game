import { Button } from '@/components/button'

export class AngleConverterScene extends Phaser.Scene {
  private angleDisplay?: Phaser.GameObjects.Graphics
  private questionText?: Phaser.GameObjects.Text
  private answerText?: Phaser.GameObjects.Text
  private scoreText?: Phaser.GameObjects.Text
  private inputText?: Phaser.GameObjects.Text
  private currentAngle: number = 0
  private currentQuestion: string = ''
  private currentAnswer: number = 0
  private score: number = 0
  private questions: Array<{angle: number, question: string, answer: number, type: string}> = []
  private currentQuestionIndex: number = 0
  private inputValue: string = ''

  constructor() {
    super('AngleConverterScene')
  }

  create() {
    this.createBackground()
    this.createUI()
    this.generateQuestions()
    this.showNextQuestion()
  }

  private createBackground() {
    // Fondo degradado con patrón circular
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0a0a2e, 0x1a1a4e, 0x2a2a6e, 0x3a3a8e, 1)
    bg.fillRect(0, 0, 768, 432)
    
    // Patrón de círculos concéntricos
    for (let i = 1; i <= 5; i++) {
      const circle = this.add.graphics()
      circle.lineStyle(1, 0x4444ff, 0.1)
      circle.strokeCircle(384, 216, i * 50)
    }
    
    // Partículas que giran
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        384 + Math.cos(i * 0.3) * 100,
        216 + Math.sin(i * 0.3) * 100,
        2,
        0x00ffff
      )
      this.tweens.add({
        targets: particle,
        angle: 360,
        duration: 5000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 2000
      })
    }
  }

  private createUI() {
    this.questionText = this.add.text(384, 50, '', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5)

    this.answerText = this.add.text(384, 350, '', {
      fontSize: '16px',
      color: '#ffff00',
      align: 'center'
    }).setOrigin(0.5)

    this.scoreText = this.add.text(50, 50, 'Puntuación: 0', {
      fontSize: '16px',
      color: '#ffffff'
    })

    this.inputText = this.add.text(384, 320, 'Respuesta: ', {
      fontSize: '16px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5)

    // Botones numéricos
    const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'π']
    let x = 200
    let y = 380
    let col = 0

    numbers.forEach(num => {
      new Button(
        this,
        x + col * 60, y,
        { text: num, width: 50, height: 30 },
        () => this.handleInput(num),
        this
      )
      col++
      if (col >= 4) {
        col = 0
        y += 40
      }
    })

    new Button(
      this,
      500, 380,
      { text: 'Enviar', width: 80, height: 30 },
      () => this.checkAnswer(),
      this
    )

    new Button(
      this,
      500, 420,
      { text: 'Volver', width: 80, height: 30 },
      () => this.scene.start('MainMenuScene'),
      this
    )
  }

  private handleInput(value: string) {
    if (value === 'π') {
      this.inputValue += 'π'
    } else {
      this.inputValue += value
    }
    this.inputText?.setText(`Respuesta: ${this.inputValue}`)
  }

  private generateQuestions() {
    this.questions = []
    
    // Ángulos comunes en grados y radianes
    const commonAngles = [
      { degrees: 0, radians: 0 },
      { degrees: 30, radians: Math.PI / 6 },
      { degrees: 45, radians: Math.PI / 4 },
      { degrees: 60, radians: Math.PI / 3 },
      { degrees: 90, radians: Math.PI / 2 },
      { degrees: 120, radians: 2 * Math.PI / 3 },
      { degrees: 135, radians: 3 * Math.PI / 4 },
      { degrees: 150, radians: 5 * Math.PI / 6 },
      { degrees: 180, radians: Math.PI },
      { degrees: 210, radians: 7 * Math.PI / 6 },
      { degrees: 225, radians: 5 * Math.PI / 4 },
      { degrees: 240, radians: 4 * Math.PI / 3 },
      { degrees: 270, radians: 3 * Math.PI / 2 },
      { degrees: 300, radians: 5 * Math.PI / 3 },
      { degrees: 315, radians: 7 * Math.PI / 4 },
      { degrees: 330, radians: 11 * Math.PI / 6 },
      { degrees: 360, radians: 2 * Math.PI }
    ]

    for (let i = 0; i < 10; i++) {
      const angle = commonAngles[Math.floor(Math.random() * commonAngles.length)]
      const convertToRadians = Math.random() > 0.5
      
      let question = ''
      let answer = 0
      
      if (convertToRadians) {
        question = `Convierte ${angle.degrees}° a radianes`
        answer = angle.radians
      } else {
        question = `Convierte ${this.formatRadians(angle.radians)} radianes a grados`
        answer = angle.degrees
      }
      
      this.questions.push({
        angle: convertToRadians ? angle.degrees : angle.radians,
        question,
        answer,
        type: convertToRadians ? 'toRadians' : 'toDegrees'
      })
    }
  }

  private formatRadians(radians: number): string {
    if (radians === 0) return '0'
    if (radians === Math.PI) return 'π'
    if (radians === Math.PI / 2) return 'π/2'
    if (radians === Math.PI / 3) return 'π/3'
    if (radians === Math.PI / 4) return 'π/4'
    if (radians === Math.PI / 6) return 'π/6'
    if (radians === 2 * Math.PI / 3) return '2π/3'
    if (radians === 3 * Math.PI / 4) return '3π/4'
    if (radians === 5 * Math.PI / 6) return '5π/6'
    if (radians === 7 * Math.PI / 6) return '7π/6'
    if (radians === 5 * Math.PI / 4) return '5π/4'
    if (radians === 4 * Math.PI / 3) return '4π/3'
    if (radians === 3 * Math.PI / 2) return '3π/2'
    if (radians === 5 * Math.PI / 3) return '5π/3'
    if (radians === 7 * Math.PI / 4) return '7π/4'
    if (radians === 11 * Math.PI / 6) return '11π/6'
    if (radians === 2 * Math.PI) return '2π'
    
    return radians.toFixed(2)
  }

  private showNextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showGameOver()
      return
    }

    const question = this.questions[this.currentQuestionIndex]
    this.currentAngle = question.angle
    this.currentQuestion = question.question
    this.currentAnswer = question.answer
    this.inputValue = ''

    this.drawAngle()
    this.questionText?.setText(this.currentQuestion)
    this.answerText?.setText('')
    this.inputText?.setText('Respuesta: ')
  }

  private drawAngle() {
    const centerX = 384
    const centerY = 200
    const radius = 80

    // Limpiar ángulo anterior
    this.angleDisplay?.destroy()

    this.angleDisplay = this.add.graphics()

    // Dibujar círculo con efectos
    this.angleDisplay.lineStyle(4, 0x00ffff, 0.8)
    this.angleDisplay.strokeCircle(centerX, centerY, radius)
    
    // Efecto de brillo adicional
    this.angleDisplay.lineStyle(2, 0xffffff, 0.3)
    this.angleDisplay.strokeCircle(centerX, centerY, radius + 3)

    // Dibujar ejes con gradiente
    this.angleDisplay.lineStyle(2, 0x4444ff, 0.6)
    this.angleDisplay.moveTo(centerX - radius - 30, centerY)
    this.angleDisplay.lineTo(centerX + radius + 30, centerY)
    this.angleDisplay.moveTo(centerX, centerY - radius - 30)
    this.angleDisplay.lineTo(centerX, centerY + radius + 30)

    // Dibujar ángulo con animación
    const angleInRadians = this.currentQuestion.includes('grados') ? 
      this.currentAngle * Math.PI / 180 : this.currentAngle

    this.angleDisplay.lineStyle(3, 0x00ff00, 0.9)
    this.angleDisplay.moveTo(centerX, centerY)
    this.angleDisplay.lineTo(centerX + radius * Math.cos(0), centerY - radius * Math.sin(0))
    this.angleDisplay.lineTo(centerX + radius * Math.cos(angleInRadians), centerY - radius * Math.sin(angleInRadians))

    // Dibujar arco con efectos
    this.angleDisplay.lineStyle(2, 0xff0000, 0.8)
    this.angleDisplay.beginPath()
    this.angleDisplay.arc(centerX, centerY, radius * 0.7, 0, angleInRadians)
    this.angleDisplay.strokePath()

    // Punto en el arco con animación
    const pointX = centerX + radius * 0.7 * Math.cos(angleInRadians)
    const pointY = centerY - radius * 0.7 * Math.sin(angleInRadians)
    
    const point = this.add.circle(pointX, pointY, 4, 0xff0000)
    this.tweens.add({
      targets: point,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })

    // Etiqueta del ángulo con efectos
    const labelAngle = angleInRadians / 2
    const labelRadius = radius * 0.5
    const angleText = this.add.text(
      centerX + labelRadius * Math.cos(labelAngle),
      centerY - labelRadius * Math.sin(labelAngle),
      this.currentQuestion.includes('grados') ? `${this.currentAngle}°` : this.formatRadians(this.currentAngle),
      {
        fontSize: '16px',
        color: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5)
    
    // Animación del texto
    this.tweens.add({
      targets: angleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1500,
      yoyo: true,
      repeat: -1
    })
  }

  private checkAnswer() {
    let userAnswer = 0
    
    if (this.inputValue.includes('π')) {
      // Manejar respuestas con π
      const piValue = this.inputValue.replace('π', '')
      if (piValue === '') {
        userAnswer = Math.PI
      } else if (piValue.includes('/')) {
        const [num, den] = piValue.split('/')
        userAnswer = (parseFloat(num) / parseFloat(den)) * Math.PI
      } else {
        userAnswer = parseFloat(piValue) * Math.PI
      }
    } else {
      userAnswer = parseFloat(this.inputValue)
    }
    
    if (isNaN(userAnswer)) {
      this.answerText?.setText('Por favor ingresa un número válido')
      this.answerText?.setColor('#ff0000')
      return
    }

    const tolerance = 0.01
    if (Math.abs(userAnswer - this.currentAnswer) <= tolerance) {
      this.score += 10
      this.answerText?.setText('¡Correcto! +10 puntos')
      this.answerText?.setColor('#00ff00')
    } else {
      const correctAnswer = this.currentQuestion.includes('grados') ? 
        this.currentAnswer : this.formatRadians(this.currentAnswer)
      this.answerText?.setText(`Incorrecto. Respuesta: ${correctAnswer}`)
      this.answerText?.setColor('#ff0000')
    }

    this.scoreText?.setText(`Puntuación: ${this.score}`)

    this.time.delayedCall(2000, () => {
      this.currentQuestionIndex++
      this.showNextQuestion()
    })
  }

  private showGameOver() {
    const totalPossible = this.questions.length * 10
    const percentage = (this.score / totalPossible) * 100
    
    // Determinar si es victoria o derrota
    const isVictory = percentage >= 70
    
    // Crear overlay de victoria/derrota
    const overlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.8)
    
    // Título principal
    const titleText = this.add.text(384, 150, isVictory ? '¡VICTORIA!' : '¡DERROTA!', {
      fontSize: '48px',
      color: isVictory ? '#00ff00' : '#ff0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)
    
    // Animación del título
    this.tweens.add({
      targets: titleText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
    
    // Mensaje motivacional específico para conversión de ángulos
    const messages = isVictory ? [
      '¡Perfecta conversión!',
      '¡Dominas grados y radianes!',
      '¡Excelente trabajo con π!',
      '¡Conversión matemática perfecta!'
    ] : [
      '¡Sigue practicando!',
      '¡Revisa la relación π = 180°!',
      '¡La conversión mejora con la práctica!',
      '¡No te rindas con los ángulos!'
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    const messageText = this.add.text(384, 200, randomMessage, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    // Puntuación con efectos
    const scoreText = this.add.text(384, 250, `Puntuación: ${this.score}/${totalPossible}`, {
      fontSize: '28px',
      color: isVictory ? '#00ff00' : '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)
    
    // Porcentaje
    const percentageText = this.add.text(384, 280, `(${percentage.toFixed(1)}%)`, {
      fontSize: '20px',
      color: isVictory ? '#00ff00' : '#ffaa00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    // Efectos de partículas según el resultado
    if (isVictory) {
      this.createVictoryParticles()
    } else {
      this.createDefeatParticles()
    }
    
    // Botones
    const buttonY = 350
    const buttonSpacing = 120
    
    new Button(
      this,
      384 - buttonSpacing, buttonY,
      { text: 'Jugar de nuevo', width: 100, height: 35 },
      () => {
        this.score = 0
        this.currentQuestionIndex = 0
        this.generateQuestions()
        this.showNextQuestion()
      },
      this
    )
    
    new Button(
      this,
      384 + buttonSpacing, buttonY,
      { text: 'Menú principal', width: 100, height: 35 },
      () => this.scene.start('MainMenuScene'),
      this
    )
    
    // Animación de entrada
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
  
  private createVictoryParticles() {
    // Símbolos π de victoria
    for (let i = 0; i < 20; i++) {
      const piSymbol = this.add.text(
        Math.random() * 768,
        Math.random() * 432,
        'π',
        {
          fontSize: '30px',
          color: '#00ff00',
          fontStyle: 'bold'
        }
      )
      
      this.tweens.add({
        targets: piSymbol,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 2000,
        delay: Math.random() * 1000
      })
    }
    
    // Grados y radianes flotantes
    const symbols = ['°', 'rad', 'π/2', 'π/4', 'π/6']
    for (let i = 0; i < 25; i++) {
      const symbol = this.add.text(
        Math.random() * 768,
        Math.random() * 432,
        symbols[Math.floor(Math.random() * symbols.length)],
        {
          fontSize: '24px',
          color: '#ffff00',
          fontStyle: 'bold'
        }
      )
      
      this.tweens.add({
        targets: symbol,
        y: symbol.y - 100,
        alpha: 0,
        duration: 1500,
        delay: Math.random() * 1000
      })
    }
  }
  
  private createDefeatParticles() {
    // Partículas de derrota
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Math.random() * 768,
        Math.random() * 432,
        2,
        0xff0000
      )
      
      this.tweens.add({
        targets: particle,
        y: particle.y - 100,
        alpha: 0,
        duration: 1500 + Math.random() * 500,
        delay: Math.random() * 500
      })
    }
  }
} 