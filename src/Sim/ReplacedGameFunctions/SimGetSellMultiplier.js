import SimAuraMult from './SimAuraMult';

/**
 * This function calculates the sell multiplier based on current "sim data"
 * It is called by CM.Sim.BuildingSell()
 * @returns {number}	giveBack	The multiplier
 */
export default function SimGetSellMultiplier() {
  let giveBack = 0.25;
  giveBack *= 1 + SimAuraMult('Earth Shatterer');
  return giveBack;
}
