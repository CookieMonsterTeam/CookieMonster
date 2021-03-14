/* eslint-disable no-unused-vars */
import CopyData from '../SimulationData/CopyData';
import {
  SimBuildingsOwned,
  SimDragonAura,
  SimDragonAura2,
  SimObjects,
} from '../VariablesAndData';
import BuildingSell from './SellBuilding';

/**
 * This function calculates the maximum cookies obtained from selling buildings just before purchasing the chocolate egg
 * It is called by CM.Cache.CacheSellForChoEgg()
 * @returns	{number}	sellTotal	The maximum cookies to be earned
 */
export default function SellBuildingsForChoEgg() {
  let sellTotal = 0;

  CopyData();

  // Change auras to Earth Shatterer + Reality bending to optimize money made by selling
  let buildingsToSacrifice = 2;
  if (SimDragonAura === 5 || SimDragonAura === 18) {
    --buildingsToSacrifice;
  }
  if (SimDragonAura2 === 5 || SimDragonAura2 === 18) {
    --buildingsToSacrifice;
  }
  SimDragonAura = 5;
  SimDragonAura2 = 18;

  // Sacrifice highest buildings for the aura switch
  for (let i = 0; i < buildingsToSacrifice; ++i) {
    let highestBuilding = 'Cursor';
    for (const j in SimObjects) {
      if (SimObjects[j].amount > 0) {
        highestBuilding = j;
      }
    }
    SimObjects[highestBuilding].amount--;
    SimBuildingsOwned--;
  }

  // Get money made by selling all remaining buildings
  for (const i of Object.keys(SimObjects)) {
    const me = SimObjects[i];
    sellTotal += BuildingSell(
      Game.Objects[me.name],
      Game.Objects[i].basePrice,
      me.amount,
      Game.Objects[i].free,
      me.amount,
    );
  }

  return sellTotal;
}
