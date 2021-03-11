import { Beautify, FormatTime, GetTimeColor } from './BeautifyFormatting';
import { AddAuraInfo, AddDragonLevelUpTooltip } from './BuildingsUpgrades/Dragon';
import { CreateGCTimer, ToggleGCTimer } from '../src/GoldenCookieTimers';
import { Flash, Notification, PlaySound } from './BuildingsUpgrades/Notifications';
import { CreateFavicon, UpdateFavicon, UpdateTitle } from '../src/TabTitle';
import { ToggleToolWarnPos, UpdateTooltipLocation } from './Tooltips/PositionLocation';
import { CreateSimpleTooltip, CreateTooltip, UpdateTooltips } from './Tooltips/Tooltip';
import { CheckWrinklerTooltip, UpdateWrinklerTooltip } from './Tooltips/WrinklerTooltips';

const Disp = {
	Beautify: Beautify,
	FormatTime: FormatTime,
	GetTimeColor: GetTimeColor,

	Tooltip: CreateTooltip,
	UpdateTooltip: UpdateTooltips,
	CreateSimpleTooltip: CreateSimpleTooltip,

	CheckWrinklerTooltip: CheckWrinklerTooltip,
	UpdateWrinklerTooltip: UpdateWrinklerTooltip,

	UpdateTooltipLocation: UpdateTooltipLocation,
	ToggleToolWarnPos: ToggleToolWarnPos,

	Flash: Flash,
	Notification: Notification,
	PlaySound: PlaySound,

	CreateFavIcon: CreateFavicon,
	UpdateFavicon: UpdateFavicon,
	UpdateTitle: UpdateTitle,

	ToggleGCTimer: ToggleGCTimer,
	CreateGCTimer: CreateGCTimer,

	AddAuraInfo: AddAuraInfo,
	AddDragonLevelUpTooltip: AddDragonLevelUpTooltip,
};

CM.Disp = Disp;

/**
 * Please make sure to annotate your code correctly using JSDoc.
 * Only put functions related to graphics and displays in this file.
 * All calculations and data should preferrably be put in other files. */

/**
 * This function replaces the original .onmouseover functions of upgrades so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'u'
 * It is called by Game.RebuildUpgrades() through CM.Main.ReplaceNative() and is therefore not permanent like the other ReplaceTooltip functions
 */
CM.Disp.ReplaceTooltipUpgrade = function () {
	CM.Disp.TooltipUpgradeBackup = [];
	for (const i of Object.keys(Game.UpgradesInStore)) {
		if (l(`upgrade${i}`).onmouseover !== null) {
			CM.Disp.TooltipUpgradeBackup[i] = l(`upgrade${i}`).onmouseover;
			l(`upgrade${i}`).onmouseover = function () { if (!Game.mouseDown) { Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function () { return CM.Disp.Tooltip('u', `${i}`); }, 'store'); Game.tooltip.wobble(); } };
		}
	}
};

/**
 * Section: Auxilirary functions used by other functions */

/**
 * This function returns the total amount stored in the Wrinkler Bank
 * as calculated by  CM.Cache.CacheWrinklers() if CM.Options.CalcWrink is set
 * @returns	{number}	0 or the amount of cookies stored (CM.Cache.WrinklersTotal)
 */
CM.Disp.GetWrinkConfigBank = function () {
	if (CM.Options.CalcWrink === 1) {
		return CM.Cache.WrinklersTotal;
	} else if (CM.Options.CalcWrink === 2) {
		return CM.Cache.WrinklersFattest[0];
	} else {
		return 0;
	}
};



/**
 * This function returns the cps as either current or average CPS depending on CM.Options.CPSMode
 * @returns	{number}	The average or current cps
 */
