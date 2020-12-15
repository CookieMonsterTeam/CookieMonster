/**********
 * Header *
 **********/
RunCookieMonsterHeader = function() {
    CM = {};

    CM.Backup = {};

    CM.Cache = {};

    CM.Config = {};

    CM.ConfigData = {};

    CM.Data = {};

    CM.Disp = {};

    CM.Main = {};

    CM.Sim = {};
}

if (typeof CM == "undefined") {
    RunCookieMonsterHeader();
}

/*********
 * Cache *
 *********/

/**
 * This functions caches the currently selected Dragon Auras
 * It is called by CM.Sim.CopyData() and CM.Sim.InitData()
 * Uncapitalized dragon follows Game-naming
 */
CM.Cache.CacheDragonAuras = function() {
	CM.Cache.dragonAura = Game.dragonAura;
	CM.Cache.dragonAura2 = Game.dragonAura2;
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

CM.Cache.RemakeWrinkBank = function() {
	var totalSucked = 0;
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
		totalSucked += sucked;
	}
	CM.Cache.WrinkBank = totalSucked;
	CM.Cache.WrinkGodBank = totalSucked;
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		var godLvl = CM.Sim.hasGod('scorn');
		if (godLvl == 2) CM.Cache.WrinkGodBank = CM.Cache.WrinkGodBank * 1.15 / 1.1;
		else if (godLvl == 3) CM.Cache.WrinkGodBank = CM.Cache.WrinkGodBank * 1.15 / 1.05;
		else if (godLvl != 1) CM.Cache.WrinkGodBank *= 1.15;
	}
}

CM.Cache.RemakeBuildingsPP = function() {
	CM.Cache.min = -1;
	CM.Cache.max = -1;
	CM.Cache.mid = -1;
	// Calculate PP and colors when compared to purchase of single optimal building
	if (CM.Config.ColorPPBulkMode == 0) {
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
			choEggTotal += CM.Cache.WrinkGodBank;
		}
		CM.Cache.RealCookiesEarned = Math.max(Game.cookiesEarned, choEggTotal);
		choEggTotal *= 0.05;

		if (CM.Cache.lastDate != -1) {
			var timeDiff = currDate - CM.Cache.lastDate
			var bankDiffAvg = Math.max(0, (Game.cookies - CM.Cache.lastCookies)) / timeDiff;
			var wrinkDiffAvg = Math.max(0, (CM.Cache.WrinkBank - CM.Cache.lastWrinkCookies)) / timeDiff;
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
		CM.Cache.lastWrinkCookies = CM.Cache.WrinkBank;
		CM.Cache.lastChoEgg = choEggTotal;
		CM.Cache.lastClicks = Game.cookieClicks;

		var sortedGainBank = new Array();
		var sortedGainWrink = new Array();
		var sortedGainChoEgg = new Array();

		var cpsLength = Math.min(CM.Cache.CookiesDiff.getLength(), CM.Disp.cookieTimes[CM.Config.AvgCPSHist]);

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
		CM.Cache.AvgCPS = (totalGainBank + (CM.Config.CalcWrink ? totalGainWrink : 0)) / sortedGainBank.length;

		var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));

		if (choEgg || CM.Config.CalcWrink == 0) {
			CM.Cache.AvgCPSChoEgg = (totalGainBank + totalGainWrink + (choEgg ? totalGainChoEgg : 0)) / sortedGainBank.length;
		}
		else {
			CM.Cache.AvgCPSChoEgg = CM.Cache.AvgCPS;
		}

		var totalClicks = 0;
		var clicksLength = Math.min(CM.Cache.ClicksDiff.getLength(), CM.Disp.clickTimes[CM.Config.AvgClicksHist]);
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
CM.Cache.WrinkBank = -1;
CM.Cache.WrinkGodBank = -1;
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

/**
 * This variables are used by CM.Cache.CacheDragonAuras(), naming follows naming in Game
 */
CM.Cache.dragonAura = 0;
CM.Cache.dragonAura2 = 0;/**********
 * Config *
 **********/

CM.SaveConfig = function(config) {
	localStorage.setItem(CM.ConfigPrefix, JSON.stringify(config));
}

CM.LoadConfig = function() {
	if (localStorage.getItem(CM.ConfigPrefix) != null) {
		CM.Config = JSON.parse(localStorage.getItem(CM.ConfigPrefix));

		// Check values
		var mod = false;
		for (var i in CM.ConfigDefault) {
			if (typeof CM.Config[i] === 'undefined') {
				mod = true;
				CM.Config[i] = CM.ConfigDefault[i];
			}
			else if (i != 'StatsPref' && i != 'Colors') {
				if (i.indexOf('SoundURL') == -1) {
					if (!(CM.Config[i] > -1 && CM.Config[i] < CM.ConfigData[i].label.length)) {
						mod = true;
						CM.Config[i] = CM.ConfigDefault[i];
					}
				}
				else {  // Sound URLs
					if (typeof CM.Config[i] != 'string') {
						mod = true;
						CM.Config[i] = CM.ConfigDefault[i];
					}
				}
			}
			else if (i == 'StatsPref') {
				for (var j in CM.ConfigDefault.StatsPref) {
					if (typeof CM.Config[i][j] === 'undefined' || !(CM.Config[i][j] > -1 && CM.Config[i][j] < 2)) {
						mod = true;
						CM.Config[i][j] = CM.ConfigDefault[i][j];
					}
				}
			}
			else { // Colors
				for (var j in CM.ConfigDefault.Colors) {
					if (typeof CM.Config[i][j] === 'undefined' || typeof CM.Config[i][j] != 'string') {
						mod = true;
						CM.Config[i][j] = CM.ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) CM.SaveConfig(CM.Config);
		CM.Loop(); // Do loop once
		for (var i in CM.ConfigDefault) {
			if (i != 'StatsPref' && i != 'OptionsPref' && typeof CM.ConfigData[i].func !== 'undefined') {
				CM.ConfigData[i].func();
			}
		}
	}
	else { // Default values
		CM.RestoreDefault();
	}
}

CM.RestoreDefault = function() {
	CM.Config = {};
	CM.SaveConfig(CM.ConfigDefault);
	CM.LoadConfig();
	Game.UpdateMenu();
}

CM.ToggleConfig = function(config) {
	CM.ToggleConfigUp(config);
	if (CM.ConfigData[config].toggle) {
		if (CM.Config[config] == 0) {
			l(CM.ConfigPrefix + config).className = 'option off';
		}
		else {
			l(CM.ConfigPrefix + config).className = 'option';
		}
	}
}

CM.ToggleConfigUp = function(config) {
	CM.Config[config]++;
	if (CM.Config[config] == CM.ConfigData[config].label.length) {
		CM.Config[config] = 0;
	}
	if (typeof CM.ConfigData[config].func !== 'undefined') {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.ConfigData[config].label[CM.Config[config]];
	CM.SaveConfig(CM.Config);
}

CM.ToggleConfigDown = function(config) {
	CM.Config[config]--;
	if (CM.Config[config] < 0) {
		CM.Config[config] = CM.ConfigData[config].label.length - 1;
	}
	if (typeof CM.ConfigData[config].func !== 'undefined') {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.ConfigData[config].label[CM.Config[config]];
	CM.SaveConfig(CM.Config);
}

/**
 * This function sets the value of the specified volume-option and updates the display in the options menu
 * It is called by CM.Disp.CreatePrefOption()
 * @param 	{string}		config	The name of the option
 */
CM.ToggleConfigVolume = function(config) {
	if (l("slider" + config) != null) {
		l("slider" + config + "right").innerHTML = l("slider" + config).value + "%";
		CM.Config[config] = Math.round(l("slider" + config).value);
	} 
	CM.SaveConfig(CM.Config);
}

CM.ToggleStatsConfig = function(config) {
	if (CM.Config.StatsPref[config] == 0) {
		CM.Config.StatsPref[config]++;
	}
	else {
		CM.Config.StatsPref[config]--;
	}
	CM.SaveConfig(CM.Config);
}

CM.ToggleOptionsConfig = function(config) {
	if (CM.Config.OptionsPref[config] == 0) {
		CM.Config.OptionsPref[config]++;
	}
	else {
		CM.Config.OptionsPref[config]--;
	}
	CM.SaveConfig(CM.Config);
}

// Checks if the browsers has permissions to produce notifications
// Should be triggered when Config related to Notifications is toggled on
CM.CheckNotificationPermissions = function(ToggleOnOff) {
	if (ToggleOnOff == 1)	{
		// Check if browser support Promise version of Notification Permissions
		function checkNotificationPromise() {
			try {
				Notification.requestPermission().then();
			} catch(e) {
				return false;
			}
			return true;
		}

		// Check if the browser supports notifications and which type
		if (!('Notification' in window)) {
			console.log("This browser does not support notifications.");
		} 
		else {
			if(checkNotificationPromise()) {
				Notification.requestPermission().then();
			} 
			else {
				Notification.requestPermission();
			}
		}
	}
}/********
 * Data *
 ********/

CM.Data.Fortunes = [
	'Fortune #001', 
	'Fortune #002', 
	'Fortune #003', 
	'Fortune #004', 
	'Fortune #005', 
	'Fortune #006', 
	'Fortune #007', 
	'Fortune #008', 
	'Fortune #009', 
	'Fortune #010', 
	'Fortune #011', 
	'Fortune #012', 
	'Fortune #013', 
	'Fortune #014', 
	'Fortune #015', 
	'Fortune #016', 
	'Fortune #017', 
	'Fortune #018', 
	'Fortune #100', 
	'Fortune #101', 
	'Fortune #102', 
	'Fortune #103', 
	'Fortune #104'
];
CM.Data.HalloCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
CM.Data.ChristCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
CM.Data.ValCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits', 'Prism heart biscuits'];


/********
 * Section: Data for the various scales used by CookieMonster */
CM.Data.metric = ['', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
CM.Data.shortScale = ['', 'M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec', 'Quattuordec', 'Quindec', 'Sexdec', 'Septendec', 'Octodec', 'Novemdec', 'Vigint', 'Unvigint', 'Duovigint', 'Trevigint', 'Quattuorvigint'];

/********
 * Section: An array containing all Config groups and their to-be displayed title */

CM.ConfigGroups = {
	BarsColors: "Bars/Colors",
	Calculation: "Calculation",
	Notification: "Notification",
	Tooltip: "Tooltips",
	Statistics: "Statitics",
	Other: "Other"}, 

/********
 * Section: An array (CM.ConfigData) containing all Config options
 * 
 * Each array has the following items
 * @item {string}			type	The type of option (bool(ean), vol(ume), url or color)
 * @item {string}			group	The options-group the option belongs to
 * @item {[string, ...]}	label	A list of the various configurations of the option
 * @item {string}			desc 	Description to be used in options menu
 * @item {boolean}			toggle	Whether it should be displayed as a grey/white toggle in the options menu
 * @item {function}			func	A function to be called when the option is toggled
 */

// Barscolors
CM.ConfigData.BotBar = {type: 'bool', group: 'BarsColors', label: ['Bottom Bar OFF', 'Bottom Bar ON'], desc: 'Building Information', toggle: true, func: function() {CM.Disp.ToggleBotBar();}};
CM.ConfigData.TimerBar = {type: 'bool', group: 'BarsColors', label: ['Timer Bar OFF', 'Timer Bar ON'], desc: 'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy', toggle: true, func: function() {CM.Disp.ToggleTimerBar();}};
CM.ConfigData.TimerBarPos = {type: 'bool', group: 'BarsColors', label: ['Timer Bar Position (Top Left)', 'Timer Bar Position (Bottom)'], desc: 'Placement of the Timer Bar', toggle: false, func: function() {CM.Disp.ToggleTimerBarPos();}};
CM.ConfigData.SortBuildings = {type: 'bool', group: 'BarsColors', label: ['Sort Buildings: Default', 'Sort Buildings: PP'], desc: 'Sort the display of buildings in either default order or by PP', toggle: false,	func: function () { CM.Disp.UpdateBuildings();}};
CM.ConfigData.SortUpgrades = {type: 'bool', group: 'BarsColors', label: ['Sort Upgrades: Default', 'Sort Upgrades: PP'], desc: 'Sort the display of upgrades in either default order or by PP', toggle: false, func: function () { CM.Disp.UpdateUpgrades();}};
CM.ConfigData.BuildColor = {type: 'bool', group: 'BarsColors', label: ['Building Colors OFF', 'Building Colors ON'], desc: 'Color code buildings', toggle: true, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.BulkBuildColor = {type: 'bool', group: 'BarsColors', label: ['Bulk Building Colors (Single Building Color)', 'Bulk Building Colors (Calculated Bulk Color)'], desc: 'Color code bulk buildings based on single buildings color or calculated bulk value color', toggle: false, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.ColorPPBulkMode = {type: 'bool', group: 'BarsColors', label: ['Color of PP (Compared to Single)', 'Color of PP (Compared to Bulk)'], desc: 'Color PP-values based on comparison with single purchase or with selected bulk-buy mode', toggle: false};
CM.ConfigData.UpBarColor = {type: 'bool', group: 'BarsColors', label: ['Upgrade Colors/Bar OFF', 'Upgrade Colors with Bar ON', 'Upgrade Colors without Bar ON'], desc: 'Color code upgrades and optionally add a counter bar', toggle: false, func: function() {CM.Disp.ToggleUpgradeBarAndColor();}};
CM.ConfigData.Colors = { type: 'color', group: 'BarsColors',
	desc: {
		Blue: 'Color Blue.  Used to show better than best PP building, for Click Frenzy bar, and for various labels', 
		Green: 'Color Green.  Used to show best PP building, for Blood Frenzy bar, and for various labels', 
		Yellow: 'Color Yellow.  Used to show between best and worst PP buildings closer to best, for Frenzy bar, and for various labels', 
		Orange: 'Color Orange.  Used to show between best and worst PP buildings closer to worst, for Next Reindeer bar, and for various labels', 
		Red: 'Color Red.  Used to show worst PP building, for Clot bar, and for various labels', 
		Purple: 'Color Purple.  Used to show worse than worst PP building, for Next Cookie bar, and for various labels', 
		Gray: 'Color Gray.  Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar', 
		Pink: 'Color Pink.  Used for Dragonflight bar', 
		Brown: 'Color Brown.  Used for Dragon Harvest bar'
	}, 
	func: function() {CM.Disp.UpdateColors();}
};
CM.ConfigData.UpgradeBarFixedPos = {type: 'bool', group: 'BarsColors', label: ['Upgrade Bar Fixed Position OFF', 'Upgrade Bar Fixed Position ON'], desc: 'Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling', toggle: true, func: function() {CM.Disp.ToggleUpgradeBarFixedPos();}};

// Calculation
CM.ConfigData.CalcWrink = {type: 'bool', group: 'Calculation', label: ['Calculate with Wrinklers OFF', 'Calculate with Wrinklers ON'], desc: 'Calculate times and average Cookies Per Second with Wrinklers', toggle: true};
CM.ConfigData.CPSMode = {type: 'bool', group: 'Calculation', label: ['Current Cookies Per Second', 'Average Cookies Per Second'], desc: 'Calculate times using current Cookies Per Second or average Cookies Per Second', toggle: false};
CM.ConfigData.AvgCPSHist = {type: 'bool', group: 'Calculation', label: ['Average CPS for past 10s', 'Average CPS for past 15s', 'Average CPS for past 30s', 'Average CPS for past 1m', 'Average CPS for past 5m', 'Average CPS for past 10m', 'Average CPS for past 15m', 'Average CPS for past 30m'], desc: 'How much time average Cookies Per Second should consider', toggle: false};
CM.ConfigData.AvgClicksHist = {type: 'bool', group: 'Calculation', label: ['Average Cookie Clicks for past 1s', 'Average Cookie Clicks for past 5s', 'Average Cookie Clicks for past 10s', 'Average Cookie Clicks for past 15s', 'Average Cookie Clicks for past 30s'], desc: 'How much time average Cookie Clicks should consider', toggle: false};
CM.ConfigData.ToolWarnBon = {type: 'bool', group: 'Calculation', label: ['Calculate Tooltip Warning With Bonus CPS OFF', 'Calculate Tooltip Warning With Bonus CPS ON'], desc: 'Calculate the warning with or without the bonus CPS you get from buying', toggle: true};

// Notification
CM.ConfigData.GCNotification = {type: 'bool', group: 'Notification', label: ['Golden Cookie Notification OFF', 'Golden Cookie Notification ON'], desc: 'Create a notification when Golden Cookie spawns', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.GCNotification);}};
CM.ConfigData.GCFlash = {type: 'bool', group: 'Notification', label: ['Golden Cookie Flash OFF', 'Golden Cookie Flash ON'], desc: 'Flash screen on Golden Cookie', toggle: true};
CM.ConfigData.GCSound = {type: 'bool', group: 'Notification', label: ['Golden Cookie Sound OFF', 'Golden Cookie Sound ON'], desc: 'Play a sound on Golden Cookie', toggle: true};
CM.ConfigData.GCVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Golden Cookie'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GCVolume.label[i] = i + '%';
}
CM.ConfigData.GCSoundURL = {type: 'url', group: 'Notification', label: 'Golden Cookie Sound URL:', desc: 'URL of the sound to be played when a Golden Cookie spawns'};
CM.ConfigData.GCTimer = {type: 'bool', group: 'Notification', label: ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'], desc: 'A timer on the Golden Cookie when it has been spawned', toggle: true, func: function() {CM.Disp.ToggleGCTimer();}};
CM.ConfigData.Favicon = {type: 'bool', group: 'Notification', label: ['Favicon OFF', 'Favicon ON'], desc: 'Update favicon with Golden/Wrath Cookie', toggle: true, func: function() {CM.Disp.UpdateFavicon();}};
CM.ConfigData.FortuneNotification = {type: 'bool', group: 'Notification', label: ['Fortune Cookie Notification OFF', 'Fortune Cookie Notification ON'], desc: 'Create a notification when Fortune Cookie is on the Ticker', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.FortuneNotification);}};
CM.ConfigData.FortuneFlash = {type: 'bool', group: 'Notification', label: ['Fortune Cookie Flash OFF', 'Fortune Cookie Flash ON'], desc: 'Flash screen on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneSound = {type: 'bool', group: 'Notification', label: ['Fortune Cookie Sound OFF', 'Fortune Cookie Sound ON'], desc: 'Play a sound on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Fortune Cookie'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.FortuneVolume.label[i] = i + '%';
}
CM.ConfigData.FortuneSoundURL = {type: 'url', group: 'Notification', label: 'Fortune Cookie Sound URL:', desc: 'URL of the sound to be played when the Ticker has a Fortune Cookie'};
CM.ConfigData.SeaNotification = {type: 'bool', group: 'Notification', label: ['Season Special Notification OFF', 'Season Special Notification ON'], desc: 'Create a notification on Season Popup', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.SeaNotification);}};
CM.ConfigData.SeaFlash = {type: 'bool', group: 'Notification', label: ['Season Special Flash OFF', 'Season Special Flash ON'], desc: 'Flash screen on Season Popup', toggle: true};
CM.ConfigData.SeaSound = {type: 'bool', group: 'Notification', label: ['Season Special Sound OFF', 'Season Special Sound ON'], desc: 'Play a sound on Season Popup', toggle: true};
CM.ConfigData.SeaVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Season Special'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.SeaVolume.label[i] = i + '%';
}
CM.ConfigData.SeaSoundURL = {type: 'url', group: 'Notification', label: 'Season Special Sound URL:', desc: 'URL of the sound to be played when a Season Special spawns'};
CM.ConfigData.GardFlash = {type: 'bool', group: 'Notification', label: ['Garden Tick Flash OFF', 'Garden Tick Flash ON'], desc: 'Flash screen on Garden Tick', toggle: true};
CM.ConfigData.GardSound = {type: 'bool', group: 'Notification', label: ['Garden Tick Sound OFF', 'Garden Tick Sound ON'], desc: 'Play a sound on Garden Tick', toggle: true};
CM.ConfigData.GardVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Garden Tick'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GardVolume.label[i] = i + '%';
}
CM.ConfigData.GardSoundURL = {type: 'url', group: 'Notification', label: 'Garden Tick Sound URL:', desc: 'URL of the sound to be played when the garden ticks'};
CM.ConfigData.MagicNotification = {type: 'bool', group: 'Notification', label: ['Magic Max Notification OFF', 'Magic Max Notification ON'], desc: 'Create a notification when magic reaches maximum', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.MagicNotification);}};
CM.ConfigData.MagicFlash = {type: 'bool', group: 'Notification', label: ['Magic Max Flash OFF', 'Magic Max Flash ON'], desc: 'Flash screen when magic reaches maximum', toggle: true};
CM.ConfigData.MagicSound = {type: 'bool', group: 'Notification', label: ['Magic Max Sound OFF', 'Magic Max Sound ON'], desc: 'Play a sound when magic reaches maximum', toggle: true};
CM.ConfigData.MagicVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Max Magic'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.MagicVolume.label[i] = i + '%';
}
CM.ConfigData.MagicSoundURL = {type: 'url', group: 'Notification', label: 'Magic Max Sound URL:', desc: 'URL of the sound to be played when magic reaches maxium'};
CM.ConfigData.WrinklerNotification = {type: 'bool', group: 'Notification', label: ['Wrinkler Notification OFF', 'Wrinkler Notification ON'], desc: 'Create a notification when a Wrinkler appears', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.WrinklerNotification);}};
CM.ConfigData.WrinklerFlash = {type: 'bool', group: 'Notification', label: ['Wrinkler Flash OFF', 'Wrinkler Flash ON'], desc: 'Flash screen when a Wrinkler appears', toggle: true};
CM.ConfigData.WrinklerSound = {type: 'bool', group: 'Notification', label: ['Wrinkler Sound OFF', 'Wrinkler Sound ON'], desc: 'Play a sound when a Wrinkler appears', toggle: true};
CM.ConfigData.WrinklerVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Wrinkler'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.WrinklerVolume.label[i] = i + '%';
}
CM.ConfigData.WrinklerSoundURL = {type: 'url', group: 'Notification', label: 'Wrinkler Sound URL:', desc: 'URL of the sound to be played when a Wrinkler appears'};
CM.ConfigData.WrinklerMaxNotification = {type: 'bool', group: 'Notification', label: ['Wrinkler Max Notification OFF', 'Wrinkler Max Notification ON'], desc: 'Create a notification when the maximum amount of Wrinklers has appeared', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.WrinklerMaxNotification);}};
CM.ConfigData.WrinklerMaxFlash = {type: 'bool', group: 'Notification', label: ['Wrinkler Max Flash OFF', 'Wrinkler Max Flash ON'], desc: 'Flash screen when the maximum amount of Wrinklers has appeared', toggle: true};
CM.ConfigData.WrinklerMaxSound = {type: 'bool', group: 'Notification', label: ['Wrinkler Max Sound OFF', 'Wrinkler Max Sound ON'], desc: 'Play a sound when the maximum amount of Wrinklers has appeared', toggle: true};
CM.ConfigData.WrinklerMaxVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Wrinkler Max'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.WrinklerMaxVolume.label[i] = i + '%';
}
CM.ConfigData.WrinklerMaxSoundURL = {type: 'url', group: 'Notification', label: 'Wrinkler Max Sound URL:', desc: 'URL of the sound to be played when the maximum amount of Wrinklers has appeared'};
CM.ConfigData.Title = {type: 'bool', group: 'Notification', label: ['Title OFF', 'Title ON', 'Title Pinned Tab Highlight'], desc: 'Update title with Golden Cookie/Season Popup timers; pinned tab highlight only changes the title when a Golden Cookie/Season Popup spawns', toggle: true};

