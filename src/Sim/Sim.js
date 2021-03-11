/**
 * Sim *
 */

/**
 * Section: Functions to calculate building buy and sell prices */

/**
 * This function calculates the total price for buying "increase" of a building
 * Base Game does not currently allow this
 * It is called by CM.Cache.CacheBuildingsPrices() and CM.Disp.Tooltip()
 * @param	{string}	build		Name of the building
 * @param	{number}	basePrice	Base Price of building
 * @param	{number}	start		Starting amount of building
 * @param	{number}	free		Free amount of building
 * @param	{number}	increase	Increase of building
 * @returns {number}	moni		Total price
 */
CM.Sim.BuildingGetPrice = function (build, basePrice, start, free, increase) {
	let moni = 0;
	for (let i = 0; i < increase; i++) {
		let price = basePrice * Game.priceIncrease ** Math.max(0, start - free);
		price = Game.modifyBuildingPrice(build, price);
		price = Math.ceil(price);
		moni += price;
		start++;
	}
	return moni;
};

/**
 * This function calculates the sell price of a building based on current "sim data"
 * It is called by CM.Sim.BuildingSell()
 * @param	{string}	building	Name of the building
 * @param	{number}	price		Current price of building
 * @returns {number}	price		The modified building price
 */
CM.Sim.modifyBuildingPrice = function (building, price) {
	if (CM.Sim.Has('Season savings')) price *= 0.99;
	if (CM.Sim.Has('Santa\'s dominion')) price *= 0.99;
	if (CM.Sim.Has('Faberge egg')) price *= 0.99;
	if (CM.Sim.Has('Divine discount')) price *= 0.99;
	if (CM.Sim.Has('Fortune #100')) price *= 0.99;
	// if (CM.Sim.hasAura('Fierce Hoarder')) price *= 0.98;
	price *= 1 - CM.Sim.auraMult('Fierce Hoarder') * 0.02;
	if (Game.hasBuff('Everything must go')) price *= 0.95;
	if (Game.hasBuff('Crafty pixies')) price *= 0.98;
	if (Game.hasBuff('Nasty goblins')) price *= 1.02;
	if (building.fortune && CM.Sim.Has(building.fortune.name)) price *= 0.93;
	price *= CM.Sim.eff('buildingCost');
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		const godLvl = CM.Sim.hasGod('creation');
		if (godLvl === 1) price *= 0.93;
		else if (godLvl === 2) price *= 0.95;
		else if (godLvl === 3) price *= 0.98;
	}
	return price;
};

/**
 * This function calculates the sell multiplier based on current "sim data"
 * It is called by CM.Sim.BuildingSell()
 * @returns {number}	giveBack	The multiplier
 */
CM.Sim.getSellMultiplier = function () {
	let giveBack = 0.25;
	giveBack *= 1 + CM.Sim.auraMult('Earth Shatterer');
	return giveBack;
};

/**
 * This function calculates the cookies returned for selling a building
 * Base Game does not do this correctly
 * It is called by CM.Sim.SellBuildingsForChoEgg(), CM.Disp.Tooltip() and CM.Disp.Tooltip()
 * @param	{string}	build		Name of the building
 * @param	{number}	basePrice	Base Price of building
 * @param	{number}	start		Starting amount of building
 * @param	{number}	free		Free amount of building
 * @param	{number}	increase	Increase of building
 * @param	{number}	noSim		1 of 0 depending on if function is called from CM.Sim
 * @returns {number}	moni		Total price gained
 */
CM.Sim.BuildingSell = function (build, basePrice, start, free, amount, noSim) {
	// Calculate money gains from selling buildings
	// If noSim is set, use Game methods to compute price instead of Sim ones.
	noSim = typeof noSim === 'undefined' ? 0 : noSim;
	let moni = 0;
	if (amount === -1) amount = start;
	if (!amount) amount = Game.buyBulk;
	for (let i = 0; i < amount; i++) {
		let price = basePrice * Game.priceIncrease ** Math.max(0, start - free);
		price = noSim ? Game.modifyBuildingPrice(build, price) : CM.Sim.modifyBuildingPrice(build, price);
		price = Math.ceil(price);
		const giveBack = noSim ? build.getSellMultiplier() : CM.Sim.getSellMultiplier();
		price = Math.floor(price * giveBack);
		if (start > 0) {
			moni += price;
			start--;
		}
	}
	return moni;
};

/**
 * Section: Functions related to making functions that check against sim data rather than game data */

