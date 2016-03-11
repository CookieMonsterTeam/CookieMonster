/**********
 * Header *
 **********/

CM = {};

CM.Backup = {};

CM.Cache = {};

CM.Config = {};

CM.ConfigData = {};

CM.Data = {};

CM.Disp = {};

CM.Sim = {};

/*********
 * Cache *
 *********/
 
CM.Cache.NextNumber = function(base) {
	var count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
	while (base == base + count) {
		count = CM.Cache.NextNumber(count);
	}
	return (base + count);
}

CM.Cache.RemakeIncome = function() {
	// Simulate Building Buys for 1 amount
	CM.Sim.BuyBuildings(1, 'Objects');

	// Simulate Upgrade Buys
	CM.Sim.BuyUpgrades();
	
	// Simulate Building Buys for 10 amount
	CM.Sim.BuyBuildings(10, 'Objects10');
	
	// Simulate Building Buys for 100 amount
	CM.Sim.BuyBuildings(100, 'Objects100');
}

CM.Cache.RemakeBuildingsROI = function() {
	CM.Cache.min = -1;
	CM.Cache.max = -1;
	CM.Cache.mid = -1;
	for (var i in CM.Cache.Objects) {
		//CM.Cache.Objects[i].roi = Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus;
		CM.Cache.Objects[i].roi = (Math.max(Game.Objects[i].getPrice() - Game.cookies, 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus);
		if (CM.Cache.min == -1 || CM.Cache.Objects[i].roi < CM.Cache.min) CM.Cache.min = CM.Cache.Objects[i].roi;
		if (CM.Cache.max == -1 || CM.Cache.Objects[i].roi > CM.Cache.max) CM.Cache.max = CM.Cache.Objects[i].roi;
	}
	CM.Cache.mid = ((CM.Cache.max - CM.Cache.min) / 2) + CM.Cache.min;
	for (var i in CM.Cache.Objects) {
		var color = '';
		if (CM.Cache.Objects[i].roi == CM.Cache.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Objects[i].roi == CM.Cache.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Objects[i].roi > CM.Cache.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Objects[i].color = color;
	}
}

CM.Cache.RemakeUpgradeROI = function() {
	for (var i in CM.Cache.Upgrades) {
		//CM.Cache.Upgrades[i].roi = Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus;
		CM.Cache.Upgrades[i].roi = (Math.max(Game.Upgrades[i].getPrice() - Game.cookies, 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus);
		if (isNaN(CM.Cache.Upgrades[i].roi)) CM.Cache.Upgrades[i].roi = 'Infinity';
		var color = '';
		if (CM.Cache.Upgrades[i].roi <= 0 || CM.Cache.Upgrades[i].roi == 'Infinity') color = CM.Disp.colorGray;
		else if (CM.Cache.Upgrades[i].roi < CM.Cache.min) color = CM.Disp.colorBlue;
		else if (CM.Cache.Upgrades[i].roi == CM.Cache.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Upgrades[i].roi == CM.Cache.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Upgrades[i].roi > CM.Cache.max) color = CM.Disp.colorPurple;
		else if (CM.Cache.Upgrades[i].roi > CM.Cache.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Upgrades[i].color = color;
	}
}

CM.Cache.RemakeBuildingsOtherROI = function(amount, target) {
	for (var i in CM.Cache[target]) {
		//CM.Cache[target][i].roi = CM.Cache[target][i].price / CM.Cache[target][i].bonus;
		CM.Cache[target][i].roi = (Math.max(CM.Cache[target][i].price - Game.cookies, 0) / Game.cookiesPs) + (CM.Cache[target][i].price / CM.Cache[target][i].bonus);
		var color = '';
		if (CM.Cache[target][i].roi <= 0 || CM.Cache[target][i].roi == 'Infinity') color = CM.Disp.colorGray;
		else if (CM.Cache[target][i].roi < CM.Cache.min) color = CM.Disp.colorBlue;
		else if (CM.Cache[target][i].roi == CM.Cache.min) color = CM.Disp.colorGreen;
		else if (CM.Cache[target][i].roi == CM.Cache.max) color = CM.Disp.colorRed;
		else if (CM.Cache[target][i].roi > CM.Cache.max) color = CM.Disp.colorPurple;
		else if (CM.Cache[target][i].roi > CM.Cache.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache[target][i].color = color;
	}
}

CM.Cache.RemakeROI = function() {
	// Buildings for 1 amount
	CM.Cache.RemakeBuildingsROI();
	
	// Upgrades
	CM.Cache.RemakeUpgradeROI();
	
	// Buildings for 10 amount
	CM.Cache.RemakeBuildingsOtherROI(10, 'Objects10');

	// Buildings for 100 amount
	CM.Cache.RemakeBuildingsOtherROI(100, 'Objects100');	
}

CM.Cache.RemakeLucky = function() {
	CM.Cache.Lucky = (Game.cookiesPs * 60 * 15) / 0.15;
	if (Game.frenzy > 0) {
		CM.Cache.Lucky /= Game.frenzyPower;
	}
	CM.Cache.LuckyReward = (CM.Cache.Lucky * 0.15) + 13;
	CM.Cache.LuckyFrenzy = CM.Cache.Lucky * 7;
	CM.Cache.LuckyRewardFrenzy = (CM.Cache.LuckyFrenzy * 0.15) + 13;
}

CM.Cache.MaxChainMoni = function(digit, maxPayout) {
	var chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	var moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
	var nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	while (nextMoni < maxPayout) {
		chain++;
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	}
	return moni;
}

CM.Cache.RemakeChain = function() {
	var maxPayout = Game.cookiesPs * 60 * 60 * 6;
	if (Game.frenzy > 0) {
		maxPayout /= Game.frenzyPower;
	}
	
	CM.Cache.ChainReward = CM.Cache.MaxChainMoni(7, maxPayout);
	
	CM.Cache.ChainWrathReward = CM.Cache.MaxChainMoni(6, maxPayout);
	
	if (maxPayout < CM.Cache.ChainReward) {
		CM.Cache.Chain = 0;
	}
	else {
		CM.Cache.Chain = CM.Cache.NextNumber(CM.Cache.ChainReward) / 0.25;
	}
	if (maxPayout < CM.Cache.ChainWrathReward) {
		CM.Cache.Chain = 0;
	}
	else {
		CM.Cache.ChainWrath = CM.Cache.NextNumber(CM.Cache.ChainWrathReward) / 0.25;
	}
	
	CM.Cache.ChainFrenzyReward = CM.Cache.MaxChainMoni(7, maxPayout * 7);
	
	CM.Cache.ChainFrenzyWrathReward = CM.Cache.MaxChainMoni(6, maxPayout * 7);
	
	if ((maxPayout * 7) < CM.Cache.ChainFrenzyReward) {
		CM.Cache.ChainFrenzy = 0;
	}
	else {
		CM.Cache.ChainFrenzy = CM.Cache.NextNumber(CM.Cache.ChainFrenzyReward) / 0.25;
	}
	if ((maxPayout * 7) < CM.Cache.ChainFrenzyWrathReward) {
		CM.Cache.ChainFrenzy = 0;
	}
	else {
		CM.Cache.ChainFrenzyWrath = CM.Cache.NextNumber(CM.Cache.ChainFrenzyWrathReward) / 0.25;
	}
}

CM.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		CM.Cache.SeaSpec = Math.max(25, Game.cookiesPs * 60 * 1);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
}

CM.Cache.RemakeSellForChoEgg = function() {
	if (Game.hasAura('Earth Shatterer') || Game.dragonLevel < 9) {
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			sellTotal += CM.Sim.BuildingSell(me.basePrice, me.amount, me.free, me.amount, 0);
		}
	}
	else {
		var highestBuilding = '';
		for (var i in Game.Objects) {
			if (Game.Objects[i].amount > 0) highestBuilding = i;
		}
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			var amount = 0;
			if (i == highestBuilding) {
				amount = me.amount - 1;
			}
			else {
				amount = me.amount;
			}
			sellTotal += CM.Sim.BuildingSell(me.basePrice, amount, me.free, amount, 1);
		}
	}
	CM.Cache.SellForChoEgg = sellTotal;
}

CM.Cache.min = -1;
CM.Cache.max = -1;
CM.Cache.mid = -1;
CM.Cache.Lucky = 0;
CM.Cache.LuckyReward = 0;
CM.Cache.LuckyFrenzy = 0;
CM.Cache.LuckyRewardFrenzy = 0;
CM.Cache.SeaSpec = 0;
CM.Cache.Chain = 0;
CM.Cache.ChainWrath = 0;
CM.Cache.ChainReward = 0;
CM.Cache.ChainWrathReward = 0;
CM.Cache.ChainFrenzy = 0;
CM.Cache.ChainFrenzyWrath = 0;
CM.Cache.ChainFrenzyReward = 0;
CM.Cache.ChainFrenzyWrathReward = 0;
CM.Cache.SellForChoEgg = 0;

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
			if (typeof CM.Config[i] === 'undefined') {
				mod = true;
				CM.Config[i] = CM.ConfigDefault[i];
			}
			else if (i != 'StatsPref' && i != 'Colors') {
				if (i.indexOf('SoundURL') == -1) {
					if (!(CM.Config[i] > -1 && CM.Config[i] < CM.ConfigData[i].label.length)) {
						mod = true;
						CM.Config[i] = CM.ConfigDefault[i];
					}
				}
				else {  // Sound URLs
					if (typeof CM.Config[i] != 'string') {
						mod = true;
						CM.Config[i] = CM.ConfigDefault[i];
					}
				}
			}
			else if (i == 'StatsPref') {
				for (var j in CM.ConfigDefault.StatsPref) {
					if (typeof CM.Config[i][j] === 'undefined' || !(CM.Config[i][j] > -1 && CM.Config[i][j] < 2)) {
						mod = true;
						CM.Config[i][j] = CM.ConfigDefault[i][j];
					}
				}
			}
			else { // Colors
				for (var j in CM.ConfigDefault.Colors) {
					if (typeof CM.Config[i][j] === 'undefined' || typeof CM.Config[i][j] != 'string') {
						mod = true;
						CM.Config[i][j] = CM.ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) CM.SaveConfig(CM.Config);
		CM.Loop(); // Do loop once
		for (var i in CM.ConfigDefault) {
			if (i != 'StatsPref' && typeof CM.ConfigData[i].func !== 'undefined') {
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

CM.ToggleConfig = function(config) {
	CM.ToggleConfigUp(config);
	if (CM.ConfigData[config].toggle) {
		if (CM.Config[config] == 0) {
			l(CM.ConfigPrefix + config).className = 'option off';
		}
		else {
			l(CM.ConfigPrefix + config).className = 'option';
		}
	}
}

CM.ToggleConfigUp = function(config) {
	CM.Config[config]++;
	if (CM.Config[config] == CM.ConfigData[config].label.length) {
		CM.Config[config] = 0;
	}
	if (typeof CM.ConfigData[config].func !== 'undefined') {
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
	if (typeof CM.ConfigData[config].func !== 'undefined') {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.Disp.GetConfigDisplay(config);
	CM.SaveConfig(CM.Config);
}

CM.ToggleStatsConfig = function(config) {
	if (CM.Config.StatsPref[config] == 0) {
		CM.Config.StatsPref[config]++;
	}
	else {
		CM.Config.StatsPref[config]--;
	}
	CM.SaveConfig(CM.Config);
}

CM.ConfigData.BotBar = {label: ['Bottom Bar OFF', 'Bottom Bar ON'], desc: 'Building Information', toggle: true, func: function() {CM.Disp.ToggleBotBar();}};
CM.ConfigData.TimerBar = {label: ['Timer Bar OFF', 'Timer Bar ON'], desc: 'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy', toggle: true, func: function() {CM.Disp.ToggleTimerBar();}};
CM.ConfigData.TimerBarPos = {label: ['Timer Bar Position (Top Left)', 'Timer Bar Position (Bottom)'], desc: 'Placement of the Timer Bar', toggle: false, func: function() {CM.Disp.ToggleTimerBarPos();}};
CM.ConfigData.BuildColor = {label: ['Building Colors OFF', 'Building Colors ON'], desc: 'Color code buildings', toggle: true, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.BulkBuildColor = {label: ['Bulk Building Colors (Single Buildings Color)', 'Bulk Building Colors (Calculated Color)'], desc: 'Color code bulk buildings based on single buildings color or calculated bulk value color', toggle: false, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.UpBarColor = {label: ['Upgrade Bar/Colors OFF', 'Upgrade Bar/Colors ON'], desc: 'Color code upgrades and add a counter', toggle: true, func: function() {CM.Disp.ToggleUpBarColor();}};
CM.ConfigData.Colors = {desc: {Blue: 'Color Blue.  Used to show better than best ROI building, for Click Frenzy bar, and for various labels', Green: 'Color Green.  Used to show best ROI building, for Blood Frenzy bar, and for various labels', Yellow: 'Color Yellow.  Used to show between best and worst ROI buildings closer to best, for Frenzy bar, and for various labels', Orange: 'Color Orange.  Used to show between best and worst ROI buildings closer to worst, for Next Reindeer bar, and for various labels', Red: 'Color Red.  Used to show worst ROI building, for Clot bar, and for various labels', Purple: 'Color Purple.  Used to show worse than worst ROI building, for Next Cookie bar, and for various labels', Gray: 'Color Gray.  Used to show negative or infinity ROI, and for Next Cookie/Next Reindeer bar', Pink: 'Color Pink.  Used for Dragonflight bar', Brown: 'Color Brown.  Used for Dragon Harvest bar'}, func: function() {CM.Disp.UpdateColors();}};
CM.ConfigData.Flash = {label: ['Flash OFF', 'Flash ON'], desc: 'Flash screen on Golden Cookie/Season Popup', toggle: true};
CM.ConfigData.Sound = {label: ['Sounds OFF', 'Sounds ON'], desc: 'Play a sound on Golden Cookie/Season Popup', toggle: true};
CM.ConfigData.Volume = {label: [], desc: 'Volume of the sound'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.Volume.label[i] = i + '%';
}
CM.ConfigData.GCSoundURL = {label: 'Golden Cookie Sound URL:', desc: 'URL of the sound to be played when a Golden Cookie spawns'};
CM.ConfigData.SeaSoundURL = {label: 'Season Special Sound URL:', desc: 'URL of the sound to be played when a Season Special spawns'};
CM.ConfigData.GCTimer = {label: ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'], desc: 'A timer on the Golden Cookie when it has been spawned', toggle: true, func: function() {CM.Disp.ToggleGCTimer();}};
CM.ConfigData.Title = {label: ['Title OFF', 'Title ON'], desc: 'Update title with Golden Cookie/Season Popup timers', toggle: true};
CM.ConfigData.Favicon = {label: ['Favicon OFF', 'Favicon ON'], desc: 'Update favicon with Golden/Wrath Cookie', toggle: true, func: function() {CM.Disp.UpdateFavicon();}};
CM.ConfigData.Tooltip = {label: ['Tooltip Information OFF', 'Tooltip Information ON'], desc: 'Extra information in tooltip for buildings/upgrades', toggle: true};
CM.ConfigData.TooltipAmor = {label: ['Tooltip Amortization Information OFF', 'Tooltip Amortization Information ON'], desc: 'Add amortization information to buildings tooltip', toggle: true};
CM.ConfigData.ToolWarnCaut = {label: ['Tooltip Warning/Caution OFF', 'Tooltip Warning/Caution ON'], desc: 'A warning/caution when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards', toggle: true, func: function() {CM.Disp.ToggleToolWarnCaut();}};
CM.ConfigData.ToolWarnCautPos = {label: ['Tooltip Warning/Caution Position (Left)', 'Tooltip Warning/Caution Position (Bottom)'], desc: 'Placement of the warning/caution boxes', toggle: false, func: function() {CM.Disp.ToggleToolWarnCautPos();}};
CM.ConfigData.ToolWarnCautBon = {label: ['Calculate Tooltip Warning/Caution With Bonus CPS OFF', 'Calculate Tooltip Warning/Caution With Bonus CPS ON'], desc: 'Calculate the warning/caution with or without the bonus CPS you get from buying', toggle: true};
CM.ConfigData.ToolWrink = {label: ['Wrinkler Tooltip OFF', 'Wrinkler Tooltip ON'], desc: 'Shows the amount of cookies a wrinkler will give when popping it', toggle: true};
CM.ConfigData.Stats = {label: ['Statistics OFF', 'Statistics ON'], desc: 'Extra Cookie Monster statistics!', toggle: true};
CM.ConfigData.UpStats = {label: ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'], desc: 'Default Game rate is once every 5 seconds', toggle: false};
CM.ConfigData.SayTime = {label: ['Format Time OFF', 'Format Time ON'], desc: 'Change how time is displayed in statistics', toggle: true, func: function() {CM.Disp.ToggleSayTime();}};
CM.ConfigData.Scale = {label: ['Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation'], desc: 'Change how long numbers are handled', toggle: false, func: function() {CM.Disp.RefreshScale();}};

/********
 * Data *
 ********/

CM.Data.HalloCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
CM.Data.ChristCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
CM.Data.ValCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];

/********
 * Disp *
 ********/

CM.Disp.FormatTime = function(time, format) {
	if (time == 'Infinity') return time;
	if (time > 777600000) return format ? 'Over 9000 days!' : '>9000d';
	time = Math.ceil(time);
	var d = Math.floor(time / 86400);
	var h = Math.floor(time % 86400 / 3600);
	var m = Math.floor(time % 3600 / 60);
	var s = Math.floor(time % 60);
	var str = '';
	if (d > 0) {
		str += d + (format ? (d == 1 ? ' day' : ' days') : 'd') + ', ';
	}
	if (str.length > 0 || h > 0) {
		str += h + (format ? (h == 1 ? ' hour' : ' hours') : 'h') + ', ';
	}
	if (str.length > 0 || m > 0) {
		str += m + (format ? (m == 1 ? ' minute' : ' minutes') : 'm') + ', ';
	}
	str += s + (format ? (s == 1 ? ' second' : ' seconds') : 's');
	
	return str;
}

CM.Disp.GetTimeColor = function(price, bank, cps) {
	var color;
	var text;
	if (bank >= price) {
		color = CM.Disp.colorGreen;
		text = 'Done!';
	}
	else {
		var time = (price - bank) / cps;
		text = CM.Disp.FormatTime(time);
		if (time > 300) {
			color =  CM.Disp.colorRed;
		}
		else if (time > 60) {
			color =  CM.Disp.colorOrange;
		}
		else {
			color =  CM.Disp.colorYellow;
		}
	}
	return {text: text, color: color};
}

CM.Disp.Beautify = function(num, frac) {
	if (CM.Config.Scale != 0 && isFinite(num)) {
		var answer = '';
		var negative = false;
		if (num < 0) {
			num = Math.abs(num);
			negative = true;
		}
				
		for (var i = (CM.Disp.shortScale.length - 1); i >= 0; i--) {
			if (i < CM.Disp.metric.length && CM.Config.Scale == 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + CM.Disp.metric[i];
					break;
				}
			}
			else if (CM.Config.Scale > 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000) + (CM.Config.Scale == 2 ? (' ' + CM.Disp.shortScale[i]) : ('e+' + ((i + 2) * 3)));
					break;
				}
			}
		}
		if (answer == '') {
			answer = CM.Backup.Beautify(num, frac);
		}
		
		if (negative) {
			answer = '-' + answer;
		}
		return answer;
	}
	else {
		return CM.Backup.Beautify(num, frac);
	}
}

CM.Disp.UpdateBackground = function() {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
}

CM.Disp.GetConfigDisplay = function(config) {
	return CM.ConfigData[config].label[CM.Config[config]];
}

CM.Disp.AddJscolor = function() {
	CM.Disp.Jscolor = document.createElement('script');
	CM.Disp.Jscolor.type = 'text/javascript';
	CM.Disp.Jscolor.setAttribute('src', 'http://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(CM.Disp.Jscolor);
}

CM.Disp.CreateCssArea = function() {
	CM.Disp.Css = document.createElement('style');
	CM.Disp.Css.type = 'text/css';

	document.head.appendChild(CM.Disp.Css);
}

CM.Disp.CreateBotBar = function() {
	CM.Disp.BotBar = document.createElement('div');
	CM.Disp.BotBar.id = 'CMBotBar';
	CM.Disp.BotBar.style.height = '55px';
	CM.Disp.BotBar.style.width = '100%';
	CM.Disp.BotBar.style.position = 'absolute';
	CM.Disp.BotBar.style.display = 'none';
	CM.Disp.BotBar.style.backgroundColor = '#262224';
	CM.Disp.BotBar.style.backgroundImage = '-moz-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = '-o-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = '-webkit-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
	CM.Disp.BotBar.style.borderTop = '1px solid black';
	CM.Disp.BotBar.style.overflow = 'auto';
	CM.Disp.BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';
	
	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.textAlign = 'center';
	table.style.whiteSpace = 'nowrap';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	var firstCol = function(text, color) {
		var td = document.createElement('td');
		td.style.textAlign = 'right';
		td.className = CM.Disp.colorTextPre + color;
		td.textContent = text;
		return td;
	}
	
	var type = document.createElement('tr');
	type.style.fontWeight = 'bold';
	type.appendChild(firstCol(CM.VersionMajor + '.' + CM.VersionMinor, CM.Disp.colorYellow));
	tbody.appendChild(type);
	var bonus = document.createElement('tr');
	bonus.appendChild(firstCol('Bonus Income', CM.Disp.colorBlue));
	tbody.appendChild(bonus);
	var roi = document.createElement('tr');
	roi.appendChild(firstCol('Return On Investment', CM.Disp.colorBlue));
	tbody.appendChild(roi);
	var time = document.createElement('tr');
	time.appendChild(firstCol('Time Left', CM.Disp.colorBlue));
	tbody.appendChild(time);
	
	for (var i in Game.Objects) {
		var header = document.createElement('td');
		header.appendChild(document.createTextNode((i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' ('));
		var span = document.createElement('span');
		span.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
		header.appendChild(span);
		header.appendChild(document.createTextNode(')'));
		type.appendChild(header);
		bonus.appendChild(document.createElement('td'));
		roi.appendChild(document.createElement('td'));
		time.appendChild(document.createElement('td'));
	
	}
	
	CM.Disp.BotBar.appendChild(table);
	
	l('wrapper').appendChild(CM.Disp.BotBar);
}

CM.Disp.ToggleBotBar = function() {
	if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.display = '';
		CM.Disp.UpdateBotBarOther();
	}
	else {
		CM.Disp.BotBar.style.display = 'none';
	}
	CM.Disp.UpdateBotTimerBarDisplay();
}

CM.Disp.UpdateBotBarOther = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;
	
		for (var i in CM.Cache.Objects) {
			count++;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].textContent = Game.Objects[i].amount;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify(CM.Cache.Objects[i].bonus, 2);
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].className = CM.Disp.colorTextPre + CM.Cache.Objects[i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache.Objects[i].roi, 2);
		}
	}
}

CM.Disp.UpdateBotBarTime = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;
	
		for (var i in CM.Cache.Objects) {
			count++;
			var timeColor = CM.Disp.GetTimeColor(Game.Objects[i].getPrice(), Game.cookies, (Game.cookiesPs * (1 - Game.cpsSucked)));
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].className = CM.Disp.colorTextPre + timeColor.color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
}

CM.Disp.CreateTimerBar = function() {
	CM.Disp.TimerBar = document.createElement('div');
	CM.Disp.TimerBar.id = 'CMTimerBar';
	CM.Disp.TimerBar.style.position = 'absolute';
	CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.TimerBar.style.height = '48px';
	CM.Disp.TimerBar.style.fontSize = '10px';
	CM.Disp.TimerBar.style.fontWeight = 'bold';
	CM.Disp.TimerBar.style.backgroundColor = 'black';
	
	var bar = function(name, bars, time) {
		var div = document.createElement('div');
		div.style.width = '100%';
		div.style.height = '10px';
		div.style.margin = 'auto';
		div.style.position = 'absolute';
		div.style.left = '0px';
		div.style.top = '0px';
		div.style.right = '0px';
		div.style.bottom = '0px';
		
		var type = document.createElement('span');
		type.style.display = 'inline-block';
		type.style.textAlign = 'right';
		type.style.width = '78px';
		type.style.marginRight = '5px';
		type.style.verticalAlign = 'text-top';
		type.textContent = name;
		div.appendChild(type);
		
		for (var i = 0; i < bars.length; i++) {
			var colorBar = document.createElement('span');
			colorBar.id = bars[i].id
			colorBar.style.display = 'inline-block';
			colorBar.style.height = '10px';
			if (bars.length - 1 == i) {
				colorBar.style.borderTopRightRadius = '10px';
				colorBar.style.borderBottomRightRadius = '10px';
			}
			if (typeof bars[i].color !== 'undefined') {
				colorBar.className = CM.Disp.colorBackPre + bars[i].color;
			}
			div.appendChild(colorBar);
		}
		
		var timer = document.createElement('span');
		timer.id = time;
		timer.style.marginLeft = '5px';
		timer.style.verticalAlign = 'text-top';
		div.appendChild(timer);
		return div
	}
	
	CM.Disp.TimerBarGC = document.createElement('div');
	CM.Disp.TimerBarGC.id = 'CMTimerBarGC';
	CM.Disp.TimerBarGC.style.height = '12px';
	CM.Disp.TimerBarGC.style.margin = '0px 10px';
	CM.Disp.TimerBarGC.style.position = 'relative';
	CM.Disp.TimerBarGC.appendChild(bar('Next Cookie', [{id: 'CMTimerBarGCMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarGCBar', color: CM.Disp.colorPurple}], 'CMTimerBarGCTime'));
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarGC);
	
	CM.Disp.TimerBarRen = document.createElement('div');
	CM.Disp.TimerBarRen.id = 'CMTimerBarRen';
	CM.Disp.TimerBarRen.style.height = '12px';
	CM.Disp.TimerBarRen.style.margin = '0px 10px';
	CM.Disp.TimerBarRen.style.position = 'relative';
	CM.Disp.TimerBarRen.appendChild(bar('Next Reindeer', [{id: 'CMTimerBarRenMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarRenBar', color: CM.Disp.colorOrange}], 'CMTimerBarRenTime'));
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarRen);
	
	CM.Disp.TimerBarFren = document.createElement('div');
	CM.Disp.TimerBarFren.id = 'CMTimerBarFren';
	CM.Disp.TimerBarFren.style.height = '12px';
	CM.Disp.TimerBarFren.style.margin = '0px 10px';
	CM.Disp.TimerBarFren.style.position = 'relative';
	CM.Disp.TimerBarFren.appendChild(bar('', [{id: 'CMTimerBarFrenBar'}], 'CMTimerBarFrenTime'));
	CM.Disp.TimerBarFren.firstChild.firstChild.id = 'CMTimerBarFrenType';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarFren);
	
	CM.Disp.TimerBarCF = document.createElement('div');
	CM.Disp.TimerBarCF.id = 'CMTimerBarCF';
	CM.Disp.TimerBarCF.style.height = '12px';
	CM.Disp.TimerBarCF.style.margin = '0px 10px';
	CM.Disp.TimerBarCF.style.position = 'relative';
	CM.Disp.TimerBarCF.appendChild(bar('', [{id: 'CMTimerBarCFBar'}], 'CMTimerBarCFTime'));
	CM.Disp.TimerBarCF.firstChild.firstChild.id = 'CMTimerBarCFType';
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBarCF);
	
	l('wrapper').appendChild(CM.Disp.TimerBar);
}

