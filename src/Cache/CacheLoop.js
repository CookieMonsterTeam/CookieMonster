import FormatTime from '../Disp/BeautifyAndFormatting/FormatTime';
import GetCPS from '../Disp/HelperFunctions/GetCPS';
import CacheAvgCPS from './CPS/CPS';
import CacheCurrWrinklerCPS from './CPS/CurrWrinklerCPS';
import CachePP from './PP/PP';
import CacheHeavenlyChipsPS from './Stats/HeavenlyChips';
import AllAmountTillNextAchievement from './TillNextAchievement/AllAmountTillNextAchievement';
import { CacheTimeTillNextPrestige } from './VariablesAndData'; // eslint-disable-line no-unused-vars
import CacheWrinklers from './Wrinklers/Wrinklers';

/**
 * This functions caches variables that are needed every loop
 * @global	{string}	CM.Cache.TimeTillNextPrestige	Time requried till next prestige level
 */
export default function LoopCache() {
  // Update Wrinkler Bank
  CacheWrinklers();

  CachePP();
  AllAmountTillNextAchievement(false);
  CacheCurrWrinklerCPS();
  CacheAvgCPS();
  CacheHeavenlyChipsPS();

  const cookiesToNext =
    Game.HowManyCookiesReset(
      Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned)) + 1,
    ) -
    (Game.cookiesEarned + Game.cookiesReset);
  CacheTimeTillNextPrestige = FormatTime(cookiesToNext / GetCPS());
}
