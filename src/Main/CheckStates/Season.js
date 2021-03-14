/* eslint-disable no-unused-vars */
import { CacheSeasonPopShimmer } from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import Flash from '../../Disp/Notifications/Flash';
import Notification from '../../Disp/Notifications/Notification';
import PlaySound from '../../Disp/Notifications/Sound';
import { LastSeasonPopupState } from '../VariablesAndData';

/**
 * This function checks if there is reindeer that has spawned
 * It is called by CM.Main.Loop
 */
export default function CheckSeasonPopup() {
	if (LastSeasonPopupState !== Game.shimmerTypes.reindeer.spawned) {
		LastSeasonPopupState = Game.shimmerTypes.reindeer.spawned;
		for (const i of Object.keys(Game.shimmers)) {
			if (Game.shimmers[i].spawnLead && Game.shimmers[i].type === 'reindeer') {
				CacheSeasonPopShimmer = Game.shimmers[i];
				break;
			}
		}
		Flash(3, 'SeaFlash');
		PlaySound(CMOptions.SeaSoundURL, 'SeaSound', 'SeaVolume');
		Notification('SeaNotification', 'Reindeer sighted!', 'A Reindeer has spawned. Click it now!');
	}
}
