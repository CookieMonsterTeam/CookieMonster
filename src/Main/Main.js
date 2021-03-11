/**
 * Main *
 */

/**
 * Section: Functions related to the main and initialization loop */

/**
 * Main loop of Cookie Monster
 * CM.init registers it to the "logic" hook provided by the modding api
 */
CM.Main.Loop = function () {
	if (CM.Disp.lastAscendState !== Game.OnAscend) {
		CM.Disp.lastAscendState = Game.OnAscend;
		CM.Disp.UpdateAscendState();
	}
	if (!Game.OnAscend && Game.AscendTimer === 0) {
		// Check if any other mods have been loaded
		if (CM.Main.LastModCount !== Object.keys(Game.mods).length) {
			CM.Sim.CreateSimFunctions();
			CM.Sim.InitData();
			CM.Cache.InitCache();
			CM.Main.LastModCount = Object.keys(Game.mods).length;
		}

		// CM.Sim.DoSims is set whenever CPS has changed
		if (CM.Sim.DoSims) {
			CM.Cache.CacheIncome();

			CM.Cache.NoGoldSwitchCPS(); // Needed first
			CM.Cache.CacheGoldenAndWrathCookiesMults();
			CM.Cache.CacheStats();
			CM.Cache.CacheMissingUpgrades();
			CM.Cache.CacheChain();
			CM.Cache.CacheDragonCost();

			CM.Cache.CacheSeaSpec();
			CM.Cache.CacheSellForChoEgg();

			CM.Sim.DoSims = 0;
		}

		// Check for aura change to recalculate buildings prices
		const hasBuildAura = Game.auraMult('Fierce Hoarder') > 0;
		if (!CM.Cache.HadBuildAura && hasBuildAura) {
			CM.Cache.HadBuildAura = true;
			CM.Cache.DoRemakeBuildPrices = 1;
		} else if (CM.Cache.HadBuildAura && !hasBuildAura) {
			CM.Cache.HadBuildAura = false;
			CM.Cache.DoRemakeBuildPrices = 1;
		}

		if (CM.Cache.DoRemakeBuildPrices) {
			CM.Cache.CacheBuildingsPrices();
			CM.Cache.DoRemakeBuildPrices = 0;
		}

		CM.Cache.LoopCache();

		// Check all changing minigames and game-states
		CM.Main.CheckGoldenCookie();
		CM.Main.CheckTickerFortune();
		CM.Main.CheckSeasonPopup();
		CM.Main.CheckGardenTick();
		CM.Main.CheckMagicMeter();
		CM.Main.CheckWrinklerCount();
	}
};


/**
 * Section: Functions related to replacing stuff */

/**
 * This function replaces certain native (from the base-game) functions
 * It is called by CM.Main.DelayInit()
 */
