/**********
 * Header *
 **********/

CM = {};

CM.Backup = {};

CM.Cache = {};

CM.Config = {};

CM.ConfigData = {};

CM.Data = {};

CM.Disp = {};

CM.Sim = {};

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

/**********
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
			if (i != 'StatsPref' && typeof CM.ConfigData[i].func !== 'undefined') {
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
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
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
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
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

CM.ConfigData.BotBar = {label: ['Bottom Bar OFF', 'Bottom Bar ON'], desc: 'Building Information', toggle: true, func: function() {CM.Disp.ToggleBotBar();}};
CM.ConfigData.TimerBar = {label: ['Timer Bar OFF', 'Timer Bar ON'], desc: 'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy', toggle: true, func: function() {CM.Disp.ToggleTimerBar();}};
CM.ConfigData.TimerBarPos = {label: ['Timer Bar Position (Top Left)', 'Timer Bar Position (Bottom)'], desc: 'Placement of the Timer Bar', toggle: false, func: function() {CM.Disp.ToggleTimerBarPos();}};
CM.ConfigData.BuildColor = {label: ['Building Colors OFF', 'Building Colors ON'], desc: 'Color code buildings', toggle: true, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.BulkBuildColor = {label: ['Bulk Building Colors (Single Buildings Color)', 'Bulk Building Colors (Calculated Color)'], desc: 'Color code bulk buildings based on single buildings color or calculated bulk value color', toggle: false, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.UpBarColor = {label: ['Upgrade Colors/Bar OFF', 'Upgrade Colors with Bar ON', 'Upgrade Colors without Bar ON'], desc: 'Color code upgrades and optionally add a counter bar', toggle: false, func: function() {CM.Disp.ToggleUpBarColor();}};
CM.ConfigData.Colors = {
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
CM.ConfigData.UpgradeBarFixedPos = {label: ['Upgrade Bar Fixed Position OFF', 'Upgrade Bar Fixed Position ON'], desc: 'Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling', toggle: true, func: function() {CM.Disp.ToggleUpgradeBarFixedPos();}};
CM.ConfigData.CalcWrink = {label: ['Calculate with Wrinklers OFF', 'Calculate with Wrinklers ON'], desc: 'Calculate times and average Cookies Per Second with Wrinklers', toggle: true};
CM.ConfigData.CPSMode = {label: ['Current Cookies Per Second', 'Average Cookies Per Second'], desc: 'Calculate times using current Cookies Per Second or average Cookies Per Second', toggle: false};
CM.ConfigData.AvgCPSHist = {label: ['Average CPS for past 10s', 'Average CPS for past 15s', 'Average CPS for past 30s', 'Average CPS for past 1m', 'Average CPS for past 5m', 'Average CPS for past 10m', 'Average CPS for past 15m', 'Average CPS for past 30m'], desc: 'How much time average Cookies Per Second should consider', toggle: false};
CM.ConfigData.AvgClicksHist = {label: ['Average Cookie Clicks for past 1s', 'Average Cookie Clicks for past 5s', 'Average Cookie Clicks for past 10s', 'Average Cookie Clicks for past 15s', 'Average Cookie Clicks for past 30s'], desc: 'How much time average Cookie Clicks should consider', toggle: false};
CM.ConfigData.ToolWarnCautBon = {label: ['Calculate Tooltip Warning/Caution With Bonus CPS OFF', 'Calculate Tooltip Warning/Caution With Bonus CPS ON'], desc: 'Calculate the warning/caution with or without the bonus CPS you get from buying', toggle: true};
CM.ConfigData.GCFlash = {label: ['Golden Cookie Flash OFF', 'Golden Cookie Flash ON'], desc: 'Flash screen on Golden Cookie', toggle: true};
CM.ConfigData.GCSound = {label: ['Golden Cookie Sound OFF', 'Golden Cookie Sound ON'], desc: 'Play a sound on Golden Cookie', toggle: true};
CM.ConfigData.GCVolume = {label: [], desc: 'Volume of the Golden Cookie sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GCVolume.label[i] = i + '%';
}
CM.ConfigData.GCSoundURL = {label: 'Golden Cookie Sound URL:', desc: 'URL of the sound to be played when a Golden Cookie spawns'};
CM.ConfigData.GCTimer = {label: ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'], desc: 'A timer on the Golden Cookie when it has been spawned', toggle: true, func: function() {CM.Disp.ToggleGCTimer();}};
CM.ConfigData.Favicon = {label: ['Favicon OFF', 'Favicon ON'], desc: 'Update favicon with Golden/Wrath Cookie', toggle: true, func: function() {CM.Disp.UpdateFavicon();}};
CM.ConfigData.FortuneFlash = {label: ['Fortune Cookie Flash OFF', 'Fortune Cookie Flash ON'], desc: 'Flash screen on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneSound = {label: ['Fortune Cookie Sound OFF', 'Fortune Cookie Sound ON'], desc: 'Play a sound on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneVolume = {label: [], desc: 'Volume of the Fortune Cookie sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.FortuneVolume.label[i] = i + '%';
}
CM.ConfigData.FortuneSoundURL = {label: 'Fortune Cookie Sound URL:', desc: 'URL of the sound to be played when the Ticker has a Fortune Cookie'};
CM.ConfigData.SeaFlash = {label: ['Season Special Flash OFF', 'Season Special Flash ON'], desc: 'Flash screen on Season Popup', toggle: true};
CM.ConfigData.SeaSound = {label: ['Season Special Sound OFF', 'Season Special Sound ON'], desc: 'Play a sound on Season Popup', toggle: true};
CM.ConfigData.SeaVolume = {label: [], desc: 'Volume of the Season Special sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.SeaVolume.label[i] = i + '%';
}
CM.ConfigData.SeaSoundURL = {label: 'Season Special Sound URL:', desc: 'URL of the sound to be played when a Season Special spawns'};
CM.ConfigData.GardFlash = {label: ['Garden Tick Flash OFF', 'Garden Tick Flash ON'], desc: 'Flash screen on Garden Tick', toggle: true};
CM.ConfigData.GardSound = {label: ['Garden Tick Sound OFF', 'Garden Tick Sound ON'], desc: 'Play a sound on Garden Tick', toggle: true};
CM.ConfigData.GardVolume = {label: [], desc: 'Volume of the Garden Tick sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GardVolume.label[i] = i + '%';
}
CM.ConfigData.GardSoundURL = {label: 'Garden Tick Sound URL:', desc: 'URL of the sound to be played when the garden ticks'};
CM.ConfigData.Title = {label: ['Title OFF', 'Title ON', 'Title Pinned Tab Highlight'], desc: 'Update title with Golden Cookie/Season Popup timers; pinned tab highlight only changes the title when a Golden Cookie/Season Popup spawns', toggle: true};
CM.ConfigData.TooltipBuildUp = {label: ['Buildings/Upgrades Tooltip Information OFF', 'Buildings/Upgrades Tooltip Information ON'], desc: 'Extra information in tooltip for buildings/upgrades', toggle: true};
CM.ConfigData.TooltipAmor = {label: ['Buildings Tooltip Amortization Information OFF', 'Buildings Tooltip Amortization Information ON'], desc: 'Add amortization information to buildings tooltip', toggle: true};
CM.ConfigData.ToolWarnCaut = {label: ['Tooltip Warning/Caution OFF', 'Tooltip Warning/Caution ON'], desc: 'A warning/caution when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards', toggle: true, func: function() {CM.Disp.ToggleToolWarnCaut();}};
CM.ConfigData.ToolWarnCautPos = {label: ['Tooltip Warning/Caution Position (Left)', 'Tooltip Warning/Caution Position (Bottom)'], desc: 'Placement of the warning/caution boxes', toggle: false, func: function() {CM.Disp.ToggleToolWarnCautPos();}};
CM.ConfigData.TooltipGrim = {label: ['Grimoire Tooltip Information OFF', 'Grimoire Tooltip Information ON'], desc: 'Extra information in tooltip for grimoire', toggle: true};
CM.ConfigData.ToolWrink = {label: ['Wrinkler Tooltip OFF', 'Wrinkler Tooltip ON'], desc: 'Shows the amount of cookies a wrinkler will give when popping it', toggle: true};
CM.ConfigData.TooltipLump = {label: ['Sugar Lump Tooltip OFF', 'Sugar Lump Tooltip ON'], desc: 'Shows the current Sugar Lump type in Sugar lump tooltip.', toggle: true};
CM.ConfigData.Stats = {label: ['Statistics OFF', 'Statistics ON'], desc: 'Extra Cookie Monster statistics!', toggle: true};
CM.ConfigData.UpStats = {label: ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'], desc: 'Default Game rate is once every 5 seconds', toggle: false};
CM.ConfigData.TimeFormat = {label: ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'], desc: 'Change the time format', toggle: false};
CM.ConfigData.SayTime = {label: ['Format Time OFF', 'Format Time ON'], desc: 'Change how time is displayed in statistics', toggle: true, func: function() {CM.Disp.ToggleSayTime();}};
CM.ConfigData.GrimoireBar = {label: ['Grimoire Magic Meter Timer OFF', 'Grimoire Magic Meter Timer ON'], desc: 'A timer on how long before the Grimoire magic meter is full', toggle: true};
CM.ConfigData.Scale = {label: ['Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation', 'Engineering Notation'], desc: 'Change how long numbers are handled', toggle: false, func: function() {CM.Disp.RefreshScale();}};
CM.ConfigData.SortBuildings = {label: ['Sort Buildings: Default', 'Sort Buildings: PP'], desc: 'Sort the display of buildings in either default order or by PP', toggle: false,	func: function () { CM.Disp.UpdateBuildings();}};
CM.ConfigData.SortUpgrades = {label: ['Sort Upgrades: Default', 'Sort Upgrades: PP'], desc: 'Sort the display of upgrades in either default order or by PP', toggle: false, func: function () { CM.Disp.UpdateUpgrades();}};
/********
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
 * Disp *
 ********/

CM.Disp.FormatTime = function(time, format) {
	if (time == Infinity) return time;
	if (CM.Config.TimeFormat) {
		if (time > 3155760000) return 'XX:XX:XX:XX:XX';
		time = Math.ceil(time);
		var y = Math.floor(time / 31557600);
		var d = Math.floor(time % 31557600 / 86400);
		var h = Math.floor(time % 86400 / 3600);
		var m = Math.floor(time % 3600 / 60);
		var s = Math.floor(time % 60);
		var str = '';
		if (y < 10) {
			str += '0';
		}
		str += y + ':';
		if (d < 10) {
			str += '0';
		}
		str += d + ':';
		if (h < 10) {
			str += '0';
		}
		str += h + ':';
		if (m < 10) {
			str += '0';
		}
		str += m + ':';
		if (s < 10) {
			str += '0';
		}
		str += s;
	} else {
		if (time > 777600000) return format ? 'Over 9000 days!' : '>9000d';
		time = Math.ceil(time);
		var d = Math.floor(time / 86400);
		var h = Math.floor(time % 86400 / 3600);
		var m = Math.floor(time % 3600 / 60);
		var s = Math.floor(time % 60);
		var str = '';
		if (d > 0) {
			str += d + (format ? (d == 1 ? ' day' : ' days') : 'd') + ', ';
		}
		if (str.length > 0 || h > 0) {
			str += h + (format ? (h == 1 ? ' hour' : ' hours') : 'h') + ', ';
		}
		if (str.length > 0 || m > 0) {
			str += m + (format ? (m == 1 ? ' minute' : ' minutes') : 'm') + ', ';
		}
		str += s + (format ? (s == 1 ? ' second' : ' seconds') : 's');
	}
	return str;
}

