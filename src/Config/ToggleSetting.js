import { default as ConfigData } from '../Data/src/SettingsData';
import { SaveConfig } from './SaveLoadReloadSettings';

/** Functions related to toggling or changing an individual setting */

/** Used to name certain DOM or outside facing elements and refer to them */
export const ConfigPrefix = 'CMConfig';

/**
 * This function toggles options by incrementing them with 1 and handling changes
 * It is called by the onclick event of options of the "bool" type
 * @param 	{string}	config	The name of the option
 */
export function ToggleConfig(config) {
	CM.Options[config]++;

	if (CM.Options[config] === ConfigData[config].label.length) {
		CM.Options[config] = 0;
		if (ConfigData[config].toggle) l(ConfigPrefix + config).className = 'option off';
	} else l(ConfigPrefix + config).className = 'option';

	if (typeof ConfigData[config].func !== 'undefined') {
		ConfigData[config].func();
	}

	l(ConfigPrefix + config).innerHTML = ConfigData[config].label[CM.Options[config]];
	SaveConfig();
}

/**
 * This function sets the value of the specified volume-option and updates the display in the options menu
 * It is called by the oninput and onchange event of "vol" type options
 * @param 	{string}	config	The name of the option
 */
export function ToggleConfigVolume(config) {
	if (l(`slider${config}`) !== null) {
		l(`slider${config}right`).innerHTML = `${l(`slider${config}`).value}%`;
		CM.Options[config] = Math.round(l(`slider${config}`).value);
	}
	SaveConfig();
}

/**
 * This function toggles header options by incrementing them with 1 and handling changes
 * It is called by the onclick event of the +/- next to headers
 * @param 	{string}	config	The name of the header
 */
export function ToggleHeader(config) {
	CM.Options.Header[config]++;
	if (CM.Options.Header[config] > 1) CM.Options.Header[config] = 0;
	SaveConfig();
}
