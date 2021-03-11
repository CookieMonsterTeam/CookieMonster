/** Section: Functions related to caching income */

/**
 * This functions caches the income gain of each building and upgrade and stores it in the cache
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 */
export function CacheIncome() {
	// Simulate Building Buys for 1, 10 and 100 amount
	CacheBuildingIncome(1, 'Objects1');
	CacheBuildingIncome(10, 'Objects10');
	CacheBuildingIncome(100, 'Objects100');

	// Simulate Upgrade Buys
	CacheUpgradeIncome();
};

/**
 * This functions starts the calculation/simulation of the bonus income of buildings
 * It is called by CM.Cache.CacheIncome()
 * @param	{amount}	amount	Amount to be bought
 * @parem	{string}	target	The target Cache object ("Objects1", "Objects10" or "Objects100")
 */
function CacheBuildingIncome(amount, target) {
	CM.Cache[target] = [];
	for (const i of Object.keys(Game.Objects)) {
		CM.Cache[target][i] = {};
		CM.Cache[target][i].bonus = CM.Sim.BuyBuildingsBonusIncome(i, amount);
		if (amount !== 1) {
			CM.Cache.DoRemakeBuildPrices = 1;
		}
	}
};

/**
 * This functions starts the calculation/simulation of the bonus income of upgrades
 * It is called by CM.Cache.CacheIncome()
 */
function CacheUpgradeIncome() {
	CM.Cache.Upgrades = [];
	for (const i of Object.keys(Game.Upgrades)) {
		const bonusIncome = CM.Sim.BuyUpgradesBonusIncome(i);
		CM.Cache.Upgrades[i] = {};
		if (bonusIncome[0]) CM.Cache.Upgrades[i].bonus = bonusIncome[0];
		if (bonusIncome[1]) CM.Cache.Upgrades[i].bonusMouse = bonusIncome[1];
	}
};

/**
 * This functions caches the price of each building and stores it in the cache
 */
export function CacheBuildingsPrices() {
	for (const i of Object.keys(Game.Objects)) {
		CM.Cache.Objects1[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 1);
		CM.Cache.Objects10[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 10);
		CM.Cache.Objects100[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 100);
	}
};