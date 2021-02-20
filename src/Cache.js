/*********
 * Cache *
 *********/

/********
 * Section: General Cache related functions */

/**
 * This functions runs all cache-functions to generate all "full" cache
 * The declaration follows the structure of the CM.Cache.js file
 * It is called by CM.Main.DelayInit
 */
CM.Cache.InitCache = function() {
	CM.Cache.CacheDragonAuras();
	CM.Cache.CacheWrinklers();
	CM.Cache.CacheStats();
	CM.Cache.CacheGoldenAndWrathCookiesMults();
	CM.Cache.CacheChain();
	CM.Cache.CacheMissingUpgrades();
	CM.Cache.CacheSeaSpec();
	CM.Cache.InitCookiesDiff();
	CM.Cache.CacheAvgCPS();
	CM.Cache.CacheIncome();
	CM.Cache.CacheBuildingsPrices();
	CM.Cache.CachePP();
};

/********
 * Section: Functions related to Dragon Auras */

/**
 * This functions caches the currently selected Dragon Auras
 * It is called by CM.Sim.CopyData() and CM.Cache.InitCache()
 * Uncapitalized dragon follows Game-naming
 * @global	{number}	CM.Cache.dragonAura		The number of the first (right) Aura
 * @global	{number}	CM.Cache.dragonAura2	The number of the second (left) Aura
 */
CM.Cache.CacheDragonAuras = function() {
	CM.Cache.dragonAura = Game.dragonAura;
	CM.Cache.dragonAura2 = Game.dragonAura2;
};

/********
 * Section: Functions related to Wrinklers */

/**
 * This functions caches data related to Wrinklers
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{number}				CM.Cache.WrinklersTotal		The cookies of all wrinklers
 * @global	{number}				CM.Cache.WrinklersNormal	The cookies of all normal wrinklers
 * @global	{[{number}, {number}]}	CM.Cache.WrinklersFattest	A list containing the cookies and the id of the fattest non-shiny wrinkler
 */
CM.Cache.CacheWrinklers = function() {
	CM.Cache.WrinklersTotal = 0;
	CM.Cache.WrinklersNormal = 0;
	CM.Cache.WrinklersFattest = [0, null];
	for (let i = 0; i < Game.wrinklers.length; i++) {
		var sucked = Game.wrinklers[i].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[i].type==1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		if (CM.Sim.Objects.Temple.minigameLoaded) {
			var godLvl = Game.hasGod('scorn');
			if (godLvl === 1) sucked *= 1.15;
			else if (godLvl === 2) sucked *= 1.1;
			else if (godLvl === 3) sucked *= 1.05;
		}
		CM.Cache.WrinklersTotal += sucked;
		if (Game.wrinklers[i].type === 0) {
			CM.Cache.WrinklersNormal += sucked;
			if (sucked > CM.Cache.WrinklersFattest[0]) CM.Cache.WrinklersFattest = [sucked, i];
		}
	}
};

/********
 * Section: Functions related to Caching stats */

/**
 * This functions caches variables related to the stats apge
 * It is called by CM.Main.Loop() upon changes to cps and CM.Cache.InitCache()
 * @global	{number}	CM.Cache.Lucky					Cookies required for max Lucky
 * @global	{number}	CM.Cache.LuckyReward			Reward for max normal Lucky
 * @global	{number}	CM.Cache.LuckyWrathReward		Reward for max normal Lucky from Wrath cookie
 * @global	{number}	CM.Cache.LuckyFrenzy			Cookies required for max Lucky Frenzy
 * @global	{number}	CM.Cache.LuckyRewardFrenzy		Reward for max Lucky Frenzy
 * @global	{number}	CM.Cache.LuckyWrathRewardFrenzy	Reward for max Lucky Frenzy from Wrath cookie
 * @global	{number}	CM.Cache.Conjure				Cookies required for max Conjure Baked Goods
 * @global	{number}	CM.Cache.ConjureReward			Reward for max Conjure Baked Goods
 * @global	{number}	CM.Cache.Edifice				Cookies required for most expensive building through Spontaneous Edifice
 * @global	{string}	CM.Cache.EdificeBuilding		Name of most expensive building possible with Spontaneous Edifice
 */
