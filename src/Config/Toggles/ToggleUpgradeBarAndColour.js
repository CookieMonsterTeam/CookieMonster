import UpdateUpgrades from '../../Disp/BuildingsUpgrades/Upgrades';
import { CMOptions } from '../VariablesAndData';

/**
 * This function toggles the upgrade bar and the colours of upgrades
 * It is called by a change in CM.Options.UpBarColor
 */
export default function ToggleUpgradeBarAndColor() {
  if (CMOptions.UpBarColor === 1) {
    // Colours and bar on
    l('CMUpgradeBar').style.display = '';
    UpdateUpgrades();
  } else if (CMOptions.UpBarColor === 2) {
    // Colours on and bar off
    l('CMUpgradeBar').style.display = 'none';
    UpdateUpgrades();
  } else {
    // Colours and bar off
    l('CMUpgradeBar').style.display = 'none';
    Game.RebuildUpgrades();
  }
}
