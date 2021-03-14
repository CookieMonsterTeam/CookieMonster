/** Functions related to the flashes/sound/notifications */

import { CMOptions } from '../../Config/VariablesAndData';
import { isInitializing } from '../../InitSaveLoad/Variables';

/**
 * This function creates a notifcation depending on configs. It is called by all functions
 * that check game-events and which have settings for notifications (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{string}	notifyConfig	The setting in CM.Options that is checked before creating the notification
 * @param	{string}	title			The title of the to-be created notifications
 * @param	{string}	message			The text of the to-be created notifications
 */
export default function Notification(notifyConfig, title, message) {
	// The arguments check makes the sound not play upon initialization of the mod
	if (CMOptions[notifyConfig] === 1 && document.visibilityState === 'hidden' && isInitializing === false) {
		const CookieIcon = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
		new Notification(title, { body: message, badge: CookieIcon });
	}
}