CM.Cache.CacheStats = function() {
	CM.Cache.Lucky = (CM.Cache.NoGoldSwitchCookiesPS * 900) / 0.15;
	CM.Cache.Lucky *= CM.Cache.DragonsFortuneMultAdjustment;
	let cpsBuffMult = CM.Cache.getCPSBuffMult();
	if (cpsBuffMult > 0) CM.Cache.Lucky /= cpsBuffMult;
	else CM.Cache.Lucky = 0;
	CM.Cache.LuckyReward = CM.Cache.GoldenCookiesMult * (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyWrathReward = CM.Cache.WrathCookiesMult * (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyFrenzy = CM.Cache.Lucky * 7;
	CM.Cache.LuckyRewardFrenzy = CM.Cache.GoldenCookiesMult * (CM.Cache.LuckyFrenzy * 0.15) + 13;
	CM.Cache.LuckyWrathRewardFrenzy = CM.Cache.WrathCookiesMult * (CM.Cache.LuckyFrenzy * 0.15) + 13;
	CM.Cache.Conjure = CM.Cache.Lucky * 2;
	CM.Cache.ConjureReward = CM.Cache.Conjure * 0.15;

	CM.Cache.Edifice = 0;
	let max = 0;
	let n = 0;
	for (let i of Object.keys(Game.Objects)) {
		if (Game.Objects[i].amount > max) max = Game.Objects[i].amount;
		if (Game.Objects[i].amount > 0) n++;
	}
	for (let i of Object.keys(Game.Objects)) {
		if ((Game.Objects[i].amount < max || n === 1) &&
			Game.Objects[i].amount < 400 &&
			Game.Objects[i].price * 2 > CM.Cache.Edifice) {
			CM.Cache.Edifice = Game.Objects[i].price * 2;
			CM.Cache.EdificeBuilding = i;
		}
	}
};

/**
 * This functions calculates the multipliers of Golden and Wrath cookie rewards
 * It is mostly used by CM.Cache.MaxChainCookieReward() and CM.Cache.CacheChain()
 * It is called by CM.Disp.CreateStatsChainSection() and CM.Cache.CacheChain()
 * @param	{number}			CM.Cache.GoldenCookiesMult				Multiplier for golden cookies
 * @param	{number}			CM.Cache.WrathCookiesMult				Multiplier for wrath cookies
 * @param	{number}			CM.Cache.DragonsFortuneMultAdjustment	Multiplier for dragon fortune + active golden cookie
 */
CM.Cache.CacheGoldenAndWrathCookiesMults = function() {
	if (CM.Footer.isInitzializing) {
		CM.Cache.GoldenCookiesMult = 1;
		CM.Cache.WrathCookiesMult = 1;
		CM.Cache.DragonsFortuneMultAdjustment = 1;
	} else {
		var goldenMult = 1;
		var wrathMult = 1;
		var mult = 1;

		// Factor auras and upgrade in mults
		if (CM.Sim.Has('Green yeast digestives')) mult *= 1.01;
		if (CM.Sim.Has('Dragon fang')) mult *= 1.03;

		goldenMult *= 1 + Game.auraMult('Ancestral Metamorphosis') * 0.1;
		goldenMult *= Game.eff('goldenCookieGain');
		wrathMult *= 1 + Game.auraMult('Unholy Dominion') * 0.1;
		wrathMult *= Game.eff('wrathCookieGain');

		// Calculate final golden and wrath multipliers
		CM.Cache.GoldenCookiesMult = mult * goldenMult;
		CM.Cache.WrathCookiesMult = mult * wrathMult;

		// Calculate Dragon's Fortune multiplier adjustment:
		// If Dragon's Fortune (or Reality Bending) aura is active and there are currently no golden cookies,
		// compute a multiplier adjustment to apply on the current CPS to simulate 1 golden cookie on screen.
		// Otherwise, the aura effect will be factored in the base CPS making the multiplier not requiring adjustment.
		CM.Cache.DragonsFortuneMultAdjustment = 1;
		if (Game.shimmerTypes.golden.n === 0) {
			CM.Cache.DragonsFortuneMultAdjustment *= 1 + Game.auraMult('Dragon\'s Fortune') * 1.23;
		}
	}
};

/**
 * This functions calculates the max possible payout given a set of variables
 * It is called by CM.Disp.CreateStatsChainSection() and CM.Cache.CacheChain()
 * @param	{number}			digit		Number of Golden Cookies in chain
 * @param	{number}			maxPayout	Maximum payout
 * @param	{number}			mult		Multiplier
 * @returns	[{number, number}]				Total cookies earned, and cookies needed for next level
 */
CM.Cache.MaxChainCookieReward = function(digit, maxPayout, mult) {
	let totalFromChain = 0;
	let moni = 0;
	let nextMoni = 0;
	var chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	while (nextMoni < maxPayout) {
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit * mult), maxPayout));
		// TODO: Calculate Cookies or cps needed for next level of chain. Related to issue #580
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit * mult), maxPayout));
		totalFromChain += moni;
		chain++;
	}
	return [totalFromChain, nextMoni];
};

