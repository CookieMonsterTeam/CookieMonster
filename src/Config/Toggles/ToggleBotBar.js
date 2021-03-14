import { UpdateBotBar } from '../../Disp/InfoBars/BottomBar';
import { UpdateBotTimerBarPosition } from '../SpecificToggles';
import { CMOptions } from '../VariablesAndData';

/**
 * This function toggle the bottom bar
 * It is called by CM.Disp.UpdateAscendState() and a change in CMOptions.BotBar
 */
export default function ToggleBotBar() {
  if (CMOptions.BotBar === 1) {
    l('CMBotBar').style.display = '';
    UpdateBotBar();
  } else {
    l('CMBotBar').style.display = 'none';
  }
  UpdateBotTimerBarPosition();
}
