/** Functions related to the Dragon */

import Beautify from '../../Disp/BeautifyAndFormatting/Beautify';
import CopyData from '../../Sim/SimulationData/CopyData';
import { SimDoSims, SimObjects } from '../../Sim/VariablesAndData';
import { CacheCostDragonUpgrade, CacheLastDragonLevel } from '../VariablesAndData'; // eslint-disable-line no-unused-vars


// Calculate the cost to buy up the given number of previously bought levels of
// the building. This function does not set up the simulation data
// automatically; this must be handled by the caller.
function CalculateRebuyCostOfPreviousLevels(building, levels) {
  let cost = 0;
  for (let i = 0; i < levels; i++) {
    const simTarget = SimObjects[building.name];
    let price =
      simTarget.basePrice *
      Game.priceIncrease **
        Math.max(0, simTarget.amount - 1 - simTarget.free);
    price = Game.modifyBuildingPrice(simTarget, price);
    price = Math.ceil(price);
    cost += price;
    simTarget.amount -= 1;
  }
  return cost;
}

function GetDragonCostTooltipText() {
  if (Game.dragonLevel < 5) {
    // Early levels cost cookies, no extra calculation needed.
  } else if (Game.dragonLevel < 23) {
    // Dragon levels cost X number of a specific building
    const target = Game.ObjectsById[Game.dragonLevel-5];
    if (!target) {
      return 'Cost to rebuy: unknown'
    }

    const match = Game.dragonLevels[Game.dragonLevel].buy.toString()
      .match(/sacrifice\((.*?)\)/);
    if (!match) {
      return 'Cost to rebuy: unknown'
    }
    const amount = parseInt(match[1], 10);
    if (target.amount < amount) {
      return 'Not enough buildings to sacrifice';
    }

    CopyData();
    const cost = CalculateRebuyCostOfPreviousLevels(target, amount);
    return `Cost to rebuy: ${Beautify(cost)}`;
  } else if (Game.dragonLevel < 25) {
    // Dragon levels cost X of every building
    const match = Game.dragonLevels[Game.dragonLevel].buy.toString()
      .match(/sacrifice\((.*?)\)/);
    if (!match) {
      return 'Cost to rebuy: unknown'
    }
    const amount = parseInt(match[1], 10);

    let cost = 0;
    CopyData();
    for (const target of Object.values(Game.Objects)) {  // eslint-disable-line no-restricted-syntax
      if (target.amount < amount) {
        return 'Not enough buildings to sacrifice';
      }
      cost += CalculateRebuyCostOfPreviousLevels(target, amount)
    }
    return `Cost to rebuy: ${Beautify(cost)}`
  }
  return 'Cost to rebuy: unknown';
}




/**
 * This functions caches the current cost of upgrading the dragon level so it can be displayed in the tooltip
 */
export default function CacheDragonCost() {
  if (CacheLastDragonLevel !== Game.dragonLevel || SimDoSims) {
    CacheCostDragonUpgrade = GetDragonCostTooltipText();
    CacheLastDragonLevel = Game.dragonLevel;
  }
}

