import ColourOfPP from '../../../Cache/PP/ColourOfPP';
import {
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
  CacheObjectsNextAchievement,
} from '../../../Cache/VariablesAndData';

import BuyBuildingsBonusIncome from '../../../Sim/SimulationEvents/BuyBuildingBonusIncome';
import { SimObjects } from '../../../Sim/VariablesAndData';
import Beautify from '../../BeautifyAndFormatting/Beautify';
import FormatTime from '../../BeautifyAndFormatting/FormatTime';
import GetTimeColour from '../../BeautifyAndFormatting/GetTimeColour';
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

  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipBuildUpgrade === 1 &&
    Game.buyMode === 1
  ) {
    const tooltipBox = l('CMTooltipBorder');
    Create.TooltipCreateCalculationSection(tooltipBox);

    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipBuildUpgrade ===
        1 &&
      Game.buyMode === 1
    ) {
      l('CMTooltipIncome').textContent = Beautify(TooltipBonusIncome, 2);
      const increase = Math.round((TooltipBonusIncome / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
      } else {
        l('CMTooltipIncome').textContent += ` (<0${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator
            ? ','
            : '.'
        }01% of income)`;
      }
      l('CMTooltipBorder').className = ColourTextPre + target[TooltipName].colour;
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPDisplayTime)
        l('CMTooltipPP').textContent = FormatTime(target[TooltipName].pp);
      else l('CMTooltipPP').textContent = Beautify(target[TooltipName].pp, 2);
      l('CMTooltipPP').className = ColourTextPre + target[TooltipName].colour;
      const timeColour = GetTimeColour(
        (TooltipPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
      );
      l('CMTooltipTime').textContent = timeColour.text;
      if (timeColour.text === 'Done!' && Game.cookies < target[TooltipName].price) {
        l('CMTooltipTime').textContent = `${timeColour.text} (with Wrink)`;
      } else l('CMTooltipTime').textContent = timeColour.text;
      l('CMTooltipTime').className = ColourTextPre + timeColour.colour;
    }

    // Add "production left till next achievement"-bar
    l('CMTooltipProductionLeftHeader').style.display = 'none';
    l('CMTooltipTime').style.marginBottom = '0px';

    // eslint-disable-next-line no-restricted-syntax
    for (const i of Object.keys(Game.Objects[TooltipName].productionAchievs)) {
      if (!Game.HasAchiev(Game.Objects[TooltipName].productionAchievs[i].achiev.name)) {
        const nextProductionAchiev = Game.Objects[TooltipName].productionAchievs[i];
        l('CMTooltipTime').style.marginBottom = '4px';
        l('CMTooltipProductionLeftHeader').style.display = '';
        l('CMTooltipProductionLeft').className = `ProdAchievement${TooltipName}`;
        l('CMTooltipProductionLeft').textContent = Beautify(
          nextProductionAchiev.pow - SimObjects[TooltipName].totalCookies,
          15,
        );
        l('CMTooltipProductionLeft').style.color = 'white';
        break;
      }
    }

    const ObjectsTillNext = CacheObjectsNextAchievement[TooltipName];
    if (ObjectsTillNext.AmountNeeded < 101) {
      l('CMTooltipProductionLeft').style.marginBottom = '4px';
      l('CMTooltipNextAchievementHeader').style.display = '';

      let PPOfAmount;
      if (Game.cookiesPs) {
        PPOfAmount =
          Math.max(ObjectsTillNext.price - (Game.cookies + GetWrinkConfigBank()), 0) /
            Game.cookiesPs +
          ObjectsTillNext.price /
            BuyBuildingsBonusIncome(TooltipName, ObjectsTillNext.AmountNeeded);
      } else
        PPOfAmount =
          ObjectsTillNext.price /
          BuyBuildingsBonusIncome(TooltipName, ObjectsTillNext.AmountNeeded);

      l('CMTooltipNextAchievement').textContent = `${Beautify(
        ObjectsTillNext.AmountNeeded,
      )} / ${Beautify(ObjectsTillNext.price)} / `;
      l('CMTooltipNextAchievement').style.color = 'white';
      const PPFrag = document.createElement('span');
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPDisplayTime)
        PPFrag.textContent = FormatTime(PPOfAmount);
      else PPFrag.textContent = Beautify(PPOfAmount);
      PPFrag.className = ColourTextPre + ColourOfPP({ pp: PPOfAmount }, ObjectsTillNext.price);
      l('CMTooltipNextAchievement').appendChild(PPFrag);
    } else {
      l('CMTooltipNextAchievementHeader').style.display = 'none';
      l('CMTooltipProductionLeft').style.marginBottom = '0px';
    }
  } else l('CMTooltipArea').style.display = 'none';
}
