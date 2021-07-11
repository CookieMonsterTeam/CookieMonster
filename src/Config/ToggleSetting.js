import saveFramework from '@cookiemonsterteam/cookiemonsterframework/src/saveDataFunctions/saveFramework';
import settings from '../Data/settings';

/** Functions related to toggling or changing an individual setting */

/** Used to name certain DOM or outside facing elements and refer to them */
export const ConfigPrefix = 'CMConfig';

/**
 * This function toggles options by incrementing them with 1 and handling changes
 * It is called by the onclick event of options of the "bool" type
 * @param 	{string}	config	The name of the option
 */
export function ToggleConfig(config) {
  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] += 1;

  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] ===
    settings[config].label.length
  ) {
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = 0;
    if (settings[config].toggle) l(ConfigPrefix + config).className = 'option off';
  } else l(ConfigPrefix + config).className = 'option';

  if (typeof settings[config].func !== 'undefined') {
    settings[config].func();
  }

  saveFramework();
}

/**
 * This function sets the value of the specified volume-option and updates the display in the options menu
 * It is called by the oninput and onchange event of "vol" type options
 * @param 	{string}	config	The name of the option
 */
export function ToggleConfigVolume(config) {
  if (l(`slider${config}`) !== null) {
    l(`slider${config}right`).innerHTML = `${l(`slider${config}`).value}%`;
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = Math.round(
      l(`slider${config}`).value,
    );
  }
  saveFramework();
}

/**
 * This function toggles header options by incrementing them with 1 and handling changes
 * It is called by the onclick event of the +/- next to headers
 * @param 	{string}	config	The name of the header
 */
export function ToggleHeader(config) {
  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] += 1;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] > 1)
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] = 0;
  saveFramework();
}