CM.Disp.GetTimeColor = function(price, bank, cps, time) {
	var color;
	var text;
	if (bank >= price) {
		color = CM.Disp.colorGreen;
		if (CM.Config.TimeFormat) {
			text = '00:00:00:00:00';
		}
		else {
			text = 'Done!';
		}
	}
	else {
		if (typeof time !== 'undefined') {
			var time = time;
		}
		else {
			var time = (price - bank) / cps;
		}
		text = CM.Disp.FormatTime(time);
		if (time > 300) {
			color =  CM.Disp.colorRed;
		}
		else if (time > 60) {
			color =  CM.Disp.colorOrange;
		}
		else {
			color =  CM.Disp.colorYellow;
		}
	}
	return {text: text, color: color};
}

/**
 * This function returns Name and Color as object for sugar lump type that is given as input param.
 * @param type Sugar Lump Type.
 * @returns {{text: string, color: string}}
 * @constructor
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

CM.Disp.Beautify = function(num, frac) {
	if (CM.Config.Scale != 0 && isFinite(num)) {
		var answer = '';
		var negative = false;
		if (num < 0) {
			num = Math.abs(num);
			negative = true;
		}

		if (CM.Config.Scale == 3) {
			if (num >= 10) {
				var count = 0;
				while (num >= 10) {
					count++;
					num /= 10;
				}
				answer = Math.round(num * 1000) / 1000 + 'E+' + count;
			}
			else if (num < 1 && num != 0) {
				var count = 0;
				while (num < 1) {
					count++;
					num *= 10;
				}
				answer = Math.round(num * 1000) / 1000 + 'E-' + count;
			}
			else {
				answer = Math.round(num * 1000) / 1000 + 'E+0';
			}
		}
		else if (CM.Config.Scale == 4) {
			if (num >= 1000) {
				var count = 0;
				while (num >= 1000) {
					count++;
					num /= 1000;
				}
				answer = Math.round(num * 1000) / 1000 + 'E+' + (count * 3);
			}
			else if (num < 1 && num != 0) {
				var count = 0;
				while (num < 1) {
					count++;
					num *= 1000;
				}
				answer = Math.round(num * 1000) / 1000 + 'E-' + (count * 3);
			}
			else {
				answer = Math.round(num * 1000) / 1000 + 'E+0';
			}
		}
		else {
			for (var i = (CM.Disp.shortScale.length - 1); i >= 0; i--) {
				if (i < CM.Disp.metric.length && CM.Config.Scale == 1) {
					if (num >= Math.pow(1000, i + 2)) {
						answer = (Math.round(num / Math.pow(1000, i + 1)) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + CM.Disp.metric[i];
						break;
					}
				}
				else if (CM.Config.Scale == 2) {
					if (num >= Math.pow(1000, i + 2)) {
						answer = (Math.round(num / Math.pow(1000, i + 1)) / 1000) + ' ' + CM.Disp.shortScale[i];
						break;
					}
				}
			}
		}
		if (answer == '') {
			answer = CM.Backup.Beautify(num, frac);
		}

		if (negative) {
			answer = '-' + answer;
		}
		return answer;
	}
	else {
		return CM.Backup.Beautify(num, frac);
	}
}

CM.Disp.GetWrinkConfigBank = function() {
	if (CM.Config.CalcWrink)
		return CM.Cache.WrinkBank;
	else
		return 0;
}

CM.Disp.GetCPS = function() {
	if (CM.Config.CPSMode)
		return CM.Cache.AvgCPS;
	else
		return (Game.cookiesPs * (1 - Game.cpsSucked));
}

CM.Disp.UpdateBackground = function() {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
}

CM.Disp.GetConfigDisplay = function(config) {
	return CM.ConfigData[config].label[CM.Config[config]];
}

CM.Disp.AddJscolor = function() {
	CM.Disp.Jscolor = document.createElement('script');
	CM.Disp.Jscolor.type = 'text/javascript';
	CM.Disp.Jscolor.setAttribute('src', 'https://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(CM.Disp.Jscolor);
}

CM.Disp.CreateCssArea = function() {
	CM.Disp.Css = document.createElement('style');
	CM.Disp.Css.type = 'text/css';

	document.head.appendChild(CM.Disp.Css);
	
	// given the architecture of your code, you probably want these lines somewhere else,
	// but I stuck them here for convenience
	l("products").style.display = "grid";
	l("storeBulk").style.gridRow = "1/1";

	l("upgrades").style.display = "flex";
	l("upgrades").style["flex-wrap"] = "wrap";
}

CM.Disp.CreateBotBar = function() {
	CM.Disp.BotBar = document.createElement('div');
	CM.Disp.BotBar.id = 'CMBotBar';
	CM.Disp.BotBar.style.height = '55px';
	CM.Disp.BotBar.style.width = '100%';
	CM.Disp.BotBar.style.position = 'absolute';
	CM.Disp.BotBar.style.display = 'none';
	CM.Disp.BotBar.style.backgroundColor = '#262224';
	CM.Disp.BotBar.style.backgroundImage = '-moz-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = '-o-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = '-webkit-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
	CM.Disp.BotBar.style.borderTop = '1px solid black';
	CM.Disp.BotBar.style.overflow = 'auto';
	CM.Disp.BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';

	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.textAlign = 'center';
	table.style.whiteSpace = 'nowrap';
	// TODO figure a better way
	//table.style.tableLayout = 'fixed';
	//table.style.overflow = 'hidden';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

	var firstCol = function(text, color) {
		var td = document.createElement('td');
		td.style.textAlign = 'right';
		td.className = CM.Disp.colorTextPre + color;
		td.textContent = text;
		return td;
	}

	var type = document.createElement('tr');
	type.style.fontWeight = 'bold';
	type.appendChild(firstCol(CM.VersionMajor + '.' + CM.VersionMinor, CM.Disp.colorYellow));
	tbody.appendChild(type);
	var bonus = document.createElement('tr');
	bonus.appendChild(firstCol('Bonus Income', CM.Disp.colorBlue));
	tbody.appendChild(bonus);
	var pp = document.createElement('tr');
	pp.appendChild(firstCol('Payback Period', CM.Disp.colorBlue));
	tbody.appendChild(pp);
	var time = document.createElement('tr');
	time.appendChild(firstCol('Time Left', CM.Disp.colorBlue));
	tbody.appendChild(time);

	for (var i in Game.Objects) {
		var header = document.createElement('td');
		header.appendChild(document.createTextNode((i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' ('));
		var span = document.createElement('span');
		span.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
		header.appendChild(span);
		header.appendChild(document.createTextNode(')'));
		type.appendChild(header);
		bonus.appendChild(document.createElement('td'));
		pp.appendChild(document.createElement('td'));
		time.appendChild(document.createElement('td'));

	}

	CM.Disp.BotBar.appendChild(table);

	l('wrapper').appendChild(CM.Disp.BotBar);
}

CM.Disp.ToggleBotBar = function() {
	if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.display = '';
		CM.Disp.UpdateBotBarOther();
	}
	else {
		CM.Disp.BotBar.style.display = 'none';
	}
	CM.Disp.UpdateBotTimerBarDisplay();
}

CM.Disp.UpdateBotBarOther = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;

		for (var i in CM.Cache.Objects) {
			count++;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].textContent = Game.Objects[i].amount;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify(CM.Cache.Objects[i].bonus, 2);
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].className = CM.Disp.colorTextPre + CM.Cache.Objects[i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache.Objects[i].pp, 2);
		}
	}
}

CM.Disp.UpdateBotBarTime = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;

		for (var i in CM.Cache.Objects) {
			count++;
			var timeColor = CM.Disp.GetTimeColor(Game.Objects[i].getPrice(), (Game.cookies + CM.Disp.GetWrinkConfigBank()), CM.Disp.GetCPS());
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].className = CM.Disp.colorTextPre + timeColor.color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
}

CM.Disp.CreateTimerBar = function() {
	CM.Disp.TimerBar = document.createElement('div');
	CM.Disp.TimerBar.id = 'CMTimerBar';
	CM.Disp.TimerBar.style.position = 'absolute';
	CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.TimerBar.style.height = '48px';
	CM.Disp.TimerBar.style.fontSize = '10px';
	CM.Disp.TimerBar.style.fontWeight = 'bold';
	CM.Disp.TimerBar.style.backgroundColor = 'black';

	var bar = function(name, bars, time) {
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
		timer.id = time;
		timer.style.marginLeft = '5px';
		timer.style.verticalAlign = 'text-top';
		div.appendChild(timer);
		return div
	}

	CM.Disp.TimerBarGC = document.createElement('div');
	CM.Disp.TimerBarGC.id = 'CMTimerBarGC';
	CM.Disp.TimerBarGC.style.height = '12px';
	CM.Disp.TimerBarGC.style.margin = '0px 10px';
	CM.Disp.TimerBarGC.style.position = 'relative';
	CM.Disp.TimerBarGC.appendChild(bar('Next Cookie', [{id: 'CMTimerBarGCMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarGCBar', color: CM.Disp.colorPurple}], 'CMTimerBarGCTime'));
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarGC);

	CM.Disp.TimerBarRen = document.createElement('div');
	CM.Disp.TimerBarRen.id = 'CMTimerBarRen';
	CM.Disp.TimerBarRen.style.height = '12px';
	CM.Disp.TimerBarRen.style.margin = '0px 10px';
	CM.Disp.TimerBarRen.style.position = 'relative';
	CM.Disp.TimerBarRen.appendChild(bar('Next Reindeer', [{id: 'CMTimerBarRenMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarRenBar', color: CM.Disp.colorOrange}], 'CMTimerBarRenTime'));
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarRen);

	CM.Disp.TimerBarBuff1 = document.createElement('div');
	CM.Disp.TimerBarBuff1.id = 'CMTimerBarBuff1';
	CM.Disp.TimerBarBuff1.style.height = '12px';
	CM.Disp.TimerBarBuff1.style.margin = '0px 10px';
	CM.Disp.TimerBarBuff1.style.position = 'relative';
	CM.Disp.TimerBarBuff1.appendChild(bar('', [{id: 'CMTimerBarBuff1Bar'}], 'CMTimerBarBuff1Time'));
	CM.Disp.TimerBarBuff1.firstChild.firstChild.id = 'CMTimerBarBuff1Type';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarBuff1);

	CM.Disp.TimerBarBuff2 = document.createElement('div');
	CM.Disp.TimerBarBuff2.id = 'CMTimerBarBuff2';
	CM.Disp.TimerBarBuff2.style.height = '12px';
	CM.Disp.TimerBarBuff2.style.margin = '0px 10px';
	CM.Disp.TimerBarBuff2.style.position = 'relative';
	CM.Disp.TimerBarBuff2.appendChild(bar('', [{id: 'CMTimerBarBuff2Bar'}], 'CMTimerBarBuff2Time'));
	CM.Disp.TimerBarBuff2.firstChild.firstChild.id = 'CMTimerBarBuff2Type';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarBuff2);

	l('wrapper').appendChild(CM.Disp.TimerBar);
}

CM.Disp.ToggleTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		CM.Disp.TimerBar.style.display = '';
	}
	else {
		CM.Disp.TimerBar.style.display = 'none';
	}
	CM.Disp.UpdateBotTimerBarDisplay();
}

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
	CM.Disp.UpdateBotTimerBarDisplay();
}

CM.Disp.UpdateTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		// label width: 113, timer width: 26, div margin: 20
		var maxWidth = CM.Disp.TimerBar.offsetWidth - 159;
		var count = 0;

		if (Game.shimmerTypes['golden'].spawned == 0 && !Game.Has('Golden switch [off]')) {
			CM.Disp.TimerBarGC.style.display = '';
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
			count++;
		}
		else {
			CM.Disp.TimerBarGC.style.display = 'none';
		}

		if (Game.season == 'christmas' && Game.shimmerTypes['reindeer'].spawned == 0) {
			CM.Disp.TimerBarRen.style.display = '';
			l('CMTimerBarRenMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes['reindeer'].minTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenBar').style.width = Math.round(Math.min(Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].minTime, Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenTime').textContent = Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarRen.style.display = 'none';
		}

		var buffCount = 0;
		for (var i in Game.buffs) {
			if (Game.buffs[i]) {
				buffCount++;
				CM.Disp['TimerBarBuff' + buffCount].style.display = '';
				l('CMTimerBarBuff' + buffCount + 'Type').textContent = Game.buffs[i].name;
				var classColor = '';
				if (typeof CM.Disp.buffColors[Game.buffs[i].name] !== 'undefined') {
					classColor = CM.Disp.buffColors[Game.buffs[i].name];
				}
				else {
					classColor = CM.Disp.colorPurple;
				}
				l('CMTimerBarBuff' + buffCount + 'Bar').className = CM.Disp.colorBackPre + classColor;
				l('CMTimerBarBuff' + buffCount + 'Bar').style.width = Math.round(Game.buffs[i].time * maxWidth / Game.buffs[i].maxTime) + 'px';
				l('CMTimerBarBuff' + buffCount + 'Time').textContent = Math.ceil(Game.buffs[i].time / Game.fps);
				count++;
				if (buffCount == 2) {
					break;
				}
			}
		}
		if (buffCount < 2) {
			CM.Disp.TimerBarBuff2.style.display = 'none';
			if (buffCount < 1) {
				CM.Disp.TimerBarBuff1.style.display = 'none';
			}
		}

		/*if (Game.frenzy > 0) {
			CM.Disp.TimerBarBuff1.style.display = '';
			if (Game.frenzyPower == 7) {
				l('CMTimerBarBuff1Type').textContent = 'Frenzy';
				l('CMTimerBarBuff1Bar').className = CM.Disp.colorBackPre + CM.Disp.colorYellow;
			}
			else if (Game.frenzyPower == 0.5) {
				l('CMTimerBarBuff1Type').textContent = 'Clot';
				l('CMTimerBarBuff1Bar').className = CM.Disp.colorBackPre + CM.Disp.colorRed;
			}
			else if (Game.frenzyPower == 15) {
				l('CMTimerBarBuff1Type').textContent = 'Dragon Harvest';
				l('CMTimerBarBuff1Bar').className = CM.Disp.colorBackPre + CM.Disp.colorBrown;
			}
			else {
				l('CMTimerBarBuff1Type').textContent = 'Blood Frenzy';
				l('CMTimerBarBuff1Bar').className = CM.Disp.colorBackPre + CM.Disp.colorGreen;
			}
			l('CMTimerBarBuff1Bar').style.width = Math.round(Game.frenzy * maxWidth / Game.frenzyMax) + 'px';
			l('CMTimerBarBuff1Time').textContent = Math.ceil(Game.frenzy / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarBuff1.style.display = 'none';
		}

		if (Game.clickFrenzy > 0) {
			CM.Disp.TimerBarBuff2.style.display = '';
			if (Game.clickFrenzyPower == 777) {
				l('CMTimerBarBuff2Type').textContent = 'Click Frenzy';
				l('CMTimerBarBuff2Bar').className = CM.Disp.colorBackPre + CM.Disp.colorBlue;
			}
			else {
				l('CMTimerBarBuff2Type').textContent = 'Dragonflight';
				l('CMTimerBarBuff2Bar').className = CM.Disp.colorBackPre + CM.Disp.colorPink;
			}
			l('CMTimerBarBuff2Bar').style.width = Math.round(Game.clickFrenzy * maxWidth / Game.clickFrenzyMax) + 'px';
			l('CMTimerBarBuff2Time').textContent = Math.ceil(Game.clickFrenzy / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarBuff2.style.display = 'none';
		}*/

		if (count != 0) {
			var height = 48 / count;
			CM.Disp.TimerBarGC.style.height = height + 'px';
			CM.Disp.TimerBarRen.style.height = height + 'px';
			CM.Disp.TimerBarBuff1.style.height = height + 'px';
			CM.Disp.TimerBarBuff2.style.height = height + 'px';
		}
	}
}

