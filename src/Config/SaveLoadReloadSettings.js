import { default as ConfigDefault } from '../Data/src/SettingsDefault';
import { default as ConfigData } from '../Data/src/SettingsData';

/** Functions related to saving, loading and restoring all settings */

/**
 * This function saves the config of CookieMonster without saving any of the other save-data
 * This allows saving in between the autosave intervals
 * It is called by CM.Config.LoadConfig(), CM.Config.RestoreDefault(), CM.Config.ToggleConfig(),
 * CM.ToggleConfigVolume() and changes in options with type "url", "color" or "numscale"
 */
export function SaveConfig() {
	const saveString = b64_to_utf8(unescape(localStorage.getItem('CookieClickerGame')).split('!END!')[0]);
	const CookieMonsterSave = saveString.match(/CookieMonster.*(;|$)/);
	if (CookieMonsterSave !== null) {
		const newSaveString = saveString.replace(CookieMonsterSave[0], `CookieMonster:${CM.save()}`);
		localStorage.setItem('CookieClickerGame', escape(`${utf8_to_b64(newSaveString)}!END!`));
	}
}

/**
 * This function loads the config of CookieMonster saved in localStorage and loads it into CM.Options
 * It is called by CM.Main.DelayInit() and CM.Config.RestoreDefault()
 */
export function LoadConfig(settings) {
	// This removes cookies left from earlier versions of CookieMonster
	if (typeof localStorage.CMConfig !== 'undefined') {
		delete localStorage.CMConfig;
	}
	if (settings !== undefined) {
		CM.Options = settings;

		// Check values
		let mod = false;
		for (const i in ConfigDefault) {
			if (typeof CM.Options[i] === 'undefined') {
				mod = true;
				CM.Options[i] = ConfigDefault[i];
			} else if (i !== 'Header' && i !== 'Colors') {
				if (i.indexOf('SoundURL') === -1) {
					if (!(CM.Options[i] > -1 && CM.Options[i] < ConfigData[i].label.length)) {
						mod = true;
						CM.Options[i] = ConfigDefault[i];
					}
				} else if (typeof CM.Options[i] !== 'string') { // Sound URLs
					mod = true;
					CM.Options[i] = ConfigDefault[i];
				}
			} else if (i === 'Header') {
				for (const j in ConfigDefault.Header) {
					if (typeof CM.Options[i][j] === 'undefined' || !(CM.Options[i][j] > -1 && CM.Options[i][j] < 2)) {
						mod = true;
						CM.Options[i][j] = ConfigDefault[i][j];
					}
				}
			} else { // Colors
				for (const j in ConfigDefault.Colors) {
					if (typeof CM.Options[i][j] === 'undefined' || typeof CM.Options[i][j] !== 'string') {
						mod = true;
						CM.Options[i][j] = ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) CM.Config.SaveConfig();
		CM.Main.Loop(); // Do loop once
		for (const i in ConfigDefault) {
			if (i !== 'Header' && typeof ConfigData[i].func !== 'undefined') {
				ConfigData[i].func();
			}
		}
	} else { // Default values
		RestoreDefault();
	}
}

/**
 * This function reloads and resaves the default config as stored in ConfigDefault
 * It is called by resDefBut.onclick loaded in the options page or by CM.Config.LoadConfig if no localStorage is found
 */
export function RestoreDefault() {
	LoadConfig(ConfigDefault);
	SaveConfig();
	Game.UpdateMenu();
}
