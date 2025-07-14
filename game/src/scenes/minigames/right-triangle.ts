import { Button } from '@/components/button'

export class RightTriangleScene extends Phaser.Scene {
  private triangle?: Phaser.GameObjects.Graphics
  private labels?: Phaser.GameObjects.Graphics
  private questionText?: Phaser.GameObjects.Text
  private answerText?: Phaser.GameObjects.Text
  private scoreText?: Phaser.GameObjects.Text
  private inputText?: Phaser.GameObjects.Text
  private currentTriangle: {a: number, b: number, c: number, A: number, B: number} = {a: 0, b: 0, c: 0, A: 0, B: 0}
  private currentQuestion: string = ''
  private currentAnswer: number = 0
  private score: number = 0
  private questions: Array<{triangle: any, question: string, answer: number, type: string}> = []
  private currentQuestionIndex: number = 0
  private inputValue: string = ''

  constructor() {
    super('RightTriangleScene')
  }

  create() {
    this.createBackground()
    this.createUI()
    this.generateQuestions()
    this.showNextQuestion()
  }

  private createBackground() {
    // Fondo degradado con patrón geométrico
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0a0a2e, 0x1a1a4e, 0x2a2a6e, 0x3a3a8e, 1)
    bg.fillRect(0, 0, 768, 432)
    
    // Patrón de líneas geométricas
    for (let i = 0; i < 20; i++) {
      const line = this.add.graphics()
      line.lineStyle(1, 0x4444ff, 0.1)
      line.moveTo(i * 40, 0)
      line.lineTo(i * 40, 432)
      line.moveTo(0, i * 20)
      line.lineTo(768, i * 20)
    }
    
