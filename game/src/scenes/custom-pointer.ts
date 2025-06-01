export class CustomPointer extends Phaser.Scene {
  constructor() {
    super('Custom Pointer')
  }

  create() {
    const star = this.add.sprite(400, 300, 'star').setScale(4)
    star.setInteractive({ draggable: true, cursor: 'pointer' })

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.setPosition(dragX, dragY)
    })
  }
}
