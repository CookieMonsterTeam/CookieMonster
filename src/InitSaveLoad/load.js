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
  saveAndLoadingFunctions.loadMod('cookieMonsterMod', str, settings, headers, CMLoopHook);
  UpdateColours();
  if (
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
