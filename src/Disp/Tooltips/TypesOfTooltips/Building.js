import {
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
  CacheObjectsNextAchievement,
} from '../../../Cache/VariablesAndData';
import { CMOptions } from '../../../Config/VariablesAndData';
import { SimObjects } from '../../../Sim/VariablesAndData';
import {
  Beautify,
  FormatTime,
  GetTimeColour,
} from '../../BeautifyAndFormatting/BeautifyFormatting';
import GetCPS from '../../HelperFunctions/GetCPS';
import GetWrinkConfigBank from '../../HelperFunctions/GetWrinkConfigBank';
import {
  ColourTextPre,
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
      l('CMTooltipBorder').className =
        ColourTextPre + target[TooltipName].color;
      if (CMOptions.PPDisplayTime)
        l('CMTooltipPP').textContent = FormatTime(target[TooltipName].pp);
      else l('CMTooltipPP').textContent = Beautify(target[TooltipName].pp, 2);
      l('CMTooltipPP').className = ColourTextPre + target[TooltipName].color;
      const timeColour = GetTimeColour(
        (TooltipPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
      );
      l('CMTooltipTime').textContent = timeColour.text;
      if (
        timeColour.text === 'Done!' &&
        Game.cookies < target[TooltipName].price
      ) {
        l('CMTooltipTime').textContent = `${timeColour.text} (with Wrink)`;
      } else l('CMTooltipTime').textContent = timeColour.text;
      l('CMTooltipTime').className = ColourTextPre + timeColour.color;
    }

    // Add "production left till next achievement"-bar
    l('CMTooltipProductionLeftHeader').style.display = 'none';
    l('CMTooltipTime').style.marginBottom = '0px';

    // eslint-disable-next-line no-restricted-syntax
    for (const i of Object.keys(Game.Objects[TooltipName].productionAchievs)) {
      if (
        !Game.HasAchiev(
          Game.Objects[TooltipName].productionAchievs[i].achiev.name,
        )
      ) {
        const nextProductionAchiev =
          Game.Objects[TooltipName].productionAchievs[i];
        l('CMTooltipTime').style.marginBottom = '4px';
        l('CMTooltipProductionLeftHeader').style.display = '';
        l(
          'CMTooltipProductionLeft',
        ).className = `ProdAchievement${TooltipName}`;
        l('CMTooltipProductionLeft').textContent = Beautify(
          nextProductionAchiev.pow - SimObjects[TooltipName].totalCookies,
          15,
        );
        l('CMTooltipProductionLeft').style.color = 'white';
        break;
      }
    }

    if (CacheObjectsNextAchievement[TooltipName].AmountNeeded < 101) {
      l('CMTooltipProductionLeft').style.marginBottom = '4px';
      l('CMTooltipNextAchievementHeader').style.display = '';
      l('CMTooltipNextAchievement').textContent = Beautify(
        CacheObjectsNextAchievement[TooltipName].AmountNeeded,
      );
      l('CMTooltipNextAchievement').style.color = 'white';
    } else {
      l('CMTooltipNextAchievementHeader').style.display = 'none';
      l('CMTooltipProductionLeft').style.marginBottom = '0px';
    }
  } else l('CMTooltipArea').style.display = 'none';
}