/**
 * This functions caches data related to Chain Cookies reward from Golden Cookioes
 * It is called by CM.Main.Loop() upon changes to cps and CM.Cache.InitCache()
 * @global	[{number, number}]	CM.Cache.ChainReward			Total cookies earned, and cookies needed for next level for normal chain
 * @global	{number}			CM.Cache.ChainRequired			Cookies needed for maximum reward for normal chain
 * @global	{number}			CM.Cache.ChainRequiredNext		Total cookies needed for next level for normal chain
 * @global	[{number, number}]	CM.Cache.ChainWrathReward			Total cookies earned, and cookies needed for next level for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequired			Cookies needed for maximum reward for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequiredNext		Total cookies needed for next level for wrath chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyReward			Total cookies earned, and cookies needed for next level for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequired			Cookies needed for maximum reward for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequiredNext		Total cookies needed for next level for normal frenzy chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyWrathReward			Total cookies earned, and cookies needed for next level for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequired			Cookies needed for maximum reward for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequiredNext		Total cookies needed for next level for wrath frenzy chain
 */
CM.Cache.CacheChain = function() {
	let maxPayout = CM.Cache.NoGoldSwitchCookiesPS * 60 * 60 * 6 * CM.Cache.DragonsFortuneMultAdjustment;
	// Removes effect of Frenzy etc.
	let cpsBuffMult = CM.Cache.getCPSBuffMult();
	if (cpsBuffMult > 0) maxPayout /= cpsBuffMult;
	else maxPayout = 0;	

	CM.Cache.ChainReward = CM.Cache.MaxChainCookieReward(7, maxPayout * CM.Cache.GoldenCookiesMult, CM.Cache.GoldenCookiesMult);
	// TODO: All "required" variables are incorrect. Perhaps something to do with going over the required amount during the chain.
	// See issue #580 on the Github
	CM.Cache.ChainRequired = CM.Cache.ChainReward[0] * 2;
	CM.Cache.ChainRequiredNext = CM.Cache.ChainReward[1] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;

	CM.Cache.ChainWrathReward = CM.Cache.MaxChainCookieReward(6, maxPayout * CM.Cache.WrathCookiesMult, CM.Cache.WrathCookiesMult);
	CM.Cache.ChainWrathRequired = CM.Cache.ChainWrathReward[0] * 2;
	CM.Cache.ChainWrathRequiredNext = CM.Cache.ChainWrathReward[1] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;

	CM.Cache.ChainFrenzyReward = CM.Cache.MaxChainCookieReward(7, maxPayout * 7 * CM.Cache.GoldenCookiesMult, CM.Cache.GoldenCookiesMult);
	CM.Cache.ChainFrenzyRequired = CM.Cache.ChainFrenzyReward[0] * 2;
	CM.Cache.ChainFrenzyRequiredNext = CM.Cache.ChainFrenzyReward[1] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;

	CM.Cache.ChainFrenzyWrathReward = CM.Cache.MaxChainCookieReward(6, maxPayout * 7 * CM.Cache.WrathCookiesMult, CM.Cache.WrathCookiesMult);
	CM.Cache.ChainFrenzyWrathRequired = CM.Cache.ChainFrenzyReward[0] * 2;
	CM.Cache.ChainFrenzyWrathRequiredNext = CM.Cache.ChainFrenzyReward[1] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;
};

/**
 * This functions caches variables related to missing upgrades
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{string}	CM.Cache.MissingUpgrades			String containig the HTML to create the "crates" for missing normal upgrades
 * @global	{string}	CM.Cache.MissingUpgradesCookies		String containig the HTML to create the "crates" for missing cookie upgrades
 * @global	{string}	CM.Cache.MissingUpgradesPrestige	String containig the HTML to create the "crates" for missing prestige upgrades
 */
