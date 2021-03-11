/** Main function to create the sections of Cookie Monster on the Statistics page */

import { AddMissingUpgrades } from './CreateMissingUpgrades';
import * as CreateSections from './CreateStatsSections';
import * as CreateElements from './CreateDOMElements';
import * as GameData from '../../../Data/src/Gamedata';

/**
 * This function adds stats created by CookieMonster to the stats page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
export default function AddMenuStats(title) {
	const stats = document.createElement('div');
	stats.className = 'subsection';
	stats.appendChild(title);

	stats.appendChild(CreateElements.StatsHeader('Lucky Cookies', 'Lucky'));
	if (CM.Options.Header.Lucky) {
		stats.appendChild(CreateSections.LuckySection());
	}

	stats.appendChild(CreateElements.StatsHeader('Chain Cookies', 'Chain'));
	if (CM.Options.Header.Chain) {
		stats.appendChild(CreateSections.ChainSection());
	}

	if (Game.Objects['Wizard tower'].minigameLoaded) {
		stats.appendChild(CreateElements.StatsHeader('Spells', 'Spells'));
		if (CM.Options.Header.Spells) {
			stats.appendChild(CreateSections.SpellsSection());
		}
	}

	if (Game.Objects.Farm.minigameLoaded) {
		stats.appendChild(CreateElements.StatsHeader('Garden', 'Garden'));
		if (CM.Options.Header.Garden) {
			stats.appendChild(CreateSections.GardenSection());
		}
	}

	stats.appendChild(CreateElements.StatsHeader('Prestige', 'Prestige'));
	if (CM.Options.Header.Prestige) {
		stats.appendChild(CreateSections.PrestigeSection());
	}

	if (Game.cpsSucked > 0) {
		stats.appendChild(CreateElements.StatsHeader('Wrinklers', 'Wrink'));
		if (CM.Options.Header.Wrink) {
			const popAllFrag = document.createDocumentFragment();
			popAllFrag.appendChild(document.createTextNode(`${Beautify(CM.Cache.WrinklersTotal)} / ${Beautify(CM.Cache.WrinklersNormal)} `));
			const popAllA = document.createElement('a');
			popAllA.textContent = 'Pop All Normal';
			popAllA.className = 'option';
			popAllA.onclick = function () { CM.Disp.PopAllNormalWrinklers(); };
			popAllFrag.appendChild(popAllA);
			stats.appendChild(CreateElements.StatsListing('basic', 'Rewards of Popping (All/Normal)', popAllFrag));
			const popFattestFrag = document.createDocumentFragment();
			popFattestFrag.appendChild(document.createTextNode(`${Beautify(CM.Cache.WrinklersFattest[0])} `));
			const popFattestA = document.createElement('a');
			popFattestA.textContent = 'Pop Single Fattest';
			popFattestA.className = 'option';
			popFattestA.onclick = function () { if (CM.Cache.WrinklersFattest[1] !== null) Game.wrinklers[CM.Cache.WrinklersFattest[1]].hp = 0; };
			popFattestFrag.appendChild(popFattestA);
			stats.appendChild(CreateElements.StatsListing('basic', `Rewards of Popping Single Fattest Non-Shiny Wrinkler (id: ${CM.Cache.WrinklersFattest[1] !== null ? CM.Cache.WrinklersFattest[1] : 'None'})`, popFattestFrag));
		}
	}

	let specDisp = false;
	const missingHalloweenCookies = [];
	for (const i of Object.keys(GameData.HalloCookies)) {
		if (!Game.Has(GameData.HalloCookies[i])) {
			missingHalloweenCookies.push(GameData.HalloCookies[i]);
			specDisp = true;
		}
	}
	const missingChristmasCookies = [];
	for (const i of Object.keys(GameData.ChristCookies)) {
		if (!Game.Has(GameData.ChristCookies[i])) {
			missingChristmasCookies.push(GameData.ChristCookies[i]);
			specDisp = true;
		}
	}
	const missingValentineCookies = [];
	for (const i of Object.keys(GameData.ValCookies)) {
		if (!Game.Has(GameData.ValCookies[i])) {
			missingValentineCookies.push(GameData.ValCookies[i]);
			specDisp = true;
		}
	}
	const missingNormalEggs = [];
	for (const i of Object.keys(Game.eggDrops)) {
		if (!Game.HasUnlocked(Game.eggDrops[i])) {
			missingNormalEggs.push(Game.eggDrops[i]);
			specDisp = true;
		}
	}
	const missingRareEggs = [];
	for (const i of Object.keys(Game.rareEggDrops)) {
		if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
			missingRareEggs.push(Game.rareEggDrops[i]);
			specDisp = true;
		}
	}
	const missingPlantDrops = [];
	for (const i of Object.keys(GameData.PlantDrops)) {
		if (!Game.HasUnlocked(GameData.PlantDrops[i])) {
			missingPlantDrops.push(GameData.PlantDrops[i]);
			specDisp = true;
		}
	}
	const choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));
	const centEgg = Game.Has('Century egg');

	if (Game.season === 'christmas' || specDisp || choEgg || centEgg) {
		stats.appendChild(CreateElements.StatsHeader('Season Specials', 'Sea'));
		if (CM.Options.Header.Sea) {
			if (missingHalloweenCookies.length !== 0) stats.appendChild(CreateElements.StatsListing('basic', 'Halloween Cookies Left to Buy', CreateElements.StatsMissDisp(missingHalloweenCookies)));
			if (missingChristmasCookies.length !== 0) stats.appendChild(CreateElements.StatsListing('basic', 'Christmas Cookies Left to Buy', CreateElements.StatsMissDisp(missingChristmasCookies)));
			if (missingValentineCookies.length !== 0) stats.appendChild(CreateElements.StatsListing('basic', 'Valentine Cookies Left to Buy', CreateElements.StatsMissDisp(missingValentineCookies)));
			if (missingNormalEggs.length !== 0) stats.appendChild(CreateElements.StatsListing('basic', 'Normal Easter Eggs Left to Unlock', CreateElements.StatsMissDisp(missingNormalEggs)));
			if (missingRareEggs.length !== 0) stats.appendChild(CreateElements.StatsListing('basic', 'Rare Easter Eggs Left to Unlock', CreateElements.StatsMissDisp(missingRareEggs)));
			if (missingPlantDrops.length !== 0) stats.appendChild(CreateElements.StatsListing('basic', 'Rare Plant Drops Left to Unlock', CreateElements.StatsMissDisp(missingPlantDrops)));

			if (Game.season === 'christmas') stats.appendChild(CreateElements.StatsListing('basic', 'Reindeer Reward', document.createTextNode(Beautify(CM.Cache.SeaSpec))));
			if (choEgg) {
				stats.appendChild(CreateElements.StatsListing('withTooltip', 'Chocolate Egg Cookies', document.createTextNode(Beautify(CM.Cache.lastChoEgg)), 'ChoEggTooltipPlaceholder'));
			}
			if (centEgg) {
				stats.appendChild(CreateElements.StatsListing('basic', 'Century Egg Multiplier', document.createTextNode(`${Math.round((CM.Cache.CentEgg - 1) * 10000) / 100}%`)));
			}
		}
	}

	stats.appendChild(CreateElements.StatsHeader('Miscellaneous', 'Misc'));
	if (CM.Options.Header.Misc) {
		stats.appendChild(CreateElements.StatsListing('basic',
			`Average Cookies Per Second (Past ${CM.Disp.cookieTimes[CM.Options.AvgCPSHist] < 60 ? (`${CM.Disp.cookieTimes[CM.Options.AvgCPSHist]} seconds`) : ((CM.Disp.cookieTimes[CM.Options.AvgCPSHist] / 60) + (CM.Options.AvgCPSHist === 3 ? ' minute' : ' minutes'))})`,
			document.createTextNode(Beautify(CM.Disp.GetCPS(), 3))));
		stats.appendChild(CreateElements.StatsListing('basic', `Average Cookie Clicks Per Second (Past ${CM.Disp.clickTimes[CM.Options.AvgClicksHist]}${CM.Options.AvgClicksHist === 0 ? ' second' : ' seconds'})`, document.createTextNode(Beautify(CM.Cache.AverageClicks, 1))));
		if (Game.Has('Fortune cookies')) {
			const fortunes = [];
			for (const i of Object.keys(GameData.Fortunes)) {
				if (!Game.Has(GameData.Fortunes[i])) {
					fortunes.push(GameData.Fortunes[i]);
				}
			}
			if (fortunes.length !== 0) stats.appendChild(CreateElements.StatsListing('basic', 'Fortune Upgrades Left to Buy', CreateElements.StatsMissDisp(fortunes)));
		}
		if (CM.Options.ShowMissedGC) {
			stats.appendChild(CreateElements.StatsListing('basic', 'Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
		}
		if (Game.prefs.autosave) {
			const timer = document.createElement('span');
			timer.id = 'CMStatsAutosaveTimer';
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.OnAscend ? 0 : (Game.T % (Game.fps * 60))), 4);
			stats.appendChild(CreateElements.StatsListing('basic', 'Time till autosave', timer));
		}
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);

	if (CM.Options.MissingUpgrades) {
		AddMissingUpgrades();
	}
};