CM.Disp.UpdateBotTimerBarDisplay = function() {
	if (CM.Config.BotBar == 1 && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 1) {
		CM.Disp.BotBar.style.bottom = '48px';
		l('game').style.bottom = '104px';
	}
	else if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '56px';
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

CM.Disp.UpdateBuildings = function() {
	if (CM.Config.BuildColor == 1 && Game.buyMode == 1) {
		var target = '';
		if (Game.buyBulk == 10 && CM.Config.BulkBuildColor == 1) {
			target = 'Objects10';
		}
		else if (Game.buyBulk == 100 && CM.Config.BulkBuildColor == 1) {
			target = 'Objects100';
		}
		else {
			target = 'Objects';
		}
		for (var i in CM.Cache[target]) {
			l('productPrice' + Game.Objects[i].id).style.color = CM.Config.Colors[CM.Cache[target][i].color];
		}
	}
	else {
		for (var i in CM.Cache.Objects) {
			l('productPrice' + Game.Objects[i].id).style.color = '';
		}
	}
	
	// Build array of pointers, sort by pp, use array index (+2) as the grid row number
	// (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
	var arr = Object.keys(CM.Cache.Objects).map(k =>
	{
		var o = CM.Cache.Objects[k];
		o.name = k;
		o.id = Game.Objects[k].id;
		return o;
	});

	if (CM.Config.SortBuildings)
		arr.sort((a, b) => a.pp - b.pp);
	else
		arr.sort((a, b) => a.id - b.id);

	for (var x = 0; x < arr.length; x++)
		Game.Objects[arr[x].name].l.style.gridRow = (x + 2) + "/" + (x + 2);
}

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
	placeholder.appendChild(legend);

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

CM.Disp.ToggleUpBarColor = function() {
	if (CM.Config.UpBarColor == 1) {
		CM.Disp.UpgradeBar.style.display = '';
		CM.Disp.UpdateUpgrades();
	}
	else if (CM.Config.UpBarColor == 2) {
		CM.Disp.UpgradeBar.style.display = 'none';
		CM.Disp.UpdateUpgrades();
	}
	else {
		CM.Disp.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
}

CM.Disp.UpdateUpgrades = function() {
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

CM.Disp.ToggleUpgradeBarFixedPos = function() {
	if (CM.Config.UpgradeBarFixedPos == 1) {
		CM.Disp.UpgradeBar.style.position = 'sticky';
		CM.Disp.UpgradeBar.style.top = '0px';
	}
	else {
		CM.Disp.UpgradeBar.style.position = '';
	}
}

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
	else if (mode == 0) {
		CM.Disp.WhiteScreen.style.display = 'none';
	}
}

CM.Disp.PlaySound = function(url, sndConfig, volConfig) {
	if (CM.Config[sndConfig] == 1) {
		var sound = new realAudio(url);
		sound.volume = CM.Config[volConfig] / 100;
		sound.play();
	}
}

/**
 * Needed for some of the functions to use the right object
 */
CM.Disp.FindGoldenShimmer = function() {
	if (CM.Disp.lastGoldenCookieState) {
		for (var i in Game.shimmers) {
			if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'golden') {
				CM.Disp.goldenShimmer = Game.shimmers[i];
				break;
			}
		}
	}
}

CM.Disp.CreateFavicon = function() {
	CM.Disp.Favicon = document.createElement('link');
	CM.Disp.Favicon.id = 'CMFavicon';
	CM.Disp.Favicon.rel = 'shortcut icon';
	CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(CM.Disp.Favicon);
}

CM.Disp.UpdateFavicon = function() {
	if (CM.Config.Favicon == 1 && CM.Disp.lastGoldenCookieState) {
		if (CM.Disp.goldenShimmer.wrath) {
			CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/wrathCookie.ico';
		}
		else {
			CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/goldenCookie.ico';
		}
	}
	else {
		CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
	}
}

CM.Disp.CreateGCTimer = function() {
	CM.Disp.GCTimer = document.createElement('div');
	CM.Disp.GCTimer.style.width = '96px';
	CM.Disp.GCTimer.style.height = '96px';
	CM.Disp.GCTimer.style.display = 'none';
	CM.Disp.GCTimer.style.position = 'absolute';
	CM.Disp.GCTimer.style.zIndex = '10000000001';
	CM.Disp.GCTimer.style.textAlign = 'center';
	CM.Disp.GCTimer.style.lineHeight = '96px';
	CM.Disp.GCTimer.style.fontFamily = '\"Kavoon\", Georgia, serif';
	CM.Disp.GCTimer.style.fontSize = '35px';
	CM.Disp.GCTimer.style.cursor = 'pointer';
	CM.Disp.GCTimer.onclick = function () {CM.Disp.goldenShimmer.pop(); CM.Disp.GCTimer.style.display = 'none';};
	CM.Disp.GCTimer.onmouseover = function() {CM.Disp.goldenShimmer.l.style.filter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; CM.Disp.goldenShimmer.l.style.webkitFilter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))';};
	CM.Disp.GCTimer.onmouseout = function() {CM.Disp.goldenShimmer.l.style.filter = ''; CM.Disp.goldenShimmer.l.style.webkitFilter = '';};

	l('game').appendChild(CM.Disp.GCTimer);
}

CM.Disp.ToggleGCTimer = function() {
	if (CM.Config.GCTimer == 1) {
		if (CM.Disp.lastGoldenCookieState) {
			CM.Disp.GCTimer.style.display = 'block';
			CM.Disp.GCTimer.style.left = CM.Disp.goldenShimmer.l.style.left;
			CM.Disp.GCTimer.style.top = CM.Disp.goldenShimmer.l.style.top;
		}
	}
	else {
		CM.Disp.GCTimer.style.display = 'none';
	}
}

CM.Disp.CheckGoldenCookie = function() {
	if (CM.Disp.lastGoldenCookieState != Game.shimmerTypes['golden'].spawned) {
		CM.Disp.lastGoldenCookieState = Game.shimmerTypes['golden'].spawned;
		CM.Disp.FindGoldenShimmer();
		CM.Disp.UpdateFavicon();
		if (CM.Disp.lastGoldenCookieState) {
			if (CM.Config.GCTimer == 1) {
				CM.Disp.GCTimer.style.display = 'block';
				CM.Disp.GCTimer.style.left = CM.Disp.goldenShimmer.l.style.left;
				CM.Disp.GCTimer.style.top = CM.Disp.goldenShimmer.l.style.top;
			}

			CM.Disp.Flash(3, 'GCFlash');
			CM.Disp.PlaySound(CM.Config.GCSoundURL, 'GCSound', 'GCVolume');
		}
		else if (CM.Config.GCTimer == 1) CM.Disp.GCTimer.style.display = 'none';
	}
	else if (CM.Config.GCTimer == 1 && CM.Disp.lastGoldenCookieState) {
		CM.Disp.GCTimer.style.opacity = CM.Disp.goldenShimmer.l.style.opacity;
		CM.Disp.GCTimer.style.transform = CM.Disp.goldenShimmer.l.style.transform;
		CM.Disp.GCTimer.textContent = Math.ceil(CM.Disp.goldenShimmer.life / Game.fps);
	}
}

