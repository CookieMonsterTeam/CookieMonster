import ConfigDefault from '../../Data/SettingsDefault.ts';
import ConfigData from '../../Data/SettingsData';
import { CMOptions } from '../VariablesAndData';
import save from '../../InitSaveLoad/save';
import CMLoopHook from '../../Main/LoopHook';
import UpdateColours from '../../Disp/HelperFunctions/UpdateColours';

/** Functions related to saving, loading and restoring all settings */

/**
 * This function saves the config of CookieMonster without saving any of the other save-data
 * This allows saving in between the autosave intervals
 * It is called by CM.Config.LoadConfig(), CM.Config.RestoreDefault(), CM.Config.ToggleConfig(),
 * CM.ToggleConfigVolume() and changes in options with type "url", "color" or "numscale"
 */
export function SaveConfig() {
  const saveString = b64_to_utf8(
    unescape(localStorage.getItem('CookieClickerGame')).split('!END!')[0],
  );
  const CookieMonsterSave = saveString.match(/CookieMonster.*(;|$)/);
  if (CookieMonsterSave !== null) {
    const newSaveString = saveString.replace(CookieMonsterSave[0], `CookieMonster:${save()}`);
    localStorage.setItem('CookieClickerGame', escape(`${utf8_to_b64(newSaveString)}!END!`));
  }
}

/**
 * This function loads the config of CookieMonster saved in localStorage and loads it into CMOptions
 * It is called by CM.Main.DelayInit() and CM.Config.RestoreDefault()
 */
export function LoadConfig(settings) {
  // This removes cookies left from earlier versions of CookieMonster
  if (typeof localStorage.CMConfig !== 'undefined') {
    delete localStorage.CMConfig;
  }
  if (settings !== undefined) {
    CMOptions = settings;

    if (typeof CMOptions.Colors !== 'undefined') {
      delete CMOptions.Colors;
    }
    if (typeof CMOptions.Colours !== 'undefined') {
      delete CMOptions.Colours;
    }

    // Check values
    let mod = false;
    Object.keys(ConfigDefault).forEach((i) => {
      if (typeof CMOptions[i] === 'undefined') {
        mod = true;
        CMOptions[i] = ConfigDefault[i];
      } else if (i === 'Header') {
        Object.keys(ConfigDefault.Header).forEach((j) => {
          if (
            typeof CMOptions[i][j] === 'undefined' ||
            !(CMOptions[i][j] > -1 && CMOptions[i][j] < 2)
          ) {
            mod = true;
            CMOptions[i][j] = ConfigDefault[i][j];
          }
        });
      }
    });
    if (mod) SaveConfig();
    CMLoopHook(); // Do loop once
    Object.keys(ConfigDefault).forEach((i) => {
      if (i !== 'Header' && typeof ConfigData[i].func !== 'undefined') {
        ConfigData[i].func();
      }
    });
  } else {
    // Default values
    LoadConfig(ConfigDefault);
  }
  Game.UpdateMenu();
  UpdateColours();
}
