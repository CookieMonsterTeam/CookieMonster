import { CMOptions } from '../Config/VariablesAndData';
import { Beautify } from './BeautifyAndFormatting/BeautifyFormatting';
import UpdateBuildings from './BuildingsUpgrades/Buildings';
import UpdateUpgrades from './BuildingsUpgrades/Upgrades';
import { UpdateBotBar } from './InfoBars/BottomBar';
import { UpdateTimerBar } from './InfoBars/TimerBar';
import RefreshMenu from './MenuSections/Refreshmenu';
import UpdateTooltips from './Tooltips/UpdateTooltips';
import {
  CheckWrinklerTooltip,
  UpdateWrinklerTooltip,
} from './Tooltips/WrinklerTooltips';

/**
 * This function handles all custom drawing for the Game.Draw() function.
 * It is hooked on 'draw' by CM.RegisterHooks()
 */
export default function Draw() {
  // Draw autosave timer in stats menu, this must be done here to make it count down correctly
  if (
    Game.prefs.autosave &&
    Game.drawT % 10 === 0 && // with autosave ON and every 10 ticks
    Game.onMenu === 'stats' &&
    CMOptions.Stats // while being on the stats menu only
  ) {
    const timer = document.getElementById('CMStatsAutosaveTimer');
    if (timer) {
      timer.innerText = Game.sayTime(
        Game.fps * 60 - (Game.T % (Game.fps * 60)),
        4,
      );
    }
  }

  // Update colors
  UpdateBuildings();
  UpdateUpgrades();

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

  // Replace Cookies counter because Orteil uses very weird code to "pad" it...
  if (CMOptions.Scale) {
    let str = l('cookies').innerHTML.replace(
      /.*(?=<br>)/i,
      Beautify(Game.cookies),
    );
    if (Game.prefs.monospace) str = `<span class="monospace">${str}</span>`;
    l('cookies').innerHTML = str;
  }
}
