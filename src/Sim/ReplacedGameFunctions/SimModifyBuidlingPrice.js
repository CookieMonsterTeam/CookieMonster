import { SimObjects } from '../VariablesAndData';
import SimAuraMult from './SimAuraMult';
import SimEff from './SimEff';
import SimHas from './SimHas';
import SimHasGod from './SimHasGod';

/**
 * This function calculates the sell price of a building based on current "sim data"
 * @param	{string}	building	Name of the building
 * @param	{number}	price		Current price of building
 * @returns {number}	price		The modified building price
 */
export default function SimModifyBuildingPrice(building, price) {
  if (SimHas('Season savings')) price *= 0.99;
  if (SimHas("Santa's dominion")) price *= 0.99;
  if (SimHas('Faberge egg')) price *= 0.99;
  if (SimHas('Divine discount')) price *= 0.99;
  if (SimHas('Fortune #100')) price *= 0.99;
  // if (SimHasAura('Fierce Hoarder')) price *= 0.98;
  price *= 1 - SimAuraMult('Fierce Hoarder') * 0.02;
  if (Game.hasBuff('Everything must go')) price *= 0.95;
  if (Game.hasBuff('Crafty pixies')) price *= 0.98;
  if (Game.hasBuff('Nasty goblins')) price *= 1.02;
  if (building.fortune && SimHas(building.fortune.name)) price *= 0.93;
  price *= SimEff('buildingCost');
  if (SimObjects.Temple.minigameLoaded) {
    const godLvl = SimHasGod('creation');
    if (godLvl === 1) price *= 0.93;
    else if (godLvl === 2) price *= 0.95;
    else if (godLvl === 3) price *= 0.98;
  }
  return price;
}
