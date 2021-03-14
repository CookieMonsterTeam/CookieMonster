import { default as ConfigDefault } from '../../Data/SettingsDefault';
import { default as ConfigData } from '../../Data/SettingsData';
import { CMOptions } from '../VariablesAndData';
import save from '../../InitSaveLoad/save';
import CMLoop from '../../Main/Loop';

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
    const newSaveString = saveString.replace(
      CookieMonsterSave[0],
      `CookieMonster:${save()}`,
    );
    localStorage.setItem(
      'CookieClickerGame',
      escape(`${utf8_to_b64(newSaveString)}!END!`),
    );
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

    // Check values
    let mod = false;
    for (const i in ConfigDefault) {
      if (typeof CMOptions[i] === 'undefined') {
        mod = true;
        CMOptions[i] = ConfigDefault[i];
      } else if (i !== 'Header' && i !== 'Colors') {
        if (i.indexOf('SoundURL') === -1) {
          if (
            !(CMOptions[i] > -1 && CMOptions[i] < ConfigData[i].label.length)
          ) {
            mod = true;
            CMOptions[i] = ConfigDefault[i];
          }
        } else if (typeof CMOptions[i] !== 'string') {
          // Sound URLs
          mod = true;
          CMOptions[i] = ConfigDefault[i];
        }
      } else if (i === 'Header') {
        for (const j in ConfigDefault.Header) {
          if (
            typeof CMOptions[i][j] === 'undefined' ||
            !(CMOptions[i][j] > -1 && CMOptions[i][j] < 2)
          ) {
            mod = true;
            CMOptions[i][j] = ConfigDefault[i][j];
          }
        }
      } else {
        // Colors
        for (const j in ConfigDefault.Colors) {
          if (
            typeof CMOptions[i][j] === 'undefined' ||
            typeof CMOptions[i][j] !== 'string'
          ) {
            mod = true;
            CMOptions[i][j] = ConfigDefault[i][j];
          }
        }
      }
    }
    if (mod) SaveConfig();
    CMLoop(); // Do loop once
    for (const i in ConfigDefault) {
      if (i !== 'Header' && typeof ConfigData[i].func !== 'undefined') {
        ConfigData[i].func();
      }
    }
  } else {
    // Default values
    LoadConfig(ConfigDefault);
  }
}
