import { CacheSeasonPopShimmer } from '../../Cache/VariablesAndData'; // eslint-disable-line no-unused-vars
import { CMOptions } from '../../Config/VariablesAndData';
import Flash from '../../Disp/Notifications/Flash';
import CreateNotification from '../../Disp/Notifications/Notification';
import PlaySound from '../../Disp/Notifications/Sound';
import { LastSeasonPopupState } from '../VariablesAndData';

/**
 * This function checks if there is reindeer that has spawned
 * It is called by CM.Main.Loop
 */
export default function CheckSeasonPopup() {
  if (LastSeasonPopupState !== Game.shimmerTypes.reindeer.spawned) {
    LastSeasonPopupState = Game.shimmerTypes.reindeer.spawned;
    Object.keys(Game.shimmers).forEach((i) => {
      if (Game.shimmers[i].spawnLead && Game.shimmers[i].type === 'reindeer') {
        CacheSeasonPopShimmer = Game.shimmers[i];
      }
    });
    Flash(3, 'SeaFlash', false);
    PlaySound(CMOptions.SeaSoundURL, 'SeaSound', 'SeaVolume', false);
    CreateNotification(
      'SeaNotification',
      'Reindeer sighted!',
      'A Reindeer has spawned. Click it now!',
    );
  }
}
