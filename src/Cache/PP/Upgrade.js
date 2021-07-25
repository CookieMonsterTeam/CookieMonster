import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank';
import { CacheUpgrades } from '../VariablesAndData';
import ColourOfPP from './ColourOfPP';

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Upgrades
 * It is called by CM.Cache.CachePP()
 */
export default function CacheUpgradePP() {
  Object.keys(CacheUpgrades).forEach((i) => {
    if (Game.cookiesPs) {
      CacheUpgrades[i].pp =
        Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + GetWrinkConfigBank()), 0) /
          Game.cookiesPs +
        Game.Upgrades[i].getPrice() / CacheUpgrades[i].bonus;
    } else CacheUpgrades[i].pp = Game.Upgrades[i].getPrice() / CacheUpgrades[i].bonus;
    if (Number.isNaN(CacheUpgrades[i].pp)) CacheUpgrades[i].pp = Infinity;

    CacheUpgrades[i].colour = ColourOfPP(CacheUpgrades[i], Game.Upgrades[i].getPrice());
  });
}
