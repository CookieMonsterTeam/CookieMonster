/********
 * Main *
 ********/

CM.ReplaceNative = function() {
	CM.Backup.Beautify = Beautify;
	Beautify = CM.Disp.Beautify;

	CM.Backup.CalculateGains = Game.CalculateGains;
	Game.CalculateGains = function() {
		CM.Backup.CalculateGains();
		CM.Sim.DoSims = 1;
		CM.Sim.Date = Date.now();
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

	CM.Backup.UpdateSpecial = Game.UpdateSpecial;
	Game.UpdateSpecial = function() {
		if (CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
			var timerBarHeight = parseInt(CM.Disp.TimerBar.style.height);
			Game.mouseY -= timerBarHeight;
			CM.Backup.UpdateSpecial();
			Game.mouseY += timerBarHeight;
		}
		else {
			CM.Backup.UpdateSpecial();
		}
	}

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
			if (minigame.magic < minigame.magicM) {
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
		var hasFierHoard = Game.hasAura('Fierce Hoarder');
		if (!CM.Cache.HadFierHoard && hasFierHoard) {
			CM.Cache.HadFierHoard = true;
			CM.Cache.DoRemakeBuildPrices = 1;
		}
		else if (CM.Cache.HadFierHoard && !hasFierHoard) {
			CM.Cache.HadFierHoard = false;
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

	// Check Season Popup
	CM.Disp.CheckSeasonPopup();

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
	CM.Disp.CreateTooltip('GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px');
	CM.Disp.CreateTooltip('PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all buildings with Earth Shatterer aura, and buying Chocolate egg', '370px');
	CM.Disp.CreateTooltip('NextPrestTooltipPlaceholder', 'Calculated with cookies gained from wrinklers and Chocolate egg', '200px');
	CM.Disp.CreateTooltip('HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all buildings with Earth Shatterer aura, and buying Chocolate egg', '390px');
	CM.Disp.CreateTooltip('ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from reset achievements if you have the same buildings/upgrades after reset', '370px');
	CM.Disp.CreateTooltip('ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all buildings with Earth Shatterer aura, and then buying Chocolate egg', '360px');
	CM.Disp.CreateTooltipWarnCaut();
	CM.Disp.AddTooltipBuild();
	CM.Disp.AddTooltipGrimoire();
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

CM.ConfigDefault = {BotBar: 1, TimerBar: 1, TimerBarPos: 0, BuildColor: 1, BulkBuildColor: 0, UpBarColor: 1, CalcWrink: 0, CPSMode: 1, AvgCPSHist: 0, AvgClicksHist: 0, ToolWarnCautBon: 0, Flash: 1, Sound: 1,  Volume: 100, GCSoundURL: 'https://freesound.org/data/previews/66/66717_931655-lq.mp3', SeaSoundURL: 'https://www.freesound.org/data/previews/121/121099_2193266-lq.mp3', GCTimer: 1, Title: 1, Favicon: 1, Tooltip: 1, TooltipAmor: 0, ToolWarnCaut: 1, ToolWarnCautPos: 1, ToolWrink: 1, Stats: 1, UpStats: 1, TimeFormat: 0, SayTime: 1, Scale: 2, StatsPref: {Lucky: 1, Chain: 1, Prestige: 1, Wrink: 1, Sea: 1, Misc: 1}, Colors : {Blue: '#4bb8f0', Green: '#00ff00', Yellow: '#ffff00', Orange: '#ff7f00', Red: '#ff0000', Purple: '#ff00ff', Gray: '#b3b3b3', Pink: '#ff1493', Brown: '#8b4513'}};
CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '2.0106';
CM.VersionMinor = '1';

