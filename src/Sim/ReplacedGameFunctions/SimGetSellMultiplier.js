import SimAuraMult from './SimAuraMult';

/**
 * This functions creates functions similarly to Game.getSellMultiplier but checks Sim Data instead of Game Data
 * @returns {number}	giveBack	The multiplier
 */
export default function SimGetSellMultiplier() {
  let giveBack = 0.25;
  giveBack *= 1 + SimAuraMult('Earth Shatterer');
  return giveBack;
}
