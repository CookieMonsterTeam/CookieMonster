/** Functions related to Caching stats */

import SimHas from '../../Sim/ReplacedGameFunctions/SimHas';
import GetCPSBuffMult from '../CPS/GetCPSBuffMult';
import {
  CacheConjure,
  CacheConjureReward, // eslint-disable-line no-unused-vars
  CacheDragonsFortuneMultAdjustment,
  CacheEdifice,
  CacheEdificeBuilding, // eslint-disable-line no-unused-vars
  CacheGoldenCookiesMult,
  CacheLucky,
  CacheLuckyFrenzy,
  CacheLuckyReward, // eslint-disable-line no-unused-vars
  CacheLuckyRewardFrenzy, // eslint-disable-line no-unused-vars
  CacheLuckyWrathReward, // eslint-disable-line no-unused-vars
  CacheLuckyWrathRewardFrenzy, // eslint-disable-line no-unused-vars
  CacheNoGoldSwitchCookiesPS,
  CacheWrathCookiesMult,
} from '../VariablesAndData';

/**
 * This functions caches variables related to the stats page
 */
export function CacheStatsCookies() {
  CacheLucky = (CacheNoGoldSwitchCookiesPS * 900) / 0.15;
  CacheLucky *= CacheDragonsFortuneMultAdjustment;
  const cpsBuffMult = GetCPSBuffMult();
  if (cpsBuffMult > 0) CacheLucky /= cpsBuffMult;
  else CacheLucky = 0;
  CacheLuckyReward = CacheGoldenCookiesMult * (CacheLucky * 0.15) + 13;
  CacheLuckyWrathReward = CacheWrathCookiesMult * (CacheLucky * 0.15) + 13;
  CacheLuckyFrenzy = CacheLucky * 7;
  CacheLuckyRewardFrenzy = CacheGoldenCookiesMult * (CacheLuckyFrenzy * 0.15) + 13;
  CacheLuckyWrathRewardFrenzy = CacheWrathCookiesMult * (CacheLuckyFrenzy * 0.15) + 13;
  CacheConjure = CacheLucky * 2;
  CacheConjureReward = CacheConjure * 0.15;

  CacheEdifice = 0;
  let max = 0;
  let n = 0;
  Object.keys(Game.Objects).forEach((i) => {
    if (Game.Objects[i].amount > max) max = Game.Objects[i].amount;
    if (Game.Objects[i].amount > 0) n += 1;
  });
  Object.keys(Game.Objects).forEach((i) => {
    if (
      (Game.Objects[i].amount < max || n === 1) &&
      Game.Objects[i].amount < 400 &&
      Game.Objects[i].price * 2 > CacheEdifice
    ) {
      CacheEdifice = Game.Objects[i].price * 2;
      CacheEdificeBuilding = i;
    }
  });
}

/**
 * This functions calculates the multipliers of Golden and Wrath cookie rewards
 */
export function CacheGoldenAndWrathCookiesMults() {
  let goldenMult = 1;
  let wrathMult = 1;
  let mult = 1;

  // Factor auras and upgrade in mults
  if (SimHas('Green yeast digestives')) mult *= 1.01;
  if (SimHas('Dragon fang')) mult *= 1.03;

  goldenMult *= 1 + Game.auraMult('Ancestral Metamorphosis') * 0.1;
  goldenMult *= Game.eff('goldenCookieGain');
  wrathMult *= 1 + Game.auraMult('Unholy Dominion') * 0.1;
  wrathMult *= Game.eff('wrathCookieGain');

  // Calculate final golden and wrath multipliers
  CacheGoldenCookiesMult = mult * goldenMult;
  CacheWrathCookiesMult = mult * wrathMult;

  // Calculate Dragon's Fortune multiplier adjustment:
  // If Dragon's Fortune (or Reality Bending) aura is active and there are currently no golden cookies,
  // compute a multiplier adjustment to apply on the current CPS to simulate 1 golden cookie on screen.
  // Otherwise, the aura effect will be factored in the base CPS making the multiplier not requiring adjustment.
  CacheDragonsFortuneMultAdjustment = 1;
  if (Game.shimmerTypes.golden.n === 0) {
    CacheDragonsFortuneMultAdjustment *= 1 + Game.auraMult("Dragon's Fortune") * 1.23;
  }
}
