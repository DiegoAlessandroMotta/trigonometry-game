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
    const maxAttempts = 50

    while (attempts < maxAttempts) {
      const x = Phaser.Math.Between(100, 700)
      const y = Phaser.Math.Between(250, 500)

      if (this.isSafePosition(x, y)) {
        return { x, y }
      }

      attempts++
    }

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
    const bg = this.add.image(400, 300, 'branch-bg')
    bg.setDisplaySize(800, 600)

    const agudasKeys = [
      'branch1_agudo',
      'branch2_agudo',
      'branch3_agudo',
      'branch4_agudo',
      'branch4_agudo'
    ]

    const obtusasKeys = ['branch2_obtuso', 'branch3_obtuso', 'branch4_obtuso']

    this.addTargetZone()

    this.createBranches(agudasKeys, 'AGUDA')

    this.createBranches(obtusasKeys, 'OBTUSA')

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

      this.placedBranches.push(position)

      const branch = this.add
        .image(position.x, position.y, 'branches', key)
        .setScale(0.3)
        .setAngle(rotation)

      branch
        .setInteractive({ draggable: true, cursor: 'pointer' })
        .setData('type', type)

      branch.on('dragstart', () => {
        branch.setScale(0.35)
      })

      branch.on('drag', (pointer: Phaser.Input.Pointer) => {
        branch.x = pointer.x
        branch.y = pointer.y
      })

      branch.on('dragend', () => {
        branch.setScale(0.3)

        this.checkBranchPosition(branch)
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

        this.progressText.setText(
          'Ramas correctas: ' +
            this.branchesInZone +
            '/' +
            this.totalAcuteBranches
        )

        if (this.branchesInZone === this.totalAcuteBranches) {
          this.showCompletionMessage()
        }
      }
    }
  }

  private showCompletionMessage() {
    const completedText = this.add
      .text(400, 300, '¡Nivel Completado!', {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold',
        padding: { x: 15, y: 10 }
      })
      .setOrigin(0.5)
      .setAlpha(0)

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

    this.targetZone = this.add.rectangle(
      targetConfig.x,
      targetConfig.y,
      targetConfig.width,
      targetConfig.height,
      targetConfig.color,
      0.2
    )

    const border = this.add.rectangle(
      targetConfig.x,
      targetConfig.y,
      targetConfig.width,
      targetConfig.height
    )
    border.setStrokeStyle(2, 0xffffff)

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