CM.Cache.CacheMissingUpgrades = function() {
	CM.Cache.MissingUpgrades = "";
	CM.Cache.MissingUpgradesCookies = "";
	CM.Cache.MissingUpgradesPrestige = "";
	var list = [];
	//sort the upgrades
	for (let i of Object.keys(Game.Upgrades)) {
		list.push(Game.Upgrades[i]);
	}
	var sortMap = function(a, b) {
		if (a.order>b.order) return 1;
		else if (a.order<b.order) return -1;
		else return 0;
	};
	list.sort(sortMap);

	for (let i of Object.keys(list)) {
		var me = list[i];
		
		if (me.bought === 0) {
			var str = '';

			str += CM.Disp.crateMissing(me);
			if (me.pool === 'prestige') CM.Cache.MissingUpgradesPrestige += str;
			else if (me.pool === 'cookie') CM.Cache.MissingUpgradesCookies += str;
			else if (me.pool != 'toggle' && me.pool != 'unused' && me.pool != 'debug') CM.Cache.MissingUpgrades += str;
		}
	}
};

/**
 * This functions caches the reward of popping a reindeer
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{number}	CM.Cache.SeaSpec	The reward for popping a reindeer
 */
CM.Cache.CacheSeaSpec = function() {
	if (Game.season === 'christmas') {
		var val = Game.cookiesPs * 60;
		if (Game.hasBuff('Elder frenzy')) val *= 0.5;
		if (Game.hasBuff('Frenzy')) val *= 0.75;
		CM.Cache.SeaSpec = Math.max(25, val);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
};

/********
 * Section: Functions related to Caching CPS */

/**
 * @class
 * @classdesc 	This is a class used to store values used to calculate average over time (mostly cps)
 * @var			{number}				maxLength	The maximum length of the value-storage
 * @var			{[]}					queue		The values stored
 * @method		addLatest(newValue)		Appends newValue to the value storage
 * @method		calcAverage(timePeriod)	Returns the average over the specified timeperiod
 */
class CMAvgQueue {
	constructor(maxLength) {
		this.maxLength = maxLength;
		this.queue = [];
	}

	addLatest (newValue) {
		if (this.queue.push(newValue) > this.maxLength) {
			this.queue.shift();
		}
	}

	/**
	 * This functions returns the average of the values in the queue
	 * @param 	{number}	timePeriod	The period in seconds to computer average over
	 * @returns {number}	ret			The average
 	 */
	calcAverage (timePeriod) {
		if (timePeriod > this.maxLength) timePeriod = this.maxLength;
		if (timePeriod > this.queue.length) timePeriod = this.queue.length;
		var ret = 0;
		for (let i = this.queue.length - 1; i >= 0 && i > this.queue.length - 1 - timePeriod; i--) {
			ret += this.queue[i];
		}
		return ret / timePeriod;
	}
}

/**
 * This functions caches creates the CMAvgQueue used by CM.Cache.CacheAvgCPS() to calculate CPS
 * Called by CM.Cache.InitCache()
 */
CM.Cache.InitCookiesDiff = function() {
	CM.Cache.CookiesDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.WrinkDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.WrinkFattestDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.ChoEggDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.ClicksDiff = new CMAvgQueue(CM.Disp.clickTimes[CM.Disp.clickTimes.length - 1]);
};

/**
 * This functions caches two variables related average CPS and Clicks
 * It is called by CM.Main.Loop()
 * @global	{number}	CM.Cache.RealCookiesEarned	Cookies earned including the Chocolate Egg
 * @global	{number}	CM.Cache.AvgCPS				Average cookies over time-period as defined by AvgCPSHist
 * @global	{number}	CM.Cache.AverageClicks		Average cookies from clicking over time-period as defined by AvgClicksHist
 * @global	{number}	CM.Cache.AvgCPSChoEgg		Average cookies from combination of normal CPS and average Chocolate Cookie CPS
 */
CM.Cache.CacheAvgCPS = function() {
	let currDate = Math.floor(Date.now() / 1000);
	// Only calculate every new second
	if ((Game.T / Game.fps) % 1 === 0) {
		let choEggTotal = Game.cookies + CM.Cache.SellForChoEgg;
		if (Game.cpsSucked > 0) choEggTotal += CM.Cache.WrinklersTotal;
		CM.Cache.RealCookiesEarned = Math.max(Game.cookiesEarned, choEggTotal);
		choEggTotal *= 0.05;

		// Add recent gains to AvgQueue's
		let timeDiff = currDate - CM.Cache.lastDate;
		let bankDiffAvg = Math.max(0, (Game.cookies - CM.Cache.lastCookies)) / timeDiff;
		let wrinkDiffAvg = Math.max(0, (CM.Cache.WrinklersTotal - CM.Cache.lastWrinkCookies)) / timeDiff;
		let wrinkFattestDiffAvg = Math.max(0, (CM.Cache.WrinklersFattest[0] - CM.Cache.lastWrinkFattestCookies)) / timeDiff;
		let choEggDiffAvg = Math.max(0,(choEggTotal - CM.Cache.lastChoEgg)) / timeDiff;
		let clicksDiffAvg = (Game.cookieClicks - CM.Cache.lastClicks) / timeDiff;
		for (let i = 0; i < timeDiff; i++) {
			CM.Cache.CookiesDiff.addLatest(bankDiffAvg);
			CM.Cache.WrinkDiff.addLatest(wrinkDiffAvg);
			CM.Cache.WrinkFattestDiff.addLatest(wrinkFattestDiffAvg);
			CM.Cache.ChoEggDiff.addLatest(choEggDiffAvg);
			CM.Cache.ClicksDiff.addLatest(clicksDiffAvg);
		}

		// Store current data for next loop	
		CM.Cache.lastDate = currDate;
		CM.Cache.lastCookies = Game.cookies;
		CM.Cache.lastWrinkCookies = CM.Cache.WrinklersTotal;
		CM.Cache.lastWrinkFattestCookies = CM.Cache.WrinklersFattest[0];
		CM.Cache.lastChoEgg = choEggTotal;
		CM.Cache.lastClicks = Game.cookieClicks;

		// Get average gain over period of cpsLength seconds
		let cpsLength = CM.Disp.cookieTimes[CM.Options.AvgCPSHist];
		CM.Cache.AverageGainBank = CM.Cache.CookiesDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainWrink = CM.Cache.WrinkDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainWrinkFattest = CM.Cache.WrinkFattestDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainChoEgg = CM.Cache.ChoEggDiff.calcAverage(cpsLength);
		CM.Cache.AvgCPS = CM.Cache.AverageGainBank;
		if (CM.Options.CalcWrink === 1) CM.Cache.AvgCPS += CM.Cache.AverageGainWrink;
		if (CM.Options.CalcWrink === 2) CM.Cache.AvgCPS += CM.Cache.AverageGainWrinkFattest;

		let choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));

		if (choEgg || CM.Options.CalcWrink === 0) {
			CM.Cache.AvgCPSWithChoEgg = CM.Cache.AverageGainBank + CM.Cache.AverageGainWrink + (choEgg ? CM.Cache.AverageGainChoEgg : 0);
		}
		else CM.Cache.AvgCPSWithChoEgg = CM.Cache.AvgCPS;

		CM.Cache.AverageClicks =  CM.Cache.ClicksDiff.calcAverage(CM.Disp.clickTimes[CM.Options.AvgClicksHist]);
	}
};

