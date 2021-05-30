import { CacheObjectsNextAchievement } from '../VariablesAndData';
import IndividualAmountTillNextAchievement from './IndividualAmountTillNextAchievement';

/**
 * This functions caches the amount of buildings needed till next achievement
 * @param	{boolean}	forceRecalc	Whether a recalcution should be forced (after CPS change)
 */
export default function AllAmountTillNextAchievement(forceRecalc) {
  const result = {};

  Object.keys(Game.Objects).forEach((i) => {
    if (
      Object.keys(CacheObjectsNextAchievement).length !== 0 &&
      CacheObjectsNextAchievement[i].TotalNeeded > Game.Objects[i].amount &&
      !forceRecalc
    ) {
      result[i] = {
        AmountNeeded: CacheObjectsNextAchievement[i].TotalNeeded - Game.Objects[i].amount,
        TotalNeeded: CacheObjectsNextAchievement[i].TotalNeeded,
        price: Game.Objects[i].getSumPrice(
          CacheObjectsNextAchievement[i].TotalNeeded - Game.Objects[i].amount,
        ),
      };
    } else {
      const tillNext = IndividualAmountTillNextAchievement(i);
      result[i] = {
        AmountNeeded: tillNext,
        TotalNeeded: Game.Objects[i].amount + tillNext,
        price: Game.Objects[i].getSumPrice(tillNext),
      };
    }
  });
  CacheObjectsNextAchievement = result; // eslint-disable-line no-unused-vars
}
