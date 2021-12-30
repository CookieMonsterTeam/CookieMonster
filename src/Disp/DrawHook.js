import ToggleWrinklerButtons from '../Config/Toggles/ToggleWrinklerButtons';
import UpdateBuildings from './BuildingsUpgrades/Buildings';
import UpdateUpgradeSectionsHeight from './BuildingsUpgrades/UpdateUpgradeSectionsHeight';
import UpdateUpgrades from './BuildingsUpgrades/Upgrades';
import { UpdateBotBar } from './InfoBars/BottomBar';
import { UpdateTimerBar } from './InfoBars/TimerBar';
import RefreshMenu from './MenuSections/Refreshmenu';
import UpdateTooltips from './Tooltips/UpdateTooltips';
import { CheckWrinklerTooltip, UpdateWrinklerTooltip } from './Tooltips/WrinklerTooltips';

/**
 * This function handles all custom drawing for the Game.Draw() function.
 * It is hooked on 'draw' by CM.RegisterHooks()
 */
export default function CMDrawHook() {
  // Draw autosave timer in stats menu, this must be done here to make it count down correctly
  if (
    Game.prefs.autosave &&
    Game.drawT % 10 === 0 && // with autosave ON and every 10 ticks
    Game.onMenu === 'stats' &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Stats // while being on the stats menu only
  ) {
    const timer = document.getElementById('CMStatsAutosaveTimer');
    if (timer) {
      timer.innerText = Game.sayTime(Game.fps * 60 - (Game.T % (Game.fps * 60)), 4);
    }
  }

  // Update colours
  UpdateBuildings();
  UpdateUpgrades();
  UpdateUpgradeSectionsHeight();

  // Redraw timers
  UpdateTimerBar();

  // Update Bottom Bar
  UpdateBotBar();

  // Update Tooltip
  UpdateTooltips();

  // Update Wrinkler Tooltip
  CheckWrinklerTooltip();
  UpdateWrinklerTooltip();

  // Change menu refresh interval
  RefreshMenu();

  // Update display of wrinkler buttons, this checks if Elder Pledge has been bought and if they should be disabled
  ToggleWrinklerButtons();
}
