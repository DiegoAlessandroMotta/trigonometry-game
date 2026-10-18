import { scenes } from '@/core/consts'
import dialogInitial from '@/dialogs-pages/level3.json'
import dialogFinal from '@/dialogs-pages/level3-complete.json'
import { BasePlatformerScene } from './base-platformer-scene'

export class Level3Scene extends BasePlatformerScene {
  constructor() {
    super(scenes.level3, {
      playerSpawn: { x: 16 * 3, y: 16 * 22 },
      mapKey: 'level3',
      bgFrame: '4.png',
      initialDialog: dialogInitial,
      finalDialog: dialogFinal,
      nextSceneOnWin: scenes.mainMenu
    })
  }

  protected override loadObjects() {
    const objectsLayer = this.map?.getObjectLayer('objects')

    objectsLayer?.objects.forEach((obj) => {
      if (obj.gid == null) {
        this.drawBackgroundShape(obj)
      }
    })

    const usedGids = new Set<number>()
    objectsLayer?.objects.forEach((obj) => {
      if (obj.gid != null) {
        usedGids.add(obj.gid)
      }
    })

    usedGids.forEach((gid) => {
      this.map
        ?.createFromObjects('objects', { key: 'objects', gid })
        .forEach((sprite) => {
          if (sprite instanceof Phaser.GameObjects.Sprite) {
            this.setupObjectSprite(sprite)
          }
        })
    })
  }

  private drawBackgroundShape(obj: Phaser.Types.Tilemaps.TiledObject) {
    const bgColorProp = (obj.properties ?? []).find(
      (p: { name: string; value: string }) => p.name === 'bg-color'
    )
    if (bgColorProp == null) {
      return
    }

    const tiledHex = bgColorProp.value.replace('#', '')
    const alpha = parseInt(tiledHex.slice(0, 2), 16) / 255
    const colorInt = parseInt(tiledHex.slice(2, 8), 16)

    const x = obj.x ?? 0
    const y = obj.y ?? 0
    const width = obj.width ?? 0
    const height = obj.height ?? 0

    const graphics = this.add.graphics().fillStyle(colorInt, alpha)

    if (obj.polygon != null) {
      const points = obj.polygon.map((p: { x: number; y: number }) => ({
        x: x + p.x,
        y: y + p.y
      }))
      graphics.fillPoints(points, true)
    } else {
      graphics.fillRect(x, y, width, height)
    }
  }
}