CM.Main.ReplaceNative = function () {
	CM.Backup.Beautify = Beautify;
	Beautify = CM.Disp.Beautify;

	CM.Backup.CalculateGains = Game.CalculateGains;
	eval(`CM.Backup.CalculateGainsMod = ${Game.CalculateGains.toString().split('ages\');').join('ages\');CM.Sim.DateAges = Date.now();').split('if (Game.Has(\'Century')
		.join('CM.Sim.DateCentury = Date.now();if (Game.Has(\'Century')}`);
	Game.CalculateGains = function () {
		CM.Backup.CalculateGainsMod();
		CM.Sim.DoSims = 1;
	};

	CM.Backup.tooltip = {};
	CM.Backup.tooltip.draw = Game.tooltip.draw;
	eval(`CM.Backup.tooltip.drawMod = ${Game.tooltip.draw.toString().split('this').join('Game.tooltip')}`);
	Game.tooltip.draw = function (from, text, origin) {
		CM.Backup.tooltip.drawMod(from, text, origin);
	};

	CM.Backup.tooltip.update = Game.tooltip.update;
	eval(`CM.Backup.tooltip.updateMod = ${Game.tooltip.update.toString().split('this.').join('Game.tooltip.')}`);
	Game.tooltip.update = function () {
		CM.Backup.tooltip.updateMod();
		CM.Disp.UpdateTooltipLocation();
	};

	CM.Backup.UpdateWrinklers = Game.UpdateWrinklers;
	Game.UpdateWrinklers = function () {
		CM.Main.FixMouseY(CM.Backup.UpdateWrinklers);
	};

	CM.Backup.UpdateSpecial = Game.UpdateSpecial;
	Game.UpdateSpecial = function () {
		CM.Main.FixMouseY(CM.Backup.UpdateSpecial);
	};

	// Assumes newer browsers
	l('bigCookie').removeEventListener('click', Game.ClickCookie, false);
	l('bigCookie').addEventListener('click', function () { CM.Main.FixMouseY(Game.ClickCookie); }, false);

	CM.Backup.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function () {
		CM.Backup.RebuildUpgrades();
		CM.Disp.ReplaceTooltipUpgrade();
		Game.CalculateGains();
	};

	CM.Backup.ClickProduct = Game.ClickProduct;
	/**
	 * This function adds a check to the purchase of a building to allow BulkBuyBlock to work.
	 * If the options is 1 (on) bulkPrice is under cookies you can't buy the building.
	 */
	Game.ClickProduct = function (what) {
		if (!CM.Options.BulkBuyBlock || (Game.ObjectsById[what].bulkPrice < Game.cookies || Game.buyMode === -1)) {
			CM.Backup.ClickProduct(what);
		}
	};

	CM.Backup.DescribeDragonAura = Game.DescribeDragonAura;
	/**
	 * This function adds the function CM.Disp.AddAuraInfo() to Game.DescribeDragonAura()
	 * This adds information about CPS differences and costs to the aura choosing interface
	 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
	 */
	Game.DescribeDragonAura = function (aura) {
		CM.Backup.DescribeDragonAura(aura);
		CM.Disp.AddAuraInfo(aura);
	};

	CM.Backup.ToggleSpecialMenu = Game.ToggleSpecialMenu;
	/**
	 * This function adds the code to display the tooltips for the levelUp button of the dragon
	 */
	Game.ToggleSpecialMenu = function (on) {
		CM.Backup.ToggleSpecialMenu(on);
		CM.Disp.AddDragonLevelUpTooltip();
	};

	CM.Backup.UpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function () {
		if (typeof jscolor.picker === 'undefined' || typeof jscolor.picker.owner === 'undefined') {
			CM.Backup.UpdateMenu();
			CM.Disp.AddMenu();
		}
	};

	CM.Backup.sayTime = Game.sayTime;
	CM.Disp.sayTime = function (time, detail) {
		if (Number.isNaN(time) || time <= 0) return CM.Backup.sayTime(time, detail);
		else return CM.Disp.FormatTime(time / Game.fps, 1);
	};

	// Since the Ascend Tooltip is not actually a tooltip we need to add our additional info here...
	CM.Backup.Logic = Game.Logic;
	CM.Backup.LogicMod = new Function(
		`return ${Game.Logic.toString()
			.split('document.title')
			.join('CM.Disp.Title')
			.split("' more cookies</b> for the next level.<br>';")
			.join("` more cookies</b> for the next level.<br>${CM.Options.TooltipAscendButton ? `<div class='line'></div>It takes ${CM.Cache.TimeTillNextPrestige} to reach the next level and you are making ${Beautify(CM.Cache.HCPerSecond, 2)} chips on average in the last 5 seconds.<br>` : ``}`;")}`,
	)();
	Game.Logic = function () {
		CM.Backup.LogicMod();
		// Update Title
		CM.Disp.UpdateTitle();
	};
};

/**
 * Section: Functions related to checking for changes in Minigames/GC's/Ticker */

/**
 * Auxilirary function that finds all currently spawned shimmers.
 * CM.Cache.spawnedGoldenShimmer stores the non-user spawned cookie to later determine data for the favicon and tab-title
 * It is called by CM.CM.Main.CheckGoldenCookie
 */
CM.Main.FindShimmer = function () {
	CM.Main.currSpawnedGoldenCookieState = 0;
	CM.Cache.goldenShimmersByID = {};
	for (const i of Object.keys(Game.shimmers)) {
		CM.Cache.goldenShimmersByID[Game.shimmers[i].id] = Game.shimmers[i];
		if (Game.shimmers[i].spawnLead && Game.shimmers[i].type === 'golden') {
			CM.Cache.spawnedGoldenShimmer = Game.shimmers[i];
			CM.Main.currSpawnedGoldenCookieState += 1;
		}
	}
};

