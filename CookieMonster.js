CM = {};

CM.Data = {};

CM.Sim = {};

CM.Cache = {};

CM.Disp = {};

CM.Backup = {};

CM.Config = {};

CM.ConfigData = {};

/*******
 * Sim *
 *******/

eval('CM.Sim.Has = ' + Game.Has.toString().split('Game').join('CM.Sim'));

CM.Sim.Win = function(what) {
	if (CM.Sim.Achievements[what]) {
		if (CM.Sim.Achievements[what].won == 0) {
			CM.Sim.Achievements[what].won = 1;
			if (Game.Achievements[what].hide != 3) CM.Sim.AchievementsOwned++;
		}
	}
}

eval('CM.Sim.HasAchiev = ' + Game.HasAchiev.toString().split('Game').join('CM.Sim'));

CM.Sim.CookNeedPrest = function(prestige) {
	return ((Math.pow(((prestige * 2) + 1), 2) - 1) / 8) * 1000000000000;
}

CM.Sim.CopyData = function() {
	// Other variables
	CM.Sim.prestige = Game.prestige['Heavenly chips'];
	CM.Sim.UpgradesOwned = Game.UpgradesOwned;
	CM.Sim.pledges = Game.pledges;
	CM.Sim.AchievementsOwned = Game.AchievementsOwned;
	
	// Buildings
	CM.Sim.Objects = [];
	for (var i in Game.Objects) {
		CM.Sim.Objects[i] = {};
		var me = Game.Objects[i];
		var you = CM.Sim.Objects[i];
		you.amount = me.amount;
		eval('you.cps = ' + me.cps.toString().split('Game.Has').join('CM.Sim.Has').split('Game.Objects').join('CM.Sim.Objects'));		
		you.name = me.name; // Needed for above eval!
	}

	// Upgrades
	CM.Sim.Upgrades = [];
	for (var i in Game.Upgrades) {
		CM.Sim.Upgrades[i] = {};
		var me = Game.Upgrades[i];
		var you = CM.Sim.Upgrades[i];
		you.bought = me.bought;
	}

	// Achievements
	CM.Sim.Achievements = [];
	for (var i in Game.Achievements) {
		CM.Sim.Achievements[i] = {};
		var me = Game.Achievements[i];
		var you = CM.Sim.Achievements[i];
		you.won = me.won;
	}
};


