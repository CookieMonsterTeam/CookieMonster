/*******
 * Sim *
 *******/

CM.Sim.BuildingGetPrice = function (basePrice, start, increase) {
	var totalPrice = 0;
	var count = 0;
	while(count < increase) {
		var price = basePrice * Math.pow(Game.priceIncrease, start + count);
		if (Game.Has('Season savings')) price *= 0.99;
		if (Game.Has('Santa\'s dominion')) price *= 0.99;
		if (Game.Has('Faberge egg')) price *= 0.99;
		totalPrice += Math.ceil(price);
		count++;
	}
	return totalPrice;
}

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
		CM.Sim.cookiesPs += me.amount * (typeof(me.cps) == 'function' ? me.cps() : me.cps);
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

	CM.Sim.cookiesPs *= mult;			
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
		
		CM.Cache[target][i] = {};
		CM.Cache[target][i].bonus = CM.Sim.cookiesPs - Game.cookiesPs;
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
}

CM.Sim.ResetBonus = function() {
	CM.Sim.CopyData();
	
	if (Game.cookiesEarned >= 1000000) CM.Sim.Win('Sacrifice');
	if (Game.cookiesEarned >= 1000000000) CM.Sim.Win('Oblivion');
	if (Game.cookiesEarned >= 1000000000000) CM.Sim.Win('From scratch');
	if (Game.cookiesEarned >= 1000000000000000) CM.Sim.Win('Nihilism');
	
	if (Game.cookiesEarned >= 1000000000000000000) CM.Sim.Win('Dematerialize');
	if (Game.cookiesEarned >= 1000000000000000000000) CM.Sim.Win('Nil zero zilch');
	if (Game.cookiesEarned >= 1000000000000000000000000) CM.Sim.Win('Transcendence');
	if (Game.cookiesEarned >= 1000000000000000000000000000) CM.Sim.Win('Obliterate');
	if (Game.cookiesEarned >= 1000000000000000000000000000000) CM.Sim.Win('Negative void');	
	
	CM.Sim.prestige = Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset);
	
	var lastAchievementsOwned = CM.Sim.AchievementsOwned;

	CM.Sim.CalculateGains();
	
	if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}

	return (CM.Sim.cookiesPs - Game.cookiesPs);
}

