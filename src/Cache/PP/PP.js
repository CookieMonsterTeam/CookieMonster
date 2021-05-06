/**
 * Section: Functions related to caching PP */

import { CacheObjects1, CacheObjects10, CacheObjects100, CacheUpgrades } from '../VariablesAndData';
import CacheBuildingsPP from './Building';
import CacheUpgradePP from './Upgrade';

/**
 * This functions caches the PP of each building and upgrade and stores it in the cache
 * It is called by CM.Cache.LoopCache() and CM.Cache.InitCache()
 */
export default function CachePP() {
  CacheBuildingsPP();
  CacheUpgradePP();
  window.CookieMonsterData.Objects1 = JSON.parse(JSON.stringify(CacheObjects1));
  window.CookieMonsterData.Objects10 = JSON.parse(JSON.stringify(CacheObjects10));
  window.CookieMonsterData.Objects100 = JSON.parse(JSON.stringify(CacheObjects100));
  window.CookieMonsterData.Upgrades = [];
  Object.entries(CacheUpgrades).forEach((i) => {
    window.CookieMonsterData.Upgrades[i[0]] = JSON.parse(JSON.stringify(i[1]));
  });
}