/**
 * This function "wins" an achievement in the current sim data
 * It functions similarly to Game.Win()
 * It is not created by CM.Sim.CreateSimFunctions() in order to avoid spamming pop-ups upon winning
 * @param	{string}	what	Name of the achievement
 */
CM.Sim.Win = function (what) {
	if (CM.Sim.Achievements[what]) {
		if (CM.Sim.Achievements[what].won === 0) {
			CM.Sim.Achievements[what].won = 1;
			if (Game.Achievements[what].pool !== 'shadow') CM.Sim.AchievementsOwned++;
		}
	}
};

/**
 * This function checks for the current God level in the sim data
 * It functions similarly to Game.hasGod()
 * It is not created by CM.Sim.CreateSimFunctions() as Game.hasGod() is not always available in each save
 * @param	{string}	what	Name of the achievement
 */
CM.Sim.hasGod = function (what) {
	if (Game.hasGod) {
		const god = CM.Sim.Objects.Temple.minigame.gods[what];
		for (let i = 0; i < 3; i++) {
			if (CM.Sim.Objects.Temple.minigame.slot[i] === god.id) {
				return (i + 1);
			}
		}
	}
	return false;
};

/**
 * Section: Functions related to checking the CPS of the current sim data */

/**
 * This function calculates the CPS of the current "sim data"
 * It is similar to Game.CalculateGains()
 * It is called at the start of any function that simulates certain behaviour or actions
 * @global	{number}	CM.Sim.cookiesPs	The CPS of the current sim data
 */
