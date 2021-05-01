import { CreateTooltip } from '../../Disp/Tooltips/Tooltip';
import { TooltipUpgradeBackup } from '../VariablesAndData';

/**
 * This function replaces the original .onmouseover functions of upgrades so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'u'
 * It is called by Game.RebuildUpgrades() through CM.Main.ReplaceNative() and is therefore not permanent like the other ReplaceTooltip functions
 */
export default function ReplaceTooltipUpgrade() {
  TooltipUpgradeBackup = [];
  Object.keys(Game.UpgradesInStore).forEach((i) => {
    if (l(`upgrade${i}`).onmouseover !== null) {
      TooltipUpgradeBackup[i] = l(`upgrade${i}`).onmouseover;
      l(`upgrade${i}`).onmouseover = function () {
        if (!Game.mouseDown) {
          Game.setOnCrate(this);
          Game.tooltip.dynamic = 1;
          Game.tooltip.draw(this, () => CreateTooltip('u', `${i}`), 'store');
          Game.tooltip.wobble();
        }
      };
    }
  });
}