/**
 * This function checks for changes in the amount of Golden Cookies
 * It is called by CM.Main.Loop
 */
CM.Main.CheckGoldenCookie = function () {
	CM.Main.FindShimmer();
	for (const i of Object.keys(CM.Disp.GCTimers)) {
		if (typeof CM.Cache.goldenShimmersByID[i] === 'undefined') {
			CM.Disp.GCTimers[i].parentNode.removeChild(CM.Disp.GCTimers[i]);
			delete CM.Disp.GCTimers[i];
		}
	}
	if (CM.Main.lastGoldenCookieState !== Game.shimmerTypes.golden.n) {
		CM.Main.lastGoldenCookieState = Game.shimmerTypes.golden.n;
		if (CM.Main.lastGoldenCookieState) {
			if (CM.Main.lastSpawnedGoldenCookieState < CM.Main.currSpawnedGoldenCookieState) {
				CM.Disp.Flash(3, 'GCFlash');
				CM.Disp.PlaySound(CM.Options.GCSoundURL, 'GCSound', 'GCVolume');
				CM.Disp.Notification('GCNotification', 'Golden Cookie Spawned', 'A Golden Cookie has spawned. Click it now!');
			}

			for (const i of Object.keys(Game.shimmers)) {
				if (typeof CM.Disp.GCTimers[Game.shimmers[i].id] === 'undefined') {
					CM.Disp.CreateGCTimer(Game.shimmers[i]);
				}
			}
		}
		CM.Disp.UpdateFavicon();
		CM.Main.lastSpawnedGoldenCookieState = CM.Main.currSpawnedGoldenCookieState;
		if (CM.Main.currSpawnedGoldenCookieState === 0) CM.Cache.spawnedGoldenShimmer = 0;
	} else if (CM.Options.GCTimer === 1 && CM.Main.lastGoldenCookieState) {
		for (const i of Object.keys(CM.Disp.GCTimers)) {
			CM.Disp.GCTimers[i].style.opacity = CM.Cache.goldenShimmersByID[i].l.style.opacity;
			CM.Disp.GCTimers[i].style.transform = CM.Cache.goldenShimmersByID[i].l.style.transform;
			CM.Disp.GCTimers[i].textContent = Math.ceil(CM.Cache.goldenShimmersByID[i].life / Game.fps);
		}
	}
};

/**
 * This function checks if there is reindeer that has spawned
 * It is called by CM.Main.Loop
 */
CM.Main.CheckSeasonPopup = function () {
	if (CM.Main.lastSeasonPopupState !== Game.shimmerTypes.reindeer.spawned) {
		CM.Main.lastSeasonPopupState = Game.shimmerTypes.reindeer.spawned;
		for (const i of Object.keys(Game.shimmers)) {
			if (Game.shimmers[i].spawnLead && Game.shimmers[i].type === 'reindeer') {
				CM.Cache.seasonPopShimmer = Game.shimmers[i];
				break;
			}
		}
		CM.Disp.Flash(3, 'SeaFlash');
		CM.Disp.PlaySound(CM.Options.SeaSoundURL, 'SeaSound', 'SeaVolume');
		CM.Disp.Notification('SeaNotification', 'Reindeer sighted!', 'A Reindeer has spawned. Click it now!');
	}
};

/**
 * This function checks if there is a fortune cookie on the ticker
 * It is called by CM.Main.Loop
 */
CM.Main.CheckTickerFortune = function () {
	if (CM.Main.lastTickerFortuneState !== (Game.TickerEffect && Game.TickerEffect.type === 'fortune')) {
		CM.Main.lastTickerFortuneState = (Game.TickerEffect && Game.TickerEffect.type === 'fortune');
		if (CM.Main.lastTickerFortuneState) {
			CM.Disp.Flash(3, 'FortuneFlash');
			CM.Disp.PlaySound(CM.Options.FortuneSoundURL, 'FortuneSound', 'FortuneVolume');
			CM.Disp.Notification('FortuneNotification', 'Fortune Cookie found', 'A Fortune Cookie has appeared on the Ticker.');
		}
	}
};

/**
 * This function checks if a garden tick has happened
 * It is called by CM.Main.Loop
 */
