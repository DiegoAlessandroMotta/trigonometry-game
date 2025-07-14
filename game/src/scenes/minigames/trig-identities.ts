import { Button } from '@/components/button'

export class TrigIdentitiesScene extends Phaser.Scene {
  private questionText?: Phaser.GameObjects.Text
  private answerText?: Phaser.GameObjects.Text
  private scoreText?: Phaser.GameObjects.Text
  private score: number = 0
  private questions: Array<{question: string, options: string[], correct: number, explanation: string}> = []
  private currentQuestionIndex: number = 0

  constructor() {
    super('TrigIdentitiesScene')
  }

  create() {
    this.createBackground()
    this.createUI()
    this.generateQuestions()
    this.showNextQuestion()
  }

  private createBackground() {
    // Fondo degradado con patrón matemático
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0a0a2e, 0x1a1a4e, 0x2a2a6e, 0x3a3a8e, 1)
    bg.fillRect(0, 0, 768, 432)
    
    // Patrón de símbolos matemáticos flotantes
    const symbols = ['sin', 'cos', 'tan', 'π', 'θ', 'α', 'β']
    for (let i = 0; i < 15; i++) {
      const symbol = this.add.text(
        Math.random() * 768,
        Math.random() * 432,
        symbols[Math.floor(Math.random() * symbols.length)],
        {
          fontSize: '20px',
          color: '#4444ff',
          fontStyle: 'bold'
        }
      )
      
      this.tweens.add({
        targets: symbol,
        y: symbol.y - 100,
        alpha: 0,
        duration: 4000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 4000
      })
    }
    
