/*********
 * Cache *
 *********/

/********
 * Section: General Cache related functions */

/**
 * This functions runs all cache-functions to generate all "full" cache
 * The declaration follows the structure of the CM.Cache.js file
 * It is called by CM.DelayInit
 * TODO: Add all functions that should be here and remove them from CM.Loop()
 */
CM.Cache.InitCache = function() {
	CM.Cache.CacheDragonAuras();
	CM.Cache.CacheWrinklers();
	CM.Cache.CacheStats();
	CM.Cache.CacheMissingUpgrades();
}

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
	/** @global	*/
	CM.Cache.dragonAura = Game.dragonAura;
	CM.Cache.dragonAura2 = Game.dragonAura2;
}

/********
 * Section: Functions related to Wrinklers */

/**
 * This functions caches data related to Wrinklers
 * It is called by CM.Loop() and CM.Cache.InitCache()
 * @global	{number}				CM.Cache.WrinklersTotal		The cookies of all wrinklers
 * @global	{number}				CM.Cache.WrinklersNormal	The cookies of all normal wrinklers
 * @global	{[{number}, {number}]}	CM.Cache.WrinklersFattest	A list containing the cookies and the id of the fattest wrinkler
 */
CM.Cache.CacheWrinklers = function() {
	CM.Cache.WrinklersTotal = 0;
	CM.Cache.WrinklersNormal = 0;
	CM.Cache.WrinklersFattest = [0, null];
	for (var i in Game.wrinklers) {
		var sucked = Game.wrinklers[i].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[i].type==1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		if (CM.Sim.Objects.Temple.minigameLoaded) {
			var godLvl = CM.Sim.hasGod('scorn');
			if (godLvl == 1) sucked *= 1.15;
			else if (godLvl == 2) sucked *= 1.1;
			else if (godLvl == 3) sucked *= 1.05;
		}
		CM.Cache.WrinklersTotal += sucked;
		if (Game.wrinklers[i].type == 0) CM.Cache.WrinklersNormal += sucked;
		if (sucked > CM.Cache.WrinklersFattest[0]) CM.Cache.WrinklersFattest = [sucked, i];
	}
}

/********
 * Section: Functions related to Caching stats */

/**
 * This functions caches variables related to the stats apge
 * It is called by CM.Loop() upon changes to cps and CM.Cache.InitCache()
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
	var goldenMult = CM.Cache.GoldenCookiesMult;
	var wrathMult = CM.Cache.WrathCookiesMult;

	CM.Cache.Lucky = (CM.Cache.NoGoldSwitchCookiesPS * 900) / 0.15;
	CM.Cache.Lucky *= CM.Cache.DragonsFortuneMultAdjustment;
	var cpsBuffMult = CM.Sim.getCPSBuffMult();
	if (cpsBuffMult > 0) CM.Cache.Lucky /= cpsBuffMult;
	else CM.Cache.Lucky = 0;
	CM.Cache.LuckyReward = goldenMult * (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyWrathReward = wrathMult * (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyFrenzy = CM.Cache.Lucky * 7;
	CM.Cache.LuckyRewardFrenzy = goldenMult * (CM.Cache.LuckyFrenzy * 0.15) + 13;
	CM.Cache.LuckyWrathRewardFrenzy = wrathMult * (CM.Cache.LuckyFrenzy * 0.15) + 13;
	CM.Cache.Conjure = CM.Cache.Lucky * 2;
	CM.Cache.ConjureReward = CM.Cache.Conjure * 0.15;
	 
	CM.Cache.Edifice = 0;
	var max = 0;
	var n = 0;
	for (var i in Game.Objects) {
		if (Game.Objects[i].amount > max) max = Game.Objects[i].amount;
		if (Game.Objects[i].amount > 0) n++;
	}
	for (var i in Game.Objects) {
		if ((Game.Objects[i].amount < max || n == 1) &&
			Game.Objects[i].amount < 400 &&
			Game.Objects[i].price * 2 > CM.Cache.Edifice) {
			CM.Cache.Edifice = Game.Objects[i].price * 2;
			CM.Cache.EdificeBuilding = i;
		}
	}
}

/**
 * This functions caches variables related to missing upgrades
 * It is called by CM.Loop() and CM.Cache.InitCache()
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
	for (var i in Game.Upgrades) {
		list.push(Game.Upgrades[i]);
	}
	var sortMap = function(a, b) {
		if (a.order>b.order) return 1;
		else if (a.order<b.order) return -1;
		else return 0;
	}
	list.sort(sortMap);

	for (var i in list) {
		var me = list[i];
		
		if (me.bought == 0) {
			var str = '';

			str += CM.Disp.crateMissing(me);
			if (me.pool == 'prestige') CM.Cache.MissingUpgradesPrestige += str;
			else if (me.pool == 'cookie') CM.Cache.MissingUpgradesCookies += str;
			else if (me.pool != 'toggle' && me.pool != 'unused') CM.Cache.MissingUpgrades += str;
		}
	}
}

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
		this.queue = []
	}

	addLatest (newValue) {
		if (this.queue.push(newValue) > this.maxLength) {
			this.queue.shift();
		}
	}

	// TODO: Might want to do this according to "https://stackoverflow.com/questions/10359907/how-to-compute-the-sum-and-average-of-elements-in-an-array"
	calcAverage (timePeriod) {
		if (timePeriod > this.maxLength) timePeriod = this.maxLength, console.log("Called for average of Queue for time-period longer than MaxLength");
		if (timePeriod > this.queue.length) timePeriod = this.queue.length;
		var ret = 0
		for (var i = this.queue.length - 1; i >= 0 && i > this.queue.length - 1 - timePeriod; i--) {
			ret += this.queue[i];
		}
		return ret / timePeriod;
	}
}

/**
 * This functions caches creates the CMAvgQueue used by CM.Cache.UpdateAvgCPS() to calculate CPS
 * Called by CM.DelayInit()
 */