// Tooltip
CM.ConfigData.TooltipBuildUp = {type: 'bool', group: 'Tooltip', label: ['Buildings/Upgrades Tooltip Information OFF', 'Buildings/Upgrades Tooltip Information ON'], desc: 'Extra information in tooltip for buildings/upgrades', toggle: true};
CM.ConfigData.TooltipAmor = {type: 'bool', group: 'Tooltip', label: ['Buildings Tooltip Amortization Information OFF', 'Buildings Tooltip Amortization Information ON'], desc: 'Add amortization information to buildings tooltip', toggle: true};
CM.ConfigData.ToolWarnLucky = {type: 'bool', group: 'Tooltip', label: ['Tooltip Lucky Warning OFF', 'Tooltip Lucky Warning ON'], desc: 'A warning when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards', toggle: true};
CM.ConfigData.ToolWarnConjure = {type: 'bool', group: 'Tooltip', label: ['Tooltip Conjure Warning OFF', 'Tooltip Conjure Warning ON'], desc: 'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards', toggle: true};
CM.ConfigData.ToolWarnPos = {type: 'bool', group: 'Tooltip', label: ['Tooltip Warning Position (Left)', 'Tooltip Warning Position (Bottom)'], desc: 'Placement of the warning boxes', toggle: false, func: function() {CM.Disp.ToggleToolWarnPos();}};
CM.ConfigData.TooltipGrim = {type: 'bool', group: 'Tooltip', label: ['Grimoire Tooltip Information OFF', 'Grimoire Tooltip Information ON'], desc: 'Extra information in tooltip for grimoire', toggle: true};
CM.ConfigData.ToolWrink = {type: 'bool', group: 'Tooltip', label: ['Wrinkler Tooltip OFF', 'Wrinkler Tooltip ON'], desc: 'Shows the amount of cookies a wrinkler will give when popping it', toggle: true};
CM.ConfigData.TooltipLump = {type: 'bool', group: 'Tooltip', label: ['Sugar Lump Tooltip OFF', 'Sugar Lump Tooltip ON'], desc: 'Shows the current Sugar Lump type in Sugar lump tooltip.', toggle: true};
CM.ConfigData.DragonAuraInfo = {type: 'bool', group: 'Tooltip', label: ['Extra Dragon Aura Info OFF', 'Extra Dragon Aura Info ON'], desc: 'Shows information about changes in CPS and costs in the dragon aura interface.', toggle: true};

// Statistics
CM.ConfigData.Stats = {type: 'bool', group: 'Statistics', label: ['Statistics OFF', 'Statistics ON'], desc: 'Extra Cookie Monster statistics!', toggle: true};
CM.ConfigData.MissingUpgrades = {type: 'bool', group: 'Statistics', label: ['Missing Upgrades OFF', 'Missing Upgrades ON'], desc: 'Shows Missing upgrades in Stats Menu. This feature can be laggy for users with a low amount of unlocked achievements.', toggle: true};
CM.ConfigData.UpStats = {type: 'bool', group: 'Statistics', label: ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'], desc: 'Default Game rate is once every 5 seconds', toggle: false};
CM.ConfigData.TimeFormat = {type: 'bool', group: 'Statistics', label: ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'], desc: 'Change the time format', toggle: false};
CM.ConfigData.DetailedTime = {type: 'bool', group: 'Statistics', label: ['Detailed Time OFF', 'Detailed Time ON'], desc: 'Change how time is displayed in certain statistics and tooltips', toggle: true, func: function() {CM.Disp.ToggleDetailedTime();}};
CM.ConfigData.GrimoireBar = {type: 'bool', group: 'Statistics', label: ['Grimoire Magic Meter Timer OFF', 'Grimoire Magic Meter Timer ON'], desc: 'A timer on how long before the Grimoire magic meter is full', toggle: true};

// Statistics
CM.ConfigData.Scale = {type: 'bool', group: 'Other', label: ['Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation', 'Engineering Notation'], desc: 'Change how long numbers are handled', toggle: false, func: function() {CM.Disp.RefreshScale();}};

/********
 * Disp *
 ********/

/********
 * Please make sure to annotate your code correctly using JSDoc.
 * Only put functions related to graphics and displays in this file. 
 * All calculations and data should preferrably be put in other files. */

/********
 * Section: Auxilirary functions used by other functions

/**
 * This function returns the total amount stored in the Wrinkler Bank 
 * as calculated by CM.Cache.RemakeWrinkBank() if CM.Config.CalcWrink is set
 * @returns	{number}	0 or the amount of cookies stored (CM.Cache.WrinkBank)
 */
CM.Disp.GetWrinkConfigBank = function() {
	if (CM.Config.CalcWrink)
		return CM.Cache.WrinkBank;
	else
		return 0;
}

/**
 * This function pops all normal wrinklers 
 * It is called by a click of the 'pop all' button created by CM.Disp.AddMenuStats()
 */
CM.Disp.PopAllNormalWrinklers = function() {
	for (var i in Game.wrinklers) {
		if (Game.wrinklers[i].sucked > 0 && Game.wrinklers[i].type == 0) {
			Game.wrinklers[i].hp = 0;
		}
	}
}

/**
 * This function returns the cps as either current or average CPS depending on CM.Config.CPSMode
 * @returns	{number}	The average or current cps
 */
CM.Disp.GetCPS = function() {
	if (CM.Config.CPSMode)
		return CM.Cache.AvgCPS;
	else
		return (Game.cookiesPs * (1 - Game.cpsSucked));
}

/**
 * This function calculates the time it takes to reach a certain magic level
 * It is called by CM.Disp.UpdateTooltipGrimoire()
 * @param	{number}	currentMagic		The current magic level
 * @param	{number}	maxMagic			The user's max magic level
 * @param	{number}	targetMagic			The target magic level
 * @returns	{number}	count / Game.fps	The time it takes to reach targetMagic
 */
CM.Disp.CalculateGrimoireRefillTime = function(currentMagic, maxMagic, targetMagic) {
	var count = 0;
	while (currentMagic < targetMagic) {
		currentMagic += Math.max(0.002, Math.pow(currentMagic / Math.max(maxMagic, 100), 0.5)) * 0.002;
		count++;
	}
	return count / Game.fps;
}

/**
 * This function returns Name and Color as object for sugar lump type that is given as input param.
 * It is called by CM.Disp.UpdateTooltipSugarLump()
 * TODO: Can't this be done with a normal array in Data.js? Or as variable-array at end of this file?
 * @param 	{string} 				type 			Sugar Lump Type.
 * @returns {{string}, {string}}	text, color		An array containing the text and display-color of the sugar lump
 */
CM.Disp.GetLumpColor = function(type) {
	var name = "";
	var color = "";

	switch (type) {
		case 0:
			name = "Normal";
			color = CM.Disp.colorGray;
			break;
		case 1:
            name = "Bifurcated";
            color = CM.Disp.colorGreen;
			break;
		case 2:
            name = "Golden";
            color = CM.Disp.colorYellow;
			break;
		case 3:
            name = "Meaty";
            color = CM.Disp.colorOrange;
			break;
		case 4:
            name = "Caramelized";
            color = CM.Disp.colorPurple;
			break;
		default:
			name = "Unknown Sugar Lump";
			color = CM.Disp.colorRed;
			break;
	}

    return {text: name, color: color};
};

/********
 * Section: General functions to format or beautify strings */

/**
 * This function returns time as a string depending on TimeFormat setting
 * @param  	{number} 	time		Time to be formatted
 * @param  	{number}	longFormat 	1 or 0
 * @returns	{string}				Formatted time
 */
CM.Disp.FormatTime = function(time, longFormat) {
	if (time == Infinity) return time;
	time = Math.ceil(time);
	var y = Math.floor(time / 31557600);
	var d = Math.floor(time % 31557600 / 86400);
	var h = Math.floor(time % 86400 / 3600);
	var m = Math.floor(time % 3600 / 60);
	var s = Math.floor(time % 60);
	var str = '';
	if (CM.Config.TimeFormat) {
		if (time > 3155760000) return 'XX:XX:XX:XX:XX';
		str += (y < 10 ? '0' : '') + y + ':';
		str += (d < 10 ? '0' : '') + d + ':';
		str += (h < 10 ? '0' : '') + h + ':';
		str += (m < 10 ? '0' : '') + m + ':';
		str += (s < 10 ? '0' : '') + s + ':';
	} else {
		if (time > 777600000) return longFormat ? 'Over 9000 days!' : '>9000d';
		str += (d > 0 ? d + (longFormat ? (d == 1 ? ' day' : ' days') : 'd') + ', ': "");
		if (str.length > 0 || h > 0) str += h + (longFormat ? (h == 1 ? ' hour' : ' hours') : 'h') + ', ';
		if (str.length > 0 || m > 0) str += m + (longFormat ? (m == 1 ? ' minute' : ' minutes') : 'm') + ', ';
		str += s + (longFormat ? (s == 1 ? ' second' : ' seconds') : 's');
	}
	return str;
}

/**
 * This function returns the color to be used for time-strings
 * @param	{number}			time			Time to be coloured
 * @returns {{string, string}}	{text, color}	Both the formatted time and color as strings in an array
 */
CM.Disp.GetTimeColor = function(time) {
	var color;
	var text;
	if (time < 0) {
		if (CM.Config.TimeFormat) text = '00:00:00:00:00';
		else text = 'Done!';
		color = CM.Disp.colorGreen;
	} 
	else {
		text = CM.Disp.FormatTime(time);
		if (time > 300) color =  CM.Disp.colorRed;
		else if (time > 60) color =  CM.Disp.colorOrange;
		else color =  CM.Disp.colorYellow;
	}
	return {text: text, color: color};
}

/**
 * This function returns formats number based on the Scale setting
 * @param	{number}	num		Number to be beautified
 * @param 	{any}		frac 	Used in some scenario's by CM.Backup.Beautify (Game's original function)
 * @param	{number}	forced	Used to force (type 3) in certains cases
 * @returns	{string}			Formatted number
 * TODO: Add functionality to choose amount of decimals and separators
 */
CM.Disp.Beautify = function(num, frac, forced) {
	var decimals = 3; // This can be used to implement function to let user choose amount of decimals
	if (CM.Config.Scale == 0) {
		return CM.Backup.Beautify(num, frac);
	}
	else if (isFinite(num)) {
		var answer = '';
		if (num < 0) {
			num = Math.abs(num);
			var negative = true;
		}
		num = num.toString();
		var timesTenToPowerThree = Math.trunc(Math.log10(num) / 3)
		if (num == "0") {
			return num
		}
		else if (-1 < timesTenToPowerThree && timesTenToPowerThree < 2) {
			answer = Math.round(num * 100) / 100;
		}
		else if (CM.Config.Scale == 3 && !forced || forced == 3) { // Scientific notation, 123456789 => 1.235E+8
			answer = num[0] + '.'
			i = 0;
			while (i < decimals - 1) {
				answer += num[i + 2]; // num has a 0-based index and [1] is a '.'
				i++;
			}
			answer += Math.round(num[i + 2] + '.' + num[i + 3]);
			answer += 'E+' + Math.trunc(Math.log10(num));
		}
		else {
			var restOfNumber = (num / Math.pow(10, (timesTenToPowerThree * 3))).toString();
			// Check if number contains decimals
			numbersToAdd = (restOfNumber.indexOf('.') > -1 ? restOfNumber.indexOf('.') + 1 + decimals : (restOfNumber.length))
			i = 0
			while (i < numbersToAdd - 1 && i < restOfNumber.length - 1) {
				answer += restOfNumber[i];
				i++
			}
			answer += (i + 1 < restOfNumber.length ? Math.round(restOfNumber[i] + '.' + restOfNumber[i + 1]) : restOfNumber[i]);

			// answer is now "xxx.xx" (e.g., 123456789 would be 123.46)
			if (CM.Config.Scale == 1 && !forced || forced == 1) { // Metric scale, 123456789 => 123.457 M
				if (timesTenToPowerThree - 1 < CM.Data.metric.length) {
					answer += ' ' + CM.Data.metric[timesTenToPowerThree - 1]
				}
				else { // If number is too large, revert to scientific notation
					return CM.Disp.Beautify(num, 0, 3);	
				}
			}
			else if (CM.Config.Scale == 2 && !forced || forced == 2) { // Short scale, 123456789 => 123.457 M
				if (timesTenToPowerThree < CM.Data.shortScale.length + 1) {
					answer += ' ' + CM.Data.shortScale[timesTenToPowerThree - 1];
				}
				else { // If number is too large, revert to scientific notation
					return CM.Disp.Beautify(num, 0, 3);
				}
			}
			else if (CM.Config.Scale == 4 && !forced || forced == 4) { // Engineering notation, 123456789 => 123.457E+6
				answer += 'E+' + (timesTenToPowerThree * 3);
			}
		}
		if (answer === '') {
			console.log("Could not beautify number with CM.Disp.Beautify:" + num);
			answer = CM.Backup.Beautify(num, frac); 
		}
		if (negative) answer = '-' + answer;
		return answer.toString();
	}
	else if (num == Infinity) {
		return "Infinity";
	}
	else {
		console.log("Could not beautify number with CM.Disp.Beautify:" + num);
		return CM.Backup.Beautify(num, frac);
	}
}

/********
 * Section: General functions related to display, drawing and initialization of the page */

/**
 * This function disables and shows the bars created by CookieMonster when the game is "ascending"
 * It is called by CM.Loop()
 */
CM.Disp.UpdateAscendState = function() {
	if (Game.OnAscend) {
		l('game').style.bottom = '0px';
		if (CM.Config.BotBar == 1) CM.Disp.BotBar.style.display = 'none';
		if (CM.Config.TimerBar == 1) CM.Disp.TimerBar.style.display = 'none';
	}
	else {
		CM.Disp.ToggleBotBar();
		CM.Disp.ToggleTimerBar();
	}
	CM.Disp.UpdateBackground();
}

/**
 * This function creates a CSS style that stores certain standard CSS classes used by CookieMonster
 * It is called by CM.DelayInit()
 */
CM.Disp.CreateCssArea = function() {
	CM.Disp.Css = document.createElement('style');
	CM.Disp.Css.type = 'text/css';

	document.head.appendChild(CM.Disp.Css);
}

/**
 * TODO: What does this do? @Aktanusa
 * It is called by CM.Init()
 */
CM.Disp.AddJscolor = function() {
	CM.Disp.Jscolor = document.createElement('script');
	CM.Disp.Jscolor.type = 'text/javascript';
	CM.Disp.Jscolor.setAttribute('src', 'https://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(CM.Disp.Jscolor);
}

/**
 * This function sets the size of the background of the full game and the left column
 * depending on whether certain abrs are activated
 * It is called by CM.Disp.UpdateAscendState() and CM.Disp.UpdateBotTimerBarPosition()
 */
CM.Disp.UpdateBackground = function() {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
}

/**
 * This function handles custom drawing for the Game.Draw() function.
 * It is hooked on 'draw' by CM.RegisterHooks()
 */
CM.Disp.Draw = function () {
	// Draw autosave timer in stats menu
	if (
		(Game.prefs.autosave && Game.drawT % 10 == 0) && // with autosave ON and every 10 ticks
		(Game.onMenu == 'stats' && CM.Config.Stats) // while being on the stats menu only
	) {
		var timer = document.getElementById('CMStatsAutosaveTimer');
		if (timer) {
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.T % (Game.fps * 60)), 4);
		}
	}
}

/********
 * Section: Functions related to the Bottom Bar */

/**
 * This function toggle the bottom bar
 * It is called by CM.Disp.UpdateAscendState() and a change in CM.Config.BotBar
 */
CM.Disp.ToggleBotBar = function() {
	if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.display = '';
		CM.Disp.UpdateBotBar();
	}
	else {
		CM.Disp.BotBar.style.display = 'none';
	}
	CM.Disp.UpdateBotTimerBarPosition();
}

/**
 * This function creates the bottom bar and appends it to l('wrapper')
 * It is called by CM.DelayInit and a change in CM.Config.BotBar
 */
CM.Disp.CreateBotBar = function() {
	CM.Disp.BotBar = document.createElement('div');
	CM.Disp.BotBar.id = 'CMBotBar';
	CM.Disp.BotBar.style.height = '69px';
	CM.Disp.BotBar.style.width = '100%';
	CM.Disp.BotBar.style.position = 'absolute';
	CM.Disp.BotBar.style.display = 'none';
	CM.Disp.BotBar.style.backgroundColor = '#262224';
	// This is old code for very old browsersand should not be needed anymore
	//CM.Disp.BotBar.style.backgroundImage = '-moz-linear-gradient(top, #4d4548, #000000)';
	//CM.Disp.BotBar.style.backgroundImage = '-o-linear-gradient(top, #4d4548, #000000)';
	//CM.Disp.BotBar.style.backgroundImage = '-webkit-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
	CM.Disp.BotBar.style.borderTop = '1px solid black';
	CM.Disp.BotBar.style.overflow = 'auto';
	CM.Disp.BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';

	var table = CM.Disp.BotBar.appendChild(document.createElement('table'));
	table.style.width = '100%';
	table.style.textAlign = 'center';
	table.style.whiteSpace = 'nowrap';
	var tbody = table.appendChild(document.createElement('tbody'));

	var firstCol = function(text, color) {
		var td = document.createElement('td');
		td.style.textAlign = 'right';
		td.className = CM.Disp.colorTextPre + color;
		td.textContent = text;
		return td;
	}
	var type = tbody.appendChild(document.createElement('tr'));
	type.style.fontWeight = 'bold';
	type.appendChild(firstCol(CM.VersionMajor + '.' + CM.VersionMinor, CM.Disp.colorYellow));
	var bonus = tbody.appendChild(document.createElement('tr'));
	bonus.appendChild(firstCol('Bonus Income', CM.Disp.colorBlue));
	var pp = tbody.appendChild(document.createElement('tr'));
	pp.appendChild(firstCol('Payback Period', CM.Disp.colorBlue));
	var time = tbody.appendChild(document.createElement('tr'));
	time.appendChild(firstCol('Time Left', CM.Disp.colorBlue));

	for (var i in Game.Objects) {
		CM.Disp.CreateBotBarBuildingColumn(i);
	}

	l('wrapper').appendChild(CM.Disp.BotBar);
}

/**
 * This function updates the bonus-, pp-, and time-rows in the the bottom bar
 * It is called by CM.Loop()
 */
CM.Disp.UpdateBotBar = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;
		for (var i in CM.Cache.Objects) {
			var target = 'Objects';
			if (Game.buyBulk == 10) {target = 'Objects10';}
			if (Game.buyBulk == 100) {target = 'Objects100';}
			count++;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].textContent = Game.Objects[i].amount;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify(CM.Cache[target][i].bonus, 2);
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].className = CM.Disp.colorTextPre + CM.Cache[target][i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache[target][i].pp, 2);
			var timeColor = CM.Disp.GetTimeColor((Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].className = CM.Disp.colorTextPre + timeColor.color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
}

/**
 * This function extends the bottom bar (created by CM.Disp.CreateBotBar) with a column for the given building.
 * This function is called by CM.Disp.CreateBotBar on initialization of Cookie Monster,
 * and also in CM.Sim.CopyData if a new building (added by another mod) is discovered.
 * @param	{string}	buildingName	Objectname to be added (e.g., "Cursor")
 */
CM.Disp.CreateBotBarBuildingColumn = function(buildingName) {
	if(!CM.Disp.BotBar) {
		CM.Disp.CreateBotBar();
		return; // CreateBotBar will call this function again
	}

	var type  = CM.Disp.BotBar.firstChild.firstChild.childNodes[0];
	var bonus = CM.Disp.BotBar.firstChild.firstChild.childNodes[1];
	var pp    = CM.Disp.BotBar.firstChild.firstChild.childNodes[2];
	var time  = CM.Disp.BotBar.firstChild.firstChild.childNodes[3];

	var i = buildingName;
	var header = type.appendChild(document.createElement('td'));
	header.appendChild(document.createTextNode((i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' ('));

	var span = header.appendChild(document.createElement('span'));
	span.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;

	header.appendChild(document.createTextNode(')'));
	bonus.appendChild(document.createElement('td'));
	pp.appendChild(document.createElement('td'));
	time.appendChild(document.createElement('td'));
}

/********
 * Section: Functions related to the Timer Bar 

/**
 * This function creates the TimerBar and appends it to l('wrapper')
 * It is called by CM.DelayInit()
 */
CM.Disp.CreateTimerBar = function() {
	CM.Disp.TimerBar = document.createElement('div');
	CM.Disp.TimerBar.id = 'CMTimerBar';
	CM.Disp.TimerBar.style.position = 'absolute';
	CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.TimerBar.style.height = '48px';
	CM.Disp.TimerBar.style.fontSize = '10px';
	CM.Disp.TimerBar.style.fontWeight = 'bold';
	CM.Disp.TimerBar.style.backgroundColor = 'black';

	CM.Disp.TimerBars = {};
	CM.Disp.BuffTimerBars = {};

	// Create standard Golden Cookie bar
	CM.Disp.TimerBars['CMTimerBarGC'] = CM.Disp.TimerBarCreateBar('CMTimerBarGC', 
		'Next Cookie', 
		[{id: 'CMTimerBarGCMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarGCBar', color: CM.Disp.colorPurple}]
		);
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBars['CMTimerBarGC'])

	// Create standard Reindeer bar
	CM.Disp.TimerBars['CMTimerBarRen'] = CM.Disp.TimerBarCreateBar('CMTimerBarRen', 
		'Next Reindeer', 
		[{id: 'CMTimerBarRenMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarRenBar', color: CM.Disp.colorOrange}]
		);
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBars['CMTimerBarRen'])

	l('wrapper').appendChild(CM.Disp.TimerBar);
}

/**
 * This function creates an indivudual timer for the timer bar
 * It is called by CM.DelayInit()
 * @param	{string}					id					An id to identify the timer
 * @param	{string}					name				The title of the timer
 * @param	[{{string}, {string}}, ...]	bars ([id, color])	The id and colours of individual parts of the timer
 */
CM.Disp.TimerBarCreateBar = function(id, name, bars) {
	timerBar = document.createElement('div');
	timerBar.id = 'CMTimerBarGC';
	timerBar.style.height = '12px';
	timerBar.style.margin = '0px 10px';
	timerBar.style.position = 'relative';

	var div = document.createElement('div');
	div.style.width = '100%';
	div.style.height = '10px';
	div.style.margin = 'auto';
	div.style.position = 'absolute';
	div.style.left = '0px';
	div.style.top = '0px';
	div.style.right = '0px';
	div.style.bottom = '0px';

	var type = document.createElement('span');
	type.style.display = 'inline-block';
	type.style.textAlign = 'right';
	type.style.width = '108px';
	type.style.marginRight = '5px';
	type.style.verticalAlign = 'text-top';
	type.textContent = name;
	div.appendChild(type);

	for (var i = 0; i < bars.length; i++) {
		var colorBar = document.createElement('span');
		colorBar.id = bars[i].id
		colorBar.style.display = 'inline-block';
		colorBar.style.height = '10px';
		if (bars.length - 1 == i) {
			colorBar.style.borderTopRightRadius = '10px';
			colorBar.style.borderBottomRightRadius = '10px';
		}
		if (typeof bars[i].color !== 'undefined') {
			colorBar.className = CM.Disp.colorBackPre + bars[i].color;
		}
		div.appendChild(colorBar);
	}

	var timer = document.createElement('span');
	timer.id = id + 'Time';
	timer.style.marginLeft = '5px';
	timer.style.verticalAlign = 'text-top';
	div.appendChild(timer);
	
	timerBar.appendChild(div);

	return timerBar;
}

/**
 * This function creates an indivudual timer for the timer bar
 * It is called by CM.Loop()
 */
