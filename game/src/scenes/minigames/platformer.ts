import { Player } from '@/game-objects/player'

export class PlatformerScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  oneWayPlatforms?: Phaser.Physics.Arcade.StaticGroup
  player?: Player
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  map?: Phaser.Tilemaps.Tilemap
  itemsGroup?: Phaser.Physics.Arcade.Group
  isPaused: boolean = false

  // Nuevas propiedades para el juego educativo
  private score: number = 0
  private scoreText?: Phaser.GameObjects.Text
  private questionText?: Phaser.GameObjects.Text
  private currentTriangle?: Phaser.GameObjects.Sprite
  private triangleTypes: Array<{type: string, name: string, description: string, color: number}> = [
    { type: 'equilatero', name: 'Equilátero', description: '3 lados iguales, 3 ángulos de 60°', color: 0x00ff00 },
    { type: 'isoceles', name: 'Isósceles', description: '2 lados iguales, 2 ángulos iguales', color: 0xffff00 },
    { type: 'escaleno', name: 'Escaleno', description: '3 lados diferentes, 3 ángulos diferentes', color: 0xff0000 },
    { type: 'rectangulo', name: 'Rectángulo', description: '1 ángulo de 90°, teorema de Pitágoras', color: 0x0000ff },
    { type: 'acutangulo', name: 'Acutángulo', description: '3 ángulos agudos (< 90°)', color: 0xff00ff },
    { type: 'obtusangulo', name: 'Obtusángulo', description: '1 ángulo obtuso (> 90°)', color: 0xff8800 }
  ]
  private collectedTriangles: string[] = []
  private questionOverlay?: Phaser.GameObjects.Container
  private currentColorIndex: number = 0
  private questionBoxColors: Array<{fill: number, border: number}> = [
    { fill: 0xffffff, border: 0x00bcd4 }, // Azul (original)
    { fill: 0xffebee, border: 0xf44336 }, // Rojo
    { fill: 0xe8f5e8, border: 0x4caf50 }, // Verde
    { fill: 0xfff3e0, border: 0xff9800 }, // Naranja
    { fill: 0xf3e5f5, border: 0x9c27b0 }, // Púrpura
    { fill: 0xe0f2f1, border: 0x009688 }, // Turquesa
    { fill: 0xfff8e1, border: 0xffc107 }, // Amarillo
    { fill: 0xfce4ec, border: 0xe91e63 }  // Rosa
  ]

  private triangleQuestions = [
    {
      question: "¿Qué tipo de triángulo tiene tres lados iguales?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 0
    },
    {
      question: "¿Qué tipo de triángulo tiene dos lados iguales y uno diferente?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 1
    },
    {
      question: "¿Qué tipo de triángulo tiene todos los lados de diferente longitud?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 2
    },
    {
      question: "¿Qué tipo de triángulo tiene un ángulo recto (90°)?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 3
    },
    {
      question: "¿Qué tipo de triángulo tiene todos sus ángulos menores a 90°?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 4
    },
    {
      question: "¿Qué tipo de triángulo tiene un ángulo mayor a 90°?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 5
    },
    {
      question: "¿Qué tipo de triángulo puede ser también equilátero?",
      options: ["Acutángulo", "Rectángulo", "Obtusángulo", "Escaleno", "Isósceles", "Ninguno"],
      correct: 0
    },
    {
      question: "¿Qué tipo de triángulo puede tener dos ángulos iguales?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 1
    },
    {
      question: "¿Qué tipo de triángulo puede tener un ángulo obtuso?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 5
    },
    {
      question: "¿Qué tipo de triángulo puede tener un ángulo recto y dos lados iguales?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 1
    },
    {
      question: "¿Qué tipo de triángulo puede tener tres ángulos iguales?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 0
    },
    {
      question: "¿Qué tipo de triángulo puede ser acutángulo y escaleno a la vez?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Obtusángulo", "Ninguno"],
      correct: 2
    },
    {
      question: "¿Qué tipo de triángulo nunca puede ser equilátero?",
      options: ["Acutángulo", "Rectángulo", "Obtusángulo", "Isósceles", "Escaleno", "Ninguno"],
      correct: 1
    },
    {
      question: "¿Qué tipo de triángulo puede tener un ángulo de 120°?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 5
    },
    {
      question: "¿Qué tipo de triángulo puede tener tres ángulos agudos?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 0 // También podría ser 4, pero dejamos 0 para evitar ambigüedad
    },
    {
      question: "¿Qué tipo de triángulo puede tener un ángulo de 90° y todos los lados diferentes?",
      options: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      correct: 2 // Escaleno rectángulo
    }
  ];

  constructor() {
    super('PlatformerScene')
  }

  create() {
    this.isPaused = false
    this.itemsGroup = this.physics.add.group()

    this.createEducationalUI()
    this.drawMap()

    this.player = new Player(this, 16 * 6, 16 * 18)
    this.player.setGravityY(1000)

    if (this.itemsGroup == null) {
      throw new Error(
        'Items group is undefined, did you forget to initialize it?'
      )
    }

    this.physics.add.overlap(
      this.player,
      this.itemsGroup,
      this.collectItem,
      undefined,
      this
    )

    this.cursors = this.input.keyboard?.createCursorKeys()

    this.addMapCollides()

    this.add
      .bitmapText(750, 18, 'raster-forge', 'II')
      .setOrigin(0.5)
      .setScale(4)
      .setInteractive()
      .setScrollFactor(0) // Para que el botón no se mueva con la cámara
      .on('pointerdown', () => {
        this.pauseGameAndShowMenu()
      })

    // Configura los eventos del teclado (ej. tecla ESC para pausar)
    this.input.keyboard?.on('keydown-ESC', () => {
      this.pauseGameAndShowMenu()
    })

    console.log('the create method of this scene ran properly')
  }

  private createEducationalUI() {
    // Título del juego
    const titleText = this.add.text(384, 30, 'TRIÁNGULOS GEOMÉTRICOS', {
      fontSize: '24px',
      color: '#00ffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0)
    
    // Animación del título
    this.tweens.add({
      targets: titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1
    })

    // Puntuación
    this.scoreText = this.add.text(50, 50, 'Puntuación: 0', {
      fontSize: '18px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setScrollFactor(0)
    
    // Efecto de brillo en la puntuación
    this.tweens.add({
      targets: this.scoreText,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })

    // Instrucciones
    const instructionsText = this.add.text(384, 70, 'Recolecta triángulos y aprende sus propiedades', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0)
    
    // Contador de triángulos recolectados
    const collectedText = this.add.text(50, 80, 'Triángulos: 0/6', {
      fontSize: '16px',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setScrollFactor(0)
    
    // Botón de ayuda
    const helpButton = this.add.text(700, 50, '❓', {
      fontSize: '24px',
      color: '#ffffff'
    }).setScrollFactor(0).setInteractive()
    
    helpButton.on('pointerdown', () => {
      this.showHelp()
    })
  }

  collectItem: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    item
  ) => {
    // Solo procesar si el juego no está pausado y no hay overlay activo
    if (this.isPaused || this.questionOverlay) return;
    
    const itemSprite = item as Phaser.Physics.Arcade.Sprite

    if (itemSprite?.body instanceof Phaser.Physics.Arcade.Body) {
      // Obtener el tipo de triángulo del objeto
      const triangleType = itemSprite.data?.get('triangleType')
      
      if (triangleType) {
        this.showTriangleQuestion(triangleType, itemSprite)
      }
    }
  }

  private showTriangleQuestion(triangleType: string, triangleSprite: Phaser.Physics.Arcade.Sprite) {
    if (this.questionOverlay) {
      // Ya hay un overlay activo, no crear otro
      return;
    }
    this.isPaused = true;
    this.physics.pause();
    if (this.player) {
      this.player.setActive(false);
    }
    
    // Selecciona una pregunta aleatoria
    const questionObj = this.triangleQuestions[Math.floor(Math.random() * this.triangleQuestions.length)];

    // Overlay y UI mejorados visualmente
    // Fondo transparente (sin color azul claro)
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.3); // fondo semi-transparente oscuro
    overlay.fillRect(84, 38, 600, 500);
    overlay.setDepth(10);
    overlay.setAlpha(0.96);
    overlay.setData('isQuestionOverlay', true);
    // Cuadro principal con color rotativo
    const currentColor = this.questionBoxColors[this.currentColorIndex];
    const questionBox = this.add.graphics();
    questionBox.fillStyle(currentColor.fill, 0.98);
    questionBox.fillRoundedRect(134, 88, 500, 360, 36);
    questionBox.lineStyle(10, currentColor.border, 1);
    questionBox.strokeRoundedRect(134, 88, 500, 360, 36);
    questionBox.setDepth(11);
    questionBox.setAlpha(1);
    questionBox.setData('isQuestionOverlay', true);
    // Sombra más notoria
    const shadow = this.add.graphics();
    shadow.fillStyle(0x222222, 0.18);
    shadow.fillRoundedRect(144, 98, 500, 360, 36);
    shadow.setDepth(10.5);
    shadow.setData('isQuestionOverlay', true);
    // Animación de aparición suave
    questionBox.setScale(0.8);
    this.tweens.add({
      targets: questionBox,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 350,
      ease: 'Back.Out'
    });
    // Título de la pregunta mejorado - dentro del cuadro y más pequeño
    const questionTitle = this.add.text(384, 140, questionObj.question, {
      fontSize: '22px', color: `#${currentColor.border.toString(16).padStart(6, '0')}`, fontStyle: 'bold', stroke: '#ffffff', strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 2, color: '#fff', blur: 6, fill: true },
      wordWrap: { width: 460 }
    }).setOrigin(0.5).setDepth(12);
    questionTitle.setData('isQuestionOverlay', true);
    // Opciones con botones redondeados y efecto de elevación
    const options = questionObj.options;
    const correctIndex = questionObj.correct;
    const buttonSpacing = 44;
    const buttonWidth = 280, buttonHeight = 44;
    const buttonColor = 0xffffff, buttonTextColor = `#${currentColor.border.toString(16).padStart(6, '0')}`, buttonHoverColor = currentColor.border, buttonHoverTextColor = '#ffffff', buttonDepth = 13;
    const buttonElements: Phaser.GameObjects.GameObject[] = [];
    let answered = false; // FLAG de protección
    const totalOptions = options.length;
    const totalHeight = (totalOptions - 1) * buttonSpacing;
    const buttonYStartCentered = 288 + 30 - totalHeight / 2;
    const buttonTextFontSize = '20px';
    options.forEach((option, index) => {
      const y = buttonYStartCentered + index * buttonSpacing;
      // Simular botón redondeado con un rectángulo y bordes
      const button = this.add.graphics();
      button.fillStyle(buttonColor, 1);
      button.fillRoundedRect(384 - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 18);
      button.lineStyle(4, currentColor.border, 0.7);
      button.strokeRoundedRect(384 - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 18);
      button.setDepth(buttonDepth);
      button.setAlpha(0.98);
      button.setInteractive(new Phaser.Geom.Rectangle(384 - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
      button.setData('isQuestionOverlay', true);
      // Efecto de elevación al pasar el mouse
      button.on('pointerover', () => {
        if (!answered) {
          button.clear();
          button.fillStyle(buttonHoverColor, 1);
          button.fillRoundedRect(384 - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 18);
          button.lineStyle(4, currentColor.border, 0.7);
          button.strokeRoundedRect(384 - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 18);
        }
      });
      button.on('pointerout', () => {
        if (!answered) {
          button.clear();
          button.fillStyle(buttonColor, 1);
          button.fillRoundedRect(384 - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 18);
          button.lineStyle(4, currentColor.border, 0.7);
          button.strokeRoundedRect(384 - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 18);
        }
      });
      button.on('pointerdown', () => {
        if (answered) return;
        const isCorrect = option === options[correctIndex];
        console.log('[DEBUG] Botón presionado. option:', option, 'correctOption:', options[correctIndex], 'isCorrect:', isCorrect, 'index:', index, 'correctIndex:', correctIndex);
        if (isCorrect) {
          answered = true; // Solo bloquea si es correcta
        }
        this.handleAnswer(isCorrect, option, triangleSprite, [overlay, shadow, questionBox, questionTitle, ...buttonElements]);
      });
      const buttonText = this.add.text(384, y, option, {
        fontSize: buttonTextFontSize, color: buttonTextColor, fontStyle: 'bold', stroke: '#ffffff', strokeThickness: 2,
        shadow: { offsetX: 1, offsetY: 1, color: `#${currentColor.border.toString(16).padStart(6, '0')}`, blur: 2, fill: true }
      }).setOrigin(0.5).setDepth(buttonDepth + 1);
      buttonText.setData('isQuestionOverlay', true);
      buttonElements.push(button, buttonText);
    });
    const questionOverlay = this.add.container(0, 0, [overlay, shadow, questionBox, questionTitle, ...buttonElements]);
    this.add.existing(questionOverlay);
    questionOverlay.setDepth(20);
    this.questionOverlay = questionOverlay;
  }

  private handleAnswer(isCorrect: boolean, triangleType: string, triangleSprite: Phaser.Physics.Arcade.Sprite, elements: Phaser.GameObjects.GameObject[]) {
    console.log('[DEBUG] handleAnswer called. isCorrect:', isCorrect);
    if (isCorrect) {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.questionBoxColors.length;
      if (this.questionOverlay) {
        this.questionOverlay.destroy(true);
        this.questionOverlay = undefined;
      }
      this.isPaused = false;
      this.physics.resume();
      if (this.player) {
        this.player.setActive(true);
        this.player.setVisible(true);
      }
      // Efectos visuales de acierto y lógica de puntuación igual...
      triangleSprite.setVisible(false);
      const visualTriangle = triangleSprite.getData('visualTriangle');
      if (visualTriangle) visualTriangle.setVisible(false);
      if (this.scoreText) this.scoreText.setText(`Puntuación: ${this.score}`);
      if (this.collectedTriangles.length >= 6) {
        this.showVictoryScreen();
      }
    }
    // Efectos visuales de acierto (igual)
    const visualTriangle = triangleSprite.getData('visualTriangle');
    if (visualTriangle) {
      for (let i = 0; i < 20; i++) {
        const circle = this.add.circle(
          visualTriangle.x + Phaser.Math.Between(-50, 50),
          visualTriangle.y + Phaser.Math.Between(-50, 50),
          3, 0x00ff00
        );
        this.tweens.add({ targets: circle, scaleX: 0, scaleY: 0, alpha: 0, duration: 1000, onComplete: () => circle.destroy() });
      }
    }
    const correctText = this.add.text(384, 230, '✅ ¡Correcto!', {
      fontSize: '32px',
      color: '#00cc44',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true },
      align: 'center'
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({
      targets: correctText,
      scaleX: 1.2,
      scaleY: 1.2,
      y: correctText.y - 20,
      alpha: 0,
      duration: 1800,
      ease: 'Cubic.easeOut',
      onComplete: () => { correctText.destroy(); }
    });
    const successText = this.add.text(384, 288, '¡CORRECTO! +10 puntos', {
      fontSize: '32px', color: '#00ff00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);
    this.tweens.add({ 
      targets: successText, 
      scaleX: 1.5, 
      scaleY: 1.5, 
      duration: 1000, 
      onComplete: () => { successText.destroy(); } 
    });
  }

  private showVictoryScreen() {
    // Pausar el juego
    this.isPaused = true
    this.physics.pause()

    // Fondo animado con destellos
    const bg = this.add.graphics()
    bg.fillStyle(0x000000, 0.7)
    bg.fillRect(0, 0, 768, 576)
    bg.setDepth(30)

    // Partículas de confeti
    for (let i = 0; i < 80; i++) {
      const color = Phaser.Display.Color.RandomRGB().color;
      const confeti = this.add.rectangle(
        Phaser.Math.Between(100, 668),
        Phaser.Math.Between(0, 576),
        Phaser.Math.Between(6, 12),
        Phaser.Math.Between(12, 24),
        color
      ).setDepth(32)
      this.tweens.add({
        targets: confeti,
        y: 600,
        angle: 360,
        duration: Phaser.Math.Between(1200, 2200),
        delay: Phaser.Math.Between(0, 800),
        repeat: 0,
        onComplete: () => confeti.destroy()
      })
    }

    // Cuadro central con bordes redondeados y sombra
    const box = this.add.graphics()
    box.fillStyle(0xffffff, 0.97)
    box.fillRoundedRect(134, 88, 500, 360, 36)
    box.lineStyle(8, 0x00ccff, 0.8)
    box.strokeRoundedRect(134, 88, 500, 360, 36)
    box.setDepth(35)
    box.setAlpha(0.98)

    // Icono de trofeo
    const trophy = this.add.graphics()
    trophy.fillStyle(0xffd700, 1)
    trophy.fillCircle(384, 140, 38)
    trophy.fillRect(364, 170, 40, 30)
    trophy.fillStyle(0xffa500, 1)
    trophy.fillRect(374, 200, 20, 30)
    trophy.lineStyle(6, 0xffa500, 1)
    trophy.strokeCircle(384, 140, 38)
    trophy.setDepth(36)

    // Título grande animado
    const victoryTitle = this.add.text(384, 210, '¡FELICITACIONES!', {
      fontSize: '40px',
      color: '#00ccff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#222', blur: 8, fill: true }
    }).setOrigin(0.5).setDepth(37)
    this.tweens.add({
      targets: victoryTitle,
      scaleX: 1.12,
      scaleY: 1.12,
      duration: 1200,
      yoyo: true,
      repeat: -1
    })

    // Mensaje motivacional
    const victoryText = this.add.text(384, 260,
      `¡Has dominado los tipos de triángulos!\n\nPuntuación final: ${this.score} puntos\n\nTriángulos recolectados: ${this.collectedTriangles.length}/6\n\n¡Eres un verdadero maestro de la geometría!`,
      {
        fontSize: '22px',
        color: '#222222',
        fontStyle: 'bold',
        stroke: '#00ccff',
        strokeThickness: 2,
        align: 'center',
        wordWrap: { width: 440 }
      }
    ).setOrigin(0.5).setDepth(37)

    // Botones grandes y claros
    const restartButton = this.add.rectangle(384, 370, 220, 48, 0x00ccff, 1)
      .setStrokeStyle(4, 0x222222, 0.8)
      .setDepth(38)
      .setInteractive({ useHandCursor: true })
    const restartText = this.add.text(384, 370, 'JUGAR DE NUEVO', {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(39)

    const menuButton = this.add.rectangle(384, 425, 220, 48, 0xffffff, 1)
      .setStrokeStyle(4, 0x222222, 0.8)
      .setDepth(38)
      .setInteractive({ useHandCursor: true })
    const menuText = this.add.text(384, 425, 'MENÚ PRINCIPAL', {
      fontSize: '22px',
      color: '#00ccff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(39)

    // Efectos de hover
    restartButton.on('pointerover', () => restartButton.setFillStyle(0x0099cc))
    restartButton.on('pointerout', () => restartButton.setFillStyle(0x00ccff))
    menuButton.on('pointerover', () => menuButton.setFillStyle(0x00ccff))
    menuButton.on('pointerout', () => menuButton.setFillStyle(0xffffff))

    // Eventos de click
    restartButton.on('pointerdown', () => {
      this.scene.restart()
    })
    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene')
    })
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  private showHelp() {
    // Crear overlay de ayuda
    const overlay = this.add.rectangle(384, 288, 600, 400, 0x000000, 0.8)
    const helpBox = this.add.rectangle(384, 288, 580, 380, 0x0000ff, 0.9)
    
    const helpTitle = this.add.text(384, 150, 'AYUDA - TIPOS DE TRIÁNGULOS', {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)
    
    const helpText = this.add.text(384, 200, 
      '• Equilátero: 3 lados iguales, 3 ángulos de 60°\n' +
      '• Isósceles: 2 lados iguales, 2 ángulos iguales\n' +
      '• Escaleno: 3 lados diferentes, 3 ángulos diferentes\n' +
      '• Rectángulo: 1 ángulo de 90°, teorema de Pitágoras\n' +
      '• Acutángulo: 3 ángulos agudos (< 90°)\n' +
      '• Obtusángulo: 1 ángulo obtuso (> 90°)', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    const closeButton = this.add.text(384, 350, 'CERRAR', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setInteractive()
    
    closeButton.on('pointerdown', () => {
      [overlay, helpBox, helpTitle, helpText, closeButton].forEach(element => element.destroy())
    })
  }

  update() {
    if (this.isPaused) {
      return
    }

    if (this.player != null && this.cursors != null) {
      if (this.cursors.left.isDown) {
        this.player.left()
      } else if (this.cursors.right.isDown) {
        this.player.right()
      } else {
        this.player.idle()
      }

      if (this.cursors.up.isDown) {
        this.player.jump()
      }

      this.player.update()
    }
  }

  pauseGameAndShowMenu() {
    if (!this.isPaused) {
      this.isPaused = true
      this.physics.pause() // Pausa el sistema de física si lo usas
      this.scene.pause('PlatformerScene') // Pausa la escena de juego actual
      this.scene.launch('PauseMenuScene') // Lanza la escena del menú de pausa
    }
  }

  resumeGame() {
    this.isPaused = false;
    this.physics.resume(); // Reanuda el sistema de física
    // Asegurar que el personaje pueda moverse inmediatamente
    if (this.player) {
      this.player.setActive(true);
      this.player.setVisible(true);
    }
  }

  drawMap() {
    this.map = this.make.tilemap({ key: 'level1' })

    const bgTileset = this.map.addTilesetImage('backgrounds', 'backgrounds')
    if (bgTileset == null) {
      throw new Error('bgTileset image not found')
    }

    const tileset = this.map.addTilesetImage('platforms', 'tiles')
    if (tileset == null) {
      throw new Error('tileset image not found')
    }

    const objectsTileset = this.map.addTilesetImage('objects', 'objects')
    if (objectsTileset == null) {
      throw new Error('objectsTileset image not found')
    }

    this.map.createLayer('bg', bgTileset, 0, -48)
    this.map.createLayer('platforms', tileset, 0, 0)

    // Crear triángulos educativos dinámicamente
    this.createEducationalTriangles()

    // También cargar triángulos del mapa si existen
    this.map
      .createFromObjects('objects', {
        key: 'objects'
      })
      .forEach((obj) => {
        if (obj instanceof Phaser.GameObjects.Sprite) {
          const totalFrames = 7
          const randomStartFrame = Phaser.Math.Between(0, totalFrames - 1)

          let animationKey = ''
          const triangleType = obj.data?.get('triangleType')

          if (triangleType === 'equilatero') {
            animationKey = 'equilatero-floating'
          } else if (triangleType === 'isoceles') {
            animationKey = 'isoceles-floating'
          } else if (triangleType === 'escaleno') {
            animationKey = 'escaleno-floating'
          } else {
            throw new Error('Unknown object type (triangle object)')
          }

          obj.play({
            key: animationKey,
            startFrame: randomStartFrame,
            repeat: -1
          })

          this.itemsGroup?.add(obj)
        }
      })
  }

  // NUEVO: Generador de triángulos rectángulos con etiquetas y preguntas trigonométricas
  private createEducationalTriangles() {
    // Tipos de triángulo (no repetidos)
    const types = this.shuffleArray(this.triangleTypes.map(t => t.type)).slice(0, 6)
    // Área jugable (márgenes para no salir del mapa)
    const minX = 80, maxX = 688, minY = 120, maxY = 400
    const minDist = 70 // distancia mínima entre triángulos
    const positions: {x: number, y: number}[] = []
    // Generar posiciones aleatorias sin superposición
    for (let i = 0; i < types.length; i++) {
      let x: number = 0, y: number = 0, intentos = 0, valido = false
      while (!valido && intentos < 50) {
        x = Phaser.Math.Between(minX, maxX)
        y = Phaser.Math.Between(minY, maxY)
        valido = positions.every(pos => Math.hypot(pos.x - x, pos.y - y) > minDist)
        intentos++
      }
      positions.push({x, y})
    }
    // Crear triángulos en posiciones aleatorias
    types.forEach((type, index) => {
      const pos = positions[index]
      const triangle = this.add.graphics()
      const triangleInfo = this.triangleTypes.find(t => t.type === type)
      if (!triangleInfo) return
      triangle.lineStyle(3, triangleInfo.color, 1)
      if (type === 'equilatero') {
        triangle.beginPath(); triangle.moveTo(0, -20); triangle.lineTo(-17, 10); triangle.lineTo(17, 10); triangle.closePath(); triangle.strokePath()
      } else if (type === 'isoceles') {
        triangle.beginPath(); triangle.moveTo(0, -20); triangle.lineTo(-15, 15); triangle.lineTo(15, 15); triangle.closePath(); triangle.strokePath()
      } else if (type === 'escaleno') {
        triangle.beginPath(); triangle.moveTo(-20, -10); triangle.lineTo(10, -15); triangle.lineTo(15, 15); triangle.closePath(); triangle.strokePath()
      } else if (type === 'rectangulo') {
        triangle.beginPath(); triangle.moveTo(-20, -15); triangle.lineTo(20, -15); triangle.lineTo(20, 15); triangle.closePath(); triangle.strokePath()
      } else if (type === 'acutangulo') {
        triangle.beginPath(); triangle.moveTo(-15, -10); triangle.lineTo(10, -20); triangle.lineTo(20, 10); triangle.closePath(); triangle.strokePath()
      } else if (type === 'obtusangulo') {
        triangle.beginPath(); triangle.moveTo(-25, -5); triangle.lineTo(5, -10); triangle.lineTo(15, 15); triangle.closePath(); triangle.strokePath()
      }
      triangle.setPosition(pos.x, pos.y)
      // Crear sprite invisible para colisión
      const triangleSprite = this.physics.add.sprite(pos.x, pos.y, '__DEFAULT')
      triangleSprite.setVisible(false)
      triangleSprite.setData('triangleType', type)
      triangleSprite.setData('visualTriangle', triangle)
      this.itemsGroup?.add(triangleSprite)
      // Animación de flotación
      this.tweens.add({ targets: triangle, y: pos.y - 10, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
      // Efecto de brillo
      this.tweens.add({ targets: triangle, alpha: 0.7, duration: 1500, yoyo: true, repeat: -1 })
      // Texto del tipo
      const typeText = this.add.text(pos.x, pos.y + 40, triangleInfo.name, {
        fontSize: '12px', color: `#${triangleInfo.color.toString(16).padStart(6, '0')}`,
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 2
      }).setOrigin(0.5)
      this.tweens.add({ targets: typeText, scaleX: 1.1, scaleY: 1.1, duration: 1000, yoyo: true, repeat: -1 })
      })
  }

  addMapCollides() {
    this.platforms = this.physics.add.staticGroup()
    this.oneWayPlatforms = this.physics.add.staticGroup()

    this.map?.getObjectLayer('collides')?.objects.forEach((obj) => {
      let platform: Phaser.GameObjects.Sprite | undefined

      if (
        obj.properties?.find(
          (i: { name: string; value: any }) => (i.name = 'oneWay')
        )?.value
      ) {
        platform = this.oneWayPlatforms?.create(obj.x, obj.y, '__DEFAULT')
      } else {
        platform = this.platforms?.create(obj.x, obj.y, '__DEFAULT')
      }

      platform
        ?.setOrigin(0, 0)
        .setDisplaySize(obj.width ?? 0, obj.height ?? 0)
        .setVisible(false)

      if (platform?.body instanceof Phaser.Physics.Arcade.StaticBody) {
        platform.body.setSize(obj.width, obj.height)
      }
    })

    this.platforms?.refresh()
    this.oneWayPlatforms?.refresh()

    if (this.player == null) {
      throw new Error('Player not created yet')
    }

    this.physics.add.collider(this.player, this.platforms)

    this.physics.add.collider(
      this.player,
      this.oneWayPlatforms,
      undefined,
      this.processOneWayPlatform,
      this
    )
  }

  processOneWayPlatform: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    platform
  ) => {
    if (this.player == null) {
      throw new Error('Player not created yet')
    }

    if (!(platform instanceof Phaser.GameObjects.Sprite)) {
      throw new Error('The platform is not an sprite')
    }

    if (!(platform.body instanceof Phaser.Physics.Arcade.StaticBody)) {
      throw new Error("The platform doesn't have a body")
    }

    if (!(this.player.body instanceof Phaser.Physics.Arcade.Body)) {
      throw new Error("The player doesn't have a body")
    }

    const playerVelocityY = this.player?.body?.velocity.y
    const playerVelocityX = this.player?.body?.velocity.x

    if (
      (playerVelocityY != null && playerVelocityY <= 0) ||
      (playerVelocityY === 0 && playerVelocityX !== 0)
    ) {
      return false
    }

    const playerBottom = this.player.body.bottom - 16
    const platformBottom = platform.body.bottom

    if (playerBottom != null && playerBottom > platformBottom) {
      return false
    }

    return true
  }
}
