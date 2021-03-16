/* eslint-disable no-unused-vars */
import { SimAchievements, SimAchievementsOwned } from '../VariablesAndData';

/**
 * This function "wins" an achievement in the current sim data
 * It functions similarly to Game.Win()
 * It is not created by CM.Sim.CreateSimFunctions() in order to avoid spamming pop-ups upon winning
 * @param	{string}	what	Name of the achievement
 */
export default function SimWin(what) {
  if (SimAchievements[what]) {
    if (SimAchievements[what].won === 0) {
      SimAchievements[what].won = 1;
      if (Game.Achievements[what].pool !== 'shadow') SimAchievementsOwned += 1;
    }
  }
}
