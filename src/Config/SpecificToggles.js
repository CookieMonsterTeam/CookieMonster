/** Called by the "func" of individual settings */

import UpdateBackground from '../Disp/HelperFunctions/UpdateBackground';
import { CMOptions } from './VariablesAndData';

/**
 * This function changes the position of both the bottom and timer bar
 */
export function UpdateBotTimerBarPosition() {
  if (CMOptions.BotBar === 1 && CMOptions.TimerBar === 1 && CMOptions.TimerBarPos === 1) {
    l('CMBotBar').style.bottom = l('CMTimerBar').style.height;
    l('game').style.bottom = `${Number(l('CMTimerBar').style.height.replace('px', '')) + 70}px`;
  } else if (CMOptions.BotBar === 1) {
    l('CMBotBar').style.bottom = '0px';
    l('game').style.bottom = '70px';
  } else if (CMOptions.TimerBar === 1 && CMOptions.TimerBarPos === 1) {
    l('game').style.bottom = l('CMTimerBar').style.height;
  } else {
    // No bars
    l('game').style.bottom = '0px';
  }

  if (CMOptions.TimerBar === 1 && CMOptions.TimerBarPos === 0) {
    l('sectionLeft').style.top = l('CMTimerBar').style.height;
  } else {
    l('sectionLeft').style.top = '';
  }

  UpdateBackground();
}

/**
 * This function changes the visibility of the timer bar
 */
export function ToggleTimerBar() {
  if (CMOptions.TimerBar === 1) l('CMTimerBar').style.display = '';
  else l('CMTimerBar').style.display = 'none';
  UpdateBotTimerBarPosition();
}

/**
 * This function changes the position of the timer bar
 */
export function ToggleTimerBarPos() {
  if (CMOptions.TimerBarPos === 0) {
    l('CMTimerBar').style.width = '30%';
    l('CMTimerBar').style.bottom = '';
    l('game').insertBefore(l('CMTimerBar'), l('sectionLeft'));
  } else {
    l('CMTimerBar').style.width = '100%';
    l('CMTimerBar').style.bottom = '0px';
    l('wrapper').appendChild(l('CMTimerBar'));
  }
  UpdateBotTimerBarPosition();
}
