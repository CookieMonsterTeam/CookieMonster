import { CacheDragonAuras } from "./Dragon/Dragon";
import CacheWrinklers from "./Wrinklers/Wrinklers";

/**
 * This functions runs all cache-functions to generate all "full" cache
 */
export default function InitCache() {
	CacheDragonAuras();
	CacheWrinklers();
	CM.Cache.CacheStats();
	CM.Cache.CacheGoldenAndWrathCookiesMults();
	CM.Cache.CacheChain();
	CM.Cache.CacheMissingUpgrades();
	CM.Cache.CacheSeaSpec();
	CM.Cache.InitCookiesDiff();
	CM.Cache.HeavenlyChipsDiff = new CMAvgQueue(5); // Used by CM.Cache.CacheHeavenlyChipsPS()
	CM.Cache.CacheHeavenlyChipsPS();
	CM.Cache.CacheAvgCPS();
	CM.Cache.CacheIncome();
	CM.Cache.CacheBuildingsPrices();
	CM.Cache.CachePP();
}
