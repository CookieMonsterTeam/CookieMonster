import Beautify from '../../BeautifyAndFormatting/Beautify';
import * as Create from '../CreateTooltip';

/**
 * This function adds extra info to the Garden Harvest All tooltip
 * It is called when the Harvest All tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function HarvestAll() {
  const { minigame } = Game.Objects.Farm;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipLump) {
    l('CMTooltipBorder').appendChild(Create.TooltipCreateHeader('Cookies gained from harvesting:'));
    let totalGain = 0;
    let mortal = 0;
    if (Game.keys[16] && Game.keys[17]) mortal = 1;
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        if (minigame.plot[y][x][0] >= 1) {
          const tile = minigame.plot[y][x];
          const me = minigame.plantsById[tile[0] - 1];
          const plantName = me.name;

          let count = true;
          if (mortal && me.immortal) count = false;
          if (tile[1] < me.matureBase) count = false;
          if (count && plantName === 'Bakeberry') {
            totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30);
          } else if ((count && plantName === 'Chocoroot') || plantName === 'White chocoroot') {
            totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3);
          } else if (count && plantName === 'Queenbeet') {
            totalGain += Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60);
          } else if (count && plantName === 'Duketater') {
            totalGain += Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120);
          }
        }
      }
    }
    l('CMTooltipBorder').appendChild(document.createTextNode(Beautify(totalGain)));
  } else l('CMTooltipArea').style.display = 'none';
}
