import { CMOptions } from '../../Config/VariablesAndData';
import { isInitializing } from '../../InitSaveLoad/Variables';

/**
 * This function creates a flash depending on configs. It is called by all functions
 * that check game-events and which have settings for Flashes (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{number}	mode	Sets the intensity of the flash, used to recursively dim flash
 * 								All calls of function have use mode === 3
 * @param	{string}	config	The setting in CM.Options that is checked before creating the flash
 */
export default function Flash(mode, config) {
	// The arguments check makes the sound not play upon initialization of the mod
	if ((CMOptions[config] === 1 && mode === 3 && isInitializing === false) || mode === 1) {
		l('CMWhiteScreen').style.opacity = '0.5';
		if (mode === 3) {
			l('CMWhiteScreen').style.display = 'inline';
			setTimeout(function () { Flash(2, config); }, 1000 / Game.fps);
		} else {
			setTimeout(function () { Flash(0, config); }, 1000 / Game.fps);
		}
	} else if (mode === 2) {
		l('CMWhiteScreen').style.opacity = '1';
		setTimeout(function () { Flash(1, config); }, 1000 / Game.fps);
	} else if (mode === 0) l('CMWhiteScreen').style.display = 'none';
}