CM.Disp.ToggleTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		CM.Disp.TimerBar.style.display = '';
	}
	else {
		CM.Disp.TimerBar.style.display = 'none';
	}
	CM.Disp.UpdateBotTimerBarDisplay();
}

CM.Disp.ToggleTimerBarPos = function() {
	if (CM.Config.TimerBarPos == 0) {
		CM.Disp.TimerBar.style.width = '30%';
		CM.Disp.TimerBar.style.bottom = '';
		l('game').insertBefore(CM.Disp.TimerBar, l('sectionLeft'));
	}
	else {
		CM.Disp.TimerBar.style.width = '100%';
		CM.Disp.TimerBar.style.bottom = '0px';
		l('wrapper').appendChild(CM.Disp.TimerBar);
	}
	CM.Disp.UpdateBotTimerBarDisplay();
}

CM.Disp.UpdateTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		// label width: 83, timer width: 26, div margin: 20
		var maxWidth = CM.Disp.TimerBar.offsetWidth - 129;
		var count = 0;
		
		if (Game.goldenCookie.life <= 0 && Game.goldenCookie.toDie == 0 && !Game.Has('Golden switch [off]')) {
			CM.Disp.TimerBarGC.style.display = '';
			l('CMTimerBarGCMinBar').style.width = Math.round(Math.max(0, Game.goldenCookie.minTime - Game.goldenCookie.time) * maxWidth / Game.goldenCookie.maxTime) + 'px';
			if (Game.goldenCookie.minTime == Game.goldenCookie.maxTime) {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '10px';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '10px';
			}
			else {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '';
			}
			l('CMTimerBarGCBar').style.width = Math.round(Math.min(Game.goldenCookie.maxTime - Game.goldenCookie.minTime, Game.goldenCookie.maxTime - Game.goldenCookie.time) * maxWidth / Game.goldenCookie.maxTime) + 'px';
			l('CMTimerBarGCTime').textContent = Math.ceil((Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarGC.style.display = 'none';
		}
		
		if (Game.season == 'christmas' && Game.seasonPopup.life <= 0 && Game.seasonPopup.toDie == 0) {
			CM.Disp.TimerBarRen.style.display = '';
			l('CMTimerBarRenMinBar').style.width = Math.round(Math.max(0, Game.seasonPopup.minTime - Game.seasonPopup.time) * maxWidth / Game.seasonPopup.maxTime) + 'px';
			l('CMTimerBarRenBar').style.width = Math.round(Math.min(Game.seasonPopup.maxTime - Game.seasonPopup.minTime, Game.seasonPopup.maxTime - Game.seasonPopup.time) * maxWidth / Game.seasonPopup.maxTime) + 'px';
			l('CMTimerBarRenTime').textContent = Math.ceil((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarRen.style.display = 'none';
		}
		
		if (Game.frenzy > 0) {
			CM.Disp.TimerBarFren.style.display = '';
			if (Game.frenzyPower == 7) {
				l('CMTimerBarFrenType').textContent = 'Frenzy';
				l('CMTimerBarFrenBar').className = CM.Disp.colorBackPre + CM.Disp.colorYellow;
			}
			else if (Game.frenzyPower == 0.5) {
				l('CMTimerBarFrenType').textContent = 'Clot';
				l('CMTimerBarFrenBar').className = CM.Disp.colorBackPre + CM.Disp.colorRed;
			}
			else if (Game.frenzyPower == 15) {
				l('CMTimerBarFrenType').textContent = 'Dragon Harvest';
				l('CMTimerBarFrenBar').className = CM.Disp.colorBackPre + CM.Disp.colorBrown;
			}
			else {
				l('CMTimerBarFrenType').textContent = 'Blood Frenzy';
				l('CMTimerBarFrenBar').className = CM.Disp.colorBackPre + CM.Disp.colorGreen;
			}
			l('CMTimerBarFrenBar').style.width = Math.round(Game.frenzy * maxWidth / Game.frenzyMax) + 'px';
			l('CMTimerBarFrenTime').textContent = Math.ceil(Game.frenzy / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarFren.style.display = 'none';
		}
		
		if (Game.clickFrenzy > 0) {
			CM.Disp.TimerBarCF.style.display = '';
			if (Game.clickFrenzyPower == 777) {
				l('CMTimerBarCFType').textContent = 'Click Frenzy';
				l('CMTimerBarCFBar').className = CM.Disp.colorBackPre + CM.Disp.colorBlue;
			}
			else {
				l('CMTimerBarCFType').textContent = 'Dragonflight';
				l('CMTimerBarCFBar').className = CM.Disp.colorBackPre + CM.Disp.colorPink;
			}
			l('CMTimerBarCFBar').style.width = Math.round(Game.clickFrenzy * maxWidth / Game.clickFrenzyMax) + 'px';
			l('CMTimerBarCFTime').textContent = Math.ceil(Game.clickFrenzy / Game.fps);
			count++;
		}
		else {
			CM.Disp.TimerBarCF.style.display = 'none';
		}
		
		if (count != 0) {
			var height = 48 / count;
			CM.Disp.TimerBarGC.style.height = height + 'px';
			CM.Disp.TimerBarRen.style.height = height + 'px';
			CM.Disp.TimerBarFren.style.height = height + 'px';
			CM.Disp.TimerBarCF.style.height = height + 'px';
		}
	}
}

CM.Disp.UpdateBotTimerBarDisplay = function() {
	if (CM.Config.BotBar == 1 && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 1) {
		CM.Disp.BotBar.style.bottom = '48px';
		l('game').style.bottom = '104px';
	}
	else if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '56px';
	}
	else if (CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 1) {
		l('game').style.bottom = '48px';
	}
	else { // No bars
		l('game').style.bottom = '0px';
	}
	
	if (CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
		l('sectionLeft').style.top = '48px';
	}
	else {
		l('sectionLeft').style.top = '';
	}
	
	CM.Disp.UpdateBackground();
}

CM.Disp.UpdateBuildings = function() {
	if (CM.Config.BuildColor == 1 && Game.buyMode == 1) {
		var target = '';
		if (Game.buyBulk == 10 && CM.Config.BulkBuildColor == 1) {
			target = 'Objects10';
		}
		else if (Game.buyBulk == 100 && CM.Config.BulkBuildColor == 1) {
			target = 'Objects100';
		}
		else {
			target = 'Objects';
		}
		for (var i in CM.Cache[target]) {
			l('productPrice' + Game.Objects[i].id).style.color = CM.Config.Colors[CM.Cache[target][i].color];
		}
	}
	else {
		for (var i in CM.Cache.Objects) {
			l('productPrice' + Game.Objects[i].id).style.color = '';
		}
	}
}

CM.Disp.CreateUpgradeBar = function() {
	CM.Disp.UpgradeBar = document.createElement('div');
	CM.Disp.UpgradeBar.id = 'CMUpgradeBar';
	CM.Disp.UpgradeBar.style.width = '100%';
	CM.Disp.UpgradeBar.style.backgroundColor = 'black';
	CM.Disp.UpgradeBar.style.textAlign = 'center';
	CM.Disp.UpgradeBar.style.fontWeight = 'bold';
	CM.Disp.UpgradeBar.style.display = 'none';
	CM.Disp.UpgradeBar.onmouseout = function() { Game.tooltip.hide(); };
	
	var placeholder = document.createElement('div');
	var legend = document.createElement('div');
	legend.style.minWidth = '330px';
	legend.style.marginBottom = '4px';
	var title = document.createElement('div');
	title.className = 'name';
	title.style.marginBottom = '4px';
	title.textContent = 'Legend';
	legend.appendChild(title);
	
	var legendLine = function(color, text) {
		var div = document.createElement('div');
		div.style.verticalAlign = 'middle';
		var span = document.createElement('span');
		span.className = CM.Disp.colorBackPre + color;
		span.style.display = 'inline-block';
		span.style.height = '10px';
		span.style.width = '10px';
		span.style.marginRight = '4px';
		div.appendChild(span);
		div.appendChild(document.createTextNode(text));
		return div;
	}
	
	legend.appendChild(legendLine(CM.Disp.colorBlue, 'Better than best ROI building'));
	legend.appendChild(legendLine(CM.Disp.colorGreen, 'Same as best ROI building'));
	legend.appendChild(legendLine(CM.Disp.colorYellow, 'Between best and worst ROI buildings closer to best'));
	legend.appendChild(legendLine(CM.Disp.colorOrange, 'Between best and worst ROI buildings closer to worst'));
	legend.appendChild(legendLine(CM.Disp.colorRed, 'Same as worst ROI building'));
	legend.appendChild(legendLine(CM.Disp.colorPurple, 'Worse than worst ROI building'));
	legend.appendChild(legendLine(CM.Disp.colorGray, 'Negative or infinity ROI'));
	placeholder.appendChild(legend);
	
	CM.Disp.UpgradeBar.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML), 'store');};
	
	var upgradeNumber = function(id, color) {
		var span = document.createElement('span');
		span.id = id;
		span.className = CM.Disp.colorTextPre + color;
		span.style.width = '14.28571428571429%';
		span.style.display = 'inline-block';
		span.textContent = '0';
		return span;
	}
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarBlue', CM.Disp.colorBlue));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGreen', CM.Disp.colorGreen));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarYellow', CM.Disp.colorYellow));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarOrange', CM.Disp.colorOrange));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarRed', CM.Disp.colorRed));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarPurple', CM.Disp.colorPurple));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGray', CM.Disp.colorGray));
	
	l('upgrades').parentNode.insertBefore(CM.Disp.UpgradeBar, l('upgrades').parentNode.childNodes[3]);
}