CM.Sim.CalculateGains = function () {
	CM.Sim.cookiesPs = 0;
	let mult = 1;
	// Include minigame effects
	const effs = {};
	for (const i of Object.keys(Game.Objects)) {
		if (Game.Objects[i].minigameLoaded && Game.Objects[i].minigame.effs) {
			const myEffs = Game.Objects[i].minigame.effs;
			for (const ii in myEffs) {
				if (effs[ii]) effs[ii] *= myEffs[ii];
				else effs[ii] = myEffs[ii];
			}
		}
	}
	CM.Sim.effs = effs;

	if (Game.ascensionMode !== 1) mult += parseFloat(CM.Sim.prestige) * 0.01 * CM.Sim.heavenlyPower * CM.Sim.GetHeavenlyMultiplier();

	mult *= CM.Sim.eff('cps');

	if (CM.Sim.Has('Heralds') && Game.ascensionMode !== 1) mult *= 1 + 0.01 * Game.heralds;

	for (const i of Object.keys(Game.cookieUpgrades)) {
		const me = Game.cookieUpgrades[i];
		if (CM.Sim.Has(me.name)) {
			// Some upgrades have a functio as .power (notably the valentine cookies)
			// CM.Sim.InitialBuildingData has changed to use CM.Sim.Has instead of Game.Has etc.
			// Therefore this call is to the .power of the Sim.Object
			if (typeof (me.power) === 'function') {
				mult *= 1 + (CM.Sim.Upgrades[me.name].power(CM.Sim.Upgrades[me.name]) * 0.01);
			} else mult *= 1 + (me.power * 0.01);
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
	let buildMult = 1;
	if (CM.Sim.hasGod) {
		let godLvl = CM.Sim.hasGod('asceticism');
		if (godLvl === 1) mult *= 1.15;
		else if (godLvl === 2) mult *= 1.1;
		else if (godLvl === 3) mult *= 1.05;

		godLvl = CM.Sim.hasGod('ages');
		if (godLvl === 1) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 3)) * Math.PI * 2);
		else if (godLvl === 2) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 12)) * Math.PI * 2);
		else if (godLvl === 3) mult *= 1 + 0.15 * Math.sin((CM.Sim.DateAges / 1000 / (60 * 60 * 24)) * Math.PI * 2);

		godLvl = CM.Sim.hasGod('decadence');
		if (godLvl === 1) buildMult *= 0.93;
		else if (godLvl === 2) buildMult *= 0.95;
		else if (godLvl === 3) buildMult *= 0.98;

		godLvl = CM.Sim.hasGod('industry');
		if (godLvl === 1) buildMult *= 1.1;
		else if (godLvl === 2) buildMult *= 1.06;
		else if (godLvl === 3) buildMult *= 1.03;

		godLvl = CM.Sim.hasGod('labor');
		if (godLvl === 1) buildMult *= 0.97;
		else if (godLvl === 2) buildMult *= 0.98;
		else if (godLvl === 3) buildMult *= 0.99;
	}

	if (CM.Sim.Has('Santa\'s legacy')) mult *= 1 + (Game.santaLevel + 1) * 0.03;

	const milkProgress = CM.Sim.AchievementsOwned / 25;
	let milkMult = 1;
	if (CM.Sim.Has('Santa\'s milk and cookies')) milkMult *= 1.05;
	// if (CM.Sim.hasAura('Breath of Milk')) milkMult *= 1.05;
	milkMult *= 1 + CM.Sim.auraMult('Breath of Milk') * 0.05;
	if (CM.Sim.hasGod) {
		const godLvl = CM.Sim.hasGod('mother');
		if (godLvl === 1) milkMult *= 1.1;
		else if (godLvl === 2) milkMult *= 1.05;
		else if (godLvl === 3) milkMult *= 1.03;
	}
	milkMult *= CM.Sim.eff('milk');

	let catMult = 1;

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

	for (const i of Object.keys(CM.Sim.Objects)) {
		const me = CM.Sim.Objects[i];
		let storedCps = me.cps(me);
		if (Game.ascensionMode !== 1) storedCps *= (1 + me.level * 0.01) * buildMult;
		if (me.name === 'Grandma' && CM.Sim.Has('Milkhelp&reg; lactose intolerance relief tablets')) storedCps *= 1 + 0.05 * milkProgress * milkMult;
		CM.Sim.cookiesPs += me.amount * storedCps;
	}

	if (CM.Sim.Has('"egg"')) CM.Sim.cookiesPs += 9;// "egg"

	mult *= catMult;

	let eggMult = 1;
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
		let day = Math.floor((CM.Sim.DateCentury - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day, 100);
		// Sets a Cache value to be displayed in the Stats page, could be moved...
		CM.Cache.CentEgg = 1 + (1 - (1 - day / 100) ** 3) * 0.1;
		eggMult *= CM.Cache.CentEgg;
	}
	mult *= eggMult;

	if (CM.Sim.Has('Sugar baking')) mult *= (1 + Math.min(100, Game.lumps) * 0.01);

	// if (CM.Sim.hasAura('Radiant Appetite')) mult *= 2;
	mult *= 1 + CM.Sim.auraMult('Radiant Appetite');

	const rawCookiesPs = CM.Sim.cookiesPs * mult;
	for (const i of Object.keys(Game.CpsAchievements)) {
		if (rawCookiesPs >= Game.CpsAchievements[i].threshold) CM.Sim.Win(Game.CpsAchievements[i].name);
	}

	CM.Sim.cookiesPsRaw = rawCookiesPs;

	const n = Game.shimmerTypes.golden.n;
	const auraMult = CM.Sim.auraMult('Dragon\'s Fortune');
	for (let i = 0; i < n; i++) {
		mult *= 1 + auraMult * 1.23;
	}

	const name = Game.bakeryName.toLowerCase();
	if (name === 'orteil') mult *= 0.99;
	else if (name === 'ortiel') mult *= 0.98;

	if (CM.Sim.Has('Elder Covenant')) mult *= 0.95;

	if (CM.Sim.Has('Golden switch [off]')) {
		let goldenSwitchMult = 1.5;
		if (CM.Sim.Has('Residual luck')) {
			const upgrades = Game.goldenCookieUpgrades;
			for (const i of Object.keys(upgrades)) {
				if (CM.Sim.Has(upgrades[i])) goldenSwitchMult += 0.1;
			}
		}
		mult *= goldenSwitchMult;
	}
	if (CM.Sim.Has('Shimmering veil [off]')) {
		let veilMult = 0.5;
		if (CM.Sim.Has('Reinforced membrane')) veilMult += 0.1;
		mult *= 1 + veilMult;
	}

	if (CM.Sim.Has('Magic shenanigans')) mult *= 1000;
	if (CM.Sim.Has('Occult obstruction')) mult *= 0;

	CM.Sim.cookiesPs = Game.runModHookOnValue('cps', CM.Sim.cookiesPs);

	mult *= CM.Cache.getCPSBuffMult();

	CM.Sim.cookiesPs *= mult;

	// if (Game.hasBuff('Cursed finger')) Game.cookiesPs = 0;
};

/**
 * This function calculates if any special achievements have been obtained
 * If so it CM.Sim.Win()'s them and the caller function will know to recall CM.Sim.CalculateGains()
 * It is called at the end of any functions that simulates certain behaviour
 */
