export class StarSortingScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Sprite[] = []
  private boxes: Phaser.GameObjects.Rectangle[] = []
  private isComplete: boolean = false
  private correctPlacements: number = 0
  private totalStars: number = 9 // 3 de cada color

  private readonly COLORS = {
    red: 0xff0000,
    blue: 0x0000ff,
    green: 0x00ff00
  }

  constructor() {
    super('StarSortingScene')
  }

  create() {
    // Fondo azul claro
    this.cameras.main.setBackgroundColor('#87CEEB')

    // Instrucciones
    this.add
      .text(400, 50, '¡Coloca las estrellas en las cajas del mismo color!', {
        fontSize: '24px',
        color: '#000000'
      })
      .setOrigin(0.5)

    // Crear las cajas
    this.createBoxes()

    // Crear las estrellas
    this.createStars()

    // Contador de estrellas correctamente colocadas
    const counterText = this.add
      .text(400, 550, 'Estrellas colocadas: 0/9', {
        fontSize: '20px',
        color: '#000000'
      })
      .setOrigin(0.5)
    this.registry.set('counterText', counterText)
  }

  private createBoxes() {
    const boxPositions = [
      { x: 200, y: 450, color: this.COLORS.red },
      { x: 400, y: 450, color: this.COLORS.blue },
      { x: 600, y: 450, color: this.COLORS.green }
    ]

    boxPositions.forEach(({ x, y, color }) => {
      // Crear la caja
      const box = this.add.rectangle(x, y, 140, 140, color, 0.3)
      this.boxes.push(box)

      // Agregar un borde a la caja
      const border = this.add.rectangle(x, y, 140, 140)
      border.setStrokeStyle(2, color)
    })
  }

  private createStars() {
    const colors = [this.COLORS.red, this.COLORS.blue, this.COLORS.green]

    // Crear 3 estrellas de cada color
    colors.forEach((color) => {
      for (let i = 0; i < 3; i++) {
        // Posición aleatoria en la mitad superior de la pantalla
        const x = Phaser.Math.Between(100, 700)
        const y = Phaser.Math.Between(100, 300)

        const star = this.add.sprite(x, y, 'star').setScale(1.5).setTint(color)

        // Crear un área de interacción más grande (10px extra en cada lado)
        const hitArea = new Phaser.Geom.Rectangle(
          -10,
          -10,
          star.width + 20,
          star.height + 20
        )

        star.setInteractive({
          hitArea: hitArea,
          hitAreaCallback: Phaser.Geom.Rectangle.Contains,
          cursor: 'pointer',
          draggable: true,
          useHandCursor: true // Muestra el cursor de mano al pasar por encima
        })

        // Eventos de arrastre
        star.on('dragstart', () => {
          if (!this.isComplete && !star.getData('locked')) {
            star.setScale(1.8) // Efecto al comenzar a arrastrar
          }
        })

        star.on('drag', (pointer: Phaser.Input.Pointer) => {
          if (!this.isComplete && !star.getData('locked')) {
            star.x = pointer.x
            star.y = pointer.y
          }
        })

        star.on('dragend', () => {
          if (!this.isComplete && !star.getData('locked')) {
            star.setScale(1.5)
            this.checkStarPlacement(star)
          }
        })

        this.stars.push(star)
      }
    })
  }

  private checkStarPlacement(star: Phaser.GameObjects.Sprite) {
    const starColor = star.tintTopLeft
    const starBounds = star.getBounds()

    this.boxes.forEach((box, _) => {
      const boxBounds = box.getBounds()
      const boxColor = box.fillColor

      // Verificar si la estrella está completamente dentro de la caja
      if (Phaser.Geom.Rectangle.ContainsRect(boxBounds, starBounds)) {
        if (starColor === boxColor) {
          // Colocación correcta
          // star.setData('locked', true)
          star.removeInteractive()
          this.correctPlacements++

          // Actualizar contador
          const counterText = this.registry.get(
            'counterText'
          ) as Phaser.GameObjects.Text
          counterText.setText(
            `Estrellas colocadas: ${this.correctPlacements}/9`
          )

          // Verificar si se completó el juego
          if (this.correctPlacements === this.totalStars) {
            this.showCompletionMessage()
          }
        } else {
          // Color incorrecto, rebotar la estrella a su posición original
          this.tweens.add({
            targets: star,
            x: star.getData('originalX') || star.x,
            y: star.getData('originalY') || star.y,
            duration: 200,
            ease: 'Bounce'
          })
        }
      }
    })
  }

  private showCompletionMessage() {
    this.isComplete = true

    // Texto de completado
    const completedText = this.add
      .text(400, 300, '¡Clasificación Completada!', {
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
      repeat: 0
      // onComplete: () => {
      //   this.time.delayedCall(1000, () => {
      //     this.scene.start('CustomPointer')
      //   })
      // }
    })
  }
}
