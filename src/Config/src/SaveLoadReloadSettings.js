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
		for (const i in CM.Data.ConfigDefault) {
			if (typeof CM.Options[i] === 'undefined') {
				mod = true;
				CM.Options[i] = CM.Data.ConfigDefault[i];
			} else if (i !== 'Header' && i !== 'Colors') {
				if (i.indexOf('SoundURL') === -1) {
					if (!(CM.Options[i] > -1 && CM.Options[i] < CM.Data.Config[i].label.length)) {
						mod = true;
						CM.Options[i] = CM.Data.ConfigDefault[i];
					}
				} else if (typeof CM.Options[i] !== 'string') { // Sound URLs
					mod = true;
					CM.Options[i] = CM.Data.ConfigDefault[i];
				}
			} else if (i === 'Header') {
				for (const j in CM.Data.ConfigDefault.Header) {
					if (typeof CM.Options[i][j] === 'undefined' || !(CM.Options[i][j] > -1 && CM.Options[i][j] < 2)) {
						mod = true;
						CM.Options[i][j] = CM.Data.ConfigDefault[i][j];
					}
				}
			} else { // Colors
				for (const j in CM.Data.ConfigDefault.Colors) {
					if (typeof CM.Options[i][j] === 'undefined' || typeof CM.Options[i][j] !== 'string') {
						mod = true;
						CM.Options[i][j] = CM.Data.ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) CM.Config.SaveConfig();
		CM.Main.Loop(); // Do loop once
		for (const i in CM.Data.ConfigDefault) {
			if (i !== 'Header' && typeof CM.Data.Config[i].func !== 'undefined') {
				CM.Data.Config[i].func();
			}
		}
	} else { // Default values
		CM.Config.RestoreDefault();
	}
}

/**
 * This function reloads and resaves the default config as stored in CM.Data.ConfigDefault
 * It is called by resDefBut.onclick loaded in the options page or by CM.Config.LoadConfig if no localStorage is found
 */
export function RestoreDefault() {
	LoadConfig(CM.Data.ConfigDefault);
	SaveConfig();
	Game.UpdateMenu();
}