CM.Sim.CalculateGains = function() {
	CM.Sim.cookiesPs = 0;
	var mult = 1;
	for (var i in CM.Sim.Upgrades) {
		var me = CM.Sim.Upgrades[i];
		if (me.bought > 0) {
			if (Game.Upgrades[i].type == 'cookie' && CM.Sim.Has(Game.Upgrades[i].name)) mult += Game.Upgrades[i].power * 0.01;
		}
	}
	mult += CM.Sim.Has('Specialized chocolate chips') * 0.01;
	mult += CM.Sim.Has('Designer cocoa beans') * 0.02;
	mult += CM.Sim.Has('Underworld ovens') * 0.03;
	mult += CM.Sim.Has('Exotic nuts') * 0.04;
	mult += CM.Sim.Has('Arcane sugar') * 0.05;

	if (CM.Sim.Has('Increased merriness')) mult += 0.15;
	if (CM.Sim.Has('Improved jolliness')) mult += 0.15;
	if (CM.Sim.Has('A lump of coal')) mult += 0.01;
	if (CM.Sim.Has('An itchy sweater')) mult += 0.01;
	if (CM.Sim.Has('Santa\'s dominion')) mult += 0.5;

	if (CM.Sim.Has('Santa\'s legacy')) mult += (Game.santaLevel + 1) * 0.1;

	var heavenlyMult = 0;
	if (CM.Sim.Has('Heavenly chip secret')) heavenlyMult += 0.05;
	if (CM.Sim.Has('Heavenly cookie stand')) heavenlyMult += 0.20;
	if (CM.Sim.Has('Heavenly bakery')) heavenlyMult += 0.25;
	if (CM.Sim.Has('Heavenly confectionery')) heavenlyMult += 0.25;
	if (CM.Sim.Has('Heavenly key')) heavenlyMult += 0.25;
	mult += parseFloat(CM.Sim.prestige) * 0.02 * heavenlyMult;

	for (var i in CM.Sim.Objects) {
		var me = CM.Sim.Objects[i];
		me.storedCps = (typeof(me.cps) == 'function' ? me.cps() : me.cps);
		me.storedTotalCps = me.amount * me.storedCps;
		CM.Sim.cookiesPs += me.storedTotalCps;
	}

	if (CM.Sim.Has('"egg"')) CM.Sim.cookiesPs += 9; // "egg"

	var milkMult = CM.Sim.Has('Santa\'s milk and cookies') ? 1.05 : 1;
	if (CM.Sim.Has('Kitten helpers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.05 * milkMult);
	if (CM.Sim.Has('Kitten workers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.1 * milkMult);
	if (CM.Sim.Has('Kitten engineers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten overseers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten managers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);

	var eggMult = 0;
	if (CM.Sim.Has('Chicken egg')) eggMult++;
	if (CM.Sim.Has('Duck egg')) eggMult++;
	if (CM.Sim.Has('Turkey egg')) eggMult++;
	if (CM.Sim.Has('Quail egg')) eggMult++;
	if (CM.Sim.Has('Robin egg')) eggMult++;
	if (CM.Sim.Has('Ostrich egg')) eggMult++;
	if (CM.Sim.Has('Cassowary egg')) eggMult++;
	if (CM.Sim.Has('Salmon roe')) eggMult++;
	if (CM.Sim.Has('Frogspawn')) eggMult++;
	if (CM.Sim.Has('Shark egg')) eggMult++;
	if (CM.Sim.Has('Turtle egg')) eggMult++;
	if (CM.Sim.Has('Ant larva')) eggMult++;
	if (CM.Sim.Has('Century egg')) {
		// The boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day = Math.floor((CM.Sim.Date - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day,100);
		eggMult += (1 - Math.pow(1 - day / 100, 3)) * 10;
	}
	mult *= (1 + 0.01 * eggMult);

	var rawCookiesPs = CM.Sim.cookiesPs * mult;
	for (var i = 0; i < Game.cpsAchievs.length / 2; i++) {
		if (rawCookiesPs >= Game.cpsAchievs[i * 2 + 1]) CM.Sim.Win(Game.cpsAchievs[i * 2]);
	}

	if (Game.frenzy > 0) mult *= Game.frenzyPower;

	if (CM.Sim.Has('Elder Covenant')) mult *= 0.95;

	CM.Sim.globalCpsMult = mult;
	CM.Sim.cookiesPs *= CM.Sim.globalCpsMult;			
};

CM.Sim.CheckOtherAchiev = function() {
	var grandmas=0;
	if (CM.Sim.Has('Farmer grandmas')) grandmas++;
	if (CM.Sim.Has('Worker grandmas')) grandmas++;
	if (CM.Sim.Has('Miner grandmas')) grandmas++;
	if (CM.Sim.Has('Cosmic grandmas')) grandmas++;
	if (CM.Sim.Has('Transmuted grandmas')) grandmas++;
	if (CM.Sim.Has('Altered grandmas')) grandmas++;
	if (CM.Sim.Has('Grandmas\' grandmas')) grandmas++;
	if (CM.Sim.Has('Antigrandmas')) grandmas++;
	if (CM.Sim.Has('Rainbow grandmas')) grandmas++;
	if (!CM.Sim.HasAchiev('Elder') && grandmas >= 7) CM.Sim.Win('Elder');

	var buildingsOwned = 0;
	var oneOfEach = 1;
	var mathematician = 1;
	var base10 = 1;
	var centennial = 1;
	var centennialhalf = 1;
	var bicentennial = 1;
	for (var i in CM.Sim.Objects) {
		buildingsOwned += CM.Sim.Objects[i].amount;
		if (!CM.Sim.HasAchiev('One with everything')) {
			if (CM.Sim.Objects[i].amount == 0) oneOfEach = 0;
		}
		if (!CM.Sim.HasAchiev('Mathematician')) {
			if (CM.Sim.Objects[i].amount < Math.min(128, Math.pow(2, (Game.ObjectsById.length - Game.Objects[i].id) - 1))) mathematician = 0;
		}
		if (!CM.Sim.HasAchiev('Base 10')) {
			if (CM.Sim.Objects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id)*10) base10 = 0;
		}
		if (!CM.Sim.HasAchiev('Centennial')) {
			if (CM.Sim.Objects[i].amount < 100) centennial = 0;
		}
		if (!CM.Sim.HasAchiev('Centennial and a half')) {
			if (CM.Sim.Objects[i].amount < 150) centennialhalf = 0;
		}
		if (!CM.Sim.HasAchiev('Bicentennial')) {
			if (CM.Sim.Objects[i].amount < 200) bicentennial = 0;
		}
	}
	if (oneOfEach == 1) CM.Sim.Win('One with everything');
	if (mathematician == 1) CM.Sim.Win('Mathematician');
	if (base10 == 1) CM.Sim.Win('Base 10');
	if (centennial == 1) CM.Sim.Win('Centennial');
	if (centennialhalf == 1) CM.Sim.Win('Centennial and a half');
	if (bicentennial == 1) CM.Sim.Win('Bicentennial');

	if (buildingsOwned >= 100) CM.Sim.Win('Builder');
	if (buildingsOwned >= 400) CM.Sim.Win('Architect');
	if (buildingsOwned >= 800) CM.Sim.Win('Engineer');
	if (buildingsOwned >= 1500) CM.Sim.Win('Lord of Constructs');
	
	if (CM.Sim.UpgradesOwned >= 20) CM.Sim.Win('Enhancer');
	if (CM.Sim.UpgradesOwned >= 50) CM.Sim.Win('Augmenter');
	if (CM.Sim.UpgradesOwned >= 100) CM.Sim.Win('Upgrader');
	if (CM.Sim.UpgradesOwned >= 150) CM.Sim.Win('Lord of Progress');
	
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
}

CM.Sim.BuyBuildings = function() {	
	CM.Cache.Objects = [];
	for (var i in Game.Objects) {
		CM.Sim.CopyData();
		var me = CM.Sim.Objects[i];
		me.amount++;
		
		if (i == 'Cursor') {
			if (me.amount >= 1) CM.Sim.Win('Click');
			if (me.amount >= 2) CM.Sim.Win('Double-click');
			if (me.amount >= 50) CM.Sim.Win('Mouse wheel');
			if (me.amount >= 100) CM.Sim.Win('Of Mice and Men');
			if (me.amount >= 200) CM.Sim.Win('The Digital');
			if (me.amount >= 300) CM.Sim.Win('Extreme polydactyly');
			if (me.amount >= 400) CM.Sim.Win('Dr. T');
		}
		else if (i == 'Grandma') {
			if (me.amount >= 1) CM.Sim.Win('Grandma\'s cookies');
			if (me.amount >= 50) CM.Sim.Win('Sloppy kisses');
			if (me.amount >= 100) CM.Sim.Win('Retirement home');
			if (me.amount >= 150) CM.Sim.Win('Friend of the ancients');
			if (me.amount >= 200) CM.Sim.Win('Ruler of the ancients');
			if (me.amount >= 250) CM.Sim.Win('The old never bothered me anyway');
		}
		else if (i == 'Farm') {
			if (me.amount >= 1) CM.Sim.Win('My first farm');
			if (me.amount >= 50) CM.Sim.Win('Reap what you sow');
			if (me.amount >= 100) CM.Sim.Win('Farm ill');
			if (me.amount >= 150) CM.Sim.Win('Perfected agriculture');
			if (me.amount >= 200) CM.Sim.Win('Homegrown');
		}
		else if (i == 'Factory') {
			if (me.amount >= 1) CM.Sim.Win('Production chain');
			if (me.amount >= 50) CM.Sim.Win('Industrial revolution');
			if (me.amount >= 100) CM.Sim.Win('Global warming');
			if (me.amount >= 150) CM.Sim.Win('Ultimate automation');
			if (me.amount >= 200) CM.Sim.Win('Technocracy');
		}
		else if (i == 'Mine') {
			if (me.amount >= 1) CM.Sim.Win('You know the drill');
			if (me.amount >= 50) CM.Sim.Win('Excavation site');
			if (me.amount >= 100) CM.Sim.Win('Hollow the planet');
			if (me.amount >= 150) CM.Sim.Win('Can you dig it');
			if (me.amount >= 200) CM.Sim.Win('The center of the Earth');
		}
		else if (i == 'Shipment') {
			if (me.amount >= 1) CM.Sim.Win('Expedition');
			if (me.amount >= 50) CM.Sim.Win('Galactic highway');
			if (me.amount >= 100) CM.Sim.Win('Far far away');
			if (me.amount >= 150) CM.Sim.Win('Type II civilization');
			if (me.amount >= 200) CM.Sim.Win('We come in peace');
		}
		else if (i == 'Alchemy lab') {
			if (me.amount >= 1) CM.Sim.Win('Transmutation');
			if (me.amount >= 50) CM.Sim.Win('Transmogrification');
			if (me.amount >= 100) CM.Sim.Win('Gold member');
			if (me.amount >= 150) CM.Sim.Win('Gild wars');
			if (me.amount >= 200) CM.Sim.Win('The secrets of the universe');
		}
		else if (i == 'Portal') {
			if (me.amount >= 1) CM.Sim.Win('A whole new world');
			if (me.amount >= 50) CM.Sim.Win('Now you\'re thinking');
			if (me.amount >= 100) CM.Sim.Win('Dimensional shift');
			if (me.amount >= 150) CM.Sim.Win('Brain-split');
			if (me.amount >= 200) CM.Sim.Win('Realm of the Mad God');
		}
		else if (i == 'Time machine') {
			if (me.amount >= 1) CM.Sim.Win('Time warp');
			if (me.amount >= 50) CM.Sim.Win('Alternate timeline');
			if (me.amount >= 100) CM.Sim.Win('Rewriting history');
			if (me.amount >= 150) CM.Sim.Win('Time duke');
			if (me.amount >= 200) CM.Sim.Win('Forever and ever');
		}
		else if (i == 'Antimatter condenser') {
			if (me.amount >= 1) CM.Sim.Win('Antibatter');
			if (me.amount >= 50) CM.Sim.Win('Quirky quarks');
			if (me.amount >= 100) CM.Sim.Win('It does matter!');
			if (me.amount >= 150) CM.Sim.Win('Molecular maestro');
			if (me.amount >= 200) CM.Sim.Win('Walk the planck');
		}
		else if (i == 'Prism') {
			if (me.amount >= 1) CM.Sim.Win('Lone photon');
			if (me.amount >= 50) CM.Sim.Win('Dazzling glimmer');
			if (me.amount >= 100) CM.Sim.Win('Blinding flash');
			if (me.amount >= 150) CM.Sim.Win('Unending glow');
			if (me.amount >= 200) CM.Sim.Win('Rise and shine');
		}
		
		var lastAchievementsOwned = CM.Sim.AchievementsOwned;
		
		CM.Sim.CalculateGains();
		
		CM.Sim.CheckOtherAchiev();
		
		if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
			CM.Sim.CalculateGains();
		}
		
		CM.Cache.Objects[i] = {};
		CM.Cache.Objects[i].bonus = CM.Sim.cookiesPs - Game.cookiesPs;
	}
}

CM.Sim.BuyUpgrades = function() {
	CM.Cache.Upgrades = [];
	for (var i in Game.Upgrades) {
		if (Game.Upgrades[i].bought == 0 && Game.Upgrades[i].unlocked) {
			CM.Sim.CopyData();
			var me = CM.Sim.Upgrades[i];
			me.bought = 1;
			if (Game.Upgrades[i].hide != 3) CM.Sim.UpgradesOwned++;

			if (i == 'Elder Pledge') {
				CM.Sim.pledges++;
				if (CM.Sim.pledges > 0) CM.Sim.Win('Elder nap');
				if (CM.Sim.pledges >= 5) CM.Sim.Win('Elder slumber');
			}
			else if (i == 'Elder Covenant') {
				CM.Sim.Win('Elder calm')
			}
			else if (i == 'Eternal heart biscuits') {
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
	//CM.Sim.DoUpgradesSim = 0;
}

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

CM.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		CM.Cache.SeaSpec = Math.max(25, Game.cookiesPs * 60 * 1);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
}

/********
 * Disp *
 ********/

CM.Disp.FormatTime = function(time, format) {
	if (time == 'Infinity') return time;
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
	
	return str;
}

CM.Disp.GetTimeColor = function(price) {
	var color;
	var text;
	if (Game.cookies >= price) {
		color = CM.Disp.colorGreen;
		text = 'Done!';
	}
	else {
		var time = (price - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked));
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
	return { text : text, color : color };
}

CM.Disp.Beautify = function(num) {
	if (CM.Config.Scale != 0 && isFinite(num)) {
		var answer = '';
		var negative = false;
		if (num < 0) {
			num = Math.abs(num);
			negative = true;
		}
				
		for (var i = (CM.Disp.shortScale.length - 1); i >= 0; i--) {
			if (i < CM.Disp.metric.length && CM.Config.Scale == 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + CM.Disp.metric[i];
					break;
				}
			}
			else if (CM.Config.Scale > 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000) + (CM.Config.Scale == 2 ? (' ' + CM.Disp.shortScale[i]) : ('e+' + ((i + 2) * 3)));
					break;
				}
			}
		}
		if (answer == '') {
			answer = CM.Backup.Beautify(num);
		}
		
		if (negative) {
			answer = '-' + answer;
		}
		return answer;
	}
	else {
		return CM.Backup.Beautify(num);
	}
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
	
	var str = '<table style=\'width: 100%; text-align: center; white-space: nowrap;\'>';
	var type = '<tr style=\'font-weight: bold;\'><td style=\'text-align: right; color: ' + CM.Disp.colorYellow +';\'>' + CM.VersionMajor + '.' + CM.VersionMinor + '</td>';
	var bonus = '<tr><td style=\'text-align: right; color: ' + CM.Disp.colorBlue +';\'>Bonus Income</td>';
	var bci = '<tr><td style=\'text-align: right; color: ' + CM.Disp.colorBlue +';\'>Base Cost Per Income</td>';
	var time = '<tr><td style=\'text-align: right; color: ' + CM.Disp.colorBlue +';\'>Time Left</td>';
	
	for (var i in Game.Objects) {
		type += '<td>' + (i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' (<span style=\'color: ' + CM.Disp.colorBlue +';\'></span>)</td>';
		bonus += '<td></td>';
		bci += '<td></td>';
		time += '<td></td>';
	}
	
	type += '</tr>';
	bonus += '</tr>';
	bci += '</tr>';
	time += '</tr>';
	str += type + bonus + bci + time + '</table>';

	CM.Disp.BotBar.innerHTML = str;
	
	l('wrapper').appendChild(CM.Disp.BotBar);
};

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
			CM.Disp.BotBar.firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].innerHTML = Game.Objects[i].amount;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[1].childNodes[count].innerHTML = Beautify(CM.Cache.Objects[i].bonus, 2);
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].style.color = CM.Cache.Objects[i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].innerHTML = Beautify(CM.Cache.Objects[i].bci, 2);
		}
	}
}

