export class BranchScene extends Phaser.Scene {
  constructor() {
    super('BranchScene')
  }

  create() {
    // Añadir el fondo
    const bg = this.add.image(400, 300, 'branch-bg')
    bg.setDisplaySize(800, 600) // Ajustar al tamaño de la pantalla

    // Título de la escena
    this.add
      .text(400, 50, 'Escena de Ramas', {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#000000', 2)

    // Crear las ramas con sus nombres
    const branches = [
      { key: 'branch1_agudo', x: 200, y: 150 },
      { key: 'branch2_agudo', x: 600, y: 150 },
      { key: 'branch2_obtuso', x: 200, y: 250 },
      { key: 'branch3_obtuso', x: 600, y: 250 },
      { key: 'branch3_agudo', x: 200, y: 350 },
      { key: 'branch4_agudo', x: 600, y: 350 },
      { key: 'branch4_obtuso', x: 400, y: 450 }
    ]

    // Añadir cada rama con su etiqueta
    branches.forEach(({ key, x, y }) => {
      // Añadir la rama
      const branch = this.add.image(x, y, 'branches', key)

      // Añadir texto descriptivo
      this.add
        .text(x, y + 40, key, {
          fontSize: '16px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 5, y: 2 }
        })
        .setOrigin(0.5)
    })

    // Instrucciones
    this.add
      .text(400, 550, 'Presiona ESPACIO para continuar', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      })
      .setOrigin(0.5)

    // Evento para pasar a la siguiente escena
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start('StarSortingScene')
    })
  }
}
