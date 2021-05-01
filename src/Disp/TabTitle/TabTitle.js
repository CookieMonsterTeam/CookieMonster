/** Functions related to updating the tab in the browser's tab-bar */

import { CacheSeasonPopShimmer, CacheSpawnedGoldenShimmer } from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import { LastSeasonPopupState, LastTickerFortuneState } from '../../Main/VariablesAndData';
import { Title } from '../VariablesAndData';

/**
 * This function updates the tab title
 * It is called on every loop by Game.Logic() which also sets CM.Disp.Title to Game.cookies
 */
export default function UpdateTitle() {
  if (Game.OnAscend || CMOptions.Title === 0) {
    document.title = Title;
  } else if (CMOptions.Title === 1) {
    let addFC = false;
    let addSP = false;
    let titleGC;
    let titleFC;
    let titleSP;

    if (CacheSpawnedGoldenShimmer) {
      if (CacheSpawnedGoldenShimmer.wrath)
        titleGC = `[W${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
      else titleGC = `[G${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
    } else if (!Game.Has('Golden switch [off]')) {
      titleGC = `[${Number(l('CMTimerBarGCMinBar').textContent) < 0 ? '!' : ''}${Math.ceil(
        (Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps,
      )}]`;
    } else titleGC = '[GS]';

    if (LastTickerFortuneState) {
      addFC = true;
      titleFC = '[F]';
    }

    if (Game.season === 'christmas') {
      addSP = true;
      if (LastSeasonPopupState) titleSP = `[R${Math.ceil(CacheSeasonPopShimmer.life / Game.fps)}]`;
      else {
        titleSP = `[${Number(l('CMTimerBarRenMinBar').textContent) < 0 ? '!' : ''}${Math.ceil(
          (Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps,
        )}]`;
      }
    }

    // Remove previous timers and add current cookies
    let str = Title;
    if (str.charAt(0) === '[') {
      str = str.substring(str.lastIndexOf(']') + 1);
    }
    document.title = `${titleGC + (addFC ? titleFC : '') + (addSP ? titleSP : '')} ${str}`;
  } else if (CMOptions.Title === 2) {
    let str = '';
    let spawn = false;
    if (CacheSpawnedGoldenShimmer) {
      spawn = true;
      if (CacheSpawnedGoldenShimmer.wrath)
        str += `[W${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
      else str += `[G${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
    }
    if (LastTickerFortuneState) {
      spawn = true;
      str += '[F]';
    }
    if (Game.season === 'christmas' && LastSeasonPopupState) {
      str += `[R${Math.ceil(CacheSeasonPopShimmer.life / Game.fps)}]`;
      spawn = true;
    }
    if (spawn) str += ' - ';
    let title = 'Cookie Clicker';
    if (Game.season === 'fools') title = 'Cookie Baker';
    str += title;
    document.title = str;
  }
}
