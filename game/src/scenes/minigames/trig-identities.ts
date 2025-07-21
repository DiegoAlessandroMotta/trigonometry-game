import { Button } from '@/components/button'

export class TrigIdentitiesScene extends Phaser.Scene {
  private questionText?: Phaser.GameObjects.Text
  private answerText?: Phaser.GameObjects.Text
  private scoreText?: Phaser.GameObjects.Text
  private questionCounterText?: Phaser.GameObjects.Text
  private comboText?: Phaser.GameObjects.Text
  private score: number = 0
  private combo: number = 0
  private maxCombo: number = 0
  private questions: Array<{question: string, options: string[], correct: number, explanation: string}> = []
  private availableQuestions: Array<{question: string, options: string[], correct: number, explanation: string}> = []
  private currentQuestionIndex: number = 0
  private optionButtons: Button[] = []
  private particles: Phaser.GameObjects.GameObject[] = []
  private isTransitioning: boolean = false
  private feedbackOverlay?: Phaser.GameObjects.Rectangle
  private feedbackText?: Phaser.GameObjects.Text
  private gameOverElements: Phaser.GameObjects.GameObject[] = []

  constructor() {
    super('TrigIdentitiesScene')
  }

  create() {
    this.createBackground()
    this.createUI()
    this.generateQuestions()
    this.availableQuestions = [...this.questions] // Inicializar preguntas disponibles
    this.showNextQuestion()
  }

  private createBackground() {
    // Fondo degradado animado y vibrante
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x181c2b, 0x2c274d, 0x1a2a3a, 0x23243a, 1) // Gradiente oscuro
    bg.fillRect(0, 0, 768, 432)
    