CM.Disp.ToggleUpBarColor = function() {
	if (CM.Config.UpBarColor == 1) {
		CM.Disp.UpgradeBar.style.display = '';
		CM.Disp.UpdateUpgrades();
	}
	else {
		CM.Disp.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
}

CM.Disp.UpdateUpgrades = function() {
	if (CM.Config.UpBarColor == 1) {
		var blue = 0;
		var green = 0;
		var yellow = 0;
		var orange = 0;
		var red = 0;
		var purple = 0;
		var gray = 0;

		for (var i in Game.UpgradesInStore) {
			var me = Game.UpgradesInStore[i];
			var addedColor = false;
			for (var j = 0; j < l('upgrade' + i).childNodes.length; j++) {
				if (l('upgrade' + i).childNodes[j].className.indexOf(CM.Disp.colorBackPre) != -1) {
					l('upgrade' + i).childNodes[j].className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
					addedColor = true;
					break;
				}
			}
			if (!addedColor) {
				var div = document.createElement('div');
				div.style.width = '10px';
				div.style.height = '10px';
				div.className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
				l('upgrade' + i).appendChild(div);
			}
			if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorBlue) blue++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorGreen) green++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorYellow) yellow++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorOrange) orange++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorRed) red++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorPurple) purple++;
			else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorGray) gray++;
		}

		l('CMUpgradeBarBlue').textContent = blue;
		l('CMUpgradeBarGreen').textContent = green;
		l('CMUpgradeBarYellow').textContent = yellow;
		l('CMUpgradeBarOrange').textContent = orange;
		l('CMUpgradeBarRed').textContent = red;
		l('CMUpgradeBarPurple').textContent = purple;
		l('CMUpgradeBarGray').textContent = gray;
	}
}

