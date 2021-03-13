/* eslint-disable no-unused-vars */
import { CMOptions } from '../../Config/VariablesAndData';
import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank';
import { ColorGray } from '../../Disp/VariablesAndData';
import {
	CacheArrayOfPPs,
	CacheMaxPP, CacheMidPP, CacheMinPP, CacheObjects1, CacheObjects10, CacheObjects100,
} from '../VariablesAndData';
import ColourOfPP from './ColourOfPP';

/**
 * This functions caches the buildings of bulk-buy mode when PP is compared against optimal single-purchase building
 * It saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CacheBuildingsPP()
 */
function CacheBuildingsBulkPP(target) {
	for (const i of Object.keys(target)) {
		if (Game.cookiesPs) {
			target[i].pp = (Math.max(target[i].price - (Game.cookies + GetWrinkConfigBank()), 0) / Game.cookiesPs) + (target[i].price / target[i].bonus);
		} else target[i].pp = (target[i].price / target[i].bonus);

		target[i].color = ColourOfPP(target[i], target[i].price);
	}
}

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CachePP()
 */
export default function CacheBuildingsPP() {
	CacheMinPP = Infinity;
	CacheMaxPP = 1;
	CacheArrayOfPPs = [];
	if (typeof CMOptions.PPExcludeTop === 'undefined') CMOptions.PPExcludeTop = 0; // Otherwise breaks during initialization

	// Calculate PP and colors when compared to purchase of optimal building in single-purchase mode
	if (CMOptions.ColorPPBulkMode === 0 && Game.buyMode > 0) {
		for (const i of Object.keys(CacheObjects1)) {
			if (Game.cookiesPs) {
				CacheObjects1[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CacheObjects1[i].bonus);
			} else CacheObjects1[i].pp = (Game.Objects[i].getPrice() / CacheObjects1[i].bonus);
			CacheArrayOfPPs.push([CacheObjects1[i].pp, Game.Objects[i].getPrice()]);
		}
		// Set CM.Cache.min to best non-excluded buidliung
		CacheArrayOfPPs.sort((a, b) => a[0] - b[0]);
		if (CMOptions.PPOnlyConsiderBuyable) {
			while (CacheArrayOfPPs[0][1] > Game.cookies) {
				if (CacheArrayOfPPs.length === 1) {
					break;
				}
				CacheArrayOfPPs.shift();
			}
		}
		CacheMinPP = CacheArrayOfPPs[CMOptions.PPExcludeTop][0];
		CacheMaxPP = CacheArrayOfPPs[CacheArrayOfPPs.length - 1][0];
		CacheMidPP = ((CacheMaxPP - CacheMinPP) / 2) + CacheMinPP;
		for (const i of Object.keys(CacheObjects1)) {
			CacheObjects1[i].color = ColourOfPP(CacheObjects1[i], Game.Objects[i].getPrice());
			// Colour based on excluding certain top-buildings
			for (let j = 0; j < CMOptions.PPExcludeTop; j++) {
				if (CacheObjects1[i].pp === CacheArrayOfPPs[j][0]) CacheObjects1[i].color = ColorGray;
			}
		}
		// Calculate PP of bulk-buy modes
		CacheBuildingsBulkPP(CacheObjects10);
		CacheBuildingsBulkPP(CacheObjects100);
	} else if (Game.buyMode > 0) {
		// Calculate PP and colors when compared to purchase of selected bulk mode
		let target;
		if (Game.buyBulk === 1) target = CacheObjects1;
		else if (Game.buyBulk === 10) target = CacheObjects10;
		else if (Game.buyBulk === 100) target = CacheObjects100;
		for (const i of Object.keys(target)) {
			if (Game.cookiesPs) {
				target[i].pp = (Math.max(Game.Objects[i].bulkPrice - (Game.cookies + GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].bulkPrice / target[i].bonus);
			} else target[i].pp = (Game.Objects[i].bulkPrice / target[i].bonus);
			CacheArrayOfPPs.push([target[i].pp, Game.Objects[i].bulkPrice]);
		}
		// Set CM.Cache.min to best non-excluded buidliung
		CacheArrayOfPPs.sort((a, b) => a[0] - b[0]);
		if (CMOptions.PPOnlyConsiderBuyable) {
			while (CacheArrayOfPPs[0][1] > Game.cookies) {
				if (CacheArrayOfPPs.length === 1) {
					break;
				}
				CacheArrayOfPPs.shift();
			}
		}
		CacheMinPP = CacheArrayOfPPs[CMOptions.PPExcludeTop][0];
		CacheMaxPP = CacheArrayOfPPs[CacheArrayOfPPs.length - 1][0];
		CacheMidPP = ((CacheMaxPP - CacheMinPP) / 2) + CacheMinPP;

		for (const i of Object.keys(CacheObjects1)) {
			target[i].color = ColourOfPP(target[i], Game.Objects[i].bulkPrice);
			// Colour based on excluding certain top-buildings
			for (let j = 0; j < CMOptions.PPExcludeTop; j++) {
				if (target[i].pp === CacheArrayOfPPs[j][0]) target[i].color = ColorGray;
			}
		}
	}
}
