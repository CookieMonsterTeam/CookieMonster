/**
 * This function toggles the position of the upgrade bar from fixed or non-fixed mode
 * It is called by a change in CM.Options.UpgradeBarFixedPos
 */
export default function ToggleUpgradeBarFixedPos() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpgradeBarFixedPos === 1
  ) {
    // Fix to top of screen when scrolling
    l('CMUpgradeBar').style.position = 'sticky';
    l('CMUpgradeBar').style.top = '0px';
  } else {
    l('CMUpgradeBar').style.position = ''; // Possible to scroll offscreen
  }
}