CM.Disp.UpdateTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		// label width: 113, timer width: 26, div margin: 20
		var maxWidth = CM.Disp.TimerBar.offsetWidth - 159;
		var numberOfTimers = 0;

		// Regulates visibility of Golden Cookie timer
		if (Game.shimmerTypes['golden'].spawned == 0 && !Game.Has('Golden switch [off]')) {
			CM.Disp.TimerBars['CMTimerBarGC'].style.display = '';
			l('CMTimerBarGCMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes['golden'].minTime - Game.shimmerTypes['golden'].time) * maxWidth / Game.shimmerTypes['golden'].maxTime) + 'px';
			if (Game.shimmerTypes['golden'].minTime == Game.shimmerTypes['golden'].maxTime) {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '10px';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '10px';
			}
			else {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '';
			}
			l('CMTimerBarGCBar').style.width = Math.round(Math.min(Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].minTime, Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) * maxWidth / Game.shimmerTypes['golden'].maxTime) + 'px';
			l('CMTimerBarGCTime').textContent = Math.ceil((Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) / Game.fps);
			numberOfTimers++;
		}
		else CM.Disp.TimerBars['CMTimerBarGC'].style.display = 'none';

		// Regulates visibility of Reinder timer
		if (Game.season == 'christmas' && Game.shimmerTypes['reindeer'].spawned == 0) {
			CM.Disp.TimerBars['CMTimerBarRen'].style.display = '';
			l('CMTimerBarRenMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes['reindeer'].minTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenBar').style.width = Math.round(Math.min(Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].minTime, Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenTime').textContent = Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps);
			numberOfTimers++;
		}
		else {
			CM.Disp.TimerBars['CMTimerBarRen'].style.display = 'none';
		}

		// On every frame all buff-timers are deleted and re-created
		for (var i in CM.Disp.BuffTimerBars) {
			CM.Disp.BuffTimerBars[i].remove()
		}
		CM.Disp.BuffTimerBars = {}
		for (var i in Game.buffs) {
			if (Game.buffs[i]) {
				timer = CM.Disp.TimerBarCreateBar(Game.buffs[i].name, Game.buffs[i].name, [{id: Game.buffs[i].name + 'Bar'}])
				timer.style.display = '';
				var classColor = '';
				// Gives specific timers specific colors
				if (typeof CM.Disp.buffColors[Game.buffs[i].name] !== 'undefined') {
					classColor = CM.Disp.buffColors[Game.buffs[i].name];
				}
				else classColor = CM.Disp.colorPurple;
				timer.lastChild.children[1].className = CM.Disp.colorBackPre + classColor;
				timer.lastChild.children[1].style.width = Math.round(Game.buffs[i].time * maxWidth / Game.buffs[i].maxTime) + 'px';
				timer.lastChild.children[2].textContent = Math.ceil(Game.buffs[i].time / Game.fps);
				numberOfTimers++;
				CM.Disp.BuffTimerBars[Game.buffs[i].name] = timer
			}
		}
		for (var i in CM.Disp.BuffTimerBars) {
			CM.Disp.TimerBar.appendChild(CM.Disp.BuffTimerBars[i])
		}

		if (numberOfTimers != 0) {
			var height = 48 / numberOfTimers;
			for (var i in CM.Disp.TimerBars) {
				CM.Disp.TimerBars[i].style.height = height + 'px';
			}
			for (var i in CM.Disp.BuffTimerBars) {
				CM.Disp.BuffTimerBars[i].style.height = height + 'px';
			}
		}
	}
}

/**
 * This function changes the visibility of the timer bar
 * It is called by CM.Disp.UpdateAscendState() or a change in CM.Config.TimerBar
 */
CM.Disp.ToggleTimerBar = function() {
	if (CM.Config.TimerBar == 1) CM.Disp.TimerBar.style.display = '';
	else CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.UpdateBotTimerBarPosition();
}

/**
 * This function changes the position of the timer bar
 * It is called by a change in CM.Config.TimerBarPos
 */
CM.Disp.ToggleTimerBarPos = function() {
	if (CM.Config.TimerBarPos == 0) {
		CM.Disp.TimerBar.style.width = '30%';
		CM.Disp.TimerBar.style.bottom = '';
		l('game').insertBefore(CM.Disp.TimerBar, l('sectionLeft'));
	}
	else {
		CM.Disp.TimerBar.style.width = '100%';
		CM.Disp.TimerBar.style.bottom = '0px';
		l('wrapper').appendChild(CM.Disp.TimerBar);
	}
	CM.Disp.UpdateBotTimerBarPosition();
}

/********
 * Section: Functions related to the both the bottom and timer bar

/**
 * This function changes the position of both the bottom and timer bar
 * It is called by CM.Disp.ToggleTimerBar(), CM.Disp.ToggleTimerBarPos() and CM.Disp.ToggleBotBar()
 */
CM.Disp.UpdateBotTimerBarPosition = function() {
	if (CM.Config.BotBar == 1 && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 1) {
		CM.Disp.BotBar.style.bottom = '48px';
		l('game').style.bottom = '118px';
	}
	else if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '70px';
	}
	else if (CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 1) {
		l('game').style.bottom = '48px';
	}
	else { // No bars
		l('game').style.bottom = '0px';
	}

	if (CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
		l('sectionLeft').style.top = '48px';
	}
	else {
		l('sectionLeft').style.top = '';
	}

	CM.Disp.UpdateBackground();
}

/********
 * Section: Functions related to right column of the screen (buildings/upgrades)

/**
 * This function adjusts some things in the column of buildings.
 * It colours them, helps display the correct sell-price and shuffles the order when CM.Config.SortBuildings is set
 * The function is called by CM.Loop(), CM.Disp.UpdateColors() & CM.Disp.RefreshScale()
 * And by changes in CM.Config.BuildColor, CM.Config.SortBuild & CM.ConfigData.BulkBuildColor
 */
CM.Disp.UpdateBuildings = function() {
	if (CM.Config.BuildColor == 1 && Game.buyMode == 1) {
		var target = '';
		if (Game.buyBulk == 10 && CM.Config.BulkBuildColor == 1) target = 'Objects10';
		else if (Game.buyBulk == 100 && CM.Config.BulkBuildColor == 1) target = 'Objects100';
		else target = 'Objects';
		for (var i in CM.Cache[target]) {
			l('productPrice' + Game.Objects[i].id).style.color = CM.Config.Colors[CM.Cache[target][i].color];
		}
	}
	else if (Game.buyMode == -1) {
		for (var i in CM.Cache.Objects) {
			var o = Game.Objects[i];
			l('productPrice' + o.id).style.color = '';
			/*
			 * Fix sell price displayed in the object in the store.
			 *
			 * The buildings sell price displayed by the game itself (without any mod) is incorrect.
			 * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
			 * 
			 * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
			 */
			l('productPrice' + o.id).innerHTML = Beautify(CM.Sim.BuildingSell(o, o.basePrice, o.amount, o.free, Game.buyBulk, 1));
		}
	}
	
	// Build array of pointers, sort by pp, use array index (+2) as the grid row number
	// (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
	// This regulates sorting of buildings
	if (Game.buyMode == 1 && CM.Config.SortBuildings) {
		var arr = Object.keys(CM.Cache[target]).map(k =>
		{
			var o = CM.Cache[target][k];
			o.name = k;
			o.id = Game.Objects[k].id;
			return o;
		});

		arr.sort(function(a, b){ return (a.pp > b.pp ? 1 : (a.pp < b.pp ? -1 : 0)) });

		for (var x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = (x + 2) + "/" + (x + 2);
		}
	} else {
		var arr = Object.keys(CM.Cache.Objects).map(k =>
			{
				var o = CM.Cache.Objects[k];
				o.name = k;
				o.id = Game.Objects[k].id;
				return o;
			});
		arr.sort((a, b) => a.id - b.id);
		for (var x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = (x + 2) + "/" + (x + 2);
		}
	}
}

/**
 * This function adjusts some things in the upgrades section
 * It colours them and shuffles the order when CM.Config.SortBuildings is set
 * The function is called by CM.Loop(), CM.Disp.ToggleUpgradeBarAndColor & CM.Disp.RefreshScale()
 * And by changes in CM.Config.SortUpgrades
 */
CM.Disp.UpdateUpgrades = function() {
	// This counts the amount of upgrades for each pp group and updates the Upgrade Bar
	if (CM.Config.UpBarColor > 0) {
		var blue = 0;
		var green = 0;
		var yellow = 0;
		var orange = 0;
		var red = 0;
		var purple = 0;
		var gray = 0;

		for (var i in Game.UpgradesInStore) {
			var me = Game.UpgradesInStore[i];
			var addedColor = false;
			for (var j = 0; j < l('upgrade' + i).childNodes.length; j++) {
				if (l('upgrade' + i).childNodes[j].className.indexOf(CM.Disp.colorBackPre) != -1) {
					l('upgrade' + i).childNodes[j].className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
					addedColor = true;
					break;
				}
			}
			if (!addedColor) {
				var div = document.createElement('div');
				div.style.width = '10px';
				div.style.height = '10px';
				div.className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
				l('upgrade' + i).appendChild(div);
			}
			if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorBlue) blue++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorGreen) green++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorYellow) yellow++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorOrange) orange++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorRed) red++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorPurple) purple++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorGray) gray++;
		}

		l('CMUpgradeBarBlue').textContent = blue;
		l('CMUpgradeBarGreen').textContent = green;
		l('CMUpgradeBarYellow').textContent = yellow;
		l('CMUpgradeBarOrange').textContent = orange;
		l('CMUpgradeBarRed').textContent = red;
		l('CMUpgradeBarPurple').textContent = purple;
		l('CMUpgradeBarGray').textContent = gray;
	}
	
	// Build array of pointers, sort by pp, set flex positions
	// This regulates sorting of upgrades
	var arr = [];
	for (var x = 0; x < Game.UpgradesInStore.length; x++){
		var o = {};
		o.name = Game.UpgradesInStore[x].name;
		o.price = Game.UpgradesInStore[x].basePrice;
		o.pp = CM.Cache.Upgrades[o.name].pp;
		arr.push(o);
	}

	if (CM.Config.SortUpgrades)
		arr.sort((a, b) => a.pp - b.pp);
	else
		arr.sort((a, b) => a.price - b.price);

	for (var x = 0; x < Game.UpgradesInStore.length; x++){
		l("upgrade" + x).style.order = arr.findIndex(e => e.name === Game.UpgradesInStore[x].name) + 1
	}
}

/********
 * Section: Functions related to the Upgrade Bar

/**
 * This function toggles the upgrade bar and the colours of upgrades
 * It is called by a change in CM.Config.UpBarColor
 */
CM.Disp.ToggleUpgradeBarAndColor = function() {
	if (CM.Config.UpBarColor == 1) { // Colours and bar on
		CM.Disp.UpgradeBar.style.display = '';
		CM.Disp.UpdateUpgrades();
	}
	else if (CM.Config.UpBarColor == 2) {// Colours on and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		CM.Disp.UpdateUpgrades();
	}
	else { // Colours and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
}

/**
 * This function toggles the position of the upgrade bar from fixed or non-fixed mode
 * It is called by a change in CM.Config.UpgradeBarFixedPos
 */
CM.Disp.ToggleUpgradeBarFixedPos = function() {
	if (CM.Config.UpgradeBarFixedPos == 1) { // Fix to top of screen when scrolling
		CM.Disp.UpgradeBar.style.position = 'sticky';
		CM.Disp.UpgradeBar.style.top = '0px';
	}
	else {
		CM.Disp.UpgradeBar.style.position = ''; // Possible to scroll offscreen
	}
}

/**
 * This function creates the upgrade bar above the upgrade-section in the right section of the screen
 * The number (.textContent) of upgrades gets updated by CM.Disp.UpdateUpgrades()
 */
CM.Disp.CreateUpgradeBar = function() {
	CM.Disp.UpgradeBar = document.createElement('div');
	CM.Disp.UpgradeBar.id = 'CMUpgradeBar';
	CM.Disp.UpgradeBar.style.width = '100%';
	CM.Disp.UpgradeBar.style.backgroundColor = 'black';
	CM.Disp.UpgradeBar.style.textAlign = 'center';
	CM.Disp.UpgradeBar.style.fontWeight = 'bold';
	CM.Disp.UpgradeBar.style.display = 'none';
 	CM.Disp.UpgradeBar.style.zIndex = '21';
	CM.Disp.UpgradeBar.onmouseout = function() { Game.tooltip.hide(); };

	var placeholder = document.createElement('div');
	placeholder.appendChild(CM.Disp.CreateUpgradeBarLegend());
	CM.Disp.UpgradeBar.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML), 'store');};

	var upgradeNumber = function(id, color) {
		var span = document.createElement('span');
		span.id = id;
		span.className = CM.Disp.colorTextPre + color;
		span.style.width = '14.28571428571429%';
		span.style.display = 'inline-block';
		span.textContent = '0';
		return span;
	}
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarBlue', CM.Disp.colorBlue));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGreen', CM.Disp.colorGreen));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarYellow', CM.Disp.colorYellow));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarOrange', CM.Disp.colorOrange));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarRed', CM.Disp.colorRed));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarPurple', CM.Disp.colorPurple));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGray', CM.Disp.colorGray));

	l('upgrades').parentNode.insertBefore(CM.Disp.UpgradeBar, l('upgrades').parentNode.childNodes[3]);
}

/**
 * This function creates the legend for the upgrade bar, it is called by CM.Disp.CreateUpgradeBar
 * @returns	{object}	legend	The legend-object to be added
 */
CM.Disp.CreateUpgradeBarLegend = function() {
	var legend = document.createElement('div');
	legend.style.minWidth = '330px';
	legend.style.marginBottom = '4px';
	var title = document.createElement('div');
	title.className = 'name';
	title.style.marginBottom = '4px';
	title.textContent = 'Legend';
	legend.appendChild(title);

	var legendLine = function(color, text) {
		var div = document.createElement('div');
		div.style.verticalAlign = 'middle';
		var span = document.createElement('span');
		span.className = CM.Disp.colorBackPre + color;
		span.style.display = 'inline-block';
		span.style.height = '10px';
		span.style.width = '10px';
		span.style.marginRight = '4px';
		div.appendChild(span);
		div.appendChild(document.createTextNode(text));
		return div;
	}

	legend.appendChild(legendLine(CM.Disp.colorBlue, 'Better than best PP building'));
	legend.appendChild(legendLine(CM.Disp.colorGreen, 'Same as best PP building'));
	legend.appendChild(legendLine(CM.Disp.colorYellow, 'Between best and worst PP buildings closer to best'));
	legend.appendChild(legendLine(CM.Disp.colorOrange, 'Between best and worst PP buildings closer to worst'));
	legend.appendChild(legendLine(CM.Disp.colorRed, 'Same as worst PP building'));
	legend.appendChild(legendLine(CM.Disp.colorPurple, 'Worse than worst PP building'));
	legend.appendChild(legendLine(CM.Disp.colorGray, 'Negative or infinity PP'));
	return legend;
}

/********
 * Section: Functions related to the flashes/sound/notifications

/**
 * This function creates a white square over the full screen and appends it to l('wrapper')
 * It is used by CM.Disp.Flash() to create the effect of a flash and called by CM.DelayInit()
 */
CM.Disp.CreateWhiteScreen = function() {
	CM.Disp.WhiteScreen = document.createElement('div');
	CM.Disp.WhiteScreen.id = 'CMWhiteScreen';
	CM.Disp.WhiteScreen.style.width = '100%';
	CM.Disp.WhiteScreen.style.height = '100%';
	CM.Disp.WhiteScreen.style.backgroundColor = 'white';
	CM.Disp.WhiteScreen.style.display = 'none';
	CM.Disp.WhiteScreen.style.zIndex = '9999999999';
	CM.Disp.WhiteScreen.style.position = 'absolute';
	l('wrapper').appendChild(CM.Disp.WhiteScreen);
}

/**
 * This function creates a flash depending on configs. It is called by all functions 
 * that check game-events and which have settings for Flashes (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{number}	mode	Sets the intensity of the flash, used to recursively dim flash
 * 								All calls of function have use mode == 3
 * @param	{string}	config	The setting in CM.Config that is checked before creating the flash
 */
CM.Disp.Flash = function(mode, config) {
	if ((CM.Config[config] == 1 && mode == 3) || mode == 1) {
		CM.Disp.WhiteScreen.style.opacity = '0.5';
		if (mode == 3) {
			CM.Disp.WhiteScreen.style.display = 'inline';
			setTimeout(function() {CM.Disp.Flash(2, config);}, 1000/Game.fps);
		}
		else {
			setTimeout(function() {CM.Disp.Flash(0, config);}, 1000/Game.fps);
		}
	}
	else if (mode == 2) {
		CM.Disp.WhiteScreen.style.opacity = '1';
		setTimeout(function() {CM.Disp.Flash(1, config);}, 1000/Game.fps);
	}
	else if (mode == 0) CM.Disp.WhiteScreen.style.display = 'none';
}

/**
 * This function plays a sound depending on configs. It is called by all functions 
 * that check game-events and which have settings for sound (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{variable}	url			A variable that gives the url for the sound (e.g., CM.Config.GCSoundURL)
 * @param	{string}	sndConfig	The setting in CM.Config that is checked before creating the sound
 * @param	{string}	volConfig	The setting in CM.Config that is checked to determine volume
 */
CM.Disp.PlaySound = function(url, sndConfig, volConfig) {
	if (CM.Config[sndConfig] == 1) {
		var sound = new realAudio(url);
		sound.volume = (CM.Config[volConfig] / 100) * (Game.volume / 100); 
		sound.play();
	}
}

/**
 * This function creates a notifcation depending on configs. It is called by all functions 
 * that check game-events and which have settings for notifications (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{string}	notifyConfig	The setting in CM.Config that is checked before creating the notification
 * @param	{string}	title			The title of the to-be created notifications
 * @param	{string}	message			The text of the to-be created notifications
 */
CM.Disp.Notification = function(notifyConfig, title, message) {
	if (CM.Config[notifyConfig] == 1 && document.visibilityState == 'hidden') {
		var CookieIcon = 'https://orteil.dashnet.org/cookieclicker/favicon.ico'
		notification = new Notification(title, {body: message, badge: CookieIcon});
	}
}

/********
 * Section: Functions related to updating the tab in the browser's tab-bar

/**
 * This function creates the Favicon, it is called by CM.DelayInit()
 */
CM.Disp.CreateFavicon = function() {
	CM.Disp.Favicon = document.createElement('link');
	CM.Disp.Favicon.id = 'CMFavicon';
	CM.Disp.Favicon.rel = 'shortcut icon';
	CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(CM.Disp.Favicon);
}

/**
 * This function updates the Favicon depending on whether a Golden Cookie has spawned
 * It is called on every loop by CM.Main.CheckGoldenCookie() or by a change in CM.Config.Favicon 
 * By relying on CM.Cache.spawnedGoldenShimmer it only changes for non-user spawned cookie
 */
CM.Disp.UpdateFavicon = function() {
	if (CM.Config.Favicon == 1 && CM.Main.lastGoldenCookieState > 0) {
		if (CM.Cache.spawnedGoldenShimmer.wrath) CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/wrathCookie.ico';
		else CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/goldenCookie.ico';
	}
	else CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
}

/**
 * This function updates the tab title
 * It is called on every loop by Game.Logic() which also sets CM.Cache.Title to Game.cookies
 */
CM.Disp.UpdateTitle = function() {
	if (Game.OnAscend || CM.Config.Title == 0) {
		document.title = CM.Cache.Title;
	}
	else if (CM.Config.Title == 1) {
		var addFC = false;
		var addSP = false;
		var titleGC;
		var titleFC;
		var titleSP;
		
		if (CM.Cache.spawnedGoldenShimmer) {
			if (CM.Cache.spawnedGoldenShimmer.wrath) titleGC = '[W ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
			else titleGC = '[G ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
		}
		else if (!Game.Has('Golden switch [off]')) {
			titleGC = '[' +  Math.ceil((Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) / Game.fps) + ']';
		}
		else titleGC = '[GS]'

		if (CM.Main.lastTickerFortuneState) {
			addFC = true;
			titleFC = '[F]';
		}

		if (Game.season == 'christmas') {
			addSP = true;
			if (CM.Main.lastSeasonPopupState) titleSP = '[R ' +  Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps) + ']';
			else {
				titleSP = '[' +  Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps) + ']';
			}
		}

		// Remove previous timers and add current cookies
		var str = CM.Cache.Title;
		if (str.charAt(0) == '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}
		document.title = titleGC + (addFC ? titleFC : '') + (addSP ? titleSP : '') + ' ' + str;
	}
	else if (CM.Config.Title == 2) {
		var str = '';
		var spawn = false;
		if (CM.Cache.spawnedGoldenShimmer) {
			spawn = true;
			if (CM.Cache.spawnedGoldenShimmer.wrath) str += '[W ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
			else str += '[G ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
		}
		if (CM.Main.lastTickerFortuneState) {
			spawn = true;
			str += '[F]';
		}
		if (Game.season == 'christmas' && CM.Main.lastSeasonPopupState) {
			str += '[R ' +  Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps) + ']';
			spawn = true;
		}
		if (spawn) str += ' - ';
		var title = 'Cookie Clicker';
		if (Game.season == 'fools') title = 'Cookie Baker';
		str += title;
		document.title = str;
	}
}

/********
 * Section: Functions related to the Golden Cookie Timers

/**
 * This function creates a new Golden Cookie Timer and appends it CM.Disp.GCTimers based on the id of the cookie
 * It is called by CM.Main.CheckGoldenCookie()
 * @param	{object}	cookie	A Golden Cookie object
 */
CM.Disp.CreateGCTimer = function(cookie) {
	GCTimer = document.createElement('div');
	GCTimer.id = 'GCTimer' + cookie.id
	GCTimer.style.width = '96px';
	GCTimer.style.height = '96px';
	GCTimer.style.position = 'absolute';
	GCTimer.style.zIndex = '10000000001';
	GCTimer.style.textAlign = 'center';
	GCTimer.style.lineHeight = '96px';
	GCTimer.style.fontFamily = '\"Kavoon\", Georgia, serif';
	GCTimer.style.fontSize = '35px';
	GCTimer.style.cursor = 'pointer';
	GCTimer.style.display = 'block';
	if (CM.Config.GCTimer == 0) GCTimer.style.display = 'none';
	GCTimer.style.left = cookie.l.style.left;
	GCTimer.style.top = cookie.l.style.top;
	GCTimer.onclick = function () {cookie.pop();};
	GCTimer.onmouseover = function() {cookie.l.style.filter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; cookie.l.style.webkitFilter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))';};
	GCTimer.onmouseout = function() {cookie.l.style.filter = ''; cookie.l.style.webkitFilter = '';};

	CM.Disp.GCTimers[cookie.id] = GCTimer;
	l('shimmers').appendChild(GCTimer);
}

/**
 * This function toggles GC Timers are visible 
 * It is called by a change in CM.Config.GCTimer
 */
CM.Disp.ToggleGCTimer = function() {
	if (CM.Config.GCTimer == 1) {
		for (var i in CM.Disp.GCTimers) {
			CM.Disp.GCTimers[i].style.display = 'block';
			CM.Disp.GCTimers[i].style.left = CM.Cache.goldenShimmersByID[i].l.style.left;
			CM.Disp.GCTimers[i].style.top = CM.Cache.goldenShimmersByID[i].l.style.top;
		}
	}
	else {
		for (var i in CM.Disp.GCTimers) CM.Disp.GCTimers[i].style.display = 'none';
	}
}

/********
 * Section: Functions related to Tooltips

/**
 * This function creates some very basic tooltips, (e.g., the tooltips in the stats page)
 * The tooltips are created with CM.Disp[placeholder].appendChild(desc)
 * It is called by CM.DelayInit()
 * @param	{string}	placeholder	The name used to later refer and spawn the tooltip
 * @param	{string}	text		The text of the tooltip
 * @param	{string}	minWidth	The minimum width of the tooltip
 */
CM.Disp.CreateSimpleTooltip = function(placeholder, text, minWidth) {
	CM.Disp[placeholder] = document.createElement('div');
	var desc = document.createElement('div');
	desc.style.minWidth = minWidth;
	desc.style.marginBottom = '4px';
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = text;
	desc.appendChild(div);
	CM.Disp[placeholder].appendChild(desc);
}

/**
 * This function replaces the original .onmouseover functions of buildings so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'b'
 * It is called by CM.DelayInit()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 */
CM.Disp.ReplaceTooltipBuild = function() {
	CM.Disp.TooltipBuildBackup = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			CM.Disp.TooltipBuildBackup[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'b\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}');
		}
	}
}

/**
 * This function replaces the original .onmouseover functions of upgrades so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'u'
 * It is called by CM.ReplaceNative()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 * 
 */
CM.Disp.ReplaceTooltipUpgrade = function() {
	CM.Disp.TooltipUpgradeBackup = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			CM.Disp.TooltipUpgradeBackup[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() {if (!Game.mouseDown) {Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'u\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}}');
		}
	}
}

/**
 * This function replaces the original .onmouseover functions of the Grimoire minigame so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'g'
 * The function is called by CM.DelayInit()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 */