    // Partículas de colores vibrantes
    const particleColors = [0x43cea2, 0x185a9d, 0xd76d77, 0xffaf7b, 0x00c3ff, 0xff61a6, 0x7f53ac, 0x00ffb0]
    for (let i = 0; i < 50; i++) {
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
        y: particle.y + Phaser.Math.Between(-50, 50),
        x: particle.x + Phaser.Math.Between(-50, 50),
        alpha: 0.2 + Math.random() * 0.8,
        duration: 4000 + Math.random() * 3000,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 4000,
        ease: 'Sine.easeInOut'
      })
    }
    
    // Símbolos matemáticos flotantes con efectos mejorados
    const symbols = ['sin', 'cos', 'tan', 'π', 'θ', 'α', 'β', '∞', '∑', '∫']
    for (let i = 0; i < 20; i++) {
      const symbol = this.add.text(
        Math.random() * 768,
        Math.random() * 432,
        symbols[Math.floor(Math.random() * symbols.length)],
        {
          fontSize: '18px',
          color: '#00ffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 1
        }
      )
      
      // Animación más compleja
      this.tweens.add({
        targets: symbol,
        y: symbol.y - 150,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 6000 + Math.random() * 3000,
        repeat: -1,
        delay: Math.random() * 6000,
        ease: 'Power2'
      })
    }
    
    // Líneas de conexión animadas
    for (let i = 0; i < 15; i++) {
      const line = this.add.graphics()
      line.lineStyle(2, 0x00ffff, 0.3)
      const x1 = Math.random() * 768
      const y1 = Math.random() * 432
      const x2 = Math.random() * 768
      const y2 = Math.random() * 432
      line.moveTo(x1, y1)
      line.lineTo(x2, y2)
      
      // Animación de las líneas
      this.tweens.add({
        targets: line,
        alpha: 0.1,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 3000
      })
    }
  }

  private createUI() {
    // Título del juego con efectos especiales
    const titleText = this.add.text(384, 25, 'IDENTIDADES TRIGONOMÉTRICAS', {
      fontSize: '24px',
      color: '#00ffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)

    // Animación del título
    this.tweens.add({
      targets: titleText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1
    })

    // Puntuación y estadísticas - arriba del ejercicio
    this.scoreText = this.add.text(60, 50, 'PUNTUACIÓN: 0', {
      fontSize: '16px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    })

    this.questionCounterText = this.add.text(650, 50, 'PREGUNTA 1/10', {
      fontSize: '14px',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    })

    // Pregunta con efectos mejorados - después de la puntuación
    this.questionText = this.add.text(384, 80, '', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: 700 }
    }).setOrigin(0.5)

    this.comboText = this.add.text(384, 110, 'COMBO: 0', {
      fontSize: '16px',
      color: '#ff61a6',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)

    // Barra de progreso
    const progressBarBg = this.add.rectangle(384, 140, 300, 12, 0x222244, 0.7).setOrigin(0.5)
    const progressBarFill = this.add.rectangle(234, 140, 0, 12, 0x00ffff, 1).setOrigin(0, 0.5)

    // Texto de respuesta
    this.answerText = this.add.text(384, 380, '', {
      fontSize: '16px',
      color: '#ffff00',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: 700 }
    }).setOrigin(0.5)

    // Botón volver mejorado
    new Button(
      this,
      384, 410,
      { 
        text: 'VOLVER', 
        width: 100, 
        height: 40,
        backgroundColor: 0x7f53ac,
        hoverColor: 0x9f73cc,
        borderColor: 0x5f33ac
      },
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
    if (this.currentQuestionIndex >= 10) {
      this.showGameOver()
      return
    }

    // Limpiar botones anteriores
    this.optionButtons.forEach(button => button.destroy())
    this.optionButtons = []

    // Seleccionar pregunta aleatoria
    const randomIndex = Math.floor(Math.random() * this.availableQuestions.length)
    const question = this.availableQuestions[randomIndex]
    
    // Remover la pregunta seleccionada para evitar repeticiones
    this.availableQuestions.splice(randomIndex, 1)
    
    // Si se acabaron las preguntas disponibles, repoblar el array
    if (this.availableQuestions.length === 0) {
      this.availableQuestions = [...this.questions]
    }
    
    // Animación de transición de pregunta
    this.tweens.add({
      targets: this.questionText,
      alpha: 0,
      scale: 0.9,
      duration: 200,
      onComplete: () => {
        this.questionText?.setText(question.question)
        this.answerText?.setText('')
        this.tweens.add({
          targets: this.questionText,
          alpha: 1,
          scale: 1,
          duration: 350,
          ease: 'Back.Out'
        })
      }
    })
    this.questionText?.setScale(0.9)

    // Actualizar contador de preguntas
    this.questionCounterText?.setText(`PREGUNTA ${this.currentQuestionIndex + 1}/10`)

    // Crear botones de opciones con efectos mejorados
    const buttonColors = [0xff4444, 0x44ff44, 0x4444ff, 0xffaa44]
    question.options.forEach((option, index) => {
      const button = new Button(
        this,
        384, 180 + index * 50,
        { 
          text: option, 
          width: 600, 
          height: 40,
          backgroundColor: buttonColors[index],
          hoverColor: buttonColors[index] + 0x222222,
          borderColor: buttonColors[index] - 0x222222
        },
        () => this.checkAnswer(index),
        this
      )
      
      this.optionButtons.push(button)
      
      // Animación de entrada escalonada
      button.setScale(0.8)
      button.alpha = 0
      this.tweens.add({
        targets: button,
        scale: 1,
        alpha: 1,
        duration: 400,
        delay: index * 150,
        ease: 'Back.Out'
      })
      
      // Efecto de pulso en los botones
      this.tweens.add({
        targets: button,
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        delay: index * 200
      })
    })
  }

  private checkAnswer(selectedIndex: number) {
    if (this.isTransitioning) return
    this.isTransitioning = true
    
    // Obtener la pregunta actual de las preguntas disponibles
    const question = this.questions.find(q => q.question === this.questionText?.text)
    
    if (selectedIndex === question?.correct) {
      this.score += 10
      this.combo++
      if (this.combo > this.maxCombo) this.maxCombo = this.combo
      
      // Feedback visual de éxito
      this.showFeedback('¡CORRECTO! +10 puntos', '#00ff00', true)
      
      // Efecto de partículas para respuesta correcta
      this.createSuccessParticles()
      
      // Animación de la puntuación y combo
      this.tweens.add({
        targets: [this.scoreText, this.comboText],
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 300,
        yoyo: true
      })
      
      // Destello verde
      const flash = this.add.rectangle(384, 216, 768, 432, 0x00ff88, 0.25)
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 350,
        onComplete: () => flash.destroy()
      })
    } else {
      this.combo = 0
      
      // Feedback visual de error
      this.showFeedback(`Incorrecto. ${question?.explanation}`, '#ff0000', false)
      
      // Efecto de partículas para respuesta incorrecta
      this.createErrorParticles()
      
      // Destello rojo
      const flash = this.add.rectangle(384, 216, 768, 432, 0xff0033, 0.25)
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 350,
        onComplete: () => flash.destroy()
      })
    }

    this.scoreText?.setText(`PUNTUACIÓN: ${this.score}`)
    this.comboText?.setText(`COMBO: ${this.combo}`)

    // Animación de los botones
    this.optionButtons.forEach((button, index) => {
      const isCorrect = index === question?.correct
      const isSelected = index === selectedIndex
      
      if (isCorrect) {
        // Botón correcto - brillo verde
        this.tweens.add({
          targets: button,
          tint: 0x00ff00,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          yoyo: true,
          repeat: 1
        })
      } else if (isSelected) {
        // Botón incorrecto seleccionado - brillo rojo
        this.tweens.add({
          targets: button,
          tint: 0xff0000,
          scaleX: 0.9,
          scaleY: 0.9,
          duration: 200,
          yoyo: true,
          repeat: 1
        })
      }
    })

    this.time.delayedCall(2000, () => {
      this.currentQuestionIndex++
      this.isTransitioning = false
      this.showNextQuestion()
    })
  }

  private showFeedback(message: string, color: string, isSuccess: boolean) {
    // Overlay de feedback
    this.feedbackOverlay = this.add.rectangle(384, 216, 768, 432, 0x000000, 0.3)
    this.feedbackText = this.add.text(384, 216, message, {
      fontSize: '24px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)
    
    // Animación de entrada
    this.feedbackText.setScale(0.5)
    this.tweens.add({
      targets: this.feedbackText,
      scale: 1,
      duration: 300,
      ease: 'Back.Out'
    })
    
    // Limpiar después de 1.5 segundos
    this.time.delayedCall(1500, () => {
      this.feedbackOverlay?.destroy()
      this.feedbackText?.destroy()
    })
  }

  private createSuccessParticles() {
    const centerX = 384
    const centerY = 216
    const colors = [0x00ff00, 0x00ffd0, 0x00c3ff, 0x43cea2, 0xffff00]
    
    for (let i = 0; i < 20; i++) {
      const color = Phaser.Utils.Array.GetRandom(colors)
      const particle = this.add.circle(
        centerX + (Math.random() - 0.5) * 100,
        centerY + (Math.random() - 0.5) * 100,
        2 + Math.random() * 3,
        color
      )
      
      this.tweens.add({
        targets: particle,
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
        alpha: 0,
        scale: 0,
        duration: 1000 + Math.random() * 500,
        ease: 'Power2'
      })
    }
  }

  private createErrorParticles() {
    const centerX = 384
    const centerY = 216
    const colors = [0xff0000, 0xff61a6, 0xffaf7b, 0xd76d77, 0xff0033]
    
    for (let i = 0; i < 15; i++) {
      const color = Phaser.Utils.Array.GetRandom(colors)
      const particle = this.add.circle(
        centerX + (Math.random() - 0.5) * 80,
        centerY + (Math.random() - 0.5) * 80,
        2 + Math.random() * 3,
        color
      )
      
      this.tweens.add({
        targets: particle,
        x: centerX + (Math.random() - 0.5) * 160,
        y: centerY + (Math.random() - 0.5) * 160,
        alpha: 0,
        scale: 0,
        duration: 800 + Math.random() * 400,
        ease: 'Power2'
      })
    }
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
    this.gameOverElements.push(overlay)
    
    // Título principal
    const titleText = this.add.text(384, 150, isVictory ? '¡VICTORIA!' : '¡DERROTA!', {
      fontSize: '48px',
      color: isVictory ? '#00ff00' : '#ff0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)
    this.gameOverElements.push(titleText)
    
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
    this.gameOverElements.push(messageText)
    
    // Puntuación con efectos
    const scoreText = this.add.text(384, 250, `Puntuación: ${this.score}/${totalPossible}`, {
      fontSize: '28px',
      color: isVictory ? '#00ff00' : '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)
    this.gameOverElements.push(scoreText)
    
    // Porcentaje
    const percentageText = this.add.text(384, 280, `(${percentage.toFixed(1)}%)`, {
      fontSize: '20px',
      color: isVictory ? '#00ff00' : '#ffaa00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)
    this.gameOverElements.push(percentageText)
    
    // Efectos de partículas según el resultado
    if (isVictory) {
      this.createVictoryParticles()
    } else {
      this.createDefeatParticles()
    }
    
    // Botones
    const buttonY = 350
    const buttonSpacing = 120
    
    const playAgainButton = new Button(
      this,
      384 - buttonSpacing, buttonY,
      { text: 'Jugar de nuevo', width: 100, height: 35 },
      () => this.restartGame(),
      this
    )
    this.gameOverElements.push(playAgainButton)
    
    const menuButton = new Button(
      this,
      384 + buttonSpacing, buttonY,
      { text: 'Menú principal', width: 100, height: 35 },
      () => this.scene.start('MainMenuScene'),
      this
    )
    this.gameOverElements.push(menuButton)
    
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

  private restartGame() {
    // Limpiar elementos del game over
    this.gameOverElements.forEach(element => {
      if (element && element.destroy) {
        element.destroy()
      }
    })
    this.gameOverElements = []
    
    // Limpiar botones de opciones
    this.optionButtons.forEach(button => button.destroy())
    this.optionButtons = []
    
    // Limpiar partículas
    this.particles.forEach(particle => {
      if (particle && particle.destroy) {
        particle.destroy()
      }
    })
    this.particles = []
    
    // Limpiar feedback
    this.feedbackOverlay?.destroy()
    this.feedbackText?.destroy()
    
    // Reiniciar variables del juego
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.currentQuestionIndex = 0
    this.isTransitioning = false
    
    // Actualizar UI
    this.scoreText?.setText('PUNTUACIÓN: 0')
    this.comboText?.setText('COMBO: 0')
    this.questionCounterText?.setText('PREGUNTA 1/10')
    this.answerText?.setText('')
    
    // Generar nuevas preguntas y mostrar la primera
    this.generateQuestions()
    this.availableQuestions = [...this.questions] // Reinicializar preguntas disponibles
    this.showNextQuestion()
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