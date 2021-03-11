
/**
 * This functions caches variables related to missing upgrades
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{string}	CM.Cache.MissingUpgrades			String containig the HTML to create the "crates" for missing normal upgrades
 * @global	{string}	CM.Cache.MissingUpgradesCookies		String containig the HTML to create the "crates" for missing cookie upgrades
 * @global	{string}	CM.Cache.MissingUpgradesPrestige	String containig the HTML to create the "crates" for missing prestige upgrades
 */
 CM.Cache.CacheMissingUpgrades = function () {
	CM.Cache.MissingUpgrades = '';
	CM.Cache.MissingUpgradesCookies = '';
	CM.Cache.MissingUpgradesPrestige = '';
	const list = [];
	// sort the upgrades
	for (const i of Object.keys(Game.Upgrades)) {
		list.push(Game.Upgrades[i]);
	}
	const sortMap = function (a, b) {
		if (a.order > b.order) return 1;
		else if (a.order < b.order) return -1;
		return 0;
	};
	list.sort(sortMap);

	for (const i of Object.keys(list)) {
		const me = list[i];

		if (me.bought === 0) {
			let str = '';

			str += CM.Disp.crateMissing(me);
			if (me.pool === 'prestige') CM.Cache.MissingUpgradesPrestige += str;
			else if (me.pool === 'cookie') CM.Cache.MissingUpgradesCookies += str;
			else if (me.pool !== 'toggle' && me.pool !== 'unused' && me.pool !== 'debug') CM.Cache.MissingUpgrades += str;
		}
	}
};