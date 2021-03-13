import { CacheWrinklersFattest, CacheWrinklersTotal } from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';

/**
 * This function returns the total amount stored in the Wrinkler Bank
 * as calculated by  CM.Cache.CacheWrinklers() if CM.Options.CalcWrink is set
 * @returns	{number}	0 or the amount of cookies stored (CM.Cache.WrinklersTotal)
 */
export default function GetWrinkConfigBank() {
	if (CMOptions.CalcWrink === 1) {
		return CacheWrinklersTotal;
	} else if (CMOptions.CalcWrink === 2) {
		return CacheWrinklersFattest[0];
	} else {
		return 0;
	}
}