    // Partículas flotantes
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Math.random() * 768,
        Math.random() * 432,
        1,
        0x00ffff
      )
      this.tweens.add({
        targets: particle,
        y: particle.y - 50,
        alpha: 0,
        duration: 3000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 3000
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
    const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'C']
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
    if (value === 'C') {
      this.inputValue = ''
    } else {
      this.inputValue += value
    }
    this.inputText?.setText(`Respuesta: ${this.inputValue}`)
  }

  private generateQuestions() {
    this.questions = []
    
    // Generar triángulos con lados enteros
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * 10) + 3 // cateto opuesto
      const b = Math.floor(Math.random() * 10) + 3 // cateto adyacente
      const c = Math.sqrt(a * a + b * b) // hipotenusa
      const A = Math.atan2(a, b) * 180 / Math.PI // ángulo A
      const B = 90 - A // ángulo B

      const triangle = { a, b, c, A, B }
      
      // Generar diferentes tipos de preguntas
      const questionTypes = [
        {
          type: 'sin',
          question: `Si sen(A) = ${a}/${c.toFixed(2)}, ¿cuál es el valor de A en grados?`,
          answer: A
        },
        {
          type: 'cos',
          question: `Si cos(A) = ${b}/${c.toFixed(2)}, ¿cuál es el valor de A en grados?`,
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
          question: `Si a = ${a} y c = ${c.toFixed(2)}, ¿cuál es la longitud del cateto b?`,
          answer: Math.round(b * 100) / 100
        }
      ]

      const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
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

    this.drawTriangle()
    this.questionText?.setText(this.currentQuestion)
    this.answerText?.setText('')
    this.inputText?.setText('Respuesta: ')
  }

  private drawTriangle() {
    const centerX = 384
    const centerY = 200
    const scale = 2

    // Limpiar triángulo anterior
    this.triangle?.destroy()
    this.labels?.destroy()

    this.triangle = this.add.graphics()
    this.labels = this.add.graphics()

    // Dibujar triángulo con efectos
    this.triangle.lineStyle(4, 0x00ff00, 0.9)
    this.triangle.moveTo(centerX, centerY)
    this.triangle.lineTo(centerX + this.currentTriangle.b * scale, centerY)
    this.triangle.lineTo(centerX + this.currentTriangle.b * scale, centerY - this.currentTriangle.a * scale)
    this.triangle.lineTo(centerX, centerY)

    // Relleno del triángulo con gradiente
    this.triangle.fillStyle(0x00ff00, 0.1)
    this.triangle.fillTriangle(
      centerX, centerY,
      centerX + this.currentTriangle.b * scale, centerY,
      centerX + this.currentTriangle.b * scale, centerY - this.currentTriangle.a * scale
    )

    // Dibujar ángulo recto con brillo
    this.triangle.lineStyle(2, 0xffff00, 0.8)
    const rectSize = 12
    this.triangle.moveTo(centerX + this.currentTriangle.b * scale - rectSize, centerY)
    this.triangle.lineTo(centerX + this.currentTriangle.b * scale - rectSize, centerY - rectSize)
    this.triangle.lineTo(centerX + this.currentTriangle.b * scale, centerY - rectSize)

    // Etiquetas con efectos
    const labels = [
      { text: `b = ${this.currentTriangle.b}`, x: centerX + this.currentTriangle.b * scale / 2, y: centerY + 25, color: '#44ff44' },
      { text: `a = ${this.currentTriangle.a}`, x: centerX + this.currentTriangle.b * scale + 25, y: centerY - this.currentTriangle.a * scale / 2, color: '#ff4444' },
      { text: `c = ${this.currentTriangle.c.toFixed(2)}`, x: centerX - 25, y: centerY - this.currentTriangle.a * scale / 2, color: '#4444ff' }
    ]

    labels.forEach(label => {
      const text = this.add.text(label.x, label.y, label.text, {
        fontSize: '16px',
        color: label.color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5)
      
      // Animación de las etiquetas
      this.tweens.add({
        targets: text,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1000
      })
    })

    // Etiquetas de ángulos con efectos
    const angleLabels = [
      { text: `A = ${this.currentTriangle.A.toFixed(1)}°`, x: centerX + 25, y: centerY - 25, color: '#ffff00' },
      { text: `B = ${this.currentTriangle.B.toFixed(1)}°`, x: centerX + this.currentTriangle.b * scale - 25, y: centerY - 25, color: '#ffff00' }
    ]

    angleLabels.forEach(label => {
      const text = this.add.text(label.x, label.y, label.text, {
        fontSize: '14px',
        color: label.color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5)
    })
  }

  private checkAnswer() {
    const userAnswer = parseFloat(this.inputValue)
    
    if (isNaN(userAnswer)) {
      this.answerText?.setText('Por favor ingresa un número válido')
      this.answerText?.setColor('#ff0000')
      return
    }

    const tolerance = 0.1
    if (Math.abs(userAnswer - this.currentAnswer) <= tolerance) {
      this.score += 10
      this.answerText?.setText('¡Correcto! +10 puntos')
      this.answerText?.setColor('#00ff00')
    } else {
      this.answerText?.setText(`Incorrecto. Respuesta: ${this.currentAnswer}`)
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
    
    // Mensaje motivacional específico para triángulos
    const messages = isVictory ? [
      '¡Excelente geometría!',
      '¡Dominas los triángulos rectángulos!',
      '¡Pitágoras estaría orgulloso!',
      '¡Perfecto cálculo trigonométrico!'
    ] : [
      '¡Sigue practicando!',
      '¡Los triángulos necesitan más atención!',
      '¡Revisa el teorema de Pitágoras!',
      '¡La trigonometría mejora con la práctica!'
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
    // Triángulos de victoria
    for (let i = 0; i < 30; i++) {
      const triangle = this.add.graphics()
      triangle.fillStyle(0x00ff00, 0.8)
      triangle.fillTriangle(
        Math.random() * 768, Math.random() * 432,
        Math.random() * 768, Math.random() * 432,
        Math.random() * 768, Math.random() * 432
      )
      
      this.tweens.add({
        targets: triangle,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 2000,
        delay: Math.random() * 1000
      })
    }
    
    // Estrellas doradas
    for (let i = 0; i < 25; i++) {
      const star = this.add.circle(
        Math.random() * 768,
        Math.random() * 432,
        4,
        0xffff00
      )
      
      this.tweens.add({
        targets: star,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 1500,
        delay: Math.random() * 1000
      })
    }
  }
  
  private createDefeatParticles() {
    // Partículas de derrota
    for (let i = 0; i < 25; i++) {
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