CM.Disp.GetCPS = function () {
	if (CM.Options.CPSMode) {
		return CM.Cache.AvgCPS;
	} else if (CM.Options.CalcWrink === 0) {
		return (Game.cookiesPs * (1 - Game.cpsSucked));
	} else if (CM.Options.CalcWrink === 1) {
		return Game.cookiesPs * (CM.Cache.CurrWrinklerCPSMult + (1 - (CM.Cache.CurrWrinklerCount * 0.05)));
	} else if (CM.Options.CalcWrink === 2 && Game.wrinklers[CM.Cache.WrinklersFattest[1]].type === 1) {
		return Game.cookiesPs * ((CM.Cache.CurrWrinklerCPSMult * 3 / CM.Cache.CurrWrinklerCount) + (1 - (CM.Cache.CurrWrinklerCount * 0.05)));
	} else {
		return Game.cookiesPs * ((CM.Cache.CurrWrinklerCPSMult / CM.Cache.CurrWrinklerCount) + (1 - (CM.Cache.CurrWrinklerCount * 0.05)));
	}
};

/**
 * This function calculates the time it takes to reach a certain magic level
 * It is called by CM.Disp.UpdateTooltipGrimoire()
 * @param	{number}	currentMagic		The current magic level
 * @param	{number}	maxMagic			The user's max magic level
 * @param	{number}	targetMagic			The target magic level
 * @returns	{number}	count / Game.fps	The time it takes to reach targetMagic
 */
CM.Disp.CalculateGrimoireRefillTime = function (currentMagic, maxMagic, targetMagic) {
	let count = 0;
	while (currentMagic < targetMagic) {
		currentMagic += Math.max(0.002, (currentMagic / Math.max(maxMagic, 100)) ** 0.5) * 0.002;
		count++;
	}
	return count / Game.fps;
};

/**
 * This function returns Name and Color as object for sugar lump type that is given as input param.
 * It is called by CM.Disp.UpdateTooltipSugarLump()
 * @param 	{string} 				type 			Sugar Lump Type.
 * @returns {{string}, {string}}	text, color		An array containing the text and display-color of the sugar lump
 */
CM.Disp.GetLumpColor = function (type) {
	if (type === 0) {
		return { text: 'Normal', color: CM.Disp.colorGray };
	} else if (type === 1) {
		return { text: 'Bifurcated', color: CM.Disp.colorGreen };
	} else if (type === 2) {
		return { text: 'Golden', color: CM.Disp.colorYellow };
	} else if (type === 3) {
		return { text: 'Meaty', color: CM.Disp.colorOrange };
	} else if (type === 4) {
		return { text: 'Caramelized', color: CM.Disp.colorPurple };
	} else {
		return { text: 'Unknown Sugar Lump', color: CM.Disp.colorRed };
	}
};

/**
 * Section: General functions related to display, drawing and initialization of the page */

/**
 * This function disables and shows the bars created by CookieMonster when the game is "ascending"
 * It is called by CM.Disp.Draw()
 */
CM.Disp.UpdateAscendState = function () {
	if (Game.OnAscend) {
		l('game').style.bottom = '0px';
		if (CM.Options.BotBar === 1) CM.Disp.BotBar.style.display = 'none';
		if (CM.Options.TimerBar === 1) CM.Disp.TimerBar.style.display = 'none';
	} else {
		CM.Disp.ToggleBotBar();
		CM.Disp.ToggleTimerBar();
	}
	CM.Disp.UpdateBackground();
};

/**
 * This function sets the size of the background of the full game and the left column
 * depending on whether certain abrs are activated
 * It is called by CM.Disp.UpdateAscendState() and CM.Disp.UpdateBotTimerBarPosition()
 */
CM.Disp.UpdateBackground = function () {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
};

/**
 * This function handles all custom drawing for the Game.Draw() function.
 * It is hooked on 'draw' by CM.RegisterHooks()
 */
