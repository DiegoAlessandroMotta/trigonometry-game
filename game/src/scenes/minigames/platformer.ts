import { Player } from '@/game-objects/player'

export class PlatformerScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  map?: Phaser.Tilemaps.Tilemap
  triangles: { graphic: Phaser.GameObjects.Graphics, type: string }[] = []
  triangleActive: Phaser.GameObjects.Graphics | null = null
  triangleTypeActive: string | null = null
  questions: { question: string, options: string[], answer: string }[] = []
  currentQuestionIndex: number = 0
  correctAnswers: number = 0
  questionText?: Phaser.GameObjects.Text
  optionTexts: Phaser.GameObjects.Text[] = []
  overlay?: Phaser.GameObjects.Rectangle

  constructor() {
    super('PlatformerScene')
  }

  create() {
    // Fondo visual llamativo
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x181c2b, 0x2c274d, 0x1a2a3a, 0x23243a, 1)
    bg.fillRect(0, 0, 800, 480)
    // Estrellas o detalles
    for (let i = 0; i < 40; i++) {
      const color = Phaser.Display.Color.RandomRGB().color;
      bg.fillStyle(color, 0.25 + Math.random() * 0.5)
      bg.fillCircle(Math.random() * 800, Math.random() * 480, 1 + Math.random() * 2)
    }
    this.drawMap()

    this.player = new Player(this, 16, 16 * 8)
    this.player.setGravityY(1000)

    this.cursors = this.input.keyboard?.createCursorKeys()

    this.addMapCollides()

    this.add
      .bitmapText(750, 18, 'raster-forge', 'II')
      .setOrigin(0.5)
      .setScale(4)
      .setInteractive()
      .setScrollFactor(0)
      .on('pointerdown', () => {
        this.pauseGameAndShowMenu()
      })

    this.input.keyboard?.on('keydown-ESC', () => {
      this.pauseGameAndShowMenu()
    })

    // Agregar triángulos en lugares llamativos
    this.addTriangles()
    // Suelo sólido en la parte inferior
    const ground = this.add.rectangle(400, 472, 800, 32, 0x4422aa, 1)
    this.physics.add.existing(ground, true)
    this.platforms.add(ground)
  }

  addTriangles() {
    const triangleTypes = [
      { type: 'Equilátero', color: 0x00c3ff },
      { type: 'Isósceles', color: 0x43cea2 },
      { type: 'Escaleno', color: 0xffaf7b },
      { type: 'Rectángulo', color: 0xd76d77 },
      { type: 'Acutángulo', color: 0x7f53ac },
      { type: 'Obtusángulo', color: 0xff61a6 }
    ]
    Phaser.Utils.Array.Shuffle(triangleTypes)
    const positions = [
      { x: 200, y: 400 },
      { x: 400, y: 320 },
      { x: 600, y: 250 },
      { x: 300, y: 180 },
      { x: 500, y: 120 },
      { x: 700, y: 80 }
    ]
    triangleTypes.forEach((data, i) => {
      const pos = positions[i]
      const tri = this.add.graphics()
      tri.fillStyle(data.color, 1)
      tri.lineStyle(3, 0xffffff, 1)
      tri.beginPath()
      if (data.type === 'Equilátero') {
        tri.moveTo(0, 0)
        tri.lineTo(40, 0)
        tri.lineTo(20, -34.64)
        tri.closePath()
      } else if (data.type === 'Isósceles') {
        tri.moveTo(0, 0)
        tri.lineTo(40, 0)
        tri.lineTo(20, -50)
        tri.closePath()
      } else if (data.type === 'Escaleno') {
        tri.moveTo(0, 0)
        tri.lineTo(40, 0)
        tri.lineTo(30, -40)
        tri.closePath()
      } else if (data.type === 'Rectángulo') {
        tri.moveTo(0, 0)
        tri.lineTo(40, 0)
        tri.lineTo(0, -30)
        tri.closePath()
      } else if (data.type === 'Acutángulo') {
        tri.moveTo(0, 0)
        tri.lineTo(40, 0)
        tri.lineTo(25, -45)
        tri.closePath()
      } else if (data.type === 'Obtusángulo') {
        tri.moveTo(0, 0)
        tri.lineTo(40, 0)
        tri.lineTo(35, -15)
        tri.closePath()
      }
      tri.fillPath()
      tri.strokePath()
      tri.x = pos.x
      tri.y = pos.y
      this.physics.add.existing(tri)
      this.triangles.push({ graphic: tri, type: data.type })
      // Nombre del triángulo
      this.add.text(pos.x + 20, pos.y + 10, data.type, { fontSize: '16px', color: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5, 0)
    })
  }

  private drawMap() {
    this.map = this.make.tilemap({ key: 'level1' });
    const tileset = this.map.addTilesetImage('platforms', 'tiles');

    if (tileset == null) {
      throw new Error('Tileset is undefined, did you forget to load it?');
    }

    const groundLayer = this.map.createLayer('Ground', tileset, 0, 0);

    if (groundLayer == null) {
      throw new Error('Ground layer is undefined, did you forget to create it?');
    }

    groundLayer.setCollisionByProperty({ collides: true });

    this.platforms = this.physics.add.staticGroup();
    // Si quieres agregar plataformas manuales debajo de los triángulos, puedes hacerlo aquí (actualmente solo tilemap)
  }

  addMapCollides() {
    if (this.player == null) {
      throw new Error('Player is undefined, did you forget to initialize it?')
    }

    if (this.platforms == null) {
      throw new Error('Platforms is undefined, did you forget to initialize it?')
    }

    this.physics.add.collider(this.player, this.platforms)

    // Colisión con triángulos
    this.triangles.forEach(t => {
      this.physics.add.overlap(this.player, t.graphic, (player, triangle) => this.onTriangleOverlap(player, triangle, t.type), undefined, this)
    })
  }

  onTriangleOverlap(player: Phaser.GameObjects.GameObject, triangle: Phaser.GameObjects.GameObject, type: string) {
    if (this.triangleActive) return // Ya está respondiendo preguntas
    this.triangleActive = triangle as Phaser.GameObjects.Graphics
    this.triangleTypeActive = type
    this.player?.setVelocity(0, 0)
    this.player!.body.enable = false
    this.showTriangleQuestions(type)
  }

  showTriangleQuestions(type: string) {
    // Preguntas específicas por tipo
    const questionBank: Record<string, { question: string, options: string[], answer: string }[]> = {
      'Equilátero': [
        { question: '¿Cuántos lados tiene un triángulo equilátero iguales?', options: ['2', '3', '1'], answer: '3' },
        { question: '¿Cuántos ángulos iguales tiene un triángulo equilátero?', options: ['2', '3', '1'], answer: '3' },
        { question: '¿Qué tipo de triángulo tiene todos sus lados y ángulos iguales?', options: ['Equilátero', 'Isósceles', 'Escaleno'], answer: 'Equilátero' }
      ],
      'Isósceles': [
        { question: '¿Cuántos lados iguales tiene un triángulo isósceles?', options: ['2', '3', '1'], answer: '2' },
        { question: '¿Cuántos ángulos iguales tiene un triángulo isósceles?', options: ['2', '3', '1'], answer: '2' },
        { question: '¿Qué tipo de triángulo tiene dos lados iguales?', options: ['Equilátero', 'Isósceles', 'Escaleno'], answer: 'Isósceles' }
      ],
      'Escaleno': [
        { question: '¿Cuántos lados iguales tiene un triángulo escaleno?', options: ['0', '1', '2'], answer: '0' },
        { question: '¿Cuántos ángulos iguales tiene un triángulo escaleno?', options: ['0', '1', '2'], answer: '0' },
        { question: '¿Qué tipo de triángulo tiene todos sus lados diferentes?', options: ['Equilátero', 'Isósceles', 'Escaleno'], answer: 'Escaleno' }
      ],
      'Rectángulo': [
        { question: '¿Cuántos ángulos rectos tiene un triángulo rectángulo?', options: ['1', '2', '3'], answer: '1' },
        { question: '¿Qué tipo de triángulo tiene un ángulo de 90°?', options: ['Rectángulo', 'Acutángulo', 'Obtusángulo'], answer: 'Rectángulo' },
        { question: '¿Cuántos lados puede tener un triángulo rectángulo iguales?', options: ['2', '3', '1'], answer: '2' }
      ],
      'Acutángulo': [
        { question: '¿Cuántos ángulos agudos tiene un triángulo acutángulo?', options: ['1', '2', '3'], answer: '3' },
        { question: '¿Qué tipo de triángulo tiene todos sus ángulos menores de 90°?', options: ['Acutángulo', 'Rectángulo', 'Obtusángulo'], answer: 'Acutángulo' },
        { question: '¿Cuántos lados iguales puede tener un triángulo acutángulo?', options: ['0', '1', '2', '3'], answer: 'Cualquiera' }
      ],
      'Obtusángulo': [
        { question: '¿Cuántos ángulos obtusos tiene un triángulo obtusángulo?', options: ['1', '2', '3'], answer: '1' },
        { question: '¿Qué tipo de triángulo tiene un ángulo mayor de 90°?', options: ['Obtusángulo', 'Acutángulo', 'Rectángulo'], answer: 'Obtusángulo' },
        { question: '¿Cuántos lados iguales puede tener un triángulo obtusángulo?', options: ['0', '1', '2', '3'], answer: 'Cualquiera' }
      ]
    }
    const questions = questionBank[type] || []
    Phaser.Utils.Array.Shuffle(questions)
    this.questions = questions.slice(0, 3)
    this.currentQuestionIndex = 0
    this.correctAnswers = 0
    this.showQuestion()
  }

  showQuestion() {
    if (this.overlay) this.overlay.destroy()
    if (this.questionText) this.questionText.destroy()
    this.optionTexts.forEach(t => t.destroy())
    this.optionTexts = []
    this.overlay = this.add.rectangle(384, 216, 500, 200, 0x000000, 0.8).setScrollFactor(0)
    const q = this.questions[this.currentQuestionIndex]
    this.questionText = this.add.text(384, 170, q.question, { fontSize: '22px', color: '#fff', align: 'center' }).setOrigin(0.5)
    q.options.forEach((opt, i) => {
      const optText = this.add.text(384, 220 + i * 40, opt, { fontSize: '20px', color: '#ffff00', backgroundColor: '#222', padding: { left: 10, right: 10, top: 4, bottom: 4 } })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.checkAnswer(opt))
      this.optionTexts.push(optText)
    })
  }

  checkAnswer(opt: string) {
    const q = this.questions[this.currentQuestionIndex]
    if (opt === q.answer) {
      this.correctAnswers++
    }
    this.currentQuestionIndex++
    if (this.currentQuestionIndex < this.questions.length) {
      this.showQuestion()
    } else {
      this.finishQuestions()
    }
  }

  finishQuestions() {
    if (this.overlay) this.overlay.destroy()
    if (this.questionText) this.questionText.destroy()
    this.optionTexts.forEach(t => t.destroy())
    this.optionTexts = []
    if (this.correctAnswers === this.questions.length && this.triangleActive) {
      // Efecto visual de partículas
      const x = this.triangleActive.x + 20;
      const y = this.triangleActive.y - 20;
      for (let i = 0; i < 18; i++) {
        const color = Phaser.Display.Color.RandomRGB().color;
        const particle = this.add.circle(
          x + (Math.random() - 0.5) * 40,
          y + (Math.random() - 0.5) * 40,
          3 + Math.random() * 2,
          color
        );
        this.tweens.add({
          targets: particle,
          x: x + (Math.random() - 0.5) * 120,
          y: y + (Math.random() - 0.5) * 120,
          alpha: 0,
          scale: 0,
          duration: 900 + Math.random() * 400,
          ease: 'Power2',
          onComplete: () => particle.destroy()
        });
      }
      // Sonido de éxito
      this.sound.play('success', { volume: 0.5 });
      this.triangleActive.destroy()
    }
    this.triangleActive = null
    this.triangleTypeActive = null
    this.player!.body.enable = true
  }

  processOneWayPlatform = (player: Phaser.GameObjects.GameObject, platform: Phaser.GameObjects.GameObject) => {
    const playerBody = player.body as Phaser.Physics.Arcade.Body
    const platformBody = platform.body as Phaser.Physics.Arcade.Body

    if (playerBody.velocity.y > 0 && playerBody.y < platformBody.y) {
      playerBody.setVelocityY(0)
      playerBody.y = platformBody.y - playerBody.height
    }
  }

  pauseGameAndShowMenu() {
    this.scene.pause()
    this.scene.launch('PauseMenuScene')
  }

  resumeGame() {
    this.scene.resume()
  }

  update() {
    if (this.player && this.cursors) {
      // Movimiento izquierda/derecha
      if (this.cursors.left.isDown) {
        this.player.left()
      } else if (this.cursors.right.isDown) {
        this.player.right()
      } else {
        this.player.idle()
      }
      // Salto
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        this.player.jump()
      }
      this.player.update()
    }
  }
}