CM.Disp.ReplaceTooltipGrimoire = function() {
	if (Game.Objects['Wizard tower'].minigameLoaded) {
		CM.Disp.TooltipGrimoireBackup = [];
		for (var i in Game.Objects['Wizard tower'].minigame.spellsById) {
			if (l('grimoireSpell' + i).onmouseover != null) {
				CM.Disp.TooltipGrimoireBackup[i] = l('grimoireSpell' + i).onmouseover;
				eval('l(\'grimoireSpell\' + i).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'g\', \'' + i + '\');}, \'this\'); Game.tooltip.wobble();}');
			}
		}
	}
}

/**
 * This function replaces the original .onmouseover functions of sugar lumps so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 's'
 * The function is called by CM.DelayInit()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 */
CM.Disp.ReplaceTooltipLump = function() {
	if (Game.canLumps()) {
		CM.Disp.TooltipLumpBackup = l('lumps').onmouseover;
        eval('l(\'lumps\').onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'s\', \'Lump\');}, \'this\'); Game.tooltip.wobble();}');
	}
};

/**
 * This function enhance the standard tooltips by creating and changing l('tooltip')
 * The function is called by .onmouseover events that have replaced original code to use CM.Disp.Tooltip()
 * @param	{string}	type					Type of tooltip (b, u, s or g)
 * @param	{string}	name					Name of the object/item the tooltip relates to
 * @returns {string}	l('tooltip').innerHTML	The HTML of the l('tooltip')-object
 */
CM.Disp.Tooltip = function(type, name) {
	if (type == 'b') { // Buildings
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		// Adds amortization info to the list of info per building
		if (CM.Config.TooltipAmor == 1) {
			var buildPrice = CM.Sim.BuildingGetPrice(Game.Objects[name], Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			var amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML
					.split('so far</div>')
					.join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) == 1 ? 'cookie' : 'cookies') + ' left to amortize (' + CM.Disp.GetTimeColor((buildPrice - Game.Objects[name].totalCookies) / (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');
			}
		}
		if (Game.buyMode == -1) {
			/*
			 * Fix sell price displayed in the object tooltip.
			 *
			 * The buildings sell price displayed by the game itself (without any mod) is incorrect.
			 * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
			 * 
			 * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
			 */
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].bulkPrice)).join(Beautify(CM.Sim.BuildingSell(Game.Objects[name], Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 1)));
		}
	}
	else if (type == 'u') { // Upgrades
		if (!Game.UpgradesInStore[name]) return '';
		l('tooltip').innerHTML = Game.crateTooltip(Game.UpgradesInStore[name], 'store');
	}
	else if (type === 's') l('tooltip').innerHTML = Game.lumpTooltip(); // Sugar Lumps
	else if (type === 'g') l('tooltip').innerHTML = Game.Objects['Wizard tower'].minigame.spellTooltip(name)(); // Grimoire

	// Adds area for extra tooltip-sections
	var area = document.createElement('div');
	area.id = 'CMTooltipArea';
	l('tooltip').appendChild(area);
	
	// Sets global variables used by CM.Disp.UpdateTooltip()
	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	CM.Disp.UpdateTooltip();

	return l('tooltip').innerHTML;
}

/**
 * This function creates a tooltipBox object which contains all CookieMonster added tooltip information.
 * It is called by all CM.Disp.UpdateTooltip functions.
 * @returns {object}	div		An object containing the stylized box
 */
CM.Disp.TooltipCreateTooltipBox = function() {
	l('tooltip').firstChild.style.paddingBottom = '4px'; // Sets padding on base-tooltip
	var tooltipBox = document.createElement('div');
	tooltipBox.style.border = '1px solid';
	tooltipBox.style.padding = '4px';
	tooltipBox.style.margin = '0px -4px';
	tooltipBox.id = 'CMTooltipBorder';
	tooltipBox.className = CM.Disp.colorTextPre + CM.Disp.colorGray;
	return tooltipBox
}

/**
 * This function creates a header object for tooltips. 
 * It is called by all CM.Disp.UpdateTooltip functions.
 * @param	{string}	text	Title of header
 * @returns {object}	div		An object containing the stylized header
 */
CM.Disp.TooltipCreateHeader = function(text) {
	var div = document.createElement('div');
	div.style.fontWeight = 'bold';
	div.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
	div.textContent = text;
	return div;
}

/**
 * This function appends the sections for Bonus Income, PP and Time left (to achiev) to the tooltip-object
 * It is called by CM.Disp.UpdateTooltipBuilding() and CM.Disp.UpdateTooltipUpgrade()
 * The actual data is added by the Update-functions themselves
 * @param	{object}	tooltip		Object of a TooltipBox, normally created by a call to CM.Disp.TooltipCreateTooltipBox()
 */
CM.Disp.TooltipCreateCalculationSection = function(tooltip) {
	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Bonus Income'));
	var income = document.createElement('div');
	income.style.marginBottom = '4px';
	income.style.color = 'white';
	income.id = 'CMTooltipIncome';
	tooltip.appendChild(income);

	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Payback Period'));
	var pp = document.createElement('div');
	pp.style.marginBottom = '4px';
	pp.id = 'CMTooltipPP';
	tooltip.appendChild(pp);

	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Time Left'));
	var time = document.createElement('div');
	time.id = 'CMTooltipTime';
	tooltip.appendChild(time);

	if (CM.Disp.tooltipType == 'b') {
		tooltip.appendChild(CM.Disp.TooltipCreateHeader('Production left till next achievement'));
		tooltip.lastChild.id = 'CMTooltipProductionHeader'; // Assign a id in order to hid when no achiev's are left
		var production = document.createElement('div');
		production.id = 'CMTooltipProduction';
		tooltip.appendChild(production);
	}
}

/**
 * This function creates the tooltip objectm for warnings
 * It is called by CM.Disp.UpdateTooltipWarnings() whenever the tooltip type is 'b' or 'u'
 * The object is also removed by CM.Disp.UpdateTooltipWarnings() when type is 's' or 'g'
 * @returns {object}	CM.Disp.TooltipWarn	The Warnings-tooltip object
 */
CM.Disp.TooltipCreateWarningSection = function() {
	CM.Disp.TooltipWarn = document.createElement('div');
	CM.Disp.TooltipWarn.style.position = 'absolute';
	CM.Disp.TooltipWarn.style.display = 'block';
	CM.Disp.TooltipWarn.style.left = 'auto';
	CM.Disp.TooltipWarn.style.bottom = 'auto';
	CM.Disp.TooltipWarn.id = "CMDispTooltipWarningParent";

	var create = function(boxId, color, labelTextFront, labelTextBack, deficitId) {
		var box = document.createElement('div');
		box.id = boxId;
		box.style.display = 'none';
		// TODO: This is very old code and can probably be removed
		//box.style.WebkitTransition = 'opacity 0.1s ease-out';
		//box.style.MozTransition = 'opacity 0.1s ease-out';
		//box.style.MsTransition = 'opacity 0.1s ease-out';
		//box.style.OTransition = 'opacity 0.1s ease-out';
		box.style.transition = 'opacity 0.1s ease-out';
		box.className = CM.Disp.colorBorderPre + color;
		box.style.padding = '2px';
		box.style.background = '#000 url(img/darkNoise.png)';
		var labelDiv = document.createElement('div');
		box.appendChild(labelDiv);
		var labelSpan = document.createElement('span');
		labelSpan.className = CM.Disp.colorTextPre + color;
		labelSpan.style.fontWeight = 'bold';
		labelSpan.textContent = labelTextFront;
		labelDiv.appendChild(labelSpan);
		labelDiv.appendChild(document.createTextNode(labelTextBack));
		var deficitDiv = document.createElement('div');
		box.appendChild(deficitDiv);
		var deficitSpan = document.createElement('span');
		deficitSpan.id = deficitId;
		deficitDiv.appendChild(document.createTextNode('Deficit: '));
		deficitDiv.appendChild(deficitSpan);
		return box;
	}
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnLucky', CM.Disp.colorRed, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!"', 'CMDispTooltipWarnLuckyText'));
	CM.Disp.TooltipWarn.firstChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnLuckyFrenzy', CM.Disp.colorYellow, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)', 'CMDispTooltipWarnLuckyFrenzyText'));
	CM.Disp.TooltipWarn.lastChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnConjure', CM.Disp.colorPurple, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods"', 'CMDispTooltipWarnConjureText'));
	 
	return CM.Disp.TooltipWarn;
}

/**
 * This function updates the sections of the tooltips created by CookieMonster
 * It is called when tooltips are created by and CM.Disp.Tooltip() on every loop by CM.Loop()
 */
CM.Disp.UpdateTooltip = function() {
	CM.Sim.CopyData();
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea')) {
		l('CMTooltipArea').innerHTML = '';
		tooltipBox = CM.Disp.TooltipCreateTooltipBox();
		l('CMTooltipArea').appendChild(tooltipBox);
		
		if (CM.Disp.tooltipType == 'b') {
			CM.Disp.UpdateTooltipBuilding();
		}
		else if (CM.Disp.tooltipType == 'u') { 
			CM.Disp.UpdateTooltipUpgrade();
		}
		else if (CM.Disp.tooltipType === 's') {
			CM.Disp.UpdateTooltipSugarLump();
		}
		else if (CM.Disp.tooltipType === 'g') {
			CM.Disp.UpdateTooltipGrimoire();
		}
		CM.Disp.UpdateTooltipWarnings();
	}
	else if (l('CMTooltipArea') == null) { // Remove warnings if its a basic tooltip
		if (l('CMDispTooltipWarningParent') != null) {
			l('CMDispTooltipWarningParent').remove();
		}
	}
}

/**
 * This function adds extra info to the Building tooltips
 * It is called when Building tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipBuilding = function() {
	if (CM.Config.TooltipBuildUp == 1 && Game.buyMode == 1) {
		tooltipBox = l('CMTooltipBorder');
		CM.Disp.TooltipCreateCalculationSection(tooltipBox);

		var target = '';
		// TODO: Change the Cache code and variables to use Objects1, Objectes10, Objects100
		// That would depreciate this target setting code
		if (Game.buyMode == 1 && Game.buyBulk == 10) target = 'Objects10'
		else if (Game.buyMode == 1 && Game.buyBulk == 100) target = 'Objects100';
		else target = 'Objects';

		CM.Disp.TooltipPrice = Game.Objects[CM.Disp.tooltipName].bulkPrice
		CM.Disp.TooltipBonusIncome = CM.Cache[target][CM.Disp.tooltipName].bonus;
		

		if (CM.Config.TooltipBuildUp == 1 && Game.buyMode == 1) {
			l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
			var increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
			}
			l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			l('CMTooltipPP').textContent = Beautify(CM.Cache[target][CM.Disp.tooltipName].pp, 2);
			l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			var timeColor = CM.Disp.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
		}

		// Add "production left till next achievement"-bar
		for (var i in Game.Objects[CM.Disp.tooltipName].productionAchievs) {
			if (!CM.Sim.HasAchiev(Game.Objects[CM.Disp.tooltipName].productionAchievs[i].achiev.name)) {
				var nextProductionAchiev = Game.Objects[CM.Disp.tooltipName].productionAchievs[i]
				break
			}
		}
		if (typeof nextProductionAchiev != "undefined") {
			l('CMTooltipTime').style.marginBottom = '4px';
			l('CMTooltipProductionHeader').style.display = "";
			l('CMTooltipProduction').className = "ProdAchievement" + CM.Disp.tooltipName;
			l('CMTooltipProduction').textContent = Beautify(nextProductionAchiev.pow - CM.Sim.Objects[CM.Disp.tooltipName].totalCookies, 15);
			l('CMTooltipProduction').style.color = "white";
		} else {
			l('CMTooltipProductionHeader').style.display = "none";
			l('CMTooltipTime').style.marginBottom = '0px';
		}
	}
}

/**
 * This function adds extra info to the Upgrade tooltips
 * It is called when Upgrade tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipUpgrade = function() {
	tooltipBox = l('CMTooltipBorder');
	CM.Disp.TooltipCreateCalculationSection(tooltipBox);

	CM.Disp.TooltipBonusIncome = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
	CM.Disp.TooltipPrice = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();

	if (CM.Config.TooltipBuildUp == 1) {
		l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
		var increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
		if (isFinite(increase) && increase != 0) {
			l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
		}
		l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
		l('CMTooltipPP').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].pp, 2);
		l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
		var timeColor = CM.Disp.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
		l('CMTooltipTime').textContent = timeColor.text;
		l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
	}
}

/**
 * This function adds extra info to the Sugar Lump tooltip
 * It is called when the Sugar Lump tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipSugarLump = function() {
	if (CM.Config.TooltipLump === 1) {
		tooltipBox = l('CMTooltipBorder');

		tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Current Sugar Lump'));

		var lumpType = document.createElement('div');
		lumpType.id = 'CMTooltipTime';
		tooltipBox.appendChild(lumpType);
		var lumpColor = CM.Disp.GetLumpColor(Game.lumpCurrentType);
		lumpType.textContent = lumpColor.text;
		lumpType.className = CM.Disp.colorTextPre + lumpColor.color;
	}
}

/**
 * This function adds extra info to the Grimoire tooltips
 * It is called when Grimoire tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipGrimoire = function() {
	var minigame = Game.Objects['Wizard tower'].minigame;
	var spellCost = minigame.getSpellCost(minigame.spellsById[CM.Disp.tooltipName]);

	if (CM.Config.TooltipGrim == 1 && spellCost <= minigame.magicM) {
		tooltipBox = l('CMTooltipBorder');

		// Time left till enough magic for spell
		tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Time Left'));
		var time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltipBox.appendChild(time);
		var timeColor = CM.Disp.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost));
		time.textContent = timeColor.text;
		time.className = CM.Disp.colorTextPre + timeColor.color;

		// Time left untill magic spent is recovered
		if (spellCost <= minigame.magic) {
			tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Recover Time'));
			var recover = document.createElement('div');
			recover.id = 'CMTooltipRecover';
			tooltipBox.appendChild(recover);
			var recoverColor = CM.Disp.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(Math.max(0, minigame.magic - spellCost), minigame.magicM, minigame.magic));
			recover.textContent = recoverColor.text;
			recover.className = CM.Disp.colorTextPre + recoverColor.color;
		}

		// Extra information on cookies gained when spell is Conjure Baked Goods (Name == 0)
		if (CM.Disp.tooltipName == 0) {
			tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Cookies to be gained/lost'));
			var conjure = document.createElement('div');
			conjure.id = 'CMTooltipConjure';
			tooltipBox.appendChild(conjure);
			var reward = document.createElement('span');
			reward.style.color = "#33FF00"
			reward.textContent = Beautify(Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30), 2)
			conjure.appendChild(reward)
			var seperator = document.createElement('span');
			seperator.textContent = ' / '
			conjure.appendChild(seperator)
			var loss = document.createElement('span');
			loss.style.color = "red"
			loss.textContent = Beautify((CM.Cache.NoGoldSwitchCookiesPS * 60 * 15), 2);
			conjure.appendChild(loss)
		}

		l('CMTooltipArea').appendChild(tooltipBox);
	}
}

/**
 * This function updates the warnings section of the building and upgrade tooltips
 * It is called by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipWarnings = function() {
	if (CM.Disp.tooltipType == "b" || CM.Disp.tooltipType == "u") {
		if (document.getElementById("CMDispTooltipWarningParent") == null) {
			warningTooltip = CM.Disp.TooltipCreateWarningSection();
			l('tooltipAnchor').appendChild(warningTooltip);
			CM.Disp.ToggleToolWarnPos();
		}

		if (CM.Config.ToolWarnPos == 0) CM.Disp.TooltipWarn.style.right = '0px';
		else CM.Disp.TooltipWarn.style.top = (l('tooltip').offsetHeight) + 'px';

		CM.Disp.TooltipWarn.style.width = (l('tooltip').offsetWidth - 6) + 'px';
		
		if (CM.Config.ToolWarnLucky == 1) {
			var limitLucky = CM.Cache.Lucky;
			if (CM.Config.ToolWarnBon == 1) {
				var bonusNoFren = CM.Disp.TooltipBonusIncome;
				bonusNoFren /= CM.Sim.getCPSBuffMult();
				limitLucky += ((bonusNoFren * 60 * 15) / 0.15);
			}
			var limitLuckyFrenzy = limitLucky * 7;
			var amount = (Game.cookies + CM.Disp.GetWrinkConfigBank()) - CM.Disp.TooltipPrice;
			if ((amount < limitLucky || amount < limitLuckyFrenzy) && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
				if (amount < limitLucky) {
					l('CMDispTooltipWarnLucky').style.display = '';
					l('CMDispTooltipWarnLuckyText').textContent = Beautify(limitLucky - amount) + ' (' + CM.Disp.FormatTime((limitLucky - amount) / CM.Disp.GetCPS()) + ')';
					l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
					l('CMDispTooltipWarnLuckyFrenzyText').textContent = Beautify(limitLuckyFrenzy - amount) + ' (' + CM.Disp.FormatTime((limitLuckyFrenzy - amount) / CM.Disp.GetCPS()) + ')';
				}
				else if (amount < limitLuckyFrenzy) {
					l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
					l('CMDispTooltipWarnLuckyFrenzyText').textContent = Beautify(limitLuckyFrenzy - amount) + ' (' + CM.Disp.FormatTime((limitLuckyFrenzy - amount) / CM.Disp.GetCPS()) + ')';
					l('CMDispTooltipWarnLucky').style.display = 'none';
				}
			} else {
				l('CMDispTooltipWarnLucky').style.display = 'none';
				l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
			}
		}
		else {
			l('CMDispTooltipWarnLucky').style.display = 'none';
			l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
		}
		
		if (CM.Config.ToolWarnConjure == 1) {
			var limitLucky = CM.Cache.Lucky;
			if (CM.Config.ToolWarnBon == 1) {
				var bonusNoFren = CM.Disp.TooltipBonusIncome;
				bonusNoFren /= CM.Sim.getCPSBuffMult();
				limitLucky += ((bonusNoFren * 60 * 15) / 0.15);
			}
			var limitConjure = limitLucky * 2;
			var amount = (Game.cookies + CM.Disp.GetWrinkConfigBank()) - CM.Disp.TooltipPrice;
			if ((amount < limitConjure) && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
				l('CMDispTooltipWarnConjure').style.display = '';
				l('CMDispTooltipWarnConjureText').textContent = Beautify(limitConjure - amount) + ' (' + CM.Disp.FormatTime((limitConjure - amount) / CM.Disp.GetCPS()) + ')';
			} else {
				l('CMDispTooltipWarnConjure').style.display = 'none';
			}
		}
		else {
			l('CMDispTooltipWarnConjure').style.display = 'none';
		}
	}
	else {
		if (l('CMDispTooltipWarningParent') != null) {
			l('CMDispTooltipWarningParent').remove();
		}
	}
}

/**
 * This function updates the location of the tooltip
 * It is called by Game.tooltip.update() because of CM.ReplaceNative()
 */
CM.Disp.UpdateTooltipLocation = function() {
	if (Game.tooltip.origin == 'store') {
		var warnOffset = 0;
		if (CM.Config.ToolWarnLucky == 1 && CM.Config.ToolWarnPos == 1 && typeof CM.Disp.TooltipWarn != "undefined") {
			warnOffset = CM.Disp.TooltipWarn.clientHeight - 4;
		}
		Game.tooltip.tta.style.top = Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnOffset - 46) + 'px';
	}
	// Kept for future possible use if the code changes again
	/*else if (!Game.onCrate && !Game.OnAscend && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	}*/
}

/**
 * This function toggles the position of the warnings created by CM.Disp.TooltipCreateWarningSection()
 * It is called by a change in CM.Config.ToolWarnPos 
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
CM.Disp.ToggleToolWarnPos = function() {
	if (typeof CM.Disp.TooltipWarn != "undefined") {
		if (CM.Config.ToolWarnPos == 0) {
			CM.Disp.TooltipWarn.style.top = 'auto';
			CM.Disp.TooltipWarn.style.margin = '4px -4px';
			CM.Disp.TooltipWarn.style.padding = '3px 4px';
		}
		else {
			CM.Disp.TooltipWarn.style.right = 'auto';
			CM.Disp.TooltipWarn.style.margin = '4px';
			CM.Disp.TooltipWarn.style.padding = '4px 3px';
		}
	}
}

/**
 * This function checks and create a tooltip for the wrinklers
 * It is called by CM.Loop()
 * TODO: Change this code to be the same as other tooltips. (i.d., create tooltip with type "w")
 */
CM.Disp.CheckWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && CM.Disp.TooltipWrinklerArea == 1) { // Latter is set by CM.Main.AddWrinklerAreaDetect
		var showingTooltip = false;
		for (var i in Game.wrinklers) {
			var me = Game.wrinklers[i];
			if (me.phase > 0 && me.selected) {
				showingTooltip = true;
				if (CM.Disp.TooltipWrinklerBeingShown[i] == 0 || CM.Disp.TooltipWrinklerBeingShown[i] == undefined) {
					var placeholder = document.createElement('div');
					var wrinkler = document.createElement('div');
					wrinkler.style.minWidth = '120px';
					wrinkler.style.marginBottom = '4px';
					var div = document.createElement('div');
					div.style.textAlign = 'center';
					div.id = 'CMTooltipWrinkler';
					wrinkler.appendChild(div);
					placeholder.appendChild(wrinkler);
					Game.tooltip.draw(this, escape(placeholder.innerHTML));
					CM.Disp.TooltipWrinkler = i;
					CM.Disp.TooltipWrinklerBeingShown[i] = 1;
				}
				else break;
			}
			else {
				CM.Disp.TooltipWrinklerBeingShown[i] = 0;
			}
		}
		if (!showingTooltip) {
			Game.tooltip.hide();
		}
	}
}

/**
 * This function updates the amount to be displayed by the wrinkler tooltip created by CM.Disp.CheckWrinklerTooltip()
 * It is called by CM.Loop()
 * TODO: Change this code to be the same as other tooltips. Fit this into CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && l('CMTooltipWrinkler') != null) {
		var sucked = Game.wrinklers[CM.Disp.TooltipWrinkler].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[CM.Disp.TooltipWrinkler].type == 1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		if (CM.Sim.Objects.Temple.minigameLoaded) {
			var godLvl = CM.Sim.hasGod('scorn');
			if (godLvl == 1) sucked *= 1.15;
			else if (godLvl == 2) sucked *= 1.1;
			else if (godLvl == 3) sucked *= 1.05;
		}
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
	}
}

/********
 * Section: Functions related to the dragon aura interface */

/**
 * This functions adds the two extra lines about CPS and time to recover to the aura picker infoscreen
 * It is called by Game.DescribeDragonAura() after CM.ReplaceNative()
 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
 */
CM.Disp.AddAuraInfo = function(aura) {
	if (CM.Config.DragonAuraInfo == 1) {
		var [bonusCPS, priceOfChange] = CM.Sim.CalculateChangeAura(aura);
		var timeToRecover = CM.Disp.FormatTime(priceOfChange / (bonusCPS + Game.cookiesPs));
		var bonusCPSPercentage = CM.Disp.Beautify(bonusCPS / Game.cookiesPs);
		bonusCPS = CM.Disp.Beautify(bonusCPS);

		l('dragonAuraInfo').style.minHeight = "60px"
		l('dragonAuraInfo').style.margin = "8px"
		l('dragonAuraInfo').appendChild(document.createElement("div")).className = "line"
		var div = document.createElement("div");
		div.style.minWidth = "200px";
		div.style.textAlign = "center";
		div.textContent = "Picking this aura will change CPS by " + bonusCPS + " (" + bonusCPSPercentage + "% of current CPS).";
		l('dragonAuraInfo').appendChild(div);
		var div2 = document.createElement("div");
		div2.style.minWidth = "200px";
		div2.style.textAlign = "center";
		div2.textContent = "It will take " + timeToRecover + " to recover the cost.";
		l('dragonAuraInfo').appendChild(div2);
	}
}

/********
 * Section: General functions related to the Options/Stats pages

/**
 * This function adds the calll the functions to add extra info to the stats and options pages
 * It is called by Game.UpdateMenu()
 */
