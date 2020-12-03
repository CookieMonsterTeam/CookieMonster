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
		CM.Disp.DrawTooltipWarn();
	}

	CM.Backup.tooltip.update = Game.tooltip.update;
	eval('CM.Backup.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this.').join('Game.tooltip.'));
	Game.tooltip.update = function() {
		CM.Backup.tooltip.updateMod();
		CM.Disp.UpdateTooltipWarn();
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
			CM.Cache.RemakeGoldenAndWrathCookiesMults();
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
	}

	// Check all changing minigames and game-states
	CM.Main.CheckGoldenCookie();
	CM.Main.CheckTickerFortune();
	CM.Main.CheckSeasonPopup();
	CM.Main.CheckGardenTick();
	CM.Main.CheckMagicMeter();
	CM.Main.CheckWrinklerCount();

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
	for (var i in CM.Disp.TooltipText) {
		CM.Disp.CreateTooltip(CM.Disp.TooltipText[i][0], CM.Disp.TooltipText[i][1], CM.Disp.TooltipText[i][2]);
	}
	CM.Disp.CreateTooltipWarn();
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

/********
 * Section: Functions related to checking for changes in Minigames/GC's/Ticker
 * TODO: Annotate functions 
 * TODO: Possibly move this section */

/**
 * Auxilirary function that finds all currently spawned shimmers. 
 * CM.Cache.spawnedGoldenShimmer stores the non-user spawned cookie to later determine data for the favicon and tab-title
 * It is called by CM.CM.Main.CheckGoldenCookie
 */
CM.Main.FindShimmer = function() {
	CM.Main.currSpawnedGoldenCookieState = 0;
	CM.Cache.goldenShimmersByID = {}
	for (var i in Game.shimmers) {
		CM.Cache.goldenShimmersByID[Game.shimmers[i].id] = Game.shimmers[i]
		if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'golden') {
			CM.Cache.spawnedGoldenShimmer = Game.shimmers[i];
			CM.Main.currSpawnedGoldenCookieState += 1;
		}
	}
}

/**
 * This function checks for changes in the amount of Golden Cookies
 * It is called by CM.Loop
 * TODO: Remove the delete function, as it does not delete correctly and crowds CM.Disp.GCTimers
 */
CM.Main.CheckGoldenCookie = function() {
	CM.Main.FindShimmer();
	for (var i in CM.Disp.GCTimers) {
		if (typeof CM.Cache.goldenShimmersByID[i] == "undefined") {
			CM.Disp.GCTimers[i].parentNode.removeChild(CM.Disp.GCTimers[i]);
			// TODO remove delete here
			delete CM.Disp.GCTimers[i];
		}
	}
	if (CM.Main.lastGoldenCookieState != Game.shimmerTypes['golden'].n) {
		CM.Main.lastGoldenCookieState = Game.shimmerTypes['golden'].n;
		if (CM.Main.lastGoldenCookieState) {
			if (CM.Main.lastSpawnedGoldenCookieState < CM.Main.currSpawnedGoldenCookieState) {
				CM.Disp.Flash(3, 'GCFlash');
				CM.Disp.PlaySound(CM.Config.GCSoundURL, 'GCSound', 'GCVolume');
				CM.Disp.Notification('GCNotification', "Golden Cookie Spawned", "A Golden Cookie has spawned. Click it now!")
			}
			CM.Disp.UpdateFavicon();
			
			for (var i in Game.shimmers) {
				if (typeof CM.Disp.GCTimers[Game.shimmers[i].id] == "undefined") {
					CM.Disp.CreateGCTimer(Game.shimmers[i]);
				}
			}
		}
		CM.Main.lastSpawnedGoldenCookieState = CM.Main.currSpawnedGoldenCookieState
	}
	else if (CM.Config.GCTimer == 1 && CM.Main.lastGoldenCookieState) {
		for (var i in CM.Disp.GCTimers) {
			CM.Disp.GCTimers[i].style.opacity = CM.Cache.goldenShimmersByID[i].l.style.opacity;
			CM.Disp.GCTimers[i].style.transform = CM.Cache.goldenShimmersByID[i].l.style.transform;
			CM.Disp.GCTimers[i].textContent = Math.ceil(CM.Cache.goldenShimmersByID[i].life / Game.fps);
		}
	}
}

/**
 * This function checks if there is reindeer that has spawned
 * It is called by CM.Loop
 */
