import { SimObjects } from '../../Sim/VariablesAndData';
import Beautify from '../BeautifyAndFormatting/Beautify';
import {
  TooltipWrinkler,
  TooltipWrinklerArea,
  TooltipWrinklerBeingShown,
} from '../VariablesAndData';

/**
 * This function checks and create a tooltip for the wrinklers
 * It is called by CM.Disp.Draw()
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
export function CheckWrinklerTooltip() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipWrink === 1 &&
    TooltipWrinklerArea === 1
  ) {
    // Latter is set by CM.Main.AddWrinklerAreaDetect
    let showingTooltip = false;
    Object.keys(Game.wrinklers).forEach((i) => {
      const me = Game.wrinklers[i];
      if (me.phase > 0 && me.selected) {
        showingTooltip = true;
        if (TooltipWrinklerBeingShown[i] === 0 || TooltipWrinklerBeingShown[i] === undefined) {
          const placeholder = document.createElement('div');
          const wrinkler = document.createElement('div');
          wrinkler.style.minWidth = '120px';
          wrinkler.style.marginBottom = '4px';
          const div = document.createElement('div');
          div.style.textAlign = 'center';
          div.id = 'CMTooltipWrinkler';
          wrinkler.appendChild(div);
          placeholder.appendChild(wrinkler);
          Game.tooltip.draw(this, escape(placeholder.innerHTML));
          TooltipWrinkler = i;
          TooltipWrinklerBeingShown[i] = 1;
        }
      } else {
        TooltipWrinklerBeingShown[i] = 0;
      }
    });
    if (!showingTooltip) {
      Game.tooltip.hide();
    }
  }
}

/**
 * This function updates the amount to be displayed by the wrinkler tooltip created by CM.Disp.CheckWrinklerTooltip()
 * It is called by CM.Disp.Draw()
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
export function UpdateWrinklerTooltip() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipWrink === 1 &&
    l('CMTooltipWrinkler') !== null
  ) {
    let { sucked } = Game.wrinklers[TooltipWrinkler];
    let toSuck = 1.1;
    if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
    if (Game.wrinklers[TooltipWrinkler].type === 1) toSuck *= 3; // Shiny wrinklers
    sucked *= toSuck;
    if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
    if (SimObjects.Temple.minigameLoaded) {
      const godLvl = Game.hasGod('scorn');
      if (godLvl === 1) sucked *= 1.15;
      else if (godLvl === 2) sucked *= 1.1;
      else if (godLvl === 3) sucked *= 1.05;
    }
    l('CMTooltipWrinkler').textContent = Beautify(sucked);
  }
}
