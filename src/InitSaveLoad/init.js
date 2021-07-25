import { initFunctions } from '@cookiemonsterteam/cookiemonsterframework';
import { VersionMajor, VersionMinor } from '../Data/Moddata.ts';
import CMDrawHook from '../Disp/DrawHook';
import CMClickHook from '../Main/ClickHook';
import InitializeCookieMonster from '../Main/Initialization';
import CMLoopHook from '../Main/LoopHook';
import load from './load';

/**
 * This creates a init function for the CM object. Per Game code/comments:
 * "this function is called as soon as the mod is registered
 * declare hooks here"
 * It starts the further initialization of CookieMonster and registers hooks
 */
export default function init() {
  let proceed = true;

  // Load Cookie Monster Mod Framework and register mod
  initFunctions.initModFramework();
  window.cookieMonsterFrameworkData.isInitializing = true;
  initFunctions.registerMod('cookieMonsterMod');

  if (Game.version !== Number(VersionMajor)) {
    // eslint-disable-next-line no-restricted-globals, no-alert
    proceed = confirm(
      `Cookie Monster version ${VersionMajor}.${VersionMinor} is meant for Game version ${VersionMajor}. Loading a different version may cause errors. Do you still want to load Cookie Monster?`,
    );
  }
  if (proceed) {
    InitializeCookieMonster();
    Game.registerHook('click', CMClickHook);
    Game.registerHook('draw', CMDrawHook);
    Game.registerHook('logic', CMLoopHook);

    // Load default settings if no previous saveData is found
    if (typeof Game.modSaveData.cookieMonsterMod === 'undefined') {
      load('{}');
    }
  }
}
