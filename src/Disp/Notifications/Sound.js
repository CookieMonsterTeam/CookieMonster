import { CMOptions } from '../../Config/VariablesAndData';
import { isInitializing } from '../../InitSaveLoad/Variables';

/**
 * This function plays a sound depending on configs. It is called by all functions
 * that check game-events and which have settings for sound (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{variable}	url			A variable that gives the url for the sound (e.g., CM.Options.GCSoundURL)
 * @param	{string}	sndConfig	The setting in CM.Options that is checked before creating the sound
 * @param	{string}	volConfig	The setting in CM.Options that is checked to determine volume
 * @param	{bool}    forced		Whether the sound should play regardless of settings, used to test the sound
 */
export default function PlaySound(url, sndConfig, volConfig, forced) {
  // The arguments check makes the sound not play upon initialization of the mod
  if ((CMOptions[sndConfig] === 1 || forced) && isInitializing === false) {
    // eslint-disable-next-line new-cap
    const sound = new Audio(url);
    if (CMOptions.GeneralSound) sound.volume = (CMOptions[volConfig] / 100) * (Game.volume / 100);
    else sound.volume = CMOptions[volConfig] / 100;
    sound.play();
  }
}
