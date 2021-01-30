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
};

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
};

CM.Sim.Has = function(what) {
	var it = CM.Sim.Upgrades[what];
	if (Game.ascensionMode == 1 && (it.pool == 'prestige' || it.tier == 'fortune')) return 0;
	return (it ? it.bought : 0);
};


CM.Sim.Win = function(what) {
	if (CM.Sim.Achievements[what]) {
		if (CM.Sim.Achievements[what].won == 0) {
			CM.Sim.Achievements[what].won = 1;
			if (Game.Achievements[what].pool != 'shadow') CM.Sim.AchievementsOwned++;
		}
	}
};

eval('CM.Sim.HasAchiev = ' + Game.HasAchiev.toString().split('Game').join('CM.Sim'));

eval('CM.Sim.GetHeavenlyMultiplier = ' + Game.GetHeavenlyMultiplier.toString().split('Game.Has').join('CM.Sim.Has').split('Game.hasAura').join('CM.Sim.hasAura').split('Game.auraMult').join('CM.Sim.auraMult'));

// Check for Pantheon Auras
CM.Sim.hasAura = function(what) {
	if (Game.dragonAuras[CM.Sim.dragonAura].name == what || Game.dragonAuras[CM.Sim.dragonAura2].name == what)
		return true;
	else
		return false;
};

// Check if multiplier auras are present
// Used as CM.Sim.auraMult('Aura') * mult, i.e. CM.Sim.auraMult('Dragon God) * 0.05
CM.Sim.auraMult = function(what) {
	var n = 0;
	if (Game.dragonAuras[CM.Sim.dragonAura].name == what || Game.dragonAuras[CM.Sim.dragonAura2].name == what)
		n = 1;
	if (Game.dragonAuras[CM.Sim.dragonAura].name == 'Reality Bending' || Game.dragonAuras[CM.Sim.dragonAura2].name == 'Reality Bending')
		n += 0.1;
	return n;
};

CM.Sim.hasGod=function(what) {
	if (!CM.Sim.Objects.Temple.minigameLoaded) {
		return false;
	}
	var possibleGods = CM.Sim.Objects.Temple.minigame.gods;
	var god=possibleGods[what];
	for (var i=0;i<3;i++)
	{
		if (CM.Sim.Objects.Temple.minigame.slot[i]==god.id) return (i+1);
	}
	return false;
};

CM.Sim.eff = function(name) {
	if (typeof CM.Sim.effs[name]==='undefined') {
		CM.Sim.effs[name] = 1;
		return CM.Sim.effs[name];
	}
	else {
		return CM.Sim.effs[name];
	}
};

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
};

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
};

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
};

/**
 * Similar to the previous function, but for achievements.
 * Note: currently no static data is used by Cookie Monster,
 * so this function just returns an empty object.
 */
CM.Sim.InitAchievement = function(achievementName) {
	return {};
};

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
	CM.Sim.CopyData;
};

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

	var n = Game.shimmerTypes.golden.n;
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

	if (CM.Sim.Objects.Cursor.amount + CM.Sim.Objects.Grandma.amount >= 777) CM.Sim.Win('The elder scrolls');

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
		var list = Game.Tiers.fortune.upgrades;
		var fortunes = 0;
		for (var i in list) {
			if (CM.Sim.Has(list[i].name)) fortunes++;
		}
		if (fortunes >= list.length) CM.Sim.Win('O Fortuna');
	}
};

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
};

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
				CM.Sim.Win('Elder calm');
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

			var diffMouseCPS = CM.Sim.mouseCps() - Game.computedMouseCps;
			if (diffMouseCPS) CM.Cache.Upgrades[i].bonusMouse = diffMouseCPS;
		}
	}
};

/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}			aura										The number of the aura currently selected by the mouse/user
 * @returns {[number, number]} 	[CM.Sim.cookiesPs - Game.cookiesPs, price]	The bonus cps and the price of the change
 */
