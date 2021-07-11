/**
 * This function updates the display setting of the two objects created by CM.Disp.CreateWrinklerButtons()
 * It is called by changes in CM.Options.WrinklerButtons
 */
export default function ToggleSectionHideButtons() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.HideSectionsButtons) {
    l('CMSectionHidButtons').style.display = '';
  } else {
    l('CMSectionHidButtons').style.display = 'none';
  }
}
