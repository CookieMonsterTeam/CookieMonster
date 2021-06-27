import BuyBuildingsBonusIncome from '../../Sim/SimulationEvents/BuyBuildingBonusIncome';
import { SimAchievementsOwned } from '../../Sim/VariablesAndData';

export default function IndividualAmountTillNextAchievement(building) {
  const AchievementsAtStart = Game.AchievementsOwned;
  let index = 100;
  let lastIndexWithChange = 100;
  while (index > -1) {
    BuyBuildingsBonusIncome(building, index);
    if (SimAchievementsOwned > AchievementsAtStart) {
      lastIndexWithChange = index;
      index -= 10;
    } else if (index === 100) {
      return 101;
    } else {
      index += 1;
      while (index <= lastIndexWithChange) {
        BuyBuildingsBonusIncome(building, index);
        if (SimAchievementsOwned > AchievementsAtStart) {
          return index;
        }
        index += 1;
      }
    }
  }
  return 101;
}
