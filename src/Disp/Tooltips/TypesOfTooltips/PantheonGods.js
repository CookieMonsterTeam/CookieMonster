import { CacheGods } from '../../../Cache/VariablesAndData';
import { CMOptions } from '../../../Config/VariablesAndData';
import Beautify from '../../BeautifyAndFormatting/Beautify';
import { TooltipName, TooltipType } from '../../VariablesAndData';
import * as Create from '../CreateTooltip';

/**
 * This function adds extra info to the Pantheon Gods tooltip
 * It is called when the Harvest All tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function PantheonGods() {
  if (CMOptions.TooltipPantheon === 1) {
    const tooltipBox = l('CMTooltipBorder');
    let GodID;
    if (TooltipType === 'pas') GodID = TooltipName[1];
    else GodID = TooltipName;

    // Time left till enough magic for spell
    tooltipBox.appendChild(Create.TooltipCreateHeader('Effect in position 1:'));
    const cps1 = document.createElement('div');
    cps1.id = 'CMPantheonTooltipPosition1';
    if (CacheGods[GodID][0] !== 0) {
      cps1.textContent = Beautify(CacheGods[GodID][0]);
      const increase = Math.round((CacheGods[GodID][0] / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        cps1.textContent += ` (${increase / 100}% of income)`;
      } else {
        cps1.textContent += ` (<0${CMOptions.ScaleSeparator ? ',' : '.'}01% of income)`;
      }
    } else cps1.textContent = 'No effect to CPS';
    tooltipBox.appendChild(cps1);

    tooltipBox.appendChild(Create.TooltipCreateHeader('Effect in position 2:'));
    const cps2 = document.createElement('div');
    cps2.id = 'CMPantheonTooltipPosition2';
    if (CacheGods[GodID][1] !== 0) {
      cps2.textContent = Beautify(CacheGods[GodID][1]);
      const increase = Math.round((CacheGods[GodID][1] / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        cps2.textContent += ` (${increase / 100}% of income)`;
      } else {
        cps2.textContent += ` (<0${CMOptions.ScaleSeparator ? ',' : '.'}01% of income)`;
      }
    } else cps2.textContent = 'No effect to CPS';
    tooltipBox.appendChild(cps2);

    tooltipBox.appendChild(Create.TooltipCreateHeader('Effect in position 3:'));
    const cps3 = document.createElement('div');
    cps3.id = 'CMPantheonTooltipPosition2';
    if (CacheGods[GodID][2] !== 0) {
      cps3.textContent = Beautify(CacheGods[GodID][2]);
      const increase = Math.round((CacheGods[GodID][2] / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        cps3.textContent += ` (${increase / 100}% of income)`;
      } else {
        cps3.textContent += ` (<0${CMOptions.ScaleSeparator ? ',' : '.'}01% of income)`;
      }
    } else cps3.textContent = 'No effect to CPS';
    tooltipBox.appendChild(cps3);

    l('CMTooltipArea').appendChild(tooltipBox);
  } else l('CMTooltipArea').style.display = 'none';
}