CM.Disp.CheckTickerFortune = function() {
	if (CM.Disp.lastTickerFortuneState != (Game.TickerEffect && Game.TickerEffect.type == 'fortune')) {
		CM.Disp.lastTickerFortuneState = (Game.TickerEffect && Game.TickerEffect.type == 'fortune');
		if (CM.Disp.lastTickerFortuneState) {
			CM.Disp.Flash(3, 'FortuneFlash');
			CM.Disp.PlaySound(CM.Config.FortuneSoundURL, 'FortuneSound', 'FortuneVolume');
		}
	}
}

CM.Disp.CheckSeasonPopup = function() {
	if (CM.Disp.lastSeasonPopupState != Game.shimmerTypes['reindeer'].spawned) {
		CM.Disp.lastSeasonPopupState = Game.shimmerTypes['reindeer'].spawned;
		if (CM.Disp.lastSeasonPopupState && Game.season=='christmas') {
			// Needed for some of the functions to use the right object
			for (var i in Game.shimmers) {
				if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'reindeer') {
					CM.Disp.seasonPopShimmer = Game.shimmers[i];
					break;
				}
			}

			CM.Disp.Flash(3, 'SeaFlash');
			CM.Disp.PlaySound(CM.Config.SeaSoundURL, 'SeaSound', 'SeaVolume');
		}
	}
}

CM.Disp.CheckGardenTick = function() {
	if (Game.Objects['Farm'].minigameLoaded && CM.Disp.lastGardenNextStep != Game.Objects['Farm'].minigame.nextStep) {
		if (CM.Disp.lastGardenNextStep != 0 && CM.Disp.lastGardenNextStep < Date.now()) {
			CM.Disp.Flash(3, 'GardFlash');
			CM.Disp.PlaySound(CM.Config.GardSoundURL, 'GardSound', 'GardVolume');
		}
		CM.Disp.lastGardenNextStep = Game.Objects['Farm'].minigame.nextStep;
	}
}

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
		if (CM.Disp.lastGoldenCookieState) {
			if (CM.Disp.goldenShimmer.wrath) {
				titleGC = '[W ' +  Math.ceil(CM.Disp.goldenShimmer.life / Game.fps) + ']';
			}
			else {
				titleGC = '[G ' +  Math.ceil(CM.Disp.goldenShimmer.life / Game.fps) + ']';
			}
		}
		else if (!Game.Has('Golden switch [off]')) {
			titleGC = '[' +  Math.ceil((Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) / Game.fps) + ']';
		}
		else {
			titleGC = '[GS]'
		}
		if (CM.Disp.lastTickerFortuneState) {
			addFC = true;
			titleFC = '[F]';
		}
		if (Game.season == 'christmas') {
			addSP = true;
			if (CM.Disp.lastSeasonPopupState) {
				titleSP = '[R ' +  Math.ceil(CM.Disp.seasonPopShimmer.life / Game.fps) + ']';
			}
			else {
				titleSP = '[' +  Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps) + ']';
			}
		}

		var str = CM.Cache.Title;
		if (str.charAt(0) == '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}

		document.title = titleGC + (addFC ? titleFC : '') + (addSP ? titleSP : '') + ' ' + str;
	}
	else if (CM.Config.Title == 2) {
		var str = '';
		var spawn = false;
		if (CM.Disp.lastGoldenCookieState) {
			spawn = true;
			if (CM.Disp.goldenShimmer.wrath) {
				str += '[W ' +  Math.ceil(CM.Disp.goldenShimmer.life / Game.fps) + ']';
			}
			else {
				str += '[G ' +  Math.ceil(CM.Disp.goldenShimmer.life / Game.fps) + ']';
			}
		}
		if (CM.Disp.lastTickerFortuneState) {
			spawn = true;
			str += '[F]';
		}
		if (Game.season == 'christmas' && CM.Disp.lastSeasonPopupState) {
			str += '[R ' +  Math.ceil(CM.Disp.seasonPopShimmer.life / Game.fps) + ']';
			spawn = true;
		}
		if (spawn) str += ' - ';
		var title = 'Cookie Clicker';
		if (Game.season == 'fools') title = 'Cookie Baker';
		str += title;
		document.title = str;
	}
}

CM.Disp.CollectWrinklers = function() {
	for (var i in Game.wrinklers) {
		if (Game.wrinklers[i].sucked > 0 && Game.wrinklers[i].type == 0) {
			Game.wrinklers[i].hp = 0;
		}
	}
}

CM.Disp.CreateTooltip = function(placeholder, text, minWidth) {
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

CM.Disp.AddMenuPref = function(title) {
	var header = function(text) {
		var div = document.createElement('div');
		div.className = 'listing';
		div.style.padding = '5px 16px';
		div.style.opacity = '0.7';
		div.style.fontSize = '17px';
		div.style.fontFamily = '\"Kavoon\", Georgia, serif';
		div.textContent = text;
		return div;
	}

	var frag = document.createDocumentFragment();

	frag.appendChild(title());

	var listing = function(config) {
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
		a.textContent = CM.Disp.GetConfigDisplay(config);
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	
	var vol = function(config) {
		var volConfig = config;
		var volume = document.createElement('div');
		volume.className = 'listing';
		var minus = document.createElement('a');
		minus.className = 'option';
		minus.onclick = function() {CM.ToggleConfigDown(volConfig);};
		minus.textContent = '-';
		volume.appendChild(minus);
		var volText = document.createElement('span');
		volText.id = CM.ConfigPrefix + volConfig;
		volText.textContent = CM.Disp.GetConfigDisplay(volConfig);
		volume.appendChild(volText);
		var plus = document.createElement('a');
		plus.className = 'option';
		plus.onclick = function() {CM.ToggleConfigUp(volConfig);};
		plus.textContent = '+';
		volume.appendChild(plus);
		var volLabel = document.createElement('label');
		volLabel.textContent = CM.ConfigData[volConfig].desc;
		volume.appendChild(volLabel);
		return volume;
	}

	var url = function(config) {
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

	frag.appendChild(header('Bars/Colors'));
	frag.appendChild(listing('BotBar'));
	frag.appendChild(listing('TimerBar'));
	frag.appendChild(listing('TimerBarPos'));
	frag.appendChild(listing('SortBuildings'));
	frag.appendChild(listing('SortUpgrades'));
	frag.appendChild(listing('BuildColor'));
	frag.appendChild(listing('BulkBuildColor'));
	frag.appendChild(listing('UpBarColor'));
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
		frag.appendChild(div);
	}
	frag.appendChild(listing('UpgradeBarFixedPos'));

	frag.appendChild(header('Calculation'));
	frag.appendChild(listing('CalcWrink'));
	frag.appendChild(listing('CPSMode'));
	frag.appendChild(listing('AvgCPSHist'));
	frag.appendChild(listing('AvgClicksHist'));
	frag.appendChild(listing('ToolWarnCautBon'));

	frag.appendChild(header('Notification'));
	frag.appendChild(listing('GCFlash'));
	frag.appendChild(listing('GCSound'));
	frag.appendChild(vol('GCVolume'));
	frag.appendChild(url('GCSoundURL'));
	frag.appendChild(listing('GCTimer'));
	frag.appendChild(listing('Favicon'));
	frag.appendChild(listing('FortuneFlash'));
	frag.appendChild(listing('FortuneSound'));
	frag.appendChild(vol('FortuneVolume'));
	frag.appendChild(url('FortuneSoundURL'));
	frag.appendChild(listing('SeaFlash'));
	frag.appendChild(listing('SeaSound'));
	frag.appendChild(vol('SeaVolume'));
	frag.appendChild(url('SeaSoundURL'));
	frag.appendChild(listing('GardFlash'));
	frag.appendChild(listing('GardSound'));
	frag.appendChild(vol('GardVolume'));
	frag.appendChild(url('GardSoundURL'));
	frag.appendChild(listing('Title'));

	frag.appendChild(header('Tooltip'));
	frag.appendChild(listing('TooltipBuildUp'));
	frag.appendChild(listing('TooltipAmor'));
	frag.appendChild(listing('ToolWarnCaut'));
	frag.appendChild(listing('ToolWarnCautPos'));
	frag.appendChild(listing('TooltipGrim'));
	frag.appendChild(listing('ToolWrink'));
	frag.appendChild(listing('TooltipLump'));

	frag.appendChild(header('Statistics'));
	frag.appendChild(listing('Stats'));
	frag.appendChild(listing('UpStats'));
	frag.appendChild(listing('TimeFormat'));
	frag.appendChild(listing('SayTime'));
	frag.appendChild(listing('GrimoireBar'));

	frag.appendChild(header('Other'));
	frag.appendChild(listing('Scale'));
	var resDef = document.createElement('div');
	resDef.className = 'listing';
	var resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function() {CM.RestoreDefault();};
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);

	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);

	CM.Disp.FormatButtonOnClickBak = l('formatButton').onclick;
	eval('l(\'formatButton\').onclick = ' + l('formatButton').onclick.toString().split('mp3\');').join('mp3\'); CM.Disp.RefreshScale();'));
	//l('formatButton').onclick = function() {Game.Toggle('format', 'formatButton', 'Short numbers OFF', 'Short numbers ON', '1'); PlaySound('snd/tick.mp3'); CM.Disp.RefreshScale();};
}

