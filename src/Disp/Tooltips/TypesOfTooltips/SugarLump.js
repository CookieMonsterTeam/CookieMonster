import { CMOptions } from '../../../Config/VariablesAndData';
import GetLumpColor from '../../HelperFunctions/GetLumpColor';
import { ColorTextPre } from '../../VariablesAndData';
import * as Create from '../CreateTooltip';
/**
 * This function adds extra info to the Sugar Lump tooltip
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function SugarLump() {
  if (CMOptions.TooltipLump === 1) {
    const tooltipBox = l('CMTooltipBorder');

    tooltipBox.appendChild(Create.TooltipCreateHeader('Current Sugar Lump'));

    const lumpType = document.createElement('div');
    lumpType.id = 'CMTooltipTime';
    tooltipBox.appendChild(lumpType);
    const lumpColor = GetLumpColor(Game.lumpCurrentType);
    lumpType.textContent = lumpColor.text;
    lumpType.className = ColorTextPre + lumpColor.color;
  } else l('CMTooltipArea').style.display = 'none';
}
