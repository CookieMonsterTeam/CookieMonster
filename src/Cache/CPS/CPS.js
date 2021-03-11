
/**
 * Section: Functions related to caching CPS */

export let CM.Cache.NoGoldSwitchCookiesPS = 0;
export let CM.Cache.CentEgg = 0;

/**
 * This functions caches creates the CMAvgQueue used by CM.Cache.CacheAvgCPS() to calculate CPS
 * Called by CM.Cache.InitCache()
 */
 CM.Cache.InitCookiesDiff = function () {
	CM.Cache.CookiesDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.WrinkDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.WrinkFattestDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.ChoEggDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.ClicksDiff = new CMAvgQueue(CM.Disp.clickTimes[CM.Disp.clickTimes.length - 1]);
};

/**
 * This functions caches two variables related average CPS and Clicks
 * It is called by CM.Cache.LoopCache()
 * @global	{number}	CM.Cache.RealCookiesEarned	Cookies earned including the Chocolate Egg
 * @global	{number}	CM.Cache.AvgCPS				Average cookies over time-period as defined by AvgCPSHist
 * @global	{number}	CM.Cache.AverageClicks		Average cookies from clicking over time-period as defined by AvgClicksHist
 * @global	{number}	CM.Cache.AvgCPSChoEgg		Average cookies from combination of normal CPS and average Chocolate Cookie CPS
 */
CM.Cache.CacheAvgCPS = function () {
	const currDate = Math.floor(Date.now() / 1000);
	// Only calculate every new second
	if ((Game.T / Game.fps) % 1 === 0) {
		let choEggTotal = Game.cookies + CM.Cache.SellForChoEgg;
		if (Game.cpsSucked > 0) choEggTotal += CM.Cache.WrinklersTotal;
		CM.Cache.RealCookiesEarned = Math.max(Game.cookiesEarned, choEggTotal);
		choEggTotal *= 0.05;

		// Add recent gains to AvgQueue's
		const timeDiff = currDate - CM.Cache.lastCPSCheck;
		const bankDiffAvg = Math.max(0, (Game.cookies - CM.Cache.lastCookies)) / timeDiff;
		const wrinkDiffAvg = Math.max(0, (CM.Cache.WrinklersTotal - CM.Cache.lastWrinkCookies)) / timeDiff;
		const wrinkFattestDiffAvg = Math.max(0, (CM.Cache.WrinklersFattest[0] - CM.Cache.lastWrinkFattestCookies)) / timeDiff;
		const choEggDiffAvg = Math.max(0, (choEggTotal - CM.Cache.lastChoEgg)) / timeDiff;
		const clicksDiffAvg = (Game.cookieClicks - CM.Cache.lastClicks) / timeDiff;
		for (let i = 0; i < timeDiff; i++) {
			CM.Cache.CookiesDiff.addLatest(bankDiffAvg);
			CM.Cache.WrinkDiff.addLatest(wrinkDiffAvg);
			CM.Cache.WrinkFattestDiff.addLatest(wrinkFattestDiffAvg);
			CM.Cache.ChoEggDiff.addLatest(choEggDiffAvg);
			CM.Cache.ClicksDiff.addLatest(clicksDiffAvg);
		}

		// Store current data for next loop
		CM.Cache.lastCPSCheck = currDate;
		CM.Cache.lastCookies = Game.cookies;
		CM.Cache.lastWrinkCookies = CM.Cache.WrinklersTotal;
		CM.Cache.lastWrinkFattestCookies = CM.Cache.WrinklersFattest[0];
		CM.Cache.lastChoEgg = choEggTotal;
		CM.Cache.lastClicks = Game.cookieClicks;

		// Get average gain over period of cpsLength seconds
		const cpsLength = CM.Disp.cookieTimes[CM.Options.AvgCPSHist];
		CM.Cache.AverageGainBank = CM.Cache.CookiesDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainWrink = CM.Cache.WrinkDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainWrinkFattest = CM.Cache.WrinkFattestDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainChoEgg = CM.Cache.ChoEggDiff.calcAverage(cpsLength);
		CM.Cache.AvgCPS = CM.Cache.AverageGainBank;
		if (CM.Options.CalcWrink === 1) CM.Cache.AvgCPS += CM.Cache.AverageGainWrink;
		if (CM.Options.CalcWrink === 2) CM.Cache.AvgCPS += CM.Cache.AverageGainWrinkFattest;

		const choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));

		if (choEgg || CM.Options.CalcWrink === 0) {
			CM.Cache.AvgCPSWithChoEgg = CM.Cache.AverageGainBank + CM.Cache.AverageGainWrink + (choEgg ? CM.Cache.AverageGainChoEgg : 0);
		} else CM.Cache.AvgCPSWithChoEgg = CM.Cache.AvgCPS;

		CM.Cache.AverageClicks = CM.Cache.ClicksDiff.calcAverage(CM.Disp.clickTimes[CM.Options.AvgClicksHist]);
	}
};