CM.Sim.CheckOtherAchiev = function () {
	let grandmas = 0;
	for (const i of Object.keys(Game.GrandmaSynergies)) {
		if (CM.Sim.Has(Game.GrandmaSynergies[i])) grandmas++;
	}
	if (!CM.Sim.HasAchiev('Elder') && grandmas >= 7) CM.Sim.Win('Elder');
	if (!CM.Sim.HasAchiev('Veteran') && grandmas >= 14) CM.Sim.Win('Veteran');

	let buildingsOwned = 0;
	let mathematician = 1;
	let base10 = 1;
	let minAmount = 100000;
	for (const i of Object.keys(CM.Sim.Objects)) {
		buildingsOwned += CM.Sim.Objects[i].amount;
		minAmount = Math.min(CM.Sim.Objects[i].amount, minAmount);
		if (!CM.Sim.HasAchiev('Mathematician')) {
			if (CM.Sim.Objects[i].amount < Math.min(128, 2 ** ((Game.ObjectsById.length - Game.Objects[i].id) - 1))) mathematician = 0;
		}
		if (!CM.Sim.HasAchiev('Base 10')) {
			if (CM.Sim.Objects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id) * 10) base10 = 0;
		}
	}
	if (minAmount >= 1) CM.Sim.Win('One with everything');
	if (mathematician === 1) CM.Sim.Win('Mathematician');
	if (base10 === 1) CM.Sim.Win('Base 10');
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

	let hasAllHalloCook = true;
	for (const i of Object.keys(CM.Data.HalloCookies)) {
		if (!CM.Sim.Has(CM.Data.HalloCookies[i])) hasAllHalloCook = false;
	}
	if (hasAllHalloCook) CM.Sim.Win('Spooky cookies');

	let hasAllChristCook = true;
	for (const i of Object.keys(CM.Data.ChristCookies)) {
		if (!CM.Sim.Has(CM.Data.ChristCookies[i])) hasAllChristCook = false;
	}
	if (hasAllChristCook) CM.Sim.Win('Let it snow');

	if (CM.Sim.Has('Fortune cookies')) {
		const list = Game.Tiers.fortune.upgrades;
		let fortunes = 0;
		for (const i of Object.keys(list)) {
			if (CM.Sim.Has(list[i].name)) fortunes++;
		}
		if (fortunes >= list.length) CM.Sim.Win('O Fortuna');
	}
};

/**
 * This function calculates CPS without the Golden Switch
 * It is called by CM.Cache.NoGoldSwitchCPS()
 */
CM.Sim.NoGoldSwitchCPS = function () {
	CM.Sim.CopyData();
	CM.Sim.Upgrades['Golden switch [off]'].bought = 0;
	CM.Sim.CalculateGains();
	return CM.Sim.cookiesPs;
};

/**
 * Section: Functions related to calculating Bonus Income */

/**
 * This function calculates the bonus income of buying a building
 * It is called by CM.Cache.CacheBuildingIncome()
 * @param	{string}	building	The name of the building to be bought
 * @param	{number}	amount		The amount to be bought
 * @returns {number}				The bonus income of the building
 */
CM.Sim.BuyBuildingsBonusIncome = function (building, amount) {
	CM.Sim.CopyData();
	const me = CM.Sim.Objects[building];
	me.amount += amount;

	if (building === 'Cursor') {
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
	} else {
		for (const j in Game.Objects[me.name].tieredAchievs) {
			if (me.amount >= Game.Tiers[Game.Objects[me.name].tieredAchievs[j].tier].achievUnlock) {
				CM.Sim.Win(Game.Objects[me.name].tieredAchievs[j].name);
			}
		}
	}

	const lastAchievementsOwned = CM.Sim.AchievementsOwned;

	CM.Sim.CalculateGains();

	CM.Sim.CheckOtherAchiev();

	if (lastAchievementsOwned !== CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}

	return CM.Sim.cookiesPs - Game.cookiesPs;
};

/**
 * This function calculates the bonus income of buying a building
 * It is called by CM.Cache.CacheBuildingIncome()
 * @param	{string}				building	The name of the upgrade to be bought
 * @returns {[{number, number}]}				The bonus income of the upgrade and the difference in MouseCPS
 */
