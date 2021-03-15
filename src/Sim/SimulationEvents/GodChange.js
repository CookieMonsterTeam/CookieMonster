/* eslint-disable no-unused-vars */
import CalculateGains from '../Calculations/CalculateGains';
import CheckOtherAchiev from '../Calculations/CheckOtherAchiev';
import CopyData from '../SimulationData/CopyData';
import {
  SimAchievementsOwned,
  SimCookiesPs,
  SimGod1,
  SimGod2,
  SimGod3,
} from '../VariablesAndData';

/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}	god		The number of the slot to be swapped in
 * * @param	{number     slot	The slot the god will go to
 * @returns {number} 	CM.Sim.cookiesPs - Game.cookiesPs   The bonus cps and the price of the change
 */
export default function CalculateChangeGod(god, slot) {
  CopyData();
  if (slot === 0) SimGod1 = god;
  else if (slot === 1) SimGod2 = god;
  else if (slot === 2) SimGod3 = god;

  const lastAchievementsOwned = SimAchievementsOwned;
  CalculateGains();

  CheckOtherAchiev();
  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }
  return SimCookiesPs - Game.cookiesPs;
}