CM.Disp.UpdateColors = function() {
	var str = '';
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorTextPre + CM.Disp.colors[i] + ' { color: ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBackPre + CM.Disp.colors[i] + ' { background-color: ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBorderPre + CM.Disp.colors[i] + ' { border: 1px solid ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	CM.Disp.Css.textContent = str;
	CM.Disp.UpdateBuildings(); // Class has been already set
}

CM.Disp.CreateWhiteScreen = function() {
	CM.Disp.WhiteScreen = document.createElement('div');
	CM.Disp.WhiteScreen.id = 'CMWhiteScreen';
	CM.Disp.WhiteScreen.style.width = '100%';
	CM.Disp.WhiteScreen.style.height = '100%';
	CM.Disp.WhiteScreen.style.backgroundColor = 'white';
	CM.Disp.WhiteScreen.style.display = 'none';
	CM.Disp.WhiteScreen.style.zIndex = '9999999999';
	CM.Disp.WhiteScreen.style.position = 'absolute';
	
	l('wrapper').appendChild(CM.Disp.WhiteScreen);
}

CM.Disp.Flash = function(mode) {
	if ((CM.Config.Flash == 1 && mode == 3) || mode == 1) {
		CM.Disp.WhiteScreen.style.opacity = '0.5';
		if (mode == 3) {
			CM.Disp.WhiteScreen.style.display = 'inline';
			setTimeout(function() {CM.Disp.Flash(2);}, 1000/Game.fps);
		}
		else {
			setTimeout(function() {CM.Disp.Flash(0);}, 1000/Game.fps);
		}
	}
	else if (mode == 2) {
		CM.Disp.WhiteScreen.style.opacity = '1';
		setTimeout(function() {CM.Disp.Flash(1);}, 1000/Game.fps);
	}
	else if (mode == 0) {
		CM.Disp.WhiteScreen.style.display = 'none';
	}
}

CM.Disp.PlaySound = function(url) {
	if (CM.Config.Sound == 1) {
		var sound = new realAudio(url);
		sound.volume = CM.Config.Volume / 100;
		sound.play();
	}
}

CM.Disp.CreateFavicon = function() {
	CM.Disp.Favicon = document.createElement('link');
	CM.Disp.Favicon.id = 'CMFavicon';
	CM.Disp.Favicon.rel = 'shortcut icon';
	CM.Disp.Favicon.href = 'http://orteil.dashnet.org/cookieclicker/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(CM.Disp.Favicon);
}

CM.Disp.UpdateFavicon = function() {
	if (CM.Config.Favicon == 1 && l('goldenCookie').style.display != 'none') {
		if (Game.goldenCookie.wrath) {
			CM.Disp.Favicon.href = 'http://aktanusa.github.io/CookieMonster/favicon/wrathCookie.ico';
		}
		else {
			CM.Disp.Favicon.href = 'http://aktanusa.github.io/CookieMonster/favicon/goldenCookie.ico';
		}
	}
	else {
		CM.Disp.Favicon.href = 'http://orteil.dashnet.org/cookieclicker/favicon.ico';
	}
}

CM.Disp.CreateGCTimer = function() {
	CM.Disp.GCTimer = document.createElement('div');
	CM.Disp.GCTimer.style.width = '96px';
	CM.Disp.GCTimer.style.height = '96px';
	CM.Disp.GCTimer.style.display = 'none';
	CM.Disp.GCTimer.style.position = 'absolute';
	CM.Disp.GCTimer.style.zIndex = '10000000001';
	CM.Disp.GCTimer.style.textAlign = 'center';
	CM.Disp.GCTimer.style.lineHeight = '96px';
	CM.Disp.GCTimer.style.fontFamily = '\"Kavoon\", Georgia, serif';
	CM.Disp.GCTimer.style.fontSize = '35px';
	CM.Disp.GCTimer.style.cursor = 'pointer';
	CM.Disp.GCTimer.onclick = function () {Game.goldenCookie.click(); CM.Disp.GCTimer.style.display = 'none';};
		
	l('game').appendChild(CM.Disp.GCTimer);
}

CM.Disp.ToggleGCTimer = function() {
	if (CM.Config.GCTimer == 1) {
		if (l('goldenCookie').style.display != 'none') {
			CM.Disp.GCTimer.style.display = 'block';
			CM.Disp.GCTimer.style.left = l('goldenCookie').style.left;
			CM.Disp.GCTimer.style.top = l('goldenCookie').style.top;
		}
	}
	else {
		CM.Disp.GCTimer.style.display = 'none';
	}
}

CM.Disp.CheckGoldenCookie = function() {
	if (CM.Disp.lastGoldenCookieState != l('goldenCookie').style.display) {
		CM.Disp.lastGoldenCookieState = l('goldenCookie').style.display;
		CM.Disp.UpdateFavicon();
		if (l('goldenCookie').style.display != 'none') {
			if (CM.Config.GCTimer == 1) {
				CM.Disp.GCTimer.style.display = 'block';
				CM.Disp.GCTimer.style.left = l('goldenCookie').style.left;
				CM.Disp.GCTimer.style.top = l('goldenCookie').style.top;
			}
			
			CM.Disp.Flash(3);
			CM.Disp.PlaySound(CM.Config.GCSoundURL);
		}
		else if (CM.Config.GCTimer == 1) CM.Disp.GCTimer.style.display = 'none';
	}
	else if (CM.Config.GCTimer == 1 && l('goldenCookie').style.display != 'none') {
		CM.Disp.GCTimer.style.opacity = 1 - Math.pow((Game.goldenCookie.life / (Game.fps * Game.goldenCookie.dur)) * 2 - 1, 4);
		CM.Disp.GCTimer.textContent = Math.ceil(Game.goldenCookie.life / Game.fps);
	}
}


CM.Disp.EmphSeasonPopup = function() {
	if (Game.season=='christmas') {
		CM.Disp.Flash(3);
		CM.Disp.PlaySound(CM.Config.SeaSoundURL);
	}
}

CM.Disp.UpdateTitle = function() {
	if (CM.Config.Title == 1) {
		var addSP = false;
		
		var titleGC;
		var titleSP;
		if (l('goldenCookie').style.display != 'none') {
			if (Game.goldenCookie.wrath) {
				titleGC = '[W ' +  Math.ceil(Game.goldenCookie.life / Game.fps) + ']';
			}
			else {
				titleGC = '[G ' +  Math.ceil(Game.goldenCookie.life / Game.fps) + ']';
			}
		}
		else if (!Game.Has('Golden switch [off]')) {
			titleGC = '[' +  Math.ceil((Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps) + ']';
		}
		else {
			titleGC = '[GS]'
		}
		if (Game.season=='christmas') {
			addSP = true;
			if (l('seasonPopup').style.display != 'none') {
				titleSP = '[R ' +  Math.ceil(Game.seasonPopup.life / Game.fps) + ']';
			}
			else {
				titleSP = '[' +  Math.ceil((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps) + ']';
			}
		}
		
		var str = document.title;
		if (str.charAt(0) == '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}
		
		document.title = titleGC + (addSP ? titleSP : '') + ' ' + str;
	}
}

CM.Disp.CreateResetTooltip = function() {
	CM.Disp.ResetTooltipPlaceholder = document.createElement('div');
	var resetTitleDesc = document.createElement('div');
	resetTitleDesc.style.minWidth = '340px';
	resetTitleDesc.style.marginBottom = '4px';
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = 'The bonus income you would get from new prestige levels at 100% of its potential and from reset achievements if you have the same buildings/upgrades after reset';
	resetTitleDesc.appendChild(div);
	CM.Disp.ResetTooltipPlaceholder.appendChild(resetTitleDesc);
}

CM.Disp.CreateChoEggTooltip = function() {
	CM.Disp.ChoEggTooltipPlaceholder = document.createElement('div');
	var choEggTitleDesc = document.createElement('div');
	choEggTitleDesc.style.minWidth = '310px';
	choEggTitleDesc.style.marginBottom = '4px';
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = 'The amount of cookies you would get from selling all buildings with Earth Shatterer aura (if possible), popping all wrinklers, and then buying Chocolate egg';
	choEggTitleDesc.appendChild(div);
	CM.Disp.ChoEggTooltipPlaceholder.appendChild(choEggTitleDesc);
}

CM.Disp.AddMenuPref = function(title) {
	var header = function(text) {
		var div = document.createElement('div');
		div.className = 'listing';
		div.style.padding = '5px 16px';
		div.style.opacity = '0.7';
		div.style.fontSize = '17px';
		div.style.fontFamily = '\"Kavoon\", Georgia, serif';
		div.textContent = text;
		return div;
	}

	var frag = document.createDocumentFragment();
		
	frag.appendChild(title());
		
	var listing = function(config) {
		var div = document.createElement('div');
		div.className = 'listing';
		var a = document.createElement('a');
		if (CM.ConfigData[config].toggle && CM.Config[config] == 0) {
			a.className = 'option off';
		}
		else {
			a.className = 'option';
		}
		a.id = CM.ConfigPrefix + config;
		a.onclick = function() {CM.ToggleConfig(config);};
		a.textContent = CM.Disp.GetConfigDisplay(config);
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	
	var url = function(config) {
		var div = document.createElement('div');
		div.className = 'listing';
		var span = document.createElement('span');
		span.className = 'option';
		span.textContent = CM.ConfigData[config].label + ' ';
		div.appendChild(span);
		var input = document.createElement('input');
		input.id = CM.ConfigPrefix + config;
		input.className = 'option';
		input.type = 'text';
		input.value = CM.Config[config];
		input.style.width = '300px';
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		var a = document.createElement('a');
		a.className = 'option';
		a.onclick = function() {CM.Config[config] = l(CM.ConfigPrefix + config).value;CM.SaveConfig(CM.Config);};
		a.textContent = 'Save';
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
		
	frag.appendChild(header('Bars/Colors'));
	frag.appendChild(listing('BotBar'));
	frag.appendChild(listing('TimerBar'));
	frag.appendChild(listing('TimerBarPos'));
	frag.appendChild(listing('BuildColor'));
	frag.appendChild(listing('BulkBuildColor'));
	frag.appendChild(listing('UpBarColor'));
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		var div = document.createElement('div');
		div.className = 'listing';
		var input = document.createElement('input');
		input.id = CM.ConfigPrefix + 'Color' + CM.Disp.colors[i];
		input.className = 'option';
		input.style.width = '65px';
		input.value = CM.Config.Colors[CM.Disp.colors[i]];
		div.appendChild(input);
		eval('var change = function() {CM.Config.Colors[\'' + CM.Disp.colors[i] + '\'] = l(CM.ConfigPrefix + \'Color\' + \'' + CM.Disp.colors[i] + '\').value; CM.Disp.UpdateColors(); CM.SaveConfig(CM.Config);}');
		var jscolorpicker = new jscolor.color(input, {hash: true, caps: false, pickerZIndex: 1000000, pickerPosition: 'right', onImmediateChange: change});
		var label = document.createElement('label');
		label.textContent = CM.ConfigData.Colors.desc[CM.Disp.colors[i]];
		div.appendChild(label);
		frag.appendChild(div);
	}
	
	frag.appendChild(header('Golden Cookie/Season Popup Emphasis'));
	frag.appendChild(listing('Flash'));
	frag.appendChild(listing('Sound'));	
	var volConfig = 'Volume';
	var volume = document.createElement('div');
	volume.className = 'listing';
	var minus = document.createElement('a');
	minus.className = 'option';
	minus.onclick = function() {CM.ToggleConfigDown(volConfig);};
	minus.textContent = '-';
	volume.appendChild(minus);
	var volText = document.createElement('span');
	volText.id = CM.ConfigPrefix + volConfig;
	volText.textContent = CM.Disp.GetConfigDisplay(volConfig);
	volume.appendChild(volText);
	var plus = document.createElement('a');
	plus.className = 'option';
	plus.onclick = function() {CM.ToggleConfigUp(volConfig);};
	plus.textContent = '+';
	volume.appendChild(plus);
	var volLabel = document.createElement('label');
	volLabel.textContent = CM.ConfigData[volConfig].desc;
	volume.appendChild(volLabel);
	frag.appendChild(volume);
	frag.appendChild(url('GCSoundURL'));
	frag.appendChild(url('SeaSoundURL'));
	frag.appendChild(listing('GCTimer'));
	frag.appendChild(listing('Title'));
	frag.appendChild(listing('Favicon'));
	
	frag.appendChild(header('Tooltip'));
	frag.appendChild(listing('Tooltip'));
	frag.appendChild(listing('TooltipAmor'));
	frag.appendChild(listing('ToolWarnCaut'));
	frag.appendChild(listing('ToolWarnCautPos'));
	frag.appendChild(listing('ToolWarnCautBon'));
	frag.appendChild(listing('ToolWrink'));
	
	frag.appendChild(header('Statistics'));
	frag.appendChild(listing('Stats'));
	frag.appendChild(listing('UpStats'));
	frag.appendChild(listing('SayTime'));
	
	frag.appendChild(header('Other'));
	frag.appendChild(listing('Scale'));	
	var resDef = document.createElement('div');
	resDef.className = 'listing';
	var resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function() {CM.RestoreDefault();};
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);
		
	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
		
	CM.Disp.FormatButtonOnClickBak = l('formatButton').onclick;
	l('formatButton').onclick = function() {Game.Toggle('format', 'formatButton', 'Short numbers OFF', 'Short numbers ON', '1'); PlaySound('snd/tick.mp3'); CM.Disp.RefreshScale();};
}

CM.Disp.AddMenuStats = function(title) {
	var header = function(text, config) {
		var div = document.createElement('div');
		div.className = 'listing';
		div.style.padding = '5px 16px';
		div.style.opacity = '0.7';
		div.style.fontSize = '17px';
		div.style.fontFamily = '\"Kavoon\", Georgia, serif';
		div.appendChild(document.createTextNode(text + ' '));
		var span = document.createElement('span');
		span.style.cursor = 'pointer';
		span.style.display = 'inline-block';
		span.style.height = '14px';
		span.style.width = '14px';
		span.style.borderRadius = '7px';
		span.style.textAlign = 'center';
		span.style.backgroundColor = '#C0C0C0';
		span.style.color = 'black';
		span.style.fontSize = '13px';
		span.style.verticalAlign = 'middle';
		span.textContent = CM.Config.StatsPref[config] ? '-' : '+';
		span.onclick = function() {CM.ToggleStatsConfig(config); Game.UpdateMenu();};
		div.appendChild(span);
		return div;
	}
	
	var stats = document.createElement('div');
	stats.className = 'subsection';

	stats.appendChild(title());
	
	var listing = function(name, text) {
		var div = document.createElement('div');
		div.className = 'listing';
		var b = document.createElement('b');
		if (typeof name == 'string') b.appendChild(document.createTextNode(name));
		else b.appendChild(name); // fragment
		b.appendChild(document.createTextNode(' : '));
		div.appendChild(b);
		div.appendChild(text);
		return div;
	}
	
	stats.appendChild(header('Lucky Cookies', 'Lucky'));
	if (CM.Config.StatsPref.Lucky) {
		var luckyColor = (Game.cookies < CM.Cache.Lucky) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var luckyTime = (Game.cookies < CM.Cache.Lucky) ? CM.Disp.FormatTime((CM.Cache.Lucky - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		var luckyColorFrenzy = (Game.cookies < CM.Cache.LuckyFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var luckyTimeFrenzy = (Game.cookies < CM.Cache.LuckyFrenzy) ? CM.Disp.FormatTime((CM.Cache.LuckyFrenzy - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		var luckyCurBase = Math.min(Game.cookies * 0.15, Game.cookiesPs * 60 * 15) + 13;
		var luckyRewardMax = CM.Cache.LuckyReward;
		var luckyRewardMaxWrath = CM.Cache.LuckyReward;
		var luckyRewardFrenzyMax = CM.Cache.LuckyRewardFrenzy;
		var luckyRewardFrenzyMaxWrath = CM.Cache.LuckyRewardFrenzy;
		var luckyCur = luckyCurBase;
		var luckyCurWrath = luckyCurBase;
		if (Game.hasAura('Ancestral Metamorphosis')) {
			luckyRewardMax *= 1.1;
			luckyRewardFrenzyMax *= 1.1;
			luckyCur *= 1.1;
		}
		if (Game.hasAura('Unholy Dominion')) {
			luckyRewardMaxWrath *= 1.1;
			luckyRewardFrenzyMaxWrath *= 1.1;
			luckyCurWrath *= 1.1;
		}
	
		var luckyReqFrag = document.createDocumentFragment();
		var luckyReqSpan = document.createElement('span');
		luckyReqSpan.style.fontWeight = 'bold';
		luckyReqSpan.className = CM.Disp.colorTextPre + luckyColor;
		luckyReqSpan.textContent = Beautify(CM.Cache.Lucky);
		luckyReqFrag.appendChild(luckyReqSpan);
		if (luckyTime != '') {
			var luckyReqSmall = document.createElement('small');
			luckyReqSmall.textContent = ' (' + luckyTime + ')';
			luckyReqFrag.appendChild(luckyReqSmall);
		}
		stats.appendChild(listing('\"Lucky!\" Cookies Required', luckyReqFrag));
		var luckyReqFrenFrag = document.createDocumentFragment();
		var luckyReqFrenSpan = document.createElement('span');
		luckyReqFrenSpan.style.fontWeight = 'bold';
		luckyReqFrenSpan.className = CM.Disp.colorTextPre + luckyColorFrenzy;
		luckyReqFrenSpan.textContent = Beautify(CM.Cache.LuckyFrenzy);
		luckyReqFrenFrag.appendChild(luckyReqFrenSpan);
		if (luckyTimeFrenzy != '') {
			var luckyReqFrenSmall = document.createElement('small');
			luckyReqFrenSmall.textContent = ' (' + luckyTimeFrenzy + ')';
			luckyReqFrenFrag.appendChild(luckyReqFrenSmall);
		}
		stats.appendChild(listing('\"Lucky!\" Cookies Required (Frenzy)', luckyReqFrenFrag));
		stats.appendChild(listing('\"Lucky!\" Reward (MAX) (Golden / Wrath)',  document.createTextNode(Beautify(luckyRewardMax) + ' / ' + Beautify(luckyRewardMaxWrath))));
		stats.appendChild(listing('\"Lucky!\" Reward (MAX) (Frenzy) (Golden / Wrath)',  document.createTextNode(Beautify(luckyRewardFrenzyMax) + ' / ' + Beautify(luckyRewardFrenzyMaxWrath))));
		stats.appendChild(listing('\"Lucky!\" Reward (CUR) (Golden / Wrath)',  document.createTextNode(Beautify(luckyCur) + ' / ' + Beautify(luckyCurWrath))));
	}
	
	stats.appendChild(header('Chain Cookies', 'Chain'));
	if (CM.Config.StatsPref.Chain) {
		var chainColor = (Game.cookies < CM.Cache.Chain) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainTime = (Game.cookies < CM.Cache.Chain) ? CM.Disp.FormatTime((CM.Cache.Chain - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		var chainColorFrenzy = (Game.cookies < CM.Cache.ChainFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainTimeFrenzy = (Game.cookies < CM.Cache.ChainFrenzy) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzy - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		var chainWrathColor = (Game.cookies < CM.Cache.ChainWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainWrathTime = (Game.cookies < CM.Cache.ChainWrath) ? CM.Disp.FormatTime((CM.Cache.ChainWrath - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		var chainWrathColorFrenzy = (Game.cookies < CM.Cache.ChainFrenzyWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainWrathTimeFrenzy = (Game.cookies < CM.Cache.ChainFrenzyWrath) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyWrath - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		
		var chainRewardMax = CM.Cache.ChainReward;
		var chainWrathRewardMax = CM.Cache.ChainWrathReward;
		var chainFrenzyRewardMax = CM.Cache.ChainFrenzyReward;
		var chainFrenzyWrathRewardMax = CM.Cache.ChainFrenzyWrathReward;
		var chainCurMax = Math.min(Game.cookiesPs * 60 * 60 * 6, Game.cookies * 0.25);
		var chainCur = CM.Cache.MaxChainMoni(7, chainCurMax);
		var chainCurWrath = CM.Cache.MaxChainMoni(6, chainCurMax);
		if (Game.hasAura('Ancestral Metamorphosis')) {
			chainRewardMax *= 1.1;
			chainFrenzyRewardMax *= 1.1;
			chainCur *= 1.1;
		}		
		if (Game.hasAura('Unholy Dominion')) {
			chainWrathRewardMax *= 1.1;
			chainFrenzyWrathRewardMax *= 1.1;
			chainCurWrath *= 1.1;
		}
		
		var chainReqFrag = document.createDocumentFragment();
		var chainReqSpan = document.createElement('span');
		chainReqSpan.style.fontWeight = 'bold';
		chainReqSpan.className = CM.Disp.colorTextPre + chainColor;
		chainReqSpan.textContent = Beautify(CM.Cache.Chain);
		chainReqFrag.appendChild(chainReqSpan);
		if (chainTime != '') {
			var chainReqSmall = document.createElement('small');
			chainReqSmall.textContent = ' (' + chainTime + ')';
			chainReqFrag.appendChild(chainReqSmall);
		}
		stats.appendChild(listing('\"Chain\" Cookies Required', chainReqFrag));
		var chainWrathReqFrag = document.createDocumentFragment();
		var chainWrathReqSpan = document.createElement('span');
		chainWrathReqSpan.style.fontWeight = 'bold';
		chainWrathReqSpan.className = CM.Disp.colorTextPre + chainWrathColor;
		chainWrathReqSpan.textContent = Beautify(CM.Cache.ChainWrath);
		chainWrathReqFrag.appendChild(chainWrathReqSpan);
		if (chainWrathTime != '') {
			var chainWrathReqSmall = document.createElement('small');
			chainWrathReqSmall.textContent = ' (' + chainWrathTime + ')';
			chainWrathReqFrag.appendChild(chainWrathReqSmall);
		}
		stats.appendChild(listing('\"Chain\" Cookies Required (Wrath)', chainWrathReqFrag));
		var chainReqFrenFrag = document.createDocumentFragment();
		var chainReqFrenSpan = document.createElement('span');
		chainReqFrenSpan.style.fontWeight = 'bold';
		chainReqFrenSpan.className = CM.Disp.colorTextPre + chainColorFrenzy;
		chainReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzy);
		chainReqFrenFrag.appendChild(chainReqFrenSpan);
		if (chainTimeFrenzy != '') {
			var chainReqFrenSmall = document.createElement('small');
			chainReqFrenSmall.textContent = ' (' + chainTimeFrenzy + ')';
			chainReqFrenFrag.appendChild(chainReqFrenSmall);
		}
		stats.appendChild(listing('\"Chain\" Cookies Required (Frenzy)', chainReqFrenFrag));
		var chainWrathReqFrenFrag = document.createDocumentFragment();
		var chainWrathReqFrenFrag = document.createDocumentFragment();
		var chainWrathReqFrenSpan = document.createElement('span');
		chainWrathReqFrenSpan.style.fontWeight = 'bold';
		chainWrathReqFrenSpan.className = CM.Disp.colorTextPre + chainWrathColorFrenzy;
		chainWrathReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzyWrath);
		chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSpan);
		if (chainWrathTimeFrenzy != '') {
			var chainWrathReqFrenSmall = document.createElement('small');
			chainWrathReqFrenSmall.textContent = ' (' + chainWrathTimeFrenzy + ')';
			chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSmall);
		}
		stats.appendChild(listing('\"Chain\" Cookies Required (Frenzy) (Wrath)', chainWrathReqFrenFrag));
		stats.appendChild(listing('\"Chain\" Reward (MAX) (Golden / Wrath)',  document.createTextNode(Beautify(chainRewardMax) + ' / ' + Beautify(chainWrathRewardMax))));
		stats.appendChild(listing('\"Chain\" Reward (MAX) (Frenzy) (Golden / Wrath)',  document.createTextNode(Beautify(chainFrenzyRewardMax) + ' / ' + Beautify(chainFrenzyWrathRewardMax))));
		stats.appendChild(listing('\"Chain\" Reward (CUR) (Golden / Wrath)',  document.createTextNode(Beautify(chainCur) + ' / ' + Beautify(chainCurWrath))));
	}
	
	stats.appendChild(header('Prestige', 'Prestige'));
	if (CM.Config.StatsPref.Prestige) {
		var possiblePres = Math.floor(Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset));
		var neededCook = Game.HowManyCookiesReset(possiblePres + 1) - (Game.cookiesEarned + Game.cookiesReset);

		stats.appendChild(listing('Prestige Level (CUR / MAX)',  document.createTextNode(Beautify(Game.prestige) + ' / ' + Beautify(possiblePres))));
		var cookiesNextFrag = document.createDocumentFragment();
		cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
		var cookiesNextSmall = document.createElement('small');
		cookiesNextSmall.textContent = ' (' + (CM.Disp.FormatTime(neededCook / (Game.cookiesPs * (1 - Game.cpsSucked)), 1)) + ')';
		cookiesNextFrag.appendChild(cookiesNextSmall);
		stats.appendChild(listing('Cookies To Next Level', cookiesNextFrag));
		var resetTitleFrag = document.createDocumentFragment();
		resetTitleFrag.appendChild(document.createTextNode('Reset Bonus Income '))
		var resetTitleSpan = document.createElement('span');
		resetTitleSpan.onmouseout = function() { Game.tooltip.hide(); };
		resetTitleSpan.onmouseover = function() {Game.tooltip.draw(this, escape(CM.Disp.ResetTooltipPlaceholder.innerHTML));};
		resetTitleSpan.style.cursor = 'default';
		resetTitleSpan.style.display = 'inline-block';
		resetTitleSpan.style.height = '10px';
		resetTitleSpan.style.width = '10px';
		resetTitleSpan.style.borderRadius = '5px';
		resetTitleSpan.style.textAlign = 'center';
		resetTitleSpan.style.backgroundColor = '#C0C0C0';
		resetTitleSpan.style.color = 'black';
		resetTitleSpan.style.fontSize = '9px';
		resetTitleSpan.style.verticalAlign = 'bottom';
		resetTitleSpan.textContent = '?';
		resetTitleFrag.appendChild(resetTitleSpan);
		var resetBonus = CM.Sim.ResetBonus();
		var resetFrag = document.createDocumentFragment();
		resetFrag.appendChild(document.createTextNode(Beautify(resetBonus)));
		var increase = Math.round(resetBonus / Game.cookiesPs * 10000);
		if (isFinite(increase) && increase != 0) {
			var resetSmall = document.createElement('small');
			resetSmall.textContent = ' (' + (increase / 100) + '% of income)';
			resetFrag.appendChild(resetSmall);
		}
		stats.appendChild(listing(resetTitleFrag, resetFrag));
	}
	
	var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg')); // Needs to be done for the checking below
	
	if (Game.cpsSucked > 0) {
		stats.appendChild(header('Wrinklers', 'Wrink'));
		if (CM.Config.StatsPref.Wrink || (CM.Config.StatsPref.Sea && choEgg)) {
			var totalSucked = 0; // Used in Chocolate Egg calculation below also
			for (var i in Game.wrinklers) {
				var sucked = Game.wrinklers[i].sucked;
				var toSuck = 1.1;
				if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
				if (Game.wrinklers[i].type==1) toSuck *= 3; // Shiny wrinklers
				sucked *= toSuck;
				if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
				totalSucked += sucked;
			}
			
			if (CM.Config.StatsPref.Wrink) {
				var popAllFrag = document.createDocumentFragment();
				popAllFrag.appendChild(document.createTextNode(Beautify(totalSucked) + ' '));
				var popAllA = document.createElement('a');
				popAllA.textContent = 'Pop All';
				popAllA.className = 'option';
				popAllA.onclick = function() {Game.CollectWrinklers();};
				popAllFrag.appendChild(popAllA);
				stats.appendChild(listing('Rewards of Popping',  popAllFrag));
			}
		}
	}
	
	var specDisp = false;
	var halloCook = [];
	for (var i in CM.Data.HalloCookies) {
		if (!Game.Has(CM.Data.HalloCookies[i])) {
			halloCook.push(CM.Data.HalloCookies[i]);
			specDisp = true;
		}
	}
	var christCook = [];
	for (var i in CM.Data.ChristCookies) {
		if (!Game.Has(CM.Data.ChristCookies[i])) {
			christCook.push(CM.Data.ChristCookies[i]);
			specDisp = true;
		}
	}
	var valCook = [];
	for (var i in CM.Data.ValCookies) {
		if (!Game.Has(CM.Data.ValCookies[i])) {
			valCook.push(CM.Data.ValCookies[i]);
			specDisp = true;
		}
	}
	var normEggs = [];
	for (var i in Game.eggDrops) {
		if (!Game.HasUnlocked(Game.eggDrops[i])) {
			normEggs.push(Game.eggDrops[i]);
			specDisp = true;
		}
	}
	var rareEggs = [];
	for (var i in Game.rareEggDrops) {
		if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
			rareEggs.push(Game.rareEggDrops[i]);
			specDisp = true;
		}
	}
	
	if (Game.season == 'christmas' || specDisp || choEgg) {
		stats.appendChild(header('Season Specials', 'Sea'));
		if (CM.Config.StatsPref.Sea) {
			if (specDisp) {
				var createSpecDisp = function(theSpecDisp) {
					var frag = document.createDocumentFragment();
					frag.appendChild(document.createTextNode(theSpecDisp.length + ' '));
					var span = document.createElement('span');
					span.onmouseout = function() { Game.tooltip.hide(); };
					var placeholder = document.createElement('div');
					var missing = document.createElement('div');
					missing.style.minWidth = '140px';
					missing.style.marginBottom = '4px';
					var title = document.createElement('div');
					title.className = 'name';
					title.style.marginBottom = '4px';
					title.style.textAlign = 'center';
					title.textContent = 'Missing';
					missing.appendChild(title);
					for (var i in theSpecDisp) {
						var div = document.createElement('div');
						div.style.textAlign = 'center';
						div.appendChild(document.createTextNode(theSpecDisp[i]));
						missing.appendChild(div);
					}
					placeholder.appendChild(missing);
					span.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML));};
					span.style.cursor = 'default';
					span.style.display = 'inline-block';
					span.style.height = '10px';
					span.style.width = '10px';
					span.style.borderRadius = '5px';
					span.style.textAlign = 'center';
					span.style.backgroundColor = '#C0C0C0';
					span.style.color = 'black';
					span.style.fontSize = '9px';
					span.style.verticalAlign = 'bottom';
					span.textContent = '?';
					frag.appendChild(span);
					return frag;
				}
				if (halloCook.length != 0) stats.appendChild(listing('Halloween Cookies Left to Buy', createSpecDisp(halloCook)));
				if (christCook.length != 0) stats.appendChild(listing('Christmas Cookies Left to Buy',  createSpecDisp(christCook)));
				if (valCook.length != 0) stats.appendChild(listing('Valentine Cookies Left to Buy',  createSpecDisp(valCook)));
				if (normEggs.length != 0) stats.appendChild(listing('Normal Easter Eggs Left to Unlock',  createSpecDisp(normEggs)));
				if (rareEggs.length != 0) stats.appendChild(listing('Rare Easter Eggs Left to Unlock',  createSpecDisp(rareEggs)));
			}

			if (Game.season == 'christmas') stats.appendChild(listing('Reindeer Reward',  document.createTextNode(Beautify(CM.Cache.SeaSpec))));
			if (choEgg) {
				var choEggTitleFrag = document.createDocumentFragment();
				choEggTitleFrag.appendChild(document.createTextNode('Chocolate Egg Cookies '))
				var choEggTitleSpan = document.createElement('span');
				choEggTitleSpan.onmouseout = function() { Game.tooltip.hide(); };
				choEggTitleSpan.onmouseover = function() {Game.tooltip.draw(this, escape(CM.Disp.ChoEggTooltipPlaceholder.innerHTML));};
				choEggTitleSpan.style.cursor = 'default';
				choEggTitleSpan.style.display = 'inline-block';
				choEggTitleSpan.style.height = '10px';
				choEggTitleSpan.style.width = '10px';
				choEggTitleSpan.style.borderRadius = '5px';
				choEggTitleSpan.style.textAlign = 'center';
				choEggTitleSpan.style.backgroundColor = '#C0C0C0';
				choEggTitleSpan.style.color = 'black';
				choEggTitleSpan.style.fontSize = '9px';
				choEggTitleSpan.style.verticalAlign = 'bottom';
				choEggTitleSpan.textContent = '?';
				choEggTitleFrag.appendChild(choEggTitleSpan);
				var choEggTotal = Game.cookies + CM.Cache.SellForChoEgg;
				if (Game.cpsSucked > 0) {
					choEggTotal += totalSucked;
				}
				choEggTotal *= 0.05;
				stats.appendChild(listing(choEggTitleFrag, document.createTextNode(Beautify(choEggTotal))));
			}			
		}
	}
	
	stats.appendChild(header('Miscellaneous', 'Misc'));
	if (CM.Config.StatsPref.Misc) {
		stats.appendChild(listing('Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);
}

CM.Disp.AddMenu = function() {
	var title = function() {
		var div = document.createElement('div');
		div.className = 'title ' + CM.Disp.colorTextPre + CM.Disp.colorBlue;
		div.textContent = 'Cookie Monster Goodies';
		return div;
	}
	
	if (Game.onMenu == 'prefs') {
		CM.Disp.AddMenuPref(title);
	}
	else if (CM.Config.Stats == 1 && Game.onMenu == 'stats') {
		CM.Disp.AddMenuStats(title);
	}
}

CM.Disp.RefreshMenu = function() {
	if (CM.Config.UpStats && Game.onMenu == 'stats' && Game.drawT % (Game.fps * 5) != 0 && Game.drawT % Game.fps == 0) Game.UpdateMenu();
}

CM.Disp.UpdateTooltipLocation = function() {
	if (Game.tooltip.origin == 'store') {
		var warnCautOffset = 0;
		if (CM.Config.ToolWarnCaut == 1 && CM.Config.ToolWarnCautPos == 1) warnCautOffset = CM.Disp.TooltipWarnCaut.clientHeight - 4;
		Game.tooltip.tta.style.top = Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnCautOffset - 46) + 'px';
	}
	// Kept for future possible use if the code changes again
	/*else if (!Game.onCrate && !Game.OnAscend && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	}*/
}

CM.Disp.CreateTooltipWarnCaut = function() {
	CM.Disp.TooltipWarnCaut = document.createElement('div');
	CM.Disp.TooltipWarnCaut.style.position = 'absolute';
	CM.Disp.TooltipWarnCaut.style.display = 'none';
	CM.Disp.TooltipWarnCaut.style.left = 'auto';
	CM.Disp.TooltipWarnCaut.style.bottom = 'auto';
	
	var create = function(boxId, color, labelTextFront, labelTextBack, deficitId) {
		var box = document.createElement('div');
		box.id = boxId;
		box.style.display = 'none';
		box.style.WebkitTransition = 'opacity 0.1s ease-out';
		box.style.MozTransition = 'opacity 0.1s ease-out';
		box.style.MsTransition = 'opacity 0.1s ease-out';
		box.style.OTransition = 'opacity 0.1s ease-out';
		box.style.transition = 'opacity 0.1s ease-out';
		box.className = CM.Disp.colorBorderPre + color;
		box.style.padding = '2px';
		box.style.background = '#000 url(img/darkNoise.png)';
		var labelDiv = document.createElement('div');
		box.appendChild(labelDiv);
		var labelSpan = document.createElement('span');
		labelSpan.className = CM.Disp.colorTextPre + color;
		labelSpan.style.fontWeight = 'bold';
		labelSpan.textContent = labelTextFront;
		labelDiv.appendChild(labelSpan);
		labelDiv.appendChild(document.createTextNode(labelTextBack));
		var deficitDiv = document.createElement('div');
		box.appendChild(deficitDiv);
		var deficitSpan = document.createElement('span');
		deficitSpan.id = deficitId;
		deficitDiv.appendChild(document.createTextNode('Deficit: '));
		deficitDiv.appendChild(deficitSpan);
		return box;
	}
	CM.Disp.TooltipWarnCaut.appendChild(create('CMDispTooltipWarn', CM.Disp.colorRed, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!"', 'CMDispTooltipWarnText'));
	CM.Disp.TooltipWarnCaut.firstChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarnCaut.appendChild(create('CMDispTooltipCaut', CM.Disp.colorYellow, 'Caution: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)', 'CMDispTooltipCautText'));

	l('tooltipAnchor').appendChild(CM.Disp.TooltipWarnCaut);
}

CM.Disp.ToggleToolWarnCaut = function() {
	if (CM.Config.ToolWarnCaut == 1) {
		CM.Disp.TooltipWarnCaut.style.display = 'block';
	}
	else {
		CM.Disp.TooltipWarnCaut.style.display = 'none';
	}
}

CM.Disp.ToggleToolWarnCautPos = function() {
	if (CM.Config.ToolWarnCautPos == 0) {
		CM.Disp.TooltipWarnCaut.style.top = 'auto';
		CM.Disp.TooltipWarnCaut.style.margin = '4px -4px';
		CM.Disp.TooltipWarnCaut.style.padding = '3px 4px';
	}
	else {
		CM.Disp.TooltipWarnCaut.style.right = 'auto';
		CM.Disp.TooltipWarnCaut.style.margin = '4px';
		CM.Disp.TooltipWarnCaut.style.padding = '4px 3px';
	}
}

CM.Disp.AddTooltipBuild = function() {
	CM.Disp.TooltipBuildBack = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			CM.Disp.TooltipBuildBack[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'b\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}');
		}
	}
}

CM.Disp.AddTooltipUpgrade = function() {
	CM.Disp.TooltipUpgradeBack = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			CM.Disp.TooltipUpgradeBack[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() {if (!Game.mouseDown) {Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'u\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}}');
		}
	}
}

CM.Disp.Tooltip = function(type, name) {
	if (type == 'b') {
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		if (CM.Config.TooltipAmor == 1) {
			var buildPrice = CM.Sim.BuildingGetPrice(Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			var amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split('so far</div>').join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) == 1 ? 'cookie' : 'cookies') + ' left to amortize (' + CM.Disp.GetTimeColor(buildPrice, Game.Objects[name].totalCookies, (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');		
			}
		}
		if (Game.buyMode == 1) {
			var target = '';
			var change = false;
			if (Game.buyBulk == 10) {
				target = 'Objects10';
				change = true;
			}
			else if (Game.buyBulk == 100) {
				target = 'Objects100';
				change = true;
			}
			if (change) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join(Beautify(CM.Cache[target][name].price));
			}
		}
		else if (Game.buyMode == -1) {
			if (Game.buyBulk == -1) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(CM.Sim.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.Objects[name].amount, 0)));
			}
			else {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(CM.Sim.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 0)));
			}
		}
	}
	else { // Upgrades
		if (!Game.UpgradesInStore[name]) return '';
		l('tooltip').innerHTML = Game.crate(Game.UpgradesInStore[name], 'store', undefined, undefined, 1)();
	}
	
	var area = document.createElement('div');
	area.id = 'CMTooltipArea';
	l('tooltip').appendChild(area);
	
	if (CM.Config.Tooltip == 1 && (type != 'b' || Game.buyMode == 1)) {
		l('tooltip').firstChild.style.paddingBottom = '4px';
		var tooltip = document.createElement('div');
		tooltip.style.border = '1px solid';
		tooltip.style.padding = '4px';
		tooltip.style.margin = '0px -4px';
		tooltip.id = 'CMTooltipBorder';
		
		var header = function(text) {
			var div = document.createElement('div');
			div.style.fontWeight = 'bold';
			div.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
			div.textContent = text;
			return div;
		}
		tooltip.appendChild(header('Bonus Income'));
		var income = document.createElement('div');
		income.style.marginBottom = '4px';
		income.style.color = 'white';
		income.id = 'CMTooltipIncome';
		tooltip.appendChild(income);
		tooltip.appendChild(header('Return On Investment'));
		var roi = document.createElement('div');
		roi.style.marginBottom = '4px';
		roi.id = 'CMTooltipROI';
		tooltip.appendChild(roi);
		tooltip.appendChild(header('Time Left'));
		var time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltip.appendChild(time);
		
		l('tooltip').appendChild(tooltip);
	}
	
	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	CM.Disp.UpdateTooltip();
	
	return l('tooltip').innerHTML;
}

CM.Disp.UpdateTooltip = function() {
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		var price;
		var bonus;
		if (CM.Disp.tooltipType == 'b') {
			var target = '';
			if (Game.buyMode == 1 && Game.buyBulk == 10) {
				target = 'Objects10';
				price = CM.Cache[target][CM.Disp.tooltipName].price;
			}
			else if (Game.buyMode == 1 && Game.buyBulk == 100) {
				target = 'Objects100';
				price = CM.Cache[target][CM.Disp.tooltipName].price;
			}
			else {
				target = 'Objects';
				price = Game.Objects[CM.Disp.tooltipName].getPrice();
			}
			bonus = CM.Cache[target][CM.Disp.tooltipName].bonus;
			if (CM.Config.Tooltip == 1 && Game.buyMode == 1) {
				l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
				l('CMTooltipROI').textContent = Beautify(CM.Cache[target][CM.Disp.tooltipName].roi, 2);
				l('CMTooltipROI').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			}
		}
		else { // Upgrades
			bonus = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
			price = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();
			if (CM.Config.Tooltip == 1) {
				l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
				l('CMTooltipROI').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].roi, 2);
				l('CMTooltipROI').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
			}
		}
		if (CM.Config.Tooltip == 1 && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
			l('CMTooltipIncome').textContent = Beautify(bonus, 2);
			
			var increase = Math.round(bonus / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
			}
		
			var timeColor = CM.Disp.GetTimeColor(price, Game.cookies, (Game.cookiesPs * (1 - Game.cpsSucked)));
			l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
		}
		
		if (CM.Config.ToolWarnCaut == 1) {
			var warn = CM.Cache.Lucky;
			if (CM.Config.ToolWarnCautBon == 1) {
				var bonusNoFren = bonus;
				if (Game.frenzy > 0) {
					bonusNoFren /= Game.frenzyPower;
				}
				warn += ((bonusNoFren * 60 * 15) / 0.15);
			}
			var caut = warn * 7;
			var amount = Game.cookies - price;
			if ((amount < warn || amount < caut) && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
				if (CM.Config.ToolWarnCautPos == 0) {
					CM.Disp.TooltipWarnCaut.style.right = '0px';
				}
				else {
					CM.Disp.TooltipWarnCaut.style.top = (l('tooltip').offsetHeight) + 'px';
				}
				CM.Disp.TooltipWarnCaut.style.width = (l('tooltip').offsetWidth - 6) + 'px';
			
				if (amount < warn) {
					l('CMDispTooltipWarn').style.display = '';
					l('CMDispTooltipWarnText').textContent = Beautify(warn - amount) + ' (' + CM.Disp.FormatTime((warn - amount) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')';
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + CM.Disp.FormatTime((caut - amount) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')';
				}
				else if (amount < caut) {
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + CM.Disp.FormatTime((caut - amount) / (Game.cookiesPs * (1 - Game.cpsSucked))) + ')';
					l('CMDispTooltipWarn').style.display = 'none';
				}
				else {
					l('CMDispTooltipWarn').style.display = 'none';
					l('CMDispTooltipCaut').style.display = 'none';
				}
			}
			else {
				l('CMDispTooltipWarn').style.display = 'none';
				l('CMDispTooltipCaut').style.display = 'none';
			}
		}
	}
}

CM.Disp.DrawTooltipWarnCaut = function() {
	if (CM.Config.ToolWarnCaut == 1) {
		l('CMDispTooltipWarn').style.opacity = '0';
		l('CMDispTooltipCaut').style.opacity = '0';
	}
}

CM.Disp.UpdateTooltipWarnCaut = function() {
	if (CM.Config.ToolWarnCaut == 1 && l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		l('CMDispTooltipWarn').style.opacity = '1';
		l('CMDispTooltipCaut').style.opacity = '1';
	}
}

CM.Disp.AddWrinklerAreaDetect = function() {
	l('backgroundLeftCanvas').onmouseover = function() {CM.Disp.TooltipWrinklerArea = 1;};
	l('backgroundLeftCanvas').onmouseout = function() {
		CM.Disp.TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (var i = 0; i < 10; i++) {
			CM.Disp.TooltipWrinklerCache[i] = 0;
		}
	};
}

CM.Disp.CheckWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && CM.Disp.TooltipWrinklerArea == 1) {
		var showingTooltip = false;
		var mouseInWrinkler = function (x, y, rect) {
			var dx = x + Math.sin(-rect.r) * (-(rect.h / 2 - rect.o)), dy = y + Math.cos(-rect.r) * (-(rect.h / 2 - rect.o));
			var h1 = Math.sqrt(dx * dx + dy * dy);
			var currA = Math.atan2(dy, dx);
			var newA = currA - rect.r;
			var x2 = Math.cos(newA) * h1;
			var y2 = Math.sin(newA) * h1;
			if (x2 > -0.5 * rect.w && x2 < 0.5 * rect.w && y2 > -0.5 * rect.h && y2 < 0.5 * rect.h) return true;
			return false;
		}
		for (var i in Game.wrinklers) {
			var me = Game.wrinklers[i];
			var rect = {w: 100, h: 200, r: (-me.r) * Math.PI / 180, o: 10};
			if (me.phase > 0 && Game.LeftBackground && Game.mouseX < Game.LeftBackground.canvas.width && mouseInWrinkler(Game.mouseX - me.x, Game.mouseY - me.y, rect)) {
				showingTooltip = true;
				if (CM.Disp.TooltipWrinklerCache[i] == 0) {
					var placeholder = document.createElement('div');
					var wrinkler = document.createElement('div');
					wrinkler.style.minWidth = '120px';
					wrinkler.style.marginBottom = '4px';
					var div = document.createElement('div');
					div.style.textAlign = 'center';
					div.id = 'CMTooltipWrinkler';
					wrinkler.appendChild(div);
					placeholder.appendChild(wrinkler);
					Game.tooltip.draw(this, escape(placeholder.innerHTML));
					CM.Disp.TooltipWrinkler = i;
					CM.Disp.TooltipWrinklerCache[i] = 1;
				}
				else break;
			}
			else {
				CM.Disp.TooltipWrinklerCache[i] = 0;
			}
		}
		if (!showingTooltip) {
			Game.tooltip.hide();
		}
	}
}