CM.Cache.InitCookiesDiff = function() {
	CM.Cache.CookiesDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.WrinkDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.WrinkFattestDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.ChoEggDiff = new CMAvgQueue(CM.Disp.cookieTimes[CM.Disp.cookieTimes.length - 1]);
	CM.Cache.ClicksDiff = new CMAvgQueue(CM.Disp.clickTimes[CM.Disp.clickTimes.length - 1]);
}

/**
 * This functions caches two variables related average CPS and Clicks
 * * It is called by CM.Loop()
 * TODO: Check if this can be made more concise
 * @global	{number}	CM.Cache.AvgCPS				Average cookies over time-period as defined by AvgCPSHist
 * @global	{number}	CM.Cache.AverageClicks		Average cookies from clicking over time-period as defined by AvgClicksHist
 */
CM.Cache.UpdateAvgCPS = function() {
	var currDate = Math.floor(Date.now() / 1000);
	// Only calculate every new second
	if ((Game.T / Game.fps) % 1 == 0) {
		var choEggTotal = Game.cookies + CM.Cache.SellForChoEgg;
		if (Game.cpsSucked > 0) {
			choEggTotal += CM.Cache.WrinklersTotal;
		}
		CM.Cache.RealCookiesEarned = Math.max(Game.cookiesEarned, choEggTotal);
		choEggTotal *= 0.05;

		if (CM.Cache.lastDate != -1) {
			var timeDiff = currDate - CM.Cache.lastDate
			var bankDiffAvg = Math.max(0, (Game.cookies - CM.Cache.lastCookies)) / timeDiff;
			var wrinkDiffAvg = Math.max(0, (CM.Cache.WrinklersTotal - CM.Cache.lastWrinkCookies)) / timeDiff;
			var wrinkFattestDiffAvg = Math.max(0, (CM.Cache.WrinklersFattest[0] - CM.Cache.lastWrinkFattestCookies)) / timeDiff;
			var choEggDiffAvg = Math.max(0,(choEggTotal - CM.Cache.lastChoEgg)) / timeDiff;
			var clicksDiffAvg = (Game.cookieClicks - CM.Cache.lastClicks) / timeDiff;
			for (var i = 0; i < timeDiff; i++) {
				CM.Cache.CookiesDiff.addLatest(bankDiffAvg);
				CM.Cache.WrinkDiff.addLatest(wrinkDiffAvg);
				CM.Cache.WrinkFattestDiff.addLatest(wrinkFattestDiffAvg);
				CM.Cache.ChoEggDiff.addLatest(choEggDiffAvg);
				CM.Cache.ClicksDiff.addLatest(clicksDiffAvg);
			}
		}
		CM.Cache.lastDate = currDate;
		CM.Cache.lastCookies = Game.cookies;
		CM.Cache.lastWrinkCookies = CM.Cache.WrinklersTotal;
		CM.Cache.lastWrinkFattestCookies = CM.Cache.WrinklersFattest[0];
		CM.Cache.lastChoEgg = choEggTotal;
		CM.Cache.lastClicks = Game.cookieClicks;

		var cpsLength = CM.Disp.cookieTimes[CM.Options.AvgCPSHist];
		
		CM.Cache.AverageGainBank = CM.Cache.CookiesDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainWrink = CM.Cache.WrinkDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainWrinkFattest = CM.Cache.WrinkFattestDiff.calcAverage(cpsLength);
		CM.Cache.AverageGainChoEgg = CM.Cache.ChoEggDiff.calcAverage(cpsLength);

		CM.Cache.AvgCPS = CM.Cache.AverageGainBank
		if (CM.Options.CalcWrink == 1) CM.Cache.AvgCPS += CM.Cache.AverageGainWrink;
		if (CM.Options.CalcWrink == 2) CM.Cache.AvgCPS += CM.Cache.AverageGainWrinkFattest;

		var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));

		// TODO: Why and where is this used?
		if (choEgg || CM.Options.CalcWrink == 0) {
			CM.Cache.AvgCPSChoEgg = CM.Cache.AverageGainBank + CM.Cache.AverageGainWrink + (choEgg ? CM.Cache.AverageGainChoEgg : 0);
		}
		else CM.Cache.AvgCPSChoEgg = CM.Cache.AvgCPS;

		CM.Cache.AverageClicks =  CM.Cache.ClicksDiff.calcAverage(CM.Disp.clickTimes[CM.Options.AvgClicksHist]);
	}
}

