/*********
 * Cache *
 *********/
 
CM.Cache.NextNumber = function(base) {
	var count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
	while (base == base + count) {
		count = CM.Cache.NextNumber(count);
	}
	return (base + count);
}

CM.Cache.RemakeBuildingsPrices = function() {
	for (var i in Game.Objects) {
		CM.Cache.Objects10[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 10);
		CM.Cache.Objects100[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 100);
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
	for (var i in CM.Cache.Objects) {
		//CM.Cache.Objects[i].pp = Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus;
		CM.Cache.Objects[i].pp = (Math.max(Game.Objects[i].getPrice() - Game.cookies, 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus);
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
		CM.Cache.Upgrades[i].pp = (Math.max(Game.Upgrades[i].getPrice() - Game.cookies, 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		if (isNaN(CM.Cache.Upgrades[i].pp)) CM.Cache.Upgrades[i].pp = 'Infinity';
		var color = '';
		if (CM.Cache.Upgrades[i].pp <= 0 || CM.Cache.Upgrades[i].pp == 'Infinity') color = CM.Disp.colorGray;
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
		CM.Cache[target][i].pp = (Math.max(CM.Cache[target][i].price - Game.cookies, 0) / Game.cookiesPs) + (CM.Cache[target][i].price / CM.Cache[target][i].bonus);
		var color = '';
		if (CM.Cache[target][i].pp <= 0 || CM.Cache[target][i].pp == 'Infinity') color = CM.Disp.colorGray;
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
	if (Game.frenzy > 0) {
		CM.Cache.Lucky /= Game.frenzyPower;
	}
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
	if (Game.frenzy > 0) {
		maxPayout /= Game.frenzyPower;
	}
	
	CM.Cache.ChainReward = CM.Cache.MaxChainMoni(7, maxPayout);
	
	CM.Cache.ChainWrathReward = CM.Cache.MaxChainMoni(6, maxPayout);
	
	if (maxPayout < CM.Cache.ChainReward) {
		CM.Cache.Chain = 0;
	}
	else {
		CM.Cache.Chain = CM.Cache.NextNumber(CM.Cache.ChainReward) / 0.25;
	}
	if (maxPayout < CM.Cache.ChainWrathReward) {
		CM.Cache.Chain = 0;
	}
	else {
		CM.Cache.ChainWrath = CM.Cache.NextNumber(CM.Cache.ChainWrathReward) / 0.25;
	}
	
	CM.Cache.ChainFrenzyReward = CM.Cache.MaxChainMoni(7, maxPayout * 7);
	
	CM.Cache.ChainFrenzyWrathReward = CM.Cache.MaxChainMoni(6, maxPayout * 7);
	
	if ((maxPayout * 7) < CM.Cache.ChainFrenzyReward) {
		CM.Cache.ChainFrenzy = 0;
	}
	else {
		CM.Cache.ChainFrenzy = CM.Cache.NextNumber(CM.Cache.ChainFrenzyReward) / 0.25;
	}
	if ((maxPayout * 7) < CM.Cache.ChainFrenzyWrathReward) {
		CM.Cache.ChainFrenzy = 0;
	}
	else {
		CM.Cache.ChainFrenzyWrath = CM.Cache.NextNumber(CM.Cache.ChainFrenzyWrathReward) / 0.25;
	}
}

CM.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		CM.Cache.SeaSpec = Math.max(25, Game.cookiesPs * 60 * 1);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
}

CM.Cache.RemakeSellForChoEgg = function() {
	if (Game.hasAura('Earth Shatterer') || Game.dragonLevel < 9) {
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			sellTotal += CM.Sim.BuildingSell(me.basePrice, me.amount, me.free, me.amount, 0);
		}
	}
	else {
		var highestBuilding = '';
		for (var i in Game.Objects) {
			if (Game.Objects[i].amount > 0) highestBuilding = i;
		}
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			var amount = 0;
			if (i == highestBuilding) {
				amount = me.amount - 1;
			}
			else {
				amount = me.amount;
			}
			sellTotal += CM.Sim.BuildingSell(me.basePrice, amount, me.free, amount, 1);
		}
	}
	CM.Cache.SellForChoEgg = sellTotal;
}

CM.Cache.min = -1;
CM.Cache.max = -1;
CM.Cache.mid = -1;
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
CM.Cache.HadFierHoard = false;

