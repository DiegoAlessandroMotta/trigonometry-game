import type { Scene } from 'phaser'

export function createAnimatedBackground(scene: Scene) {
  // Fondo degradado espectacular
  const bg = scene.add.graphics()
  bg.fillGradientStyle(0x0a0a2e, 0x1a1a4e, 0x2a2a6e, 0x3a3a8e, 1)
  bg.fillRect(0, 0, 768, 432)

  const symbols = ['sin', 'cos', 'tan', 'π', 'θ', 'α', 'β', '°', 'rad']
  for (let i = 0; i < 25; i++) {
    const symbol = scene.add.text(
      Math.random() * 768,
      Math.random() * 432,
      symbols[Math.floor(Math.random() * symbols.length)],
      {
        fontSize: '28px',
        color: '#4444ff',
        fontStyle: 'bold'
      }
    )

    scene.tweens.add({
      targets: symbol,
      y: symbol.y - 200,
      alpha: 0,
      duration: 6000 + Math.random() * 3000,
      repeat: -1,
      delay: Math.random() * 1000
    })
  }

  // // Líneas de conexión animadas
  // for (let i = 0; i < 12; i++) {
  //   const line = scene.add.graphics()
  //   line.lineStyle(2, 0x4444ff, 0.3)
  //   line.moveTo(Math.random() * 768, Math.random() * 432)
  //   line.lineTo(Math.random() * 768, Math.random() * 432)

  //   scene.tweens.add({
  //     targets: line,
  //     alpha: 0,
  //     duration: 4000,
  //     yoyo: true,
  //     repeat: -1,
  //     delay: Math.random() * 4000
  //   })
  // }
}