CM.Main.CheckGardenTick = function () {
	if (Game.Objects.Farm.minigameLoaded && CM.Main.lastGardenNextStep !== Game.Objects.Farm.minigame.nextStep) {
		if (CM.Main.lastGardenNextStep !== 0 && CM.Main.lastGardenNextStep < Date.now()) {
			CM.Disp.Flash(3, 'GardFlash');
			CM.Disp.PlaySound(CM.Options.GardSoundURL, 'GardSound', 'GardVolume');
		}
		CM.Main.lastGardenNextStep = Game.Objects.Farm.minigame.nextStep;
	}
};

/**
 * This function checks if the magic meter is full
 * It is called by CM.Main.Loop
 */
CM.Main.CheckMagicMeter = function () {
	if (Game.Objects['Wizard tower'].minigameLoaded && CM.Options.GrimoireBar === 1) {
		const minigame = Game.Objects['Wizard tower'].minigame;
		if (minigame.magic < minigame.magicM) CM.Main.lastMagicBarFull = false;
		else if (!CM.Main.lastMagicBarFull) {
			CM.Main.lastMagicBarFull = true;
			CM.Disp.Flash(3, 'MagicFlash');
			CM.Disp.PlaySound(CM.Options.MagicSoundURL, 'MagicSound', 'MagicVolume');
			CM.Disp.Notification('MagicNotification', 'Magic Meter full', 'Your Magic Meter is full. Cast a spell!');
		}
	}
};

/**
 * This function checks if any new Wrinklers have popped up
 * It is called by CM.Main.Loop
 */
CM.Main.CheckWrinklerCount = function () {
	if (Game.elderWrath > 0) {
		let CurrentWrinklers = 0;
		for (const i in Game.wrinklers) {
			if (Game.wrinklers[i].phase === 2) CurrentWrinklers++;
		}
		if (CurrentWrinklers > CM.Main.lastWrinklerCount) {
			CM.Main.lastWrinklerCount = CurrentWrinklers;
			if (CurrentWrinklers === Game.getWrinklersMax() && CM.Options.WrinklerMaxFlash) {
				CM.Disp.Flash(3, 'WrinklerMaxFlash');
			} else {
				CM.Disp.Flash(3, 'WrinklerFlash');
			}
			if (CurrentWrinklers === Game.getWrinklersMax() && CM.Options.WrinklerMaxSound) {
				CM.Disp.PlaySound(CM.Options.WrinklerMaxSoundURL, 'WrinklerMaxSound', 'WrinklerMaxVolume');
			} else {
				CM.Disp.PlaySound(CM.Options.WrinklerSoundURL, 'WrinklerSound', 'WrinklerVolume');
			}
			if (CurrentWrinklers === Game.getWrinklersMax() && CM.Options.WrinklerMaxNotification) {
				CM.Disp.Notification('WrinklerMaxNotification', 'Maximum Wrinklers Reached', 'You have reached your maximum ammount of wrinklers');
			} else {
				CM.Disp.Notification('WrinklerNotification', 'A Wrinkler appeared', 'A new wrinkler has appeared');
			}
		} else {
			CM.Main.lastWrinklerCount = CurrentWrinklers;
		}
	}
};

/**
 * This function creates .onmouseover/out events that determine if the mouse is hovering-over a Wrinkler
 * It is called by CM.Main.DelayInit
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
CM.Main.AddWrinklerAreaDetect = function () {
	l('backgroundLeftCanvas').onmouseover = function () { CM.Disp.TooltipWrinklerArea = 1; };
	l('backgroundLeftCanvas').onmouseout = function () {
		CM.Disp.TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (const i of Object.keys(Game.wrinklers)) {
			CM.Disp.TooltipWrinklerBeingShown[i] = 0;
		}
	};
};

/**
 * Section: Functions related to the mouse */

/**
 * This function fixes Game.mouseY as a result of bars that are added by CookieMonster
 * It is called by Game.UpdateWrinklers(), Game.UpdateSpecial() and the .onmousover of the BigCookie
 * before execution of their actual function
 */
CM.Main.FixMouseY = function (target) {
	if (CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 0) {
		const timerBarHeight = parseInt(CM.Disp.TimerBar.style.height);
		Game.mouseY -= timerBarHeight;
		target();
		Game.mouseY += timerBarHeight;
	} else {
		target();
	}
};
