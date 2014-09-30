/*********
 * Cache *
 *********/

CM.Cache.RemakeIncome = function() {
	// Simulate Building Buys for 1 amount
	CM.Sim.BuyBuildings(1, 'Objects');

	// Simulate Upgrade Buys
	CM.Sim.BuyUpgrades();
	
	// Simulate Building Buys for 10 amount
	CM.Sim.BuyBuildings(10, 'Objects10');
}

CM.Cache.RemakeBuildingsBCI = function() {
	CM.Disp.min = -1;
	CM.Disp.max = -1;
	CM.Disp.mid = -1;
	for (var i in CM.Cache.Objects) {
		CM.Cache.Objects[i].bci = Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus;
		if (CM.Disp.min == -1 || CM.Cache.Objects[i].bci < CM.Disp.min) CM.Disp.min = CM.Cache.Objects[i].bci;
		if (CM.Disp.max == -1 || CM.Cache.Objects[i].bci > CM.Disp.max) CM.Disp.max = CM.Cache.Objects[i].bci;
	}
	CM.Disp.mid = ((CM.Disp.max - CM.Disp.min) / 2) + CM.Disp.min;
	for (var i in CM.Cache.Objects) {
		var color = '';
		if (CM.Cache.Objects[i].bci == CM.Disp.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Objects[i].bci == CM.Disp.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Objects[i].bci > CM.Disp.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Objects[i].color = color;
	}
}

CM.Cache.RemakeUpgradeBCI = function() {
	for (var i in CM.Cache.Upgrades) {
		CM.Cache.Upgrades[i].bci = Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus;
		var color = '';
		if (CM.Cache.Upgrades[i].bci <= 0 || CM.Cache.Upgrades[i].bci == 'Infinity') color = CM.Disp.colorGray;
		else if (CM.Cache.Upgrades[i].bci < CM.Disp.min) color = CM.Disp.colorBlue;
		else if (CM.Cache.Upgrades[i].bci == CM.Disp.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Upgrades[i].bci == CM.Disp.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Upgrades[i].bci > CM.Disp.max) color = CM.Disp.colorPurple;
		else if (CM.Cache.Upgrades[i].bci > CM.Disp.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Upgrades[i].color = color;
	}
}

CM.Cache.RemakeBuildings10BCI = function() {
	for (var i in CM.Cache.Objects10) {
		CM.Cache.Objects10[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, 10);
		CM.Cache.Objects10[i].bci = CM.Cache.Objects10[i].price / CM.Cache.Objects10[i].bonus;
		var color = '';
		if (CM.Cache.Objects10[i].bci <= 0 || CM.Cache.Objects10[i].bci == 'Infinity') color = CM.Disp.colorGray;
		else if (CM.Cache.Objects10[i].bci < CM.Disp.min) color = CM.Disp.colorBlue;
		else if (CM.Cache.Objects10[i].bci == CM.Disp.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Objects10[i].bci == CM.Disp.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Objects10[i].bci > CM.Disp.max) color = CM.Disp.colorPurple;
		else if (CM.Cache.Objects10[i].bci > CM.Disp.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Objects10[i].color = color;
	}
}

CM.Cache.RemakeBCI = function() {
	// Buildings for 1 amount
	CM.Cache.RemakeBuildingsBCI();
	
	// Upgrades
	CM.Cache.RemakeUpgradeBCI();
	
	// Buildings for 10 amount
	CM.Cache.RemakeBuildings10BCI();
}

CM.Cache.RemakeLucky = function() {
	CM.Cache.Lucky = (Game.cookiesPs * 60 * 20) / 0.1;
	if (Game.frenzy > 0) {
		CM.Cache.Lucky /= Game.frenzyPower;
	}
	CM.Cache.LuckyReward = (CM.Cache.Lucky * 0.1) + 13;
	CM.Cache.LuckyFrenzy = CM.Cache.Lucky * 7;
	CM.Cache.LuckyRewardFrenzy = (CM.Cache.LuckyFrenzy * 0.1) + 13;
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
	var maxPayout = Game.cookiesPs * 60 * 60 * 3;
	if (Game.frenzy > 0) {
		maxPayout /= Game.frenzyPower;
	}
	
	CM.Cache.ChainReward = CM.Cache.MaxChainMoni(7, maxPayout);
	
	CM.Cache.ChainWrathReward = CM.Cache.MaxChainMoni(6, maxPayout);
	
	var base = 0;
	if (CM.Cache.ChainReward > CM.Cache.ChainWrathReward) {
		base = CM.Cache.ChainReward;
	}
	else {
		base = CM.Cache.ChainWrathReward;
	}
	var count = 1;
	if (maxPayout < base) {
		CM.Cache.Chain = 0;
	}
	else {
		count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
		while (base == base + count) {
			count++;
		}
		CM.Cache.Chain = (base + count) / 0.25;
	}
	
	CM.Cache.ChainFrenzyReward = CM.Cache.MaxChainMoni(7, maxPayout * 7);
	
	CM.Cache.ChainFrenzyWrathReward = CM.Cache.MaxChainMoni(6, maxPayout * 7);
	
	if (CM.Cache.ChainFrenzyReward > CM.Cache.ChainFrenzyWrathReward) {
		base = CM.Cache.ChainFrenzyReward;
	}
	else {
		base = CM.Cache.ChainFrenzyWrathReward;
	}
	if ((maxPayout * 7) < base) {
		CM.Cache.ChainFrenzy = 0;
	}
	else {
		count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
		while(base == base + count) {
			count++;
		}
		CM.Cache.ChainFrenzy = (base + count) / 0.25;
	}
}

CM.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		CM.Cache.SeaSpec = Math.max(25, Game.cookiesPs * 60 * 1);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
}

CM.Cache.RemakeSellAllTotal = function() {
	var sellTotal = 0;
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		sellTotal += CM.Sim.BuildingSell(me.basePrice, me.amount, me.amount);
	}
	CM.Cache.SellAllTotal = sellTotal;
}

CM.Cache.Lucky = 0;
CM.Cache.LuckyReward = 0;
CM.Cache.LuckyFrenzy = 0;
CM.Cache.LuckyRewardFrenzy = 0;
CM.Cache.SeaSpec = 0;
CM.Cache.Chain = 0;
CM.Cache.ChainReward = 0;
CM.Cache.ChainWrathReward = 0;
CM.Cache.ChainFrenzy = 0;
CM.Cache.ChainFrenzyReward = 0;
CM.Cache.ChainFrenzyWrathReward = 0;
CM.Cache.SellAllTotal = 0;