CM.Disp.AddMenuStats = function(title) {
	var header = function(text, config) {
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

	var stats = document.createElement('div');
	stats.className = 'subsection';

	stats.appendChild(title());

	var listing = function(name, text) {
		var div = document.createElement('div');
		div.className = 'listing';
		var b = document.createElement('b');
		if (typeof name == 'string') b.appendChild(document.createTextNode(name));
		else b.appendChild(name); // fragment
		b.appendChild(document.createTextNode(' : '));
		div.appendChild(b);
		div.appendChild(text);
		return div;
	}

	var listingQuest = function(text, placeholder) {
		var frag = document.createDocumentFragment();
		frag.appendChild(document.createTextNode(text + ' '));
		var span = document.createElement('span');
		span.onmouseout = function() { Game.tooltip.hide(); };
		span.onmouseover = function() {Game.tooltip.draw(this, escape(CM.Disp[placeholder].innerHTML));};
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
	
	var createMissDisp = function(theMissDisp) {
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


	stats.appendChild(header('Lucky Cookies', 'Lucky'));
	if (CM.Config.StatsPref.Lucky) {
		var luckyColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var luckyTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.FormatTime((CM.Cache.Lucky - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
		var luckyColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var luckyTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.FormatTime((CM.Cache.LuckyFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
		var luckyCurBase = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 15) + 13;
		var luckyRewardMax = CM.Cache.LuckyReward;
		var luckyRewardMaxWrath = CM.Cache.LuckyReward;
		var luckyRewardFrenzyMax = CM.Cache.LuckyRewardFrenzy;
		var luckyRewardFrenzyMaxWrath = CM.Cache.LuckyRewardFrenzy;
		var luckyCur = luckyCurBase;
		var luckyCurWrath = luckyCurBase;
		// Old way
		if (Game.hasAura('Ancestral Metamorphosis')) {
			luckyRewardMax *= 1.1;
			luckyRewardFrenzyMax *= 1.1;
			luckyCur *= 1.1;
		}
		/*luckyRewardMax *= 1 + Game.auraMult('Ancestral Metamorphosis') * 0.1;
		luckyRewardFrenzyMax *= 1 + Game.auraMult('Ancestral Metamorphosis') * 0.1;
		luckyCur *= 1 + Game.auraMult('Ancestral Metamorphosis') * 0.1;*/
		// Old way
		if (Game.hasAura('Unholy Dominion')) {
			luckyRewardMaxWrath *= 1.1;
			luckyRewardFrenzyMaxWrath *= 1.1;
			luckyCurWrath *= 1.1;
		}
		var luckySplit = luckyRewardMax != luckyRewardMaxWrath;

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
		stats.appendChild(listing(listingQuest('\"Lucky!\" Cookies Required', 'GoldCookTooltipPlaceholder'), luckyReqFrag));
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
		stats.appendChild(listing(listingQuest('\"Lucky!\" Cookies Required (Frenzy)', 'GoldCookTooltipPlaceholder'), luckyReqFrenFrag));
		stats.appendChild(listing(listingQuest('\"Lucky!\" Reward (MAX)' + (luckySplit ? ' (Golden / Wrath)' : ''), 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(luckyRewardMax) + (luckySplit ? (' / ' + Beautify(luckyRewardMaxWrath)) : ''))));
		stats.appendChild(listing(listingQuest('\"Lucky!\" Reward (MAX) (Frenzy)' + (luckySplit ? ' (Golden / Wrath)' : ''), 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(luckyRewardFrenzyMax) + (luckySplit ? (' / ' + Beautify(luckyRewardFrenzyMaxWrath)) : ''))));
		stats.appendChild(listing(listingQuest('\"Lucky!\" Reward (CUR)' + (luckySplit ? ' (Golden / Wrath)' : ''), 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(luckyCur) + (luckySplit ? (' / ' + Beautify(luckyCurWrath)) : ''))));
	}

	stats.appendChild(header('Chain Cookies', 'Chain'));
	if (CM.Config.StatsPref.Chain) {
		var chainColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Chain) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Chain) ? CM.Disp.FormatTime((CM.Cache.Chain - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
		var chainColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzy) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
		var chainWrathColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainWrathTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrath) ? CM.Disp.FormatTime((CM.Cache.ChainWrath - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
		var chainWrathColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainWrathTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrath) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyWrath - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';

		var chainRewardMax = CM.Cache.ChainReward;
		var chainWrathRewardMax = CM.Cache.ChainWrathReward;
		var chainFrenzyRewardMax = CM.Cache.ChainFrenzyReward;
		var chainFrenzyWrathRewardMax = CM.Cache.ChainFrenzyWrathReward;
		var chainCurMax = Math.min(CM.Cache.NoGoldSwitchCookiesPS * 60 * 60 * 6, (Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.5);
		var chainCur = CM.Cache.MaxChainMoni(7, chainCurMax);
		var chainCurWrath = CM.Cache.MaxChainMoni(6, chainCurMax);
		if (Game.hasAura('Ancestral Metamorphosis')) {
			chainRewardMax *= 1.1;
			chainFrenzyRewardMax *= 1.1;
			chainCur *= 1.1;
		}
		if (Game.hasAura('Unholy Dominion')) {
			chainWrathRewardMax *= 1.1;
			chainFrenzyWrathRewardMax *= 1.1;
			chainCurWrath *= 1.1;
		}

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
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required', 'GoldCookTooltipPlaceholder'), chainReqFrag));
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
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required (Wrath)', 'GoldCookTooltipPlaceholder'), chainWrathReqFrag));
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
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required (Frenzy)', 'GoldCookTooltipPlaceholder'), chainReqFrenFrag));
		var chainWrathReqFrenFrag = document.createDocumentFragment();
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
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required (Frenzy) (Wrath)', 'GoldCookTooltipPlaceholder'), chainWrathReqFrenFrag));
		stats.appendChild(listing(listingQuest('\"Chain\" Reward (MAX) (Golden / Wrath)', 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(chainRewardMax) + ' / ' + Beautify(chainWrathRewardMax))));
		stats.appendChild(listing(listingQuest('\"Chain\" Reward (MAX) (Frenzy) (Golden / Wrath)', 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(chainFrenzyRewardMax) + ' / ' + Beautify(chainFrenzyWrathRewardMax))));
		stats.appendChild(listing(listingQuest('\"Chain\" Reward (CUR) (Golden / Wrath)', 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(chainCur) + ' / ' + Beautify(chainCurWrath))));
	}

	var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg')); // Needs to be done for the checking below

	stats.appendChild(header('Prestige', 'Prestige'));
	if (CM.Config.StatsPref.Prestige) {
		var possiblePresMax = Math.floor(Game.HowMuchPrestige(CM.Cache.RealCookiesEarned + Game.cookiesReset + CM.Cache.WrinkGodBank + (choEgg ? CM.Cache.lastChoEgg : 0)));
		var neededCook = Game.HowManyCookiesReset(possiblePresMax + 1) - (CM.Cache.RealCookiesEarned + Game.cookiesReset + CM.Cache.WrinkGodBank + (choEgg ? CM.Cache.lastChoEgg : 0));
		stats.appendChild(listing(listingQuest('Prestige Level (CUR / MAX)', 'PrestMaxTooltipPlaceholder'),  document.createTextNode(Beautify(Game.prestige) + ' / ' + Beautify(possiblePresMax))));
		
		var cookiesNextFrag = document.createDocumentFragment();
		cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
		var cookiesNextSmall = document.createElement('small');
		cookiesNextSmall.textContent = ' (' + (CM.Disp.FormatTime(neededCook / CM.Cache.AvgCPSChoEgg, 1)) + ')';
		cookiesNextFrag.appendChild(cookiesNextSmall);
		stats.appendChild(listing(listingQuest('Cookies To Next Level', 'NextPrestTooltipPlaceholder'), cookiesNextFrag));
		stats.appendChild(listing(listingQuest('Heavenly Chips (CUR / MAX)', 'HeavenChipMaxTooltipPlaceholder'),  document.createTextNode(Beautify(Game.heavenlyChips) + ' / ' + Beautify((possiblePresMax - Game.prestige) + Game.heavenlyChips))));
		
		var resetBonus = CM.Sim.ResetBonus(possiblePresMax);
		var resetFrag = document.createDocumentFragment();
		resetFrag.appendChild(document.createTextNode(Beautify(resetBonus)));
		var increase = Math.round(resetBonus / Game.cookiesPs * 10000);
		if (isFinite(increase) && increase != 0) {
			var resetSmall = document.createElement('small');
			resetSmall.textContent = ' (' + (increase / 100) + '% of income)';
			resetFrag.appendChild(resetSmall);
		}
		stats.appendChild(listing(listingQuest('Reset Bonus Income', 'ResetTooltipPlaceholder'), resetFrag));

		var currentPrestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset));
		var willHave = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
		var willGet = willHave - currentPrestige;
		var addCommas = (n) =>
		{
			var s1 = n.toString();
			var s2 = '';
			for (var i in s1)
			{
				if ((s1.length - i) % 3 == 0 && i > 0)
					s2 += ',';
				
				s2 += s1[i];
			}

			return s2;
		};

		if (!Game.Has('Lucky digit'))
		{
			var delta7 = 7 - (willHave % 10);
			if (delta7 < 0) delta7 += 10;
			var next7Reset = willGet + delta7;
			var next7Total = willHave + delta7;
			var frag7 = document.createDocumentFragment();
			frag7.appendChild(document.createTextNode(addCommas(next7Total) + " / " + addCommas(next7Reset) + " (+" + delta7 + ")"));
			stats.appendChild(listing('Next "Lucky Digit" (total / reset)', frag7));
		}
		
		if (!Game.Has('Lucky number'))
		{
			var delta777 = 777 - (willHave % 1000);
			if (delta777 < 0) delta777 += 1000;
			var next777Reset = willGet + delta777;
			var next777Total = willHave + delta777;
			var frag777 = document.createDocumentFragment();
			frag777.appendChild(document.createTextNode(addCommas(next777Total) + " / " + addCommas(next777Reset) + " (+" + delta777 + ")"));
			stats.appendChild(listing('Next "Lucky Number" (total / reset)', frag777));
		}
		
		if (!Game.Has('Lucky payout'))
		{
			var delta777777 = 777777 - (willHave % 1000000);
			if (delta777777 < 0) delta777777 += 1000000;
			var next777777Reset = willGet + delta777777;
			var next777777Total = willHave + delta777777;
			var frag777777 = document.createDocumentFragment();
			frag777777.appendChild(document.createTextNode(addCommas(next777777Total) + " / " + addCommas(next777777Reset) + " (+" + delta777777 + ")"));
			stats.appendChild(listing('Next "Lucky Payout" (total / reset)', frag777777));
		}
	}

	if (Game.cpsSucked > 0) {
		stats.appendChild(header('Wrinklers', 'Wrink'));
		if (CM.Config.StatsPref.Wrink) {
			var popAllFrag = document.createDocumentFragment();
			popAllFrag.appendChild(document.createTextNode(Beautify(CM.Cache.WrinkBank) + ' '));
			var popAllA = document.createElement('a');
			popAllA.textContent = 'Pop All Normal';
			popAllA.className = 'option';
			popAllA.onclick = function() { CM.Disp.CollectWrinklers(); };
			popAllFrag.appendChild(popAllA);
			stats.appendChild(listing('Rewards of Popping',  popAllFrag));
		}
	}

	var specDisp = false;
	var halloCook = [];
	for (var i in CM.Data.HalloCookies) {
		if (!Game.Has(CM.Data.HalloCookies[i])) {
			halloCook.push(CM.Data.HalloCookies[i]);
			specDisp = true;
		}
	}
	var christCook = [];
	for (var i in CM.Data.ChristCookies) {
		if (!Game.Has(CM.Data.ChristCookies[i])) {
			christCook.push(CM.Data.ChristCookies[i]);
			specDisp = true;
		}
	}
	var valCook = [];
	for (var i in CM.Data.ValCookies) {
		if (!Game.Has(CM.Data.ValCookies[i])) {
			valCook.push(CM.Data.ValCookies[i]);
			specDisp = true;
		}
	}
	var normEggs = [];
	for (var i in Game.eggDrops) {
		if (!Game.HasUnlocked(Game.eggDrops[i])) {
			normEggs.push(Game.eggDrops[i]);
			specDisp = true;
		}
	}
	var rareEggs = [];
	for (var i in Game.rareEggDrops) {
		if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
			rareEggs.push(Game.rareEggDrops[i]);
			specDisp = true;
		}
	}

	var centEgg = Game.Has('Century egg');

	if (Game.season == 'christmas' || specDisp || choEgg || centEgg) {
		stats.appendChild(header('Season Specials', 'Sea'));
		if (CM.Config.StatsPref.Sea) {
			if (specDisp) {
				if (halloCook.length != 0) stats.appendChild(listing('Halloween Cookies Left to Buy', createMissDisp(halloCook)));
				if (christCook.length != 0) stats.appendChild(listing('Christmas Cookies Left to Buy',  createMissDisp(christCook)));
				if (valCook.length != 0) stats.appendChild(listing('Valentine Cookies Left to Buy',  createMissDisp(valCook)));
				if (normEggs.length != 0) stats.appendChild(listing('Normal Easter Eggs Left to Unlock',  createMissDisp(normEggs)));
				if (rareEggs.length != 0) stats.appendChild(listing('Rare Easter Eggs Left to Unlock',  createMissDisp(rareEggs)));
			}

			if (Game.season == 'christmas') stats.appendChild(listing('Reindeer Reward',  document.createTextNode(Beautify(CM.Cache.SeaSpec))));
			if (choEgg) {
				stats.appendChild(listing(listingQuest('Chocolate Egg Cookies', 'ChoEggTooltipPlaceholder'), document.createTextNode(Beautify(CM.Cache.lastChoEgg))));
			}
			if (centEgg) {
				stats.appendChild(listing('Century Egg Multiplier', document.createTextNode((Math.round((CM.Cache.CentEgg - 1) * 10000) / 100) + '%')));
			}
		}
	}

	stats.appendChild(header('Miscellaneous', 'Misc'));
	if (CM.Config.StatsPref.Misc) {
		stats.appendChild(listing(
			'Average Cookies Per Second (Past ' + (CM.Disp.cookieTimes[CM.Config.AvgCPSHist] < 60 ? (CM.Disp.cookieTimes[CM.Config.AvgCPSHist] + ' seconds') : ((CM.Disp.cookieTimes[CM.Config.AvgCPSHist] / 60) + (CM.Config.AvgCPSHist == 3 ? ' minute' : ' minutes'))) + ')', 
			document.createTextNode(Beautify(CM.Cache.AvgCPS, 3))
		));
		stats.appendChild(listing('Average Cookie Clicks Per Second (Past ' + CM.Disp.clickTimes[CM.Config.AvgClicksHist] + (CM.Config.AvgClicksHist == 0 ? ' second' : ' seconds') + ')', document.createTextNode(Beautify(CM.Cache.AvgClicks, 1))));
		if (Game.Has('Fortune cookies')) {
			var fortunes = [];
			for (var i in CM.Data.Fortunes) {
				if (!Game.Has(CM.Data.Fortunes[i])) {
					fortunes.push(CM.Data.Fortunes[i]);
				}
			}
			if (fortunes.length != 0) stats.appendChild(listing('Fortune Upgrades Left to Buy',  createMissDisp(fortunes)));
		}
		stats.appendChild(listing('Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);
}

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
	else if (CM.Config.Stats == 1 && Game.onMenu == 'stats') {
		CM.Disp.AddMenuStats(title);
	}
}

CM.Disp.RefreshMenu = function() {
	if (CM.Config.UpStats && Game.onMenu == 'stats' && (Game.drawT - 1) % (Game.fps * 5) != 0 && (Game.drawT - 1) % Game.fps == 0) Game.UpdateMenu();
}

CM.Disp.FixMouseY = function(target) {
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

CM.Disp.UpdateTooltipLocation = function() {
	if (Game.tooltip.origin == 'store') {
		var warnCautOffset = 0;
		if (CM.Config.ToolWarnCaut == 1 && CM.Config.ToolWarnCautPos == 1) warnCautOffset = CM.Disp.TooltipWarnCaut.clientHeight - 4;
		Game.tooltip.tta.style.top = Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnCautOffset - 46) + 'px';
	}
	// Kept for future possible use if the code changes again
	/*else if (!Game.onCrate && !Game.OnAscend && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	}*/
}

CM.Disp.CreateTooltipWarnCaut = function() {
	CM.Disp.TooltipWarnCaut = document.createElement('div');
	CM.Disp.TooltipWarnCaut.style.position = 'absolute';
	CM.Disp.TooltipWarnCaut.style.display = 'none';
	CM.Disp.TooltipWarnCaut.style.left = 'auto';
	CM.Disp.TooltipWarnCaut.style.bottom = 'auto';

	var create = function(boxId, color, labelTextFront, labelTextBack, deficitId) {
		var box = document.createElement('div');
		box.id = boxId;
		box.style.display = 'none';
		box.style.WebkitTransition = 'opacity 0.1s ease-out';
		box.style.MozTransition = 'opacity 0.1s ease-out';
		box.style.MsTransition = 'opacity 0.1s ease-out';
		box.style.OTransition = 'opacity 0.1s ease-out';
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
	CM.Disp.TooltipWarnCaut.appendChild(create('CMDispTooltipWarn', CM.Disp.colorRed, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!"', 'CMDispTooltipWarnText'));
	CM.Disp.TooltipWarnCaut.firstChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarnCaut.appendChild(create('CMDispTooltipCaut', CM.Disp.colorYellow, 'Caution: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)', 'CMDispTooltipCautText'));

	l('tooltipAnchor').appendChild(CM.Disp.TooltipWarnCaut);
}

CM.Disp.ToggleToolWarnCaut = function() { // Pointless?
	if (CM.Config.ToolWarnCaut == 1) {
		CM.Disp.TooltipWarnCaut.style.display = 'block';
	}
	else {
		CM.Disp.TooltipWarnCaut.style.display = 'none';
	}
}

CM.Disp.ToggleToolWarnCautPos = function() {
	if (CM.Config.ToolWarnCautPos == 0) {
		CM.Disp.TooltipWarnCaut.style.top = 'auto';
		CM.Disp.TooltipWarnCaut.style.margin = '4px -4px';
		CM.Disp.TooltipWarnCaut.style.padding = '3px 4px';
	}
	else {
		CM.Disp.TooltipWarnCaut.style.right = 'auto';
		CM.Disp.TooltipWarnCaut.style.margin = '4px';
		CM.Disp.TooltipWarnCaut.style.padding = '4px 3px';
	}
}

CM.Disp.CalculateGrimoireRefillTime = function(currentMagic, maxMagic, targetMagic) {
	var count = 0;
	while (currentMagic < targetMagic) {
		currentMagic += Math.max(0.002, Math.pow(currentMagic / Math.max(maxMagic, 100), 0.5)) * 0.002;
		count++;
	}
	return count / Game.fps;
}

CM.Disp.AddTooltipBuild = function() {
	CM.Disp.TooltipBuildBack = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			CM.Disp.TooltipBuildBack[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'b\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}');
		}
	}
}

CM.Disp.AddTooltipUpgrade = function() {
	CM.Disp.TooltipUpgradeBack = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			CM.Disp.TooltipUpgradeBack[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() {if (!Game.mouseDown) {Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'u\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}}');
		}
	}
}

CM.Disp.AddTooltipGrimoire = function() {
	if (Game.Objects['Wizard tower'].minigameLoaded) {
		CM.Disp.TooltipGrimoireBack = [];
		for (var i in Game.Objects['Wizard tower'].minigame.spellsById) {
			if (l('grimoireSpell' + i).onmouseover != null) {
				CM.Disp.TooltipGrimoireBack[i] = l('grimoireSpell' + i).onmouseover;
				eval('l(\'grimoireSpell\' + i).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'g\', \'' + i + '\');}, \'this\'); Game.tooltip.wobble();}');
			}
		}
	}
}

/**
 * This function improves Sugar Lump tooltip by adding extra infromation.
 * @constructor
 */
CM.Disp.AddTooltipLump = function() {
	if (Game.canLumps()) {
		CM.Disp.TooltipLumpBack = l('lumps').onmouseover;
        eval('l(\'lumps\').onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'s\', \'Lump\');}, \'this\'); Game.tooltip.wobble();}');
	}
};

CM.Disp.Tooltip = function(type, name) {
	if (type == 'b') {
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		if (CM.Config.TooltipAmor == 1) {
			var buildPrice = CM.Sim.BuildingGetPrice(Game.Objects[name], Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			var amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML
					.split('so far</div>')
					.join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) == 1 ? 'cookie' : 'cookies') + ' left to amortize (' + CM.Disp.GetTimeColor(buildPrice, Game.Objects[name].totalCookies, (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');
			}
		}
		if (Game.buyMode == 1) {
			var target = '';
			var change = false;
			if (Game.buyBulk == 10) {
				target = 'Objects10';
				change = true;
			}
			else if (Game.buyBulk == 100) {
				target = 'Objects100';
				change = true;
			}
			if (change) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join(Beautify(CM.Cache[target][name].price));
			}
		}
		else if (Game.buyMode == -1) {
			if (Game.buyBulk == -1) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(CM.Sim.BuildingSell(Game.Objects[name], Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.Objects[name].amount, 0)));
			}
			else {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(CM.Sim.BuildingSell(Game.Objects[name], Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 0)));
			}
		}
	}
	else if (type == 'u') {
		if (!Game.UpgradesInStore[name]) return '';
		l('tooltip').innerHTML = Game.crateTooltip(Game.UpgradesInStore[name], 'store');
	}
	else if (type === 's') {
		// Sugar Lump
        l('tooltip').innerHTML = Game.lumpTooltip();
	}
	else { // Grimoire
		l('tooltip').innerHTML = Game.Objects['Wizard tower'].minigame.spellTooltip(name)();
	}

	var area = document.createElement('div');
	area.id = 'CMTooltipArea';
	l('tooltip').appendChild(area);

	if (CM.Config.TooltipBuildUp == 1 && (type == 'u' || (type == 'b' && Game.buyMode == 1))) {
		l('tooltip').firstChild.style.paddingBottom = '4px';
		var tooltip = document.createElement('div');
		tooltip.style.border = '1px solid';
		tooltip.style.padding = '4px';
		tooltip.style.margin = '0px -4px';
		tooltip.id = 'CMTooltipBorder';

		var header = function(text) {
			var div = document.createElement('div');
			div.style.fontWeight = 'bold';
			div.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
			div.textContent = text;
			return div;
		}

		tooltip.appendChild(header('Bonus Income'));
		var income = document.createElement('div');
		income.style.marginBottom = '4px';
		income.style.color = 'white';
		income.id = 'CMTooltipIncome';
		tooltip.appendChild(income);
		tooltip.appendChild(header('Payback Period'));
		var pp = document.createElement('div');
		pp.style.marginBottom = '4px';
		pp.id = 'CMTooltipPP';
		tooltip.appendChild(pp);
		tooltip.appendChild(header('Time Left'));
		var time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltip.appendChild(time);

		area.appendChild(tooltip);
	}

	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	CM.Disp.UpdateTooltip();

	return l('tooltip').innerHTML;
}

CM.Disp.UpdateTooltip = function() {
	if (l('tooltipAnchor').style.display != 'none') {

		if (l('CMTooltipArea') != null) {
			if (CM.Disp.tooltipType == 'b' || CM.Disp.tooltipType == 'u') {
				// Error checking
				if (CM.Disp.tooltipType == 'u' && (typeof Game.UpgradesInStore[CM.Disp.tooltipName] === 'undefined' || typeof CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name] === 'undefined')) {
					return;
				}
				var price;
				var bonus;
				if (CM.Disp.tooltipType == 'b') {
					var target = '';
					if (Game.buyMode == 1 && Game.buyBulk == 10) {
						target = 'Objects10';
						price = CM.Cache[target][CM.Disp.tooltipName].price;
					}
					else if (Game.buyMode == 1 && Game.buyBulk == 100) {
						target = 'Objects100';
						price = CM.Cache[target][CM.Disp.tooltipName].price;
					}
					else {
						target = 'Objects';
						price = Game.Objects[CM.Disp.tooltipName].getPrice();
					}
					bonus = CM.Cache[target][CM.Disp.tooltipName].bonus;
					if (CM.Config.TooltipBuildUp == 1 && Game.buyMode == 1) {
						l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
						l('CMTooltipPP').textContent = Beautify(CM.Cache[target][CM.Disp.tooltipName].pp, 2);
						l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
					}
				}
				else { // Upgrades
					bonus = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
					price = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();
					if (CM.Config.TooltipBuildUp == 1) {
						l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
						l('CMTooltipPP').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].pp, 2);
						l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
					}
				}
				if (CM.Config.TooltipBuildUp == 1 && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
					l('CMTooltipIncome').textContent = Beautify(bonus, 2);

					var increase = Math.round(bonus / Game.cookiesPs * 10000);
					if (isFinite(increase) && increase != 0) {
						l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
					}

					var timeColor = CM.Disp.GetTimeColor(price, (Game.cookies + CM.Disp.GetWrinkConfigBank()), CM.Disp.GetCPS());
					l('CMTooltipTime').textContent = timeColor.text;
					l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
				}

				if (CM.Config.ToolWarnCaut == 1) {
					CM.Disp.TooltipWarnCaut.style.display = 'block';
					var warn = CM.Cache.Lucky;
					if (CM.Config.ToolWarnCautBon == 1) {
						var bonusNoFren = bonus;
						bonusNoFren /= CM.Sim.getCPSBuffMult();
						warn += ((bonusNoFren * 60 * 15) / 0.15);
					}
					var caut = warn * 7;
					var amount = (Game.cookies + CM.Disp.GetWrinkConfigBank()) - price;
					if ((amount < warn || amount < caut) && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
						if (CM.Config.ToolWarnCautPos == 0) {
							CM.Disp.TooltipWarnCaut.style.right = '0px';
						}
						else {
							CM.Disp.TooltipWarnCaut.style.top = (l('tooltip').offsetHeight) + 'px';
						}
						CM.Disp.TooltipWarnCaut.style.width = (l('tooltip').offsetWidth - 6) + 'px';

						if (amount < warn) {
							l('CMDispTooltipWarn').style.display = '';
							l('CMDispTooltipWarnText').textContent = Beautify(warn - amount) + ' (' + CM.Disp.FormatTime((warn - amount) / CM.Disp.GetCPS()) + ')';
							l('CMDispTooltipCaut').style.display = '';
							l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + CM.Disp.FormatTime((caut - amount) / CM.Disp.GetCPS()) + ')';
						}
						else if (amount < caut) {
							l('CMDispTooltipCaut').style.display = '';
							l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + CM.Disp.FormatTime((caut - amount) / CM.Disp.GetCPS()) + ')';
							l('CMDispTooltipWarn').style.display = 'none';
						}
						else {
							l('CMDispTooltipWarn').style.display = 'none';
							l('CMDispTooltipCaut').style.display = 'none';
						}
					}
					else {
						l('CMDispTooltipWarn').style.display = 'none';
						l('CMDispTooltipCaut').style.display = 'none';
					}
				}
				else {
					CM.Disp.TooltipWarnCaut.style.display = 'none';
				}
			}
			else if (CM.Disp.tooltipType === 's') {
                // Adding information about Sugar Lumps.

                CM.Disp.TooltipWarnCaut.style.display = 'none';
                l('CMDispTooltipWarn').style.display = 'none';
                l('CMDispTooltipCaut').style.display = 'none';

                if (CM.Config.TooltipLump === 1) {
                    l('CMTooltipArea').innerHTML = '';

                    l('tooltip').firstChild.style.paddingBottom = '4px';
                    var lumpTooltip = document.createElement('div');
                    lumpTooltip.style.border = '1px solid';
                    lumpTooltip.style.padding = '4px';
                    lumpTooltip.style.margin = '0px -4px';
                    lumpTooltip.id = 'CMTooltipBorder';
                    lumpTooltip.className = CM.Disp.colorTextPre + CM.Disp.colorGray;

                    var lumpHeader = document.createElement('div');
                    lumpHeader.style.fontWeight = 'bold';
                    lumpHeader.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
                    lumpHeader.textContent = 'Current Sugar Lump';

                    lumpTooltip.appendChild(lumpHeader);
                    var lumpType = document.createElement('div');
                    lumpType.id = 'CMTooltipTime';
                    lumpTooltip.appendChild(lumpType);
                    var lumpColor = CM.Disp.GetLumpColor(Game.lumpCurrentType);
                    lumpType.textContent = lumpColor.text;
                    lumpType.className = CM.Disp.colorTextPre + lumpColor.color;

                    l('CMTooltipArea').appendChild(lumpTooltip);
                }
			}
			else { // Grimoire
				CM.Disp.TooltipWarnCaut.style.display = 'none';
				l('CMDispTooltipWarn').style.display = 'none';
				l('CMDispTooltipCaut').style.display = 'none';

				var minigame = Game.Objects['Wizard tower'].minigame;
				var spellCost = minigame.getSpellCost(minigame.spellsById[CM.Disp.tooltipName]);

				if (CM.Config.TooltipGrim == 1 && spellCost <= minigame.magicM) {
					l('CMTooltipArea').innerHTML = '';

					l('tooltip').firstChild.style.paddingBottom = '4px';
					var tooltip = document.createElement('div');
					tooltip.style.border = '1px solid';
					tooltip.style.padding = '4px';
					tooltip.style.margin = '0px -4px';
					tooltip.id = 'CMTooltipBorder';
					tooltip.className = CM.Disp.colorTextPre + CM.Disp.colorGray;

					var header = function(text) {
						var div = document.createElement('div');
						div.style.fontWeight = 'bold';
						div.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
						div.textContent = text;
						return div;
					}

					tooltip.appendChild(header('Time Left'));
					var time = document.createElement('div');
					time.id = 'CMTooltipTime';
					tooltip.appendChild(time);
					var timeColor = CM.Disp.GetTimeColor(spellCost, minigame.magic, undefined, CM.Disp.CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost));
					time.textContent = timeColor.text;
					time.className = CM.Disp.colorTextPre + timeColor.color;

					if (spellCost <= minigame.magic) {
						tooltip.appendChild(header('Recover Time'));
						var recover = document.createElement('div');
						recover.id = 'CMTooltipRecover';
						tooltip.appendChild(recover);
						var recoverColor = CM.Disp.GetTimeColor(minigame.magic, Math.max(0, minigame.magic - spellCost), undefined, CM.Disp.CalculateGrimoireRefillTime(Math.max(0, minigame.magic - spellCost), minigame.magicM, minigame.magic));
						recover.textContent = recoverColor.text;
						recover.className = CM.Disp.colorTextPre + recoverColor.color;
					}

					l('CMTooltipArea').appendChild(tooltip);
				}
			}
		}
		else {
			CM.Disp.TooltipWarnCaut.style.display = 'none';
		}
	}
}

