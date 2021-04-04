import { VersionMajor, VersionMinor } from '../Data/Moddata';
import CMDrawHook from '../Disp/DrawHook';
import CMClickHook from '../Main/ClickHook';
import InitializeCookieMonster from '../Main/Initialization';
import CMLoopHook from '../Main/LoopHook';
import { isInitializing } from './Variables';

/**
 * This creates a init function for the CM object. Per Game code/comments:
 * "this function is called as soon as the mod is registered
 * declare hooks here"
 * It starts the further initialization of CookieMonster and registers hooks
 */
export default function init() {
  isInitializing = true;
  let proceed = true;
  if (Game.version !== Number(VersionMajor)) {
    // eslint-disable-next-line no-restricted-globals, no-alert
    proceed = confirm(
      `Cookie Monster version ${VersionMajor}.${VersionMinor} is meant for Game version ${VersionMajor}. Loading a different version may cause errors. Do you still want to load Cookie Monster?`,
    );
  }
  if (proceed) {
    InitializeCookieMonster();
    Game.registerHook('draw', CMDrawHook);
    Game.registerHook('logic', CMLoopHook);
    Game.registerHook('click', CMClickHook);
    isInitializing = false; // eslint-disable-line no-unused-vars
  }
}
