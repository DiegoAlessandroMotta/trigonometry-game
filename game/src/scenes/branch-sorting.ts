export class BranchSortingScene extends Phaser.Scene {
  private readonly MIN_DISTANCE = 20
  private placedBranches: Array<{ x: number; y: number }> = []
  private targetZone!: Phaser.GameObjects.Rectangle
  private branchesInZone: number = 0
  private totalAcuteBranches: number = 5
  private progressText!: Phaser.GameObjects.Text

  constructor() {
    super('BranchScene')
  }

  private findSafePosition(): { x: number; y: number } {
    let attempts = 0
    const maxAttempts = 50 // Máximo número de intentos para encontrar una posición

    while (attempts < maxAttempts) {
      const x = Phaser.Math.Between(100, 700)
      const y = Phaser.Math.Between(250, 500)

      // Verificar si esta posición está lo suficientemente lejos de todas las ramas existentes
      if (this.isSafePosition(x, y)) {
        return { x, y }
      }

      attempts++
    }

    // Si no encontramos una posición "segura", usar la última generada
    return {
      x: Phaser.Math.Between(100, 700),
      y: Phaser.Math.Between(250, 500)
    }
  }

  private isSafePosition(x: number, y: number): boolean {
    return this.placedBranches.every((branch) => {
      const distance = Phaser.Math.Distance.Between(x, y, branch.x, branch.y)
      return distance >= this.MIN_DISTANCE
    })
  }

  create() {
    // Añadir el fondo
    const bg = this.add.image(400, 300, 'branch-bg')
    bg.setDisplaySize(800, 600)

    // Separar las ramas por tipo
    const agudasKeys = [
      'branch1_agudo',
      'branch2_agudo',
      'branch3_agudo',
      'branch4_agudo',
      'branch4_agudo'
    ]

    const obtusasKeys = ['branch2_obtuso', 'branch3_obtuso', 'branch4_obtuso']

    this.addTargetZone()

    // Crear las ramas agudas
    this.createBranches(agudasKeys, 'AGUDA')

    // Crear las ramas obtusas
    this.createBranches(obtusasKeys, 'OBTUSA')

    // Instrucciones
    this.add
      .text(
        400,
        50,
        'Arrastra las ramas que contienen un ángulo agudo dentro de la caja',
        {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#000000',
          fontFamily: 'medium',
          padding: { x: 10, y: 5 }
        }
      )
      .setOrigin(0.5)

    // Texto de progreso
    this.progressText = this.add
      .text(0, 600, 'Ramas correctas: 0/' + this.totalAcuteBranches, {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
        fontFamily: 'medium'
      })
      .setOrigin(0, 1)
  }

  private createBranches(keys: string[], type: string) {
    keys.forEach((key) => {
      const position = this.findSafePosition()
      const rotation = Phaser.Math.Between(0, 360)

      // Guardar la posición de esta rama
      this.placedBranches.push(position)

      const branch = this.add
        .image(position.x, position.y, 'branches', key)
        .setScale(0.3)
        .setAngle(rotation)

      // Hacer la rama interactiva
      branch
        .setInteractive({ draggable: true, cursor: 'pointer' })
        .setData('type', type) // Guardar el tipo de rama para uso posterior

      // Eventos de arrastre
      branch.on('dragstart', () => {
        branch.setScale(0.35) // Hacer la rama un poco más grande al arrastrar
      })

      branch.on('drag', (pointer: Phaser.Input.Pointer) => {
        branch.x = pointer.x
        branch.y = pointer.y
      })

      branch.on('dragend', () => {
        branch.setScale(0.3) // Restaurar el tamaño original

        // Verificar si la rama está en la zona objetivo
        this.checkBranchPosition(branch)

        // Actualizar la posición en placedBranches
        // const index = this.placedBranches.findIndex(
        //   (p) => p.x === branch.x && p.y === branch.y
        // )
        // if (index !== -1) {
        //   this.placedBranches[index] = { x: branch.x, y: branch.y }
        // }
      })

      this.placedBranches = []
    })
  }

  private checkBranchPosition(branch: Phaser.GameObjects.Image) {
    const branchBounds = branch.getBounds()
    const zoneBounds = this.targetZone.getBounds()

    const isInZone = Phaser.Geom.Rectangle.ContainsRect(
      zoneBounds,
      branchBounds
    )
    const isAcute = branch.getData('type') === 'AGUDA'

    if (!isInZone) {
      branch.clearTint()
    }

    if (isInZone) {
      if (!isAcute) {
        branch.tint = 0xff0000
      }

      if (isAcute) {
        this.branchesInZone += 1
        branch.removeInteractive()

        // Actualizar el texto de progreso
        this.progressText.setText(
          'Ramas correctas: ' +
            this.branchesInZone +
            '/' +
            this.totalAcuteBranches
        )

        // Verificar si todas las ramas agudas están en la zona
        if (this.branchesInZone === this.totalAcuteBranches) {
          this.showCompletionMessage()
        }
      }
    }
  }

  private showCompletionMessage() {
    // Texto de completado con efecto de aparición
    const completedText = this.add
      .text(400, 300, '¡Nivel Completado!', {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold',
        padding: { x: 15, y: 10 }
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // Animación del texto
    this.tweens.add({
      targets: completedText,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    })
  }

  private addTargetZone() {
    const targetConfig = {
      x: 675,
      y: 500,
      width: 250,
      height: 200,
      color: 0xffffff
    }
    // Crear zona objetivo
    this.targetZone = this.add.rectangle(
      targetConfig.x,
      targetConfig.y,
      targetConfig.width,
      targetConfig.height,
      targetConfig.color,
      0.2
    )

    // Agregar borde a la zona objetivo
    const border = this.add.rectangle(
      targetConfig.x,
      targetConfig.y,
      targetConfig.width,
      targetConfig.height
    )
    border.setStrokeStyle(2, 0xffffff)

    // Texto indicador de la zona
    this.add
      .text(targetConfig.x, targetConfig.y, 'Coloca aquí\nlas ramas', {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        fontFamily: 'medium'
      })
      .setOrigin(0.5)
  }
}
