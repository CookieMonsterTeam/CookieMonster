import { TooltipWrinklerArea, TooltipWrinklerBeingShown } from '../../Disp/VariablesAndData'; // eslint-disable-line no-unused-vars

/**
 * This function creates .onmouseover/out events that determine if the mouse is hovering-over a Wrinkler
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
export default function AddWrinklerAreaDetect() {
  l('backgroundLeftCanvas').onmouseover = function () {
    TooltipWrinklerArea = 1;
  };
  l('backgroundLeftCanvas').onmouseout = function () {
    TooltipWrinklerArea = 0;
    Game.tooltip.hide();
    Object.keys(Game.wrinklers).forEach((i) => {
      TooltipWrinklerBeingShown[i] = 0;
    });
  };
}
