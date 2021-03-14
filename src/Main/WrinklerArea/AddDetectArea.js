/* eslint-disable no-unused-vars */
import { TooltipWrinklerArea, TooltipWrinklerBeingShown } from '../../Disp/VariablesAndData';

/**
 * This function creates .onmouseover/out events that determine if the mouse is hovering-over a Wrinkler
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
export default function AddWrinklerAreaDetect() {
	l('backgroundLeftCanvas').onmouseover = function () { TooltipWrinklerArea = 1; };
	l('backgroundLeftCanvas').onmouseout = function () {
		TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (const i of Object.keys(Game.wrinklers)) {
			TooltipWrinklerBeingShown[i] = 0;
		}
	};
}
