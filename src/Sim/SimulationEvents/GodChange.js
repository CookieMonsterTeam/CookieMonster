import CalculateGains from '../Calculations/CalculateGains';
import CheckOtherAchiev from '../Calculations/CheckOtherAchiev';
import CopyData from '../SimulationData/CopyData';
import { SimAchievementsOwned, SimCookiesPs, SimGod1, SimGod2, SimGod3 } from '../VariablesAndData'; // eslint-disable-line no-unused-vars

/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}	god		The number of the slot to be swapped in
 * @param	{number     slot	The slot the god will go to
 * @returns {number} 	CM.Sim.cookiesPs - Game.cookiesPs   The bonus cps and the price of the change
 */
export default function CalculateChangeGod(god, slot) {
  if (!Game.Objects.Temple.minigameLoaded) return 0;
  CopyData();
  const { minigame } = Game.Objects.Temple;
  const CurrentSlot = minigame.godsById[god].slot;
  if (CurrentSlot === '0') SimGod1 = minigame.slot[slot];
  else if (CurrentSlot === '1') SimGod2 = minigame.slot[slot];
  else if (CurrentSlot === '2') SimGod3 = minigame.slot[slot];
  /* eslint-disable no-unused-vars */
  if (slot === 0) SimGod1 = god;
  else if (slot === 1) SimGod2 = god;
  else if (slot === 2) SimGod3 = god;
  /* eslint-enable no-unused-vars */

  const lastAchievementsOwned = SimAchievementsOwned;
  CalculateGains();

  CheckOtherAchiev();
  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }
  return SimCookiesPs - Game.cookiesPs;
}
