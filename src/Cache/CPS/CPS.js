import { CMOptions } from '../../Config/VariablesAndData';
import { ClickTimes, CookieTimes } from '../../Disp/VariablesAndData';
import {
  CacheAverageClicks, // eslint-disable-line no-unused-vars
  CacheAverageCPS,
  CacheAverageGainBank,
  CacheAverageGainChoEgg,
  CacheAverageGainWrink,
  CacheAverageGainWrinkFattest,
  CacheAvgCPSWithChoEgg, // eslint-disable-line no-unused-vars
  CacheLastChoEgg,
  CacheLastClicks,
  CacheLastCookies,
  CacheLastCPSCheck,
  CacheLastWrinkCookies,
  CacheLastWrinkFattestCookies,
  CacheRealCookiesEarned, // eslint-disable-line no-unused-vars
  CacheSellForChoEgg,
  CacheWrinklersFattest,
  CacheWrinklersTotal,
  ChoEggDiff,
  ClicksDiff,
  CookiesDiff,
  WrinkDiff,
  WrinkFattestDiff,
} from '../VariablesAndData';

/**
 * This functions caches two variables related average CPS and Clicks
 * It is called by CM.Cache.LoopCache()
 * @global	{number}	CM.Cache.RealCookiesEarned	Cookies earned including the Chocolate Egg
 * @global	{number}	CM.Cache.AvgCPS				Average cookies over time-period as defined by AvgCPSHist
 * @global	{number}	CM.Cache.AverageClicks		Average cookies from clicking over time-period as defined by AvgClicksHist
 * @global	{number}	CM.Cache.AvgCPSChoEgg		Average cookies from combination of normal CPS and average Chocolate Cookie CPS
 */
export default function CacheAvgCPS() {
  const currDate = Math.floor(Date.now() / 1000);
  // Only calculate every new second
  if ((Game.T / Game.fps) % 1 === 0) {
    let choEggTotal = Game.cookies + CacheSellForChoEgg;
    if (Game.cpsSucked > 0) choEggTotal += CacheWrinklersTotal;
    CacheRealCookiesEarned = Math.max(Game.cookiesEarned, choEggTotal);
    choEggTotal *= 0.05;

    // Add recent gains to AvgQueue's
    const timeDiff = currDate - CacheLastCPSCheck;
    const bankDiffAvg = Math.max(0, Game.cookies - CacheLastCookies) / timeDiff;
    const wrinkDiffAvg = Math.max(0, CacheWrinklersTotal - CacheLastWrinkCookies) / timeDiff;
    const wrinkFattestDiffAvg =
      Math.max(0, CacheWrinklersFattest[0] - CacheLastWrinkFattestCookies) / timeDiff;
    const choEggDiffAvg = Math.max(0, choEggTotal - CacheLastChoEgg) / timeDiff;
    const clicksDiffAvg = (Game.cookieClicks - CacheLastClicks) / timeDiff;
    for (let i = 0; i < timeDiff; i++) {
      CookiesDiff.addLatest(bankDiffAvg);
      WrinkDiff.addLatest(wrinkDiffAvg);
      WrinkFattestDiff.addLatest(wrinkFattestDiffAvg);
      ChoEggDiff.addLatest(choEggDiffAvg);
      ClicksDiff.addLatest(clicksDiffAvg);
    }

    // Store current data for next loop
    CacheLastCPSCheck = currDate;
    CacheLastCookies = Game.cookies;
    CacheLastWrinkCookies = CacheWrinklersTotal;
    CacheLastWrinkFattestCookies = CacheWrinklersFattest[0];
    CacheLastChoEgg = choEggTotal;
    CacheLastClicks = Game.cookieClicks;

    // Get average gain over period of cpsLength seconds
    const cpsLength = CookieTimes[CMOptions.AvgCPSHist];
    CacheAverageGainBank = CookiesDiff.calcAverage(cpsLength);
    CacheAverageGainWrink = WrinkDiff.calcAverage(cpsLength);
    CacheAverageGainWrinkFattest = WrinkFattestDiff.calcAverage(cpsLength);
    CacheAverageGainChoEgg = ChoEggDiff.calcAverage(cpsLength);
    CacheAverageCPS = CacheAverageGainBank;
    if (CMOptions.CalcWrink === 1) CacheAverageCPS += CacheAverageGainWrink;
    if (CMOptions.CalcWrink === 2) CacheAverageCPS += CacheAverageGainWrinkFattest;

    const choEgg = Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg');

    if (choEgg || CMOptions.CalcWrink === 0) {
      CacheAvgCPSWithChoEgg =
        CacheAverageGainBank + CacheAverageGainWrink + (choEgg ? CacheAverageGainChoEgg : 0);
    } else CacheAvgCPSWithChoEgg = CacheAverageCPS;

    // eslint-disable-next-line no-unused-vars
    CacheAverageClicks = ClicksDiff.calcAverage(ClickTimes[CMOptions.AvgClicksHist]);
  }
}