CM.Sim.BuyUpgradesBonusIncome = function (upgrade) {
	if (Game.Upgrades[upgrade].pool === 'toggle' || (Game.Upgrades[upgrade].bought === 0 && Game.Upgrades[upgrade].unlocked && Game.Upgrades[upgrade].pool !== 'prestige')) {
		CM.Sim.CopyData();
		const me = CM.Sim.Upgrades[upgrade];
		if (me.name === 'Shimmering veil [on]') {
			CM.Sim.Upgrades['Shimmering veil [off]'].bought = 0;
		} else if (me.name === 'Golden switch [on]') {
			CM.Sim.Upgrades['Golden switch [off]'].bought = 0;
		} else {
			me.bought = (me.bought + 1) % 2;
		}
		if (Game.CountsAsUpgradeOwned(Game.Upgrades[upgrade].pool)) CM.Sim.UpgradesOwned++;

		if (upgrade === 'Elder Pledge') {
			CM.Sim.pledges++;
			if (CM.Sim.pledges > 0) CM.Sim.Win('Elder nap');
			if (CM.Sim.pledges >= 5) CM.Sim.Win('Elder slumber');
		} else if (upgrade === 'Elder Covenant') {
			CM.Sim.Win('Elder calm');
		} else if (upgrade === 'Prism heart biscuits') {
			CM.Sim.Win('Lovely cookies');
		} else if (upgrade === 'Heavenly key') {
			CM.Sim.Win('Wholesome');
		}

		const lastAchievementsOwned = CM.Sim.AchievementsOwned;

		CM.Sim.CalculateGains();

		CM.Sim.CheckOtherAchiev();

		if (lastAchievementsOwned !== CM.Sim.AchievementsOwned) {
			CM.Sim.CalculateGains();
		}

		const diffMouseCPS = CM.Sim.mouseCps() - Game.computedMouseCps;
		if (diffMouseCPS) {
			return [CM.Sim.cookiesPs - Game.cookiesPs, diffMouseCPS];
		}
		return [CM.Sim.cookiesPs - Game.cookiesPs];
	} else {
		return [];
	}
};

/**
 * This function calculates the cookies per click
 * It is called by CM.Sim.BuyUpgradesBonusIncome() when an upgrades has no bonus-income (and is thus a clicking-upgrade)
 * @returns	{number}	out	The clicking power
 */
CM.Sim.mouseCps = function () {
	let add = 0;
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
	let num = 0;
	for (const i of Object.keys(CM.Sim.Objects)) { num += CM.Sim.Objects[i].amount; }
	num -= CM.Sim.Objects.Cursor.amount;
	add *= num;

	// Can use CM.Sim.cookiesPs as function is always called after CM.Sim.CalculateGains()
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

	let mult = 1;
	if (CM.Sim.Has('Santa\'s helpers')) mult *= 1.1;
	if (CM.Sim.Has('Cookie egg')) mult *= 1.1;
	if (CM.Sim.Has('Halo gloves')) mult *= 1.1;
	if (CM.Sim.Has('Dragon claw')) mult *= 1.03;

	if (CM.Sim.Has('Aura gloves')) {
		mult *= 1 + 0.05 * Math.min(Game.Objects.Cursor.level, CM.Sim.Has('Luminous gloves') ? 20 : 10);
	}

	mult *= CM.Sim.eff('click');
	if (CM.Sim.Objects.Temple.minigameLoaded) {
		if (CM.Sim.hasGod) {
			const godLvl = CM.Sim.hasGod('labor');
			if (godLvl === 1) mult *= 1.15;
			else if (godLvl === 2) mult *= 1.1;
			else if (godLvl === 3) mult *= 1.05;
		}
	}

	for (const i of Object.keys(Game.buffs)) {
		if (typeof Game.buffs[i].multClick !== 'undefined') mult *= Game.buffs[i].multClick;
	}

	// if (CM.Sim.auraMult('Dragon Cursor')) mult*=1.05;
	mult *= 1 + CM.Sim.auraMult('Dragon Cursor') * 0.05;

	// No need to make this function a CM function
	let out = mult * Game.ComputeCps(1, CM.Sim.Has('Reinforced index finger') + CM.Sim.Has('Carpal tunnel prevention cream') + CM.Sim.Has('Ambidextrous'), add);

	out = Game.runModHookOnValue('cookiesPerClick', out);

	if (Game.hasBuff('Cursed finger')) out = Game.buffs['Cursed finger'].power;

	return out;
};

/**
 * Section: Functions related to calculating the effect of changing Dragon Aura */

/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}			aura										The number of the aura currently selected by the mouse/user
 * @returns {[number, number]} 	[CM.Sim.cookiesPs - Game.cookiesPs, price]	The bonus cps and the price of the change
 */
