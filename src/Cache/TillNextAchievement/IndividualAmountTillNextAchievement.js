import BuyBuildingsBonusIncome from '../../Sim/SimulationEvents/BuyBuildingBonusIncome';
import { SimAchievementsOwned } from '../../Sim/VariablesAndData';

export default function IndividualAmountTillNextAchievement(building) {
  const AchievementsAtStart = Game.AchievementsOwned;
  for (let index = 0; index < 101; index++) {
    BuyBuildingsBonusIncome(building, index);
    if (SimAchievementsOwned > AchievementsAtStart) {
      return index;
    }
  }
  return 101;
}
