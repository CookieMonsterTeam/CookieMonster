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

CM.Cache.RemakeIncome = function() {
	// Simulate Building Buys for 1 amount
	CM.Sim.BuyBuildings(1, 'Objects');

	// Simulate Upgrade Buys
	CM.Sim.BuyUpgrades();
	
	// Simulate Building Buys for 10 amount
	CM.Sim.BuyBuildings(10, 'Objects10');
}

CM.Cache.RemakeBuildingsBCI = function() {
	CM.Disp.min = -1;
	CM.Disp.max = -1;
	CM.Disp.mid = -1;
	for (var i in CM.Cache.Objects) {
		CM.Cache.Objects[i].bci = Game.Objects[i].getPrice() / CM.Cache.Objects[i].bonus;
		if (CM.Disp.min == -1 || CM.Cache.Objects[i].bci < CM.Disp.min) CM.Disp.min = CM.Cache.Objects[i].bci;
		if (CM.Disp.max == -1 || CM.Cache.Objects[i].bci > CM.Disp.max) CM.Disp.max = CM.Cache.Objects[i].bci;
	}
	CM.Disp.mid = ((CM.Disp.max - CM.Disp.min) / 2) + CM.Disp.min;
	for (var i in CM.Cache.Objects) {
		var color = '';
		if (CM.Cache.Objects[i].bci == CM.Disp.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Objects[i].bci == CM.Disp.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Objects[i].bci > CM.Disp.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Objects[i].color = color;
	}
}

CM.Cache.RemakeUpgradeBCI = function() {
	for (var i in CM.Cache.Upgrades) {
		CM.Cache.Upgrades[i].bci = Game.Upgrades[i].getPrice() / CM.Cache.Upgrades[i].bonus;
		var color = '';
		if (CM.Cache.Upgrades[i].bci <= 0 || CM.Cache.Upgrades[i].bci == 'Infinity') color = CM.Disp.colorGray;
		else if (CM.Cache.Upgrades[i].bci < CM.Disp.min) color = CM.Disp.colorBlue;
		else if (CM.Cache.Upgrades[i].bci == CM.Disp.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Upgrades[i].bci == CM.Disp.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Upgrades[i].bci > CM.Disp.max) color = CM.Disp.colorPurple;
		else if (CM.Cache.Upgrades[i].bci > CM.Disp.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Upgrades[i].color = color;
	}
}

CM.Cache.RemakeBuildings10BCI = function() {
	for (var i in CM.Cache.Objects10) {
		CM.Cache.Objects10[i].price = CM.Sim.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, 10);
		CM.Cache.Objects10[i].bci = CM.Cache.Objects10[i].price / CM.Cache.Objects10[i].bonus;
		var color = '';
		if (CM.Cache.Objects10[i].bci <= 0 || CM.Cache.Objects10[i].bci == 'Infinity') color = CM.Disp.colorGray;
		else if (CM.Cache.Objects10[i].bci < CM.Disp.min) color = CM.Disp.colorBlue;
		else if (CM.Cache.Objects10[i].bci == CM.Disp.min) color = CM.Disp.colorGreen;
		else if (CM.Cache.Objects10[i].bci == CM.Disp.max) color = CM.Disp.colorRed;
		else if (CM.Cache.Objects10[i].bci > CM.Disp.max) color = CM.Disp.colorPurple;
		else if (CM.Cache.Objects10[i].bci > CM.Disp.mid) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
		CM.Cache.Objects10[i].color = color;
	}
}

CM.Cache.RemakeBCI = function() {
	// Buildings for 1 amount
	CM.Cache.RemakeBuildingsBCI();
	
	// Upgrades
	CM.Cache.RemakeUpgradeBCI();
	
	// Buildings for 10 amount
	CM.Cache.RemakeBuildings10BCI();
}

CM.Cache.RemakeLucky = function() {
	CM.Cache.Lucky = (Game.cookiesPs * 60 * 20) / 0.1;
	if (Game.frenzy > 0) {
		CM.Cache.Lucky /= Game.frenzyPower;
	}
	CM.Cache.LuckyReward = (CM.Cache.Lucky * 0.1) + 13;
	CM.Cache.LuckyFrenzy = CM.Cache.Lucky * 7;
	CM.Cache.LuckyRewardFrenzy = (CM.Cache.LuckyFrenzy * 0.1) + 13;
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
	var maxPayout = Game.cookiesPs * 60 * 60 * 3;
	if (Game.frenzy > 0) {
		maxPayout /= Game.frenzyPower;
	}
	
	CM.Cache.ChainReward = CM.Cache.MaxChainMoni(7, maxPayout);
	
	CM.Cache.ChainWrathReward = CM.Cache.MaxChainMoni(6, maxPayout);
	
	var base = 0;
	if (CM.Cache.ChainReward > CM.Cache.ChainWrathReward) {
		base = CM.Cache.ChainReward;
	}
	else {
		base = CM.Cache.ChainWrathReward;
	}
	var count = 1;
	if (maxPayout < base) {
		CM.Cache.Chain = 0;
	}
	else {
		count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
		while (base == base + count) {
			count++;
		}
		CM.Cache.Chain = (base + count) / 0.25;
	}
	
	CM.Cache.ChainFrenzyReward = CM.Cache.MaxChainMoni(7, maxPayout * 7);
	
	CM.Cache.ChainFrenzyWrathReward = CM.Cache.MaxChainMoni(6, maxPayout * 7);
	
	if (CM.Cache.ChainFrenzyReward > CM.Cache.ChainFrenzyWrathReward) {
		base = CM.Cache.ChainFrenzyReward;
	}
	else {
		base = CM.Cache.ChainFrenzyWrathReward;
	}
	if ((maxPayout * 7) < base) {
		CM.Cache.ChainFrenzy = 0;
	}
	else {
		count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
		while(base == base + count) {
			count++;
		}
		CM.Cache.ChainFrenzy = (base + count) / 0.25;
	}
}

CM.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		CM.Cache.SeaSpec = Math.max(25, Game.cookiesPs * 60 * 1);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
}

