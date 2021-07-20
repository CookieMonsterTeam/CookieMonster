import { notificationsFunctions as nF } from '@cookiemonsterteam/cookiemonsterframework/src/index';
import { LastMagicBarFull } from '../VariablesAndData';

/**
 * This function checks if the magic meter is full
 * It is called by CM.Main.Loop
 */
export default function CheckMagicMeter() {
  if (
    Game.Objects['Wizard tower'].minigameLoaded &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GrimoireBar === 1
  ) {
    const { minigame } = Game.Objects['Wizard tower'];
    if (minigame.magic < minigame.magicM) LastMagicBarFull = false;
    else if (!LastMagicBarFull) {
      LastMagicBarFull = true;
      nF.createFlash('cookieMonsterMod', 3, 'MagicFlash', false);
      nF.playCMSound(
        'cookieMonsterMod',
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MagicSoundURL,
        'MagicSound',
        'MagicVolume',
        false,
      );
      nF.createNotification(
        'cookieMonsterMod',
        'MagicNotification',
        'Magic Meter full',
        'Your Magic Meter is full. Cast a spell!',
      );
    }
  }
}
