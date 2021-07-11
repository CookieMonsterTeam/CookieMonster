import { CacheWrinklersFattest, CacheWrinklersTotal } from '../../Cache/VariablesAndData';

/**
 * This function returns the total amount stored in the Wrinkler Bank
 * as calculated by  CM.Cache.CacheWrinklers() if CM.Options.CalcWrink is set
 * @returns	{number}	0 or the amount of cookies stored (CM.Cache.WrinklersTotal)
 */
export default function GetWrinkConfigBank() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 1) {
    return CacheWrinklersTotal;
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 2) {
    return CacheWrinklersFattest[0];
  }
  return 0;
}
