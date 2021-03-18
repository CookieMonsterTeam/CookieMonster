import { SimObjects } from '../VariablesAndData';
import SimAuraMult from './SimAuraMult';
import SimEff from './SimEff';
import SimHas from './SimHas';
import SimHasGod from './SimHasGod';

/**
 * This function calculates the sell price of a building based on current "sim data"
 * @param	{string}	building	Name of the building
 * @param	{number}	price		Current price of building
 * @returns {number}	ModifiedPrice		The modified building price
 */
export default function SimModifyBuildingPrice(building, price) {
  let ModifiedPrice = price;
  if (SimHas('Season savings')) ModifiedPrice *= 0.99;
  if (SimHas("Santa's dominion")) ModifiedPrice *= 0.99;
  if (SimHas('Faberge egg')) ModifiedPrice *= 0.99;
  if (SimHas('Divine discount')) ModifiedPrice *= 0.99;
  if (SimHas('Fortune #100')) ModifiedPrice *= 0.99;
  // if (SimHasAura('Fierce Hoarder')) ModifiedPrice *= 0.98;
  ModifiedPrice *= 1 - SimAuraMult('Fierce Hoarder') * 0.02;
  if (Game.hasBuff('Everything must go')) ModifiedPrice *= 0.95;
  if (Game.hasBuff('Crafty pixies')) ModifiedPrice *= 0.98;
  if (Game.hasBuff('Nasty goblins')) ModifiedPrice *= 1.02;
  if (building.fortune && SimHas(building.fortune.name)) ModifiedPrice *= 0.93;
  ModifiedPrice *= SimEff('buildingCost');
  if (SimObjects.Temple.minigameLoaded) {
    const godLvl = SimHasGod('creation');
    if (godLvl === 1) ModifiedPrice *= 0.93;
    else if (godLvl === 2) ModifiedPrice *= 0.95;
    else if (godLvl === 3) ModifiedPrice *= 0.98;
  }
  return ModifiedPrice;
}
