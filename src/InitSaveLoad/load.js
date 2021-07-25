import { saveAndLoadingFunctions } from '@cookiemonsterteam/cookiemonsterframework/src/index';

import headers from '../Data/headers';
import { VersionMajor, VersionMinor } from '../Data/Moddata.ts';
import settings from '../Data/settings';
import UpdateColours from '../Disp/HelperFunctions/UpdateColours';
import CMLoopHook from '../Main/LoopHook';
import InitData from '../Sim/InitializeData/InitData';

/**
 * This creates a load function to the CM object. Per Game code/comments:
 * "do stuff with the string data you saved previously"
 */
export default function load(str) {
  InitData();

  // Load saveData
  saveAndLoadingFunctions.loadMod('cookieMonsterMod', str, settings, headers, CMLoopHook);
  if (
    typeof Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames ===
    'undefined'
  ) {
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames = [];
  }

  // Update display with colours and locking of minigames
  UpdateColours();
  for (
    let index = 0;
    index < Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames.length;
    index++
  ) {
    const buildingIndex =
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames[index];
    l(`row${buildingIndex}`).style.pointerEvents = 'none';
    l(`row${buildingIndex}`).style.opacity = '0.4';
    l(`productLock${buildingIndex}`).innerHTML = 'Unlock';
    l(`productLock${buildingIndex}`).style.pointerEvents = 'auto';
  }

  // Notify of update
  if (
    typeof Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.version !== 'undefined' &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.version !==
      `${VersionMajor}.${VersionMinor}`
  ) {
    if (Game.prefs.popups)
      Game.Popup(
        'A new version of Cookie Monster has been loaded, check out the release notes in the info tab!',
      );
    else
      Game.Notify(
        'A new version of Cookie Monster has been loaded, check out the release notes in the info tab!',
        '',
        '',
        0,
        1,
      );
  }
}