CM.Disp.DrawTooltipWarnCaut = function() {
	if (CM.Config.ToolWarnCaut == 1) {
		l('CMDispTooltipWarn').style.opacity = '0';
		l('CMDispTooltipCaut').style.opacity = '0';
	}
}

CM.Disp.UpdateTooltipWarnCaut = function() {
	if (CM.Config.ToolWarnCaut == 1 && l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		l('CMDispTooltipWarn').style.opacity = '1';
		l('CMDispTooltipCaut').style.opacity = '1';
	}
}

CM.Disp.AddWrinklerAreaDetect = function() {
	l('backgroundLeftCanvas').onmouseover = function() {CM.Disp.TooltipWrinklerArea = 1;};
	l('backgroundLeftCanvas').onmouseout = function() {
		CM.Disp.TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (var i in Game.wrinklers) {
			CM.Disp.TooltipWrinklerCache[i] = 0;
		}
	};
}

CM.Disp.CheckWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && CM.Disp.TooltipWrinklerArea == 1) {
		var showingTooltip = false;
		for (var i in Game.wrinklers) {
			var me = Game.wrinklers[i];
			if (me.phase > 0 && me.selected) {
				showingTooltip = true;
				if (CM.Disp.TooltipWrinklerCache[i] == 0) {
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
					CM.Disp.TooltipWrinklerCache[i] = 1;
				}
				else break;
			}
			else {
				CM.Disp.TooltipWrinklerCache[i] = 0;
			}
		}
		if (!showingTooltip) {
			Game.tooltip.hide();
		}
	}
}

