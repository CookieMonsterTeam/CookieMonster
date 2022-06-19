/** Functions related to the Dragon */

import Beautify from '../../Disp/BeautifyAndFormatting/Beautify';
import CopyData from '../../Sim/SimulationData/CopyData';
import { SimDoSims, SimObjects } from '../../Sim/VariablesAndData';
import FillCMDCache from '../FillCMDCache';
import { CacheCostDragonUpgrade, CacheLastDragonLevel } from '../VariablesAndData'; // eslint-disable-line no-unused-vars

/**
 * This functions caches the current cost of upgrading the dragon level so it can be displayed in the tooltip
 */
export default function CacheDragonCost() {
  if (CacheLastDragonLevel !== Game.dragonLevel || SimDoSims) {
    if (
      Game.dragonLevel < 25 &&
      Game.dragonLevels[Game.dragonLevel].buy.toString().includes('sacrifice')
    ) {
      const objectMatch = Game.dragonLevels[Game.dragonLevel].buy
        .toString()
        .match(/Objects\[(.*)\]/);
      let target =
        objectMatch !== null ? objectMatch[1] : Game.ObjectsById[Game.dragonLevel - 5].name;
      const amount = Game.dragonLevels[Game.dragonLevel].buy
        .toString()
        .match(/sacrifice\((.*?)\)/)[1];
      if (target !== 'i') {
        target = target.replaceAll("'", '');
        if (Game.Objects[target].amount < amount) {
          CacheCostDragonUpgrade = 'Not enough buildings to sell';
        } else {
          let cost = 0;
          CopyData();
          for (let i = 0; i < amount; i++) {
            let price =
              SimObjects[target].basePrice *
              Game.priceIncrease **
                Math.max(0, SimObjects[target].amount - 1 - SimObjects[target].free);
            price = Game.modifyBuildingPrice(SimObjects[target], price);
            price = Math.ceil(price);
            cost += price;
            SimObjects[target].amount -= 1;
          }
          CacheCostDragonUpgrade = `Cost to rebuy: ${Beautify(cost)}`;
        }
      } else {
        let cost = 0;
        CopyData();
        Object.keys(Game.Objects).forEach((j) => {
          target = j;
          if (Game.Objects[target].amount < amount) {
            CacheCostDragonUpgrade = 'Not enough buildings to sell';
            return;
          }
          for (let i = 0; i < amount; i++) {
            let price =
              SimObjects[target].basePrice *
              Game.priceIncrease **
                Math.max(0, SimObjects[target].amount - 1 - SimObjects[target].free);
            price = Game.modifyBuildingPrice(SimObjects[target], price);
            price = Math.ceil(price);
            cost += price;
            SimObjects[target].amount -= 1;
          }
          CacheCostDragonUpgrade = `Cost to rebuy: ${Beautify(cost)}`;
        });
      }
    }
    CacheLastDragonLevel = Game.dragonLevel;
  }

  FillCMDCache({ CacheLastDragonLevel });
}