    // Líneas de conexión entre símbolos
    for (let i = 0; i < 10; i++) {
      const line = this.add.graphics()
      line.lineStyle(1, 0x4444ff, 0.2)
      line.moveTo(Math.random() * 768, Math.random() * 432)
      line.lineTo(Math.random() * 768, Math.random() * 432)
    }
  }

  private createUI() {
    // Título con efectos especiales
    this.questionText = this.add.text(384, 80, '', {
      fontSize: '20px',
      color: '#00ffff',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      wordWrap: { width: 700 }
    }).setOrigin(0.5)
    
    // Animación del título
    this.tweens.add({
      targets: this.questionText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1
    })

    this.answerText = this.add.text(384, 350, '', {
      fontSize: '18px',
      color: '#ffff00',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: 700 }
    }).setOrigin(0.5)

    // Puntuación con efectos
    this.scoreText = this.add.text(50, 50, 'Puntuación: 0', {
      fontSize: '18px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    })
    
    // Efecto de brillo en la puntuación
    this.tweens.add({
      targets: this.scoreText,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1
    })

    new Button(
      this,
      384, 420,
      { text: 'Volver', width: 80, height: 30 },
      () => this.scene.start('MainMenuScene'),
      this
    )
  }

  private generateQuestions() {
    this.questions = [
      {
        question: '¿Cuál es la identidad fundamental de la trigonometría?',
        options: [
          'sin²(x) + cos²(x) = 1',
          'sin(x) + cos(x) = 1',
          'sin(x) × cos(x) = 1',
          'sin(x) / cos(x) = 1'
        ],
        correct: 0,
        explanation: 'La identidad fundamental es sin²(x) + cos²(x) = 1'
      },
      {
        question: '¿Cuál es la definición de la tangente?',
        options: [
          'tan(x) = sin(x) + cos(x)',
          'tan(x) = sin(x) × cos(x)',
          'tan(x) = sin(x) / cos(x)',
          'tan(x) = cos(x) / sin(x)'
        ],
        correct: 2,
        explanation: 'La tangente se define como tan(x) = sin(x) / cos(x)'
      },
      {
        question: '¿Cuál es la identidad recíproca del seno?',
        options: [
          'csc(x) = 1 / sin(x)',
          'sec(x) = 1 / sin(x)',
          'cot(x) = 1 / sin(x)',
          'tan(x) = 1 / sin(x)'
        ],
        correct: 0,
        explanation: 'La cosecante es la recíproca del seno: csc(x) = 1 / sin(x)'
      },
      {
        question: '¿Cuál es la identidad recíproca del coseno?',
        options: [
          'csc(x) = 1 / cos(x)',
          'sec(x) = 1 / cos(x)',
          'cot(x) = 1 / cos(x)',
          'tan(x) = 1 / cos(x)'
        ],
        correct: 1,
        explanation: 'La secante es la recíproca del coseno: sec(x) = 1 / cos(x)'
      },
      {
        question: '¿Cuál es la identidad recíproca de la tangente?',
        options: [
          'csc(x) = 1 / tan(x)',
          'sec(x) = 1 / tan(x)',
          'cot(x) = 1 / tan(x)',
          'sin(x) = 1 / tan(x)'
        ],
        correct: 2,
        explanation: 'La cotangente es la recíproca de la tangente: cot(x) = 1 / tan(x)'
      },
      {
        question: '¿Cuál es la identidad pitagórica para la tangente?',
        options: [
          '1 + tan²(x) = sec²(x)',
          '1 + cot²(x) = csc²(x)',
          'tan²(x) + 1 = sec²(x)',
          'cot²(x) + 1 = csc²(x)'
        ],
        correct: 0,
        explanation: 'La identidad es 1 + tan²(x) = sec²(x)'
      },
      {
        question: '¿Cuál es la identidad pitagórica para la cotangente?',
        options: [
          '1 + tan²(x) = sec²(x)',
          '1 + cot²(x) = csc²(x)',
          'tan²(x) + 1 = sec²(x)',
          'cot²(x) + 1 = csc²(x)'
        ],
        correct: 1,
        explanation: 'La identidad es 1 + cot²(x) = csc²(x)'
      },
      {
        question: '¿Cuál es la identidad del ángulo doble para el seno?',
        options: [
          'sin(2x) = 2sin(x)cos(x)',
          'sin(2x) = sin²(x) - cos²(x)',
          'sin(2x) = 2sin(x)',
          'sin(2x) = sin(x) + cos(x)'
        ],
        correct: 0,
        explanation: 'La identidad del ángulo doble es sin(2x) = 2sin(x)cos(x)'
      },
      {
        question: '¿Cuál es la identidad del ángulo doble para el coseno?',
        options: [
          'cos(2x) = 2cos(x)',
          'cos(2x) = cos²(x) - sin²(x)',
          'cos(2x) = 2sin(x)cos(x)',
          'cos(2x) = cos(x) + sin(x)'
        ],
        correct: 1,
        explanation: 'La identidad del ángulo doble es cos(2x) = cos²(x) - sin²(x)'
      },
      {
        question: '¿Cuál es la identidad del ángulo doble para la tangente?',
        options: [
          'tan(2x) = 2tan(x)',
          'tan(2x) = tan²(x)',
          'tan(2x) = 2tan(x) / (1 - tan²(x))',
          'tan(2x) = tan(x) + tan(x)'
        ],
        correct: 2,
        explanation: 'La identidad del ángulo doble es tan(2x) = 2tan(x) / (1 - tan²(x))'
      }
    ]
  }

  private showNextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showGameOver()
      return
    }

    const question = this.questions[this.currentQuestionIndex]
    this.questionText?.setText(question.question)
    this.answerText?.setText('')

    // Crear botones de opciones con efectos
    const buttonColors = [0xff4444, 0x44ff44, 0x4444ff, 0xffaa44]
    question.options.forEach((option, index) => {
      const button = new Button(
        this,
        384, 150 + index * 45,
        { text: option, width: 600, height: 35 },
        () => this.checkAnswer(index),
        this
      )
      
      // Efecto de brillo en los botones
      this.tweens.add({
        targets: button,
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        delay: index * 300
      })
    })
  }

  private checkAnswer(selectedIndex: number) {
    const question = this.questions[this.currentQuestionIndex]
    
    if (selectedIndex === question.correct) {
      this.score += 10
      this.answerText?.setText('¡Correcto! +10 puntos')
      this.answerText?.setColor('#00ff00')
      
      // Efecto de partículas para respuesta correcta
      this.createParticleEffect(384, 216, 0x00ff00)
      
      // Animación de la puntuación
      this.tweens.add({
        targets: this.scoreText,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 300,
        yoyo: true
      })
    } else {
      this.answerText?.setText(`Incorrecto. ${question.explanation}`)
      this.answerText?.setColor('#ff0000')
      
      // Efecto de partículas para respuesta incorrecta
      this.createParticleEffect(384, 216, 0xff0000)
    }

    this.scoreText?.setText(`Puntuación: ${this.score}`)

    this.time.delayedCall(2000, () => {
      this.currentQuestionIndex++
      this.showNextQuestion()
    })
  }

  private createParticleEffect(x: number, y: number, color: number) {
    for (let i = 0; i < 15; i++) {
      const particle = this.add.circle(
        x + (Math.random() - 0.5) * 120,
        y + (Math.random() - 0.5) * 120,
        3,
        color
      )
      
      this.tweens.add({
        targets: particle,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 1200,
        onComplete: () => particle.destroy()
      })
    }
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
    
    // Mensaje motivacional específico para identidades trigonométricas
    const messages = isVictory ? [
      '¡Excelente dominio de identidades!',
      '¡Eres un maestro de la trigonometría!',
      '¡Perfecto conocimiento matemático!',
      '¡Identidades trigonométricas dominadas!'
    ] : [
      '¡Sigue estudiando las identidades!',
      '¡La práctica hace al maestro!',
      '¡Revisa las fórmulas fundamentales!',
      '¡No te rindas con las identidades!'
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
    // Símbolos matemáticos de victoria
    const symbols = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot', '²', 'π']
    for (let i = 0; i < 30; i++) {
      const symbol = this.add.text(
        Math.random() * 768,
        Math.random() * 432,
        symbols[Math.floor(Math.random() * symbols.length)],
        {
          fontSize: '28px',
          color: '#00ff00',
          fontStyle: 'bold'
        }
      )
      
      this.tweens.add({
        targets: symbol,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 2000,
        delay: Math.random() * 1000
      })
    }
    
    // Estrellas doradas
    for (let i = 0; i < 20; i++) {
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