CM.Disp.UpdateWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && l('CMTooltipWrinkler') != null) {
		var sucked = Game.wrinklers[CM.Disp.TooltipWrinkler].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[CM.Disp.TooltipWrinkler].type == 1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		if (Game.hasGod) {
			var godLvl = Game.hasGod('scorn');
			if (godLvl == 1) sucked *= 1.15;
			else if (godLvl == 2) sucked *= 1.1;
			else if (godLvl == 3) sucked *= 1.05;
		}
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
	}
}

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

CM.Disp.ToggleSayTime = function() {
	if (CM.Config.SayTime == 1) {
		Game.sayTime = CM.Disp.sayTime;
	}
	else {
		Game.sayTime = CM.Backup.sayTime;
	}
}

CM.Disp.RefreshScale = function() {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	CM.Disp.UpdateBotBarOther();
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();
}

CM.Disp.colorTextPre = 'CMText';
CM.Disp.colorBackPre = 'CMBack';
CM.Disp.colorBorderPre = 'CMBorder';
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
CM.Disp.buffColors = {'Frenzy': CM.Disp.colorYellow, 'Dragon Harvest': CM.Disp.colorBrown, 'Elder frenzy': CM.Disp.colorGreen, 'Clot': CM.Disp.colorRed, 'Click frenzy': CM.Disp.colorBlue, 'Dragonflight': CM.Disp.colorPink};
CM.Disp.lastGoldenCookieState = 0;
CM.Disp.lastTickerFortuneState = 0;
CM.Disp.lastSeasonPopupState = 0;
CM.Disp.lastGardenNextStep = 0;
CM.Disp.goldenShimmer;
CM.Disp.seasonPopShimmer;
CM.Disp.lastAscendState = -1;

CM.Disp.cookieTimes = [10, 15, 30, 60, 300, 600, 900, 1800];
CM.Disp.clickTimes = [1, 5, 10, 15, 30];

