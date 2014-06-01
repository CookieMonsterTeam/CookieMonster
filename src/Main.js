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
		CM.Sim.Date = new Date().getTime();
	}
	
	CM.Backup.seasonPopup = {};
	CM.Backup.seasonPopup.spawn = Game.seasonPopup.spawn;
	eval('CM.Backup.seasonPopup.spawnMod = ' + Game.seasonPopup.spawn.toString().split('this').join('Game.seasonPopup'));
	Game.seasonPopup.spawn = function() {
		CM.Backup.seasonPopup.spawnMod();
		CM.Disp.EmphSeasonPopup();
	}
	
	CM.Backup.tooltip = {};
	CM.Backup.tooltip.draw = Game.tooltip.draw;
	eval('CM.Backup.tooltip.drawMod = ' + Game.tooltip.draw.toString().split('this').join('Game.tooltip'));
	Game.tooltip.draw = function(from, text, origin) {
		CM.Backup.tooltip.drawMod(from, text, origin);
		CM.Disp.DrawTooltipWarnCaut();
	}
	
	CM.Backup.tooltip.update = Game.tooltip.update;
	eval('CM.Backup.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this').join('Game.tooltip'));
	Game.tooltip.update = function() {
		CM.Backup.tooltip.updateMod();
		CM.Disp.UpdateTooltipWarnCaut();
	}
	
	CM.Backup.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function() {
		CM.Backup.RebuildUpgrades();
		CM.Disp.AddTooltipUpgrade();
	}
	
	CM.Backup.UpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		CM.Backup.UpdateMenu();
		CM.Disp.AddMenu();
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
}

CM.Loop = function() {
	if (CM.Sim.DoSims) {		
		CM.Cache.RemakeIncome();
		CM.Cache.RemakeBCI();
		CM.Cache.RemakeLucky();
		CM.Cache.RemakeSeaSpec();
		
		CM.Disp.UpdateBotBarOther();
		CM.Disp.UpdateBuildings();
		CM.Disp.UpdateUpgrades();
		
		CM.Sim.DoSims = 0;
	}
	
	// Redraw timers
	CM.Disp.UpdateBotBarTime();
	CM.Disp.UpdateTimerBar();
	
	// Update Tooltip
	CM.Disp.UpdateTooltip();

	// Check Golden Cookies
	CM.Disp.CheckGoldenCookie();
	
	// Update Title
	CM.Disp.UpdateTitle();
	
	// Change menu refresh interval
	CM.Disp.RefreshMenu();
}

CM.Init = function() {
	var proceed = true;
	if (Game.version != CM.VersionMajor) {
		proceed = confirm('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' is meant for Game version ' + CM.VersionMajor + '.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?');
	}
	if (proceed) {
		CM.Disp.CreateBotBar();
		CM.Disp.CreateTimerBar();
		CM.Disp.CreateUpgradeBar();
		CM.Disp.CreateWhiteScreen();
		CM.Disp.CreateGCTimer();
		CM.Disp.CreateTooltipWarnCaut();
		CM.Disp.AddTooltipBuild();
		CM.ReplaceNative();
		Game.CalculateGains();
		CM.LoadConfig(); // Must be after all things are created!

		if (Game.prefs.popups) Game.Popup('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!');
		else Game.Notify('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!','','',1);
		
		Game.Win('Third-party');
	}
}

CM.ConfigDefault = {BotBar: 1, TimerBar: 1, BuildColor: 1, UpBarColor: 1, Flash: 1, Sound: 1,  Volume: 100, GCTimer: 1, Title: 1, Tooltip: 1, ToolWarnCaut: 1, ToolWarnCautPos: 0, Stats: 1, UpStats: 1, SayTime: 1, Scale: 2};
CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '1.0465';
CM.VersionMinor = '5';