CM.Sim.CalculateChangeAura = function(aura) {
	CM.Sim.CopyData();

	// Check if aura being changed is first or second aura
	var auraToBeChanged = l('promptContent').children[0].innerHTML.includes("secondary");
	if (auraToBeChanged) CM.Sim.dragonAura2 = aura;
	else CM.Sim.dragonAura = aura;

	// Sell highest building but only if aura is different
	if (CM.Sim.dragonAura != CM.Cache.dragonAura || CM.Sim.dragonAura2 != CM.Cache.dragonAura2) {
		for (var i = Game.ObjectsById.length; i > -1, --i;) {
			if (Game.ObjectsById[i].amount > 0) {	
				var highestBuilding = CM.Sim.Objects[Game.ObjectsById[i].name].name;
				CM.Sim.Objects[highestBuilding].amount -=1;
				CM.Sim.buildingsOwned -= 1;
				break;
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
	return [CM.Sim.cookiesPs - Game.cookiesPs, price];
};

CM.Sim.NoGoldSwitchCookiesPS = function() {
	if (Game.Has('Golden switch [off]')) {
		CM.Sim.CopyData();
		CM.Sim.Upgrades['Golden switch [off]'].bought = 0;
		CM.Sim.CalculateGains();
		CM.Cache.NoGoldSwitchCookiesPS = CM.Sim.cookiesPs;
	}
	else CM.Cache.NoGoldSwitchCookiesPS = Game.cookiesPs;
};

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

	var ResetCPS = CM.Sim.cookiesPs - curCPS;

	// Reset Pretige level after calculation
	CM.Sim.prestige = Game.prestige;

	return (ResetCPS);
};

CM.Sim.getSellMultiplier = function() {
	var giveBack = 0.25;
	giveBack *= 1 + CM.Sim.auraMult('Earth Shatterer');
	return giveBack;
};

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
};

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
};

/********
 * Section: Functions used to calculate clicking power */

/**
 * This function calculates the cookies per click
 * It is called by CM.Sim.BuyUpgrades() when an upgrades has no bonus-income (and is thus a clicking-upgrade)
 */
CM.Sim.mouseCps = function() {
	var add=0;
	if (CM.Sim.Has('Thousand fingers')) add += 0.1;
	if (CM.Sim.Has('Million fingers')) add *= 5;
	if (CM.Sim.Has('Billion fingers')) add *= 10;
	if (CM.Sim.Has('Trillion fingers')) add *= 20;
	if (CM.Sim.Has('Quadrillion fingers')) add *= 20;
	if (CM.Sim.Has('Quintillion fingers')) add *= 20;
	if (CM.Sim.Has('Sextillion fingers')) add *= 20;
	if (CM.Sim.Has('Septillion fingers')) add *= 20;
	if (CM.Sim.Has('Octillion fingers')) add *= 20;
	if (CM.Sim.Has('Nonillion fingers')) add *= 20;
	var num=0;
	for (var i in CM.Sim.Objects) {num+=CM.Sim.Objects[i].amount;}
	num -= CM.Sim.Objects.Cursor.amount;
	add = add * num;

	// Use CM.Sim.cookiesPs as function is always called after CM.Sim.CalculateGains()
	if (CM.Sim.Has('Plastic mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Iron mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Titanium mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Adamantium mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Unobtainium mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Eludium mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Wishalloy mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Fantasteel mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Nevercrack mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Armythril mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Technobsidian mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Plasmarble mouse')) add += CM.Sim.cookiesPs * 0.01;
	if (CM.Sim.Has('Miraculite mouse')) add += CM.Sim.cookiesPs * 0.01;

	if (CM.Sim.Has('Fortune #104')) add += CM.Sim.cookiesPs * 0.01;
	
	
	var mult=1;
	if (CM.Sim.Has('Santa\'s helpers')) mult *= 1.1;
	if (CM.Sim.Has('Cookie egg')) mult *= 1.1;
	if (CM.Sim.Has('Halo gloves')) mult *= 1.1;
	if (CM.Sim.Has('Dragon claw')) mult *= 1.03;
	
	if (CM.Sim.Has('Aura gloves'))
	{
		mult *= 1 + 0.05 * Math.min(Game.Objects.Cursor.level, CM.Sim.Has('Luminous gloves') ? 20 : 10);
	}
	
	mult *= CM.Sim.eff('click');
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		if (CM.Sim.hasGod)
		{
			var godLvl = CM.Sim.hasGod('labor');
			if (godLvl == 1) mult *= 1.15;
			else if (godLvl == 2) mult *= 1.1;
			else if (godLvl == 3) mult *= 1.05;
		}
	}

	for (var i in Game.buffs)
	{
		if (typeof Game.buffs[i].multClick != 'undefined') mult*=Game.buffs[i].multClick;
	}
	
	//if (CM.Sim.auraMult('Dragon Cursor')) mult*=1.05;
	mult *= 1 + CM.Sim.auraMult('Dragon Cursor') * 0.05;
	
	// No need to make this function a CM function
	var out = mult * Game.ComputeCps(1, CM.Sim.Has('Reinforced index finger') + CM.Sim.Has('Carpal tunnel prevention cream') + CM.Sim.Has('Ambidextrous'), add);
	
	out = Game.runModHookOnValue('cookiesPerClick', out);
	
	if (Game.hasBuff('Cursed finger')) out = Game.buffs['Cursed finger'].power;
	
	return out;
};