CM.Main.CheckSeasonPopup = function() {
	if (CM.Main.lastSeasonPopupState != Game.shimmerTypes['reindeer'].spawned) {
		CM.Main.lastSeasonPopupState = Game.shimmerTypes['reindeer'].spawned;
		for (var i in Game.shimmers) {
			if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'reindeer') {
				CM.Cache.seasonPopShimmer = Game.shimmers[i];
				break;
			}
		}
		CM.Disp.Flash(3, 'SeaFlash');
		CM.Disp.PlaySound(CM.Config.SeaSoundURL, 'SeaSound', 'SeaVolume');
		CM.Disp.Notification('SeaNotification',"Reindeer sighted!", "A Reindeer has spawned. Click it now!")
	}
}

/**
 * This function checks if there is a fortune cookie on the ticker
 * It is called by CM.Loop
 */
CM.Main.CheckTickerFortune = function() {
	if (CM.Main.lastTickerFortuneState != (Game.TickerEffect && Game.TickerEffect.type == 'fortune')) {
		CM.Main.lastTickerFortuneState = (Game.TickerEffect && Game.TickerEffect.type == 'fortune');
		if (CM.Main.lastTickerFortuneState) {
			CM.Disp.Flash(3, 'FortuneFlash');
			CM.Disp.PlaySound(CM.Config.FortuneSoundURL, 'FortuneSound', 'FortuneVolume');
			CM.Disp.Notification('FortuneNotification', "Fortune Cookie found", "A Fortune Cookie has appeared on the Ticker.")
		}
	}
}

/**
 * This function checks if a garden tick has happened
 * It is called by CM.Loop
 */
CM.Main.CheckGardenTick = function() {
	if (Game.Objects['Farm'].minigameLoaded && CM.Main.lastGardenNextStep != Game.Objects['Farm'].minigame.nextStep) {
		if (CM.Main.lastGardenNextStep != 0 && CM.Main.lastGardenNextStep < Date.now()) {
			CM.Disp.Flash(3, 'GardFlash');
			CM.Disp.PlaySound(CM.Config.GardSoundURL, 'GardSound', 'GardVolume');
		}
		CM.Main.lastGardenNextStep = Game.Objects['Farm'].minigame.nextStep;
	}
}

/**
 * This function checks if the magic meter is full
 * It is called by CM.Loop
 */
CM.Main.CheckMagicMeter = function() {
	if (Game.Objects['Wizard tower'].minigameLoaded && CM.Config.GrimoireBar == 1) {
		var minigame = Game.Objects['Wizard tower'].minigame;
		if (minigame.magic < minigame.magicM) CM.Main.lastMagicBarFull = false;
		else if (!CM.Main.lastMagicBarFull) {
			CM.Main.lastMagicBarFull = true;
			CM.Disp.Flash(3, 'MagicFlash');
			CM.Disp.PlaySound(CM.Config.MagicSoundURL, 'MagicSound', 'MagicVolume');
			CM.Disp.Notification('MagicNotification', "Magic Meter full", "Your Magic Meter is full. Cast a spell!")
		}
	}
}

/**
 * This function checks if any new Wrinklers have popped up
 * It is called by CM.Loop
 */
CM.Main.CheckWrinklerCount = function() {
	if (Game.elderWrath > 0) {
		var CurrentWrinklers = 0;
		for (var i in Game.wrinklers) {
			if (Game.wrinklers[i].phase == 2) CurrentWrinklers++;
		}
		if (CurrentWrinklers > CM.Main.lastWrinklerCount) {
			CM.Main.lastWrinklerCount = CurrentWrinklers
			if (CurrentWrinklers == Game.getWrinklersMax() && CM.Config.WrinklerMaxFlash) {
				CM.Disp.Flash(3, 'WrinklerMaxFlash');
			} else {
				CM.Disp.Flash(3, 'WrinklerFlash');
			}
			if (CurrentWrinklers == Game.getWrinklersMax() && CM.Config.WrinklerMaxSound) {
				CM.Disp.PlaySound(CM.Config.WrinklerMaxSoundURL, 'WrinklerMaxSound', 'WrinklerMaxVolume');
			} else {
				CM.Disp.PlaySound(CM.Config.WrinklerSoundURL, 'WrinklerSound', 'WrinklerVolume');
			}
			if (CurrentWrinklers == Game.getWrinklersMax() &&  CM.Config.WrinklerMaxNotification) {
				CM.Disp.Notification('WrinklerMaxNotification', "Maximum Wrinklers Reached", "You have reached your maximum ammount of wrinklers")
			} else {
				CM.Disp.Notification('WrinklerNotification', "A Wrinkler appeared", "A new wrinkler has appeared")
			}
		} else {
			CM.Main.lastWrinklerCount = CurrentWrinklers
		}
	}
}

