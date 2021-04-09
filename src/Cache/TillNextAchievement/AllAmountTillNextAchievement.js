import { CacheObjectsNextAchievement } from '../VariablesAndData';
import IndividualAmountTillNextAchievement from './IndividualAmountTillNextAchievement';

export default function AllAmountTillNextAchievement() {
  const result = {};

  Object.keys(Game.Objects).forEach((i) => {
    if (
      Object.keys(CacheObjectsNextAchievement).length !== 0 &&
      CacheObjectsNextAchievement[i].TotalNeeded > Game.Objects[i].amount
    ) {
      result[i] = {
        AmountNeeded:
          CacheObjectsNextAchievement[i].TotalNeeded - Game.Objects[i].amount,
        TotalNeeded: CacheObjectsNextAchievement[i].TotalNeeded,
      };
    } else {
      const tillNext = IndividualAmountTillNextAchievement(i);
      result[i] = {
        AmountNeeded: tillNext,
        TotalNeeded: Game.Objects[i].amount + tillNext,
      };
    }
  });
  CacheObjectsNextAchievement = result; // eslint-disable-line no-unused-vars
}
