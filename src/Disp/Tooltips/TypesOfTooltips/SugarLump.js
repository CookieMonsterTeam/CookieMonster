import GetLumpColour from '../../HelperFunctions/GetLumpColour';
import { ColourTextPre } from '../../VariablesAndData';
import * as Create from '../CreateTooltip';
/**
 * This function adds extra info to the Sugar Lump tooltip
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function SugarLump() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipLump === 1) {
    const tooltipBox = l('CMTooltipBorder');

    tooltipBox.appendChild(Create.TooltipCreateHeader('Current Sugar Lump'));

    const lumpType = document.createElement('div');
    lumpType.id = 'CMTooltipTime';
    tooltipBox.appendChild(lumpType);
    const lumpColour = GetLumpColour(Game.lumpCurrentType);
    lumpType.textContent = lumpColour.text;
    lumpType.className = ColourTextPre + lumpColour.colour;
  } else l('CMTooltipArea').style.display = 'none';
}
