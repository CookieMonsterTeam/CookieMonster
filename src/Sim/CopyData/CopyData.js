/* eslint-disable no-unused-vars */
import CacheDragonAuras from '../../Cache/Dragon/CacheDragonAuras';
import { CacheDragonAura, CacheDragonAura2 } from '../../Cache/VariablesAndData';
import { CreateBotBarBuildingColumn } from '../../Disp/InfoBars/CreateDOMElements';
import InitAchievement from '../InitializeData/InitAchievement';
import InitialBuildingData from '../InitializeData/InitialBuildingData';
import InitUpgrade from '../InitializeData/InitUpgrade';
import {
	SimAchievements, SimAchievementsOwned, SimDragonAura, SimDragonAura2, SimHeavenlyPower, SimObjects, SimPledges, SimPrestige, SimUpgrades, SimUpgradesOwned,
} from '../VariablesAndData';

/**
 * This function copies all relevant data and therefore sets a new iteration of the "sim data"
 * It is called at the start of any function that simulates certain behaviour or actions
 */
export default function CopyData() {
	// Other variables
	SimUpgradesOwned = Game.UpgradesOwned;
	SimPledges = Game.pledges;
	SimAchievementsOwned = Game.AchievementsOwned;
	SimHeavenlyPower = Game.heavenlyPower;
	SimPrestige = Game.prestige;

	// Buildings
	for (const i of Object.keys(Game.Objects)) {
		const me = Game.Objects[i];
		let you = SimObjects[i];
		if (you === undefined) { // New building!
			SimObjects[i] = InitialBuildingData(i);
			you = SimObjects[i];
			CreateBotBarBuildingColumn(i); // Add new building to the bottom bar
		}
		you.amount = me.amount;
		you.level = me.level;
		you.totalCookies = me.totalCookies;
		you.basePrice = me.basePrice;
		you.free = me.free;
		if (me.minigameLoaded) {
			you.minigameLoaded = me.minigameLoaded;
			you.minigame = me.minigame;
		}
	}

	// Upgrades
	for (const i of Object.keys(Game.Upgrades)) {
		const me = Game.Upgrades[i];
		let you = SimUpgrades[i];
		if (you === undefined) {
			SimUpgrades[i] = InitUpgrade(i);
			you = SimUpgrades[i];
		}
		you.bought = me.bought;
	}

	// Achievements
	for (const i of Object.keys(Game.Achievements)) {
		const me = Game.Achievements[i];
		let you = SimAchievements[i];
		if (you === undefined) {
			SimAchievements[i] = InitAchievement(i);
			you = SimAchievements[i];
		}
		you.won = me.won;
	}

	// Auras
	CacheDragonAuras();
	SimDragonAura = CacheDragonAura;
	SimDragonAura2 = CacheDragonAura2;
}
