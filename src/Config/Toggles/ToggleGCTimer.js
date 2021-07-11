import { CacheGoldenShimmersByID } from '../../Cache/VariablesAndData';
import { GCTimers } from '../../Disp/VariablesAndData';

/**
 * This function toggles GC Timers are visible
 * It is called by a change in CM.Options.GCTimer
 */
export default function ToggleGCTimer() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GCTimer === 1) {
    Object.keys(GCTimers).forEach((i) => {
      GCTimers[i].style.display = 'block';
      GCTimers[i].style.left = CacheGoldenShimmersByID[i].l.style.left;
      GCTimers[i].style.top = CacheGoldenShimmersByID[i].l.style.top;
    });
  } else {
    // eslint-disable-next-line no-return-assign
    Object.keys(GCTimers).forEach((i) => (GCTimers[i].style.display = 'none'));
  }
}