CM.Disp.UpdateWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && l('CMTooltipWrinkler') != null) {
		var sucked = Game.wrinklers[CM.Disp.TooltipWrinkler].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[CM.Disp.TooltipWrinkler].type == 1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
	}
}

CM.Disp.UpdateAscendState = function() {
	if (Game.OnAscend) {
		l('game').style.bottom = '0px';
		if (CM.Config.BotBar == 1) CM.Disp.BotBar.style.display = 'none';
		if (CM.Config.TimerBar == 1) CM.Disp.TimerBar.style.display = 'none';
	}
	else {
		CM.Disp.ToggleBotBar();
		CM.Disp.ToggleTimerBar();
	}

	CM.Disp.UpdateBackground();
}

CM.Disp.ToggleSayTime = function() {
	if (CM.Config.SayTime == 1) {
		Game.sayTime = CM.Disp.sayTime;
	}
	else {
		Game.sayTime = CM.Backup.sayTime;
	}
}

CM.Disp.RefreshScale = function() {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	CM.Disp.UpdateBotBarOther();
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();
}

CM.Disp.colorTextPre = 'CMText';
CM.Disp.colorBackPre = 'CMBack';
CM.Disp.colorBorderPre = 'CMBorder';
CM.Disp.colorBlue = 'Blue';
CM.Disp.colorGreen = 'Green';
CM.Disp.colorYellow = 'Yellow';
CM.Disp.colorOrange = 'Orange';
CM.Disp.colorRed = 'Red';
CM.Disp.colorPurple = 'Purple';
CM.Disp.colorGray = 'Gray';
CM.Disp.colorPink = 'Pink';
CM.Disp.colorBrown = 'Brown';
CM.Disp.colors = [CM.Disp.colorBlue, CM.Disp.colorGreen, CM.Disp.colorYellow, CM.Disp.colorOrange, CM.Disp.colorRed, CM.Disp.colorPurple, CM.Disp.colorGray, CM.Disp.colorPink, CM.Disp.colorBrown];
CM.Disp.lastGoldenCookieState = 'none';
CM.Disp.lastAscendState = -1;

