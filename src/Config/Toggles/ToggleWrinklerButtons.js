/**
 * This function updates the display setting of the two objects created by CM.Disp.CreateWrinklerButtons()
 * It is called by changes in CM.Options.WrinklerButtons
 */
export default function ToggleWrinklerButtons() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerButtons &&
    Game.elderWrath
  ) {
    l('PopAllNormalWrinklerButton').style.display = '';
    l('PopFattestWrinklerButton').style.display = '';
  } else {
    l('PopAllNormalWrinklerButton').style.display = 'none';
    l('PopFattestWrinklerButton').style.display = 'none';
  }
}
