export class PointClickScene extends Phaser.Scene {
  constructor() {
    super('PointClickScene')
  }

  create() {
    // Fondo azul claro
    this.cameras.main.setBackgroundColor('#87CEEB')

    // Añadir texto de instrucciones
    this.add
      .text(400, 100, '¡Encuentra 3 estrellas para continuar!', {
        fontSize: '24px',
        color: '#000000'
      })
      .setOrigin(0.5)

    // Contador de estrellas recolectadas
    let starsCollected = 0
    const scoreText = this.add.text(16, 16, 'Estrellas: 0/3', {
      fontSize: '24px',
      color: '#000000'
    })

    // Crear 3 estrellas en posiciones aleatorias
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(100, 700)
      const y = Phaser.Math.Between(200, 500)

      const star = this.add
        .sprite(x, y, 'star')
        .setInteractive({ cursor: 'pointer' })
        .setScale(2)

      // Efecto de hover
      star.on('pointerover', () => {
        star.setTint(0xffff00)
      })

      star.on('pointerout', () => {
        star.clearTint()
      })

      // Click en la estrella
      star.on('pointerdown', () => {
        star.destroy()
        starsCollected++
        scoreText.setText(`Estrellas: ${starsCollected}/3`)

        // Efecto de partículas al recolectar
        this.add.particles(0, 0, 'star', {
          x: x,
          y: y,
          quantity: 1,
          speed: { min: 100, max: 200 },
          scale: { start: 0.5, end: 0 },
          lifespan: 800
        })

        // Cuando se recolectan todas las estrellas
        if (starsCollected === 3) {
          this.time.delayedCall(1000, () => {
            // Texto de completado
            const completedText = this.add
              .text(400, 300, '¡Nivel Completado!', {
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
              //     this.scene.start('AngleScene') // Cambiar a la siguiente escena
              //   })
              // }
            })
          })
        }
      })
    }
  }
}
