import { CacheSeaSpec } from '../VariablesAndData'; // eslint-disable-line no-unused-vars

/**
 * This functions caches the reward of popping a reindeer
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{number}	CM.Cache.SeaSpec	The reward for popping a reindeer
 */
export default function CacheSeasonSpec() {
  if (Game.season === 'christmas') {
    let val = Game.cookiesPs * 60;
    if (Game.hasBuff('Elder frenzy')) val *= 0.5;
    if (Game.hasBuff('Frenzy')) val *= 0.75;
    CacheSeaSpec = Math.max(25, val);
    if (Game.Has('Ho ho ho-flavored frosting')) CacheSeaSpec *= 2;
  }
}
