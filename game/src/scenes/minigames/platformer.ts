import { scenes } from '@/core/consts'
import dialogInitial from '@/dialogs-pages/platformer.json'
import dialogFinal from '@/dialogs-pages/platformer-complete.json'
import { BasePlatformerScene } from './base-platformer-scene'

export class PlatformerScene extends BasePlatformerScene {
  constructor() {
    super(scenes.platformer, {
      playerSpawn: { x: 16 * 8, y: 16 * 18 },
      mapKey: 'level1',
      bgFrame: '6.png',
      initialDialog: dialogInitial,
      finalDialog: dialogFinal,
      nextSceneOnWin: scenes.level2
    })
  }
}