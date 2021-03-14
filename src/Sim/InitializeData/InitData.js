/** Functions used to create static objects of Buildings, Upgrades and Achievements */

import CopyData from '../SimulationData/CopyData';
import { SimAchievements, SimObjects, SimUpgrades } from '../VariablesAndData';
import InitAchievement from './InitAchievement';
import InitialBuildingData from './InitialBuildingData';
import InitUpgrade from './InitUpgrade';

/**
 * This function creates static objects for Buildings, Upgrades and Achievements
 */
export default function InitData() {
  // Buildings
  SimObjects = [];
  for (const i of Object.keys(Game.Objects)) {
    SimObjects[i] = InitialBuildingData(i);
  }

  // Upgrades
  SimUpgrades = [];
  for (const i of Object.keys(Game.Upgrades)) {
    SimUpgrades[i] = InitUpgrade(i);
  }

  // Achievements
  SimAchievements = [];
  for (const i of Object.keys(Game.Achievements)) {
    SimAchievements[i] = InitAchievement(i);
  }
  CopyData();
}
