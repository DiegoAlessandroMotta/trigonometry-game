import { scenes } from '@/core/consts'
import dialogInitial from '@/dialogs-pages/level2.json'
import dialogFinal from '@/dialogs-pages/level2-complete.json'
import { BasePlatformerScene } from './base-platformer-scene'

export class Level2Scene extends BasePlatformerScene {
  constructor() {
    super(scenes.level2, {
      playerSpawn: { x: 16 * 2, y: 16 * 3 },
      mapKey: 'level2',
      bgFrame: '1.png',
      initialDialog: dialogInitial,
      finalDialog: dialogFinal,
      nextSceneOnWin: scenes.level3
    })
  }
}