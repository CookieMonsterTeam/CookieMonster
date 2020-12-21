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
	}

	CM.Backup.tooltip.update = Game.tooltip.update;
	eval('CM.Backup.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this.').join('Game.tooltip.'));
	Game.tooltip.update = function() {
		CM.Backup.tooltip.updateMod();
		CM.Disp.UpdateTooltipLocation();
	}

	CM.Backup.UpdateWrinklers = Game.UpdateWrinklers;
	Game.UpdateWrinklers = function() {
		CM.Main.FixMouseY(CM.Backup.UpdateWrinklers);
	}

	CM.Backup.UpdateSpecial = Game.UpdateSpecial;
	Game.UpdateSpecial = function() {
		CM.Main.FixMouseY(CM.Backup.UpdateSpecial);
	}

	// Assumes newer browsers
	l('bigCookie').removeEventListener('click', Game.ClickCookie, false);
	l('bigCookie').addEventListener('click', function() { CM.Main.FixMouseY(Game.ClickCookie); }, false);

	// Probably better to load per minigame
	CM.Backup.scriptLoaded = Game.scriptLoaded;
	Game.scriptLoaded = function(who, script) {
		CM.Backup.scriptLoaded(who, script);
		CM.Disp.AddTooltipGrimoire()
		CM.ReplaceNativeGrimoire();
	}

	// TODO: Move this ReplaceTooltip function too other ReplaceTooltip functions
	// OR: Move all other into this function
	CM.Backup.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function() {
		CM.Backup.RebuildUpgrades();
		CM.Disp.ReplaceTooltipUpgrade();
		Game.CalculateGains();
	}

	
	CM.Backup.DescribeDragonAura = Game.DescribeDragonAura;
	/**
	 * This functions adds the function CM.Disp.AddAuraInfo() to Game.DescribeDragonAura()
	 * This adds information about CPS differences and costs to the aura choosing interface
	 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
	 */
	Game.DescribeDragonAura = function(aura) {
		CM.Backup.DescribeDragonAura(aura);
		CM.Disp.AddAuraInfo(aura);
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
			if (CM.Options.GrimoireBar == 1 && minigame.magic < minigame.magicM) {
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
		// CM.Sim.DoSims is set whenever CPS has changed
		if (CM.Sim.DoSims) {
			CM.Cache.RemakeIncome();

			CM.Sim.NoGoldSwitchCookiesPS(); // Needed first
			CM.Cache.RemakeGoldenAndWrathCookiesMults();
			CM.Cache.CacheStats();
			CM.Cache.CacheMissingUpgrades();
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
		CM.Cache.CacheWrinklers();

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

CM.DelayInit = function() {
	CM.Sim.InitData();
	CM.Cache.InitCache();
	CM.Disp.CreateCssArea();
	CM.Disp.CreateBotBar();
	CM.Disp.CreateTimerBar();
	CM.Disp.CreateUpgradeBar();
	CM.Disp.CreateWhiteScreen();
	CM.Disp.CreateFavicon();
	for (var i in CM.Disp.TooltipText) {
		CM.Disp.CreateSimpleTooltip(CM.Disp.TooltipText[i][0], CM.Disp.TooltipText[i][1], CM.Disp.TooltipText[i][2]);
	}
	CM.Disp.ReplaceTooltipBuild();
	CM.Disp.ReplaceTooltipGrimoire();
	CM.Disp.ReplaceTooltipLump();
	CM.Main.AddWrinklerAreaDetect();
	CM.Cache.InitCookiesDiff();
	CM.ReplaceNative();
	CM.ReplaceNativeGrimoire();
	Game.CalculateGains();
	CM.Config.LoadConfig(); // Must be after all things are created!
	CM.Disp.lastAscendState = Game.OnAscend;
	CM.Disp.lastBuyMode = Game.buyMode;
	CM.Disp.lastBuyBulk = Game.buyBulk;

	if (Game.prefs.popups) Game.Popup('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!');
	else Game.Notify('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!', '', '', 1, 1);

	// given the architecture of your code, you probably want these lines somewhere else,
	// but I stuck them here for convenience
	l("products").style.display = "grid";
	l("storeBulk").style.gridRow = "1/1";

	l("upgrades").style.display = "flex";
	l("upgrades").style["flex-wrap"] = "wrap";

	Game.Win('Third-party');
}

/********
 * Section: Functions related to checking for changes in Minigames/GC's/Ticker
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
				CM.Disp.PlaySound(CM.Options.GCSoundURL, 'GCSound', 'GCVolume');
				CM.Disp.Notification('GCNotification', "Golden Cookie Spawned", "A Golden Cookie has spawned. Click it now!")
			}
			
			for (var i in Game.shimmers) {
				if (typeof CM.Disp.GCTimers[Game.shimmers[i].id] == "undefined") {
					CM.Disp.CreateGCTimer(Game.shimmers[i]);
				}
			}
		}
		CM.Disp.UpdateFavicon();
		CM.Main.lastSpawnedGoldenCookieState = CM.Main.currSpawnedGoldenCookieState;
		if (CM.Main.currSpawnedGoldenCookieState == 0) CM.Cache.spawnedGoldenShimmer = 0;
	}
	else if (CM.Options.GCTimer == 1 && CM.Main.lastGoldenCookieState) {
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
		CM.Disp.PlaySound(CM.Options.SeaSoundURL, 'SeaSound', 'SeaVolume');
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
			CM.Disp.PlaySound(CM.Options.FortuneSoundURL, 'FortuneSound', 'FortuneVolume');
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
			CM.Disp.PlaySound(CM.Options.GardSoundURL, 'GardSound', 'GardVolume');
		}
		CM.Main.lastGardenNextStep = Game.Objects['Farm'].minigame.nextStep;
	}
}

/**
 * This function checks if the magic meter is full
 * It is called by CM.Loop
 */
CM.Main.CheckMagicMeter = function() {
	if (Game.Objects['Wizard tower'].minigameLoaded && CM.Options.GrimoireBar == 1) {
		var minigame = Game.Objects['Wizard tower'].minigame;
		if (minigame.magic < minigame.magicM) CM.Main.lastMagicBarFull = false;
		else if (!CM.Main.lastMagicBarFull) {
			CM.Main.lastMagicBarFull = true;
			CM.Disp.Flash(3, 'MagicFlash');
			CM.Disp.PlaySound(CM.Options.MagicSoundURL, 'MagicSound', 'MagicVolume');
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
			if (CurrentWrinklers == Game.getWrinklersMax() && CM.Options.WrinklerMaxFlash) {
				CM.Disp.Flash(3, 'WrinklerMaxFlash');
			} else {
				CM.Disp.Flash(3, 'WrinklerFlash');
			}
			if (CurrentWrinklers == Game.getWrinklersMax() && CM.Options.WrinklerMaxSound) {
				CM.Disp.PlaySound(CM.Options.WrinklerMaxSoundURL, 'WrinklerMaxSound', 'WrinklerMaxVolume');
			} else {
				CM.Disp.PlaySound(CM.Options.WrinklerSoundURL, 'WrinklerSound', 'WrinklerVolume');
			}
			if (CurrentWrinklers == Game.getWrinklersMax() &&  CM.Options.WrinklerMaxNotification) {
				CM.Disp.Notification('WrinklerMaxNotification', "Maximum Wrinklers Reached", "You have reached your maximum ammount of wrinklers")
			} else {
				CM.Disp.Notification('WrinklerNotification', "A Wrinkler appeared", "A new wrinkler has appeared")
			}
		} else {
			CM.Main.lastWrinklerCount = CurrentWrinklers
		}
	}
}

/**
 * This function creates .onmouseover/out events that determine if the mouse is hovering-over a Wrinkler
 * It is called by CM.DelayInit
 * TODO: The system for displaying wrinklers should ideally use a similar system as other tooltips
 * Thus, writing a CM.Disp.ReplaceTooltipWrinkler function etc.
 */
CM.Main.AddWrinklerAreaDetect = function() {
	l('backgroundLeftCanvas').onmouseover = function() {CM.Disp.TooltipWrinklerArea = 1;};
	l('backgroundLeftCanvas').onmouseout = function() {
		CM.Disp.TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (var i in Game.wrinklers) {
			CM.Disp.TooltipWrinklerBeingShown[i] = 0;
		}
	};
}

/********
 * Section: Functions related to the mouse */

/**
 * This function fixes Game.mouseY as a result of bars that are added by CookieMonster
 * It is called by Game.UpdateWrinklers(), Game.UpdateSpecial() and the .onmousover of the BigCookie
 * before execution of their actual function
 */
CM.Main.FixMouseY = function(target) {
	if (CM.Options.TimerBar == 1 && CM.Options.TimerBarPos == 0) {
		var timerBarHeight = parseInt(CM.Disp.TimerBar.style.height);
		Game.mouseY -= timerBarHeight;
		target();
		Game.mouseY += timerBarHeight;
	}
	else {
		target();
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

CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '2.031';
CM.VersionMinor = '2';

