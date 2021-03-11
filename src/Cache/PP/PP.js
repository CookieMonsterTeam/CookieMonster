
/**
 * Section: Functions related to caching PP */

/**
 * This functions caches the PP of each building and upgrade and stores it in the cache
 * It is called by CM.Cache.LoopCache() and CM.Cache.InitCache()
 */
 CM.Cache.CachePP = function () {
	CM.Cache.CacheBuildingsPP();
	CM.Cache.CacheUpgradePP();
};

/**
 * This functions return the colour assosciated with the given pp value
 * It is called by CM.Cache.CacheBuildingsPP(), CM.Cache.CacheBuildingsBulkPP() and CM.Cache.CacheUpgradePP()
 * @params	{object}	obj		The obj of which the pp value should be checked
 * @params	{number}	price	The price of the object
 * @returns {string}	color	The colour assosciated with the pp value
 */
CM.Cache.ColourOfPP = function (me, price) {
	let color = '';
	// Colour based on PP
	if (me.pp <= 0 || me.pp === Infinity) color = CM.Disp.colorGray;
	else if (me.pp < CM.Cache.min) color = CM.Disp.colorBlue;
	else if (me.pp === CM.Cache.min) color = CM.Disp.colorGreen;
	else if (me.pp === CM.Cache.max) color = CM.Disp.colorRed;
	else if (me.pp > CM.Cache.max) color = CM.Disp.colorPurple;
	else if (me.pp > CM.Cache.mid) color = CM.Disp.colorOrange;
	else color = CM.Disp.colorYellow;

	// Colour based on price in terms of CPS
	if (Number(CM.Options.PPSecondsLowerLimit) !== 0) {
		if (price / CM.Disp.GetCPS() < Number(CM.Options.PPSecondsLowerLimit)) color = CM.Disp.colorBlue;
	}
	// Colour based on being able to purchase
	if (CM.Options.PPOnlyConsiderBuyable) {
		if (price - Game.cookies > 0) color = CM.Disp.colorRed;
	}
	return color;
};

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CachePP()
 */