CM.Disp.UpdateBotBarTime = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;
	
		for (var i in CM.Cache.Objects) {
			count++;
			var timeColor = CM.Disp.GetTimeColor(Game.Objects[i].getPrice());
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].style.color = timeColor.color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].innerHTML = timeColor.text;
		}
	}
}

CM.Disp.CreateTimerBar = function() {
	CM.Disp.TimerBar = document.createElement('div');
	CM.Disp.TimerBar.id = 'CMTimerBar';
	CM.Disp.TimerBar.style.position = 'absolute';
	CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.TimerBar.style.bottom = '0px';
	CM.Disp.TimerBar.style.height = '48px';
	CM.Disp.TimerBar.style.width = '100%';
	CM.Disp.TimerBar.style.fontSize = '10px';
	CM.Disp.TimerBar.style.fontWeight = 'bold';
	CM.Disp.TimerBar.style.backgroundColor = 'black';
	
	CM.Disp.TimerBarGC = document.createElement('div');
	CM.Disp.TimerBarGC.id = 'CMTimerBarGC';
	CM.Disp.TimerBarGC.style.height = '12px';
	CM.Disp.TimerBarGC.style.margin = '0px 10px';
	CM.Disp.TimerBarGC.style.position = 'relative';
	CM.Disp.TimerBarGC.innerHTML = '<div style=\'width: 100%; height: 10px; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;\'><span style=\'display: inline-block; text-align: right; width: 71px; margin-right: 5px; vertical-align: text-top;\'>Next Cookie</span><span id=\'CMTimerBarGCMinBar\' style=\'background-color: ' + CM.Disp.colorGray + '; display: inline-block; height: 10px;\'></span><span id=\'CMTimerBarGCBar\' style=\'background-color: ' + CM.Disp.colorPurple + '; display: inline-block; height: 10px;\'></span><span id=\'CMTimerBarGCTime\' style=\'margin-left: 5px; vertical-align: text-top;\'></span></div>';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarGC);
	
	CM.Disp.TimerBarRen = document.createElement('div');
	CM.Disp.TimerBarRen.id = 'CMTimerBarRen';
	CM.Disp.TimerBarRen.style.height = '12px';
	CM.Disp.TimerBarRen.style.margin = '0px 10px';
	CM.Disp.TimerBarRen.style.position = 'relative';
	CM.Disp.TimerBarRen.innerHTML = '<div style=\'width: 100%; height: 10px; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;\'><span style=\'display: inline-block; text-align: right; width: 71px; margin-right: 5px; vertical-align: text-top;\'>Next Reindeer</span><span id=\'CMTimerBarRenMinBar\' style=\'background-color: ' + CM.Disp.colorGray + '; display: inline-block; height: 10px;\'></span><span id=\'CMTimerBarRenBar\' style=\'background-color: ' + CM.Disp.colorOrange + '; display: inline-block; height: 10px;\'></span><span id=\'CMTimerBarRenTime\' style=\'margin-left: 5px; vertical-align: text-top;\'></span></div>';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarRen);
	
	CM.Disp.TimerBarFren = document.createElement('div');
	CM.Disp.TimerBarFren.id = 'CMTimerBarFren';
	CM.Disp.TimerBarFren.style.height = '12px';
	CM.Disp.TimerBarFren.style.margin = '0px 10px';
	CM.Disp.TimerBarFren.style.position = 'relative';
	CM.Disp.TimerBarFren.innerHTML = '<div style=\'width: 100%; height: 10px; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;\'><span id=\'CMTimerBarFrenType\' style=\'display: inline-block; text-align: right; width: 71px; margin-right: 5px; vertical-align: text-top;\'></span><span id=\'CMTimerBarFrenBar\' style=\'display: inline-block; height: 10px;\'></span><span id=\'CMTimerBarFrenTime\' style=\'margin-left: 5px; vertical-align: text-top;\'></span></div>';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarFren);
	
	CM.Disp.TimerBarCF = document.createElement('div');
	CM.Disp.TimerBarCF.id = 'CMTimerBarCF';
	CM.Disp.TimerBarCF.style.height = '12px';
	CM.Disp.TimerBarCF.style.margin = '0px 10px';
	CM.Disp.TimerBarCF.style.position = 'relative';
	CM.Disp.TimerBarCF.innerHTML = '<div style=\'width: 100%; height: 10px; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;\'><span style=\'display: inline-block; text-align: right; width: 71px; margin-right: 5px; vertical-align: text-top;\'>Click Frenzy</span><span id=\'CMTimerBarCFBar\' style=\'background-color: ' + CM.Disp.colorBlue + '; display: inline-block; height: 10px;\'></span><span id=\'CMTimerBarCFTime\' style=\'margin-left: 5px; vertical-align: text-top;\'></span></div>';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarCF);
	
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

