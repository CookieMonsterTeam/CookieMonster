/**
 * Section: Functions related to caching PP */

import CacheBuildingsPP from './Building';
import CacheUpgradePP from './Upgrade';

/**
 * This functions caches the PP of each building and upgrade and stores it in the cache
 * It is called by CM.Cache.LoopCache() and CM.Cache.InitCache()
 */
export default function CachePP() {
  CacheBuildingsPP();
  CacheUpgradePP();
}