CM.Disp.metric = ['M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
CM.Disp.shortScale = ['M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec'];

CM.Disp.TooltipBuy10 = false;

CM.Disp.TooltipWrinklerArea = 0;
CM.Disp.TooltipWrinkler = -1;
CM.Disp.TooltipWrinklerCache = [];
for (var i = 0; i < 10; i++) {
	CM.Disp.TooltipWrinklerCache[i] = 0;
}

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
}

CM.Loop = function() {
	if (CM.Disp.lastAscendState != Game.OnAscend) {
		CM.Disp.lastAscendState = Game.OnAscend;
		CM.Disp.UpdateAscendState();
	}
	if (!Game.OnAscend && Game.AscendTimer == 0) {
		if (CM.Sim.DoSims) {		
			CM.Cache.RemakeIncome();
			CM.Cache.RemakeLucky();
			CM.Cache.RemakeChain();
			CM.Cache.RemakeSeaSpec();
			CM.Cache.RemakeSellForChoEgg();
		
			CM.Sim.DoSims = 0;
		}
		
		// Calculate ROI
		CM.Cache.RemakeROI();

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

		// Update Title
		CM.Disp.UpdateTitle();

		// Change menu refresh interval
		CM.Disp.RefreshMenu();
	}
	
	// Check Golden Cookies
	CM.Disp.CheckGoldenCookie();
}

