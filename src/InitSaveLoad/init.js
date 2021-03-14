/* eslint-disable no-unused-vars */
import { VersionMajor, VersionMinor } from '../Data/Moddata';
import Draw from '../Disp/Draw';
import InitializeCookieMonster from '../Main/Initialization';
import CMLoop from '../Main/Loop';
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
		proceed = confirm(`Cookie Monster version ${VersionMajor}.${VersionMinor} is meant for Game version ${VersionMajor}.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?`);
	}
	if (proceed) {
		InitializeCookieMonster();
		Game.registerHook('draw', Draw);
		Game.registerHook('logic', CMLoop);
		isInitializing = false;
	}
}
