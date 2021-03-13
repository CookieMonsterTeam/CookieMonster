import {
	CacheAvgCps, CacheCurrWrinklerCount, CacheCurrWrinklerCPSMult, CacheWrinklersFattest,
} from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';

/**
 * This function returns the cps as either current or average CPS depending on CM.Options.CPSMode
 * @returns	{number}	The average or current cps
 */
export default function GetCPS() {
	if (CMOptions.CPSMode) {
		return CacheAvgCps;
	} if (CMOptions.CalcWrink === 0) {
		return (Game.cookiesPs * (1 - Game.cpsSucked));
	} if (CMOptions.CalcWrink === 1) {
		return Game.cookiesPs * (CacheCurrWrinklerCPSMult + (1 - (CacheCurrWrinklerCount * 0.05)));
	} if (CMOptions.CalcWrink === 2 && Game.wrinklers[CacheWrinklersFattest[1]].type === 1) {
		return Game.cookiesPs * ((CacheCurrWrinklerCPSMult * 3 / CacheCurrWrinklerCount) + (1 - (CacheCurrWrinklerCount * 0.05)));
	}
	return Game.cookiesPs * ((CacheCurrWrinklerCPSMult / CacheCurrWrinklerCount) + (1 - (CacheCurrWrinklerCount * 0.05)));
}