CM.Disp.UpdateTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		// label width: 76	timer width: 26 div margin: 20
		var maxWidth = CM.Disp.TimerBar.offsetWidth - 122;
		var count = 0;
		
		if (Game.goldenCookie.life <= 0 && Game.goldenCookie.toDie == 0) {
			CM.Disp.TimerBarGC.style.display = '';
			l('CMTimerBarGCMinBar').style.width = Math.round(Math.max(0, Game.goldenCookie.minTime - Game.goldenCookie.time) * maxWidth / Game.goldenCookie.maxTime) + 'px';
			l('CMTimerBarGCBar').style.width = Math.round(Math.min(Game.goldenCookie.maxTime - Game.goldenCookie.minTime, Game.goldenCookie.maxTime - Game.goldenCookie.time) * maxWidth / Game.goldenCookie.maxTime) + 'px';
			l('CMTimerBarGCTime').innerHTML = Math.ceil((Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarGC.style.display = 'none';
		}
		
		if (Game.season == 'christmas' && Game.seasonPopup.life <= 0 && Game.seasonPopup.toDie == 0) {
			CM.Disp.TimerBarRen.style.display = '';
			l('CMTimerBarRenMinBar').style.width = Math.round(Math.max(0, Game.seasonPopup.minTime - Game.seasonPopup.time) * maxWidth / Game.seasonPopup.maxTime) + 'px';
			l('CMTimerBarRenBar').style.width = Math.round(Math.min(Game.seasonPopup.maxTime - Game.seasonPopup.minTime, Game.seasonPopup.maxTime - Game.seasonPopup.time) * maxWidth / Game.seasonPopup.maxTime) + 'px';
			l('CMTimerBarRenTime').innerHTML = Math.ceil((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarRen.style.display = 'none';
		}
		
		if (Game.frenzy > 0) {
			CM.Disp.TimerBarFren.style.display = '';
			if (Game.frenzyPower == 7) {
				l('CMTimerBarFrenType').innerHTML = 'Frenzy';
				l('CMTimerBarFrenBar').style.backgroundColor = CM.Disp.colorYellow;
			}
			else if (Game.frenzyPower == 0.5) {
				l('CMTimerBarFrenType').innerHTML = 'Clot';
				l('CMTimerBarFrenBar').style.backgroundColor = CM.Disp.colorRed;
			}
			else {
				l('CMTimerBarFrenType').innerHTML = 'Blood Frenzy';
				l('CMTimerBarFrenBar').style.backgroundColor = CM.Disp.colorGreen;
			}
			l('CMTimerBarFrenBar').style.width = Math.round(Game.frenzy * maxWidth / Game.frenzyMax) + 'px';
			l('CMTimerBarFrenTime').innerHTML = Math.ceil(Game.frenzy / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarFren.style.display = 'none';
		}
		
		if (Game.clickFrenzy > 0) {
			CM.Disp.TimerBarCF.style.display = '';
			l('CMTimerBarCFBar').style.width = Math.round(Game.clickFrenzy * maxWidth / Game.clickFrenzyMax) + 'px';
			l('CMTimerBarCFTime').innerHTML = Math.ceil(Game.clickFrenzy / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarCF.style.display = 'none';
		}
		
		if (count != 0) {
			var height = 48 / count;
			CM.Disp.TimerBarGC.style.height = height + 'px';
			CM.Disp.TimerBarRen.style.height = height + 'px';
			CM.Disp.TimerBarFren.style.height = height + 'px';
			CM.Disp.TimerBarCF.style.height = height + 'px';
		}
	}
}

CM.Disp.UpdateBotTimerBarDisplay = function() {
	if (CM.Config.BotBar == 1 && CM.Config.TimerBar == 1) {
		CM.Disp.BotBar.style.bottom = '48px';
		l('game').style.bottom = '104px';
	}
	else if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '56px';
	}
	else if (CM.Config.TimerBar == 1) {
		l('game').style.bottom = '48px';
	}
	else { // No bars
		l('game').style.bottom = '0px';
	}
	
	CM.Disp.UpdateBackground();
}

CM.Disp.UpdateBuildings = function() {
	if (CM.Config.BuildColor == 1) {
		for (var i in CM.Cache.Objects) {
			l('productPrice' + Game.Objects[i].id).style.color = CM.Cache.Objects[i].color;
		}
	}
	else {
		for (var i in CM.Cache.Objects) {
			l('productPrice' + Game.Objects[i].id).style.color = '';
		}
	}
}

CM.Disp.CreateUpgradeBar = function() {
	CM.Disp.UpgradeBar = document.createElement('div');
	CM.Disp.UpgradeBar.id = 'CMUpgradeBar';
	CM.Disp.UpgradeBar.style.width = '100%';
	CM.Disp.UpgradeBar.style.backgroundColor = 'black';
	CM.Disp.UpgradeBar.style.textAlign = 'center';
	CM.Disp.UpgradeBar.style.fontWeight = 'bold';
	CM.Disp.UpgradeBar.style.display = 'none';
	CM.Disp.UpgradeBar.onmouseout = function() { Game.tooltip.hide(); };
	var tooltipText = '<div style=\'min-width: 320px; margin-bottom: 4px;\'><div class=\'name\' style=\'margin-bottom: 4px;\'>Legend</div>';
	tooltipText += '<div style=\'vertical-align: middle;\'><span style=\'background-color: ' + CM.Disp.colorBlue + '; display: inline-block; height: 10px; width: 10px; margin-right: 4px;\'></span>Better than best BCI building</div>';
	tooltipText += '<div style=\'vertical-align: middle;\'><span style=\'background-color: ' + CM.Disp.colorGreen + '; display: inline-block; height: 10px; width: 10px; margin-right: 4px;\'></span>Same as best BCI building</div>';
	tooltipText += '<div style=\'vertical-align: middle;\'><span style=\'background-color: ' + CM.Disp.colorYellow + '; display: inline-block; height: 10px; width: 10px; margin-right: 4px;\'></span>Between best and worst BCI buildings closer to best</div>';
	tooltipText += '<div style=\'vertical-align: middle;\'><span style=\'background-color: ' + CM.Disp.colorOrange + '; display: inline-block; height: 10px; width: 10px; margin-right: 4px;\'></span>Between best and worst BCI buildings closer to worst</div>';
	tooltipText += '<div style=\'vertical-align: middle;\'><span style=\'background-color: ' + CM.Disp.colorRed + '; display: inline-block; height: 10px; width: 10px; margin-right: 4px;\'></span>Same as worst BCI building</div>';
	tooltipText += '<div style=\'vertical-align: middle;\'><span style=\'background-color: ' + CM.Disp.colorPurple + '; display: inline-block; height: 10px; width: 10px; margin-right: 4px;\'></span>Worse than worst BCI building</div>';
	tooltipText += '<div style=\'vertical-align: middle;\'><span style=\'background-color: ' + CM.Disp.colorGray + '; display: inline-block; height: 10px; width: 10px; margin-right: 4px;\'></span>Negative or infinity BCI</div></div>';
	CM.Disp.UpgradeBar.onmouseover = function() { Game.tooltip.draw(this, escape(tooltipText), 'store'); };
	CM.Disp.UpgradeBar.innerHTML = '<span id=\'CMUpgradeBarBlue\' style=\'color: ' + CM.Disp.colorBlue +'; width: 14.28571428571429%; display: inline-block;\'>0</span><span id=\'CMUpgradeBarGreen\' style=\'color: ' + CM.Disp.colorGreen +'; width: 14.28571428571429%; display: inline-block;\'>0</span><span id=\'CMUpgradeBarYellow\' style=\'color: ' + CM.Disp.colorYellow +'; width: 14.28571428571429%; display: inline-block;\'>0</span><span id=\'CMUpgradeBarOrange\' style=\'color: ' + CM.Disp.colorOrange +'; width: 14.28571428571429%; display: inline-block;\'>0</span><span id=\'CMUpgradeBarRed\' style=\'color: ' + CM.Disp.colorRed +'; width: 14.28571428571429%; display: inline-block;\'>0</span><span id=\'CMUpgradeBarPurple\' style=\'color: ' + CM.Disp.colorPurple +'; width: 14.28571428571429%; display: inline-block;\'>0</span><span id=\'CMUpgradeBarGray\' style=\'color: ' + CM.Disp.colorGray +'; width: 14.28571428571429%; display: inline-block;\'>0</span>'
	
	l('upgrades').parentNode.insertBefore(CM.Disp.UpgradeBar, l('upgrades').parentNode.childNodes[3]);
}

CM.Disp.ToggleUpBarColor = function() {
	if (CM.Config.UpBarColor == 1) {
		CM.Disp.UpgradeBar.style.display = '';
		CM.Disp.UpdateUpgrades();
	}
	else {
		CM.Disp.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
}

CM.Disp.UpdateUpgrades = function() {
	var blue = 0;
	var green = 0;
	var yellow = 0;
	var orange = 0;
	var red = 0;
	var purple = 0;
	var gray = 0;
	
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		l('upgrade' + i).innerHTML = '<div style=\'width: 17px; height: 17px; background-color: ' + CM.Cache.Upgrades[me.name].color + ';\'></div>';
		if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorBlue) blue++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorBlue) blue++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorGreen) green++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorYellow) yellow++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorOrange) orange++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorRed) red++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorPurple) purple++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorGray) gray++;
	}
	
	l('CMUpgradeBarBlue').innerHTML = blue;
	l('CMUpgradeBarGreen').innerHTML = green;
	l('CMUpgradeBarYellow').innerHTML = yellow;
	l('CMUpgradeBarOrange').innerHTML = orange;
	l('CMUpgradeBarRed').innerHTML = red;
	l('CMUpgradeBarPurple').innerHTML = purple;
	l('CMUpgradeBarGray').innerHTML = gray;
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

