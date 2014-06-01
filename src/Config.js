/**********
 * Config *
 **********/

CM.SaveConfig = function(config) {
	localStorage.setItem(CM.ConfigPrefix, JSON.stringify(config));
}

CM.LoadConfig = function() {
	if (localStorage.getItem(CM.ConfigPrefix) != null) {
		CM.Config = JSON.parse(localStorage.getItem(CM.ConfigPrefix));
		
		// Check values
		var mod = false;
		for (var i in CM.ConfigDefault) {
			if (CM.Config[i] == undefined || !(CM.Config[i] > -1 && CM.Config[i] < CM.ConfigData[i].label.length)) {
				mod = true;
				CM.Config[i] = CM.ConfigDefault[i];
			}
		}
		if (mod) CM.SaveConfig(CM.Config);
		CM.Loop(); // Do loop once
		for (var i in CM.ConfigDefault) {
			if (CM.ConfigData[i].func != undefined) {
				CM.ConfigData[i].func();
			}
		}
	}
	else { // Default values		
		CM.RestoreDefault();	
	}
}

CM.RestoreDefault = function() {
	CM.Config = {};
	CM.SaveConfig(CM.ConfigDefault);
	CM.LoadConfig();
	Game.UpdateMenu();
}

CM.ToggleConfigUp = function(config) {
	CM.Config[config]++;
	if (CM.Config[config] == CM.ConfigData[config].label.length) {
		CM.Config[config] = 0;
	}
	if (CM.ConfigData[config].func != undefined) {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
	CM.SaveConfig(CM.Config);
}

CM.ToggleConfigDown = function(config) {
	CM.Config[config]--;
	if (CM.Config[config] < 0) {
		CM.Config[config] = CM.ConfigData[config].label.length - 1;
	}
	if (CM.ConfigData[config].func != undefined) {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
	CM.SaveConfig(CM.Config);
}

CM.ConfigData.BotBar = {label: ['Bottom Bar OFF', 'Bottom Bar ON'], desc: 'Building Information', func: function() {CM.Disp.ToggleBotBar();}};
CM.ConfigData.TimerBar = {label: ['Timer Bar OFF', 'Timer Bar ON'], desc: 'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy', func: function() {CM.Disp.ToggleTimerBar();}};
CM.ConfigData.BuildColor = {label: ['Building Colors OFF', 'Building Colors ON'], desc: 'Color code buildings', func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.UpBarColor = {label: ['Upgrade Bar/Colors OFF', 'Upgrade Bar/Colors ON'], desc: 'Color code upgrades and add a counter', func: function() {CM.Disp.ToggleUpBarColor();}};
CM.ConfigData.Flash = {label: ['Flash OFF', 'Flash ON'], desc: 'Flash screen on Golden Cookie/Season Popup'};
CM.ConfigData.Sound = {label: ['Sounds OFF', 'Sounds ON'], desc: 'Play a sound on Golden Cookie/Season Popup'};
CM.ConfigData.Volume = {label: [], desc: 'Volume of the sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.Volume.label[i] = i + '%';
}
CM.ConfigData.GCTimer = {label: ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'], desc: 'A timer on the Golden Cookie when has been spawned', func: function() {CM.Disp.ToggleGCTimer();}};
CM.ConfigData.Title = {label: ['Title OFF', 'Title ON'], desc: 'Update title with Golden Cookie/Season Popup timers'};
CM.ConfigData.Tooltip = {label: ['Tooltip Information OFF', 'Tooltip Information ON'], desc: 'Extra information in tooltip for buildings/upgrades'};
CM.ConfigData.ToolWarnCaut = {label: ['Tooltip Warning/Caution OFF', 'Tooltip Warning/Caution ON'], desc: 'A warning/caution when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards', func: function() {CM.Disp.ToggleToolWarnCaut();}};
CM.ConfigData.ToolWarnCautPos = {label: ['Tooltip Warning/Caution Position (Left)', 'Tooltip Warning/Caution Position (Bottom)'], desc: 'Placement of the warning/caution boxes', func: function() {CM.Disp.ToggleToolWarnCautPos();}};
CM.ConfigData.Stats = {label: ['Statistics OFF', 'Statistics ON'], desc: 'Extra Cookie Monster statistics!'};
CM.ConfigData.UpStats = {label: ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'], desc: 'Default Game rate is once every 3 seconds'};
CM.ConfigData.SayTime = {label: ['Format Time OFF', 'Format Time ON'], desc: 'Change how time is displayed in statistics', func: function() {CM.Disp.ToggleSayTime();}};
CM.ConfigData.Scale = {label: ['Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation'], desc: 'Change how long numbers are handled', func: function() {CM.Disp.RefreshScale();}};