CM.Disp.AddMenu = function() {
	var title = function() {
		var div = document.createElement('div');
		div.className = 'title ' + CM.Disp.colorTextPre + CM.Disp.colorBlue;
		div.textContent = 'Cookie Monster Goodies';
		return div;
	}

	if (Game.onMenu == 'prefs') {
		CM.Disp.AddMenuPref(title);
	}
	else if (Game.onMenu == 'stats') {
		if (CM.Config.Stats) {
			CM.Disp.AddMenuStats(title);
		}
	}
}

/**
 * This function refreshes the stats page, CM.Config.UpStats determines the rate at which that happens
 * It is called by CM.Loop()
 */
CM.Disp.RefreshMenu = function() {
	if (CM.Config.UpStats && Game.onMenu == 'stats' && (Game.drawT - 1) % (Game.fps * 5) != 0 && (Game.drawT - 1) % Game.fps == 0) Game.UpdateMenu();
}

/********
 * Section: Functions related to the Options/Preferences page

/**
 * This function adds the options/settings of CookieMonster to the options page
 * It is called by CM.Disp.AddMenu
 * @param {function} title	A function that returns the title of CookieMonster pre-styled
 */
CM.Disp.AddMenuPref = function(title) {	
	var frag = document.createDocumentFragment();
	frag.appendChild(title());

	for (var group in CM.ConfigGroups) {
		groupObject = CM.Disp.CreatePrefHeader(group, CM.ConfigGroups[group]) // (group, display-name of group)
		frag.appendChild(groupObject)
		if (CM.Config.OptionsPref[group]) { // 0 is show, 1 is collapsed
			for (var option in CM.ConfigData) {
				if (CM.ConfigData[option].group == group) frag.appendChild(CM.Disp.CreatePrefOption(option))
			}
		}
	}
	
	var resDef = document.createElement('div');
	resDef.className = 'listing';
	var resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function() {CM.RestoreDefault();};
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);
	
	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
}

/**
 * This function creates a header-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
CM.Disp.CreatePrefHeader = function(config, text) {
	var div = document.createElement('div');
	div.className = 'listing';
	div.style.padding = '5px 16px';
	div.style.opacity = '0.7';
	div.style.fontSize = '17px';
	div.style.fontFamily = '\"Kavoon\", Georgia, serif';
	div.appendChild(document.createTextNode(text + ' '));
	var span = document.createElement('span'); // Creates the +/- button
	span.style.cursor = 'pointer';
	span.style.display = 'inline-block';
	span.style.height = '14px';
	span.style.width = '14px';
	span.style.borderRadius = '7px';
	span.style.textAlign = 'center';
	span.style.backgroundColor = '#C0C0C0';
	span.style.color = 'black';
	span.style.fontSize = '13px';
	span.style.verticalAlign = 'middle';
	span.textContent = CM.Config.OptionsPref[config] ? '-' : '+';
	span.onclick = function() {CM.ToggleOptionsConfig(config); Game.UpdateMenu();};
	div.appendChild(span);
	return div;
}

/**
 * This function creates an option-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
CM.Disp.CreatePrefOption = function(config) {
	if (CM.ConfigData[config].type == "bool") {
		var div = document.createElement('div');
		div.className = 'listing';
		var a = document.createElement('a');
		if (CM.ConfigData[config].toggle && CM.Config[config] == 0) {
			a.className = 'option off';
		}
		else {
			a.className = 'option';
		}
		a.id = CM.ConfigPrefix + config;
		a.onclick = function() {CM.ToggleConfig(config);};
		a.textContent = CM.ConfigData[config].label[CM.Config[config]];
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	else if (CM.ConfigData[config].type == "vol") {
		var div = document.createElement('div');
		div.className = 'listing';
		var volume = document.createElement('div');
		volume.className = 'sliderBox';
		var title = document.createElement('div');
		title.style.float = "left";
		title.innerHTML = CM.ConfigData[config].desc;
		volume.appendChild(title);
		var percent = title = document.createElement('div');
		percent.id = "slider" + config + "right";
		percent.style.float = "right";
		percent.innerHTML = CM.Config[config] + "%";
		volume.appendChild(percent);
		var slider = document.createElement('input');
		slider.className = "slider";
		slider.id = "slider" + config;
		slider.style.clear = "both";
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.step = "1";
		slider.value = CM.Config[config];
		slider.oninput = function() {CM.ToggleConfigVolume(config)};
		slider.onchange = function() {CM.ToggleConfigVolume(config)};
		volume.appendChild(slider);
		div.appendChild(volume);
		return div;
	}
	else if (CM.ConfigData[config].type == "url") {
		var div = document.createElement('div');
		div.className = 'listing';
		var span = document.createElement('span');
		span.className = 'option';
		span.textContent = CM.ConfigData[config].label + ' ';
		div.appendChild(span);
		var input = document.createElement('input');
		input.id = CM.ConfigPrefix + config;
		input.className = 'option';
		input.type = 'text';
		input.readOnly = true;
		input.setAttribute('value', CM.Config[config]);
		input.style.width = '300px';
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		var inputPrompt = document.createElement('input');
		inputPrompt.id = CM.ConfigPrefix + config + 'Prompt';
		inputPrompt.className = 'option';
		inputPrompt.type = 'text';
		inputPrompt.setAttribute('value', CM.Config[config]);
		var a = document.createElement('a');
		a.className = 'option';
		a.onclick = function() {Game.Prompt(inputPrompt.outerHTML, [['Save', 'CM.Config[\'' + config + '\'] = l(CM.ConfigPrefix + \'' + config + '\' + \'Prompt\').value; CM.SaveConfig(CM.Config); Game.ClosePrompt(); Game.UpdateMenu();'], 'Cancel']);};
		a.textContent = 'Edit';
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	else if (CM.ConfigData[config].type == "color") {
		for (var i = 0; i < CM.Disp.colors.length; i++) {
			var div = document.createElement('div');
			div.className = 'listing';
			var input = document.createElement('input');
			input.id = CM.ConfigPrefix + 'Color' + CM.Disp.colors[i];
			input.className = 'option';
			input.style.width = '65px';
			input.setAttribute('value', CM.Config.Colors[CM.Disp.colors[i]]);
			div.appendChild(input);
			eval('var change = function() {CM.Config.Colors[\'' + CM.Disp.colors[i] + '\'] = l(CM.ConfigPrefix + \'Color\' + \'' + CM.Disp.colors[i] + '\').value; CM.Disp.UpdateColors(); CM.SaveConfig(CM.Config);}');
			var jscolorpicker = new jscolor.color(input, {hash: true, caps: false, pickerZIndex: 1000000, pickerPosition: 'right', onImmediateChange: change});
			var label = document.createElement('label');
			label.textContent = CM.ConfigData.Colors.desc[CM.Disp.colors[i]];
			div.appendChild(label);
			return div;
		}
	}
}

/**
 * This function changes some of the time-displays in the game to be more detailed
 * It is called by a change in CM.Config.DetailedTime
 */
CM.Disp.ToggleDetailedTime = function() {
	if (CM.Config.DetailedTime == 1) Game.sayTime = CM.Disp.sayTime;
	else Game.sayTime = CM.Backup.sayTime;
}

/**
 * This function refreshes all numbers after a change in scale-setting
 * It is therefore called by a change in CM.Config.Scale
 */
CM.Disp.RefreshScale = function() {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	CM.Disp.UpdateBotBar();
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();
}

/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Config.Colors
 */
