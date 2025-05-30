export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'dude')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setBounce(0.2)
    this.setCollideWorldBounds(true)
  }

  initAnimations() {}
}
