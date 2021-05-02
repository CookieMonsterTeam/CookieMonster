import { ClickTimes } from '../Disp/VariablesAndData';
import { CMAvgQueue, InitCookiesDiff } from './CPS/AverageQueue';
import CacheAvgCPS from './CPS/CPS';
import CacheDragonAuras from './Dragon/CacheDragonAuras';
import CachePP from './PP/PP';
import { CacheBuildingsPrices, CacheIncome } from './PriceAndIncome/PriceAndIncome';
import { CacheChain } from './Stats/ChainCookies';
import CacheHeavenlyChipsPS from './Stats/HeavenlyChips';
import CacheAllMissingUpgrades from './Stats/MissingUpgrades';
import CacheSeasonSpec from './Stats/Reindeer';
import { CacheGoldenAndWrathCookiesMults, CacheStatsCookies } from './Stats/Stats';
import AllAmountTillNextAchievement from './TillNextAchievement/AllAmountTillNextAchievement';
import { CacheAverageCookiesFromClicks, HeavenlyChipsDiff } from './VariablesAndData'; // eslint-disable-line no-unused-vars
import CacheWrinklers from './Wrinklers/Wrinklers';

/**
 * This functions runs all cache-functions to generate all "full" cache
 */
export default function InitCache() {
  CacheDragonAuras();
  CacheWrinklers();
  CacheStatsCookies();
  CacheGoldenAndWrathCookiesMults();
  CacheChain();
  CacheAllMissingUpgrades();
  CacheSeasonSpec();
  InitCookiesDiff();
  /** Used by CM.Cache.CacheHeavenlyChipsPS() */
  HeavenlyChipsDiff = new CMAvgQueue(5);
  CacheAverageCookiesFromClicks = new CMAvgQueue(ClickTimes[ClickTimes.length - 1] * 20);
  CacheHeavenlyChipsPS();
  AllAmountTillNextAchievement();
  CacheAvgCPS();
  CacheIncome();
  CacheBuildingsPrices();
  CachePP();
}
