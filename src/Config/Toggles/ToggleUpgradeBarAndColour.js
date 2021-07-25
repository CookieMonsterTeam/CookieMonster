import UpdateUpgrades from '../../Disp/BuildingsUpgrades/Upgrades';

/**
 * This function toggles the upgrade bar and the colours of upgrades
 * It is called by a change in CM.Options.UpBarColour
 */
export default function ToggleUpgradeBarAndColour() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColour === 1) {
    // Colours and bar on
    l('CMUpgradeBar').style.display = '';
    UpdateUpgrades();
  } else if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColour === 2
  ) {
    // Colours on and bar off
    l('CMUpgradeBar').style.display = 'none';
    UpdateUpgrades();
  } else {
    // Colours and bar off
    l('CMUpgradeBar').style.display = 'none';
    Game.RebuildUpgrades();
  }
}
