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
 * Section: UNSORTED */

CM.Cache.AddQueue = function() {
	CM.Cache.Queue = document.createElement('script');
	CM.Cache.Queue.type = 'text/javascript';
	CM.Cache.Queue.setAttribute('src', 'https://aktanusa.github.io/CookieMonster/queue/queue.js');
	document.head.appendChild(CM.Cache.Queue);
}

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

CM.Cache.RemakeLucky = function() {
	var goldenMult = CM.Cache.GoldenCookiesMult;
	var wrathMult = CM.Cache.WrathCookiesMult;

	CM.Cache.Lucky = (CM.Cache.NoGoldSwitchCookiesPS * 900) / 0.15;
	CM.Cache.Lucky *= CM.Cache.DragonsFortuneMultAdjustment;
	var cpsBuffMult = CM.Sim.getCPSBuffMult();
	if (cpsBuffMult > 0) {
		CM.Cache.Lucky /= cpsBuffMult;
	} else {
		CM.Cache.Lucky = 0;
	}
	CM.Cache.LuckyReward = goldenMult * (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyWrathReward = wrathMult * (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyFrenzy = CM.Cache.Lucky * 7;
	CM.Cache.LuckyRewardFrenzy = goldenMult * (CM.Cache.LuckyFrenzy * 0.15) + 13;
	CM.Cache.LuckyWrathRewardFrenzy = wrathMult * (CM.Cache.LuckyFrenzy * 0.15) + 13;
	CM.Cache.Conjure = CM.Cache.Lucky * 2;
 	CM.Cache.ConjureReward = CM.Cache.Conjure * 0.15;
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

CM.Cache.InitCookiesDiff = function() {
	CM.Cache.CookiesDiff = new Queue();
	CM.Cache.WrinkDiff = new Queue();
	CM.Cache.ChoEggDiff = new Queue();
	CM.Cache.ClicksDiff = new Queue();
}

CM.Cache.UpdateAvgCPS = function() {
	var currDate = Math.floor(Date.now() / 1000);
	if (CM.Cache.lastDate != currDate) {
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
			var choEggDiffAvg = Math.max(0,(choEggTotal - CM.Cache.lastChoEgg)) / timeDiff;
			var clicksDiffAvg = (Game.cookieClicks - CM.Cache.lastClicks) / timeDiff;
			for (var i = 0; i < timeDiff; i++) {
				CM.Cache.CookiesDiff.enqueue(bankDiffAvg);
				CM.Cache.WrinkDiff.enqueue(wrinkDiffAvg);
				CM.Cache.ChoEggDiff.enqueue(choEggDiffAvg);
				CM.Cache.ClicksDiff.enqueue(clicksDiffAvg);
			}
			// Assumes the queues are the same length
			while (CM.Cache.CookiesDiff.getLength() > 1800) {
				CM.Cache.CookiesDiff.dequeue();
				CM.Cache.WrinkDiff.dequeue();
				CM.Cache.ClicksDiff.dequeue();
			}

			while (CM.Cache.ClicksDiff.getLength() > 30) {
				CM.Cache.ClicksDiff.dequeue();
			}
		}
		CM.Cache.lastDate = currDate;
		CM.Cache.lastCookies = Game.cookies;
		CM.Cache.lastWrinkCookies = CM.Cache.WrinklersTotal;
		CM.Cache.lastChoEgg = choEggTotal;
		CM.Cache.lastClicks = Game.cookieClicks;

		var sortedGainBank = new Array();
		var sortedGainWrink = new Array();
		var sortedGainChoEgg = new Array();

		var cpsLength = Math.min(CM.Cache.CookiesDiff.getLength(), CM.Disp.cookieTimes[CM.Options.AvgCPSHist]);

		// Assumes the queues are the same length
		for (var i = CM.Cache.CookiesDiff.getLength() - cpsLength; i < CM.Cache.CookiesDiff.getLength(); i++) {
			sortedGainBank.push(CM.Cache.CookiesDiff.get(i));
			sortedGainWrink.push(CM.Cache.WrinkDiff.get(i));
			sortedGainChoEgg.push(CM.Cache.ChoEggDiff.get(i));
		}

		sortedGainBank.sort(function(a, b) { return a - b; });
		sortedGainWrink.sort(function(a, b) { return a - b; });
		sortedGainChoEgg.sort(function(a, b) { return a - b; });

		var cut = Math.round(sortedGainBank.length / 10);

		while (cut > 0) {
			sortedGainBank.shift();
			sortedGainBank.pop();
			sortedGainWrink.shift();
			sortedGainWrink.pop();
			sortedGainChoEgg.shift();
			sortedGainChoEgg.pop();
			cut--;
		}

		var totalGainBank = 0;
		var totalGainWrink = 0;
		var totalGainChoEgg = 0;

		for (var i = 0; i < sortedGainBank.length; i++) {
			totalGainBank += sortedGainBank[i];
			totalGainWrink += sortedGainWrink[i];
			totalGainChoEgg += sortedGainChoEgg[i];
		}
		// TODO: Incorporate situation if CM.Options.CalcWrink == 2
		CM.Cache.AvgCPS = (totalGainBank + (CM.Options.CalcWrink == 1 ? totalGainWrink : 0)) / sortedGainBank.length;

		var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));

		if (choEgg || CM.Options.CalcWrink == 0) {
			CM.Cache.AvgCPSChoEgg = (totalGainBank + totalGainWrink + (choEgg ? totalGainChoEgg : 0)) / sortedGainBank.length;
		}
		else {
			CM.Cache.AvgCPSChoEgg = CM.Cache.AvgCPS;
		}

		var totalClicks = 0;
		var clicksLength = Math.min(CM.Cache.ClicksDiff.getLength(), CM.Disp.clickTimes[CM.Options.AvgClicksHist]);
		for (var i = CM.Cache.ClicksDiff.getLength() - clicksLength; i < CM.Cache.ClicksDiff.getLength(); i++) {
			totalClicks += CM.Cache.ClicksDiff.get(i);
		}
		CM.Cache.AvgClicks = totalClicks / clicksLength;
	}
}