CM.Disp.UpdateColors = function() {
	var str = '';
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorTextPre + CM.Disp.colors[i] + ' { color: ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBackPre + CM.Disp.colors[i] + ' { background-color: ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBorderPre + CM.Disp.colors[i] + ' { border: 1px solid ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	CM.Disp.Css.textContent = str;
	CM.Disp.UpdateBuildings(); // Class has been already set
}

/********
 * Section: Functions related to the Stats page
 * TODO: Annotate last functions */

/**
 * This function adds stats created by CookieMonster to the stats page
 * It is called by CM.Disp.AddMenu
 * @param {function} title	A function that returns the title of CookieMonster pre-styled
 */
CM.Disp.AddMenuStats = function(title) {
	var stats = document.createElement('div');
	stats.className = 'subsection';
	stats.appendChild(title());

	stats.appendChild(CM.Disp.CreateStatsHeader('Lucky Cookies', 'Lucky'));
	if (CM.Config.StatsPref.Lucky) {
		stats.appendChild(CM.Disp.CreateStatsLuckySection());
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Chain Cookies', 'Chain'));
	if (CM.Config.StatsPref.Chain) {
		stats.appendChild(CM.Disp.CreateStatsChainSection());
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Conjure Baked Goods', 'Conjure'));
	if (CM.Config.StatsPref.Conjure) {
		stats.appendChild(CM.Disp.CreateStatsConjureSection());
 	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Prestige', 'Prestige'));
	if (CM.Config.StatsPref.Prestige) {
		stats.appendChild(CM.Disp.CreateStatsPrestigeSection());
	}

	if (Game.cpsSucked > 0) {
		stats.appendChild(CM.Disp.CreateStatsHeader('Wrinklers', 'Wrink'));
		if (CM.Config.StatsPref.Wrink) {
			var popAllFrag = document.createDocumentFragment();
			popAllFrag.appendChild(document.createTextNode(Beautify(CM.Cache.WrinkBank) + ' '));
			var popAllA = document.createElement('a');
			popAllA.textContent = 'Pop All Normal';
			popAllA.className = 'option';
			popAllA.onclick = function() { CM.Disp.CollectWrinklers(); };
			popAllFrag.appendChild(popAllA);
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rewards of Popping',  popAllFrag));
		}
	}


	var specDisp = false;
	var missingHalloweenCookies = [];
	for (var i in CM.Data.HalloCookies) {
		if (!Game.Has(CM.Data.HalloCookies[i])) {
			missingHalloweenCookies.push(CM.Data.HalloCookies[i]);
			specDisp = true;
		}
	}
	var missingChristmasCookies = [];
	for (var i in CM.Data.ChristCookies) {
		if (!Game.Has(CM.Data.ChristCookies[i])) {
			missingChristmasCookies.push(CM.Data.ChristCookies[i]);
			specDisp = true;
		}
	}
	var missingValentineCookies = [];
	for (var i in CM.Data.ValCookies) {
		if (!Game.Has(CM.Data.ValCookies[i])) {
			missingValentineCookies.push(CM.Data.ValCookies[i]);
			specDisp = true;
		}
	}
	var missingNormalEggs = [];
	for (var i in Game.eggDrops) {
		if (!Game.HasUnlocked(Game.eggDrops[i])) {
			missingNormalEggs.push(Game.eggDrops[i]);
			specDisp = true;
		}
	}
	var missingRareEggs = [];
	for (var i in Game.rareEggDrops) {
		if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
			missingRareEggs.push(Game.rareEggDrops[i]);
			specDisp = true;
		}
	}
	var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));
	var centEgg = Game.Has('Century egg');
	
	if (Game.season == 'christmas' || specDisp || choEgg || centEgg) {
		stats.appendChild(CM.Disp.CreateStatsHeader('Season Specials', 'Sea'));
		if (CM.Config.StatsPref.Sea) {
			if (specDisp) {
				if (missingHalloweenCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Halloween Cookies Left to Buy', CM.Disp.CreateStatsMissDisp(missingHalloweenCookies)));
				if (missingChristmasCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Christmas Cookies Left to Buy',  CM.Disp.CreateStatsMissDisp(missingChristmasCookies)));
				if (missingValentineCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Valentine Cookies Left to Buy',  CM.Disp.CreateStatsMissDisp(missingValentineCookies)));
				if (missingNormalEggs.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Normal Easter Eggs Left to Unlock',  CM.Disp.CreateStatsMissDisp(missingNormalEggs)));
				if (missingRareEggs.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rare Easter Eggs Left to Unlock',  CM.Disp.CreateStatsMissDisp(missingRareEggs)));
			}

			if (Game.season == 'christmas') stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Reindeer Reward',  document.createTextNode(Beautify(CM.Cache.SeaSpec))));
			if (choEgg) {
				stats.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Chocolate Egg Cookies', document.createTextNode(Beautify(CM.Cache.lastChoEgg)), 'ChoEggTooltipPlaceholder'));
			}
			if (centEgg) {
				stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Century Egg Multiplier', document.createTextNode((Math.round((CM.Cache.CentEgg - 1) * 10000) / 100) + '%')));
			}
		}
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Miscellaneous', 'Misc'));
	if (CM.Config.StatsPref.Misc) {
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 
			'Average Cookies Per Second (Past ' + (CM.Disp.cookieTimes[CM.Config.AvgCPSHist] < 60 ? (CM.Disp.cookieTimes[CM.Config.AvgCPSHist] + ' seconds') : ((CM.Disp.cookieTimes[CM.Config.AvgCPSHist] / 60) + (CM.Config.AvgCPSHist == 3 ? ' minute' : ' minutes'))) + ')', 
			document.createTextNode(Beautify(CM.Cache.AvgCPS, 3))
		));
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Average Cookie Clicks Per Second (Past ' + CM.Disp.clickTimes[CM.Config.AvgClicksHist] + (CM.Config.AvgClicksHist == 0 ? ' second' : ' seconds') + ')', document.createTextNode(Beautify(CM.Cache.AvgClicks, 1))));
		if (Game.Has('Fortune cookies')) {
			var fortunes = [];
			for (var i in CM.Data.Fortunes) {
				if (!Game.Has(CM.Data.Fortunes[i])) {
					fortunes.push(CM.Data.Fortunes[i]);
				}
			}
			if (fortunes.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Fortune Upgrades Left to Buy',  CM.Disp.CreateStatsMissDisp(fortunes)));
		}
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
		if (Game.prefs.autosave) {
			var timer = document.createElement('span');
			timer.id = 'CMStatsAutosaveTimer';
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.OnAscend ? 0 : (Game.T % (Game.fps * 60))), 4);
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Time till autosave', timer));
		}
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);

	if (CM.Config.MissingUpgrades) {
		CM.Disp.AddMissingUpgrades();
	}
}

/**
 * This function creates a header-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
CM.Disp.CreateStatsHeader = function(text, config) {
	var div = document.createElement('div');
	div.className = 'listing';
	div.style.padding = '5px 16px';
	div.style.opacity = '0.7';
	div.style.fontSize = '17px';
	div.style.fontFamily = '\"Kavoon\", Georgia, serif';
	div.appendChild(document.createTextNode(text + ' '));
	var span = document.createElement('span');
	span.style.cursor = 'pointer';
	span.style.display = 'inline-block';
	span.style.height = '14px';
	span.style.width = '14px';
	span.style.borderRadius = '7px';
	span.style.textAlign = 'center';
	span.style.backgroundColor = '#C0C0C0';
	span.style.color = 'black';
	span.style.fontSize = '13px';
	span.style.verticalAlign = 'middle';
	span.textContent = CM.Config.StatsPref[config] ? '-' : '+';
	span.onclick = function() {CM.ToggleStatsConfig(config); Game.UpdateMenu();};
	div.appendChild(span);
	return div;
}

/**
 * This function creates an stats-listing-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		type		The type fo the listing
 * @param 	{string}		name		The name of the option
 * @param 	{object}		text		The text-object of the option
 * @param 	{string}		placeholder	The id of the to-be displayed tooltip if applicable
 * @returns	{object}		div			The option object
 */
CM.Disp.CreateStatsListing = function(type, name, text, placeholder) {
	var div = document.createElement('div');
	div.className = 'listing';

	var listingName = document.createElement('b');
	listingName.textContent = name;
	div.appendChild(listingName);
	if (type == "withTooltip")  {
		div.className = 'listing';
		
		var tooltip = document.createElement('span');
		tooltip.onmouseout = function() { Game.tooltip.hide(); };
		tooltip.onmouseover = function() {Game.tooltip.draw(this, escape(CM.Disp[placeholder].innerHTML));};
		tooltip.style.cursor = 'default';
		tooltip.style.display = 'inline-block';
		tooltip.style.height = '10px';
		tooltip.style.width = '10px';
		tooltip.style.borderRadius = '5px';
		tooltip.style.textAlign = 'center';
		tooltip.style.backgroundColor = '#C0C0C0';
		tooltip.style.color = 'black';
		tooltip.style.fontSize = '9px';
		tooltip.style.verticalAlign = 'bottom';
		tooltip.textContent = '?';
		div.appendChild(tooltip);
		div.appendChild(document.createTextNode(' '));
	}
	div.appendChild(document.createTextNode(': '));
	div.appendChild(text);
	return div;
}

/**
 * This function creates a tooltip containing all missing holiday items contained in the list theMissDisp
 * @param 	{list}			theMissDisp		A list of the missing holiday items
 * @returns	{object}		frag			The tooltip object
 */
CM.Disp.CreateStatsMissDisp = function(theMissDisp) {
	var frag = document.createDocumentFragment();
	frag.appendChild(document.createTextNode(theMissDisp.length + ' '));
	var span = document.createElement('span');
	span.onmouseout = function() { Game.tooltip.hide(); };
	var placeholder = document.createElement('div');
	var missing = document.createElement('div');
	missing.style.minWidth = '140px';
	missing.style.marginBottom = '4px';
	var title = document.createElement('div');
	title.className = 'name';
	title.style.marginBottom = '4px';
	title.style.textAlign = 'center';
	title.textContent = 'Missing';
	missing.appendChild(title);
	for (var i in theMissDisp) {
		var div = document.createElement('div');
		div.style.textAlign = 'center';
		div.appendChild(document.createTextNode(theMissDisp[i]));
		missing.appendChild(div);
	}
	placeholder.appendChild(missing);
	span.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML));};
	span.style.cursor = 'default';
	span.style.display = 'inline-block';
	span.style.height = '10px';
	span.style.width = '10px';
	span.style.borderRadius = '5px';
	span.style.textAlign = 'center';
	span.style.backgroundColor = '#C0C0C0';
	span.style.color = 'black';
	span.style.fontSize = '9px';
	span.style.verticalAlign = 'bottom';
	span.textContent = '?';
	frag.appendChild(span);
	return frag;
}

/**
 * This function creates the "Lucky" section of the stats page
 * @returns	{object}	section		The object contating the Lucky section
 */
CM.Disp.CreateStatsLuckySection = function() {	
	// TODO: Remove this and creater better tooltip!!
	var goldCookTooltip = CM.Sim.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';
	
	var section = document.createElement('div');
	section.className = 'CMStatsLuckySection';
	
	var luckyColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var luckyTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.FormatTime((CM.Cache.Lucky - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	var luckyReqFrag = document.createDocumentFragment();
	var luckyReqSpan = document.createElement('span');
	luckyReqSpan.style.fontWeight = 'bold';
	luckyReqSpan.className = CM.Disp.colorTextPre + luckyColor;
	luckyReqSpan.textContent = Beautify(CM.Cache.Lucky);
	luckyReqFrag.appendChild(luckyReqSpan);
	if (luckyTime != '') {
		var luckyReqSmall = document.createElement('small');
		luckyReqSmall.textContent = ' (' + luckyTime + ')';
		luckyReqFrag.appendChild(luckyReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Cookies Required', luckyReqFrag, goldCookTooltip));


	var luckyColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var luckyTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.FormatTime((CM.Cache.LuckyFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	var luckyReqFrenFrag = document.createDocumentFragment();
	var luckyReqFrenSpan = document.createElement('span');
	luckyReqFrenSpan.style.fontWeight = 'bold';
	luckyReqFrenSpan.className = CM.Disp.colorTextPre + luckyColorFrenzy;
	luckyReqFrenSpan.textContent = Beautify(CM.Cache.LuckyFrenzy);
	luckyReqFrenFrag.appendChild(luckyReqFrenSpan);
	if (luckyTimeFrenzy != '') {
		var luckyReqFrenSmall = document.createElement('small');
		luckyReqFrenSmall.textContent = ' (' + luckyTimeFrenzy + ')';
		luckyReqFrenFrag.appendChild(luckyReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Cookies Required (Frenzy)', luckyReqFrenFrag, goldCookTooltip));
	
	var luckySplit = CM.Cache.LuckyReward != CM.Cache.LuckyWrathReward;

	var luckyRewardMaxSpan = document.createElement('span');
	luckyRewardMaxSpan.style.fontWeight = 'bold';
	luckyRewardMaxSpan.className = CM.Disp.colorTextPre + CM.Cache.LuckyReward;
	luckyRewardMaxSpan.textContent = Beautify(CM.Cache.LuckyReward) + (luckySplit ? (' / ' + Beautify(CM.Cache.LuckyWrathReward)) : '');
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Reward (MAX)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyRewardMaxSpan, goldCookTooltip));

	var luckyRewardFrenzyMaxSpan = document.createElement('span');
	luckyRewardFrenzyMaxSpan.style.fontWeight = 'bold';
	luckyRewardFrenzyMaxSpan.className = CM.Disp.colorTextPre + luckyRewardFrenzyMaxSpan;
	luckyRewardFrenzyMaxSpan.textContent = Beautify(CM.Cache.LuckyRewardFrenzy) + (luckySplit ? (' / ' + Beautify(CM.Cache.LuckyWrathRewardFrenzy)) : '');
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Reward (MAX) (Frenzy)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyRewardFrenzyMaxSpan , goldCookTooltip));
	
	var luckyCurBase = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * CM.Cache.DragonsFortuneMultAdjustment * 60 * 15) + 13;
	var luckyCurSpan = document.createElement('span');
	luckyCurSpan.style.fontWeight = 'bold';
	luckyCurSpan.className = CM.Disp.colorTextPre + luckyCurSpan;
	luckyCurSpan.textContent = Beautify(CM.Cache.GoldenCookiesMult * luckyCurBase) + (luckySplit ? (' / ' + Beautify(CM.Cache.WrathCookiesMult * luckyCurBase)) : '')
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Reward (CUR)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyCurSpan, goldCookTooltip));
	return section;
}

/**
 * This function creates the "Chain" section of the stats page
 * @returns	{object}	section		The object contating the Chain section
 */
CM.Disp.CreateStatsChainSection = function() {
	// TODO: Remove this and creater better tooltip!!
	var goldCookTooltip = CM.Sim.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';
	
	var section = document.createElement('div');
	section.className = 'CMStatsChainSection';

	var chainColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Chain) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Chain) ? CM.Disp.FormatTime((CM.Cache.Chain - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	var chainReqFrag = document.createDocumentFragment();
	var chainReqSpan = document.createElement('span');
	chainReqSpan.style.fontWeight = 'bold';
	chainReqSpan.className = CM.Disp.colorTextPre + chainColor;
	chainReqSpan.textContent = Beautify(CM.Cache.Chain);
	chainReqFrag.appendChild(chainReqSpan);
	if (chainTime != '') {
		var chainReqSmall = document.createElement('small');
		chainReqSmall.textContent = ' (' + chainTime + ')';
		chainReqFrag.appendChild(chainReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required', chainReqFrag, goldCookTooltip));
	
	var chainWrathColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainWrathTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrath) ? CM.Disp.FormatTime((CM.Cache.ChainWrath - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	var chainWrathReqFrag = document.createDocumentFragment();
	var chainWrathReqSpan = document.createElement('span');
	chainWrathReqSpan.style.fontWeight = 'bold';
	chainWrathReqSpan.className = CM.Disp.colorTextPre + chainWrathColor;
	chainWrathReqSpan.textContent = Beautify(CM.Cache.ChainWrath);
	chainWrathReqFrag.appendChild(chainWrathReqSpan);
	if (chainWrathTime != '') {
		var chainWrathReqSmall = document.createElement('small');
		chainWrathReqSmall.textContent = ' (' + chainWrathTime + ')';
		chainWrathReqFrag.appendChild(chainWrathReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required (Wrath)', chainWrathReqFrag, goldCookTooltip));
	
	var chainColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzy) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	var chainReqFrenFrag = document.createDocumentFragment();
	var chainReqFrenSpan = document.createElement('span');
	chainReqFrenSpan.style.fontWeight = 'bold';
	chainReqFrenSpan.className = CM.Disp.colorTextPre + chainColorFrenzy;
	chainReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzy);
	chainReqFrenFrag.appendChild(chainReqFrenSpan);
	if (chainTimeFrenzy != '') {
		var chainReqFrenSmall = document.createElement('small');
		chainReqFrenSmall.textContent = ' (' + chainTimeFrenzy + ')';
		chainReqFrenFrag.appendChild(chainReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required (Frenzy)', chainReqFrenFrag, goldCookTooltip));
	
	var chainWrathColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainWrathTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrath) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyWrath - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	var chainWrathReqFrenFrag = document.createDocumentFragment();
	var chainWrathReqFrenSpan = document.createElement('span');
	chainWrathReqFrenSpan.style.fontWeight = 'bold';
	chainWrathReqFrenSpan.className = CM.Disp.colorTextPre + chainWrathColorFrenzy;
	chainWrathReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzyWrath);
	chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSpan);
	if (chainWrathTimeFrenzy != '') {
		var chainWrathReqFrenSmall = document.createElement('small');
		chainWrathReqFrenSmall.textContent = ' (' + chainWrathTimeFrenzy + ')';
		chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required (Frenzy) (Wrath)', chainWrathReqFrenFrag, goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Reward (MAX) (Golden / Wrath)', document.createTextNode(Beautify(CM.Cache.ChainReward) + ' / ' + Beautify(CM.Cache.ChainWrathReward)), goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Reward (MAX) (Frenzy) (Golden / Wrath)', document.createTextNode((Beautify(CM.Cache.ChainFrenzyReward) + ' / ' + Beautify(CM.Cache.ChainFrenzyWrathReward))), goldCookTooltip));

	// TODO: Place MaxChainMoni function into CM.Cache.RemakeChain and create global variables to store it
	var chainCurMax = Math.min(CM.Cache.NoGoldSwitchCookiesPS * CM.Cache.DragonsFortuneMultAdjustment * 60 * 60 * 6, (Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.5);
	var chainCur = CM.Cache.MaxChainMoni(7, chainCurMax, CM.Cache.GoldenCookiesMult);
	var chainCurWrath = CM.Cache.MaxChainMoni(6, chainCurMax, CM.Cache.WrathCookiesMult);
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Reward (CUR) (Golden / Wrath)', document.createTextNode((Beautify(chainCur) + ' / ' + Beautify(chainCurWrath))), goldCookTooltip));
	return section;
}

/**
 * This function creates the "Conjure" section of the stats page
 * @returns	{object}	section		The object contating the Conjure section
 */
CM.Disp.CreateStatsConjureSection = function() {
	var section = document.createElement('div');
	section.className = 'CMStatsConjureSection';

	var conjureColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var conjureCur = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30);
	var conjureTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.FormatTime((CM.Cache.Conjure - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	
	var conjureReqFrag = document.createDocumentFragment();
	var conjureReqSpan = document.createElement('span');
	conjureReqSpan.style.fontWeight = 'bold';
	conjureReqSpan.className = CM.Disp.colorTextPre + conjureColor;
	conjureReqSpan.textContent = Beautify(CM.Cache.Conjure);
	conjureReqFrag.appendChild(conjureReqSpan);
	if (conjureTime != '') {
		var conjureReqSmall = document.createElement('small');
		conjureReqSmall.textContent = ' (' + conjureTime + ')';
		conjureReqFrag.appendChild(conjureReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Conjure Baked Goods\" Cookies Required', conjureReqFrag, 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Conjure Baked Goods\" Reward (MAX)', document.createTextNode(CM.Disp.Beautify(CM.Cache.ConjureReward)), 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Conjure Baked Goods\" Reward (CUR)', document.createTextNode(CM.Disp.Beautify(conjureCur)), 'GoldCookTooltipPlaceholder'));
	return section;
}

/**
 * This function creates the "Prestige" section of the stats page
 * @returns	{object}	section		The object contating the Prestige section
 */
CM.Disp.CreateStatsPrestigeSection = function() {
	var section = document.createElement('div');
	section.className = 'CMStatsPrestigeSection';

	var possiblePresMax = Math.floor(Game.HowMuchPrestige(CM.Cache.RealCookiesEarned + 
		Game.cookiesReset + CM.Cache.WrinkGodBank + 
		(Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0)));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Prestige Level (CUR / MAX)', document.createTextNode(Beautify(Game.prestige) + ' / ' + Beautify(possiblePresMax)), 'PrestMaxTooltipPlaceholder'));
	
	var neededCook = Game.HowManyCookiesReset(possiblePresMax + 1) - (CM.Cache.RealCookiesEarned + Game.cookiesReset + CM.Cache.WrinkGodBank + ((Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0) ? CM.Cache.lastChoEgg : 0));
	var cookiesNextFrag = document.createDocumentFragment();
	cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
	var cookiesNextSmall = document.createElement('small');
	cookiesNextSmall.textContent = ' (' + (CM.Disp.FormatTime(neededCook / CM.Cache.AvgCPSChoEgg, 1)) + ')';
	cookiesNextFrag.appendChild(cookiesNextSmall);
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Cookies To Next Level', cookiesNextFrag, 'NextPrestTooltipPlaceholder'));
	
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Heavenly Chips (CUR / MAX)', document.createTextNode(Beautify(Game.heavenlyChips) + ' / ' + Beautify((possiblePresMax - Game.prestige) + Game.heavenlyChips)), 'HeavenChipMaxTooltipPlaceholder'));
	
	var resetBonus = CM.Sim.ResetBonus(possiblePresMax);
	var resetFrag = document.createDocumentFragment();
	resetFrag.appendChild(document.createTextNode(Beautify(resetBonus)));
	var increase = Math.round(resetBonus / Game.cookiesPs * 10000);
	if (isFinite(increase) && increase != 0) {
		var resetSmall = document.createElement('small');
		resetSmall.textContent = ' (' + (increase / 100) + '% of income)';
		resetFrag.appendChild(resetSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Reset Bonus Income', resetFrag, 'ResetTooltipPlaceholder'));

	var currentPrestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset));
	var willHave = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
	var willGet = willHave - currentPrestige;
	if (!Game.Has('Lucky digit')) {
		var delta7 = 7 - (willHave % 10);
		if (delta7 < 0) delta7 += 10;
		var next7Reset = willGet + delta7;
		var next7Total = willHave + delta7;
		var frag7 = document.createDocumentFragment();
		frag7.appendChild(document.createTextNode(next7Total.toLocaleString() + " / " + next7Reset.toLocaleString() + " (+" + delta7 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Digit" (total / reset)', frag7));
	}
	
	if (!Game.Has('Lucky number')) {
		var delta777 = 777 - (willHave % 1000);
		if (delta777 < 0) delta777 += 1000;
		var next777Reset = willGet + delta777;
		var next777Total = willHave + delta777;
		var frag777 = document.createDocumentFragment();
		frag777.appendChild(document.createTextNode(next777Total.toLocaleString() + " / " + next777Reset.toLocaleString() + " (+" + delta777 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Number" (total / reset)', frag777));
	}
	
	if (!Game.Has('Lucky payout')) {
		var delta777777 = 777777 - (willHave % 1000000);
		if (delta777777 < 0) delta777777 += 1000000;
		var next777777Reset = willGet + delta777777;
		var next777777Total = willHave + delta777777;
		var frag777777 = document.createDocumentFragment();
		frag777777.appendChild(document.createTextNode(next777777Total.toLocaleString() + " / " + next777777Reset.toLocaleString() + " (+" + delta777777 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Payout" (total / reset)', frag777777));
	}

	return section;
}

// TODO: Fix and annotate this function.
/**
CM.Disp.AddMissingUpgrades = function() {
	if (CM.Cache.UpgradesOwned != Game.UpgradesOwned) {
		CM.Cache.CalcMissingUpgrades();
		CM.Cache.MissingUpgradesString = null;
        CM.Cache.MissingCookiesString = null;
	}

	// Sort the lists of missing cookies & upgrades
	var sortMap = function(a,b) {
		if (a.order > b.order) return 1;
		else if (a.order < b.order) return -1;
		else return 0;
	}
	CM.Cache.MissingUpgrades.sort(sortMap);
	CM.Cache.MissingCookies.sort(sortMap);;

	// Find Upgrades-section of stats menu
	var upgradesMenu = null;
 	for (var i = 0; i < l("menu").getElementsByClassName("subsection").length && upgradesMenu == null; i++)
 	{
 		if (l("menu").getElementsByClassName("subsection")[i].getElementsByClassName("title")[0].textContent === "Upgrades")
 		{
 			upgradesMenu = l("menu").getElementsByClassName("subsection")[i];
 		}
 	}

	// This function creates div element from given object. It also adds tooltip for it.
	var createUpgradeElement = function (me) {
		return '<div class="crate upgrade disabled noFrame" ' +
			Game.getTooltip(
				'<div style="padding:8px 4px;min-width:350px;">' +
				'<div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48) + 'px ' + (-me.icon[1] * 48) + 'px;"></div>' +
				'<div style="float:right;"><span class="price">' + Beautify(Math.round(me.getPrice())) + '</span></div>' +
				'<div class="name">' + me.name + '</div>' +
				'<div class="line"></div><div class="description">' + me.desc + '</div></div>',
				'top',
				true) +
			' style="background-position:' + (-me.icon[0] * 48) + 'px ' + (-me.icon[1] * 48) + 'px;"></div>';
	};

	// This function creates section of given elements and adds this elements to it.
	var createElementBox = function (elements) {
		var div = document.createElement('div');
		div.className = 'listing crateBox';
		elements.forEach(function (element) {
			div.innerHTML += createUpgradeElement(element);
	});
		return div;
	};

	// This function creates header element with given text.
	var createHeader = function (text) {
		var div = document.createElement('div');
		div.className = 'listing';
		var b = document.createElement('b');
		b.textContent = text;
		div.appendChild(b);
		return div;
	};

	if (CM.Cache.MissingUpgrades.length > 0) {
		upgradesMenu.appendChild(createHeader("Missing Upgrades"));
		if (CM.Cache.MissingUpgradesString == null) {
			CM.Cache.MissingUpgradesString = createElementBox(CM.Cache.MissingUpgrades);
	}
		upgradesMenu.appendChild(CM.Cache.MissingUpgradesString);
	}

	if (CM.Cache.MissingCookies.length > 0) {
		upgradesMenu.appendChild(createHeader("Missing Cookies"));
		if (CM.Cache.MissingCookiesString == null) {
			CM.Cache.MissingCookiesString = createElementBox(CM.Cache.MissingCookies);
		}
		upgradesMenu.appendChild(CM.Cache.MissingCookiesString);
	}
} */

/********
 * Section: Variables used in Disp functions
 */

/**
 * This list is used to make some very basic tooltips.
 * It is used by CM.DelayInit() in the call of CM.Disp.CreateSimpleTooltip()
 * @item	{string}	placeholder	
 * @item	{string}	text		
 * @item	{string}	minWidth	
 */
CM.Disp.TooltipText = [
	['GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px'],
	['GoldCookDragonsFortuneTooltipPlaceholder', 'Calculated with Golden Switch off and at least one golden cookie on-screen', '240px'],
	['PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '320px'], 
	['NextPrestTooltipPlaceholder', 'Calculated with cookies gained from wrinklers and Chocolate egg', '200px'], 
	['HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '330px'], 
	['ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from ascension achievements if you have the same buildings/upgrades after reset', '370px'], 
	['ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and then buying Chocolate egg', '300px']
];

/**
 * These are variables used to create DOM object names and id (e.g., 'CMTextTooltip)
 */
CM.Disp.colorTextPre = 'CMText';
CM.Disp.colorBackPre = 'CMBack';
CM.Disp.colorBorderPre = 'CMBorder';

/**
 * These are variables which can be set in the options by the user to standardize colours throughout CookieMonster
 */
CM.Disp.colorBlue = 'Blue';
CM.Disp.colorGreen = 'Green';
CM.Disp.colorYellow = 'Yellow';
CM.Disp.colorOrange = 'Orange';
CM.Disp.colorRed = 'Red';
CM.Disp.colorPurple = 'Purple';
CM.Disp.colorGray = 'Gray';
CM.Disp.colorPink = 'Pink';
CM.Disp.colorBrown = 'Brown';
CM.Disp.colors = [CM.Disp.colorBlue, CM.Disp.colorGreen, CM.Disp.colorYellow, CM.Disp.colorOrange, CM.Disp.colorRed, CM.Disp.colorPurple, CM.Disp.colorGray, CM.Disp.colorPink, CM.Disp.colorBrown];


/**
 * This array is used to give certain timers specific colours
 */
CM.Disp.buffColors = {'Frenzy': CM.Disp.colorYellow, 'Dragon Harvest': CM.Disp.colorBrown, 'Elder frenzy': CM.Disp.colorGreen, 'Clot': CM.Disp.colorRed, 'Click frenzy': CM.Disp.colorBlue, 'Dragonflight': CM.Disp.colorPink};
CM.Disp.GCTimers = {};
CM.Disp.lastAscendState = -1;

/**
 * These lists are used in the stats page to show 
 * average cookies per {CM.Disp.cookieTimes/CM.Disp.clickTimes} seconds
 */
CM.Disp.cookieTimes = [10, 15, 30, 60, 300, 600, 900, 1800];
CM.Disp.clickTimes = [1, 5, 10, 15, 30];

/**
 * This lists is used to store whether a Wrinkler tooltip is being shown or not
 * [i] = 1 means tooltip is being shown, [i] = 0 means hidden
 * It is used by CM.Disp.CheckWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
CM.Disp.TooltipWrinklerBeingShown = [];

/**
 * These are variables with base-values that get initalized when initliazing CookieMonster 
 * TODO: See if these can be removed or moved
 */
CM.Disp.TooltipWrinklerArea = 0;
CM.Disp.TooltipWrinkler = -1;

/********
 * Main *
 ********/

CM.ReplaceNative = function() {
	CM.Backup.Beautify = Beautify;
	Beautify = CM.Disp.Beautify;

	CM.Backup.CalculateGains = Game.CalculateGains;
	eval('CM.Backup.CalculateGainsMod = ' + Game.CalculateGains.toString().split('ages\');').join('ages\');CM.Sim.DateAges = Date.now();').split('if (Game.Has(\'Century').join('CM.Sim.DateCentury = Date.now();if (Game.Has(\'Century'));
	Game.CalculateGains = function() {
		CM.Backup.CalculateGainsMod();
		CM.Sim.DoSims = 1;
	}

	CM.Backup.tooltip = {};
	CM.Backup.tooltip.draw = Game.tooltip.draw;
	eval('CM.Backup.tooltip.drawMod = ' + Game.tooltip.draw.toString().split('this').join('Game.tooltip'));
	Game.tooltip.draw = function(from, text, origin) {
		CM.Backup.tooltip.drawMod(from, text, origin);
	}

	CM.Backup.tooltip.update = Game.tooltip.update;
	eval('CM.Backup.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this.').join('Game.tooltip.'));
	Game.tooltip.update = function() {
		CM.Backup.tooltip.updateMod();
		CM.Disp.UpdateTooltipLocation();
	}

	CM.Backup.UpdateWrinklers = Game.UpdateWrinklers;
	Game.UpdateWrinklers = function() {
		CM.Main.FixMouseY(CM.Backup.UpdateWrinklers);
	}

	CM.Backup.UpdateSpecial = Game.UpdateSpecial;
	Game.UpdateSpecial = function() {
		CM.Main.FixMouseY(CM.Backup.UpdateSpecial);
	}

	// Assumes newer browsers
	l('bigCookie').removeEventListener('click', Game.ClickCookie, false);
	l('bigCookie').addEventListener('click', function() { CM.Main.FixMouseY(Game.ClickCookie); }, false);

	// Probably better to load per minigame
	CM.Backup.scriptLoaded = Game.scriptLoaded;
	Game.scriptLoaded = function(who, script) {
		CM.Backup.scriptLoaded(who, script);
		CM.Disp.AddTooltipGrimoire()
		CM.ReplaceNativeGrimoire();
	}

	// TODO: Move this ReplaceTooltip function too other ReplaceTooltip functions
	// OR: Move all other into this function
	CM.Backup.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function() {
		CM.Backup.RebuildUpgrades();
		CM.Disp.ReplaceTooltipUpgrade();
		Game.CalculateGains();
	}

	
	CM.Backup.DescribeDragonAura = Game.DescribeDragonAura;
	/**
	 * This functions adds the function CM.Disp.AddAuraInfo() to Game.DescribeDragonAura()
	 * This adds information about CPS differences and costs to the aura choosing interface
	 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
	 */
	Game.DescribeDragonAura = function(aura) {
		CM.Backup.DescribeDragonAura(aura);
		CM.Disp.AddAuraInfo(aura);
	}

	CM.Backup.UpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		if (typeof jscolor.picker === 'undefined' || typeof jscolor.picker.owner === 'undefined') {
			CM.Backup.UpdateMenu();
			CM.Disp.AddMenu();
		}
	}

	CM.Backup.sayTime = Game.sayTime;
	CM.Disp.sayTime = function(time, detail) {
		if (isNaN(time) || time <= 0) return CM.Backup.sayTime(time, detail);
		else return CM.Disp.FormatTime(time / Game.fps, 1);
	}

	CM.Backup.Loop = Game.Loop;
	Game.Loop = function() {
		CM.Backup.Loop();
		CM.Loop();
	}

	CM.Backup.Logic = Game.Logic;
	eval('CM.Backup.LogicMod = ' + Game.Logic.toString().split('document.title').join('CM.Cache.Title'));
	Game.Logic = function() {
		CM.Backup.LogicMod();

		// Update Title
		CM.Disp.UpdateTitle();
	}
}

CM.ReplaceNativeGrimoire = function() {
	CM.ReplaceNativeGrimoireLaunch();
	CM.ReplaceNativeGrimoireDraw();
}

CM.ReplaceNativeGrimoireLaunch = function() {
	if (!CM.HasReplaceNativeGrimoireLaunch && Game.Objects['Wizard tower'].minigameLoaded) {
		var minigame = Game.Objects['Wizard tower'].minigame;
		CM.Backup.GrimoireLaunch = minigame.launch;
		eval('CM.Backup.GrimoireLaunchMod = ' + minigame.launch.toString().split('=this').join('= Game.Objects[\'Wizard tower\'].minigame'));
		Game.Objects['Wizard tower'].minigame.launch = function() {
			CM.Backup.GrimoireLaunchMod();
			CM.Disp.AddTooltipGrimoire();
			CM.HasReplaceNativeGrimoireDraw = false;
			CM.ReplaceNativeGrimoireDraw();
		}
		CM.HasReplaceNativeGrimoireLaunch = true;
	}
}

CM.ReplaceNativeGrimoireDraw = function() {
	if (!CM.HasReplaceNativeGrimoireDraw && Game.Objects['Wizard tower'].minigameLoaded) {
		var minigame = Game.Objects['Wizard tower'].minigame;
		CM.Backup.GrimoireDraw = minigame.draw;
		Game.Objects['Wizard tower'].minigame.draw = function() {
			CM.Backup.GrimoireDraw();
			if (CM.Config.GrimoireBar == 1 && minigame.magic < minigame.magicM) {
				minigame.magicBarTextL.innerHTML += ' (' + CM.Disp.FormatTime(CM.Disp.CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, minigame.magicM)) + ')';
			}
		}
		CM.HasReplaceNativeGrimoireDraw = true;
	}
}

CM.Loop = function() {
	if (CM.Disp.lastAscendState != Game.OnAscend) {
		CM.Disp.lastAscendState = Game.OnAscend;
		CM.Disp.UpdateAscendState();
	}
	if (!Game.OnAscend && Game.AscendTimer == 0) {
		if (CM.Sim.DoSims) {
			CM.Cache.RemakeIncome();

			CM.Sim.NoGoldSwitchCookiesPS(); // Needed first
			CM.Cache.RemakeGoldenAndWrathCookiesMults();
			CM.Cache.RemakeLucky();
			CM.Cache.RemakeChain();

			CM.Cache.RemakeSeaSpec();
			CM.Cache.RemakeSellForChoEgg();

			CM.Sim.DoSims = 0;
		}

		// Check for aura change to recalculate buildings prices
		var hasBuildAura = Game.auraMult('Fierce Hoarder') > 0;
		if (!CM.Cache.HadBuildAura && hasBuildAura) {
			CM.Cache.HadBuildAura = true;
			CM.Cache.DoRemakeBuildPrices = 1;
		}
		else if (CM.Cache.HadBuildAura && !hasBuildAura) {
			CM.Cache.HadBuildAura = false;
			CM.Cache.DoRemakeBuildPrices = 1;
		}

		if (CM.Cache.DoRemakeBuildPrices) {
			CM.Cache.RemakeBuildingsPrices();
			CM.Cache.DoRemakeBuildPrices = 0;
		}

		// Update Wrinkler Bank
		CM.Cache.RemakeWrinkBank();

		// Calculate PP
		CM.Cache.RemakePP();

		// Update colors
		CM.Disp.UpdateBuildings();
		CM.Disp.UpdateUpgrades();

		// Redraw timers
		CM.Disp.UpdateTimerBar();

		// Update Bottom Bar
		CM.Disp.UpdateBotBar();

		// Update Tooltip
		CM.Disp.UpdateTooltip();

		// Update Wrinkler Tooltip
		CM.Disp.CheckWrinklerTooltip();
		CM.Disp.UpdateWrinklerTooltip();

		// Change menu refresh interval
		CM.Disp.RefreshMenu();
	}

	// Check all changing minigames and game-states
	CM.Main.CheckGoldenCookie();
	CM.Main.CheckTickerFortune();
	CM.Main.CheckSeasonPopup();
	CM.Main.CheckGardenTick();
	CM.Main.CheckMagicMeter();
	CM.Main.CheckWrinklerCount();

	// Update Average CPS (might need to move)
	CM.Cache.UpdateAvgCPS()
}

CM.Init = function() {
	var proceed = true;
	if (Game.version != CM.VersionMajor) {
		proceed = confirm('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' is meant for Game version ' + CM.VersionMajor + '.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?');
	}
	if (proceed) {
		CM.Cache.AddQueue();
		CM.Disp.AddJscolor();

		var delay = setInterval(function() {
			if (typeof Queue !== 'undefined' && typeof jscolor !== 'undefined') {
				CM.DelayInit();
				clearInterval(delay);
			}
		}, 500);
	}
}

CM.DelayInit = function() {
	CM.Sim.InitData();
	CM.Disp.CreateCssArea();
	CM.Disp.CreateBotBar();
	CM.Disp.CreateTimerBar();
	CM.Disp.CreateUpgradeBar();
	CM.Disp.CreateWhiteScreen();
	CM.Disp.CreateFavicon();
	for (var i in CM.Disp.TooltipText) {
		CM.Disp.CreateSimpleTooltip(CM.Disp.TooltipText[i][0], CM.Disp.TooltipText[i][1], CM.Disp.TooltipText[i][2]);
	}
	CM.Disp.ReplaceTooltipBuild();
	CM.Disp.ReplaceTooltipGrimoire();
	CM.Disp.ReplaceTooltipLump();
	CM.Main.AddWrinklerAreaDetect();
	CM.Cache.InitCookiesDiff();
	CM.ReplaceNative();
	CM.ReplaceNativeGrimoire();
	Game.CalculateGains();
	CM.LoadConfig(); // Must be after all things are created!
	CM.Disp.lastAscendState = Game.OnAscend;
	CM.Disp.lastBuyMode = Game.buyMode;
	CM.Disp.lastBuyBulk = Game.buyBulk;

	if (Game.prefs.popups) Game.Popup('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!');
	else Game.Notify('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!', '', '', 1, 1);

	// given the architecture of your code, you probably want these lines somewhere else,
	// but I stuck them here for convenience
	l("products").style.display = "grid";
	l("storeBulk").style.gridRow = "1/1";

	l("upgrades").style.display = "flex";
	l("upgrades").style["flex-wrap"] = "wrap";

	CM.Main.RegisterHooks();

	Game.Win('Third-party');
}

/**
 * Hook custom methods into the game
 */
CM.Main.RegisterHooks = function() {
	Game.registerHook('draw', CM.Disp.Draw);
}

/********
 * Section: Functions related to checking for changes in Minigames/GC's/Ticker
 * TODO: Possibly move this section */

/**
 * Auxilirary function that finds all currently spawned shimmers. 
 * CM.Cache.spawnedGoldenShimmer stores the non-user spawned cookie to later determine data for the favicon and tab-title
 * It is called by CM.CM.Main.CheckGoldenCookie
 */
CM.Main.FindShimmer = function() {
	CM.Main.currSpawnedGoldenCookieState = 0;
	CM.Cache.goldenShimmersByID = {}
	for (var i in Game.shimmers) {
		CM.Cache.goldenShimmersByID[Game.shimmers[i].id] = Game.shimmers[i]
		if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'golden') {
			CM.Cache.spawnedGoldenShimmer = Game.shimmers[i];
			CM.Main.currSpawnedGoldenCookieState += 1;
		}
	}
}

/**
 * This function checks for changes in the amount of Golden Cookies
 * It is called by CM.Loop
 * TODO: Remove the delete function, as it does not delete correctly and crowds CM.Disp.GCTimers
 */
CM.Main.CheckGoldenCookie = function() {
	CM.Main.FindShimmer();
	for (var i in CM.Disp.GCTimers) {
		if (typeof CM.Cache.goldenShimmersByID[i] == "undefined") {
			CM.Disp.GCTimers[i].parentNode.removeChild(CM.Disp.GCTimers[i]);
			// TODO remove delete here
			delete CM.Disp.GCTimers[i];
		}
	}
	if (CM.Main.lastGoldenCookieState != Game.shimmerTypes['golden'].n) {
		CM.Main.lastGoldenCookieState = Game.shimmerTypes['golden'].n;
		if (CM.Main.lastGoldenCookieState) {
			if (CM.Main.lastSpawnedGoldenCookieState < CM.Main.currSpawnedGoldenCookieState) {
				CM.Disp.Flash(3, 'GCFlash');
				CM.Disp.PlaySound(CM.Config.GCSoundURL, 'GCSound', 'GCVolume');
				CM.Disp.Notification('GCNotification', "Golden Cookie Spawned", "A Golden Cookie has spawned. Click it now!")
			}
			
			for (var i in Game.shimmers) {
				if (typeof CM.Disp.GCTimers[Game.shimmers[i].id] == "undefined") {
					CM.Disp.CreateGCTimer(Game.shimmers[i]);
				}
			}
		}
		CM.Disp.UpdateFavicon();
		CM.Main.lastSpawnedGoldenCookieState = CM.Main.currSpawnedGoldenCookieState;
		if (CM.Main.currSpawnedGoldenCookieState == 0) CM.Cache.spawnedGoldenShimmer = 0;
	}
	else if (CM.Config.GCTimer == 1 && CM.Main.lastGoldenCookieState) {
		for (var i in CM.Disp.GCTimers) {
			CM.Disp.GCTimers[i].style.opacity = CM.Cache.goldenShimmersByID[i].l.style.opacity;
			CM.Disp.GCTimers[i].style.transform = CM.Cache.goldenShimmersByID[i].l.style.transform;
			CM.Disp.GCTimers[i].textContent = Math.ceil(CM.Cache.goldenShimmersByID[i].life / Game.fps);
		}
	}
}

/**
 * This function checks if there is reindeer that has spawned
 * It is called by CM.Loop
 */
CM.Main.CheckSeasonPopup = function() {
	if (CM.Main.lastSeasonPopupState != Game.shimmerTypes['reindeer'].spawned) {
		CM.Main.lastSeasonPopupState = Game.shimmerTypes['reindeer'].spawned;
		for (var i in Game.shimmers) {
			if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'reindeer') {
				CM.Cache.seasonPopShimmer = Game.shimmers[i];
				break;
			}
		}
		CM.Disp.Flash(3, 'SeaFlash');
		CM.Disp.PlaySound(CM.Config.SeaSoundURL, 'SeaSound', 'SeaVolume');
		CM.Disp.Notification('SeaNotification',"Reindeer sighted!", "A Reindeer has spawned. Click it now!")
	}
}

/**
 * This function checks if there is a fortune cookie on the ticker
 * It is called by CM.Loop
 */
CM.Main.CheckTickerFortune = function() {
	if (CM.Main.lastTickerFortuneState != (Game.TickerEffect && Game.TickerEffect.type == 'fortune')) {
		CM.Main.lastTickerFortuneState = (Game.TickerEffect && Game.TickerEffect.type == 'fortune');
		if (CM.Main.lastTickerFortuneState) {
			CM.Disp.Flash(3, 'FortuneFlash');
			CM.Disp.PlaySound(CM.Config.FortuneSoundURL, 'FortuneSound', 'FortuneVolume');
			CM.Disp.Notification('FortuneNotification', "Fortune Cookie found", "A Fortune Cookie has appeared on the Ticker.")
		}
	}
}

/**
 * This function checks if a garden tick has happened
 * It is called by CM.Loop
 */
CM.Main.CheckGardenTick = function() {
	if (Game.Objects['Farm'].minigameLoaded && CM.Main.lastGardenNextStep != Game.Objects['Farm'].minigame.nextStep) {
		if (CM.Main.lastGardenNextStep != 0 && CM.Main.lastGardenNextStep < Date.now()) {
			CM.Disp.Flash(3, 'GardFlash');
			CM.Disp.PlaySound(CM.Config.GardSoundURL, 'GardSound', 'GardVolume');
		}
		CM.Main.lastGardenNextStep = Game.Objects['Farm'].minigame.nextStep;
	}
}

/**
 * This function checks if the magic meter is full
 * It is called by CM.Loop
 */
CM.Main.CheckMagicMeter = function() {
	if (Game.Objects['Wizard tower'].minigameLoaded && CM.Config.GrimoireBar == 1) {
		var minigame = Game.Objects['Wizard tower'].minigame;
		if (minigame.magic < minigame.magicM) CM.Main.lastMagicBarFull = false;
		else if (!CM.Main.lastMagicBarFull) {
			CM.Main.lastMagicBarFull = true;
			CM.Disp.Flash(3, 'MagicFlash');
			CM.Disp.PlaySound(CM.Config.MagicSoundURL, 'MagicSound', 'MagicVolume');
			CM.Disp.Notification('MagicNotification', "Magic Meter full", "Your Magic Meter is full. Cast a spell!")
		}
	}
}

/**
 * This function checks if any new Wrinklers have popped up
 * It is called by CM.Loop
 */
CM.Main.CheckWrinklerCount = function() {
	if (Game.elderWrath > 0) {
		var CurrentWrinklers = 0;
		for (var i in Game.wrinklers) {
			if (Game.wrinklers[i].phase == 2) CurrentWrinklers++;
		}
		if (CurrentWrinklers > CM.Main.lastWrinklerCount) {
			CM.Main.lastWrinklerCount = CurrentWrinklers
			if (CurrentWrinklers == Game.getWrinklersMax() && CM.Config.WrinklerMaxFlash) {
				CM.Disp.Flash(3, 'WrinklerMaxFlash');
			} else {
				CM.Disp.Flash(3, 'WrinklerFlash');
			}
			if (CurrentWrinklers == Game.getWrinklersMax() && CM.Config.WrinklerMaxSound) {
				CM.Disp.PlaySound(CM.Config.WrinklerMaxSoundURL, 'WrinklerMaxSound', 'WrinklerMaxVolume');
			} else {
				CM.Disp.PlaySound(CM.Config.WrinklerSoundURL, 'WrinklerSound', 'WrinklerVolume');
			}
			if (CurrentWrinklers == Game.getWrinklersMax() &&  CM.Config.WrinklerMaxNotification) {
				CM.Disp.Notification('WrinklerMaxNotification', "Maximum Wrinklers Reached", "You have reached your maximum ammount of wrinklers")
			} else {
				CM.Disp.Notification('WrinklerNotification', "A Wrinkler appeared", "A new wrinkler has appeared")
			}
		} else {
			CM.Main.lastWrinklerCount = CurrentWrinklers
		}
	}
}

/**
 * This function creates .onmouseover/out events that determine if the mouse is hovering-over a Wrinkler
 * It is called by CM.DelayInit
 * TODO: The system for displaying wrinklers should ideally use a similar system as other tooltips
 * Thus, writing a CM.Disp.ReplaceTooltipWrinkler function etc.
 */
CM.Main.AddWrinklerAreaDetect = function() {
	l('backgroundLeftCanvas').onmouseover = function() {CM.Disp.TooltipWrinklerArea = 1;};
	l('backgroundLeftCanvas').onmouseout = function() {
		CM.Disp.TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (var i in Game.wrinklers) {
			CM.Disp.TooltipWrinklerBeingShown[i] = 0;
		}
	};
}

/********
 * Section: Functions related to the mouse */

/**
 * This function fixes Game.mouseY as a result of bars that are added by CookieMonster
 * It is called by Game.UpdateWrinklers(), Game.UpdateSpecial() and the .onmousover of the BigCookie
 * before execution of their actual function
 */
CM.Main.FixMouseY = function(target) {
	if (CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
		var timerBarHeight = parseInt(CM.Disp.TimerBar.style.height);
		Game.mouseY -= timerBarHeight;
		target();
		Game.mouseY += timerBarHeight;
	}
	else {
		target();
	}
}

CM.HasReplaceNativeGrimoireLaunch = false;
CM.HasReplaceNativeGrimoireDraw = false;

CM.Main.lastGoldenCookieState = 0;
CM.Main.lastSpawnedGoldenCookieState = 0;
CM.Main.currSpawnedGoldenCookieState
CM.Main.lastTickerFortuneState = 0;
CM.Main.lastSeasonPopupState = 0;
CM.Main.lastGardenNextStep = 0;
CM.Main.lastMagicBarFull = 0;
CM.Main.lastWrinklerCount = 0;

CM.ConfigDefault = {
	BotBar: 1, 
	TimerBar: 1, 
	TimerBarPos: 0, 
	BuildColor: 1, 
	BulkBuildColor: 0, 
	ColorPPBulkMode: 0,
	UpBarColor: 1, 
	UpgradeBarFixedPos: 1,
	CalcWrink: 0, 
	CPSMode: 1, 
	AvgCPSHist: 3, 
	AvgClicksHist: 0, 
	ToolWarnBon: 0, 
	GCNotification: 0,
	GCFlash: 1, 
	GCSound: 1,  
	GCVolume: 100, 
	GCSoundURL: 'https://freesound.org/data/previews/66/66717_931655-lq.mp3', 
	GCTimer: 1, 
	Favicon: 1, 
	FortuneNotification: 0,
	FortuneFlash: 1, 
	FortuneSound: 1,  
	FortuneVolume: 100, 
	FortuneSoundURL: 'https://freesound.org/data/previews/174/174027_3242494-lq.mp3',
	SeaNotification: 0,
	SeaFlash: 1, 
	SeaSound: 1,  
	SeaVolume: 100, 
	SeaSoundURL: 'https://www.freesound.org/data/previews/121/121099_2193266-lq.mp3', 
	GardFlash: 1, 
	GardSound: 1,  
	GardVolume: 100, 
	GardSoundURL: 'https://freesound.org/data/previews/103/103046_861714-lq.mp3', 
	MagicNotification: 0,
	MagicFlash: 1, 
	MagicSound: 1,  
	MagicVolume: 100, 
	MagicSoundURL: 'https://freesound.org/data/previews/221/221683_1015240-lq.mp3',
	WrinklerNotification: 0,
	WrinklerFlash: 1, 
	WrinklerSound: 1,  
	WrinklerVolume: 100, 
	WrinklerSoundURL: 'https://freesound.org/data/previews/124/124186_8043-lq.mp3', 
	WrinklerMaxNotification: 0,
	WrinklerMaxFlash: 1, 
	WrinklerMaxSound: 1,  
	WrinklerMaxVolume: 100, 
	WrinklerMaxSoundURL: 'https://freesound.org/data/previews/152/152743_15663-lq.mp3', 
	Title: 1, 
	TooltipBuildUp: 1, 
	TooltipAmor: 0, 
	ToolWarnLucky: 1,
	ToolWarnConjure: 1, 
	ToolWarnPos: 1, 
	TooltipGrim:1, 
	ToolWrink: 1, 
	TooltipLump: 1,
	DragonAuraInfo: 1,
	Stats: 1, 
	MissingUpgrades: 0,
	UpStats: 1, 
	TimeFormat: 0, 
	DetailedTime: 1, 
	GrimoireBar: 1, 
	Scale: 2, 
	OptionsPref: {BarsColors: 1, Calculation: 1, Notification: 1, Tooltip: 1, Statistics: 1, Other: 1}, 
	StatsPref: {Lucky: 1, Conjure: 1, Chain: 1, Prestige: 1, Wrink: 1, Sea: 1, Misc: 1}, 
	Colors : {Blue: '#4bb8f0', Green: '#00ff00', Yellow: '#ffff00', Orange: '#ff7f00', Red: '#ff0000', Purple: '#ff00ff', Gray: '#b3b3b3', Pink: '#ff1493', Brown: '#8b4513'},
	SortBuildings: 0,
	SortUpgrades: 0
};
CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '2.031';
CM.VersionMinor = '2';

/*******
 * Sim *
 *******/

CM.Sim.BuildingGetPrice = function(build, basePrice, start, free, increase) {
	/*var price=0;
	for (var i = Math.max(0 , start); i < Math.max(0, start + increase); i++) {
		price += basePrice * Math.pow(Game.priceIncrease, Math.max(0, i - free));
	}
	if (Game.Has('Season savings')) price *= 0.99;
	if (Game.Has('Santa\'s dominion')) price *= 0.99;
	if (Game.Has('Faberge egg')) price *= 0.99;
	if (Game.Has('Divine discount')) price *= 0.99;
	if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
	return Math.ceil(price);*/

	var moni = 0;
	for (var i = 0; i < increase; i++) {
		var price = basePrice * Math.pow(Game.priceIncrease, Math.max(0, start - free));
		price = Game.modifyBuildingPrice(build, price);
		price = Math.ceil(price);
		moni += price;
		start++;
	}
	return moni;
}

CM.Sim.BuildingSell = function(build, basePrice, start, free, amount, noSim) {
	/*var price=0;
	for (var i = Math.max(0, start - amount); i < Math.max(0, start); i++) {
		price += basePrice * Math.pow(Game.priceIncrease, Math.max(0, i - free));
	}
	if (Game.Has('Season savings')) price*=0.99;
	if (Game.Has('Santa\'s dominion')) price*=0.99;
	if (Game.Has('Faberge egg')) price*=0.99;
	if (Game.Has('Divine discount')) price*=0.99;
	if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
	if (Game.hasAura('Earth Shatterer') || emuAura) {
		price *= 0.85;
	}
	else {
		price *= 0.5;
	}
	return Math.ceil(price);*/

	// Calculate money gains from selling buildings
	// If noSim is set, use Game methods to compute price instead of Sim ones.
	noSim = typeof noSim === "undefined" ? 0 : noSim;
	var moni = 0;
	if (amount == -1) amount = start;
	if (!amount) amount = Game.buyBulk;
	for (var i = 0; i < amount; i++) {
		var price = basePrice * Math.pow(Game.priceIncrease, Math.max(0, start - free));
		price = noSim ? Game.modifyBuildingPrice(build, price) : CM.Sim.modifyBuildingPrice(build, price);
		price = Math.ceil(price);
		var giveBack = noSim ? build.getSellMultiplier() : CM.Sim.getSellMultiplier();
		price = Math.floor(price * giveBack);
		if (start > 0) {
			moni += price;
			start--;
		}
	}
	return moni;
}

CM.Sim.Has = function(what) {
	var it = CM.Sim.Upgrades[what];
	if (Game.ascensionMode == 1 && (it.pool == 'prestige' || it.tier == 'fortune')) return 0;
	return (it ? it.bought : 0);
}


CM.Sim.Win = function(what) {
	if (CM.Sim.Achievements[what]) {
		if (CM.Sim.Achievements[what].won == 0) {
			CM.Sim.Achievements[what].won = 1;
			if (Game.Achievements[what].pool != 'shadow') CM.Sim.AchievementsOwned++;
		}
	}
}

eval('CM.Sim.HasAchiev = ' + Game.HasAchiev.toString().split('Game').join('CM.Sim'));

eval('CM.Sim.GetHeavenlyMultiplier = ' + Game.GetHeavenlyMultiplier.toString().split('Game.Has').join('CM.Sim.Has').split('Game.hasAura').join('CM.Sim.hasAura').split('Game.auraMult').join('CM.Sim.auraMult'));

// Check for Pantheon Auras
CM.Sim.hasAura = function(what) {
	if (Game.dragonAuras[CM.Sim.dragonAura].name == what || Game.dragonAuras[CM.Sim.dragonAura2].name == what)
		return true;
	else
		return false;
}

// Check if multiplier auras are present
// Used as CM.Sim.auraMult('Aura') * mult, i.e. CM.Sim.auraMult('Dragon God) * 0.05
CM.Sim.auraMult = function(what) {
	var n = 0;
	if (Game.dragonAuras[CM.Sim.dragonAura].name == what || Game.dragonAuras[CM.Sim.dragonAura2].name == what)
		n = 1;
	if (Game.dragonAuras[CM.Sim.dragonAura].name == 'Reality Bending' || Game.dragonAuras[CM.Sim.dragonAura2].name == 'Reality Bending')
		n += 0.1;
	return n;
}

CM.Sim.hasGod=function(what) {
	var possibleGods = CM.Sim.Objects.Temple.minigame.gods
	var god=possibleGods[what];
	for (var i=0;i<3;i++)
	{
		if (CM.Sim.Objects.Temple.minigame.slot[i]==god.id) return (i+1);
	}
	return false;
}

CM.Sim.eff = function(name) {
	if (typeof CM.Sim.effs[name]==='undefined') {
		CM.Sim.effs[name] = 1
		return CM.Sim.effs[name]
	}
	else {
		return CM.Sim.effs[name];
	}
}

eval('CM.Sim.GetTieredCpsMult = ' + Game.GetTieredCpsMult.toString()
	.split('Game.Has').join('CM.Sim.Has')
	.split('me.tieredUpgrades').join('Game.Objects[me.name].tieredUpgrades')
	.split('me.synergies').join('Game.Objects[me.name].synergies')
	.split('syn.buildingTie1.amount').join('CM.Sim.Objects[syn.buildingTie1.name].amount')
	.split('syn.buildingTie2.amount').join('CM.Sim.Objects[syn.buildingTie2.name].amount')
	.split('me.grandma').join('Game.Objects[me.name].grandma')
	.split('me.id').join('Game.Objects[me.name].id')
	.split('Game.Objects[\'Grandma\']').join('CM.Sim.Objects[\'Grandma\']')
	.split('me.fortune').join('Game.Objects[me.name].fortune')
);

CM.Sim.getCPSBuffMult = function() {
	var mult = 1;
	for (var i in Game.buffs) {
		if (typeof Game.buffs[i].multCpS != 'undefined') mult *= Game.buffs[i].multCpS;
	}
	return mult;
}

/**
 * Constructs an object with the static properties of a building,
 * but with a 'cps' method changed to use 'CM.Sim.Has' instead of 'Game.Has'
 * (and similar to 'hasAura', 'Objects', 'GetTieredCpsMult' and 'auraMult').
 *
 * The dynamic properties of the building,
 * namely level and amount owned,
 * are set by CM.Sim.CopyData.
 */
CM.Sim.InitialBuildingData = function(buildingName) {
	var me = Game.Objects[buildingName];
	var you = {};
	eval('you.cps = ' + me.cps.toString()
		.split('Game.Has').join('CM.Sim.Has')
		.split('Game.hasAura').join('CM.Sim.hasAura')
		.split('Game.Objects').join('CM.Sim.Objects')
		.split('Game.GetTieredCpsMult').join('CM.Sim.GetTieredCpsMult')
		.split('Game.auraMult').join('CM.Sim.auraMult')
	);
	// Below is needed for above eval!
	you.baseCps = me.baseCps;
	you.name = me.name;
	return you;
}

/**
 *  Similar to the previous function, but for upgrades.
 * Note: currently no static data is used by Cookie Monster,
 * so this function just returns an empty object.
 */
CM.Sim.InitUpgrade = function(upgradeName) {
	var me = Game.Upgrades[upgradeName];
	var you = {};
	you.pool = me.pool;
	you.name = me.name;
	return you;
}

/**
 * Similar to the previous function, but for achievements.
 * Note: currently no static data is used by Cookie Monster,
 * so this function just returns an empty object.
 */
CM.Sim.InitAchievement = function(achievementName) {
	return {};
}

CM.Sim.InitData = function() {
	// Buildings
	CM.Sim.Objects = [];
	for (var i in Game.Objects) {
		CM.Sim.Objects[i] = CM.Sim.InitialBuildingData(i);
	}

	// Upgrades
	CM.Sim.Upgrades = [];
	for (var i in Game.Upgrades) {
		CM.Sim.Upgrades[i] = CM.Sim.InitUpgrade(i);
	}

	// Achievements
	CM.Sim.Achievements = [];
	for (var i in Game.Achievements) {
		CM.Sim.Achievements[i] = CM.Sim.InitAchievement(i);
	}

	// Auras
	CM.Cache.CacheDragonAuras();
}

CM.Sim.CopyData = function() {
	// Other variables
	CM.Sim.UpgradesOwned = Game.UpgradesOwned;
	CM.Sim.pledges = Game.pledges;
	CM.Sim.AchievementsOwned = Game.AchievementsOwned;
	CM.Sim.heavenlyPower = Game.heavenlyPower; // Unneeded? > Might be modded
	CM.Sim.prestige = Game.prestige;

	// Buildings
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		var you = CM.Sim.Objects[i];
		if (you == undefined) { // New building!
			you = CM.Sim.Objects[i] = CM.Sim.InitialBuildingData(i);
			CM.Disp.CreateBotBarBuildingColumn(i); // Add new building to the bottom bar
		}
		you.amount = me.amount;
		you.level = me.level;
		you.totalCookies = me.totalCookies;
		you.basePrice = me.basePrice;
		you.free = me.free;
		if (me.minigameLoaded) you.minigameLoaded = me.minigameLoaded; you.minigame = me.minigame;
	}

	// Upgrades
	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		var you = CM.Sim.Upgrades[i];
		if (you == undefined) {
			you = CM.Sim.Upgrades[i] = CM.Sim.InitUpgrade(i);
		}
		you.bought = me.bought;
	}

	// Achievements
	for (var i in Game.Achievements) {
		var me = Game.Achievements[i];
		var you = CM.Sim.Achievements[i];
		if (you == undefined) {
			you = CM.Sim.Achievements[i] = CM.Sim.InitAchievement(i);
		}
		you.won = me.won;
	}

	// Auras
	CM.Cache.CacheDragonAuras();
	CM.Sim.dragonAura = CM.Cache.dragonAura;
	CM.Sim.dragonAura2 = CM.Cache.dragonAura2;
};

CM.Sim.CalculateGains = function() {
	CM.Sim.cookiesPs = 0;
	var mult = 1;
	// Include minigame effects
	var effs={};
	for (var i in Game.Objects) {
		// TODO Store minigames and effects in Cache
		// Include possibility of new/modded building and new/modded minigames
		if (CM.Sim.Objects[i].minigameLoaded && CM.Sim.Objects[i].minigame.effs) {
			var myEffs = CM.Sim.Objects[i].minigame.effs;
			for (var ii in myEffs) {
				if (effs[ii]) effs[ii]*=myEffs[ii];
                else effs[ii]=myEffs[ii];
			}
		}
	}
	CM.Sim.effs = effs;
	
	if (Game.ascensionMode != 1) mult += parseFloat(CM.Sim.prestige) * 0.01 * CM.Sim.heavenlyPower * CM.Sim.GetHeavenlyMultiplier();
	
	mult *= CM.Sim.eff('cps');

	if (CM.Sim.Has('Heralds') && Game.ascensionMode != 1) mult *= 1 + 0.01 * Game.heralds;

	// TODO: Make function call cached function where Game.Has is replaced with CM.Has
	// Related to valentine cookies
	for (var i in Game.cookieUpgrades) {
		var me = Game.cookieUpgrades[i];
		if (CM.Sim.Has(me.name)) {
			mult *= (1 + (typeof(me.power) == 'function' ? me.power(me) : me.power) * 0.01);
		}
	}

	if (CM.Sim.Has('Specialized chocolate chips')) mult *= 1.01;
	if (CM.Sim.Has('Designer cocoa beans')) mult *= 1.02;
	if (CM.Sim.Has('Underworld ovens')) mult *= 1.03;
	if (CM.Sim.Has('Exotic nuts')) mult *= 1.04;
	if (CM.Sim.Has('Arcane sugar')) mult *= 1.05;

	if (CM.Sim.Has('Increased merriness')) mult *= 1.15;
	if (CM.Sim.Has('Improved jolliness')) mult *= 1.15;
	if (CM.Sim.Has('A lump of coal')) mult *= 1.01;
	if (CM.Sim.Has('An itchy sweater')) mult *= 1.01;
	if (CM.Sim.Has('Santa\'s dominion')) mult *= 1.2;

	if (CM.Sim.Has('Fortune #100')) mult *= 1.01;
	if (CM.Sim.Has('Fortune #101')) mult *= 1.07;

	if (CM.Sim.Has('Dragon scale')) mult *= 1.03;

	// Check effect of chosen Gods
	var buildMult = 1;
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		var godLvl = CM.Sim.hasGod('asceticism');
		if (godLvl == 1) mult *= 1.15;
		else if (godLvl == 2) mult *= 1.1;
		else if (godLvl == 3) mult *= 1.05;

		// TODO: What does DateAges do?
		var godLvl = CM.Sim.hasGod('ages');
		if (godLvl == 1) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 3)) * Math.PI * 2);
		else if (godLvl == 2) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 12)) * Math.PI*2);
		else if (godLvl == 3) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 24)) * Math.PI*2);

		var godLvl = CM.Sim.hasGod('decadence');
		if (godLvl == 1) buildMult *= 0.93;
		else if (godLvl == 2) buildMult *= 0.95;
		else if (godLvl == 3) buildMult *= 0.98;

		var godLvl = CM.Sim.hasGod('industry');
		if (godLvl == 1) buildMult *= 1.1;
		else if (godLvl == 2) buildMult *= 1.06;
		else if (godLvl == 3) buildMult *= 1.03;

		var godLvl = CM.Sim.hasGod('labor');
		if (godLvl == 1) buildMult *= 0.97;
		else if (godLvl == 2) buildMult *= 0.98;
		else if (godLvl == 3) buildMult *= 0.99;
	}

	if (CM.Sim.Has('Santa\'s legacy')) mult *= 1 + (Game.santaLevel + 1) * 0.03;

	var milkProgress = CM.Sim.AchievementsOwned / 25;
	var milkMult = 1;
	if (CM.Sim.Has('Santa\'s milk and cookies')) milkMult *= 1.05;
	//if (CM.Sim.hasAura('Breath of Milk')) milkMult *= 1.05;
	milkMult *= 1 + CM.Sim.auraMult('Breath of Milk') * 0.05;
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		var godLvl = CM.Sim.hasGod('mother');
		if (godLvl == 1) milkMult *= 1.1;
		else if (godLvl == 2) milkMult *= 1.05;
		else if (godLvl == 3) milkMult *= 1.03;
	}
	// TODO Store minigame buffs?
	milkMult *= CM.Sim.eff('milk');

	var catMult = 1;

	if (CM.Sim.Has('Kitten helpers')) catMult *= (1 + milkProgress * 0.1 * milkMult);
	if (CM.Sim.Has('Kitten workers')) catMult *= (1 + milkProgress * 0.125 * milkMult);
	if (CM.Sim.Has('Kitten engineers')) catMult *= (1 + milkProgress * 0.15 * milkMult);
	if (CM.Sim.Has('Kitten overseers')) catMult *= (1 + milkProgress * 0.175 * milkMult);
	if (CM.Sim.Has('Kitten managers')) catMult *= (1 + milkProgress * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten accountants')) catMult *= (1 + milkProgress * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten specialists')) catMult *= (1 + milkProgress * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten experts')) catMult *= (1 + milkProgress * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten consultants')) catMult *= (1 + milkProgress * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten assistants to the regional manager')) catMult *= (1 + milkProgress * 0.175 * milkMult);
	if (CM.Sim.Has('Kitten marketeers')) catMult *= (1 + milkProgress * 0.15 * milkMult);
	if (CM.Sim.Has('Kitten analysts')) catMult *= (1 + milkProgress * 0.125 * milkMult);
	if (CM.Sim.Has('Kitten executives')) catMult *= (1 + milkProgress * 0.115 * milkMult);
	if (CM.Sim.Has('Kitten angels')) catMult *= (1 + milkProgress * 0.1 * milkMult);
	if (CM.Sim.Has('Fortune #103')) catMult *= (1 + milkProgress * 0.05 * milkMult);

	for (var i in CM.Sim.Objects) {
		var me = CM.Sim.Objects[i];
		var storedCps = (typeof(me.cps) == 'function' ? me.cps(me) : me.cps);
		if (Game.ascensionMode != 1) storedCps *= (1 + me.level * 0.01) * buildMult;
		if (me.name == "Grandma" && CM.Sim.Has('Milkhelp&reg; lactose intolerance relief tablets')) storedCps *= 1 + 0.05 * milkProgress * milkMult;
		CM.Sim.cookiesPs += me.amount * storedCps;
	}

	if (CM.Sim.Has('"egg"')) CM.Sim.cookiesPs += 9;//"egg"

	mult *= catMult;

	var eggMult = 1;
	if (CM.Sim.Has('Chicken egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Duck egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Turkey egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Quail egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Robin egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Ostrich egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Cassowary egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Salmon roe')) eggMult *= 1.01;
	if (CM.Sim.Has('Frogspawn')) eggMult *= 1.01;
	if (CM.Sim.Has('Shark egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Turtle egg')) eggMult *= 1.01;
	if (CM.Sim.Has('Ant larva')) eggMult *= 1.01;
	if (CM.Sim.Has('Century egg')) {
		// The boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day = Math.floor((CM.Sim.DateCentury - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day, 100);
		CM.Cache.CentEgg = 1 + (1 - Math.pow(1 - day / 100, 3)) * 0.1;
		eggMult *= CM.Cache.CentEgg;
	}
	mult *= eggMult;

	// TODO Store lumps?
	if (CM.Sim.Has('Sugar baking')) mult *= (1 + Math.min(100, Game.lumps) * 0.01);

	//if (CM.Sim.hasAura('Radiant Appetite')) mult *= 2;
	mult *= 1 + CM.Sim.auraMult('Radiant Appetite');

	var rawCookiesPs = CM.Sim.cookiesPs * mult;
	for (var i in Game.CpsAchievements) {
		if (rawCookiesPs >= Game.CpsAchievements[i].threshold) CM.Sim.Win(Game.CpsAchievements[i].name);
	}

	CM.Sim.cookiesPsRaw = rawCookiesPs;

	var n = Game.shimmerTypes['golden'].n;
	var auraMult = CM.Sim.auraMult('Dragon\'s Fortune');
	for (var i = 0; i < n; i++){
		mult *= 1 + auraMult * 1.23;
	}

	var name = Game.bakeryName.toLowerCase();
	if (name == 'orteil') mult *= 0.99;
	else if (name == 'ortiel') mult *= 0.98;

	// TODO: Move CalcWink option and calculation here from CM.Disp

	if (CM.Sim.Has('Elder Covenant')) mult *= 0.95;

	if (CM.Sim.Has('Golden switch [off]')) {
		var goldenSwitchMult = 1.5;
		if (CM.Sim.Has('Residual luck')) {
			var upgrades = Game.goldenCookieUpgrades;
			for (var i in upgrades) {
				if (CM.Sim.Has(upgrades[i])) goldenSwitchMult += 0.1;
			}
		}
		mult *= goldenSwitchMult;
	}
	if (CM.Sim.Has('Shimmering veil [off]')) {
		var veilMult = 0.5;
		if (CM.Sim.Has('Reinforced membrane')) veilMult += 0.1;
		mult *= 1 + veilMult;
	}

	// Removed debug upgrades

	// TODO: Check if this is handled correctly
	CM.Sim.cookiesPs = Game.runModHookOnValue('cps', CM.Sim.cookiesPs);
	
	mult *= CM.Sim.getCPSBuffMult();

	CM.Sim.cookiesPs *= mult;

	// if (Game.hasBuff('Cursed finger')) Game.cookiesPs = 0;
};