CM.Cache.Lucky = 0;
CM.Cache.LuckyReward = 0;
CM.Cache.LuckyFrenzy = 0;
CM.Cache.LuckyRewardFrenzy = 0;
CM.Cache.SeaSpec = 0;
CM.Cache.Chain = 0;
CM.Cache.ChainReward = 0;
CM.Cache.ChainWrathReward = 0;
CM.Cache.ChainFrenzy = 0;
CM.Cache.ChainFrenzyReward = 0;
CM.Cache.ChainFrenzyWrathReward = 0;
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
			if (i != 'StatsPref') {
				if (CM.Config[i] == undefined || !(CM.Config[i] > -1 && CM.Config[i] < CM.ConfigData[i].label.length)) {
					mod = true;
					CM.Config[i] = CM.ConfigDefault[i];
				}
			}
			else { // Statistics Preferences
				if (CM.Config[i] == undefined) {
					mod = true;
					CM.Config[i] = CM.ConfigDefault[i];
				}
				else {
					for (var j in CM.ConfigDefault.StatsPref) {
						if (CM.Config[i][j] == undefined || !(CM.Config[i][j] > -1 && CM.Config[i][j] < 2)) {
							mod = true;
							CM.Config[i][j] = CM.ConfigDefault[i][j];
						}
					}
				}
			}
		}
		if (mod) CM.SaveConfig(CM.Config);
		CM.Loop(); // Do loop once
		for (var i in CM.ConfigDefault) {
			if (i != 'StatsPref' && CM.ConfigData[i].func != undefined) {
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

CM.ToggleStatsConfig = function(config) {
	if (CM.Config.StatsPref[config] == 0) {
		CM.Config.StatsPref[config]++;
	}
	else {
		CM.Config.StatsPref[config]--;
	}
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

CM.Disp.GetTimeColor = function(price) {
	var color;
	var text;
	if (Game.cookies >= price) {
		color = CM.Disp.colorGreen;
		text = 'Done!';
	}
	else {
		var time = (price - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked));
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

CM.Disp.Beautify = function(num) {
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
			answer = CM.Backup.Beautify(num);
		}
		
		if (negative) {
			answer = '-' + answer;
		}
		return answer;
	}
	else {
		return CM.Backup.Beautify(num);
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
		td.style.color = color;
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
	var bci = document.createElement('tr');
	bci.appendChild(firstCol('Base Cost Per Income', CM.Disp.colorBlue));
	tbody.appendChild(bci);
	var time = document.createElement('tr');
	time.appendChild(firstCol('Time Left', CM.Disp.colorBlue));
	tbody.appendChild(time);
	
	for (var i in Game.Objects) {
		var header = document.createElement('td');
		header.appendChild(document.createTextNode((i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' ('));
		var span = document.createElement('span');
		span.style.color = CM.Disp.colorBlue;
		header.appendChild(span);
		header.appendChild(document.createTextNode(')'));
		type.appendChild(header);
		bonus.appendChild(document.createElement('td'));
		bci.appendChild(document.createElement('td'));
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
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].style.color = CM.Cache.Objects[i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache.Objects[i].bci, 2);
		}
	}
}

CM.Disp.UpdateBotBarTime = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;
	
		for (var i in CM.Cache.Objects) {
			count++;
			var timeColor = CM.Disp.GetTimeColor(Game.Objects[i].getPrice());
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].style.color = timeColor.color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
}

CM.Disp.CreateTimerBar = function() {
	CM.Disp.TimerBar = document.createElement('div');
	CM.Disp.TimerBar.id = 'CMTimerBar';
	CM.Disp.TimerBar.style.position = 'absolute';
	CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.TimerBar.style.bottom = '0px';
	CM.Disp.TimerBar.style.height = '48px';
	CM.Disp.TimerBar.style.width = '100%';
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
		type.style.width = '71px';
		type.style.marginRight = '5px';
		type.style.verticalAlign = 'text-top';
		type.textContent = name;
		div.appendChild(type);
		
		for (var i = 0; i < bars.length; i++) {
			var colorBar = document.createElement('span');
			colorBar.id = bars[i].id
			colorBar.style.display = 'inline-block';
			colorBar.style.height = '10px';
			if (bars[i].color != undefined) {
				colorBar.style.backgroundColor = bars[i].color;
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
	CM.Disp.TimerBarCF.appendChild(bar('Click Frenzy', [{id: 'CMTimerBarCFBar', color: CM.Disp.colorBlue}], 'CMTimerBarCFTime'));
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

CM.Disp.UpdateTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		// label width: 76	timer width: 26 div margin: 20
		var maxWidth = CM.Disp.TimerBar.offsetWidth - 122;
		var count = 0;
		
		if (Game.goldenCookie.life <= 0 && Game.goldenCookie.toDie == 0) {
			CM.Disp.TimerBarGC.style.display = '';
			l('CMTimerBarGCMinBar').style.width = Math.round(Math.max(0, Game.goldenCookie.minTime - Game.goldenCookie.time) * maxWidth / Game.goldenCookie.maxTime) + 'px';
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
				l('CMTimerBarFrenBar').style.backgroundColor = CM.Disp.colorYellow;
			}
			else if (Game.frenzyPower == 0.5) {
				l('CMTimerBarFrenType').textContent = 'Clot';
				l('CMTimerBarFrenBar').style.backgroundColor = CM.Disp.colorRed;
			}
			else {
				l('CMTimerBarFrenType').textContent = 'Blood Frenzy';
				l('CMTimerBarFrenBar').style.backgroundColor = CM.Disp.colorGreen;
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
	if (CM.Config.BotBar == 1 && CM.Config.TimerBar == 1) {
		CM.Disp.BotBar.style.bottom = '48px';
		l('game').style.bottom = '104px';
	}
	else if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '56px';
	}
	else if (CM.Config.TimerBar == 1) {
		l('game').style.bottom = '48px';
	}
	else { // No bars
		l('game').style.bottom = '0px';
	}
	
	CM.Disp.UpdateBackground();
}

CM.Disp.UpdateBuildings = function() {
	if (CM.Config.BuildColor == 1) {
		for (var i in CM.Cache.Objects) {
			l('productPrice' + Game.Objects[i].id).style.color = CM.Cache.Objects[i].color;
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
	legend.style.minWidth = '320px';
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
		span.style.backgroundColor = color;
		span.style.display = 'inline-block';
		span.style.height = '10px';
		span.style.width = '10px';
		span.style.marginRight = '4px';
		div.appendChild(span);
		div.appendChild(document.createTextNode(text));
		return div;
	}
	
	legend.appendChild(legendLine(CM.Disp.colorBlue, 'Better than best BCI building'));
	legend.appendChild(legendLine(CM.Disp.colorGreen, 'Same as best BCI building'));
	legend.appendChild(legendLine(CM.Disp.colorYellow, 'Between best and worst BCI buildings closer to best'));
	legend.appendChild(legendLine(CM.Disp.colorOrange, 'Between best and worst BCI buildings closer to worst'));
	legend.appendChild(legendLine(CM.Disp.colorRed, 'Same as worst BCI building'));
	legend.appendChild(legendLine(CM.Disp.colorPurple, 'Worse than worst BCI building'));
	legend.appendChild(legendLine(CM.Disp.colorGray, 'Negative or infinity BCI'));
	placeholder.appendChild(legend);
	
	CM.Disp.UpgradeBar.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML), 'store');};
	
	var upgradeNumber = function(id, color) {
		var span = document.createElement('span');
		span.id = id;
		span.style.color = color;
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
	var blue = 0;
	var green = 0;
	var yellow = 0;
	var orange = 0;
	var red = 0;
	var purple = 0;
	var gray = 0;
	
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).childNodes.length > 0) {
			l('upgrade' + i).childNodes[0].style.backgroundColor = CM.Cache.Upgrades[me.name].color;
		}
		else {
			var div = document.createElement('div');
			div.style.width = '17px';
			div.style.height = '17px';
			div.style.backgroundColor = CM.Cache.Upgrades[me.name].color;
			l('upgrade' + i).appendChild(div);
		}
		if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorBlue) blue++;
		else if (CM.Cache.Upgrades[me.name].color == CM.Disp.colorBlue) blue++;
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
		if (l('goldenCookie').style.display != 'none') {
			if (CM.Config.GCTimer == 1) {
				CM.Disp.GCTimer.style.display = 'block';
				CM.Disp.GCTimer.style.left = l('goldenCookie').style.left;
				CM.Disp.GCTimer.style.top = l('goldenCookie').style.top;
			}
			
			CM.Disp.Flash(3);
			CM.Disp.PlaySound('http://cookie-monster.autopergamene.eu/mp3/bell.mp3');
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
		CM.Disp.PlaySound('http://www.freesound.org/data/previews/121/121099_2193266-lq.mp3');
	}
}

