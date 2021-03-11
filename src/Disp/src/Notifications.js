/** Functions related to the flashes/sound/notifications */

import { isInitzializing } from '../../Footer/Footer';

/**
 * This function creates a flash depending on configs. It is called by all functions
 * that check game-events and which have settings for Flashes (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{number}	mode	Sets the intensity of the flash, used to recursively dim flash
 * 								All calls of function have use mode === 3
 * @param	{string}	config	The setting in CM.Options that is checked before creating the flash
 */
export function Flash(mode, config) {
	// The arguments check makes the sound not play upon initialization of the mod
	if ((CM.Options[config] === 1 && mode === 3 && isInitzializing === false) || mode === 1) {
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

/**
 * This function creates a notifcation depending on configs. It is called by all functions
 * that check game-events and which have settings for notifications (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{string}	notifyConfig	The setting in CM.Options that is checked before creating the notification
 * @param	{string}	title			The title of the to-be created notifications
 * @param	{string}	message			The text of the to-be created notifications
 */
export function Notification(notifyConfig, title, message) {
	// The arguments check makes the sound not play upon initialization of the mod
	if (CM.Options[notifyConfig] === 1 && document.visibilityState === 'hidden' && isInitzializing === false) {
		const CookieIcon = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
		new Notification(title, { body: message, badge: CookieIcon });
	}
}
