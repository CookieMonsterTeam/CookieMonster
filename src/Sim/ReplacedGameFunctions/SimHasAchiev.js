import { SimAchievements } from '../VariablesAndData';

/**
 * This functions creates functions similarly to Game.HasAchiev but checks Sim Data instead of Game Data
 */
export default function SimHasAchiev(what) {
  return SimAchievements[what] ? SimAchievements[what].won : 0;
}
