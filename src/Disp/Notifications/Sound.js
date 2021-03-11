import { isInitzializing } from '../../Footer/Footer';


/**
 * This function plays a sound depending on configs. It is called by all functions
 * that check game-events and which have settings for sound (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{variable}	url			A variable that gives the url for the sound (e.g., CM.Options.GCSoundURL)
 * @param	{string}	sndConfig	The setting in CM.Options that is checked before creating the sound
 * @param	{string}	volConfig	The setting in CM.Options that is checked to determine volume
 */
export function PlaySound(url, sndConfig, volConfig) {
	// The arguments check makes the sound not play upon initialization of the mod
	if (CM.Options[sndConfig] === 1 && isInitzializing === false) {
		const sound = new realAudio(url);
		if (CM.Options.GeneralSound) sound.volume = (CM.Options[volConfig] / 100) * (Game.volume / 100);
		else sound.volume = (CM.Options[volConfig] / 100);
		sound.play();
	}
}