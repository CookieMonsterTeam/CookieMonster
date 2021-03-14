import { CMOptions } from '../../Config/VariablesAndData';

/**
 * This function fixes Game.mouseY as a result of bars that are added by CookieMonster
 * It is called by Game.UpdateWrinklers(), Game.UpdateSpecial() and the .onmousover of the BigCookie
 * before execution of their actual function
 */
export default function FixMouseY(target) {
  if (CMOptions.TimerBar === 1 && CMOptions.TimerBarPos === 0) {
    const timerBarHeight = parseInt(l('CMTimerBar').style.height, 10);
    Game.mouseY -= timerBarHeight;
    target();
    Game.mouseY += timerBarHeight;
  } else {
    target();
  }
}
