/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import Beautify from '../../BeautifyAndFormatting/Beautify.js';
import { TooltipName } from '../../VariablesAndData.js';
import * as Create from '../CreateTooltip.js';
import {
  CacheFarmLevel,
  CacheGardenSoil,
  CachePlotChances,
  CacheSupremeIntellect,
} from '../../../Cache/VariablesAndData.js';
import CalculateAllPlotChances from '../../HelperFunctions/CalculateAllPlotChances.js';

/**
 * This function adds extra info to the garden plot tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function GardenPlots() {
  const { minigame } = Game.Objects.Farm;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipPlots) {
    const tooltipBorder = l('CMTooltipBorder');

    if (minigame.plot[TooltipName[1]][TooltipName[0]][0] !== 0) {
      const rewardTooltip = document.createElement('div');
      rewardTooltip.appendChild(Create.TooltipCreateHeader('Reward (Current / Maximum)'));
      const mature =
        minigame.plot[TooltipName[1]][TooltipName[0]][1] >=
        minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1].mature;
      const plantName =
        minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1].name;
      const reward = document.createElement('div');
      reward.id = 'CMTooltipPlantReward';
      rewardTooltip.appendChild(reward);
      if (plantName === 'Chocoroot' || plantName === 'White chocoroot') {
        reward.textContent = `${
          mature ? Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3)) : '0'
        } / ${Beautify(Game.cookiesPs * 60 * 3)}`;
      } else if (plantName === 'Bakeberry') {
        reward.textContent = `${
          mature ? Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30)) : '0'
        } / ${Beautify(Game.cookiesPs * 60 * 30)}`;
      } else if (plantName === 'Queenbeet') {
        reward.textContent = `${
          mature ? Beautify(Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60)) : '0'
        } / ${Beautify(Game.cookiesPs * 60 * 60)}`;
      } else if (plantName === 'Duketater') {
        reward.textContent = `${
          mature ? Beautify(Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120)) : '0'
        } / ${Beautify(Game.cookiesPs * 60 * 120)}`;
      } else rewardTooltip.style.display = 'none';

      if (rewardTooltip.style.display !== 'none') tooltipBorder.appendChild(rewardTooltip);
    }

    if (
      minigame.parent.level !== CacheFarmLevel ||
      minigame.soil !== CacheGardenSoil ||
      Game.auraMult('Supreme Intellect') !== CacheSupremeIntellect
    ) {
      CacheFarmLevel = minigame.parent.level;
      CacheGardenSoil = minigame.soil;
      CacheSupremeIntellect = Game.auraMult('Supreme Intellect');
      CalculateAllPlotChances(minigame, CacheSupremeIntellect);
    }
    const plotChances = CachePlotChances[TooltipName[1]][TooltipName[0]];

    const plotTooltip = document.createElement('div');
    if (l('CMTooltipPlantReward')) plotTooltip.style.marginTop = '5px';
    plotTooltip.appendChild(Create.TooltipCreateHeader('After Next Tick:'));

    const showIcon = [];
    for (const id in minigame.plantsById) {
      showIcon[id] = false;
      if (minigame.plantsById[id].unlocked !== 0) {
        showIcon[id] = true;
        continue; // eslint-disable-line no-continue
      }
      for (let y = 0; y < 6 && !showIcon[id]; y++) {
        for (let x = 0; x < 6; x++) {
          if (minigame.plot[y][x][0] - 1 === id) {
            showIcon[id] = true;
            break;
          }
        }
      }
    }

    const tooltipOutcomes = document.createElement('div');
    const ConvertToPercentage = function (x) {
      if (x <= 0) return '0%';
      if (x >= 1) return '100%';

      const decimals =
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleDecimals + 1;
      const delta = 10 ** -decimals;

      const xH = x * 100;
      if (xH < delta) return `<${Beautify(delta)}%`;
      if (xH > 100 - delta) return `>${Beautify(100 - delta)}%`;

      return `${Beautify(xH)}%`;
    };
    for (const outcome of plotChances) {
      const outcomeInfo = document.createElement('div');
      outcomeInfo.style.height = '48px';
      outcomeInfo.style.display = 'flex';
      outcomeInfo.style.alignItems = 'center';

      const outcomeIcon = document.createElement('img');
      outcomeIcon.style.float = 'left';
      outcomeIcon.style.objectFit = 'none';
      if (outcome.plantId === -1) {
        outcomeIcon.style.width = '40px';
        outcomeIcon.style.height = '40px';
        outcomeIcon.style.margin = '4px';
        outcomeIcon.src = `${Game.resPath}img/gardenPlots.png`;
        outcomeIcon.style.objectPosition = `${0 * -40}px ${0 * -40}px`;

        // add brown colour
        outcomeIcon.style.background = 'saddlebrown';
        outcomeIcon.style.maskImage = `url(${Game.resPath}img/gardenPlots.png)`;
      } else {
        outcomeIcon.style.width = '48px';
        outcomeIcon.style.height = '48px';
        outcomeIcon.style.margin = '0px';

        if (!showIcon[outcome.plantId]) {
          outcomeIcon.src = `${Game.resPath}img/icons.png?v=${Game.version}`;
          outcomeIcon.style.objectPosition = `${0 * -48}px ${7 * -48}px`; // question mark
        } else {
          outcomeIcon.src = `${Game.resPath}img/gardenPlants.png?v=${Game.version}`;
          outcomeIcon.style.objectPosition = `${4 * -48}px ${minigame.plantsById[outcome.plantId].icon * -48}px`;
        }
      }
      outcomeInfo.appendChild(outcomeIcon);

      const outcomeInfoText = document.createElement('div');
      outcomeInfoText.style.marginLeft = '5px';

      const outcomeProbability = document.createElement('div');
      outcomeProbability.textContent = ConvertToPercentage(outcome.p);
      outcomeInfoText.appendChild(outcomeProbability);

      if (outcome.plantId !== -1) {
        const outcomeMaturityChance = document.createElement('small');
        outcomeMaturityChance.innerHTML = `<small>${ConvertToPercentage(outcome.maturityP)} chance of being mature</small>`;
        outcomeInfoText.appendChild(outcomeMaturityChance);
      }

      outcomeInfo.appendChild(outcomeInfoText);
      tooltipOutcomes.appendChild(outcomeInfo);
    }
    plotTooltip.appendChild(tooltipOutcomes);
    tooltipBorder.appendChild(plotTooltip);
  } else l('CMTooltipArea').style.display = 'none';
}
