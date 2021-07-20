import { notificationsFunctions as nF } from '@cookiemonsterteam/cookiemonsterframework/src/index';
import { LastWrinklerCount } from '../VariablesAndData';

/**
 * This function checks if any new Wrinklers have popped up
 * It is called by CM.Main.Loop
 */
export default function CheckWrinklerCount() {
  if (Game.elderWrath > 0) {
    let CurrentWrinklers = 0;
    Object.keys(Game.wrinklers).forEach((i) => {
      if (Game.wrinklers[i].phase === 2) CurrentWrinklers += 1;
    });
    if (CurrentWrinklers > LastWrinklerCount) {
      LastWrinklerCount = CurrentWrinklers;
      if (
        CurrentWrinklers === Game.getWrinklersMax() &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxFlash
      ) {
        nF.createFlash('cookieMonsterMod', 3, 'WrinklerMaxFlash', false);
      } else {
        nF.createFlash('cookieMonsterMod', 3, 'WrinklerFlash', false);
      }
      if (
        CurrentWrinklers === Game.getWrinklersMax() &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxSound
      ) {
        nF.playCMSound(
          'cookieMonsterMod',
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxSoundURL,
          'WrinklerMaxSound',
          'WrinklerMaxVolume',
          false,
        );
      } else {
        nF.playCMSound(
          'cookieMonsterMod',
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerSoundURL,
          'WrinklerSound',
          'WrinklerVolume',
          false,
        );
      }
      if (
        CurrentWrinklers === Game.getWrinklersMax() &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxNotification
      ) {
        nF.createNotification(
          'cookieMonsterMod',
          'WrinklerMaxNotification',
          'Maximum Wrinklers Reached',
          'You have reached your maximum ammount of wrinklers',
        );
      } else {
        nF.createNotification(
          'cookieMonsterMod',
          'WrinklerNotification',
          'A Wrinkler appeared',
          'A new wrinkler has appeared',
        );
      }
    } else {
      LastWrinklerCount = CurrentWrinklers;
    }
  }
}