CM.Cache.CacheBuildingsPP = function () {
	CM.Cache.min = Infinity;
	CM.Cache.max = 1;
	CM.Cache.ArrayOfPPs = [];
	if (typeof CM.Options.PPExcludeTop === 'undefined') CM.Options.PPExcludeTop = 0; // Otherwise breaks during initialization

	// Calculate PP and colors when compared to purchase of optimal building in single-purchase mode
	if (CM.Options.ColorPPBulkMode === 0 && Game.buyMode > 0) {
		for (const i of Object.keys(CM.Cache.Objects1)) {
			if (Game.cookiesPs) {
				CM.Cache.Objects1[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CM.Cache.Objects1[i].bonus);
			} else CM.Cache.Objects1[i].pp = (Game.Objects[i].getPrice() / CM.Cache.Objects1[i].bonus);
			CM.Cache.ArrayOfPPs.push([CM.Cache.Objects1[i].pp, Game.Objects[i].getPrice()]);
		}
		// Set CM.Cache.min to best non-excluded buidliung
		CM.Cache.ArrayOfPPs.sort((a, b) => a[0] - b[0]);
		if (CM.Options.PPOnlyConsiderBuyable) {
			while (CM.Cache.ArrayOfPPs[0][1] > Game.cookies) {
				if (CM.Cache.ArrayOfPPs.length === 1) {
					break;
				}
				CM.Cache.ArrayOfPPs.shift();
			}
		}
		CM.Cache.min = CM.Cache.ArrayOfPPs[CM.Options.PPExcludeTop][0];
		CM.Cache.max = CM.Cache.ArrayOfPPs[CM.Cache.ArrayOfPPs.length - 1][0];
		CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
		for (const i of Object.keys(CM.Cache.Objects1)) {
			CM.Cache.Objects1[i].color = CM.Cache.ColourOfPP(CM.Cache.Objects1[i], Game.Objects[i].getPrice());
			// Colour based on excluding certain top-buildings
			for (let j = 0; j < CM.Options.PPExcludeTop; j++) {
				if (CM.Cache.Objects1[i].pp === CM.Cache.ArrayOfPPs[j][0]) CM.Cache.Objects1[i].color = CM.Disp.colorGray;
			}
		}
		// Calculate PP of bulk-buy modes
		CM.Cache.CacheBuildingsBulkPP('Objects10');
		CM.Cache.CacheBuildingsBulkPP('Objects100');
	} else if (Game.buyMode > 0) {
		// Calculate PP and colors when compared to purchase of selected bulk mode
		const target = `Objects${Game.buyBulk}`;
		for (const i of Object.keys(CM.Cache[target])) {
			if (Game.cookiesPs) {
				CM.Cache[target][i].pp = (Math.max(Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].bulkPrice / CM.Cache[target][i].bonus);
			} else CM.Cache[target][i].pp = (Game.Objects[i].bulkPrice / CM.Cache[target][i].bonus);
			CM.Cache.ArrayOfPPs.push([CM.Cache[target][i].pp, Game.Objects[i].bulkPrice]);
		}
		// Set CM.Cache.min to best non-excluded buidliung
		CM.Cache.ArrayOfPPs.sort((a, b) => a[0] - b[0]);
		if (CM.Options.PPOnlyConsiderBuyable) {
			while (CM.Cache.ArrayOfPPs[0][1] > Game.cookies) {
				if (CM.Cache.ArrayOfPPs.length === 1) {
					break;
				}
				CM.Cache.ArrayOfPPs.shift();
			}
		}
		CM.Cache.min = CM.Cache.ArrayOfPPs[CM.Options.PPExcludeTop][0];
		CM.Cache.max = CM.Cache.ArrayOfPPs[CM.Cache.ArrayOfPPs.length - 1][0];
		CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;

		for (const i of Object.keys(CM.Cache.Objects1)) {
			CM.Cache[target][i].color = CM.Cache.ColourOfPP(CM.Cache[target][i], Game.Objects[i].bulkPrice);
			// Colour based on excluding certain top-buildings
			for (let j = 0; j < CM.Options.PPExcludeTop; j++) {
				if (CM.Cache[target][i].pp === CM.Cache.ArrayOfPPs[j][0]) CM.Cache[target][i].color = CM.Disp.colorGray;
			}
		}
	}
};

/**
 * This functions caches the buildings of bulk-buy mode when PP is compared against optimal single-purchase building
 * It saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CacheBuildingsPP()
 */
CM.Cache.CacheBuildingsBulkPP = function (target) {
	for (const i of Object.keys(CM.Cache[target])) {
		if (Game.cookiesPs) {
			CM.Cache[target][i].pp = (Math.max(CM.Cache[target][i].price - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (CM.Cache[target][i].price / CM.Cache[target][i].bonus);
		} else CM.Cache[target][i].pp = (CM.Cache[target][i].price / CM.Cache[target][i].bonus);

		CM.Cache[target][i].color = CM.Cache.ColourOfPP(CM.Cache[target][i], CM.Cache[target][i].price);
	}
};

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Upgrades
 * It is called by CM.Cache.CachePP()
 */
CM.Cache.CacheUpgradePP = function () {
	for (const i of Object.keys(CM.Cache.Upgrades)) {
		if (Game.cookiesPs) {
			CM.Cache.Upgrades[i].pp = (Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		} else CM.Cache.Upgrades[i].pp = (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		if (Number.isNaN(CM.Cache.Upgrades[i].pp)) CM.Cache.Upgrades[i].pp = Infinity;

		CM.Cache.Upgrades[i].color = CM.Cache.ColourOfPP(CM.Cache.Upgrades[i], Game.Upgrades[i].getPrice());
	}
};