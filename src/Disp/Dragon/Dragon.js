/** Functions related to the Dragon */

import CacheDragonCost from '../../Cache/Dragon/Dragon';
import { CacheCostDragonUpgrade } from '../../Cache/VariablesAndData';
import CalculateChangeAura from '../../Sim/SimulationEvents/AuraChange';
import Beautify from '../BeautifyAndFormatting/Beautify';
import FormatTime from '../BeautifyAndFormatting/FormatTime';

/**
 * This functions adds the two extra lines about CPS and time to recover to the aura picker infoscreen
 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
 */
export function AddAuraInfo(aura) {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.DragonAuraInfo === 1) {
    const [bonusCPS, priceOfChange] = CalculateChangeAura(aura);
    const timeToRecover = FormatTime(priceOfChange / (bonusCPS + Game.cookiesPs));
    let bonusCPSPercentage;
    if (Game.cookiesPs === 0) bonusCPSPercentage = Beautify(Infinity);
    else bonusCPSPercentage = Beautify((bonusCPS / Game.cookiesPs) * 100);

    l('dragonAuraInfo').style.minHeight = '60px';
    l('dragonAuraInfo').style.margin = '8px';
    l('dragonAuraInfo').appendChild(document.createElement('div')).className = 'line';
    const div = document.createElement('div');
    div.style.minWidth = '200px';
    div.style.textAlign = 'center';
    div.textContent = `Picking this aura will change CPS by ${Beautify(
      bonusCPS,
    )} (${bonusCPSPercentage}% of current CPS).`;
    l('dragonAuraInfo').appendChild(div);
    const div2 = document.createElement('div');
    div2.style.minWidth = '200px';
    div2.style.textAlign = 'center';
    div2.textContent = `It will take ${timeToRecover} to recover the cost.`;
    l('dragonAuraInfo').appendChild(div2);
  }
}

/**
 * This functions adds a tooltip to the level up button displaying the cost of rebuying all
 * It is called by Game.ToggleSpecialMenu() after CM.Main.ReplaceNative()
 */
export function AddDragonLevelUpTooltip() {
  // Check if it is the dragon popup that is on screen
  if (
    (l('specialPopup').className.match(/onScreen/) &&
      l('specialPopup').children[0].style.background.match(/dragon/)) !== null
  ) {
    for (let i = 0; i < l('specialPopup').childNodes.length; i++) {
      if (l('specialPopup').childNodes[i].className === 'optionBox') {
        l('specialPopup').children[i].onmouseover = function () {
          CacheDragonCost();
          Game.tooltip.dynamic = 1;
          Game.tooltip.draw(
            l('specialPopup'),
            `<div style="min-width:200px;text-align:center;">${CacheCostDragonUpgrade}</div>`,
            'this',
          );
          Game.tooltip.wobble();
        };
        l('specialPopup').children[i].onmouseout = function () {
          Game.tooltip.shouldHide = 1;
        };
      }
    }
  }
}