CM.Sim.CheckOtherAchiev = function() {
	var grandmas = 0;
	for (var i in Game.GrandmaSynergies) {
		if (CM.Sim.Has(Game.GrandmaSynergies[i])) grandmas++;
	}
	if (!CM.Sim.HasAchiev('Elder') && grandmas >= 7) CM.Sim.Win('Elder');
	if (!CM.Sim.HasAchiev('Veteran') && grandmas >= 14) CM.Sim.Win('Veteran');

	var buildingsOwned = 0;
	var mathematician = 1;
	var base10 = 1;
	var minAmount = 100000;
	for (var i in CM.Sim.Objects) {
		buildingsOwned += CM.Sim.Objects[i].amount;
		minAmount = Math.min(CM.Sim.Objects[i].amount, minAmount);
		if (!CM.Sim.HasAchiev('Mathematician')) {
			if (CM.Sim.Objects[i].amount < Math.min(128, Math.pow(2, (Game.ObjectsById.length - Game.Objects[i].id) - 1))) mathematician = 0;
		}
		if (!CM.Sim.HasAchiev('Base 10')) {
			if (CM.Sim.Objects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id) * 10) base10 = 0;
		}
	}
	if (minAmount >= 1) CM.Sim.Win('One with everything');
	if (mathematician == 1) CM.Sim.Win('Mathematician');
	if (base10 == 1) CM.Sim.Win('Base 10');
	if (minAmount >= 100) CM.Sim.Win('Centennial');
	if (minAmount >= 150) CM.Sim.Win('Centennial and a half');
	if (minAmount >= 200) CM.Sim.Win('Bicentennial');
	if (minAmount >= 250) CM.Sim.Win('Bicentennial and a half');
	if (minAmount >= 300) CM.Sim.Win('Tricentennial');
	if (minAmount >= 350) CM.Sim.Win('Tricentennial and a half');
	if (minAmount >= 400) CM.Sim.Win('Quadricentennial');
	if (minAmount >= 450) CM.Sim.Win('Quadricentennial and a half');
	if (minAmount >= 500) CM.Sim.Win('Quincentennial');
	if (minAmount >= 550) CM.Sim.Win('Quincentennial and a half');
	if (minAmount >= 600) CM.Sim.Win('Sexcentennial');

	if (buildingsOwned >= 100) CM.Sim.Win('Builder');
	if (buildingsOwned >= 500) CM.Sim.Win('Architect');
	if (buildingsOwned >= 1000) CM.Sim.Win('Engineer');
	if (buildingsOwned >= 2000) CM.Sim.Win('Lord of Constructs');
	if (buildingsOwned >= 4000) CM.Sim.Win('Grand design');
	if (buildingsOwned >= 8000) CM.Sim.Win('Ecumenopolis');

	if (CM.Sim.UpgradesOwned >= 20) CM.Sim.Win('Enhancer');
	if (CM.Sim.UpgradesOwned >= 50) CM.Sim.Win('Augmenter');
	if (CM.Sim.UpgradesOwned >= 100) CM.Sim.Win('Upgrader');
	if (CM.Sim.UpgradesOwned >= 200) CM.Sim.Win('Lord of Progress');
	if (CM.Sim.UpgradesOwned >= 300) CM.Sim.Win('The full picture');
	if (CM.Sim.UpgradesOwned >= 400) CM.Sim.Win('When there\'s nothing left to add');

	if (buildingsOwned >= 4000 && CM.Sim.UpgradesOwned >= 300) CM.Sim.Win('Polymath');
	if (buildingsOwned >= 8000 && CM.Sim.UpgradesOwned >= 400) CM.Sim.Win('Renaissance baker');

	if (CM.Sim.Objects['Cursor'].amount + CM.Sim.Objects['Grandma'].amount >= 777) CM.Sim.Win('The elder scrolls');

	var hasAllHalloCook = true;
	for (var i in CM.Data.HalloCookies) {
		if (!CM.Sim.Has(CM.Data.HalloCookies[i])) hasAllHalloCook = false;
	}
	if (hasAllHalloCook) CM.Sim.Win('Spooky cookies');

	var hasAllChristCook = true;
	for (var i in CM.Data.ChristCookies) {
		if (!CM.Sim.Has(CM.Data.ChristCookies[i])) hasAllChristCook = false;
	}
	if (hasAllChristCook) CM.Sim.Win('Let it snow');

	if (CM.Sim.Has('Fortune cookies')) {
		var list = Game.Tiers['fortune'].upgrades;
		var fortunes = 0;
		for (var i in list) {
			if (CM.Sim.Has(list[i].name)) fortunes++;
		}
		if (fortunes >= list.length) CM.Sim.Win('O Fortuna');
	}
}