CM.Disp.Draw = function () {
	// Draw autosave timer in stats menu, this must be done here to make it count down correctly
	if (
		(Game.prefs.autosave && Game.drawT % 10 === 0) // with autosave ON and every 10 ticks
		&& (Game.onMenu === 'stats' && CM.Options.Stats) // while being on the stats menu only
	) {
		const timer = document.getElementById('CMStatsAutosaveTimer');
		if (timer) {
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.T % (Game.fps * 60)), 4);
		}
	}

	// Update colors
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();

	// Redraw timers
	CM.Disp.UpdateTimerBar();

	// Update Bottom Bar
	CM.Disp.UpdateBotBar();

	// Update Tooltip
	CM.Disp.UpdateTooltip();

	// Update Wrinkler Tooltip
	CM.Disp.CheckWrinklerTooltip();
	CM.Disp.UpdateWrinklerTooltip();

	// Change menu refresh interval
	CM.Disp.RefreshMenu();
};

/**
 * Section: General functions related to the Options/Stats pages

/**
 * This function adds the calll the functions to add extra info to the stats and options pages
 * It is called by Game.UpdateMenu()
 */
CM.Disp.AddMenu = function () {
	const title = document.createElement('div');
	title.className = 'title';

	if (Game.onMenu === 'prefs') {
		title.textContent = 'Cookie Monster Settings';
		CM.Disp.AddMenuPref(title);
	} else if (Game.onMenu === 'stats') {
		if (CM.Options.Stats) {
			title.textContent = 'Cookie Monster Statistics';
			CM.Disp.AddMenuStats(title);
		}
	} else if (Game.onMenu === 'log') {
		title.textContent = 'Cookie Monster '; // To create space between name and button
		CM.Disp.AddMenuInfo(title);
	}
};

/**
 * This function refreshes the stats page, CM.Options.UpStats determines the rate at which that happens
 * It is called by CM.Disp.Draw()
 */
CM.Disp.RefreshMenu = function () {
	if (CM.Options.UpStats && Game.onMenu === 'stats' && (Game.drawT - 1) % (Game.fps * 5) !== 0 && (Game.drawT - 1) % Game.fps === 0) Game.UpdateMenu();
};

/**
 * This function changes some of the time-displays in the game to be more detailed
 * It is called by a change in CM.Options.DetailedTime
 */
CM.Disp.ToggleDetailedTime = function () {
	if (CM.Options.DetailedTime === 1) Game.sayTime = CM.Disp.sayTime;
	else Game.sayTime = CM.Backup.sayTime;
};

/**
 * This function refreshes all numbers after a change in scale-setting
 * It is therefore called by a changes in CM.Options.Scale, CM.Options.ScaleDecimals, CM.Options.ScaleSeparator and CM.Options.ScaleCutoff
 */
CM.Disp.RefreshScale = function () {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	CM.Disp.UpdateBotBar();
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();
};

/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Options.Colors
 */
CM.Disp.UpdateColors = function () {
	let str = '';
	for (let i = 0; i < CM.Disp.colors.length; i++) {
		str += `.${CM.Disp.colorTextPre}${CM.Disp.colors[i]} { color: ${CM.Options.Colors[CM.Disp.colors[i]]}; }\n`;
	}
	for (let i = 0; i < CM.Disp.colors.length; i++) {
		str += `.${CM.Disp.colorBackPre}${CM.Disp.colors[i]} { background-color: ${CM.Options.Colors[CM.Disp.colors[i]]}; }\n`;
	}
	for (let i = 0; i < CM.Disp.colors.length; i++) {
		str += `.${CM.Disp.colorBorderPre}${CM.Disp.colors[i]} { border: 1px solid ${CM.Options.Colors[CM.Disp.colors[i]]}; }\n`;
	}
	CM.Disp.Css.textContent = str;
	CM.Disp.UpdateBuildings(); // Class has been already set
};

/**
 * This function updates the display setting of the two objects created by CM.Disp.CreateWrinklerButtons()
 * It is called by changes in CM.Options.WrinklerButtons
 */
CM.Disp.UpdateWrinklerButtons = function () {
	if (CM.Options.WrinklerButtons) {
		l('PopAllNormalWrinklerButton').style.display = '';
		l('PopFattestWrinklerButton').style.display = '';
	} else {
		l('PopAllNormalWrinklerButton').style.display = 'none';
		l('PopFattestWrinklerButton').style.display = 'none';
	}
};
