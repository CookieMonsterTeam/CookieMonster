import { CMOptions } from '../../Config/VariablesAndData';
import Flash from '../../Disp/Notifications/Flash';
import CreateNotification from '../../Disp/Notifications/Notification';
import PlaySound from '../../Disp/Notifications/Sound';
import { LastWrinklerCount } from '../VariablesAndData';

/**
 * This function checks if any new Wrinklers have popped up
 * It is called by CM.Main.Loop
 */
export default function CheckWrinklerCount() {
  if (Game.elderWrath > 0) {
    let CurrentWrinklers = 0;
    Object.keys(Game.wrinklers).forEach((i) => {
      if (Game.wrinklers[i].phase === 2) CurrentWrinklers += 1;
    });
    if (CurrentWrinklers > LastWrinklerCount) {
      LastWrinklerCount = CurrentWrinklers;
      if (CurrentWrinklers === Game.getWrinklersMax() && CMOptions.WrinklerMaxFlash) {
        Flash(3, 'WrinklerMaxFlash', false);
      } else {
        Flash(3, 'WrinklerFlash', false);
      }
      if (CurrentWrinklers === Game.getWrinklersMax() && CMOptions.WrinklerMaxSound) {
        PlaySound(CMOptions.WrinklerMaxSoundURL, 'WrinklerMaxSound', 'WrinklerMaxVolume', false);
      } else {
        PlaySound(CMOptions.WrinklerSoundURL, 'WrinklerSound', 'WrinklerVolume', false);
      }
      if (CurrentWrinklers === Game.getWrinklersMax() && CMOptions.WrinklerMaxNotification) {
        CreateNotification(
          'WrinklerMaxNotification',
          'Maximum Wrinklers Reached',
          'You have reached your maximum ammount of wrinklers',
        );
      } else {
        CreateNotification(
          'WrinklerNotification',
          'A Wrinkler appeared',
          'A new wrinkler has appeared',
        );
      }
    } else {
      LastWrinklerCount = CurrentWrinklers;
    }
  }
}
