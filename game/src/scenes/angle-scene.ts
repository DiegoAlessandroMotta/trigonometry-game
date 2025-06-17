export class AngleScene extends Phaser.Scene {
  private targetAngles: number[]
  private currentObject: number
  private objects: Phaser.GameObjects.Sprite[]
  private angleTexts: Phaser.GameObjects.Text[]
  private isComplete: boolean

  constructor() {
    super('AngleScene')
    this.targetAngles = [45, 90]
    this.currentObject = 0
    this.objects = []
    this.angleTexts = []
    this.isComplete = false
  }

  create() {
    // Fondo azul claro
    this.cameras.main.setBackgroundColor('#87CEEB')

    // Instrucciones
    this.add
      .text(400, 50, '¡Gira los objetos a los ángulos correctos!', {
        fontSize: '24px',
        color: '#000000'
      })
      .setOrigin(0.5)

    // Crear dos estrellas para rotar
    const positions = [
      { x: 300, y: 300, target: 45 },
      { x: 500, y: 300, target: 90 }
    ]

    positions.forEach((pos, index) => {
      // Crear la estrella
      const obj = this.add
        .sprite(pos.x, pos.y, 'star')
        .setScale(3)
        .setInteractive({ cursor: 'pointer' })
        .setOrigin(0, 1) // Establecer origen en esquina inferior izquierda

      // Línea guía desde la esquina inferior izquierda
      const guide = this.add.graphics()
      guide.lineStyle(2, 0x000000)
      guide.lineBetween(pos.x, pos.y, pos.x + 50, pos.y)

      // Texto que muestra el ángulo actual
      const angleText = this.add
        .text(pos.x, pos.y + 30, '0°', {
          fontSize: '20px',
          color: '#000000'
        })
        .setOrigin(0, 0)

      // Texto del ángulo objetivo
      this.add
        .text(pos.x, pos.y - 100, `Objetivo: ${pos.target}°`, {
          fontSize: '20px',
          color: '#000000'
        })
        .setOrigin(0.5)

      this.objects.push(obj)
      this.angleTexts.push(angleText)

      // Eventos de interacción
      obj.on('pointerdown', () => {
        this.currentObject = index
      })

      // Añadir un punto para visualizar el eje de rotación
      this.add.circle(pos.x, pos.y, 4, 0xff0000)
    })

    // Escuchar eventos del teclado
    this.input.keyboard?.on('keydown-LEFT', () => {
      if (!this.isComplete) {
        this.rotateObject(-5)
      }
    })

    this.input.keyboard?.on('keydown-RIGHT', () => {
      if (!this.isComplete) {
        this.rotateObject(5)
      }
    })

    // Instrucciones de control
    this.add
      .text(400, 500, 'Usa ← y → para rotar el objeto seleccionado', {
        fontSize: '20px',
        color: '#000000'
      })
      .setOrigin(0.5)

    // Texto de objeto seleccionado
    const selectedText = this.add
      .text(400, 550, 'Objeto seleccionado: 1', {
        fontSize: '20px',
        color: '#000000'
      })
      .setOrigin(0.5)

    // Actualizar texto de selección cuando cambia el objeto actual
    this.currentObject = 0
    this.objects[0].setTint(0xffff00)
    this.registry.set('selectedText', selectedText)
  }

  private rotateObject(amount: number) {
    const obj = this.objects[this.currentObject]
    const currentAngle = obj.angle
    const newAngle = currentAngle + amount

    obj.setAngle(newAngle)
    this.angleTexts[this.currentObject].setText(`${Math.round(newAngle)}°`)

    // Verificar si ambos objetos están en los ángulos correctos
    if (this.checkAngles()) {
      this.isComplete = true
      this.showCompletionMessage()
    }
  }

  private checkAngles(): boolean {
    return this.objects.every((obj, index) => {
      const targetAngle = this.targetAngles[index]
      const currentAngle = Math.abs(obj.angle % 360)
      return Math.abs(currentAngle - targetAngle) < 5 // Tolerancia de 5 grados
    })
  }

  private showCompletionMessage() {
    // Texto de completado
    const completedText = this.add
      .text(400, 300, '¡Ángulos Correctos!', {
        fontSize: '32px',
        color: '#000000'
      })
      .setOrigin(0.5)

    // Animación del texto
    this.tweens.add({
      targets: completedText,
      scale: 1.5,
      duration: 500,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          this.scene.start('PointClickScene')
        })
      }
    })
  }

  update() {
    // Actualizar el texto de selección
    const selectedText = this.registry.get(
      'selectedText'
    ) as Phaser.GameObjects.Text
    selectedText.setText(`Objeto seleccionado: ${this.currentObject + 1}`)

    // Actualizar el tinte de los objetos
    this.objects.forEach((obj, index) => {
      if (index === this.currentObject) {
        obj.setTint(0xffff00)
      } else {
        obj.clearTint()
      }
    })
  }
}