CM.Disp.UpdateTitle = function() {
	if (CM.Config.Title == 1) {
		var addSP = false;
		
		var titleGC;
		var titleSP;
		if (l('goldenCookie').style.display != 'none') {
			addGC = true;
			titleGC = '[G ' +  Math.ceil(Game.goldenCookie.life / Game.fps) + ']';
		}
		else {
			titleGC = '[' +  Math.ceil((Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps) + ']';
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
		a.className = 'option';
		a.id = CM.ConfigPrefix + config;
		a.onclick = function() {CM.ToggleConfigUp(config);};
		a.textContent = CM.Disp.GetConfigDisplay(config);
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
		
	frag.appendChild(header('Bars/Colors'));
	frag.appendChild(listing('BotBar'));
	frag.appendChild(listing('TimerBar'));
	frag.appendChild(listing('BuildColor'));
	frag.appendChild(listing('UpBarColor'));
	
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
	frag.appendChild(listing('GCTimer'));
	frag.appendChild(listing('Title'));
	
	frag.appendChild(header('Tooltip'));
	frag.appendChild(listing('Tooltip'));
	frag.appendChild(listing('ToolWarnCaut'));
	frag.appendChild(listing('ToolWarnCautPos'));
	
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
	l('formatButton').onclick = function() {Game.Toggle('format', 'formatButton', 'Short numbers OFF', 'Short numbers ON'); CM.Disp.RefreshScale();};
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
		span = document.createElement('span');
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
		b.textContent = name + ' : ';
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
		var luckyCur = Math.min(Game.cookies * 0.1, Game.cookiesPs * 60 * 20) + 13;
	
		var luckyReqFrag = document.createDocumentFragment();
		var luckyReqSpan = document.createElement('span');
		luckyReqSpan.style.fontWeight = 'bold';
		luckyReqSpan.style.color = luckyColor;
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
		luckyReqFrenSpan.style.color = luckyColorFrenzy;
		luckyReqFrenSpan.textContent = Beautify(CM.Cache.LuckyFrenzy);
		luckyReqFrenFrag.appendChild(luckyReqFrenSpan);
		if (luckyTimeFrenzy != '') {
			var luckyReqFrenSmall = document.createElement('small');
			luckyReqFrenSmall.textContent = ' (' + luckyTimeFrenzy + ')';
			luckyReqFrenFrag.appendChild(luckyReqFrenSmall);
		}
		stats.appendChild(listing('\"Lucky!\" Cookies Required (Frenzy)', luckyReqFrenFrag));
		stats.appendChild(listing('\"Lucky!\" Reward (MAX)',  document.createTextNode(Beautify(CM.Cache.LuckyReward))));
		stats.appendChild(listing('\"Lucky!\" Reward (MAX) (Frenzy)',  document.createTextNode(Beautify(CM.Cache.LuckyRewardFrenzy))));
		stats.appendChild(listing('\"Lucky!\" Reward (CUR)',  document.createTextNode(Beautify(luckyCur))));
	}
	
	stats.appendChild(header('Chain Cookies', 'Chain'));
	if (CM.Config.StatsPref.Chain) {
		var chainColor = (Game.cookies < CM.Cache.Chain) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainTime = (Game.cookies < CM.Cache.Chain) ? CM.Disp.FormatTime((CM.Cache.Chain - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		var chainColorFrenzy = (Game.cookies < CM.Cache.ChainFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
		var chainTimeFrenzy = (Game.cookies < CM.Cache.ChainFrenzy) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzy - Game.cookies) / (Game.cookiesPs * (1 - Game.cpsSucked))) : '';
		var chainCurMax = Math.min(Game.cookiesPs * 60 * 60 * 3, Game.cookies * 0.25);
		var chainCur = CM.Cache.MaxChainMoni(7, chainCurMax);
		var chainCurWrath = CM.Cache.MaxChainMoni(6, chainCurMax);

		var chainReqFrag = document.createDocumentFragment();
		var chainReqSpan = document.createElement('span');
		chainReqSpan.style.fontWeight = 'bold';
		chainReqSpan.style.color = chainColor;
		chainReqSpan.textContent = Beautify(CM.Cache.Chain);
		chainReqFrag.appendChild(chainReqSpan);
		if (chainTime != '') {
			var chainReqSmall = document.createElement('small');
			chainReqSmall.textContent = ' (' + chainTime + ')';
			chainReqFrag.appendChild(chainReqSmall);
		}
		stats.appendChild(listing('\"Chain\" Cookies Required', chainReqFrag));
		var chainReqFrenFrag = document.createDocumentFragment();
		var chainReqFrenSpan = document.createElement('span');
		chainReqFrenSpan.style.fontWeight = 'bold';
		chainReqFrenSpan.style.color = chainColorFrenzy;
		chainReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzy);
		chainReqFrenFrag.appendChild(chainReqFrenSpan);
		if (chainTimeFrenzy != '') {
			var chainReqFrenSmall = document.createElement('small');
			chainReqFrenSmall.textContent = ' (' + chainTimeFrenzy + ')';
			chainReqFrenFrag.appendChild(chainReqFrenSmall);
		}
		stats.appendChild(listing('\"Chain\" Cookies Required (Frenzy)', chainReqFrenFrag));
		stats.appendChild(listing('\"Chain\" Reward (MAX)',  document.createTextNode(Beautify(CM.Cache.ChainReward))));
		stats.appendChild(listing('\"Chain\" Reward (MAX) (Wrath)',  document.createTextNode(Beautify(CM.Cache.ChainWrathReward))));
		stats.appendChild(listing('\"Chain\" Reward (MAX) (Frenzy)',  document.createTextNode(Beautify(CM.Cache.ChainFrenzyReward))));
		stats.appendChild(listing('\"Chain\" Reward (MAX) (Frenzy) (Wrath)',  document.createTextNode(Beautify(CM.Cache.ChainFrenzyWrathReward))));
		stats.appendChild(listing('\"Chain\" Reward (CUR)',  document.createTextNode(Beautify(chainCur))));
		stats.appendChild(listing('\"Chain\" Reward (CUR) (Wrath)',  document.createTextNode(Beautify(chainCurWrath))));
	}
	
	stats.appendChild(header('Heavenly Chips', 'HC'));
	if (CM.Config.StatsPref.HC) {
		var possibleHC = Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset);
		var neededCook = CM.Sim.CookNeedPrest(possibleHC + 1) - (Game.cookiesEarned + Game.cookiesReset);

		var hcMaxFrag = document.createDocumentFragment();
		hcMaxFrag.appendChild(document.createTextNode(Beautify(possibleHC)));
		var hcMaxSmall = document.createElement('small');
		hcMaxSmall.textContent = ' (' + Beautify((possibleHC * 2)) + '%)';
		hcMaxFrag.appendChild(hcMaxSmall);
		stats.appendChild(listing('Heavenly Chips (MAX)',  hcMaxFrag));
		var hcCurFrag = document.createDocumentFragment();
		hcCurFrag.appendChild(document.createTextNode(Beautify(Game.prestige['Heavenly chips'])));
		var hcCurSmall = document.createElement('small');
		hcCurSmall.textContent = ' (' + Beautify((Game.prestige['Heavenly chips'] * 2)) + '%)';
		hcCurFrag.appendChild(hcCurSmall);
		stats.appendChild(listing('Heavenly Chips (CUR)',  hcCurFrag));
		stats.appendChild(listing('Cookies To Next Chip',  document.createTextNode(Beautify(neededCook))));
		stats.appendChild(listing('Time To Next Chip',  document.createTextNode(CM.Disp.FormatTime(neededCook / (Game.cookiesPs * (1 - Game.cpsSucked)), 1))));
		stats.appendChild(listing('Reset Bonus Income',  document.createTextNode(Beautify(CM.Sim.ResetBonus()))));
	}
	
	if (Game.cpsSucked > 0) {
		stats.appendChild(header('Wrinklers', 'Wrink'));
		if (CM.Config.StatsPref.Wrink) {
			var sucked = 0;
			for (var i in Game.wrinklers) {
				sucked += Game.wrinklers[i].sucked;
			}
			sucked *= 1.1;
			if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
			stats.appendChild(listing('Rewards of Popping',  document.createTextNode(Beautify(sucked))));
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
	if (Game.season == 'christmas' || specDisp) {
		stats.appendChild(header('Season Specials', 'Sea'));
		if (CM.Config.StatsPref.Sea) {
			if (specDisp) {
				var createSpecDisp = function(theSpecDisp) {
					var frag = document.createDocumentFragment();
					frag.appendChild(document.createTextNode(theSpecDisp.length + ' '));
					span = document.createElement('span');
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
		}
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);
}

CM.Disp.AddMenu = function() {
	var title = function() {
		var div = document.createElement('div');
		div.className = 'title';
		div.style.color = CM.Disp.colorBlue;
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
	if (CM.Config.UpStats && Game.onMenu == 'stats' && Game.drawT % (Game.fps * 3) != 0 && Game.drawT % Game.fps == 0) Game.UpdateMenu();
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
		box.style.border = '1px solid ' + color;
		box.style.padding = '2px';
		box.style.background = '#000 url(img/darkNoise.png)';
		var labelDiv = document.createElement('div');
		box.appendChild(labelDiv);
		var labelSpan = document.createElement('span');
		labelSpan.style.color = color;
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
		CM.Disp.TooltipWarnCaut.style.top = '12px';
		CM.Disp.TooltipWarnCaut.style.padding = '3px 4px';
	}
	else {
		CM.Disp.TooltipWarnCaut.style.right = '12px';
		CM.Disp.TooltipWarnCaut.style.padding = '4px 3px';
	}
}

CM.Disp.AddTooltipBuild = function() {
	CM.Disp.TooltipBuildBack = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			CM.Disp.TooltipBuildBack[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() {Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'b\', \'' + i + '\');}, \'store\');}');
		}
	}
}

CM.Disp.AddTooltipUpgrade = function() {
	CM.Disp.TooltipUpgradeBack = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			CM.Disp.TooltipUpgradeBack[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() {CM.Disp.Tooltip(\'u\', \'' + i + '\');}');
		}
	}
}

CM.Disp.AddTooltipBuild10 = function() {
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		l('buttonBuy10-' + me.id).onmouseover = function() {CM.Disp.TooltipBuy10 = true;};
		l('buttonBuy10-' + me.id).onmouseout = function() {CM.Disp.TooltipBuy10 = false;};
	}
}

CM.Disp.Tooltip = function(type, name) {
	if (type == 'b') {
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		if (CM.Disp.TooltipBuy10) {
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join(Beautify(CM.Cache.Objects10[name].price));
		}
	}
	else { // Upgrades
		CM.Disp.TooltipUpgradeBack[name]();
	}
	
	var area = document.createElement('div');
	area.id = 'CMTooltipArea';
	l('tooltip').appendChild(area);
	
	if (CM.Config.Tooltip == 1) {
		l('tooltip').firstChild.style.paddingBottom = '4px';
		var tooltip = document.createElement('div');
		tooltip.style.border = '1px solid';
		tooltip.style.padding = '4px';
		tooltip.style.margin = '0px -4px';
		tooltip.id = 'CMTooltipBorder';
		
		var header = function(text) {
			var div = document.createElement('div');
			div.style.fontWeight = 'bold';
			div.style.color = CM.Disp.colorBlue;
			div.textContent = text;
			return div;
		}
		tooltip.appendChild(header('Bonus Income'));
		var income = document.createElement('div');
		income.style.marginBottom = '4px';
		income.style.color = 'white';
		income.id = 'CMTooltipIncome';
		tooltip.appendChild(income);
		tooltip.appendChild(header('Base Cost Per Income'));
		var bci = document.createElement('div');
		bci.style.marginBottom = '4px';
		bci.id = 'CMTooltipBCI';
		tooltip.appendChild(bci);
		tooltip.appendChild(header('Time Left'));
		var time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltip.appendChild(time);
		
		l('tooltip').appendChild(tooltip);
	}
	
	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	CM.Disp.UpdateTooltip();
	
	if (type == 'b') {
		return l('tooltip').innerHTML;
	}	
}

CM.Disp.UpdateTooltip = function() {
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		var price;
		var bonus;
		if (CM.Disp.tooltipType == 'b') {
			if (!CM.Disp.TooltipBuy10) {
				bonus = CM.Cache.Objects[CM.Disp.tooltipName].bonus;
				price = Game.Objects[CM.Disp.tooltipName].getPrice();
				if (CM.Config.Tooltip == 1) {
					l('CMTooltipBorder').style.color = CM.Cache.Objects[CM.Disp.tooltipName].color;
					l('CMTooltipBCI').textContent = Beautify(CM.Cache.Objects[CM.Disp.tooltipName].bci, 2);
					l('CMTooltipBCI').style.color = CM.Cache.Objects[CM.Disp.tooltipName].color;
				}
			}
			else {
				bonus = CM.Cache.Objects10[CM.Disp.tooltipName].bonus;
				price = CM.Cache.Objects10[CM.Disp.tooltipName].price;
				if (CM.Config.Tooltip == 1) {
					l('CMTooltipBorder').style.color = CM.Cache.Objects10[CM.Disp.tooltipName].color;
					l('CMTooltipBCI').textContent = Beautify(CM.Cache.Objects10[CM.Disp.tooltipName].bci, 2);
					l('CMTooltipBCI').style.color = CM.Cache.Objects10[CM.Disp.tooltipName].color;
				}
			}
		}
		else { // Upgrades
			bonus = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
			price = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();
			if (CM.Config.Tooltip == 1) {
				l('CMTooltipBorder').style.color = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
				l('CMTooltipBCI').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bci, 2);
				l('CMTooltipBCI').style.color = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
			}
		}
		if (CM.Config.Tooltip == 1) {
			l('CMTooltipIncome').textContent = Beautify(bonus, 2);
			
			var increase = Math.round(bonus / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
			}
		
			var timeColor = CM.Disp.GetTimeColor(price);
			l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').style.color = timeColor.color;
		}
		
		if (CM.Config.ToolWarnCaut == 1) {
			var bonusNoFren = bonus;
			if (Game.frenzy > 0) {
				bonusNoFren /= Game.frenzyPower;
			}
			var warn = CM.Cache.Lucky + ((bonusNoFren * 60 * 20) / 0.1);
			var caut = warn * 7;
			var amount = Game.cookies - price;
			if (amount < warn || amount < caut) {
				if (CM.Config.ToolWarnCautPos == 0) {
					CM.Disp.TooltipWarnCaut.style.right = (l('tooltip').offsetWidth + 12) + 'px';
				}
				else {
					CM.Disp.TooltipWarnCaut.style.top = (l('tooltip').offsetHeight + 12) + 'px';
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

CM.Disp.min = -1;
CM.Disp.max = -1;
CM.Disp.mid = -1;
CM.Disp.colorBlue = '#4bb8f0';
CM.Disp.colorGreen = 'lime';
CM.Disp.colorYellow = 'yellow';
CM.Disp.colorOrange = '#ff7f00';
CM.Disp.colorRed = 'red';
CM.Disp.colorPurple = 'magenta';
CM.Disp.colorGray = '#b3b3b3';
CM.Disp.lastGoldenCookieState = 'none';

CM.Disp.metric = ['M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
CM.Disp.shortScale = ['M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec'];

CM.Disp.TooltipBuy10 = false;

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
		CM.Cache.RemakeChain();
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
		CM.Disp.AddTooltipBuild10();
		CM.ReplaceNative();
		Game.CalculateGains();
		CM.LoadConfig(); // Must be after all things are created!

		if (Game.prefs.popups) Game.Popup('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!');
		else Game.Notify('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' loaded!','','',1);
		
		Game.Win('Third-party');
	}
}

CM.ConfigDefault = {BotBar: 1, TimerBar: 1, BuildColor: 1, UpBarColor: 1, Flash: 1, Sound: 1,  Volume: 100, GCTimer: 1, Title: 1, Tooltip: 1, ToolWarnCaut: 1, ToolWarnCautPos: 0, Stats: 1, UpStats: 1, SayTime: 1, Scale: 2, StatsPref: {Lucky: 1, Chain: 1, HC: 1, Wrink: 1, Sea: 1}};
CM.ConfigPrefix = 'CMConfig';

CM.VersionMajor = '1.0465';
CM.VersionMinor = '8';

/*******
 * Sim *
 *******/

CM.Sim.BuildingGetPrice = function (basePrice, start, increase) {
	var totalPrice = 0;
	var count = 0;
	while(count < increase) {
		var price = basePrice * Math.pow(Game.priceIncrease, start + count);
		if (Game.Has('Season savings')) price *= 0.99;
		if (Game.Has('Santa\'s dominion')) price *= 0.99;
		if (Game.Has('Faberge egg')) price *= 0.99;
		totalPrice += Math.ceil(price);
		count++;
	}
	return totalPrice;
}

eval('CM.Sim.Has = ' + Game.Has.toString().split('Game').join('CM.Sim'));

CM.Sim.Win = function(what) {
	if (CM.Sim.Achievements[what]) {
		if (CM.Sim.Achievements[what].won == 0) {
			CM.Sim.Achievements[what].won = 1;
			if (Game.Achievements[what].hide != 3) CM.Sim.AchievementsOwned++;
		}
	}
}

eval('CM.Sim.HasAchiev = ' + Game.HasAchiev.toString().split('Game').join('CM.Sim'));

CM.Sim.CookNeedPrest = function(prestige) {
	return ((Math.pow(((prestige * 2) + 1), 2) - 1) / 8) * 1000000000000;
}

CM.Sim.CopyData = function() {
	// Other variables
	CM.Sim.prestige = Game.prestige['Heavenly chips'];
	CM.Sim.UpgradesOwned = Game.UpgradesOwned;
	CM.Sim.pledges = Game.pledges;
	CM.Sim.AchievementsOwned = Game.AchievementsOwned;
	
	// Buildings
	CM.Sim.Objects = [];
	for (var i in Game.Objects) {
		CM.Sim.Objects[i] = {};
		var me = Game.Objects[i];
		var you = CM.Sim.Objects[i];
		you.amount = me.amount;
		eval('you.cps = ' + me.cps.toString().split('Game.Has').join('CM.Sim.Has').split('Game.Objects').join('CM.Sim.Objects'));		
		you.name = me.name; // Needed for above eval!
	}

	// Upgrades
	CM.Sim.Upgrades = [];
	for (var i in Game.Upgrades) {
		CM.Sim.Upgrades[i] = {};
		var me = Game.Upgrades[i];
		var you = CM.Sim.Upgrades[i];
		you.bought = me.bought;
	}

	// Achievements
	CM.Sim.Achievements = [];
	for (var i in Game.Achievements) {
		CM.Sim.Achievements[i] = {};
		var me = Game.Achievements[i];
		var you = CM.Sim.Achievements[i];
		you.won = me.won;
	}
};


CM.Sim.CalculateGains = function() {
	CM.Sim.cookiesPs = 0;
	var mult = 1;
	for (var i in CM.Sim.Upgrades) {
		var me = CM.Sim.Upgrades[i];
		if (me.bought > 0) {
			if (Game.Upgrades[i].type == 'cookie' && CM.Sim.Has(Game.Upgrades[i].name)) mult += Game.Upgrades[i].power * 0.01;
		}
	}
	mult += CM.Sim.Has('Specialized chocolate chips') * 0.01;
	mult += CM.Sim.Has('Designer cocoa beans') * 0.02;
	mult += CM.Sim.Has('Underworld ovens') * 0.03;
	mult += CM.Sim.Has('Exotic nuts') * 0.04;
	mult += CM.Sim.Has('Arcane sugar') * 0.05;

	if (CM.Sim.Has('Increased merriness')) mult += 0.15;
	if (CM.Sim.Has('Improved jolliness')) mult += 0.15;
	if (CM.Sim.Has('A lump of coal')) mult += 0.01;
	if (CM.Sim.Has('An itchy sweater')) mult += 0.01;
	if (CM.Sim.Has('Santa\'s dominion')) mult += 0.5;

	if (CM.Sim.Has('Santa\'s legacy')) mult += (Game.santaLevel + 1) * 0.1;

	var heavenlyMult = 0;
	if (CM.Sim.Has('Heavenly chip secret')) heavenlyMult += 0.05;
	if (CM.Sim.Has('Heavenly cookie stand')) heavenlyMult += 0.20;
	if (CM.Sim.Has('Heavenly bakery')) heavenlyMult += 0.25;
	if (CM.Sim.Has('Heavenly confectionery')) heavenlyMult += 0.25;
	if (CM.Sim.Has('Heavenly key')) heavenlyMult += 0.25;
	mult += parseFloat(CM.Sim.prestige) * 0.02 * heavenlyMult;

	for (var i in CM.Sim.Objects) {
		var me = CM.Sim.Objects[i];
		CM.Sim.cookiesPs += me.amount * (typeof(me.cps) == 'function' ? me.cps() : me.cps);
	}

	if (CM.Sim.Has('"egg"')) CM.Sim.cookiesPs += 9; // "egg"

	var milkMult = CM.Sim.Has('Santa\'s milk and cookies') ? 1.05 : 1;
	if (CM.Sim.Has('Kitten helpers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.05 * milkMult);
	if (CM.Sim.Has('Kitten workers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.1 * milkMult);
	if (CM.Sim.Has('Kitten engineers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten overseers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (CM.Sim.Has('Kitten managers')) mult *= (1 + (CM.Sim.AchievementsOwned / 25) * 0.2 * milkMult);

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

	var rawCookiesPs = CM.Sim.cookiesPs * mult;
	for (var i = 0; i < Game.cpsAchievs.length / 2; i++) {
		if (rawCookiesPs >= Game.cpsAchievs[i * 2 + 1]) CM.Sim.Win(Game.cpsAchievs[i * 2]);
	}

	if (Game.frenzy > 0) mult *= Game.frenzyPower;

	if (CM.Sim.Has('Elder Covenant')) mult *= 0.95;

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
	if (!CM.Sim.HasAchiev('Elder') && grandmas >= 7) CM.Sim.Win('Elder');

	var buildingsOwned = 0;
	var oneOfEach = 1;
	var mathematician = 1;
	var base10 = 1;
	var centennial = 1;
	var centennialhalf = 1;
	var bicentennial = 1;
	for (var i in CM.Sim.Objects) {
		buildingsOwned += CM.Sim.Objects[i].amount;
		if (!CM.Sim.HasAchiev('One with everything')) {
			if (CM.Sim.Objects[i].amount == 0) oneOfEach = 0;
		}
		if (!CM.Sim.HasAchiev('Mathematician')) {
			if (CM.Sim.Objects[i].amount < Math.min(128, Math.pow(2, (Game.ObjectsById.length - Game.Objects[i].id) - 1))) mathematician = 0;
		}
		if (!CM.Sim.HasAchiev('Base 10')) {
			if (CM.Sim.Objects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id)*10) base10 = 0;
		}
		if (!CM.Sim.HasAchiev('Centennial')) {
			if (CM.Sim.Objects[i].amount < 100) centennial = 0;
		}
		if (!CM.Sim.HasAchiev('Centennial and a half')) {
			if (CM.Sim.Objects[i].amount < 150) centennialhalf = 0;
		}
		if (!CM.Sim.HasAchiev('Bicentennial')) {
			if (CM.Sim.Objects[i].amount < 200) bicentennial = 0;
		}
	}
	if (oneOfEach == 1) CM.Sim.Win('One with everything');
	if (mathematician == 1) CM.Sim.Win('Mathematician');
	if (base10 == 1) CM.Sim.Win('Base 10');
	if (centennial == 1) CM.Sim.Win('Centennial');
	if (centennialhalf == 1) CM.Sim.Win('Centennial and a half');
	if (bicentennial == 1) CM.Sim.Win('Bicentennial');

	if (buildingsOwned >= 100) CM.Sim.Win('Builder');
	if (buildingsOwned >= 400) CM.Sim.Win('Architect');
	if (buildingsOwned >= 800) CM.Sim.Win('Engineer');
	if (buildingsOwned >= 1500) CM.Sim.Win('Lord of Constructs');
	
	if (CM.Sim.UpgradesOwned >= 20) CM.Sim.Win('Enhancer');
	if (CM.Sim.UpgradesOwned >= 50) CM.Sim.Win('Augmenter');
	if (CM.Sim.UpgradesOwned >= 100) CM.Sim.Win('Upgrader');
	if (CM.Sim.UpgradesOwned >= 150) CM.Sim.Win('Lord of Progress');
	
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
		}
		else if (i == 'Grandma') {
			if (me.amount >= 1) CM.Sim.Win('Grandma\'s cookies');
			if (me.amount >= 50) CM.Sim.Win('Sloppy kisses');
			if (me.amount >= 100) CM.Sim.Win('Retirement home');
			if (me.amount >= 150) CM.Sim.Win('Friend of the ancients');
			if (me.amount >= 200) CM.Sim.Win('Ruler of the ancients');
			if (me.amount >= 250) CM.Sim.Win('The old never bothered me anyway');
		}
		else if (i == 'Farm') {
			if (me.amount >= 1) CM.Sim.Win('My first farm');
			if (me.amount >= 50) CM.Sim.Win('Reap what you sow');
			if (me.amount >= 100) CM.Sim.Win('Farm ill');
			if (me.amount >= 150) CM.Sim.Win('Perfected agriculture');
			if (me.amount >= 200) CM.Sim.Win('Homegrown');
		}
		else if (i == 'Factory') {
			if (me.amount >= 1) CM.Sim.Win('Production chain');
			if (me.amount >= 50) CM.Sim.Win('Industrial revolution');
			if (me.amount >= 100) CM.Sim.Win('Global warming');
			if (me.amount >= 150) CM.Sim.Win('Ultimate automation');
			if (me.amount >= 200) CM.Sim.Win('Technocracy');
		}
		else if (i == 'Mine') {
			if (me.amount >= 1) CM.Sim.Win('You know the drill');
			if (me.amount >= 50) CM.Sim.Win('Excavation site');
			if (me.amount >= 100) CM.Sim.Win('Hollow the planet');
			if (me.amount >= 150) CM.Sim.Win('Can you dig it');
			if (me.amount >= 200) CM.Sim.Win('The center of the Earth');
		}
		else if (i == 'Shipment') {
			if (me.amount >= 1) CM.Sim.Win('Expedition');
			if (me.amount >= 50) CM.Sim.Win('Galactic highway');
			if (me.amount >= 100) CM.Sim.Win('Far far away');
			if (me.amount >= 150) CM.Sim.Win('Type II civilization');
			if (me.amount >= 200) CM.Sim.Win('We come in peace');
		}
		else if (i == 'Alchemy lab') {
			if (me.amount >= 1) CM.Sim.Win('Transmutation');
			if (me.amount >= 50) CM.Sim.Win('Transmogrification');
			if (me.amount >= 100) CM.Sim.Win('Gold member');
			if (me.amount >= 150) CM.Sim.Win('Gild wars');
			if (me.amount >= 200) CM.Sim.Win('The secrets of the universe');
		}
		else if (i == 'Portal') {
			if (me.amount >= 1) CM.Sim.Win('A whole new world');
			if (me.amount >= 50) CM.Sim.Win('Now you\'re thinking');
			if (me.amount >= 100) CM.Sim.Win('Dimensional shift');
			if (me.amount >= 150) CM.Sim.Win('Brain-split');
			if (me.amount >= 200) CM.Sim.Win('Realm of the Mad God');
		}
		else if (i == 'Time machine') {
			if (me.amount >= 1) CM.Sim.Win('Time warp');
			if (me.amount >= 50) CM.Sim.Win('Alternate timeline');
			if (me.amount >= 100) CM.Sim.Win('Rewriting history');
			if (me.amount >= 150) CM.Sim.Win('Time duke');
			if (me.amount >= 200) CM.Sim.Win('Forever and ever');
		}
		else if (i == 'Antimatter condenser') {
			if (me.amount >= 1) CM.Sim.Win('Antibatter');
			if (me.amount >= 50) CM.Sim.Win('Quirky quarks');
			if (me.amount >= 100) CM.Sim.Win('It does matter!');
			if (me.amount >= 150) CM.Sim.Win('Molecular maestro');
			if (me.amount >= 200) CM.Sim.Win('Walk the planck');
		}
		else if (i == 'Prism') {
			if (me.amount >= 1) CM.Sim.Win('Lone photon');
			if (me.amount >= 50) CM.Sim.Win('Dazzling glimmer');
			if (me.amount >= 100) CM.Sim.Win('Blinding flash');
			if (me.amount >= 150) CM.Sim.Win('Unending glow');
			if (me.amount >= 200) CM.Sim.Win('Rise and shine');
		}
		
		var lastAchievementsOwned = CM.Sim.AchievementsOwned;
		
		CM.Sim.CalculateGains();
		
		CM.Sim.CheckOtherAchiev();
		
		if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
			CM.Sim.CalculateGains();
		}
		
		CM.Cache[target][i] = {};
		CM.Cache[target][i].bonus = CM.Sim.cookiesPs - Game.cookiesPs;
	}
}

CM.Sim.BuyUpgrades = function() {
	CM.Cache.Upgrades = [];
	for (var i in Game.Upgrades) {
		if (Game.Upgrades[i].bought == 0 && Game.Upgrades[i].unlocked) {
			CM.Sim.CopyData();
			var me = CM.Sim.Upgrades[i];
			me.bought = 1;
			if (Game.Upgrades[i].hide != 3) CM.Sim.UpgradesOwned++;

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
	
	CM.Sim.prestige = Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset);
	
	var lastAchievementsOwned = CM.Sim.AchievementsOwned;

	CM.Sim.CalculateGains();
	
	if (lastAchievementsOwned != CM.Sim.AchievementsOwned) {
		CM.Sim.CalculateGains();
	}

	return (CM.Sim.cookiesPs - Game.cookiesPs);
}

/**********
 * Footer *
 **********/

CM.Init();
