/* eslint-disable no-unused-vars */
import { CacheSpawnedGoldenShimmer, CacheGoldenShimmersByID } from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import CreateGCTimer from '../../Disp/GoldenCookieTimers/GoldenCookieTimers';
import Flash from '../../Disp/Notifications/Flash';
import Notification from '../../Disp/Notifications/Notification';
import PlaySound from '../../Disp/Notifications/Sound';
import { UpdateFavicon } from '../../Disp/TabTitle/FavIcon';
import { GCTimers } from '../../Disp/VariablesAndData';
import { CurrSpawnedGoldenCookieState, LastGoldenCookieState, LastSpawnedGoldenCookieState } from '../VariablesAndData';

/**
 * Auxilirary function that finds all currently spawned shimmers.
 * CM.Cache.spawnedGoldenShimmer stores the non-user spawned cookie to later determine data for the favicon and tab-title
 * It is called by CM.CM.Main.CheckGoldenCookie
 */
function FindShimmer() {
	CurrSpawnedGoldenCookieState = 0;
	CacheGoldenShimmersByID = {};
	for (const i of Object.keys(Game.shimmers)) {
		CacheGoldenShimmersByID[Game.shimmers[i].id] = Game.shimmers[i];
		if (Game.shimmers[i].spawnLead && Game.shimmers[i].type === 'golden') {
			CacheSpawnedGoldenShimmer = Game.shimmers[i];
			CurrSpawnedGoldenCookieState += 1;
		}
	}
}

/**
 * This function checks for changes in the amount of Golden Cookies
 * It is called by CM.Main.Loop
 */
export default function CheckGoldenCookie() {
	FindShimmer();
	for (const i of Object.keys(GCTimers)) {
		if (typeof CacheGoldenShimmersByID[i] === 'undefined') {
			GCTimers[i].parentNode.removeChild(GCTimers[i]);
			delete GCTimers[i];
		}
	}
	if (LastGoldenCookieState !== Game.shimmerTypes.golden.n) {
		LastGoldenCookieState = Game.shimmerTypes.golden.n;
		if (LastGoldenCookieState) {
			if (LastSpawnedGoldenCookieState < CurrSpawnedGoldenCookieState) {
				Flash(3, 'GCFlash');
				PlaySound(CMOptions.GCSoundURL, 'GCSound', 'GCVolume');
				Notification('GCNotification', 'Golden Cookie Spawned', 'A Golden Cookie has spawned. Click it now!');
			}

			for (const i of Object.keys(Game.shimmers)) {
				if (typeof GCTimers[Game.shimmers[i].id] === 'undefined') {
					CreateGCTimer(Game.shimmers[i]);
				}
			}
		}
		UpdateFavicon();
		LastSpawnedGoldenCookieState = CurrSpawnedGoldenCookieState;
		if (CurrSpawnedGoldenCookieState === 0) CacheSpawnedGoldenShimmer = 0;
	} else if (CMOptions.GCTimer === 1 && LastGoldenCookieState) {
		for (const i of Object.keys(GCTimers)) {
			GCTimers[i].style.opacity = CacheGoldenShimmersByID[i].l.style.opacity;
			GCTimers[i].style.transform = CacheGoldenShimmersByID[i].l.style.transform;
			GCTimers[i].textContent = Math.ceil(CacheGoldenShimmersByID[i].life / Game.fps);
		}
	}
}