/**
 * This functions caches the current Wrinkler CPS multiplier
 * It is called by CM.Loop(). Variables are mostly used by CM.Disp.GetCPS().
 * @global	{number}	CM.Cache.CurrWrinklerCount		Current number of wrinklers
 * @global	{number}	CM.Cache.CurrWrinklerCPSMult	Current multiplier of CPS because of wrinklers (excluding their negative sucking effect)
 */
CM.Cache.UpdateCurrWrinklerCPS = function() {
	CM.Cache.CurrWrinklerCPSMult = 0;
	let count = 0;
	for (let i in Game.wrinklers) {
		if (Game.wrinklers[i].phase == 2) count++
	}
	let godMult = 1;
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		var godLvl = CM.Sim.hasGod('scorn');
		if (godLvl == 1) godMult *= 1.15;
		else if (godLvl == 2) godMult *= 1.1;
		else if (godLvl == 3) godMult *= 1.05;
	}
	CM.Cache.CurrWrinklerCount = count;
	CM.Cache.CurrWrinklerCPSMult = count * (count * 0.05 * 1.1) * (Game.Has('Sacrilegious corruption') * 0.05 + 1) * (Game.Has('Wrinklerspawn') * 0.05 + 1) * godMult;
}

/********
 * Section: Functions related to "Specials" (Dragon and Santa) */

/**
 * This functions caches the current cost of upgrading the dragon level so it can be displayed in the tooltip
 * It is called by the relevan tooltip-code as a result of CM.Disp.AddDragonLevelUpTooltip() and by CM.Loop()
 * @global	{number}	CM.Cache.lastDragonLevel		The last cached dragon level
 * @global	{string}	CM.Cache.CostDragonUpgrade		The Beautified cost of the next upgrade
 */
