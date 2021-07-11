/**
 * This function fixes Game.mouseY as a result of bars that are added by CookieMonster
 * It is called by Game.UpdateWrinklers(), Game.UpdateSpecial() and the .onmousover of the BigCookie
 * before execution of their actual function
 */
export default function FixMouseY(target) {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 0
  ) {
    const timerBarHeight = parseInt(l('CMTimerBar').style.height, 10);
    Game.mouseY -= timerBarHeight;
    target();
    Game.mouseY += timerBarHeight;
  } else {
    target();
  }
}
