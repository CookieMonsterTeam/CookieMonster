import { ToggleTimerBar } from '../../Config/SpecificToggles';
import ToggleBotBar from '../../Config/Toggles/ToggleBotBar';
import { CMOptions } from '../../Config/VariablesAndData';
import UpdateBackground from './UpdateBackground';

/**
 * This function disables and shows the bars created by CookieMonster when the game is "ascending"
 * It is called by CM.Disp.Draw()
 */
export default function UpdateAscendState() {
  if (Game.OnAscend) {
    l('game').style.bottom = '0px';
    if (CMOptions.BotBar === 1) l('CMBotBar').style.display = 'none';
    if (CMOptions.TimerBar === 1) l('CMTimerBar').style.display = 'none';
  } else {
    ToggleBotBar();
    ToggleTimerBar();
  }
  UpdateBackground();
}
