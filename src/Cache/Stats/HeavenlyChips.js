import {
  CacheHCPerSecond, // eslint-disable-line no-unused-vars
  CacheLastHeavenlyCheck,
  CacheLastHeavenlyChips,
  HeavenlyChipsDiff,
} from '../VariablesAndData';

/**
 * This functions caches the heavenly chips per second in the last five seconds
 * It is called by CM.Cache.LoopCache()
 * @global	{number}	CM.Cache.HCPerSecond	The Heavenly Chips per second in the last five seconds
 */
export default function CacheHeavenlyChipsPS() {
  const currDate = Math.floor(Date.now() / 1000);
  // Only calculate every new second
  if ((Game.T / Game.fps) % 1 === 0) {
    const chipsOwned = Game.HowMuchPrestige(Game.cookiesReset);
    const ascendNowToOwn = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
    const ascendNowToGet = ascendNowToOwn - Math.floor(chipsOwned);

    // Add recent gains to AvgQueue's
    const timeDiff = currDate - CacheLastHeavenlyCheck;
    const heavenlyChipsDiffAvg = Math.max(0, ascendNowToGet - CacheLastHeavenlyChips) / timeDiff;
    for (let i = 0; i < timeDiff; i++) {
      HeavenlyChipsDiff.addLatest(heavenlyChipsDiffAvg);
    }

    // Store current data for next loop
    CacheLastHeavenlyCheck = currDate;
    CacheLastHeavenlyChips = ascendNowToGet;

    // Get average gain over period of 5 seconds
    CacheHCPerSecond = HeavenlyChipsDiff.calcAverage(5);
  }
}