/**
 * This functions caches the reward for selling the Chocolate egg
 * It is called by CM.Main.Loop()
 * @global	{number}	CM.Cache.SellForChoEgg	Total cookies to be gained from selling Chocolate egg
 */
CM.Cache.CacheSellForChoEgg = function() {
	let sellTotal = 0;
	// Compute cookies earned by selling stock market goods
	if (Game.Objects.Bank.minigameLoaded) {
		let marketGoods = Game.Objects.Bank.minigame.goods;
		let goodsVal = 0;
		for (let i of Object.keys(marketGoods)) {
			let marketGood = marketGoods[i];
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
 * It is called by CM.Main.Loop(). Variables are mostly used by CM.Disp.GetCPS().
 * @global	{number}	CM.Cache.CurrWrinklerCount		Current number of wrinklers
 * @global	{number}	CM.Cache.CurrWrinklerCPSMult	Current multiplier of CPS because of wrinklers (excluding their negative sucking effect)
 */
CM.Cache.CacheCurrWrinklerCPS = function() {
	CM.Cache.CurrWrinklerCPSMult = 0;
	let count = 0;
	for (let i in Game.wrinklers) {
		if (Game.wrinklers[i].phase === 2) count++;
	}
	let godMult = 1;
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		var godLvl = Game.hasGod('scorn');
		if (godLvl === 1) godMult *= 1.15;
		else if (godLvl === 2) godMult *= 1.1;
		else if (godLvl === 3) godMult *= 1.05;
	}
	CM.Cache.CurrWrinklerCount = count;
	CM.Cache.CurrWrinklerCPSMult = count * (count * 0.05 * 1.1) * (Game.Has('Sacrilegious corruption') * 0.05 + 1) * (Game.Has('Wrinklerspawn') * 0.05 + 1) * godMult;
};

/**
 * This function returns the current CPS buff
 * It is called by CM.Sim.CalculateGains(), CM.Disp.UpdateTooltipWarnings(), CM.Cache.CacheStats() and CM.Cache.CacheChain()
 * @returns {number}	mult	The multiplier
 */
CM.Cache.getCPSBuffMult = function() {
	var mult = 1;
	for (let i of Object.keys(Game.buffs)) {
		if (typeof Game.buffs[i].multCpS != 'undefined') mult *= Game.buffs[i].multCpS;
	}
	return mult;
};

/**
 * This function calculates CPS without the Golden Switch as it might be needed in other functions
 * If so it CM.Sim.Win()'s them and the caller function will know to recall CM.Sim.CalculateGains()
 * It is called at the end of any functions that simulates certain behaviour
 */
CM.Cache.NoGoldSwitchCPS = function() {
	if (Game.Has('Golden switch [off]')) {
		CM.Cache.NoGoldSwitchCookiesPS = CM.Sim.NoGoldSwitchCPS();
	}
	else CM.Cache.NoGoldSwitchCookiesPS = Game.cookiesPs;
};

/********
 * Section: Functions related to "Specials" (Dragon and Santa) */

/**
 * This functions caches the current cost of upgrading the dragon level so it can be displayed in the tooltip
 * It is called by the relevan tooltip-code as a result of CM.Disp.AddDragonLevelUpTooltip() and by CM.Main.Loop()
 * @global	{number}	CM.Cache.lastDragonLevel		The last cached dragon level
 * @global	{string}	CM.Cache.CostDragonUpgrade		The Beautified cost of the next upgrade
 */
CM.Cache.CacheDragonCost = function() {
	if (CM.Cache.lastDragonLevel != Game.dragonLevel || CM.Sim.DoSims) {
		if (Game.dragonLevel < 25 && Game.dragonLevels[Game.dragonLevel].buy.toString().includes("sacrifice")) {
			var target = Game.dragonLevels[Game.dragonLevel].buy.toString().match(/Objects\[(.*)\]/)[1];
			var amount = Game.dragonLevels[Game.dragonLevel].buy.toString().match(/sacrifice\((.*?)\)/)[1];
			if (target != "i") {
				target = target.replaceAll("'", "");
				if (Game.Objects[target].amount < amount) {
					CM.Cache.CostDragonUpgrade = "Not enough buildings to sell";
				}
				else {
					let cost = 0;
					CM.Sim.CopyData();
					for (let i = 0; i < amount; i++) {
						let price = CM.Sim.Objects[target].basePrice * Math.pow(Game.priceIncrease, Math.max(0, CM.Sim.Objects[target].amount - 1 - CM.Sim.Objects[target].free));
						price = Game.modifyBuildingPrice(CM.Sim.Objects[target], price);
						price = Math.ceil(price);
						cost += price;
						CM.Sim.Objects[target].amount--;
					}
					CM.Cache.CostDragonUpgrade = "Cost to rebuy: " + CM.Disp.Beautify(cost);
				}
			}
			else {
				let cost = 0;
				CM.Sim.CopyData();
				for (let j of Object.keys(Game.Objects)) {
					target = j;
					if (Game.Objects[target].amount < amount) {
						CM.Cache.CostDragonUpgrade = "Not enough buildings to sell";
						break;
					}
					else {
						for (let i = 0; i < amount; i++) {
							let price = CM.Sim.Objects[target].basePrice * Math.pow(Game.priceIncrease, Math.max(0, CM.Sim.Objects[target].amount - 1 - CM.Sim.Objects[target].free));
							price = Game.modifyBuildingPrice(CM.Sim.Objects[target], price);
							price = Math.ceil(price);
							cost += price;
							CM.Sim.Objects[target].amount--;
						}
					}
					CM.Cache.CostDragonUpgrade = "Cost to rebuy: " + CM.Disp.Beautify(cost);
				}
			}
		}
		CM.Cache.lastDragonLevel = Game.dragonLevel;
	}
};

/********
 * Section: Functions related to caching income */

/**
 * This functions caches the income gain of each building and upgrade and stores it in the cache
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 */
CM.Cache.CacheIncome = function() {
	// Simulate Building Buys for 1, 10 and 100 amount
	CM.Cache.CacheBuildingIncome(1, 'Objects1');
	CM.Cache.CacheBuildingIncome(10, 'Objects10');
	CM.Cache.CacheBuildingIncome(100, 'Objects100');

	// Simulate Upgrade Buys
	CM.Cache.CacheUpgradeIncome();
};

/**
 * This functions starts the calculation/simulation of the bonus income of buildings
 * It is called by CM.Cache.CacheIncome()
 * @param	{amount}	amount	Amount to be bought
 * @parem	{string}	target	The target Cache object ("Objects1", "Objects10" or "Objects100")
 */
CM.Cache.CacheBuildingIncome = function(amount, target) {
	CM.Cache[target] = [];
	for (let i of Object.keys(Game.Objects)) {
		CM.Cache[target][i] = {};
		CM.Cache[target][i].bonus = CM.Sim.BuyBuildingsBonusIncome(i, amount);
		if (amount != 1) {
			CM.Cache.DoRemakeBuildPrices = 1;
		}
	}
}

/**
 * This functions starts the calculation/simulation of the bonus income of upgrades
 * It is called by CM.Cache.CacheIncome()
 */
CM.Cache.CacheUpgradeIncome = function() {
	CM.Cache.Upgrades = [];
	for (let i of Object.keys(Game.Upgrades)) {
		let bonusIncome = CM.Sim.BuyUpgradesBonusIncome(i);
		CM.Cache.Upgrades[i] = {};
		if (bonusIncome[0]) CM.Cache.Upgrades[i].bonus = bonusIncome[0];
		if (bonusIncome[1]) CM.Cache.Upgrades[i].bonusMouse = bonusIncome[1];
	}
}

/********
 * Section: Functions related to caching prices */

/**
 * This functions caches the price of each building and stores it in the cache
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 */
CM.Cache.CacheBuildingsPrices = function() {
	for (let i of Object.keys(Game.Objects)) {
		CM.Cache.Objects1[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 1);
		CM.Cache.Objects10[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 10);
		CM.Cache.Objects100[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 100);
	}
};

/********
 * Section: Functions related to caching PP */

/**
 * This functions caches the PP of each building and upgrade and stores it in the cache
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 */
CM.Cache.CachePP = function() {
	CM.Cache.CacheBuildingsPP();
	CM.Cache.CacheUpgradePP();
};

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CachePP()
 */
CM.Cache.CacheBuildingsPP = function() {
	CM.Cache.min = -1;
	CM.Cache.max = -1;
	CM.Cache.mid = -1;
	// Calculate PP and colors when compared to purchase of optimal building in single-purchase mode
	if (CM.Options.ColorPPBulkMode === 0) {
		for (let i of Object.keys(CM.Cache.Objects1)) {
			if (Game.cookiesPs) {
				CM.Cache.Objects1[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CM.Cache.Objects1[i].bonus);
			} else CM.Cache.Objects1[i].pp = (Game.Objects[i].getPrice() / CM.Cache.Objects1[i].bonus);
			if (CM.Cache.min === -1 || CM.Cache.Objects1[i].pp < CM.Cache.min) CM.Cache.min = CM.Cache.Objects1[i].pp;
			if (CM.Cache.max === -1 || CM.Cache.Objects1[i].pp > CM.Cache.max) CM.Cache.max = CM.Cache.Objects1[i].pp;
		}
		CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
		for (let i of Object.keys(CM.Cache.Objects1)) {
			let color = '';
			if (CM.Cache.Objects1[i].pp === CM.Cache.min) color = CM.Disp.colorGreen;
			else if (CM.Cache.Objects1[i].pp === CM.Cache.max) color = CM.Disp.colorRed;
			else if (CM.Cache.Objects1[i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
			else color = CM.Disp.colorYellow;
			CM.Cache.Objects1[i].color = color;
		}
		// Calculate PP of bulk-buy modes
		CM.Cache.CacheBuildingsBulkPP('Objects10');
		CM.Cache.CacheBuildingsBulkPP('Objects100');
	} 
	// Calculate PP and colors when compared to purchase of selected bulk mode
	else {
		let target = `Objects${Game.buyBulk}`
		for (let i of Object.keys(CM.Cache[target])) {
			if (Game.cookiesPs) {
				CM.Cache[target][i].pp = (Math.max(Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].bulkPrice / CM.Cache[target][i].bonus);
			} else CM.CM.Cache[target][i].pp = (Game.Objects[i].bulkPrice / CM.Cache[target][i].bonus);
			if (CM.Cache.min === -1 || CM.Cache[target][i].pp < CM.Cache.min) CM.Cache.min = CM.Cache[target][i].pp;
			if (CM.Cache.max === -1 || CM.Cache[target][i].pp > CM.Cache.max) CM.Cache.max = CM.Cache[target][i].pp;
		}
		CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
		for (let i of Object.keys(CM.Cache.Objects1)) {
			let color = '';
			if (CM.Cache[target][i].pp === CM.Cache.min) color = CM.Disp.colorGreen;
			else if (CM.Cache[target][i].pp === CM.Cache.max) color = CM.Disp.colorRed;
			else if (CM.Cache[target][i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
			else color = CM.Disp.colorYellow;
			CM.Cache[target][i].color = color;
		}
	}
};

/**
 * This functions caches the buildings of bulk-buy mode when PP is compared against optimal single-purchase building
 * It saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CacheBuildingsPP()
 */
CM.Cache.CacheBuildingsBulkPP = function(target) {
	for (let i of Object.keys(CM.Cache[target])) {
		if (Game.cookiesPs) {
			CM.Cache[target][i].pp = (Math.max(CM.Cache[target][i].price - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (CM.Cache[target][i].price / CM.Cache[target][i].bonus);
		} else CM.Cache[target][i].pp = (CM.Cache[target][i].price / CM.Cache[target][i].bonus);

		let color = '';
		if (CM.Cache[target][i].pp <= 0 || CM.Cache[target][i].pp === Infinity) color = CM.Disp.colorGray;
		else if (CM.Cache[target][i].pp < CM.Cache.min) color = CM.Disp.colorBlue;
		else if (CM.Cache[target][i].pp === CM.Cache.min) color = CM.Disp.colorGreen;
		else if (CM.Cache[target][i].pp === CM.Cache.max) color = CM.Disp.colorRed;
		else if (CM.Cache[target][i].pp > CM.Cache.max) color = CM.Disp.colorPurple;
		else if (CM.Cache[target][i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache[target][i].color = color;
	}
};

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Upgrades
 * It is called by CM.Cache.CachePP()
 */
CM.Cache.CacheUpgradePP = function() {
	for (let i of Object.keys(CM.Cache.Upgrades)) {
		if (Game.cookiesPs) {
			CM.Cache.Upgrades[i].pp = (Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		} else CM.Cache.Upgrades[i].pp = (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		if (isNaN(CM.Cache.Upgrades[i].pp)) CM.Cache.Upgrades[i].pp = Infinity;
		let color = '';
		if (CM.Cache.Upgrades[i].pp <= 0 || CM.Cache.Upgrades[i].pp === Infinity) color = CM.Disp.colorGray;
		else if (CM.Cache.Upgrades[i].pp < CM.Cache.min) color = CM.Disp.colorBlue;
		else if (CM.Cache.Upgrades[i].pp === CM.Cache.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Upgrades[i].pp === CM.Cache.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Upgrades[i].pp > CM.Cache.max) color = CM.Disp.colorPurple;
		else if (CM.Cache.Upgrades[i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Upgrades[i].color = color;
	}
};

/********
 * Section: Cached variables */

/**
 * Used to store the multiplier of the Century Egg
 */
CM.Cache.CentEgg = 0;

/**
 * Used to store if there was a Build Aura (used in CM.Main)
 */
CM.Cache.HadBuildAura = false;

/**
 * Used to store CPS without Golden Cookie Switch
 */
CM.Cache.NoGoldSwitchCookiesPS = 0;