CM.Cache.CalcMissingUpgrades = function() {
	var currentMissingUpgrades = []
	for (var i in CM.Cache.MissingUpgrades) {
		if ((CM.Cache.MissingUpgrades[i].pool == "" || CM.Cache.MissingUpgrades[i].pool == "tech") && CM.Cache.MissingUpgrades[i].bought != 1) {
			currentMissingUpgrades.push(CM.Cache.MissingUpgrades[i])
		}
	}
	CM.Cache.MissingUpgrades = currentMissingUpgrades

	var currentMissingCookies = []
	for (var i in CM.Cache.MissingCookies) {
		if (CM.Cache.MissingCookies[i].pool == "cookie" && CM.Cache.MissingCookies[i].bought != 1) {
			currentMissingCookies.push(CM.Cache.MissingCookies[i])
		}
	}	
	CM.Cache.MissingCookies = currentMissingCookies
}

CM.Cache.min = -1;
CM.Cache.max = -1;
CM.Cache.mid = -1;
CM.Cache.GoldenCookiesMult = 1;
CM.Cache.WrathCookiesMult = 1;
CM.Cache.DragonsFortuneMultAdjustment = 1;
CM.Cache.NoGoldSwitchCookiesPS = 0;
CM.Cache.Lucky = 0;
CM.Cache.LuckyReward = 0;
CM.Cache.LuckyWrathReward = 0;
CM.Cache.LuckyFrenzy = 0;
CM.Cache.LuckyRewardFrenzy = 0;
CM.Cache.LuckyWrathRewardFrenzy = 0;
CM.Cache.Conjure = 0;
CM.Cache.ConjureReward = 0;
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
CM.Cache.lastDate = -1;
CM.Cache.lastCookies = -1;
CM.Cache.lastWrinkCookies = -1;
CM.Cache.lastChoEgg = -1;
CM.Cache.lastClicks = -1;
CM.Cache.CookiesDiff;
CM.Cache.WrinkDiff;
CM.Cache.ChoEggDiff;
CM.Cache.ClicksDiff;
CM.Cache.AvgCPS = -1;
CM.Cache.AvgCPSChoEgg = -1;
CM.Cache.AvgClicks = -1;
CM.Cache.MissingUpgrades = Game.Upgrades;
CM.Cache.MissingCookies = Game.Upgrades;
CM.Cache.UpgradesOwned = -1;
CM.Cache.MissingUpgradesString = null;
CM.Cache.MissingCookiesString = null;
CM.Cache.seasonPopShimmer;
CM.Cache.goldenShimmersByID = {};
CM.Cache.spawnedGoldenShimmer = 0;

