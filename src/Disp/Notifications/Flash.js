import { CMOptions } from '../../Config/VariablesAndData';
import { isInitializing } from '../../InitSaveLoad/Variables';

/**
 * This function creates a flash depending on configs. It is called by all functions
 * that check game-events and which have settings for Flashes (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{number}	mode	Sets the intensity of the flash, used to recursively dim flash
 * 								All calls of function have use mode === 3
 * @param	{string}	config	The setting in CM.Options that is checked before creating the flash
 * @param	{bool}    forced		Whether the sound should play regardless of settings, used to test the sound
 */
export default function Flash(mode, config, forced) {
  // The arguments check makes the sound not play upon initialization of the mod
  if (
    ((CMOptions[config] === 1 || forced) && mode === 3 && isInitializing === false) ||
    mode === 1
  ) {
    l('CMFlashScreen').style.backgroundColor = CMOptions[`Colour${config}`];
    l('CMFlashScreen').style.opacity = '0.5';
    if (mode === 3) {
      l('CMFlashScreen').style.display = 'inline';
      setTimeout(() => {
        Flash(2, config, true);
      }, 1000 / Game.fps);
    } else {
      setTimeout(() => {
        Flash(0, config, true);
      }, 1000 / Game.fps);
    }
  } else if (mode === 2) {
    l('CMFlashScreen').style.opacity = '1';
    setTimeout(() => {
      Flash(1, config, true);
    }, 1000 / Game.fps);
  } else if (mode === 0) l('CMFlashScreen').style.display = 'none';
}