CM.HasReplaceNativeGrimoireLaunch = false;
CM.HasReplaceNativeGrimoireDraw = false;

CM.Main.lastGoldenCookieState = 0;
CM.Main.lastSpawnedGoldenCookieState = 0;
CM.Main.currSpawnedGoldenCookieState
CM.Main.lastTickerFortuneState = 0;
CM.Main.lastSeasonPopupState = 0;
CM.Main.lastGardenNextStep = 0;
CM.Main.lastMagicBarFull = 0;
CM.Main.lastWrinklerCount = 0;

CM.ConfigDefault = {
	BotBar: 1, 
	TimerBar: 1, 
	TimerBarPos: 0, 
	BuildColor: 1, 
	BulkBuildColor: 0, 
	ColorPPBulkMode: 0,
	UpBarColor: 1, 
	UpgradeBarFixedPos: 1,
	CalcWrink: 0, 
	CPSMode: 1, 
	AvgCPSHist: 3, 
	AvgClicksHist: 0, 
	ToolWarnBon: 0, 
	GCNotification: 0,
	GCFlash: 1, 
	GCSound: 1,  
	GCVolume: 100, 
	GCSoundURL: 'https://freesound.org/data/previews/66/66717_931655-lq.mp3', 
	GCTimer: 1, 
	Favicon: 1, 
	FortuneNotification: 0,
	FortuneFlash: 1, 
	FortuneSound: 1,  
	FortuneVolume: 100, 
	FortuneSoundURL: 'https://freesound.org/data/previews/174/174027_3242494-lq.mp3',
	SeaNotification: 0,
	SeaFlash: 1, 
	SeaSound: 1,  
	SeaVolume: 100, 
	SeaSoundURL: 'https://www.freesound.org/data/previews/121/121099_2193266-lq.mp3', 
	GardFlash: 1, 
	GardSound: 1,  
	GardVolume: 100, 
	GardSoundURL: 'https://freesound.org/data/previews/103/103046_861714-lq.mp3', 
	MagicNotification: 0,
	MagicFlash: 1, 
	MagicSound: 1,  
	MagicVolume: 100, 
	MagicSoundURL: 'https://freesound.org/data/previews/221/221683_1015240-lq.mp3',
	WrinklerNotification: 0,
	WrinklerFlash: 1, 
	WrinklerSound: 1,  
	WrinklerVolume: 100, 
	WrinklerSoundURL: 'https://freesound.org/data/previews/124/124186_8043-lq.mp3', 
	WrinklerMaxNotification: 0,
	WrinklerMaxFlash: 1, 
	WrinklerMaxSound: 1,  
	WrinklerMaxVolume: 100, 
	WrinklerMaxSoundURL: 'https://freesound.org/data/previews/152/152743_15663-lq.mp3', 
	Title: 1, 
	TooltipBuildUp: 1, 
	TooltipAmor: 0, 
	ToolWarnLucky: 1,
	ToolWarnConjure: 1, 
	ToolWarnPos: 1, 
	TooltipGrim:1, 
	ToolWrink: 1, 
	TooltipLump: 1,
	Stats: 1, 
	MissingUpgrades: 0,
	UpStats: 1, 
	TimeFormat: 0, 
	SayTime: 1, 
	GrimoireBar: 1, 
	Scale: 2, 
	OptionsPref: {BarsColors: 1, Calculation: 1, Notification: 1, Tooltip: 1, Statistics: 1, Other: 1}, 
	StatsPref: {Lucky: 1, Conjure: 1, Chain: 1, Prestige: 1, Wrink: 1, Sea: 1, Misc: 1}, 
	Colors : {Blue: '#4bb8f0', Green: '#00ff00', Yellow: '#ffff00', Orange: '#ff7f00', Red: '#ff0000', Purple: '#ff00ff', Gray: '#b3b3b3', Pink: '#ff1493', Brown: '#8b4513'},
	SortBuildings: 0,
	SortUpgrades: 0
};
CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '2.031';
CM.VersionMinor = '2';

