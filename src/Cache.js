/*********
 * Cache *
 *********/

CM.Cache.RemakeIncome = function() {
	// Simulate Building Buys
	CM.Sim.BuyBuildings();

	// Simulate Upgrade Buys
	CM.Sim.BuyUpgrades();
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

CM.Cache.RemakeBCI = function() {
	// Buildings
	CM.Cache.RemakeBuildingsBCI();
	
	// Upgrades
	CM.Cache.RemakeUpgradeBCI();
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

CM.Cache.RemakeChain = function() {
	CM.Cache.Chain = Game.cookiesPs * 60 * 60 * 3 / 0.25;
	
	var digit = 7;
	var chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	var maxPayout = Game.cookiesPs * 60 * 60 * 3;
	var moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
	var nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	while (nextMoni < maxPayout) {
		chain++;
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	}
	CM.Cache.ChainReward = moni;
	
	digit = 6;
	chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
	nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	while (nextMoni < maxPayout) {
		chain++;
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	}
	CM.Cache.ChainWrathReward = moni;
}

CM.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		CM.Cache.SeaSpec = Math.max(25, Game.cookiesPs * 60 * 1);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
}

CM.Cache.Lucky = 0;
CM.Cache.LuckyReward = 0;
CM.Cache.LuckyFrenzy = 0;
CM.Cache.LuckyRewardFrenzy = 0;
CM.Cache.SeaSpec = 0;
CM.Cache.Chain = 0;
CM.Cache.ChainReward = 0;
CM.Cache.ChainWrathReward = 0;
