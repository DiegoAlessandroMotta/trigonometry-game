import Phaser from 'phaser'

export class AngleIdentifierScene extends Phaser.Scene {
  private angles = [30, 45, 60, 90, 120, 135, 150, 180]
  private angleLines: Phaser.GameObjects.Line[] = []
  private targetAngle: number = 0
  private score: number = 0
  private scoreText?: Phaser.GameObjects.Text
  private questionText?: Phaser.GameObjects.Text
  private canClick: boolean = true

  constructor() {
    super('AngleIdentifierScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#222')
    const centerX = 400
    const centerY = 300
    const radius = 180

    // Círculo central
    this.add.circle(centerX, centerY, radius, 0xffffff, 0.12)
    this.add.circle(centerX, centerY, 8, 0x00bcd4, 1)

    // Dibuja líneas para cada ángulo notable
    this.angleLines = []
    this.angles.forEach((angle, i) => {
      const rad = Phaser.Math.DegToRad(angle - 90)
      const x2 = centerX + radius * Math.cos(rad)
      const y2 = centerY + radius * Math.sin(rad)
      const color =
        Phaser.Display.Color.HSVColorWheel()[
          Math.floor((i / this.angles.length) * 360)
        ].color
      const line = this.add
        .line(0, 0, centerX, centerY, x2, y2, color, 1)
        .setLineWidth(6)
        .setInteractive()
      line.setData('angle', angle)
      this.angleLines.push(line)
      // Etiqueta del ángulo
      this.add
        .text(x2, y2, `${angle}°`, {
          fontSize: '20px',
          color: '#fff',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 3
        })
        .setOrigin(0.5)
        .setAlpha(0.7)
    })

    // Puntuación
    this.score = 0
    this.scoreText = this.add.text(30, 30, 'Puntos: 0', {
      fontSize: '24px',
      color: '#00ff99',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3
    })

    // Pregunta
    this.questionText = this.add
      .text(centerX, 80, '', {
        fontSize: '28px',
        color: '#00bcd4',
        fontStyle: 'bold',
        stroke: '#fff',
        strokeThickness: 4
      })
      .setOrigin(0.5)

    this.newRound()
  }

  private newRound() {
    this.canClick = true
    // Selecciona un ángulo objetivo aleatorio
    this.targetAngle = Phaser.Utils.Array.GetRandom(this.angles)
    if (this.questionText) {
      this.questionText.setText(`Haz clic en el ángulo de ${this.targetAngle}°`)
    }
    // Asigna eventos de clic
    this.angleLines.forEach((line) => {
      line.removeAllListeners()
      line.on('pointerdown', () => {
        if (!this.canClick) return
        this.canClick = false
        const angle = line.getData('angle')
        if (angle === this.targetAngle) {
          this.handleCorrect(line)
        } else {
          this.handleIncorrect(line)
        }
      })
    })
  }

  private handleCorrect(line: Phaser.GameObjects.Line) {
    // Efecto de brillo
    this.tweens.add({
      targets: line,
      alpha: 0.2,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        line.setAlpha(1)
      }
    })
    // Partículas
    const particles = this.add.particles(0x00ff99)
    particles
      .createEmitter
      //   {
      //   speed: { min: 80, max: 180 },
      //   angle: { min: 0, max: 360 },
      //   lifespan: 500,
      //   quantity: 12,
      //   scale: { start: 0.5, end: 0 },
      //   on: false
      // }
      ()
    particles.emitParticleAt(line.geom.x2, line.geom.y2, 12)
    // Suma puntos
    this.score++
    if (this.scoreText) this.scoreText.setText(`Puntos: ${this.score}`)
    // Mensaje de victoria
    if (this.score >= 7) {
      this.showVictory()
    } else {
      this.time.delayedCall(700, () => this.newRound())
    }
  }

  private handleIncorrect(line: Phaser.GameObjects.Line) {
    // Efecto de vibración
    this.tweens.add({
      targets: line,
      x: '+=10',
      duration: 60,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        line.x = 0
      }
    })
    this.time.delayedCall(400, () => {
      this.canClick = true
    })
  }

  private showVictory() {
    this.add
      .rectangle(400, 300, 500, 200, 0x00ff99, 0.95)
      .setOrigin(0.5)
      .setDepth(100)
    this.add
      .text(
        400,
        300,
        '¡Maestro de los ángulos!\nHas identificado todos los ángulos notables.',
        {
          fontSize: '32px',
          color: '#222',
          fontStyle: 'bold',
          stroke: '#fff',
          strokeThickness: 4,
          align: 'center',
          wordWrap: { width: 480 }
        }
      )
      .setOrigin(0.5)
      .setDepth(101)
    this.time.delayedCall(2500, () => {
      this.scene.restart()
    })
  }
}
