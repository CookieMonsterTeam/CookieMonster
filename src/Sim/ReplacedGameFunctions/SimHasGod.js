import { SimObjects } from '../VariablesAndData';

/**
 * This function checks for the current God level in the sim data
 * It functions similarly to Game.hasGod()
 * @param	{string}	what	Name of the achievement
 */
export default function SimHasGod(what) {
	if (Game.hasGod) {
		if (SimObjects.Temple.minigame === undefined) {
			SimObjects.Temple.minigame = Game.Objects.Temple.minigame;
		}
		const god = SimObjects.Temple.minigame.gods[what];
		for (let i = 0; i < 3; i++) {
			if (SimObjects.Temple.minigame.slot[i] === god.id) {
				return i + 1;
			}
		}
	}
	return false;
}
