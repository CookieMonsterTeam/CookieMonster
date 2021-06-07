/** Caches data related to Wrinklers */

import { SimObjects } from '../../Sim/VariablesAndData';
import {
  CacheWrinklersFattest,
  CacheWrinklersNormal, // eslint-disable-line no-unused-vars
  CacheWrinklersTotal, // eslint-disable-line no-unused-vars
} from '../VariablesAndData';

/**
 * This functions caches data related to Wrinklers
 * It is called by CM.Cache.LoopCache() and CM.Cache.InitCache()
 * @global	{number}				CM.Cache.WrinklersTotal		The cookies of all wrinklers
 * @global	{number}				CM.Cache.WrinklersNormal	The cookies of all normal wrinklers
 * @global	{[{number}, {number}]}	CM.Cache.WrinklersFattest	A list containing the cookies and the id of the fattest non-shiny wrinkler
 */
export default function CacheWrinklers() {
  CacheWrinklersTotal = 0;
  CacheWrinklersNormal = 0;
  CacheWrinklersFattest = [0, null];
  for (let i = 0; i < Game.wrinklers.length; i++) {
    let { sucked } = Game.wrinklers[i];
    let toSuck = 1.1;
    if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
    if (Game.wrinklers[i].type === 1) toSuck *= 3; // Shiny wrinklers
    sucked *= toSuck;
    if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
    if (SimObjects.Temple.minigameLoaded) {
      const godLvl = Game.hasGod('scorn');
      if (godLvl === 1) sucked *= 1.15;
      else if (godLvl === 2) sucked *= 1.1;
      else if (godLvl === 3) sucked *= 1.05;
    }
    CacheWrinklersTotal += sucked;
    if (Game.wrinklers[i].type === 0) {
      CacheWrinklersNormal += sucked;
      if (sucked > CacheWrinklersFattest[0]) CacheWrinklersFattest = [sucked, i];
    }
  }
}
