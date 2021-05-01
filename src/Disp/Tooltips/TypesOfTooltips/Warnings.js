import GetCPSBuffMult from '../../../Cache/CPS/GetCPSBuffMult';
import { CacheEdifice, CacheLucky } from '../../../Cache/VariablesAndData';
import ToggleToolWarnPos from '../../../Config/Toggles/ToggleToolWarnPos';
import { CMOptions } from '../../../Config/VariablesAndData';
import Beautify from '../../BeautifyAndFormatting/Beautify';
import FormatTime from '../../BeautifyAndFormatting/FormatTime';
import GetCPS from '../../HelperFunctions/GetCPS';
import GetWrinkConfigBank from '../../HelperFunctions/GetWrinkConfigBank';
import { TooltipBonusIncome, TooltipPrice, TooltipType } from '../../VariablesAndData';
import * as Create from '../CreateTooltip';

/**
 * This function updates the warnings section of the building and upgrade tooltips
 */
export default function Warnings() {
  if (TooltipType === 'b' || TooltipType === 'u') {
    if (document.getElementById('CMDispTooltipWarningParent') === null) {
      l('tooltipAnchor').appendChild(Create.TooltipCreateWarningSection());
      ToggleToolWarnPos();
    }

    if (CMOptions.ToolWarnPos === 0) l('CMDispTooltipWarningParent').style.right = '0px';
    else l('CMDispTooltipWarningParent').style.top = `${l('tooltip').offsetHeight}px`;

    l('CMDispTooltipWarningParent').style.width = `${l('tooltip').offsetWidth - 6}px`;

    const amount = Game.cookies + GetWrinkConfigBank() - TooltipPrice;
    const bonusIncomeUsed = CMOptions.ToolWarnBon ? TooltipBonusIncome : 0;
    let limitLucky = CacheLucky;
    if (CMOptions.ToolWarnBon === 1) {
      let bonusNoFren = TooltipBonusIncome;
      bonusNoFren /= GetCPSBuffMult();
      limitLucky += (bonusNoFren * 60 * 15) / 0.15;
    }

    if (CMOptions.ToolWarnLucky === 1) {
      if (amount < limitLucky && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnLucky').style.display = '';
        l('CMDispTooltipWarnLuckyText').textContent = `${Beautify(
          limitLucky - amount,
        )} (${FormatTime((limitLucky - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnLucky').style.display = 'none';
    } else l('CMDispTooltipWarnLucky').style.display = 'none';

    if (CMOptions.ToolWarnLuckyFrenzy === 1) {
      const limitLuckyFrenzy = limitLucky * 7;
      if (amount < limitLuckyFrenzy && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
        l('CMDispTooltipWarnLuckyFrenzyText').textContent = `${Beautify(
          limitLuckyFrenzy - amount,
        )} (${FormatTime((limitLuckyFrenzy - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
    } else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';

    if (CMOptions.ToolWarnConjure === 1) {
      const limitConjure = limitLucky * 2;
      if (amount < limitConjure && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnConjure').style.display = '';
        l('CMDispTooltipWarnConjureText').textContent = `${Beautify(
          limitConjure - amount,
        )} (${FormatTime((limitConjure - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnConjure').style.display = 'none';
    } else l('CMDispTooltipWarnConjure').style.display = 'none';

    if (CMOptions.ToolWarnConjureFrenzy === 1) {
      const limitConjureFrenzy = limitLucky * 2 * 7;
      if (amount < limitConjureFrenzy && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnConjureFrenzy').style.display = '';
        l('CMDispTooltipWarnConjureFrenzyText').textContent = `${Beautify(
          limitConjureFrenzy - amount,
        )} (${FormatTime((limitConjureFrenzy - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';
    } else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';

    if (CMOptions.ToolWarnEdifice === 1 && Game.Objects['Wizard tower'].minigameLoaded) {
      if (CacheEdifice && amount < CacheEdifice && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnEdifice').style.display = '';
        l('CMDispTooltipWarnEdificeText').textContent = `${Beautify(
          CacheEdifice - amount,
        )} (${FormatTime((CacheEdifice - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnEdifice').style.display = 'none';
    } else l('CMDispTooltipWarnEdifice').style.display = 'none';

    if (CMOptions.ToolWarnUser > 0) {
      if (
        amount < CMOptions.ToolWarnUser * GetCPS() &&
        (TooltipType !== 'b' || Game.buyMode === 1)
      ) {
        l('CMDispTooltipWarnUser').style.display = '';
        // Need to update tooltip text dynamically
        l(
          'CMDispTooltipWarnUser',
        ).children[0].textContent = `Purchase of this item will put you under the number of Cookies equal to ${CMOptions.ToolWarnUser} seconds of CPS`;
        l('CMDispTooltipWarnUserText').textContent = `${Beautify(
          CMOptions.ToolWarnUser * GetCPS() - amount,
        )} (${FormatTime(
          (CMOptions.ToolWarnUser * GetCPS() - amount) / (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnUser').style.display = 'none';
    } else l('CMDispTooltipWarnUser').style.display = 'none';
  } else if (l('CMDispTooltipWarningParent') !== null) {
    l('CMDispTooltipWarningParent').remove();
  }
}
