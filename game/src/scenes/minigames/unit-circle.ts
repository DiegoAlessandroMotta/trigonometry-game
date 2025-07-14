import { Button } from '@/components/button'

export class UnitCircleScene extends Phaser.Scene {
  private circle?: Phaser.GameObjects.Graphics
  private angleLine?: Phaser.GameObjects.Graphics
  private point?: Phaser.GameObjects.Graphics
  private angleText?: Phaser.GameObjects.Text
  private questionText?: Phaser.GameObjects.Text
  private answerText?: Phaser.GameObjects.Text
  private scoreText?: Phaser.GameObjects.Text
  private currentAngle: number = 0
  private currentQuestion: string = ''
  private score: number = 0
  private questions: Array<{angle: number, question: string, answer: number}> = []
  private currentQuestionIndex: number = 0

  constructor() {
    super('UnitCircleScene')
  }

  create() {
    this.createBackground()
    this.createCircle()
    this.createUI()
    this.generateQuestions()
    this.showNextQuestion()
  }

  private createBackground() {
    // Fondo degradado
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0a0a2e, 0x1a1a4e, 0x2a2a6e, 0x3a3a8e, 1)
    bg.fillRect(0, 0, 768, 432)
    
    // Estrellas animadas
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Math.random() * 768,
        Math.random() * 432,
        1,
        0xffffff
      )
      this.tweens.add({
        targets: star,
        alpha: 0,
        duration: 2000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2000
      })
    }
  }

  private createCircle() {
    const centerX = 384
    const centerY = 216
    const radius = 80

    // Dibujar círculo unitario con efecto de brillo
    this.circle = this.add.graphics()
    this.circle.lineStyle(4, 0x00ffff, 0.8)
    this.circle.strokeCircle(centerX, centerY, radius)
    
    // Efecto de brillo adicional
    this.circle.lineStyle(2, 0xffffff, 0.3)
    this.circle.strokeCircle(centerX, centerY, radius + 2)

    // Dibujar ejes con gradiente
    this.circle.lineStyle(2, 0x4444ff, 0.6)
    this.circle.moveTo(centerX - radius - 30, centerY)
    this.circle.lineTo(centerX + radius + 30, centerY)
    this.circle.moveTo(centerX, centerY - radius - 30)
    this.circle.lineTo(centerX, centerY + radius + 30)

    // Dibujar línea del ángulo con animación
    this.angleLine = this.add.graphics()
    this.angleLine.lineStyle(3, 0x00ff00, 0.9)
    this.angleLine.moveTo(centerX, centerY)
    this.angleLine.lineTo(centerX + radius * Math.cos(this.currentAngle), centerY - radius * Math.sin(this.currentAngle))

    // Dibujar punto en el círculo con efecto de partículas
    this.point = this.add.graphics()
    this.point.fillStyle(0xff0000, 0.9)
    this.point.fillCircle(centerX + radius * Math.cos(this.currentAngle), centerY - radius * Math.sin(this.currentAngle), 6)
    
    // Efecto de brillo alrededor del punto
    this.point.fillStyle(0xffff00, 0.3)
    this.point.fillCircle(centerX + radius * Math.cos(this.currentAngle), centerY - radius * Math.sin(this.currentAngle), 12)
    
    // Animación del punto
    this.tweens.add({
      targets: this.point,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
  }

  private createUI() {
    // Título con efecto de brillo
    this.angleText = this.add.text(384, 50, '', {
      fontSize: '28px',
      color: '#00ffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)
    
    // Animación del título
    this.tweens.add({
      targets: this.angleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1500,
      yoyo: true,
      repeat: -1
    })

    this.questionText = this.add.text(384, 320, '', {
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)

    this.answerText = this.add.text(384, 350, '', {
      fontSize: '18px',
      color: '#ffff00',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)

    // Puntuación con efecto de brillo
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
      duration: 1000,
      yoyo: true,
      repeat: -1
    })

    // Botones de respuesta con efectos
    const buttonColors = [0xff4444, 0x44ff44, 0x4444ff, 0xffaa44]
    const buttonTexts = ['Seno', 'Coseno', 'Tangente', 'Volver']
    const buttonActions = [
      () => this.checkAnswer('sin'),
      () => this.checkAnswer('cos'),
      () => this.checkAnswer('tan'),
      () => this.scene.start('MainMenuScene')
    ]
    
    buttonTexts.forEach((text, index) => {
      const button = new Button(
        this,
        200 + index * 100, 380,
        { text: text, width: 80, height: 35 },
        buttonActions[index],
        this
      )
      
      // Efecto de brillo en los botones
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        delay: index * 200
      })
    })
  }

  private generateQuestions() {
    const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
    const functions = ['sin', 'cos', 'tan']
    
    this.questions = []
    for (let i = 0; i < 10; i++) {
      const angle = angles[Math.floor(Math.random() * angles.length)]
      const func = functions[Math.floor(Math.random() * functions.length)]
      let answer = 0
      
      switch (func) {
        case 'sin':
          answer = Math.round(Math.sin(angle * Math.PI / 180) * 100) / 100
          break
        case 'cos':
          answer = Math.round(Math.cos(angle * Math.PI / 180) * 100) / 100
          break
        case 'tan':
          answer = Math.round(Math.tan(angle * Math.PI / 180) * 100) / 100
          break
      }
      
      this.questions.push({
        angle: angle,
        question: `¿Cuál es el valor de ${func}(${angle}°)?`,
        answer: answer
      })
    }
  }

  private showNextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showGameOver()
      return
    }

    const question = this.questions[this.currentQuestionIndex]
    this.currentAngle = question.angle * Math.PI / 180
    this.currentQuestion = question.question

    this.updateCircle()
    this.questionText?.setText(this.currentQuestion)
    this.answerText?.setText('')
  }

  private updateCircle() {
    const centerX = 384
    const centerY = 216
    const radius = 80

    this.angleLine?.clear()
    this.angleLine?.lineStyle(2, 0x00ff00)
    this.angleLine?.moveTo(centerX, centerY)
    this.angleLine?.lineTo(centerX + radius * Math.cos(this.currentAngle), centerY - radius * Math.sin(this.currentAngle))

    this.point?.clear()
    this.point?.fillStyle(0xff0000)
    this.point?.fillCircle(centerX + radius * Math.cos(this.currentAngle), centerY - radius * Math.sin(this.currentAngle), 4)

    this.angleText?.setText(`${Math.round(this.currentAngle * 180 / Math.PI)}°`)
  }

  private checkAnswer(selectedFunction: string) {
    const question = this.questions[this.currentQuestionIndex]
    let correctAnswer = 0
    
    switch (selectedFunction) {
      case 'sin':
        correctAnswer = Math.round(Math.sin(this.currentAngle) * 100) / 100
        break
      case 'cos':
        correctAnswer = Math.round(Math.cos(this.currentAngle) * 100) / 100
        break
      case 'tan':
        correctAnswer = Math.round(Math.tan(this.currentAngle) * 100) / 100
        break
    }

    if (Math.abs(correctAnswer - question.answer) < 0.01) {
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
        duration: 200,
        yoyo: true
      })
    } else {
      this.answerText?.setText(`Incorrecto. Respuesta: ${question.answer}`)
      this.answerText?.setColor('#ff0000')
      
      // Efecto de partículas para respuesta incorrecta
      this.createParticleEffect(384, 216, 0xff0000)
    }

    this.scoreText?.setText(`Puntuación: ${this.score}`)

    this.time.delayedCall(1500, () => {
      this.currentQuestionIndex++
      this.showNextQuestion()
    })
  }

  private createParticleEffect(x: number, y: number, color: number) {
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(
        x + (Math.random() - 0.5) * 100,
        y + (Math.random() - 0.5) * 100,
        2,
        color
      )
      
      this.tweens.add({
        targets: particle,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 1000,
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
    
    // Mensaje motivacional
    const messages = isVictory ? [
      '¡Excelente trabajo!',
      '¡Dominas el círculo unitario!',
      '¡Eres un maestro de la trigonometría!',
      '¡Perfecto! ¡Sigue así!'
    ] : [
      '¡No te rindas!',
      '¡La práctica hace al maestro!',
      '¡Inténtalo de nuevo!',
      '¡Cada error es una oportunidad de aprender!'
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
    // Confeti de victoria
    for (let i = 0; i < 50; i++) {
      const particle = this.add.circle(
        Math.random() * 768,
        Math.random() * 432,
        3,
        0x00ff00
      )
      
      this.tweens.add({
        targets: particle,
        y: particle.y + 200,
        alpha: 0,
        duration: 2000 + Math.random() * 1000,
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
    for (let i = 0; i < 30; i++) {
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