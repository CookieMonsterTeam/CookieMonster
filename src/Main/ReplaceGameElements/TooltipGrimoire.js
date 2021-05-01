import { CreateTooltip } from '../../Disp/Tooltips/Tooltip';
import { TooltipGrimoireBackup } from '../VariablesAndData';

/**
 * This function replaces the original .onmouseover functions of the Grimoire minigame
 */
export default function ReplaceTooltipGrimoire() {
  if (Game.Objects['Wizard tower'].minigameLoaded) {
    Object.keys(Game.Objects['Wizard tower'].minigame.spellsById).forEach((i) => {
      if (l(`grimoireSpell${i}`).onmouseover !== null) {
        TooltipGrimoireBackup[i] = l(`grimoireSpell${i}`).onmouseover;
        l(`grimoireSpell${i}`).onmouseover = function () {
          Game.tooltip.dynamic = 1;
          Game.tooltip.draw(this, () => CreateTooltip('g', `${i}`), 'this');
          Game.tooltip.wobble();
        };
      }
    });
  }
}
