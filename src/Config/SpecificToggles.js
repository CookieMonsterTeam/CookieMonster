/** Called by the "func" of individual settings */

import UpdateBackground from '../Disp/HelperFunctions/UpdateBackground';

/**
 * This function changes the position of both the bottom and timer bar
 */
export function UpdateBotTimerBarPosition() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 1
  ) {
    l('CMBotBar').style.bottom = l('CMTimerBar').style.height;
    l('game').style.bottom = `${Number(l('CMTimerBar').style.height.replace('px', '')) + 70}px`;
  } else if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar === 1) {
    l('CMBotBar').style.bottom = '0px';
    l('game').style.bottom = '70px';
  } else if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 1
  ) {
    l('game').style.bottom = l('CMTimerBar').style.height;
  } else {
    // No bars
    l('game').style.bottom = '0px';
  }

  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 0
  ) {
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
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1)
    l('CMTimerBar').style.display = '';
  else l('CMTimerBar').style.display = 'none';
  UpdateBotTimerBarPosition();
}

/**
 * This function changes the position of the timer bar
 */
export function ToggleTimerBarPos() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 0) {
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