CM.Disp.metric = ['M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
CM.Disp.shortScale = ['M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec', 'Quattuordec', 'Quindec', 'Sexdec', 'Septendec', 'Octodec', 'Novemdec', 'Vigint', 'Unvigint', 'Duovigint', 'Trevigint', 'Quattuorvigint'];

CM.Disp.TooltipWrinklerArea = 0;
CM.Disp.TooltipWrinkler = -1;
CM.Disp.TooltipWrinklerCache = [];
for (var i in Game.wrinklers) {
	CM.Disp.TooltipWrinklerCache[i] = 0;
}

CM.Disp.TooltipText = [
	['GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px'], 
	['PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '320px'], 
	['NextPrestTooltipPlaceholder', 'Calculated with cookies gained from wrinklers and Chocolate egg', '200px'], 
	['HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '330px'], 
	['ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from reset achievements if you have the same buildings/upgrades after reset', '370px'], 
	['ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all buildings with Earth Shatterer and Reality Bending auras, and then buying Chocolate egg', '300px']
];

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
		CM.Disp.DrawTooltipWarnCaut();
	}

	CM.Backup.tooltip.update = Game.tooltip.update;
	eval('CM.Backup.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this.').join('Game.tooltip.'));
	Game.tooltip.update = function() {
		CM.Backup.tooltip.updateMod();
		CM.Disp.UpdateTooltipWarnCaut();
		CM.Disp.UpdateTooltipLocation();
	}

	CM.Backup.UpdateWrinklers = Game.UpdateWrinklers;
	Game.UpdateWrinklers = function() {
		CM.Disp.FixMouseY(CM.Backup.UpdateWrinklers);
	}

	CM.Backup.UpdateSpecial = Game.UpdateSpecial;
	Game.UpdateSpecial = function() {
		CM.Disp.FixMouseY(CM.Backup.UpdateSpecial);
	}

	// Assumes newer browsers
	l('bigCookie').removeEventListener('click', Game.ClickCookie, false);
	l('bigCookie').addEventListener('click', function() { CM.Disp.FixMouseY(Game.ClickCookie); }, false);

	// Probably better to load per minigame
	CM.Backup.scriptLoaded = Game.scriptLoaded;
	Game.scriptLoaded = function(who, script) {
		CM.Backup.scriptLoaded(who, script);
		CM.Disp.AddTooltipGrimoire()
		CM.ReplaceNativeGrimoire();
	}

	CM.Backup.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function() {
		CM.Backup.RebuildUpgrades();
		CM.Disp.AddTooltipUpgrade();
		Game.CalculateGains();
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
		CM.Disp.UpdateBotBarOther();
		CM.Disp.UpdateBuildings();
		CM.Disp.UpdateUpgrades();

		// Redraw timers
		CM.Disp.UpdateBotBarTime();
		CM.Disp.UpdateTimerBar();

		// Update Tooltip
		CM.Disp.UpdateTooltip();

		// Update Wrinkler Tooltip
		CM.Disp.CheckWrinklerTooltip();
		CM.Disp.UpdateWrinklerTooltip();

		// Change menu refresh interval
		CM.Disp.RefreshMenu();
	}

	// Check Golden Cookies
	CM.Disp.CheckGoldenCookie();

	// Check Fortune Cookies
	CM.Disp.CheckTickerFortune();

	// Check Season Popup
	CM.Disp.CheckSeasonPopup();

	// Check Garden Tick
	CM.Disp.CheckGardenTick();

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
	CM.Disp.CreateGCTimer();
	for (var i in CM.Disp.TooltipText) {
		CM.Disp.CreateTooltip(CM.Disp.TooltipText[i][0], CM.Disp.TooltipText[i][1], CM.Disp.TooltipText[i][2]);
	}
	CM.Disp.CreateTooltipWarnCaut();
	CM.Disp.AddTooltipBuild();
	CM.Disp.AddTooltipGrimoire();
	CM.Disp.AddTooltipLump();
	CM.Disp.AddWrinklerAreaDetect();
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

	Game.Win('Third-party');
}

CM.HasReplaceNativeGrimoireLaunch = false;
CM.HasReplaceNativeGrimoireDraw = false;

CM.ConfigDefault = {
	BotBar: 1, 
	TimerBar: 1, 
	TimerBarPos: 0, 
	BuildColor: 1, 
	BulkBuildColor: 0, 
	UpBarColor: 1, 
	UpgradeBarFixedPos: 1,
	CalcWrink: 0, 
	CPSMode: 1, 
	AvgCPSHist: 3, 
	AvgClicksHist: 0, 
	ToolWarnCautBon: 0, 
	GCFlash: 1, 
	GCSound: 1,  
	GCVolume: 100, 
	GCSoundURL: 'https://freesound.org/data/previews/66/66717_931655-lq.mp3', 
	GCTimer: 1, 
	Favicon: 1, 
	FortuneFlash: 1, 
	FortuneSound: 1,  
	FortuneVolume: 100, 
	FortuneSoundURL: 'https://freesound.org/data/previews/174/174027_3242494-lq.mp3',
	SeaFlash: 1, 
	SeaSound: 1,  
	SeaVolume: 100, 
	SeaSoundURL: 'https://www.freesound.org/data/previews/121/121099_2193266-lq.mp3', 
	GardFlash: 1, 
	GardSound: 1,  
	GardVolume: 100, 
	GardSoundURL: 'https://freesound.org/data/previews/103/103046_861714-lq.mp3', 
	Title: 1, 
	TooltipBuildUp: 1, 
	TooltipAmor: 0, 
	ToolWarnCaut: 1, 
	ToolWarnCautPos: 1, 
	TooltipGrim:1, 
	ToolWrink: 1, 
	TooltipLump: 1,
	Stats: 1, 
	UpStats: 1, 
	TimeFormat: 0, 
	SayTime: 1, 
	GrimoireBar: 1, 
	Scale: 2, 
	StatsPref: {Lucky: 1, Chain: 1, Prestige: 1, Wrink: 1, Sea: 1, Misc: 1}, 
	Colors : {Blue: '#4bb8f0', Green: '#00ff00', Yellow: '#ffff00', Orange: '#ff7f00', Red: '#ff0000', Purple: '#ff00ff', Gray: '#b3b3b3', Pink: '#ff1493', Brown: '#8b4513'},
	SortBuildings: 0,
	SortUpgrades: 0
};
CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '2.031';
CM.VersionMinor = '1';

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

CM.Sim.BuildingSell = function(build, basePrice, start, free, amount, emuAura) {
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

	var moni=0;
	for (var i = 0; i < amount; i++) {
		var price = basePrice * Math.pow(Game.priceIncrease, Math.max(0, start - free));
		price = Game.modifyBuildingPrice(build, price);
		price = Math.ceil(price);
		var giveBack = 0.25;
		if (emuAura) {
			giveBack = 0.5;
		}
		else {
			giveBack *= 1 + Game.auraMult('Earth Shatterer');
		}
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

CM.Sim.hasAura = function(what) {
	if (Game.dragonAuras[CM.Sim.dragonAura].name == what || Game.dragonAuras[CM.Sim.dragonAura2].name == what)
		return true;
	else
		return false;
}

CM.Sim.auraMult = function(what) {
	var n = 0;
	if (Game.dragonAuras[CM.Sim.dragonAura].name == what || Game.dragonAuras[CM.Sim.dragonAura2].name == what)
		n = 1;
	if (Game.dragonAuras[CM.Sim.dragonAura].name == 'Reality Bending' || Game.dragonAuras[CM.Sim.dragonAura2].name == 'Reality Bending')
		n += 0.1;
	return n;
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

CM.Sim.InitData = function() {
	// Buildings
	CM.Sim.Objects = [];
	for (var i in Game.Objects) {
		CM.Sim.Objects[i] = {};
		var me = Game.Objects[i];
		var you = CM.Sim.Objects[i];
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
	}

	// Upgrades
	CM.Sim.Upgrades = [];
	for (var i in Game.Upgrades) {
		CM.Sim.Upgrades[i] = {};
	}

	// Achievements
	CM.Sim.Achievements = [];
	for (var i in Game.Achievements) {
		CM.Sim.Achievements[i] = {};
	}
}

CM.Sim.CopyData = function() {
	// Other variables
	CM.Sim.UpgradesOwned = Game.UpgradesOwned;
	CM.Sim.pledges = Game.pledges;
	CM.Sim.AchievementsOwned = Game.AchievementsOwned;
	CM.Sim.heavenlyPower = Game.heavenlyPower; // Unneeded?
	CM.Sim.prestige = Game.prestige;
	CM.Sim.dragonAura = Game.dragonAura;
	CM.Sim.dragonAura2 = Game.dragonAura2;

	// Buildings
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		var you = CM.Sim.Objects[i];
		you.amount = me.amount;
		you.level = me.level;
	}

	// Upgrades
	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		var you = CM.Sim.Upgrades[i];
		you.bought = me.bought;
	}

	// Achievements
	for (var i in Game.Achievements) {
		var me = Game.Achievements[i];
		var you = CM.Sim.Achievements[i];
		you.won = me.won;
	}
};


CM.Sim.CalculateGains = function() {
	CM.Sim.cookiesPs = 0;
	var mult = 1;
	
	if (Game.ascensionMode != 1) mult += parseFloat(CM.Sim.prestige) * 0.01 * CM.Sim.heavenlyPower * CM.Sim.GetHeavenlyMultiplier();
	
	// TODO Store minigame buffs?
	mult *= Game.eff('cps');
	
	if (CM.Sim.Has('Heralds') && Game.ascensionMode != 1) mult *= 1 + 0.01 * Game.heralds;

	var cookieMult = 0;
	for (var i in Game.cookieUpgrades) {
		var me = Game.cookieUpgrades[i];
		if (CM.Sim.Has(me.name)) {
			mult *= (1 + (typeof(me.power) == 'function' ? me.power(me) : me.power) * 0.01);
		}
	}

	mult *= (1 + 0.01 * cookieMult);
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

	var buildMult = 1;
	if (Game.hasGod) {
		var godLvl = Game.hasGod('asceticism');
		if (godLvl == 1) mult *= 1.15;
		else if (godLvl == 2) mult *= 1.1;
		else if (godLvl == 3) mult *= 1.05;

		var godLvl = Game.hasGod('ages');
		if (godLvl == 1) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 3)) * Math.PI * 2);
		else if (godLvl == 2) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 12)) * Math.PI*2);
		else if (godLvl == 3) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 24)) * Math.PI*2);

		var godLvl = Game.hasGod('decadence');
		if (godLvl == 1) buildMult *= 0.93;
		else if (godLvl == 2) buildMult *= 0.95;
		else if (godLvl == 3) buildMult *= 0.98;

		var godLvl = Game.hasGod('industry');
		if (godLvl == 1) buildMult *= 1.1;
		else if (godLvl == 2) buildMult *= 1.06;
		else if (godLvl == 3) buildMult *= 1.03;

		var godLvl = Game.hasGod('labor');
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
	if (Game.hasGod) {
		var godLvl = Game.hasGod('mother');
		if (godLvl == 1) milkMult *= 1.1;
		else if (godLvl == 2) milkMult *= 1.05;
		else if (godLvl == 3) milkMult *= 1.03;
	}
	// TODO Store minigame buffs?
	milkMult *= Game.eff('milk');

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

	if (true) { // || CM.Sim.hasAura('Dragon\'s Fortune')) {
		var n = Game.shimmerTypes['golden'].n;
		var auraMult = CM.Sim.auraMult('Dragon\'s Fortune');
		for (var i = 0; i < n; i++) {
			mult *= 1 + auraMult * 1.23;
		}
	}

	var rawCookiesPs = CM.Sim.cookiesPs * mult;

	for (var i in Game.CpsAchievements) {
		if (rawCookiesPs >= Game.CpsAchievements[i].threshold) CM.Sim.Win(Game.CpsAchievements[i].name);
	}

	mult *= CM.Sim.getCPSBuffMult();

	// Pointless?
	var name = Game.bakeryName.toLowerCase();
	if (name == 'orteil') mult *= 0.99;
	else if (name == 'ortiel') mult *= 0.98; //or so help me

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
	
	// Removed buffs

	CM.Sim.cookiesPs *= mult;

	// TODO remove?
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

	return (CM.Sim.cookiesPs - curCPS);
}

/**********
 * Footer *
 **********/

CM.Init();