/**
 * This functions caches the reward for selling the Chocolate egg
 * It is called by CM.Main.Loop()
 * @global	{number}	CM.Cache.SellForChoEgg	Total cookies to be gained from selling Chocolate egg
 */
CM.Cache.CacheSellForChoEgg = function () {
	let sellTotal = 0;
	// Compute cookies earned by selling stock market goods
	if (Game.Objects.Bank.minigameLoaded) {
		const marketGoods = Game.Objects.Bank.minigame.goods;
		let goodsVal = 0;
		for (const i of Object.keys(marketGoods)) {
			const marketGood = marketGoods[i];
			goodsVal += marketGood.stock * marketGood.val;
		}
		sellTotal += goodsVal * Game.cookiesPsRawHighest;
	}
	// Compute cookies earned by selling all buildings with optimal auras (ES + RB)
	sellTotal += CM.Sim.SellBuildingsForChoEgg();
	CM.Cache.SellForChoEgg = sellTotal;
};

/**
 * This functions caches the current Wrinkler CPS multiplier
 * It is called by CM.Cache.LoopCache(). Variables are mostly used by CM.Disp.GetCPS().
 * @global	{number}	CM.Cache.CurrWrinklerCount		Current number of wrinklers
 * @global	{number}	CM.Cache.CurrWrinklerCPSMult	Current multiplier of CPS because of wrinklers (excluding their negative sucking effect)
 */
CM.Cache.CacheCurrWrinklerCPS = function () {
	CM.Cache.CurrWrinklerCPSMult = 0;
	let count = 0;
	for (const i in Game.wrinklers) {
		if (Game.wrinklers[i].phase === 2) count++;
	}
	let godMult = 1;
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		const godLvl = Game.hasGod('scorn');
		if (godLvl === 1) godMult *= 1.15;
		else if (godLvl === 2) godMult *= 1.1;
		else if (godLvl === 3) godMult *= 1.05;
	}
	CM.Cache.CurrWrinklerCount = count;
	CM.Cache.CurrWrinklerCPSMult = count * (count * 0.05 * 1.1) * (Game.Has('Sacrilegious corruption') * 0.05 + 1) * (Game.Has('Wrinklerspawn') * 0.05 + 1) * godMult;
};

/**
 * This function calculates CPS without the Golden Switch as it might be needed in other functions
 * If so it CM.Sim.Win()'s them and the caller function will know to recall CM.Sim.CalculateGains()
 * It is called at the end of any functions that simulates certain behaviour
 */
CM.Cache.NoGoldSwitchCPS = function () {
	if (Game.Has('Golden switch [off]')) {
		CM.Cache.NoGoldSwitchCookiesPS = CM.Sim.NoGoldSwitchCPS();
	} else CM.Cache.NoGoldSwitchCookiesPS = Game.cookiesPs;
};