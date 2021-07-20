import { notificationsFunctions as nF } from '@cookiemonsterteam/cookiemonsterframework/src/index';
import { LastGardenNextStep } from '../VariablesAndData';

/**
 * This function checks if a garden tick has happened
 */
export default function CheckGardenTick() {
  if (
    Game.Objects.Farm.minigameLoaded &&
    LastGardenNextStep !== Game.Objects.Farm.minigame.nextStep
  ) {
    if (LastGardenNextStep !== 0 && LastGardenNextStep < Date.now()) {
      nF.createFlash('cookieMonsterMod', 3, 'GardFlash', false);
      nF.playCMSound(
        'cookieMonsterMod',
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GardSoundURL,
        'GardSound',
        'GardVolume',
        false,
      );
    }
    LastGardenNextStep = Game.Objects.Farm.minigame.nextStep;
  }
}