CM.Cache.CacheDragonCost = function() {
	if (CM.Cache.lastDragonLevel != Game.dragonLevel || CM.Sim.DoSims) {
		if (Game.dragonLevel < 25 && Game.dragonLevels[Game.dragonLevel].buy.toString().includes("sacrifice")) {
			var target = Game.dragonLevels[Game.dragonLevel].buy.toString().match(/Objects\[(.*)\]/)[1];
			var amount = Game.dragonLevels[Game.dragonLevel].buy.toString().match(/sacrifice\((.*?)\)/)[1];
			if (target != "i") {
				target = target.replaceAll("\'", "");
				if (Game.Objects[target].amount < amount) {
					CM.Cache.CostDragonUpgrade = "Not enough buildings to sell";
				}
				else {
					var cost = 0;
					CM.Sim.CopyData();
					for (var i = 0; i < amount; i++) {
						var price = CM.Sim.Objects[target].basePrice * Math.pow(Game.priceIncrease, Math.max(0, CM.Sim.Objects[target].amount - 1 - CM.Sim.Objects[target].free));
						price = Game.modifyBuildingPrice(CM.Sim.Objects[target], price);
						price = Math.ceil(price);
						cost += price;
						CM.Sim.Objects[target].amount--;
					}
					CM.Cache.CostDragonUpgrade = "Cost to rebuy: " + CM.Disp.Beautify(cost);
				}
			}
			else {
				var cost = 0;
				CM.Sim.CopyData();
				for (var j in Game.Objects) {
					target = j;
					if (Game.Objects[target].amount < amount) {
						CM.Cache.CostDragonUpgrade = "Not enough buildings to sell";
						break
					}
					else {
						for (var i = 0; i < amount; i++) {
							var price = CM.Sim.Objects[target].basePrice * Math.pow(Game.priceIncrease, Math.max(0, CM.Sim.Objects[target].amount - 1 - CM.Sim.Objects[target].free));
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
}
 			
/********
 * Section: UNSORTED */

CM.Cache.NextNumber = function(base) {
	var count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
	while (base == base + count) {
		count = CM.Cache.NextNumber(count);
	}
	return (base + count);
}

CM.Cache.RemakeBuildingsPrices = function() {
	for (var i in Game.Objects) {
		CM.Cache.Objects[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 1);
		CM.Cache.Objects10[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 10);
		CM.Cache.Objects100[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i], Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 100);
	}
}

CM.Cache.RemakeIncome = function() {
	// Simulate Building Buys for 1 amount
	CM.Sim.BuyBuildings(1, 'Objects');

	// Simulate Upgrade Buys
	CM.Sim.BuyUpgrades();

	// Simulate Building Buys for 10 amount
	CM.Sim.BuyBuildings(10, 'Objects10');

	// Simulate Building Buys for 100 amount
	CM.Sim.BuyBuildings(100, 'Objects100');
}

CM.Cache.RemakeBuildingsPP = function() {
	CM.Cache.min = -1;
	CM.Cache.max = -1;
	CM.Cache.mid = -1;
	// Calculate PP and colors when compared to purchase of single optimal building
	if (CM.Options.ColorPPBulkMode == 0) {
		for (var i in CM.Cache.Objects) {
			//CM.Cache.Objects[i].pp = Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus;
			if (Game.cookiesPs) {
				CM.Cache.Objects[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus);
			} else {
				CM.Cache.Objects[i].pp = (Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus);
			}
			if (CM.Cache.min == -1 || CM.Cache.Objects[i].pp < CM.Cache.min) CM.Cache.min = CM.Cache.Objects[i].pp;
			if (CM.Cache.max == -1 || CM.Cache.Objects[i].pp > CM.Cache.max) CM.Cache.max = CM.Cache.Objects[i].pp;
		}
		CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
		for (var i in CM.Cache.Objects) {
			var color = '';
			if (CM.Cache.Objects[i].pp == CM.Cache.min) color = CM.Disp.colorGreen;
			else if (CM.Cache.Objects[i].pp == CM.Cache.max) color = CM.Disp.colorRed;
			else if (CM.Cache.Objects[i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
			else color = CM.Disp.colorYellow;
			CM.Cache.Objects[i].color = color;
		}
		// Buildings for 10 amount
		CM.Cache.RemakeBuildingsOtherPP(10, 'Objects10');

		// Buildings for 100 amount
		CM.Cache.RemakeBuildingsOtherPP(100, 'Objects100');
	} 
	// Calculate PP and colors when compared to purchase of selected bulk mode
	else {
		if (Game.buyBulk == 1) {
			for (var i in CM.Cache.Objects) {
				//CM.Cache.Objects[i].pp = Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus;
				if (Game.cookiesPs) {
					CM.Cache.Objects[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus);
				} else {
					CM.Cache.Objects[i].pp = (Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus);
				}
				if (CM.Cache.min == -1 || CM.Cache.Objects[i].pp < CM.Cache.min) CM.Cache.min = CM.Cache.Objects[i].pp;
				if (CM.Cache.max == -1 || CM.Cache.Objects[i].pp > CM.Cache.max) CM.Cache.max = CM.Cache.Objects[i].pp;
			}
			CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
			for (var i in CM.Cache.Objects) {
				var color = '';
				if (CM.Cache.Objects[i].pp == CM.Cache.min) color = CM.Disp.colorGreen;
				else if (CM.Cache.Objects[i].pp == CM.Cache.max) color = CM.Disp.colorRed;
				else if (CM.Cache.Objects[i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
				else color = CM.Disp.colorYellow;
				CM.Cache.Objects[i].color = color;
			}
			CM.Cache.RemakeBuildingsOtherPP(10, 'Objects10');
			CM.Cache.RemakeBuildingsOtherPP(100, 'Objects100');
		}
		else if (Game.buyBulk == 10) {
			for (var i in CM.Cache.Objects) {
				if (Game.cookiesPs) {
					CM.Cache.Objects10[i].pp = (Math.max(Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].bulkPrice / CM.Cache.Objects10[i].bonus);
				} else {
					CM.Cache.Objects10[i].pp = (Game.Objects[i].bulkPrice / CM.Cache.Objects10[i].bonus);
				}
				if (CM.Cache.min == -1 || CM.Cache.Objects10[i].pp < CM.Cache.min) CM.Cache.min = CM.Cache.Objects10[i].pp;
				if (CM.Cache.max == -1 || CM.Cache.Objects10[i].pp > CM.Cache.max) CM.Cache.max = CM.Cache.Objects10[i].pp;
			}
			CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
			for (var i in CM.Cache.Objects) {
				var color = '';
				if (CM.Cache.Objects10[i].pp == CM.Cache.min) color = CM.Disp.colorGreen;
				else if (CM.Cache.Objects10[i].pp == CM.Cache.max) color = CM.Disp.colorRed;
				else if (CM.Cache.Objects10[i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
				else color = CM.Disp.colorYellow;
				CM.Cache.Objects10[i].color = color;
			}
			CM.Cache.RemakeBuildingsOtherPP(1, 'Objects');
			CM.Cache.RemakeBuildingsOtherPP(100, 'Objects100');
		}
		else if (Game.buyBulk == 100) {
			for (var i in CM.Cache.Objects) {
				if (Game.cookiesPs) {
					CM.Cache.Objects100[i].pp = (Math.max(Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].bulkPrice / CM.Cache.Objects100[i].bonus);
				} else {
					CM.Cache.Objects100[i].pp = (Game.Objects[i].bulkPrice / CM.Cache.Objects100[i].bonus);
				}
				if (CM.Cache.min == -1 || CM.Cache.Objects100[i].pp < CM.Cache.min) CM.Cache.min = CM.Cache.Objects100[i].pp;
				if (CM.Cache.max == -1 || CM.Cache.Objects100[i].pp > CM.Cache.max) CM.Cache.max = CM.Cache.Objects100[i].pp;
			}
			CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
			for (var i in CM.Cache.Objects) {
				var color = '';
				if (CM.Cache.Objects100[i].pp == CM.Cache.min) color = CM.Disp.colorGreen;
				else if (CM.Cache.Objects100[i].pp == CM.Cache.max) color = CM.Disp.colorRed;
				else if (CM.Cache.Objects100[i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
				else color = CM.Disp.colorYellow;
				CM.Cache.Objects100[i].color = color;
			}
			CM.Cache.RemakeBuildingsOtherPP(1, 'Objects');
			CM.Cache.RemakeBuildingsOtherPP(10, 'Objects10');
		}
	}
}

CM.Cache.RemakeUpgradePP = function() {
	for (var i in CM.Cache.Upgrades) {
		//CM.Cache.Upgrades[i].pp = Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus;
		if (Game.cookiesPs) {
			CM.Cache.Upgrades[i].pp = (Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		} else {
			CM.Cache.Upgrades[i].pp = (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		}
		if (isNaN(CM.Cache.Upgrades[i].pp)) CM.Cache.Upgrades[i].pp = Infinity;
		var color = '';
		if (CM.Cache.Upgrades[i].pp <= 0 || CM.Cache.Upgrades[i].pp == Infinity) color = CM.Disp.colorGray;
		else if (CM.Cache.Upgrades[i].pp < CM.Cache.min) color = CM.Disp.colorBlue;
		else if (CM.Cache.Upgrades[i].pp == CM.Cache.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Upgrades[i].pp == CM.Cache.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Upgrades[i].pp > CM.Cache.max) color = CM.Disp.colorPurple;
		else if (CM.Cache.Upgrades[i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Upgrades[i].color = color;
	}
}

CM.Cache.RemakeBuildingsOtherPP = function(amount, target) {
	for (var i in CM.Cache[target]) {
		//CM.Cache[target][i].pp = CM.Cache[target][i].price / CM.Cache[target][i].bonus;
		if (Game.cookiesPs) {
			CM.Cache[target][i].pp = (Math.max(CM.Cache[target][i].price - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (CM.Cache[target][i].price / CM.Cache[target][i].bonus);
		} else {
			CM.Cache[target][i].pp = (CM.Cache[target][i].price / CM.Cache[target][i].bonus);
		}
		var color = '';
		if (CM.Cache[target][i].pp <= 0 || CM.Cache[target][i].pp == Infinity) color = CM.Disp.colorGray;
		else if (CM.Cache[target][i].pp < CM.Cache.min) color = CM.Disp.colorBlue;
		else if (CM.Cache[target][i].pp == CM.Cache.min) color = CM.Disp.colorGreen;
		else if (CM.Cache[target][i].pp == CM.Cache.max) color = CM.Disp.colorRed;
		else if (CM.Cache[target][i].pp > CM.Cache.max) color = CM.Disp.colorPurple;
		else if (CM.Cache[target][i].pp > CM.Cache.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache[target][i].color = color;
	}
}

CM.Cache.RemakePP = function() {
	// Buildings
	CM.Cache.RemakeBuildingsPP();

	// Upgrades
	CM.Cache.RemakeUpgradePP();
}

CM.Cache.RemakeGoldenAndWrathCookiesMults = function() {
	var goldenMult = 1;
	var wrathMult = 1;
	var mult = 1;

	// Factor auras and upgrade in mults
	if (CM.Sim.Has('Green yeast digestives')) mult *= 1.01;
	if (CM.Sim.Has('Dragon fang')) mult *= 1.03;

	goldenMult *= 1 + CM.Sim.auraMult('Ancestral Metamorphosis') * 0.1;
	goldenMult *= CM.Sim.eff('goldenCookieGain');
	wrathMult *= 1 + CM.Sim.auraMult('Unholy Dominion') * 0.1;
	wrathMult *= CM.Sim.eff('wrathCookieGain');

	// Calculate final golden and wrath multipliers
	CM.Cache.GoldenCookiesMult = mult * goldenMult;
	CM.Cache.WrathCookiesMult = mult * wrathMult;

	// Calculate Dragon's Fortune multiplier adjustment:
	// If Dragon's Fortune (or Reality Bending) aura is active and there are currently no golden cookies,
	// compute a multiplier adjustment to apply on the current CPS to simulate 1 golden cookie on screen.
	// Otherwise, the aura effect will be factored in the base CPS making the multiplier not requiring adjustment.
	CM.Cache.DragonsFortuneMultAdjustment = 1;
	if (Game.shimmerTypes.golden.n === 0) {
		CM.Cache.DragonsFortuneMultAdjustment *= 1 + CM.Sim.auraMult('Dragon\'s Fortune') * 1.23;
	}
}

CM.Cache.MaxChainMoni = function(digit, maxPayout, mult) {
	var chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	var moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit * mult), maxPayout));
	var nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit * mult), maxPayout));
	while (nextMoni < maxPayout) {
		chain++;
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit * mult), maxPayout));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit * mult), maxPayout));
	}
	return moni;
}

CM.Cache.RemakeChain = function() {
	var maxPayout = CM.Cache.NoGoldSwitchCookiesPS * 60 * 60 * 6;
	maxPayout *= CM.Cache.DragonsFortuneMultAdjustment;
	var cpsBuffMult = CM.Sim.getCPSBuffMult();
	if (cpsBuffMult > 0) {
		maxPayout /= cpsBuffMult;
	} else {
		maxPayout = 0;
	}

	var goldenMult = CM.Cache.GoldenCookiesMult;
	var wrathMult = CM.Cache.WrathCookiesMult;

	CM.Cache.ChainReward = CM.Cache.MaxChainMoni(7, maxPayout, goldenMult);

	CM.Cache.ChainWrathReward = CM.Cache.MaxChainMoni(6, maxPayout, wrathMult);

	if (maxPayout < CM.Cache.ChainReward) {
		CM.Cache.Chain = 0;
	}
	else {
		CM.Cache.Chain = CM.Cache.NextNumber(CM.Cache.ChainReward) / 0.5;
	}
	if (maxPayout < CM.Cache.ChainWrathReward) {
		CM.Cache.ChainWrath = 0;
	}
	else {
		CM.Cache.ChainWrath = CM.Cache.NextNumber(CM.Cache.ChainWrathReward) / 0.5;
	}

	CM.Cache.ChainFrenzyReward = CM.Cache.MaxChainMoni(7, maxPayout * 7, goldenMult);

	CM.Cache.ChainFrenzyWrathReward = CM.Cache.MaxChainMoni(6, maxPayout * 7, wrathMult);

	if ((maxPayout * 7) < CM.Cache.ChainFrenzyReward) {
		CM.Cache.ChainFrenzy = 0;
	}
	else {
		CM.Cache.ChainFrenzy = CM.Cache.NextNumber(CM.Cache.ChainFrenzyReward) / 0.5;
	}
	if ((maxPayout * 7) < CM.Cache.ChainFrenzyWrathReward) {
		CM.Cache.ChainFrenzyWrath = 0;
	}
	else {
		CM.Cache.ChainFrenzyWrath = CM.Cache.NextNumber(CM.Cache.ChainFrenzyWrathReward) / 0.5;
	}
}

CM.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		var val = Game.cookiesPs * 60;
		if (Game.hasBuff('Elder frenzy')) val *= 0.5; // very sorry
		if (Game.hasBuff('Frenzy')) val *= 0.75; // I sincerely apologize
		CM.Cache.SeaSpec = Math.max(25, val);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
}

CM.Cache.RemakeSellForChoEgg = function() {
	var sellTotal = 0;
	// Compute cookies earned by selling stock market goods
	if (Game.Objects.Bank.minigameLoaded) {
		var marketGoods = Game.Objects.Bank.minigame.goods;
		var goodsVal = 0;
		for (var i in marketGoods) {
			var marketGood = marketGoods[i];
			goodsVal += marketGood.stock * marketGood.val;
		}
		sellTotal += goodsVal * Game.cookiesPsRawHighest;
	}
	// Compute cookies earned by selling all buildings with optimal auras (ES + RB)
	sellTotal += CM.Sim.SellBuildingsForChoEgg();
	CM.Cache.SellForChoEgg = sellTotal;
}

CM.Cache.min = -1;
CM.Cache.max = -1;
CM.Cache.mid = -1;
CM.Cache.GoldenCookiesMult = 1;
CM.Cache.WrathCookiesMult = 1;
CM.Cache.DragonsFortuneMultAdjustment = 1;
CM.Cache.NoGoldSwitchCookiesPS = 0;
CM.Cache.SeaSpec = 0;
CM.Cache.Chain = 0;
CM.Cache.ChainWrath = 0;
CM.Cache.ChainReward = 0;
CM.Cache.ChainWrathReward = 0;
CM.Cache.ChainFrenzy = 0;
CM.Cache.ChainFrenzyWrath = 0;
CM.Cache.ChainFrenzyReward = 0;
CM.Cache.ChainFrenzyWrathReward = 0;
CM.Cache.CentEgg = 0;
CM.Cache.SellForChoEgg = 0;
CM.Cache.Title = '';
CM.Cache.HadBuildAura = false;
CM.Cache.RealCookiesEarned = -1;
CM.Cache.seasonPopShimmer;
CM.Cache.goldenShimmersByID = {};
CM.Cache.spawnedGoldenShimmer = 0;

