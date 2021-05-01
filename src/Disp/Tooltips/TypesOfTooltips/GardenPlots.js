import { CMOptions } from '../../../Config/VariablesAndData';
import Beautify from '../../BeautifyAndFormatting/Beautify';
import { TooltipName } from '../../VariablesAndData';
import * as Create from '../CreateTooltip';

/**
 * This function adds extra info to the Garden plots tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function GardenPlots() {
  const { minigame } = Game.Objects.Farm;
  if (CMOptions.TooltipPlots && minigame.plot[TooltipName[1]][TooltipName[0]][0] !== 0) {
    const mature =
      minigame.plot[TooltipName[1]][TooltipName[0]][1] >
      minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1].mature;
    const plantName =
      minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1].name;
    l('CMTooltipBorder').appendChild(Create.TooltipCreateHeader('Reward (Current / Maximum)'));
    const reward = document.createElement('div');
    reward.id = 'CMTooltipPlantReward';
    l('CMTooltipBorder').appendChild(reward);
    if (plantName === 'Bakeberry') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30)) : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 30)}`;
    } else if (plantName === 'Chocoroot' || plantName === 'White chocoroot') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3)) : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 3)}`;
    } else if (plantName === 'Queenbeet') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify(Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60)) : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 60)}`;
    } else if (plantName === 'Duketater') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify(Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120)) : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 120)}`;
    } else l('CMTooltipArea').style.display = 'none';
  } else l('CMTooltipArea').style.display = 'none';
}