CM.Sim.CalculateChangeAura = function (aura) {
	CM.Sim.CopyData();

	// Check if aura being changed is first or second aura
	const auraToBeChanged = l('promptContent').children[0].innerHTML.includes('secondary');
	if (auraToBeChanged) CM.Sim.dragonAura2 = aura;
	else CM.Sim.dragonAura = aura;

	// Sell highest building but only if aura is different
	let price = 0;
	if (CM.Sim.dragonAura !== CM.Cache.dragonAura || CM.Sim.dragonAura2 !== CM.Cache.dragonAura2) {
		for (let i = Game.ObjectsById.length - 1; i > -1; --i) {
			if (Game.ObjectsById[i - 1].amount > 0) {
				const highestBuilding = CM.Sim.Objects[Game.ObjectsById[i].name].name;
				CM.Sim.Objects[highestBuilding].amount -= 1;
				CM.Sim.buildingsOwned -= 1;
				price = CM.Sim.Objects[highestBuilding].basePrice * Game.priceIncrease ** Math.max(0, CM.Sim.Objects[highestBuilding].amount - 1 - CM.Sim.Objects[highestBuilding].free);
				price = Game.modifyBuildingPrice(CM.Sim.Objects[highestBuilding], price);
				price = Math.ceil(price);
				break;
			}
		}
	}

	const lastAchievementsOwned = CM.Sim.AchievementsOwned;
	CM.Sim.CalculateGains();

	CM.Sim.CheckOtherAchiev();
	if (lastAchievementsOwned !== CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}
	return [CM.Sim.cookiesPs - Game.cookiesPs, price];
};

/**
 * Section: Functions related to calculating the reset bonus */

/**
 * This function calculates the cookies per click difference betwene current and after a ascension
 * It is called by CM.Disp.CreateStatsPrestigeSection()
 * @param	{number}	newHeavenlyChips	The total heavenly chips after ascension
 * @returns	{number}	ResetCPS			The CPS difference after reset
 */
CM.Sim.ResetBonus = function (newHeavenlyChips) {
	// Calculate CPS with all Heavenly upgrades
	let curCPS = Game.cookiesPs;

	CM.Sim.CopyData();

	if (CM.Sim.Upgrades['Heavenly key'].bought === 0) {
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

	CM.Sim.prestige = newHeavenlyChips;

	const lastAchievementsOwned = CM.Sim.AchievementsOwned;

	CM.Sim.CalculateGains();

	CM.Sim.CheckOtherAchiev();

	if (lastAchievementsOwned !== CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}

	const ResetCPS = CM.Sim.cookiesPs - curCPS;

	// Reset Pretige level after calculation as it is used in CM.Sim.CalculateGains() so can't be local
	CM.Sim.prestige = Game.prestige;

	return ResetCPS;
};

/**
 * Section: Functions related to selling builings before buying the chocolate egg */

/**
 * This function calculates the maximum cookies obtained from selling buildings just before purchasing the chocolate egg
 * It is called by CM.Cache.CacheSellForChoEgg()
 * @returns	{number}	sellTotal	The maximum cookies to be earned
 */
CM.Sim.SellBuildingsForChoEgg = function () {
	let sellTotal = 0;

	CM.Sim.CopyData();

	// Change auras to Earth Shatterer + Reality bending to optimize money made by selling
	let buildingsToSacrifice = 2;
	if (CM.Sim.dragonAura === 5 || CM.Sim.dragonAura === 18) {
		--buildingsToSacrifice;
	}
	if (CM.Sim.dragonAura2 === 5 || CM.Sim.dragonAura2 === 18) {
		--buildingsToSacrifice;
	}
	CM.Sim.dragonAura = 5;
	CM.Sim.dragonAura2 = 18;

	// Sacrifice highest buildings for the aura switch
	for (let i = 0; i < buildingsToSacrifice; ++i) {
		let highestBuilding = 0;
		for (const j in CM.Sim.Objects) {
			if (CM.Sim.Objects[j].amount > 0) {
				highestBuilding = CM.Sim.Objects[j];
			}
		}
		highestBuilding.amount--;
		CM.Sim.buildingsOwned--;
	}

	// Get money made by selling all remaining buildings
	for (const i of Object.keys(CM.Sim.Objects)) {
		const me = CM.Sim.Objects[i];
		sellTotal += CM.Sim.BuildingSell(Game.Objects[me.name], Game.Objects[i].basePrice, me.amount, Game.Objects[i].free, me.amount);
	}

	return sellTotal;
};