CM.Disp.Flash = function(mode) {
	if ((CM.Config.Flash == 1 && mode == 3) || mode == 1) {
		CM.Disp.WhiteScreen.style.opacity = '0.5';
		if (mode == 3) {
			CM.Disp.WhiteScreen.style.display = 'inline';
			setTimeout(function() {CM.Disp.Flash(2);}, 1000/Game.fps);
		}
		else {
			setTimeout(function() {CM.Disp.Flash(0);}, 1000/Game.fps);
		}
	}
	else if (mode == 2) {
		CM.Disp.WhiteScreen.style.opacity = '1';
		setTimeout(function() {CM.Disp.Flash(1);}, 1000/Game.fps);
	}
	else if (mode == 0) {
		CM.Disp.WhiteScreen.style.display = 'none';
	}
}

CM.Disp.PlaySound = function(url) {
	if (CM.Config.Sound == 1) {
		var sound = new realAudio(url);
		sound.volume = CM.Config.Volume / 100;
		sound.play();
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
	CM.Disp.GCTimer.onclick = Game.goldenCookie.click;
		
	l('game').appendChild(CM.Disp.GCTimer);
}

CM.Disp.ToggleGCTimer = function() {
	if (CM.Config.GCTimer == 1) {
		RemoveEvent(l('goldenCookie'), 'click', Game.goldenCookie.click);
		if (l('goldenCookie').style.display != 'none') {
			CM.Disp.GCTimer.style.display = 'block';
			CM.Disp.GCTimer.style.left = l('goldenCookie').style.left;
			CM.Disp.GCTimer.style.top = l('goldenCookie').style.top;
		}
	}
	else {
		AddEvent(l('goldenCookie'), 'click', Game.goldenCookie.click);
		CM.Disp.GCTimer.style.display = 'none';
	}
}

CM.Disp.CheckGoldenCookie = function() {
	if (CM.Disp.lastGoldenCookieState != l('goldenCookie').style.display) {
		CM.Disp.lastGoldenCookieState = l('goldenCookie').style.display;
		if (l('goldenCookie').style.display != 'none') {
			if (CM.Config.GCTimer == 1) {
				CM.Disp.GCTimer.style.display = 'block';
				CM.Disp.GCTimer.style.left = l('goldenCookie').style.left;
				CM.Disp.GCTimer.style.top = l('goldenCookie').style.top;
			}
			
			CM.Disp.Flash(3);
			CM.Disp.PlaySound('http://cookie-monster.autopergamene.eu/mp3/bell.mp3');
		}
		else if (CM.Config.GCTimer == 1) CM.Disp.GCTimer.style.display = 'none';
	}
	else if (CM.Config.GCTimer == 1 && l('goldenCookie').style.display != 'none') {
		CM.Disp.GCTimer.style.opacity = 1 - Math.pow((Game.goldenCookie.life / (Game.fps * Game.goldenCookie.dur)) * 2 - 1, 4);
		CM.Disp.GCTimer.innerHTML = Math.ceil(Game.goldenCookie.life / Game.fps);
	}
}


CM.Disp.EmphSeasonPopup = function() {
	if (Game.season=='christmas') {
		CM.Disp.Flash(3);
		CM.Disp.PlaySound('http://www.freesound.org/data/previews/121/121099_2193266-lq.mp3');
	}
}

CM.Disp.UpdateTitle = function() {
	if (CM.Config.Title == 1) {
		var addSP = false;
		
		var titleGC;
		var titleSP;
		if (l('goldenCookie').style.display != 'none') {
			addGC = true;
			titleGC = '[G ' +  Math.ceil(Game.goldenCookie.life / Game.fps) + ']';
		}
		else {
			titleGC = '[' +  Math.ceil((Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps) + ']';
		}
		if (Game.season=='christmas') {
			addSP = true;
			if (l('seasonPopup').style.display != 'none') {
				titleSP = '[R ' +  Math.ceil(Game.seasonPopup.life / Game.fps) + ']';
			}
			else {
				titleSP = '[' +  Math.ceil((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps) + ']';
			}
		}
		
		var str = document.title;
		if (str.charAt(0) == '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}
		
		document.title = titleGC + (addSP ? titleSP : '') + ' ' + str;
	}
}

CM.Disp.AddMenu = function() {
	if (Game.onMenu == 'prefs') {
		CM.Disp.CMPref = document.createElement('div');
		
		var str = '<div class=\'title\' style=\'color: ' + CM.Disp.colorBlue + '\'>Cookie Monster Goodies</div>';
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Bars/Colors</div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'BotBar\' onclick=\'CM.ToggleConfigUp("BotBar");\'>' + CM.Disp.GetConfigDisplay('BotBar') + '</a><label>Building Information</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'TimerBar\' onclick=\'CM.ToggleConfigUp("TimerBar");\'>' + CM.Disp.GetConfigDisplay('TimerBar') + '</a><label>Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'BuildColor\' onclick=\'CM.ToggleConfigUp("BuildColor");\'>' + CM.Disp.GetConfigDisplay('BuildColor') + '</a><label>Color code buildings</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'UpBarColor\' onclick=\'CM.ToggleConfigUp("UpBarColor");\'>' + CM.Disp.GetConfigDisplay('UpBarColor') + '</a><label>Color code upgrades and add a counter</label></div>';
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Golden Cookie/Season Popup Emphasis</div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'Flash\' onclick=\'CM.ToggleConfigUp("Flash");\'>' + CM.Disp.GetConfigDisplay('Flash') + '</a><label>Flash screen on Golden Cookie/Season Popup</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'Sound\' onclick=\'CM.ToggleConfigUp("Sound");\'>' + CM.Disp.GetConfigDisplay('Sound') + '</a><label>Play a sound on Golden Cookie/Season Popup</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' onclick=\'CM.ToggleConfigDown("Volume");\'>-</a><span id=\'' + CM.ConfigPrefix + 'Volume\'>' + CM.Disp.GetConfigDisplay('Volume') + '</span><a class=\'option\' onclick=\'CM.ToggleConfigUp("Volume");\'>+</a><label>Volume of the sound</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'GCTimer\' onclick=\'CM.ToggleConfigUp("GCTimer");\'>' + CM.Disp.GetConfigDisplay('GCTimer') + '</a><label>A timer on the Golden Cookie when has been spawned</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'Title\' onclick=\'CM.ToggleConfigUp("Title");\'>' + CM.Disp.GetConfigDisplay('Title') + '</a><label>Update title with Golden Cookie/Season Popup timers</label></div>';
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Tooltip</div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'Tooltip\' onclick=\'CM.ToggleConfigUp("Tooltip");\'>' + CM.Disp.GetConfigDisplay('Tooltip') + '</a><label>Extra information in tooltip for buildings/upgrades</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'ToolWarnCaut\' onclick=\'CM.ToggleConfigUp("ToolWarnCaut");\'>' + CM.Disp.GetConfigDisplay('ToolWarnCaut') + '</a><label>A warning/caution when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'ToolWarnCautPos\' onclick=\'CM.ToggleConfigUp("ToolWarnCautPos");\'>' + CM.Disp.GetConfigDisplay('ToolWarnCautPos') + '</a><label>Placement of the warning/caution boxes</label></div>';
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Statistics</div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'Stats\' onclick=\'CM.ToggleConfigUp("Stats");\'>' + CM.Disp.GetConfigDisplay('Stats') + '</a><label>Extra Cookie Monster statistics!</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'UpStats\' onclick=\'CM.ToggleConfigUp("UpStats");\'>' + CM.Disp.GetConfigDisplay('UpStats') + '</a><label>Default Game rate is once every 3 seconds</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'SayTime\' onclick=\'CM.ToggleConfigUp("SayTime");\'>' + CM.Disp.GetConfigDisplay('SayTime') + '</a><label>Change how time is displayed in statistics</label></div>';
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Other</div>';
		str += '<div class=\'listing\'><a class=\'option\' id=\'' + CM.ConfigPrefix + 'Scale\' onclick=\'CM.ToggleConfigUp("Scale");\'>' + CM.Disp.GetConfigDisplay('Scale') + '</a><label>Change how long numbers are handled</label></div>';
		str += '<div class=\'listing\'><a class=\'option\' onclick=\'CM.RestoreDefault();\'>Restore Default</a></div>';

		CM.Disp.CMPref.innerHTML = str;

		while (CM.Disp.CMPref.childNodes.length > 0) {
			l('menu').childNodes[2].insertBefore(CM.Disp.CMPref.childNodes[0], l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
		}
		
		CM.Disp.FormatButtonOnClickBak = l('formatButton').onclick;
		l('formatButton').onclick = function() { Game.Toggle('format','formatButton','Short numbers OFF','Short numbers ON'); CM.Disp.RefreshScale(); };
	}
	else if (CM.Config.Stats == 1 && Game.onMenu == 'stats') {
		CM.Disp.CMStats = document.createElement('div');
		CM.Disp.CMStats.className = 'subsection';
		
		var luckyColor = (Game.cookies < CM.Cache.Lucky) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var luckyTime = (Game.cookies < CM.Cache.Lucky) ? ' <small>(' + CM.Disp.FormatTime((CM.Cache.Lucky - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')</small>' : '';
		var luckyColorFrenzy = (Game.cookies < CM.Cache.LuckyFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var luckyTimeFrenzy = (Game.cookies < CM.Cache.LuckyFrenzy) ? ' <small>(' + CM.Disp.FormatTime((CM.Cache.LuckyFrenzy - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')</small>' : '';
		var luckyCur = Math.min(Game.cookies * 0.1, Game.cookiesPs * 60 * 20) + 13;

		var possibleHC = Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset);
		var neededCook = CM.Sim.CookNeedPrest(possibleHC + 1) - (Game.cookiesEarned + Game.cookiesReset);
		
		var halloCook = 0;
		for (var i in CM.Data.HalloCookies) {
			if (Game.Has(CM.Data.HalloCookies[i])) halloCook++;
		}
		var christCook = 0;
		for (var i in CM.Data.ChristCookies) {
			if (Game.Has(CM.Data.ChristCookies[i])) christCook++;
		}
		var valCook = 0;
		for (var i in CM.Data.ValCookies) {
			if (Game.Has(CM.Data.ValCookies[i])) valCook++;
			else break;
		}
		var normEggs = 0;
		for (var i in Game.eggDrops) {
			if (Game.HasUnlocked(Game.eggDrops[i])) normEggs++;
		}
		var rareEggs = 0;
		for (var i in Game.rareEggDrops) {
			if (Game.HasUnlocked(Game.rareEggDrops[i])) rareEggs++;
		}
		
		var str = '<div class=\'title\' style=\'color: ' + CM.Disp.colorBlue + '\'>Cookie Monster Goodies</div>';
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Lucky Cookies</div>';
		str += '<div class=\'listing\'><b>\"Lucky!\" Cookies Required :</b> <span style=\'font-weight: bold; color: ' + luckyColor + ';\'>' + Beautify(CM.Cache.Lucky) + '</span>' + luckyTime + '</div>';
		str += '<div class=\'listing\'><b>\"Lucky!\" Cookies Required (Frenzy) :</b> <span style=\'font-weight: bold; color: ' + luckyColorFrenzy + ';\'>' + Beautify(CM.Cache.LuckyFrenzy) + '</span>' + luckyTimeFrenzy + '</div>';
		str += '<div class=\'listing\'><b>\"Lucky!\" Reward (MAX) :</b> ' + Beautify(CM.Cache.LuckyReward) + '</div>';
		str += '<div class=\'listing\'><b>\"Lucky!\" Reward (MAX) (Frenzy) :</b> ' + Beautify(CM.Cache.LuckyRewardFrenzy) + '</div>';
		str += '<div class=\'listing\'><b>\"Lucky!\" Reward (CUR) :</b> ' + Beautify(luckyCur) + '</div>';
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Heavenly Chips</div>';
		str += '<div class=\'listing\'><b>Heavenly Chips (MAX) :</b> ' + Beautify(possibleHC) + ' <small>(' + Beautify((possibleHC * 2)) + '%)</small></div>';
		str += '<div class=\'listing\'><b>Heavenly Chips (CUR) :</b> ' + Beautify(Game.prestige['Heavenly chips']) + ' <small>(' + Beautify((Game.prestige['Heavenly chips'] * 2)) + '%)</small></div>';
		str += '<div class=\'listing\'><b>Cookies To Next Chip :</b> ' + Beautify(neededCook) + '</div>';
		str += '<div class=\'listing\'><b>Time To Next Chip :</b> ' + CM.Disp.FormatTime(neededCook / (Game.cookiesPs * (1 - Game.cpsSucked)), 1) + '</div>';
		if (Game.cpsSucked > 0) {
			str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Wrinklers</div>';
			var sucked = 0;
			for (var i in Game.wrinklers) {
				sucked += Game.wrinklers[i].sucked;
			}
			sucked *= 1.1;
			if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
			str += '<div class=\'listing\'><b>Rewards of Popping :</b> ' + Beautify(sucked) + '</div>';
		}
		str += '<div class=\'listing\' style=\'padding:5px 16px; opacity:0.7; font-size: 17px; font-family: \"Kavoon\", Georgia, serif;\'>Season Specials</div>';
		str += '<div class=\'listing\'><b>Halloween Cookies Bought :</b> ' + halloCook + ' of ' + CM.Data.HalloCookies.length + '</div>';					
		str += '<div class=\'listing\'><b>Christmas Cookies Bought :</b> ' + christCook + ' of ' + CM.Data.ChristCookies.length + '</div>';					
		str += '<div class=\'listing\'><b>Valentine Cookies Bought :</b> ' + valCook + ' of ' + CM.Data.ValCookies.length + '</div>';					
		str += '<div class=\'listing\'><b>Normal Easter Eggs Unlocked :</b> ' + normEggs + ' of ' + Game.eggDrops.length + '</div>';					
		str += '<div class=\'listing\'><b>Rare Easter Eggs Unlocked :</b> ' + rareEggs + ' of ' + Game.rareEggDrops.length + '</div>';					
		if (Game.season == 'christmas') {
			str += '<div class=\'listing\'><b>Reindeer Reward :</b> ' + Beautify(CM.Cache.SeaSpec) + '</div>';			
		}
		
		CM.Disp.CMStats.innerHTML = str;
	
		l('menu').insertBefore(CM.Disp.CMStats, l('menu').childNodes[2]);
	}
}

CM.Disp.RefreshMenu = function() {
	if (CM.Config.UpStats && Game.onMenu == 'stats' && Game.drawT % (Game.fps * 3) != 0 && Game.drawT % Game.fps == 0) Game.UpdateMenu();
}

CM.Disp.CreateTooltipWarnCaut = function() {
	CM.Disp.TooltipWarnCaut = document.createElement('div');
	CM.Disp.TooltipWarnCaut.style.position = 'absolute';
	CM.Disp.TooltipWarnCaut.style.display = 'none';
	CM.Disp.TooltipWarnCaut.style.left = 'auto';
	CM.Disp.TooltipWarnCaut.style.bottom = 'auto';
	CM.Disp.TooltipWarnCaut.innerHTML = '<div id=\'CMDispTooltipWarn\' style=\'display: none; -webkit-transition: opacity 0.1s ease-out; -moz-transition: opacity 0.1s ease-out; -ms-transition: opacity 0.1s ease-out; -o-transition: opacity 0.1s ease-out; transition: opacity 0.1s ease-out; border: 1px solid ' + CM.Disp.colorRed + '; padding: 2px; margin-bottom: 4px; background: #000 url(img/darkNoise.png);\'><div><span style=\'color: ' + CM.Disp.colorRed + '; font-weight: bold;\'>Warning:</span> Purchase of this item will put you under the number of Cookies required for "Lucky!"</div><div>Deficit: <span id=\'CMDispTooltipWarnText\'></span></div></div><div id=\'CMDispTooltipCaut\' style=\'display: none; -webkit-transition: opacity 0.1s ease-out; -moz-transition: opacity 0.1s ease-out; -ms-transition: opacity 0.1s ease-out; -o-transition: opacity 0.1s ease-out; transition: opacity 0.1s ease-out; border: 1px solid ' + CM.Disp.colorYellow + '; padding: 2px; background: #000 url(img/darkNoise.png);\'><div><span style=\'color: ' + CM.Disp.colorYellow + '; font-weight: bold;\'>Caution:</span> Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)</div><div>Deficit: <span id=\'CMDispTooltipCautText\'></span></div></div>'

	l('tooltipAnchor').appendChild(CM.Disp.TooltipWarnCaut);
}

CM.Disp.ToggleToolWarnCaut = function() {
	if (CM.Config.ToolWarnCaut == 1) {
		CM.Disp.TooltipWarnCaut.style.display = 'block';
	}
	else {
		CM.Disp.TooltipWarnCaut.style.display = 'none';
	}
}

CM.Disp.ToggleToolWarnCautPos = function() {
	if (CM.Config.ToolWarnCautPos == 0) {
		CM.Disp.TooltipWarnCaut.style.top = '12px';
		CM.Disp.TooltipWarnCaut.style.padding = '3px 4px';
	}
	else {
		CM.Disp.TooltipWarnCaut.style.right = '12px';
		CM.Disp.TooltipWarnCaut.style.padding = '4px 3px';
	}
}

CM.Disp.AddTooltipBuild = function() {
	CM.Disp.TooltipBuildBack = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			//l('product' + me.id).onmouseout = function() { CM.Disp.TooltipHide(); };
			CM.Disp.TooltipBuildBack[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() { Game.tooltip.draw(this, function() { return CM.Disp.Tooltip(\'b\', \'' + i + '\'); }, \'store\'); }');
		}
	}
}

CM.Disp.AddTooltipUpgrade = function() {
	CM.Disp.TooltipUpgradeBack = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			//l('upgrade' + i).onmouseout = function() { CM.Disp.TooltipHide(); };
			CM.Disp.TooltipUpgradeBack[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() { CM.Disp.Tooltip(\'u\', \'' + i + '\'); }');
		}
	}
}

CM.Disp.Tooltip = function(type, name) {
	if (type == 'b') {
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
	}
	else { // Upgrades
		CM.Disp.TooltipUpgradeBack[name]();
	}
	
	l('tooltip').innerHTML += '<div id=\'CMTooltipArea\'></div>'
	
	if (CM.Config.Tooltip == 1) {
		l('tooltip').firstChild.style.paddingBottom = '4px';
		l('tooltip').innerHTML += '<div style=\'border: 1px solid; padding: 4px; margin: 0px -4px;\' id=\'CMTooltipBorder\'><div style=\'font-weight :bold; color: ' + CM.Disp.colorBlue + ';\'>Bonus Income</div><div style=\'margin-bottom: 4px; color: white;\' id=\'CMTooltipIncome\'></div><div style=\'font-weight :bold; color: ' + CM.Disp.colorBlue + ';\'>Base Cost Per Income</div><div style=\'margin-bottom: 4px;\' id=\'CMTooltipBCI\'></div><div style=\'font-weight :bold; color: ' + CM.Disp.colorBlue + ';\'>Time Left</div><div id=\'CMTooltipTime\'></div></div>'
	}
	
	//CM.Disp.tooltipExtra = 1;
	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	CM.Disp.UpdateTooltip();
	
	if (type == 'b') {
		return l('tooltip').innerHTML;
	}	
}

/*CM.Disp.TooltipHide = function() {
	Game.tooltip.update();
	CM.Disp.tooltipExtra = 0;
	l('CMDispTooltipWarn').style.opacity = '0';
	l('CMDispTooltipCaut').style.opacity = '0';
}*/

CM.Disp.UpdateTooltip = function() {
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		var price;
		var bonus;
		if (CM.Disp.tooltipType == 'b') {
			bonus = CM.Cache.Objects[CM.Disp.tooltipName].bonus;
			price = Game.Objects[CM.Disp.tooltipName].getPrice();
			if (CM.Config.Tooltip == 1) {
				l('CMTooltipBorder').style.color = CM.Cache.Objects[CM.Disp.tooltipName].color;
				l('CMTooltipBCI').innerHTML = Beautify(CM.Cache.Objects[CM.Disp.tooltipName].bci, 2);
				l('CMTooltipBCI').style.color = CM.Cache.Objects[CM.Disp.tooltipName].color;
			}
		}
		else { // Upgrades
			bonus = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
			price = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();
			if (CM.Config.Tooltip == 1) {
				l('CMTooltipBorder').style.color = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
				l('CMTooltipBCI').innerHTML = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bci, 2);
				l('CMTooltipBCI').style.color = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
			}
		}
		if (CM.Config.Tooltip == 1) {
			l('CMTooltipIncome').innerHTML = Beautify(bonus, 2);
			
			var increase = Math.round(bonus / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').innerHTML += ' (' + (increase / 100) + '% of income)';
			}
		
			var timeColor = CM.Disp.GetTimeColor(price);
			l('CMTooltipTime').innerHTML = timeColor.text;
			l('CMTooltipTime').style.color = timeColor.color;
		}
		
		if (CM.Config.ToolWarnCaut == 1) {
			var bonusNoFren = bonus;
			if (Game.frenzy > 0) {
				bonusNoFren /= Game.frenzyPower;
			}
			var warn = CM.Cache.Lucky + ((bonusNoFren * 60 * 20) / 0.1);
			var caut = warn * 7;
			var amount = Game.cookies - price;
			if (amount < warn || amount < caut) {
				if (CM.Config.ToolWarnCautPos == 0) {
					CM.Disp.TooltipWarnCaut.style.right = (l('tooltip').offsetWidth + 12) + 'px';
				}
				else {
					CM.Disp.TooltipWarnCaut.style.top = (l('tooltip').offsetHeight + 12) + 'px';
				}
				CM.Disp.TooltipWarnCaut.style.width = (l('tooltip').offsetWidth - 6) + 'px';
			
				if (amount < warn) {
					l('CMDispTooltipWarn').style.display = '';
					l('CMDispTooltipWarnText').innerHTML = Beautify(warn - amount) + ' (' + CM.Disp.FormatTime((warn - amount) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')';
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').innerHTML = Beautify(caut - amount) + ' (' + CM.Disp.FormatTime((caut - amount) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')';
				}
				else if (amount < caut) {
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').innerHTML = Beautify(caut - amount) + ' (' + CM.Disp.FormatTime((caut - amount) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')';
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
			if (CM.Config[i] == undefined || !(CM.Config[i] > -1 && CM.Config[i] < CM.ConfigData[i].label.length)) {
				mod = true;
				CM.Config[i] = CM.ConfigDefault[i];
			}
		}
		if (mod) CM.SaveConfig(CM.Config);
		CM.Loop(); // Do loop once
		for (var i in CM.ConfigDefault) {
			if (CM.ConfigData[i].func != undefined) {
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

CM.ToggleConfigUp = function(config) {
	CM.Config[config]++;
	if (CM.Config[config] == CM.ConfigData[config].label.length) {
		CM.Config[config] = 0;
	}
	if (CM.ConfigData[config].func != undefined) {
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
	if (CM.ConfigData[config].func != undefined) {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
	CM.SaveConfig(CM.Config);
}

/*********
 * Other *
 *********/
 
function RemoveEvent(html_element, event_name, event_function) {       
	if (html_element.detachEvent) // Internet Explorer
		html_element.detachEvent("on" + event_name, function() {event_function.call(html_element);}); 
	else if (html_element.removeEventListener) // Firefox & company
		html_element.removeEventListener(event_name, event_function, false); // Don't need the 'call' trick because in FF everything already works in the right way          
}


CM.ReplaceNative = function() {
	CM.Backup.Beautify = Beautify;
	Beautify = CM.Disp.Beautify;

	CM.Backup.CalculateGains = Game.CalculateGains;
	Game.CalculateGains = function() {
		CM.Backup.CalculateGains();
		CM.Sim.DoSims = 1;
		CM.Sim.Date = new Date().getTime();
	}
	
	CM.Backup.seasonPopup = {};
	CM.Backup.seasonPopup.spawn = Game.seasonPopup.spawn;
	eval('CM.Backup.seasonPopup.spawnMod = ' + Game.seasonPopup.spawn.toString().split('this').join('Game.seasonPopup'));
	Game.seasonPopup.spawn = function() {
		CM.Backup.seasonPopup.spawnMod();
		CM.Disp.EmphSeasonPopup();
	}
	
	CM.Backup.tooltip = {};
	CM.Backup.tooltip.draw = Game.tooltip.draw;
	eval('CM.Backup.tooltip.drawMod = ' + Game.tooltip.draw.toString().split('this').join('Game.tooltip'));
	Game.tooltip.draw = function(from, text, origin) {
		CM.Backup.tooltip.drawMod(from, text, origin);
		CM.Disp.DrawTooltipWarnCaut();
	}
	
	CM.Backup.tooltip.update = Game.tooltip.update;
	eval('CM.Backup.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this').join('Game.tooltip'));
	Game.tooltip.update = function() {
		CM.Backup.tooltip.updateMod();
		CM.Disp.UpdateTooltipWarnCaut();
	}
	
	/*CM.Backup.tooltip.hide = Game.tooltip.hide;
	eval('CM.Backup.tooltip.hideMod = ' + Game.tooltip.hide.toString().split('this').join('Game.tooltip'));
	Game.tooltip.hide = function() {
		CM.Backup.tooltip.hideMod();
		CM.Disp.TooltipHide();
	}*/

	/*CM.Backup.RebuildStore = Game.RebuildStore;
	Game.RebuildStore = function() {
		CM.Backup.RebuildStore();
		CM.Disp.AddTooltipBuild();
	}*/
	
	CM.Backup.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function() {
		CM.Backup.RebuildUpgrades();
		CM.Disp.AddTooltipUpgrade();
		//CM.Sim.DoUpgradesSim = 1;
	}
	
	CM.Backup.UpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		CM.Backup.UpdateMenu();
		CM.Disp.AddMenu();
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
}

CM.Loop = function() {
	if (CM.Sim.DoSims) {		
		CM.Cache.RemakeIncome();
		CM.Cache.RemakeBCI();
		CM.Cache.RemakeLucky();
		CM.Cache.RemakeSeaSpec();
		
		CM.Disp.UpdateBotBarOther();
		CM.Disp.UpdateBuildings();
		CM.Disp.UpdateUpgrades();
		
		CM.Sim.DoSims = 0;
	}
	/*else {
		if (CM.Sim.DoUpgradesSim) {
			CM.Sim.BuyUpgrades();
			
			CM.Cache.RemakeUpgradeBCI();
			
			CM.Disp.UpdateUpgrades();
		}
	}*/
	
	// Redraw timers
	CM.Disp.UpdateBotBarTime();
	CM.Disp.UpdateTimerBar();
	
	// Update Tooltip
	CM.Disp.UpdateTooltip();

	// Check Golden Cookies
	CM.Disp.CheckGoldenCookie();
	
	// Check Season Popup
	//CM.Disp.CheckSeasonPopup();
	
	// Update Title
	CM.Disp.UpdateTitle();
	
	// Change menu refresh interval
	CM.Disp.RefreshMenu();
}

CM.Init = function() {
	var proceed = true;
	if (Game.version != CM.VersionMajor) {
		proceed = confirm('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' is meant for Game version ' + CM.VersionMajor + '.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?');
	}
	if (proceed) {
		CM.Disp.CreateBotBar();
		CM.Disp.CreateTimerBar();
		CM.Disp.CreateUpgradeBar();
		CM.Disp.CreateWhiteScreen();
		CM.Disp.CreateGCTimer();
		CM.Disp.CreateTooltipWarnCaut();
		CM.Disp.AddTooltipBuild();
		CM.ReplaceNative();
		Game.CalculateGains();
		CM.LoadConfig(); // Must be after all things are created!
				
		if (Game.prefs.popups) Game.Popup('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!');
		else Game.Notify('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!','','',1);
		
		Game.Win('Third-party');
	}
}

CM.Data.HalloCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
CM.Data.ChristCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
CM.Data.ValCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];

//CM.Sim.DoSims = 1;
//CM.Sim.DoUpgradesSim = 1;

CM.Cache.Lucky = 0;
CM.Cache.LuckyReward = 0;
CM.Cache.LuckyFrenzy = 0;
CM.Cache.LuckyRewardFrenzy = 0;
CM.Cache.SeaSpec = 0;

CM.Disp.min = -1;
CM.Disp.max = -1;
CM.Disp.mid = -1;
CM.Disp.colorBlue = '#4bb8f0';
CM.Disp.colorGreen = 'lime';
CM.Disp.colorYellow = 'yellow';
CM.Disp.colorOrange = '#ff7f00';
CM.Disp.colorRed = 'red';
CM.Disp.colorPurple = 'magenta';
CM.Disp.colorGray = '#b3b3b3';
CM.Disp.lastGoldenCookieState = 'none';
//CM.Disp.tooltipExtra = 0;

CM.Disp.metric = [ 'M' , 'G' , 'T' , 'P' , 'E' , 'Z' , 'Y' ];
CM.Disp.shortScale = [ 'M' , 'B' , 'Tr' , 'Quadr' , 'Quint' , 'Sext' , 'Sept' , 'Oct' , 'Non' , 'Dec' , 'Undec' , 'Duodec' , 'Tredec' ];

CM.ConfigDefault = { BotBar : 1, TimerBar : 1, BuildColor : 1, UpBarColor : 1, Flash : 1, Sound : 1,  Volume : 100, GCTimer : 1, Title : 1, Tooltip : 1, ToolWarnCaut : 1, ToolWarnCautPos : 0, Stats : 1, UpStats : 1, SayTime : 1, Scale : 2 };

CM.ConfigPrefix = 'CMConfig';
CM.ConfigData.BotBar = { label : [ 'Bottom Bar OFF', 'Bottom Bar ON' ], func : function() { CM.Disp.ToggleBotBar(); } };
CM.ConfigData.TimerBar = { label : [ 'Timer Bar OFF', 'Timer Bar ON' ], func : function() { CM.Disp.ToggleTimerBar(); } };
CM.ConfigData.BuildColor = { label : [ 'Building Colors OFF', 'Building Colors ON' ], func : function() { CM.Disp.UpdateBuildings(); } };
CM.ConfigData.UpBarColor = { label : [ 'Upgrade Bar/Colors OFF', 'Upgrade Bar/Colors ON' ], func : function() { CM.Disp.ToggleUpBarColor(); } };
CM.ConfigData.Flash = { label : [ 'Flash OFF', 'Flash ON' ] };
CM.ConfigData.Sound = { label : [ 'Sounds OFF', 'Sounds ON' ] };
CM.ConfigData.Volume = { label : [] };
for (var i = 0; i < 101; i++) {
	CM.ConfigData.Volume.label[i] = i + '%';
}
CM.ConfigData.GCTimer = { label : [ 'Golden Cookie Timer OFF', 'Golden Cookie Timer ON' ], func : function() { CM.Disp.ToggleGCTimer(); } };
CM.ConfigData.Title = { label : [ 'Title OFF', 'Title ON' ] };
CM.ConfigData.Tooltip = { label : [ 'Tooltip Information OFF', 'Tooltip Information ON' ] };
CM.ConfigData.ToolWarnCaut = { label : [ 'Tooltip Warning/Caution OFF', 'Tooltip Warning/Caution ON' ], func : function() { CM.Disp.ToggleToolWarnCaut(); } };
CM.ConfigData.ToolWarnCautPos = { label : [ 'Tooltip Warning/Caution Position (Left)', 'Tooltip Warning/Caution Position (Bottom)' ], func : function() { CM.Disp.ToggleToolWarnCautPos(); } };
CM.ConfigData.Stats = { label : [ 'Statistics OFF', 'Statistics ON' ] };
CM.ConfigData.UpStats = { label : [ 'Statistics Update Rate (Default)', 'Statistics Update Rate (1s)' ] };
CM.ConfigData.SayTime = { label : [ 'Format Time OFF', 'Format Time ON' ], func : function() { CM.Disp.ToggleSayTime(); } };
CM.ConfigData.Scale = { label : [ 'Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation' ], func : function() { CM.Disp.RefreshScale(); } };

CM.VersionMajor = '1.0465';
CM.VersionMinor = '5';

CM.Init();
