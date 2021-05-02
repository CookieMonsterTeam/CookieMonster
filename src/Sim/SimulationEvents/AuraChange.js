import { CacheDragonAura, CacheDragonAura2 } from '../../Cache/VariablesAndData';
import CalculateGains from '../Calculations/CalculateGains';
import CheckOtherAchiev from '../Calculations/CheckOtherAchiev';
import CopyData from '../SimulationData/CopyData';
import {
  SimAchievementsOwned,
  SimBuildingsOwned, // eslint-disable-line no-unused-vars
  SimCookiesPs,
  SimDragonAura,
  SimDragonAura2,
  SimObjects,
} from '../VariablesAndData';

/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}			aura										The number of the aura currently selected by the mouse/user
 * @returns {[number, number]} 	[CM.Sim.cookiesPs - Game.cookiesPs, price]	The bonus cps and the price of the change
 */
export default function CalculateChangeAura(aura) {
  CopyData();

  // Check if aura being changed is first or second aura
  const auraToBeChanged = l('promptContent').children[0].innerHTML.includes('secondary');
  if (auraToBeChanged) SimDragonAura2 = aura;
  else SimDragonAura = aura;

  // Sell highest building but only if aura is different
  let price = 0;
  if (SimDragonAura !== CacheDragonAura || SimDragonAura2 !== CacheDragonAura2) {
    for (let i = Game.ObjectsById.length - 1; i > -1; --i) {
      if (Game.ObjectsById[i].amount > 0) {
        const highestBuilding = SimObjects[Game.ObjectsById[i].name].name;
        SimObjects[highestBuilding].amount -= 1;
        SimBuildingsOwned -= 1;
        price =
          SimObjects[highestBuilding].basePrice *
          Game.priceIncrease **
            Math.max(0, SimObjects[highestBuilding].amount - 1 - SimObjects[highestBuilding].free);
        price = Game.modifyBuildingPrice(SimObjects[highestBuilding], price);
        price = Math.ceil(price);
        break;
      }
    }
  }

  const lastAchievementsOwned = SimAchievementsOwned;
  CalculateGains();

  CheckOtherAchiev();
  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }
  return [SimCookiesPs - Game.cookiesPs, price];
}
