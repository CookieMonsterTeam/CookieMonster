import {
  CacheHCPerSecond,
  CacheLastHeavenlyChips,
  CacheTimeTillNextPrestige,
} from '../../Cache/VariablesAndData';
import Beautify from '../BeautifyAndFormatting/Beautify';

/**
 * This function creates a header object for tooltips.
 * @param	{string}	text	Title of header
 * @returns {object}	div		An object containing the stylized header
 */
export default function ReplaceAscendTooltip() {
  const cookiesToNext = Math.max(
    0,
    Game.HowManyCookiesReset(
      Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned)) + 1,
    ) -
      (Game.cookiesEarned + Game.cookiesReset),
  );

  const startDate = Game.sayTime(((Date.now() - Game.startDate) / 1000) * Game.fps, -1);
  let str = `You've been on this run for <b>${
    startDate === '' ? 'not very long' : startDate
  }</b>.<br>
  <div class="line"></div>`;
  if (Game.prestige > 0) {
    str += `Your prestige level is currently <b>${Beautify(Game.prestige)}</b>.<br>(CpS +${Beautify(
      Game.prestige,
    )}%)
    <div class="line"></div>`;
  }
  if (CacheLastHeavenlyChips < 1) str += 'Ascending now would grant you no prestige.';
  else if (CacheLastHeavenlyChips < 2)
    str +=
      'Ascending now would grant you<br><b>1 prestige level</b> (+1% CpS)<br>and <b>1 heavenly chip</b> to spend.';
  else
    str += `Ascending now would grant you<br><b>${Beautify(
      CacheLastHeavenlyChips,
    )} prestige levels</b> (+${Beautify(CacheLastHeavenlyChips)}% CpS)<br>and <b>${Beautify(
      CacheLastHeavenlyChips,
    )} heavenly chips</b> to spend.`;
  str += `<div class="line"></div>
  You need <b>${Beautify(cookiesToNext)} more cookies</b> for the next level.<br>
  ${
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipAscendButton
      ? `<div class='line'></div>It takes ${CacheTimeTillNextPrestige} to reach the next level and you were making ${Beautify(
          CacheHCPerSecond,
          2,
        )} chips on average in the last 5 seconds.<br>`
      : ''
  }`;
  l('ascendTooltip').innerHTML = str;
}