CM.Init = function() {
	var proceed = true;
	if (Game.version != CM.VersionMajor) {
		proceed = confirm('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' is meant for Game version ' + CM.VersionMajor + '.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?');
	}
	if (proceed) {
		CM.Disp.AddJscolor();
		
		var delay = setInterval(function() {
			if (typeof jscolor !== 'undefined') {
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
	CM.Disp.CreateResetTooltip();
	CM.Disp.CreateChoEggTooltip();
	CM.Disp.CreateTooltipWarnCaut();
	CM.Disp.AddTooltipBuild();
	CM.Disp.AddWrinklerAreaDetect();
	CM.ReplaceNative();
	Game.CalculateGains();
	CM.LoadConfig(); // Must be after all things are created!
	CM.Disp.lastAscendState = Game.OnAscend;
	CM.Disp.lastBuyMode = Game.buyMode;
	CM.Disp.lastBuyBulk = Game.buyBulk;

	if (Game.prefs.popups) Game.Popup('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!');
	else Game.Notify('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!', '', '', 1, 1);

	Game.Win('Third-party');
}

CM.ConfigDefault = {BotBar: 1, TimerBar: 1, TimerBarPos: 0, BuildColor: 1, BulkBuildColor: 0, UpBarColor: 1, Flash: 1, Sound: 1,  Volume: 100, GCSoundURL: 'http://freesound.org/data/previews/66/66717_931655-lq.mp3', SeaSoundURL: 'http://www.freesound.org/data/previews/121/121099_2193266-lq.mp3', GCTimer: 1, Title: 1, Favicon: 1, Tooltip: 1, TooltipAmor: 0, ToolWarnCaut: 1, ToolWarnCautPos: 1, ToolWarnCautBon: 0, ToolWrink: 1, Stats: 1, UpStats: 1, SayTime: 1, Scale: 2, StatsPref: {Lucky: 1, Chain: 1, Prestige: 1, Wrink: 1, Sea: 1, Misc: 1}, Colors : {Blue: '#4bb8f0', Green: '#00ff00', Yellow: '#ffff00', Orange: '#ff7f00', Red: '#ff0000', Purple: '#ff00ff', Gray: '#b3b3b3', Pink: '#ff1493', Brown: '#8b4513'}};
CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '2';
CM.VersionMinor = '4';

/*******
 * Sim *
 *******/

CM.Sim.BuildingGetPrice = function(basePrice, start, free, increase) {
	/*var price=0;
	for (var i = Math.max(0 , start); i < Math.max(0, start + increase); i++) {
		price += basePrice * Math.pow(Game.priceIncrease, Math.max(0, i - free));
	}
	if (Game.Has('Season savings')) price *= 0.99;
	if (Game.Has('Santa\'s dominion')) price *= 0.99;
	if (Game.Has('Faberge egg')) price *= 0.99;
	if (Game.Has('Divine discount')) price *= 0.99;
	if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
	return Math.ceil(price);*/

	var moni = 0;
	for (var i = 0; i < increase; i++) {
		var price = basePrice * Math.pow(Game.priceIncrease, Math.max(0, start - free));
		if (Game.Has('Season savings')) price *= 0.99;
		if (Game.Has('Santa\'s dominion')) price *= 0.99;
		if (Game.Has('Faberge egg')) price *= 0.99;
		if (Game.Has('Divine discount')) price *= 0.99;
		if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
		price = Math.ceil(price);
		moni+=price;
		start++;
	}
	return moni;
}

CM.Sim.BuildingSell = function(basePrice, start, free, amount, emuAura) {
	/*var price=0;
	for (var i = Math.max(0, start - amount); i < Math.max(0, start); i++) {
		price += basePrice * Math.pow(Game.priceIncrease, Math.max(0, i - free));
	}
	if (Game.Has('Season savings')) price*=0.99;
	if (Game.Has('Santa\'s dominion')) price*=0.99;
	if (Game.Has('Faberge egg')) price*=0.99;
	if (Game.Has('Divine discount')) price*=0.99;
	if (Game.hasAura('Fierce Hoarder')) price*=0.98;
	if (Game.hasAura('Earth Shatterer') || emuAura) {
		price *= 0.85;
	}
	else {
		price *= 0.5;
	}
	return Math.ceil(price);*/

	var moni=0;
	for (var i = 0; i < amount; i++) {
		var price = basePrice * Math.pow(Game.priceIncrease, Math.max(0, start - free));
		if (Game.Has('Season savings')) price *= 0.99;
		if (Game.Has('Santa\'s dominion')) price *= 0.99;
		if (Game.Has('Faberge egg')) price *= 0.99;
		if (Game.Has('Divine discount')) price *= 0.99;
		if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
		price = Math.ceil(price);
		var giveBack = 0.5;
		if (Game.hasAura('Earth Shatterer') || emuAura) giveBack=0.85;
		price = Math.floor(price * giveBack);
		if (start > 0) {
			moni += price;
			start--;
		}
	}
	return moni;
}

CM.Sim.Has = function(what) {
	if (Game.ascensionMode == 1 && Game.Upgrades[what].pool == 'prestige') return 0;
	return (CM.Sim.Upgrades[what] ? CM.Sim.Upgrades[what].bought : 0);
}


CM.Sim.Win = function(what) {
	if (CM.Sim.Achievements[what]) {
		if (CM.Sim.Achievements[what].won == 0) {
			CM.Sim.Achievements[what].won = 1;
			if (Game.Achievements[what].pool != 'shadow') CM.Sim.AchievementsOwned++;
		}
	}
}

eval('CM.Sim.HasAchiev = ' + Game.HasAchiev.toString().split('Game').join('CM.Sim'));

eval('CM.Sim.GetHeavenlyMultiplier = ' + Game.GetHeavenlyMultiplier.toString().split('Game').join('CM.Sim'));

CM.Sim.hasAura = function(what) {
	if (Game.dragonAuras[CM.Sim.dragonAura].name == what || Game.dragonAuras[CM.Sim.dragonAura2].name == what) 
		return true; 
	else
		return false;
}

eval('CM.Sim.GetTieredCpsMult = ' + Game.GetTieredCpsMult.toString().split('Game.Has').join('CM.Sim.Has').split('me.tieredUpgrades').join('Game.Objects[me.name].tieredUpgrades').split('me.synergies').join('Game.Objects[me.name].synergies').split('syn.buildingTie1.amount').join('CM.Sim.Objects[syn.buildingTie1.name].amount').split('syn.buildingTie2.amount').join('CM.Sim.Objects[syn.buildingTie2.name].amount'));

eval('CM.Sim.getGrandmaSynergyUpgradeMultiplier = ' + Game.getGrandmaSynergyUpgradeMultiplier.toString().split('Game.Objects[\'Grandma\']').join('CM.Sim.Objects[\'Grandma\']'));

CM.Sim.InitData = function() {
	// Buildings
	CM.Sim.Objects = [];
	for (var i in Game.Objects) {
		CM.Sim.Objects[i] = {};
		var me = Game.Objects[i];
		var you = CM.Sim.Objects[i];
		eval('you.cps = ' + me.cps.toString().split('Game.Has').join('CM.Sim.Has').split('Game.hasAura').join('CM.Sim.hasAura').split('Game.Objects').join('CM.Sim.Objects').split('Game.GetTieredCpsMult').join('CM.Sim.GetTieredCpsMult').split('Game.getGrandmaSynergyUpgradeMultiplier').join('CM.Sim.getGrandmaSynergyUpgradeMultiplier'));
		// Below is needed for above eval!
		you.baseCps = me.baseCps;
		you.name = me.name;
	}

	// Upgrades
	CM.Sim.Upgrades = [];
	for (var i in Game.Upgrades) {
		CM.Sim.Upgrades[i] = {};
	}

	// Achievements
	CM.Sim.Achievements = [];
	for (var i in Game.Achievements) {
		CM.Sim.Achievements[i] = {};
	}
}

CM.Sim.CopyData = function() {
	// Other variables
	CM.Sim.UpgradesOwned = Game.UpgradesOwned;
	CM.Sim.pledges = Game.pledges;
	CM.Sim.AchievementsOwned = Game.AchievementsOwned;
	CM.Sim.heavenlyPower = Game.heavenlyPower;
	CM.Sim.prestige = Game.prestige;
	CM.Sim.dragonAura = Game.dragonAura;
	CM.Sim.dragonAura2 = Game.dragonAura2;
	
	// Buildings
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		var you = CM.Sim.Objects[i];
		you.amount = me.amount;
	}

	// Upgrades
	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		var you = CM.Sim.Upgrades[i];
		you.bought = me.bought;
	}

	// Achievements
	for (var i in Game.Achievements) {
		var me = Game.Achievements[i];
		var you = CM.Sim.Achievements[i];
		you.won = me.won;
	}
};


CM.Sim.CalculateGains = function() {
	CM.Sim.cookiesPs = 0;
	var mult = 1;

	if (Game.ascensionMode != 1) mult += parseFloat(CM.Sim.prestige) * 0.01 * CM.Sim.heavenlyPower * CM.Sim.GetHeavenlyMultiplier();

	var cookieMult = 0;
	for (var i in CM.Sim.Upgrades) {
		var me = CM.Sim.Upgrades[i];
		if (me.bought > 0) {
			if (Game.Upgrades[i].pool == 'cookie' && CM.Sim.Has(Game.Upgrades[i].name)) mult *= (1 + (typeof(Game.Upgrades[i].power) == 'function' ? Game.Upgrades[i].power(Game.Upgrades[i]) : Game.Upgrades[i].power) * 0.01);
		}
	}

	mult *= (1 + 0.01 * cookieMult);
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

	if (CM.Sim.Has('Santa\'s legacy')) mult *= 1 + (Game.santaLevel + 1) * 0.03;

	for (var i in CM.Sim.Objects) {
		var me = CM.Sim.Objects[i];
		CM.Sim.cookiesPs += me.amount * (typeof(me.cps) == 'function' ? me.cps(me) : me.cps);
	}

	if (CM.Sim.Has('"egg"')) CM.Sim.cookiesPs += 9; // "egg"

	var milkMult=1;
	if (CM.Sim.Has('Santa\'s milk and cookies')) milkMult *= 1.05;
	if (CM.Sim.hasAura('Breath of Milk')) milkMult *= 1.05;
	if (CM.Sim.Has('Kitten helpers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.1 * milkMult);
	if (CM.Sim.Has('Kitten workers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.125 * milkMult);
	if (CM.Sim.Has('Kitten engineers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.15 * milkMult);
	if (CM.Sim.Has('Kitten overseers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.175 * milkMult);
	if (CM.Sim.Has('Kitten managers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten accountants')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten specialists')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten experts')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten angels')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.1 * milkMult);

	var eggMult = 0;
	if (CM.Sim.Has('Chicken egg')) eggMult++;
	if (CM.Sim.Has('Duck egg')) eggMult++;
	if (CM.Sim.Has('Turkey egg')) eggMult++;
	if (CM.Sim.Has('Quail egg')) eggMult++;
	if (CM.Sim.Has('Robin egg')) eggMult++;
	if (CM.Sim.Has('Ostrich egg')) eggMult++;
	if (CM.Sim.Has('Cassowary egg')) eggMult++;
	if (CM.Sim.Has('Salmon roe')) eggMult++;
	if (CM.Sim.Has('Frogspawn')) eggMult++;
	if (CM.Sim.Has('Shark egg')) eggMult++;
	if (CM.Sim.Has('Turtle egg')) eggMult++;
	if (CM.Sim.Has('Ant larva')) eggMult++;
	if (CM.Sim.Has('Century egg')) {
		// The boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day = Math.floor((CM.Sim.Date - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day,100);
		eggMult += (1 - Math.pow(1 - day / 100, 3)) * 10;
	}
	mult *= (1 + 0.01 * eggMult);
	
	if (CM.Sim.hasAura('Radiant Appetite')) mult *= 2;
	
	var rawCookiesPs = CM.Sim.cookiesPs * mult;
	for (var i in Game.CpsAchievements) {
		if (rawCookiesPs >= Game.CpsAchievements[i].threshold) CM.Sim.Win(Game.CpsAchievements[i].name);
	}

	if (Game.frenzy > 0) mult *= Game.frenzyPower;
	
	// Pointless?
	name = Game.bakeryName.toLowerCase();
	if (name == 'orteil') mult *= 0.99;
	else if (name == 'ortiel') mult *= 0.98; //or so help me

	if (CM.Sim.Has('Elder Covenant')) mult *= 0.95;

	if (CM.Sim.Has('Golden switch [off]')) {
		var goldenSwitchMult = 1.5;
		if (CM.Sim.Has('Residual luck')) {
			var upgrades = ['Get lucky', 'Lucky day', 'Serendipity', 'Heavenly luck', 'Lasting fortune', 'Decisive fate'];
			for (var i in upgrades) {
				if (CM.Sim.Has(upgrades[i])) goldenSwitchMult += 0.1;
			}
		}
		mult *= goldenSwitchMult;
	}

	CM.Sim.cookiesPs *= mult;			
};

CM.Sim.CheckOtherAchiev = function() {
	var grandmas=0;
	if (CM.Sim.Has('Farmer grandmas')) grandmas++;
	if (CM.Sim.Has('Worker grandmas')) grandmas++;
	if (CM.Sim.Has('Miner grandmas')) grandmas++;
	if (CM.Sim.Has('Cosmic grandmas')) grandmas++;
	if (CM.Sim.Has('Transmuted grandmas')) grandmas++;
	if (CM.Sim.Has('Altered grandmas')) grandmas++;
	if (CM.Sim.Has('Grandmas\' grandmas')) grandmas++;
	if (CM.Sim.Has('Antigrandmas')) grandmas++;
	if (CM.Sim.Has('Rainbow grandmas')) grandmas++;
	if (CM.Sim.Has('Banker grandmas')) grandmas++;
	if (CM.Sim.Has('Priestess grandmas')) grandmas++;
	if (CM.Sim.Has('Witch grandmas')) grandmas++;
	if (!CM.Sim.HasAchiev('Elder') && grandmas >= 7) CM.Sim.Win('Elder');

	var buildingsOwned = 0;
	var mathematician = 1;
	var base10 = 1;
	var minAmount = 100000;
	for (var i in CM.Sim.Objects) {
		buildingsOwned += CM.Sim.Objects[i].amount;
		minAmount = Math.min(CM.Sim.Objects[i].amount, minAmount);
		if (!CM.Sim.HasAchiev('Mathematician')) {
			if (CM.Sim.Objects[i].amount < Math.min(128, Math.pow(2, (Game.ObjectsById.length - Game.Objects[i].id) - 1))) mathematician = 0;
		}
		if (!CM.Sim.HasAchiev('Base 10')) {
			if (CM.Sim.Objects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id) * 10) base10 = 0;
		}
	}
	if (minAmount >= 1) CM.Sim.Win('One with everything');
	if (mathematician == 1) CM.Sim.Win('Mathematician');
	if (base10 == 1) CM.Sim.Win('Base 10');
	if (minAmount >= 100) CM.Sim.Win('Centennial');
	if (minAmount >= 150) CM.Sim.Win('Centennial and a half');
	if (minAmount >= 200) CM.Sim.Win('Bicentennial');
	if (minAmount >= 250) CM.Sim.Win('Bicentennial and a half');

	if (buildingsOwned >= 100) CM.Sim.Win('Builder');
	if (buildingsOwned >= 500) CM.Sim.Win('Architect');
	if (buildingsOwned >= 1000) CM.Sim.Win('Engineer');
	if (buildingsOwned >= 1500) CM.Sim.Win('Lord of Constructs');
	
	if (CM.Sim.UpgradesOwned >= 20) CM.Sim.Win('Enhancer');
	if (CM.Sim.UpgradesOwned >= 50) CM.Sim.Win('Augmenter');
	if (CM.Sim.UpgradesOwned >= 100) CM.Sim.Win('Upgrader');
	if (CM.Sim.UpgradesOwned >= 200) CM.Sim.Win('Lord of Progress');
	
	if (buildingsOwned >= 3000 && CM.Sim.UpgradesOwned >= 300) CM.Sim.Win('Polymath');
	
	if (CM.Sim.Objects['Cursor'].amount + CM.Sim.Objects['Grandma'].amount >= 777) CM.Sim.Win('The elder scrolls');
	
	var hasAllHalloCook = true;
	for (var i in CM.Data.HalloCookies) {
		if (!CM.Sim.Has(CM.Data.HalloCookies[i])) hasAllHalloCook = false;
	}
	if (hasAllHalloCook) CM.Sim.Win('Spooky cookies');

	var hasAllChristCook = true;
	for (var i in CM.Data.ChristCookies) {
		if (!CM.Sim.Has(CM.Data.ChristCookies[i])) hasAllChristCook = false;
	}
	if (hasAllChristCook) CM.Sim.Win('Let it snow');
}

CM.Sim.BuyBuildings = function(amount, target) {	
	CM.Cache[target] = [];
	for (var i in Game.Objects) {
		CM.Sim.CopyData();
		var me = CM.Sim.Objects[i];
		me.amount += amount;
		
		if (i == 'Cursor') {
			if (me.amount >= 1) CM.Sim.Win('Click');
			if (me.amount >= 2) CM.Sim.Win('Double-click');
			if (me.amount >= 50) CM.Sim.Win('Mouse wheel');
			if (me.amount >= 100) CM.Sim.Win('Of Mice and Men');
			if (me.amount >= 200) CM.Sim.Win('The Digital');
			if (me.amount >= 300) CM.Sim.Win('Extreme polydactyly');
			if (me.amount >= 400) CM.Sim.Win('Dr. T');
			if (me.amount >= 500) CM.Sim.Win('Thumbs, phalanges, metacarpals');
		}
		else {
			for (var j in Game.Objects[me.name].tieredAchievs) {
				if (me.amount >= Game.Tiers[Game.Objects[me.name].tieredAchievs[j].tier].achievUnlock) 
					CM.Sim.Win(Game.Objects[me.name].tieredAchievs[j].name);
			}
		}
		
		var lastAchievementsOwned = CM.Sim.AchievementsOwned;
		
		CM.Sim.CalculateGains();
		
		CM.Sim.CheckOtherAchiev();
		
		if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
			CM.Sim.CalculateGains();
		}
		
		CM.Cache[target][i] = {};
		CM.Cache[target][i].bonus = CM.Sim.cookiesPs - Game.cookiesPs;
		if (amount != 1) {
			CM.Cache[target][i].price = CM.Sim.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, amount);
		}
	}
}

CM.Sim.BuyUpgrades = function() {
	CM.Cache.Upgrades = [];
	for (var i in Game.Upgrades) {
		if (Game.Upgrades[i].pool == 'toggle' || (Game.Upgrades[i].bought == 0 && Game.Upgrades[i].unlocked && Game.Upgrades[i].pool != 'prestige')) {
			CM.Sim.CopyData();
			var me = CM.Sim.Upgrades[i];
			me.bought = 1;
			if (Game.CountsAsUpgradeOwned(Game.Upgrades[i].pool)) CM.Sim.UpgradesOwned++;

			if (i == 'Elder Pledge') {
				CM.Sim.pledges++;
				if (CM.Sim.pledges > 0) CM.Sim.Win('Elder nap');
				if (CM.Sim.pledges >= 5) CM.Sim.Win('Elder slumber');
			}
			else if (i == 'Elder Covenant') {
				CM.Sim.Win('Elder calm')
			}
			else if (i == 'Eternal heart biscuits') {
				CM.Sim.Win('Lovely cookies');
			}
			else if (i == 'Heavenly key') {
				CM.Sim.Win('Wholesome');
			}
		
			var lastAchievementsOwned = CM.Sim.AchievementsOwned;
		
			CM.Sim.CalculateGains();
		
			CM.Sim.CheckOtherAchiev();
		
			if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
				CM.Sim.CalculateGains();
			}
		
			CM.Cache.Upgrades[i] = {};
			CM.Cache.Upgrades[i].bonus = CM.Sim.cookiesPs - Game.cookiesPs;
		}
	}
}

CM.Sim.ResetBonus = function() {
	CM.Sim.CopyData();
	
	if (Game.cookiesEarned >= 1000000) CM.Sim.Win('Sacrifice');
	if (Game.cookiesEarned >= 1000000000) CM.Sim.Win('Oblivion');
	if (Game.cookiesEarned >= 1000000000000) CM.Sim.Win('From scratch');
	if (Game.cookiesEarned >= 1000000000000000) CM.Sim.Win('Nihilism');
	if (Game.cookiesEarned >= 1000000000000000000) CM.Sim.Win('Dematerialize');
	if (Game.cookiesEarned >= 1000000000000000000000) CM.Sim.Win('Nil zero zilch');
	if (Game.cookiesEarned >= 1000000000000000000000000) CM.Sim.Win('Transcendence');
	if (Game.cookiesEarned >= 1000000000000000000000000000) CM.Sim.Win('Obliterate');
	if (Game.cookiesEarned >= 1000000000000000000000000000000) CM.Sim.Win('Negative void');
	if (Game.cookiesEarned >= 1000000000000000000000000000000000) CM.Sim.Win('To crumbs, you say?');
	
	if (CM.Sim.Upgrades['Heavenly chip secret'].bought == 0) {
		CM.Sim.Upgrades['Heavenly chip secret'].bought = 1;
		CM.Sim.UpgradesOwned++;
	}
	if (CM.Sim.Upgrades['Heavenly cookie stand'].bought == 0) {
		CM.Sim.Upgrades['Heavenly cookie stand'].bought = 1;
		CM.Sim.UpgradesOwned++;
	}
	if (CM.Sim.Upgrades['Heavenly bakery'].bought == 0) {
		CM.Sim.Upgrades['Heavenly bakery'].bought = 1;
		CM.Sim.UpgradesOwned++;
	}
	if (CM.Sim.Upgrades['Heavenly confectionery'].bought == 0) {
		CM.Sim.Upgrades['Heavenly confectionery'].bought = 1;
		CM.Sim.UpgradesOwned++;
	}
	if (CM.Sim.Upgrades['Heavenly key'].bought == 0) {
		CM.Sim.Upgrades['Heavenly key'].bought = 1;
		CM.Sim.UpgradesOwned++;
	}
	
	CM.Sim.prestige = Math.floor(Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset));
	
	var lastAchievementsOwned = CM.Sim.AchievementsOwned;

	CM.Sim.CalculateGains();
	
	CM.Sim.CheckOtherAchiev();
	
	if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}

	return (CM.Sim.cookiesPs - Game.cookiesPs);
}

/**********
 * Footer *
 **********/

CM.Init();
