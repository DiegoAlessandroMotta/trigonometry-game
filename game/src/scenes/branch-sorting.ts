export class BranchSortingScene extends Phaser.Scene {
  private readonly MIN_DISTANCE = 50
  private placedBranches: Array<{ x: number; y: number }> = []
  private targetZone!: Phaser.GameObjects.Rectangle
  private branchesInZone: number = 0
  private totalAcuteBranches: number = 5

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

    // Título de la escena
    this.add
      .text(400, 50, 'Clasifica las Ramas', {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#000000', 2)

    // Separar las ramas por tipo
    const agudasKeys = [
      'branch1_agudo',
      'branch2_agudo',
      'branch3_agudo',
      'branch4_agudo',
      'branch4_agudo' // Repetido para tener 5 ramas agudas
    ]

    const obtusasKeys = ['branch2_obtuso', 'branch3_obtuso', 'branch4_obtuso']

    // Crear las ramas agudas
    this.createBranches(agudasKeys, 'AGUDA')

    // Crear las ramas obtusas
    this.createBranches(obtusasKeys, 'OBTUSA')

    // Crear zona objetivo
    this.targetZone = this.add.rectangle(650, 450, 300, 250, 0xffffff, 0.2)

    // Agregar borde a la zona objetivo
    const border = this.add.rectangle(650, 450, 300, 250)
    border.setStrokeStyle(2, 0xffffff)

    // Texto indicador de la zona
    this.add
      .text(650, 450, 'Coloca aquí\nlas ramas agudas', {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center'
      })
      .setOrigin(0.5)

    // Instrucciones
    this.add
      .text(400, 550, 'Arrastra las ramas para ordenarlas', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      })
      .setOrigin(0.5)
  }

  private createBranches(keys: string[], type: string) {
    keys.forEach((key) => {
      const position = this.findSafePosition()
      const rotation = Phaser.Math.Between(0, 360)

      // Guardar la posición de esta rama
      this.placedBranches.push(position)

      const branch = this.add
        .image(position.x, position.y, 'branches', key)
        .setScale(0.2)
        .setAngle(rotation)

      // Hacer la rama interactiva
      branch
        .setInteractive({ draggable: true, cursor: 'pointer' })
        .setData('type', type) // Guardar el tipo de rama para uso posterior

      // Eventos de arrastre
      branch.on('dragstart', () => {
        branch.setScale(0.25) // Hacer la rama un poco más grande al arrastrar
      })

      branch.on('drag', (pointer: Phaser.Input.Pointer) => {
        branch.x = pointer.x
        branch.y = pointer.y
      })

      branch.on('dragend', () => {
        branch.setScale(0.2) // Restaurar el tamaño original

        // Verificar si la rama está en la zona objetivo
        this.checkBranchPosition(branch)

        // Actualizar la posición en placedBranches
        const index = this.placedBranches.findIndex(
          (p) => p.x === branch.x && p.y === branch.y
        )
        if (index !== -1) {
          this.placedBranches[index] = { x: branch.x, y: branch.y }
        }
      })

      // Añadir un pequeño indicador del tipo (opcional)
      const dot = this.add.circle(
        position.x,
        position.y - 30,
        5,
        type === 'AGUDA' ? 0x00ff00 : 0xff0000
      )

      // Hacer que el punto indicador siga a la rama
      branch.on('drag', (pointer: Phaser.Input.Pointer) => {
        branch.x = pointer.x
        branch.y = pointer.y
        dot.x = pointer.x
        dot.y = pointer.y - 30
      })
    })
  }

  private checkBranchPosition(branch: Phaser.GameObjects.Image) {
    const branchBounds = branch.getBounds()
    const zoneBounds = this.targetZone.getBounds()

    const wasInZone = branch.getData('inZone') || false
    const isInZone = Phaser.Geom.Rectangle.ContainsRect(
      zoneBounds,
      branchBounds
    )
    const isAcute = branch.getData('type') === 'AGUDA'

    // Actualizar contador solo si es una rama aguda y su estado cambió
    if (isAcute && wasInZone !== isInZone) {
      this.branchesInZone += isInZone ? 1 : -1
      branch.setData('inZone', isInZone)

      // Verificar si todas las ramas agudas están en la zona
      if (this.branchesInZone === this.totalAcuteBranches) {
        this.showCompletionMessage()
      }
    }
  }

  private showCompletionMessage() {
    // Texto de completado con efecto de aparición
    const completedText = this.add
      .text(400, 300, '¡Nivel Completado!', {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#000000',
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
}
