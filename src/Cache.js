/*********
 * Cache *
 *********/

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
		if (Game.hasGod) {
			var godLvl = Game.hasGod('scorn');
			if (godLvl == 1) sucked *= 1.15;
			else if (godLvl == 2) sucked *= 1.1;
			else if (godLvl == 3) sucked *= 1.05;
		}
		totalSucked += sucked;
	}
	CM.Cache.WrinkBank = totalSucked;
	CM.Cache.WrinkGodBank = totalSucked;
	if (Game.hasGod) {
		var godLvl = Game.hasGod('scorn');
		if (godLvl == 2) CM.Cache.WrinkGodBank = CM.Cache.WrinkGodBank * 1.15 / 1.1;
		else if (godLvl == 3) CM.Cache.WrinkGodBank = CM.Cache.WrinkGodBank * 1.15 / 1.05;
		else if (godLvl != 1) CM.Cache.WrinkGodBank *= 1.15;
	}
}

CM.Cache.RemakeBuildingsPP = function() {
	CM.Cache.min = -1;
	CM.Cache.max = -1;
	CM.Cache.mid = -1;
	for (var i in CM.Cache.Objects) {
		//CM.Cache.Objects[i].pp = Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus;
		CM.Cache.Objects[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus);
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
}

CM.Cache.RemakeUpgradePP = function() {
	for (var i in CM.Cache.Upgrades) {
		//CM.Cache.Upgrades[i].pp = Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus;
		CM.Cache.Upgrades[i].pp = (Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
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
		CM.Cache[target][i].pp = (Math.max(CM.Cache[target][i].price - (Game.cookies + CM.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (CM.Cache[target][i].price / CM.Cache[target][i].bonus);
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
	// Buildings for 1 amount
	CM.Cache.RemakeBuildingsPP();

	// Upgrades
	CM.Cache.RemakeUpgradePP();

	// Buildings for 10 amount
	CM.Cache.RemakeBuildingsOtherPP(10, 'Objects10');

	// Buildings for 100 amount
	CM.Cache.RemakeBuildingsOtherPP(100, 'Objects100');
}

CM.Cache.RemakeLucky = function() {
	CM.Cache.Lucky = (CM.Cache.NoGoldSwitchCookiesPS * 60 * 15) / 0.15;
	CM.Cache.Lucky /= CM.Sim.getCPSBuffMult();
	CM.Cache.LuckyReward = (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyFrenzy = CM.Cache.Lucky * 7;
	CM.Cache.LuckyRewardFrenzy = (CM.Cache.LuckyFrenzy * 0.15) + 13;
}

CM.Cache.MaxChainMoni = function(digit, maxPayout) {
	var chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	var moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
	var nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	while (nextMoni < maxPayout) {
		chain++;
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	}
	return moni;
}

CM.Cache.RemakeChain = function() {
	var maxPayout = CM.Cache.NoGoldSwitchCookiesPS * 60 * 60 * 6;
	maxPayout /= CM.Sim.getCPSBuffMult();

	CM.Cache.ChainReward = CM.Cache.MaxChainMoni(7, maxPayout);

	CM.Cache.ChainWrathReward = CM.Cache.MaxChainMoni(6, maxPayout);

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

	CM.Cache.ChainFrenzyReward = CM.Cache.MaxChainMoni(7, maxPayout * 7);

	CM.Cache.ChainFrenzyWrathReward = CM.Cache.MaxChainMoni(6, maxPayout * 7);

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
	if (Game.auraMult('Earth Shatterer') == 1.1) {
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			sellTotal += CM.Sim.BuildingSell(me, me.basePrice, me.amount, me.free, me.amount, 0);
		}
	}
	else {
		var highestBuilding = '';
		for (var i in Game.Objects) {
			if (Game.Objects[i].amount > 0) highestBuilding = i;
		}
		var secondHighBuild = '';
		if (Game.auraMult('Earth Shatterer') == 0 && highestBuilding != '') {
			if (Game.Objects[highestBuilding].amount > 1) {
				secondHighBuild = highestBuilding;
			}
			else {
				for (var i in Game.Objects) {
					if (i != highestBuilding && Game.Objects[i].amount > 0) secondHighBuild = i;
				}
			}
		}
		
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			var amount = me.amount;
			if (i == highestBuilding) {
				amount -= 1;
			}
			if (i == secondHighBuild) {
				amount -= 1;
			}
			sellTotal += CM.Sim.BuildingSell(me, me.basePrice, amount, me.free, amount, 1);
		}
	}
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

CM.Cache.min = -1;
CM.Cache.max = -1;
CM.Cache.mid = -1;
CM.Cache.WrinkBank = -1;
CM.Cache.WrinkGodBank = -1;
CM.Cache.NoGoldSwitchCookiesPS = 0;
CM.Cache.Lucky = 0;
CM.Cache.LuckyReward = 0;
CM.Cache.LuckyFrenzy = 0;
CM.Cache.LuckyRewardFrenzy = 0;
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

