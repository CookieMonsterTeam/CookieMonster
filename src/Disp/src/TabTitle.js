/** Functions related to updating the tab in the browser's tab-bar */

import { Title } from './VariablesAndData';

/**
 * This function creates the Favicon, it is called by CM.Main.DelayInit()
 */
export function CreateFavicon() {
	const Favicon = document.createElement('link');
	Favicon.id = 'CMFavicon';
	Favicon.rel = 'shortcut icon';
	Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(Favicon);
}

/**
 * This function updates the Favicon depending on whether a Golden Cookie has spawned
 * It is called on every loop by CM.Main.CheckGoldenCookie() or by a change in CM.Options.Favicon
 * By relying on CM.Cache.spawnedGoldenShimmer it only changes for non-user spawned cookie
 */
export function UpdateFavicon() {
	if (CM.Options.Favicon === 1 && CM.Main.lastGoldenCookieState > 0) {
		if (CM.Cache.spawnedGoldenShimmer.wrath) l('CMFavicon').href = 'https://aktanusa.github.io/CookieMonster/favicon/wrathCookie.ico';
		else l('CMFavicon').href = 'https://aktanusa.github.io/CookieMonster/favicon/goldenCookie.ico';
	} else l('CMFavicon').href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
}

/**
 * This function updates the tab title
 * It is called on every loop by Game.Logic() which also sets CM.Disp.Title to Game.cookies
 */
export function UpdateTitle() {
	if (Game.OnAscend || CM.Options.Title === 0) {
		document.title = Title;
	} else if (CM.Options.Title === 1) {
		let addFC = false;
		let addSP = false;
		let titleGC;
		let titleFC;
		let titleSP;

		if (CM.Cache.spawnedGoldenShimmer) {
			if (CM.Cache.spawnedGoldenShimmer.wrath) titleGC = `[W${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
			else titleGC = `[G${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
		} else if (!Game.Has('Golden switch [off]')) {
			titleGC = `[${Number(l('CMTimerBarGCMinBar').textContent) < 0 ? '!' : ''}${Math.ceil((Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps)}]`;
		} else titleGC = '[GS]';

		if (CM.Main.lastTickerFortuneState) {
			addFC = true;
			titleFC = '[F]';
		}

		if (Game.season === 'christmas') {
			addSP = true;
			if (CM.Main.lastSeasonPopupState) titleSP = `[R${Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps)}]`;
			else {
				titleSP = `[${Number(l('CMTimerBarRenMinBar').textContent) < 0 ? '!' : ''}${Math.ceil((Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps)}]`;
			}
		}

		// Remove previous timers and add current cookies
		let str = Title;
		if (str.charAt(0) === '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}
		document.title = `${titleGC + (addFC ? titleFC : '') + (addSP ? titleSP : '')} ${str}`;
	} else if (CM.Options.Title === 2) {
		let str = '';
		let spawn = false;
		if (CM.Cache.spawnedGoldenShimmer) {
			spawn = true;
			if (CM.Cache.spawnedGoldenShimmer.wrath) str += `[W${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
			else str += `[G${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
		}
		if (CM.Main.lastTickerFortuneState) {
			spawn = true;
			str += '[F]';
		}
		if (Game.season === 'christmas' && CM.Main.lastSeasonPopupState) {
			str += `[R${Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps)}]`;
			spawn = true;
		}
		if (spawn) str += ' - ';
		let title = 'Cookie Clicker';
		if (Game.season === 'fools') title = 'Cookie Baker';
		str += title;
		document.title = str;
	}
}
