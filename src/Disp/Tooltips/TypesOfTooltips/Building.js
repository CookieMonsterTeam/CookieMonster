import {
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
} from '../../../Cache/VariablesAndData';
import { CMOptions } from '../../../Config/VariablesAndData';
import { SimObjects } from '../../../Sim/VariablesAndData';
import {
  Beautify,
  GetTimeColor,
} from '../../BeautifyAndFormatting/BeautifyFormatting';
import GetCPS from '../../HelperFunctions/GetCPS';
import GetWrinkConfigBank from '../../HelperFunctions/GetWrinkConfigBank';
import {
  ColorTextPre,
  LastTargetTooltipBuilding,
  TooltipBonusIncome,
  TooltipName,
  TooltipPrice,
} from '../../VariablesAndData';
import * as Create from '../CreateTooltip';

/**
 * This function adds extra info to the Building tooltips
 */
export default function Building() {
  if (CMOptions.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
    const tooltipBox = l('CMTooltipBorder');
    Create.TooltipCreateCalculationSection(tooltipBox);

    let target;
    if (Game.buyMode === 1) {
      LastTargetTooltipBuilding = target;
    } else {
      target = LastTargetTooltipBuilding;
    }
    if (Game.buyBulk === 1) target = CacheObjects1;
    else if (Game.buyBulk === 10) target = CacheObjects10;
    else if (Game.buyBulk === 100) target = CacheObjects100;

    TooltipPrice = Game.Objects[TooltipName].bulkPrice;
    TooltipBonusIncome = target[TooltipName].bonus;

    if (CMOptions.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
      l('CMTooltipIncome').textContent = Beautify(TooltipBonusIncome, 2);
      const increase = Math.round(
        (TooltipBonusIncome / Game.cookiesPs) * 10000,
      );
      if (Number.isFinite(increase) && increase !== 0) {
        l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
      } else {
        l('CMTooltipIncome').textContent += ` (<0${
          CMOptions.ScaleSeparator ? ',' : '.'
        }01% of income)`;
      }
      l('CMTooltipBorder').className = ColorTextPre + target[TooltipName].color;
      l('CMTooltipPP').textContent = Beautify(target[TooltipName].pp, 2);
      l('CMTooltipPP').className = ColorTextPre + target[TooltipName].color;
      const timeColor = GetTimeColor(
        (TooltipPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
      );
      l('CMTooltipTime').textContent = timeColor.text;
      if (
        timeColor.text === 'Done!' &&
        Game.cookies < target[TooltipName].price
      ) {
        l('CMTooltipTime').textContent = `${timeColor.text} (with Wrink)`;
      } else l('CMTooltipTime').textContent = timeColor.text;
      l('CMTooltipTime').className = ColorTextPre + timeColor.color;
    }

    // Add "production left till next achievement"-bar
    l('CMTooltipProductionHeader').style.display = 'none';
    l('CMTooltipTime').style.marginBottom = '0px';
    for (const i of Object.keys(Game.Objects[TooltipName].productionAchievs)) {
      if (
        !Game.HasAchiev(
          Game.Objects[TooltipName].productionAchievs[i].achiev.name,
        )
      ) {
        const nextProductionAchiev =
          Game.Objects[TooltipName].productionAchievs[i];
        l('CMTooltipTime').style.marginBottom = '4px';
        l('CMTooltipProductionHeader').style.display = '';
        l('CMTooltipProduction').className = `ProdAchievement${TooltipName}`;
        l('CMTooltipProduction').textContent = Beautify(
          nextProductionAchiev.pow - SimObjects[TooltipName].totalCookies,
          15,
        );
        l('CMTooltipProduction').style.color = 'white';
        break;
      }
    }
  } else l('CMTooltipArea').style.display = 'none';
}
