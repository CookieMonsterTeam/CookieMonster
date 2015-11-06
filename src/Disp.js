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
			answer = CM.Backup.Beautify(num);
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
		span.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
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
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].className = CM.Disp.colorTextPre + CM.Cache.Objects[i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache.Objects[i].bci, 2);
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
		// label width: 76	timer width: 26 div margin: 20
		var maxWidth = CM.Disp.TimerBar.offsetWidth - 122;
		var count = 0;
		
		if (Game.goldenCookie.life <= 0 && Game.goldenCookie.toDie == 0) {
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
	if (CM.Config.BuildColor == 1) {
		for (var i in CM.Cache.Objects) {
			l('productPrice' + Game.Objects[i].id).style.color = CM.Config.Colors[CM.Cache.Objects[i].color];
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
		span.className = CM.Disp.colorBackPre + color;
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
			if (l('upgrade' + i).childNodes.length > 0) {
				l('upgrade' + i).childNodes[0].className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
			}
			else {
				var div = document.createElement('div');
				div.style.width = '17px';
				div.style.height = '17px';
				div.className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
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
}

CM.Disp.UpdateColors = function() {
	var str = '';
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorTextPre + CM.Disp.colors[i] + ' { color: ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }';
	}
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBackPre + CM.Disp.colors[i] + ' { background-color: ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }';
	}
	for (var i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBorderPre + CM.Disp.colors[i] + ' { border: 1px solid ' + CM.Config.Colors[CM.Disp.colors[i]] + '; }';
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

CM.Disp.CreateResetTooltip = function() {
	CM.Disp.ResetTooltipPlaceholder = document.createElement('div');
	var resetTitleDesc = document.createElement('div');
	resetTitleDesc.style.minWidth = '260px';
	resetTitleDesc.style.marginBottom = '4px';
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = 'The bonus income you would get from new heavenly chips/reset achievements if you have the same buildings/upgrades after reset';
	resetTitleDesc.appendChild(div);
	CM.Disp.ResetTooltipPlaceholder.appendChild(resetTitleDesc);
}

CM.Disp.CreateChoEggTooltip = function() {
	CM.Disp.ChoEggTooltipPlaceholder = document.createElement('div');
	var choEggTitleDesc = document.createElement('div');
	choEggTitleDesc.style.minWidth = '240px';
	choEggTitleDesc.style.marginBottom = '4px';
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = 'The amount of cookies you would get from selling all buildings, popping all wrinklers, and then buying Chocolate egg';
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
		var luckyCur = Math.min(Game.cookies * 0.1, Game.cookiesPs * 60 * 20) + 13;
	
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
		chainReqSpan.className = CM.Disp.colorTextPre + chainColor;
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
		chainReqFrenSpan.className = CM.Disp.colorTextPre + chainColorFrenzy;
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
			var sucked = 0;
			for (var i in Game.wrinklers) {
				sucked += Game.wrinklers[i].sucked;
			}
			sucked *= 1.1;
			if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
			
			if (CM.Config.StatsPref.Wrink) {
				var popAllFrag = document.createDocumentFragment();
				popAllFrag.appendChild(document.createTextNode(Beautify(sucked) + ' '));
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
				var choEggTotal = Game.cookies + CM.Cache.SellAllTotal;
				if (Game.cpsSucked > 0) {
					choEggTotal += sucked;
				}
				choEggTotal *= 0.05;
				stats.appendChild(listing(choEggTitleFrag, document.createTextNode(Beautify(choEggTotal))));
			}
		}
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
	if (CM.Config.UpStats && Game.onMenu == 'stats' && Game.drawT % (Game.fps * 3) != 0 && Game.drawT % Game.fps == 0) Game.UpdateMenu();
}

CM.Disp.UpdateTooltipLocation = function() {
	Game.tooltip.tta.style.top = Math.max(0, Math.min((l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - CM.Disp.TooltipWarnCaut.clientHeight - 64, Game.mouseY - 48)) + 'px';
	if (Game.tooltip.origin == 'wrink') {
		Game.tooltip.tta.style.left = (Game.mouseX + l('tooltip').offsetWidth + 25) + 'px';
		Game.tooltip.tta.style.right = 'auto';
	}
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

CM.Disp.AddTooltipBuildExtra = function() {
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		l('buttonBuy10-' + me.id).onmouseover = function() {CM.Disp.TooltipBuy10 = true;};
		l('buttonBuy10-' + me.id).onmouseout = function() {CM.Disp.TooltipBuy10 = false;};
		l('buttonSell-' + me.id).onmouseover = function() {CM.Disp.TooltipSell = true;};
		l('buttonSell-' + me.id).onmouseout = function() {CM.Disp.TooltipSell = false;};
		l('buttonSellAll-' + me.id).onmouseover = function() {CM.Disp.TooltipSellAll = true;};
		l('buttonSellAll-' + me.id).onmouseout = function() {CM.Disp.TooltipSellAll = false;};
	}
}

CM.Disp.Tooltip = function(type, name) {
	if (type == 'b') {
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		if (CM.Config.TooltipAmor == 1) {
			var buildPrice = CM.Sim.BuildingGetPrice(Game.Objects[name].basePrice, 0, Game.Objects[name].amount);
			var amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split('so far</div>').join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) == 1 ? 'cookie' : 'cookies') + ' left to amortize (' + CM.Disp.GetTimeColor(buildPrice, Game.Objects[name].totalCookies, (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');		
			}
		}
		if (CM.Disp.TooltipBuy10) {
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join(Beautify(CM.Cache.Objects10[name].price));
		}
		if (CM.Disp.TooltipSell) {
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(CM.Sim.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, 1)));
		}
		if (CM.Disp.TooltipSellAll) {
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(CM.Sim.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].amount)));
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
					l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Objects[CM.Disp.tooltipName].color;
					l('CMTooltipBCI').textContent = Beautify(CM.Cache.Objects[CM.Disp.tooltipName].bci, 2);
					l('CMTooltipBCI').className = CM.Disp.colorTextPre + CM.Cache.Objects[CM.Disp.tooltipName].color;
				}
			}
			else {
				bonus = CM.Cache.Objects10[CM.Disp.tooltipName].bonus;
				price = CM.Cache.Objects10[CM.Disp.tooltipName].price;
				if (CM.Config.Tooltip == 1) {
					l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Objects10[CM.Disp.tooltipName].color;
					l('CMTooltipBCI').textContent = Beautify(CM.Cache.Objects10[CM.Disp.tooltipName].bci, 2);
					l('CMTooltipBCI').className = CM.Disp.colorTextPre + CM.Cache.Objects10[CM.Disp.tooltipName].color;
				}
			}
		}
		else { // Upgrades
			bonus = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
			price = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();
			if (CM.Config.Tooltip == 1) {
				l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
				l('CMTooltipBCI').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bci, 2);
				l('CMTooltipBCI').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
			}
		}
		if (CM.Config.Tooltip == 1) {
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
				warn += ((bonusNoFren * 60 * 20) / 0.1);
			}
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
					Game.tooltip.draw(this, escape(placeholder.innerHTML), 'wrink');
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
		sucked *= 1.1;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
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
CM.Disp.colors = [ CM.Disp.colorBlue, CM.Disp.colorGreen, CM.Disp.colorYellow, CM.Disp.colorOrange, CM.Disp.colorRed, CM.Disp.colorPurple, CM.Disp.colorGray];
CM.Disp.lastGoldenCookieState = 'none';

CM.Disp.metric = ['M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
CM.Disp.shortScale = ['M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec'];

CM.Disp.TooltipBuy10 = false;
CM.Disp.TooltipSell = false;
CM.Disp.TooltipSellAll = false;

CM.Disp.TooltipWrinklerArea = 0;
CM.Disp.TooltipWrinkler = -1;
CM.Disp.TooltipWrinklerCache = [];
for (var i = 0; i < 10; i++) {
	CM.Disp.TooltipWrinklerCache[i] = 0;
}