CM.Sim.BuyBuildings = function(amount, target) {
	CM.Cache[target] = [];
	for (var i in Game.Objects) {
		CM.Sim.CopyData();
		var me = CM.Sim.Objects[i];
		me.amount += amount;

		if (i == 'Cursor') {
			if (me.amount >= 1) CM.Sim.Win('Click');
			if (me.amount >= 2) CM.Sim.Win('Double-click');
			if (me.amount >= 50) CM.Sim.Win('Mouse wheel');
			if (me.amount >= 100) CM.Sim.Win('Of Mice and Men');
			if (me.amount >= 200) CM.Sim.Win('The Digital');
			if (me.amount >= 300) CM.Sim.Win('Extreme polydactyly');
			if (me.amount >= 400) CM.Sim.Win('Dr. T');
			if (me.amount >= 500) CM.Sim.Win('Thumbs, phalanges, metacarpals');
			if (me.amount >= 600) CM.Sim.Win('With her finger and her thumb');
			if (me.amount >= 700) CM.Sim.Win('Gotta hand it to you');
			if (me.amount >= 800) CM.Sim.Win('The devil\'s workshop');
		}
		else {
			for (var j in Game.Objects[me.name].tieredAchievs) {
				if (me.amount >= Game.Tiers[Game.Objects[me.name].tieredAchievs[j].tier].achievUnlock)
					CM.Sim.Win(Game.Objects[me.name].tieredAchievs[j].name);
			}
		}

		var lastAchievementsOwned = CM.Sim.AchievementsOwned;

		CM.Sim.CalculateGains();

		CM.Sim.CheckOtherAchiev();

		if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
			CM.Sim.CalculateGains();
		}

		CM.Cache[target][i] = {};
		CM.Cache[target][i].bonus = CM.Sim.cookiesPs - Game.cookiesPs;
		if (amount != 1) {
			CM.Cache.DoRemakeBuildPrices = 1;
		}
	}
}

CM.Sim.BuyUpgrades = function() {
	CM.Cache.Upgrades = [];
	for (var i in Game.Upgrades) {
		if (Game.Upgrades[i].pool == 'toggle' || (Game.Upgrades[i].bought == 0 && Game.Upgrades[i].unlocked && Game.Upgrades[i].pool != 'prestige')) {
			CM.Sim.CopyData();
			var me = CM.Sim.Upgrades[i];
			me.bought = 1;
			if (Game.CountsAsUpgradeOwned(Game.Upgrades[i].pool)) CM.Sim.UpgradesOwned++;

			if (i == 'Elder Pledge') {
				CM.Sim.pledges++;
				if (CM.Sim.pledges > 0) CM.Sim.Win('Elder nap');
				if (CM.Sim.pledges >= 5) CM.Sim.Win('Elder slumber');
			}
			else if (i == 'Elder Covenant') {
				CM.Sim.Win('Elder calm')
			}
			else if (i == 'Prism heart biscuits') {
				CM.Sim.Win('Lovely cookies');
			}
			else if (i == 'Heavenly key') {
				CM.Sim.Win('Wholesome');
			}

			var lastAchievementsOwned = CM.Sim.AchievementsOwned;

			CM.Sim.CalculateGains();

			CM.Sim.CheckOtherAchiev();

			if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
				CM.Sim.CalculateGains();
			}

			CM.Cache.Upgrades[i] = {};
			CM.Cache.Upgrades[i].bonus = CM.Sim.cookiesPs - Game.cookiesPs;
		}
	}
}

/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}			aura										The number of the aura currently selected by the mouse/user
 * @returns {[number, number]} 	[CM.Sim.cookiesPs - Game.cookiesPs, price]	The bonus cps and the price of the change
 */
CM.Sim.CalculateChangeAura = function(aura) {
	CM.Sim.CopyData();

	// Check if aura being changed is first or second aura
	var auraToBeChanged = l('promptContent').children[0].innerHTML.includes("secondary")
	if (auraToBeChanged) CM.Sim.dragonAura2 = aura;
	else CM.Sim.dragonAura = aura;

	// Sell highest building but only if aura is different
	if (CM.Sim.dragonAura != CM.Cache.dragonAura || CM.Sim.dragonAura2 != CM.Cache.dragonAura2) {
		for (var i = Game.ObjectsById.length; i > -1, --i;) {
			if (Game.ObjectsById[i].amount > 0) {	
				var highestBuilding = CM.Sim.Objects[Game.ObjectsById[i].name].name;
				CM.Sim.Objects[highestBuilding].amount -=1;
				CM.Sim.buildingsOwned -= 1;
				break
			}
		}
		// This calculates price of highest building
		var price = CM.Sim.Objects[highestBuilding].basePrice * Math.pow(Game.priceIncrease, Math.max(0, CM.Sim.Objects[highestBuilding].amount - 1 -CM.Sim.Objects[highestBuilding].free));
		price = Game.modifyBuildingPrice(CM.Sim.Objects[highestBuilding], price);
		price = Math.ceil(price);
	} else var price = 0;

	var lastAchievementsOwned = CM.Sim.AchievementsOwned;
	CM.Sim.CalculateGains();

	CM.Sim.CheckOtherAchiev();
	if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}
	return [CM.Sim.cookiesPs - Game.cookiesPs, price]
}

CM.Sim.NoGoldSwitchCookiesPS = function() {
	if (Game.Has('Golden switch [off]')) {
		CM.Sim.CopyData();
		CM.Sim.Upgrades['Golden switch [off]'].bought = 0;
		CM.Sim.CalculateGains();
		CM.Cache.NoGoldSwitchCookiesPS = CM.Sim.cookiesPs;
	}
	else CM.Cache.NoGoldSwitchCookiesPS = Game.cookiesPs;
}

CM.Sim.ResetBonus = function(possiblePresMax) {
	var lastAchievementsOwned = -1;

	// Calculate CPS with all Heavenly upgrades
	var curCPS = Game.cookiesPs;

	CM.Sim.CopyData();

	if (CM.Sim.Upgrades['Heavenly key'].bought == 0) {
		CM.Sim.Upgrades['Heavenly chip secret'].bought = 1;
		CM.Sim.Upgrades['Heavenly cookie stand'].bought = 1;
		CM.Sim.Upgrades['Heavenly bakery'].bought = 1;
		CM.Sim.Upgrades['Heavenly confectionery'].bought = 1;
		CM.Sim.Upgrades['Heavenly key'].bought = 1;

		CM.Sim.CalculateGains();

		curCPS = CM.Sim.cookiesPs;

		CM.Sim.CopyData();
	}

	if (CM.Cache.RealCookiesEarned >= 1000000) CM.Sim.Win('Sacrifice');
	if (CM.Cache.RealCookiesEarned >= 1000000000) CM.Sim.Win('Oblivion');
	if (CM.Cache.RealCookiesEarned >= 1000000000000) CM.Sim.Win('From scratch');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000) CM.Sim.Win('Nihilism');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000) CM.Sim.Win('Dematerialize');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000) CM.Sim.Win('Nil zero zilch');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000) CM.Sim.Win('Transcendence');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000) CM.Sim.Win('Obliterate');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000) CM.Sim.Win('Negative void');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000) CM.Sim.Win('To crumbs, you say?');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000000) CM.Sim.Win('You get nothing');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000000000) CM.Sim.Win('Humble rebeginnings');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000000000000) CM.Sim.Win('The end of the world');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000000000000000) CM.Sim.Win('Oh, you\'re back');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000000000000000000) CM.Sim.Win('Lazarus');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000000000000000000000) CM.Sim.Win('Smurf account');
	if (CM.Cache.RealCookiesEarned >= 1000000000000000000000000000000000000000000000000000000) CM.Sim.Win('If at first you don\'t succeed');

	CM.Sim.Upgrades['Heavenly chip secret'].bought = 1;
	CM.Sim.Upgrades['Heavenly cookie stand'].bought = 1;
	CM.Sim.Upgrades['Heavenly bakery'].bought = 1;
	CM.Sim.Upgrades['Heavenly confectionery'].bought = 1;
	CM.Sim.Upgrades['Heavenly key'].bought = 1;

	CM.Sim.prestige = possiblePresMax;

	lastAchievementsOwned = CM.Sim.AchievementsOwned;

	CM.Sim.CalculateGains();

	CM.Sim.CheckOtherAchiev();

	if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}

	var ResetCPS = CM.Sim.cookiesPs - curCPS

	// Reset Pretige level after calculation
	CM.Sim.prestige = Game.prestige;

	return (ResetCPS);
}

CM.Sim.getSellMultiplier = function() {
	var giveBack = 0.25;
	giveBack *= 1 + CM.Sim.auraMult('Earth Shatterer');
	return giveBack;
}

CM.Sim.modifyBuildingPrice = function(building,price) {	
	if (CM.Sim.Has('Season savings')) price *= 0.99;
	if (CM.Sim.Has('Santa\'s dominion')) price *= 0.99;
	if (CM.Sim.Has('Faberge egg')) price *= 0.99;
	if (CM.Sim.Has('Divine discount')) price *= 0.99;
	if (CM.Sim.Has('Fortune #100')) price *= 0.99;
	//if (CM.Sim.hasAura('Fierce Hoarder')) price *= 0.98;
	price *= 1 - CM.Sim.auraMult('Fierce Hoarder') * 0.02;
	if (Game.hasBuff('Everything must go')) price *= 0.95;
	if (Game.hasBuff('Crafty pixies')) price *= 0.98;
	if (Game.hasBuff('Nasty goblins')) price *= 1.02;
	if (building.fortune && CM.Sim.Has(building.fortune.name)) price *= 0.93;
	price *= CM.Sim.eff('buildingCost');
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		var godLvl = CM.Sim.hasGod('creation');
		if (godLvl == 1) price *= 0.93;
		else if (godLvl == 2) price *= 0.95;
		else if (godLvl == 3) price *= 0.98;
	}
	return price;
}

CM.Sim.SellBuildingsForChoEgg = function() {
	var sellTotal = 0;

	CM.Sim.CopyData();
	
	// Change auras to Earth Shatterer + Reality bending to optimize money made by selling
	var buildingsToSacrifice = 2;
	if (CM.Sim.dragonAura === 5 || CM.Sim.dragonAura === 18) {
		--buildingsToSacrifice;
	}
	if (CM.Sim.dragonAura2 === 5 || CM.Sim.dragonAura2 === 18) {
		--buildingsToSacrifice;
	}
	CM.Sim.dragonAura = 5;
	CM.Sim.dragonAura2 = 18;
	// Sacrifice highest buildings for the aura switch
	for (var i = 0; i < buildingsToSacrifice; ++i) {
		var highestBuilding = 0;
		for (var j in CM.Sim.Objects) {
			if (CM.Sim.Objects[j].amount > 0) {	
				highestBuilding = CM.Sim.Objects[j];
			}
		}
		highestBuilding.amount--;
		CM.Sim.buildingsOwned--;
	}

	// Get money made by selling all remaining buildings
	for (var i in CM.Sim.Objects) {
		var me = CM.Sim.Objects[i];
		sellTotal += CM.Sim.BuildingSell(Game.Objects[me.name], Game.Objects[i].basePrice, me.amount, Game.Objects[i].free, me.amount);
	}

	// CM.Sim.CalculateGains();

	// CM.Sim.CheckOtherAchiev();

	// if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
	// 	CM.Sim.CalculateGains();
	// }

	// CM.Cache.DoRemakeBuildPrices = 1;

	return sellTotal;
}
/**********
 * Footer *
 **********/

if (!CM.isRunning) {
    CM.Init();
    CM.isRunning = 1
}

