/** Functions related to the flashes/sound/notifications */

import { isInitzializing } from '../../Footer/Footer';

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
