import {
  CacheAverageCPS,
  CacheCurrWrinklerCount,
  CacheCurrWrinklerCPSMult,
  CacheWrinklersFattest,
} from '../../Cache/VariablesAndData';

/**
 * This function returns the cps as either current or average CPS depending on CM.Options.CPSMode
 * @returns	{number}	The average or current cps
 */
export default function GetCPS() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CPSMode) {
    return CacheAverageCPS;
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 0) {
    return Game.cookiesPs * (1 - Game.cpsSucked);
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 1) {
    return Game.cookiesPs * (CacheCurrWrinklerCPSMult + (1 - CacheCurrWrinklerCount * 0.05));
  }
  if (CacheWrinklersFattest[1] !== null)
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 2 &&
      Game.wrinklers[CacheWrinklersFattest[1]].type === 1
    ) {
      return (
        Game.cookiesPs *
        ((CacheCurrWrinklerCPSMult * 3) / CacheCurrWrinklerCount +
          (1 - CacheCurrWrinklerCount * 0.05))
      );
    }
  return (
    Game.cookiesPs *
    (CacheCurrWrinklerCPSMult / CacheCurrWrinklerCount + (1 - CacheCurrWrinklerCount * 0.05))
  );
}
