import { saveAndLoadingFunctions } from '@cookiemonsterteam/cookiemonsterframework/src/index';

/** Functions related to toggling or changing an individual setting */

/** Used to name certain DOM or outside facing elements and refer to them */
export const ConfigPrefix = 'CMConfig';

/**
 * This function toggles header options by incrementing them with 1 and handling changes
 * It is called by the onclick event of the +/- next to headers
 * @param 	{string}	config	The name of the header
 */
export function ToggleHeader(config) {
  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] += 1;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] > 1)
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] = 0;
  saveAndLoadingFunctions.saveFramework();
}
