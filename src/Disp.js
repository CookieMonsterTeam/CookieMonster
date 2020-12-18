/********
 * Disp *
 ********/

/********
 * Please make sure to annotate your code correctly using JSDoc.
 * Only put functions related to graphics and displays in this file. 
 * All calculations and data should preferrably be put in other files. */

/********
 * Section: Auxilirary functions used by other functions

/**
 * This function returns the total amount stored in the Wrinkler Bank 
 * as calculated by CM.Cache.RemakeWrinkBank() if CM.Config.CalcWrink is set
 * @returns	{number}	0 or the amount of cookies stored (CM.Cache.WrinkBankTotal)
 */
CM.Disp.GetWrinkConfigBank = function() {
	if (CM.Config.CalcWrink)
		return CM.Cache.WrinkBankTotal;
	else
		return 0;
}

/**
 * This function pops all normal wrinklers 
 * It is called by a click of the 'pop all' button created by CM.Disp.AddMenuStats()
 */
CM.Disp.PopAllNormalWrinklers = function() {
	for (var i in Game.wrinklers) {
		if (Game.wrinklers[i].sucked > 0 && Game.wrinklers[i].type == 0) {
			Game.wrinklers[i].hp = 0;
		}
	}
}

/**
 * This function returns the cps as either current or average CPS depending on CM.Config.CPSMode
 * @returns	{number}	The average or current cps
 */
CM.Disp.GetCPS = function() {
	if (CM.Config.CPSMode)
		return CM.Cache.AvgCPS;
	else
		return (Game.cookiesPs * (1 - Game.cpsSucked));
}

/**
 * This function calculates the time it takes to reach a certain magic level
 * It is called by CM.Disp.UpdateTooltipGrimoire()
 * @param	{number}	currentMagic		The current magic level
 * @param	{number}	maxMagic			The user's max magic level
 * @param	{number}	targetMagic			The target magic level
 * @returns	{number}	count / Game.fps	The time it takes to reach targetMagic
 */
CM.Disp.CalculateGrimoireRefillTime = function(currentMagic, maxMagic, targetMagic) {
	var count = 0;
	while (currentMagic < targetMagic) {
		currentMagic += Math.max(0.002, Math.pow(currentMagic / Math.max(maxMagic, 100), 0.5)) * 0.002;
		count++;
	}
	return count / Game.fps;
}

/**
 * This function returns Name and Color as object for sugar lump type that is given as input param.
 * It is called by CM.Disp.UpdateTooltipSugarLump()
 * TODO: Can't this be done with a normal array in Data.js? Or as variable-array at end of this file?
 * @param 	{string} 				type 			Sugar Lump Type.
 * @returns {{string}, {string}}	text, color		An array containing the text and display-color of the sugar lump
 */
CM.Disp.GetLumpColor = function(type) {
	var name = "";
	var color = "";

	switch (type) {
		case 0:
			name = "Normal";
			color = CM.Disp.colorGray;
			break;
		case 1:
            name = "Bifurcated";
            color = CM.Disp.colorGreen;
			break;
		case 2:
            name = "Golden";
            color = CM.Disp.colorYellow;
			break;
		case 3:
            name = "Meaty";
            color = CM.Disp.colorOrange;
			break;
		case 4:
            name = "Caramelized";
            color = CM.Disp.colorPurple;
			break;
		default:
			name = "Unknown Sugar Lump";
			color = CM.Disp.colorRed;
			break;
	}

    return {text: name, color: color};
};

/********
 * Section: General functions to format or beautify strings */

/**
 * This function returns time as a string depending on TimeFormat setting
 * @param  	{number} 	time		Time to be formatted
 * @param  	{number}	longFormat 	1 or 0
 * @returns	{string}				Formatted time
 */
CM.Disp.FormatTime = function(time, longFormat) {
	if (time == Infinity) return time;
	time = Math.ceil(time);
	var y = Math.floor(time / 31557600);
	var d = Math.floor(time % 31557600 / 86400);
	var h = Math.floor(time % 86400 / 3600);
	var m = Math.floor(time % 3600 / 60);
	var s = Math.floor(time % 60);
	var str = '';
	if (CM.Config.TimeFormat) {
		if (time > 3155760000) return 'XX:XX:XX:XX:XX';
		str += (y < 10 ? '0' : '') + y + ':';
		str += (d < 10 ? '0' : '') + d + ':';
		str += (h < 10 ? '0' : '') + h + ':';
		str += (m < 10 ? '0' : '') + m + ':';
		str += (s < 10 ? '0' : '') + s + ':';
	} else {
		if (time > 777600000) return longFormat ? 'Over 9000 days!' : '>9000d';
		str += (d > 0 ? d + (longFormat ? (d == 1 ? ' day' : ' days') : 'd') + ', ': "");
		if (str.length > 0 || h > 0) str += h + (longFormat ? (h == 1 ? ' hour' : ' hours') : 'h') + ', ';
		if (str.length > 0 || m > 0) str += m + (longFormat ? (m == 1 ? ' minute' : ' minutes') : 'm') + ', ';
		str += s + (longFormat ? (s == 1 ? ' second' : ' seconds') : 's');
	}
	return str;
}

/**
 * This function returns the color to be used for time-strings
 * @param	{number}			time			Time to be coloured
 * @returns {{string, string}}	{text, color}	Both the formatted time and color as strings in an array
 */
CM.Disp.GetTimeColor = function(time) {
	var color;
	var text;
	if (time < 0) {
		if (CM.Config.TimeFormat) text = '00:00:00:00:00';
		else text = 'Done!';
		color = CM.Disp.colorGreen;
	} 
	else {
		text = CM.Disp.FormatTime(time);
		if (time > 300) color =  CM.Disp.colorRed;
		else if (time > 60) color =  CM.Disp.colorOrange;
		else color =  CM.Disp.colorYellow;
	}
	return {text: text, color: color};
}

/**
 * This function returns formats number based on the Scale setting
 * @param	{number}	num		Number to be beautified
 * @param 	{any}		frac 	Used in some scenario's by CM.Backup.Beautify (Game's original function)
 * @param	{number}	forced	Used to force (type 3) in certains cases
 * @returns	{string}			Formatted number
 */
CM.Disp.Beautify = function(num, frac, forced) {
	var decimals = CM.Config.ScaleDecimals + 1;
	if (CM.Config.Scale == 0) {
		return CM.Backup.Beautify(num, frac);
	}
	else if (isFinite(num)) {
		var answer = '';
		if (num < 0) {
			num = Math.abs(num);
			var negative = true;
		}
		num = num.toString();
		var timesTenToPowerThree = Math.trunc(Math.log10(num) / 3)
		if (num == "0") {
			return num
		}
		else if (-1 < timesTenToPowerThree && timesTenToPowerThree < 2) {
			// TODO: Add changing separators of thousands and making this cut-off user configurable
			answer = Math.round(num * 100) / 100;
		}
		else if (CM.Config.Scale == 3 && !forced || forced == 3) { // Scientific notation, 123456789 => 1.235E+8
			answer = num[0] + (CM.Config.ScaleSeparator ? ',' : '.');
			i = 0;
			while (i < decimals - 1) {
				answer += num[i + 2]; // num has a 0-based index and [1] is a '.'
				i++;
			}
			lastNumber = Math.round(num[i + 2] + '.' + num[i + 3]);
			while (lastNumber >= 10) {
				if (answer[answer.length - 1] != ".") {
					lastNumber = Math.round((answer[answer.length - 1] * 10) + lastNumber) / 10;
					answer = answer.slice(0,-1)
				} else {
					lastNumber = Math.round((answer[answer.length - 2] * 10) + lastNumber) / 10;
					answer = answer.slice(0,-2)
				}
			}
			answer += lastNumber;
			answer += 'E+' + Math.trunc(Math.log10(num));
		}
		else {
			var restOfNumber = (num / Math.pow(10, (timesTenToPowerThree * 3))).toString();
			// Check if number contains decimals
			numbersToAdd = (restOfNumber.indexOf('.') > -1 ? restOfNumber.indexOf('.') + 1 + decimals : (restOfNumber.length))
			i = 0
			while (i < numbersToAdd - 1 && i < restOfNumber.length - 1) {
				answer += (CM.Config.ScaleSeparator && restOfNumber[i] == '.' ? ',' : restOfNumber[i]);
				i++
			}
			answer += (i + 1 < restOfNumber.length ? Math.round(restOfNumber[i] + '.' + restOfNumber[i + 1]) : restOfNumber[i]);

			// answer is now "xxx.xx" (e.g., 123456789 would be 123.46)
			if (CM.Config.Scale == 1 && !forced || forced == 1) { // Metric scale, 123456789 => 123.457 M
				if (timesTenToPowerThree - 1 < CM.Data.metric.length) {
					answer += ' ' + CM.Data.metric[timesTenToPowerThree - 1]
				}
				else { // If number is too large, revert to scientific notation
					return CM.Disp.Beautify(num, 0, 3);	
				}
			}
			else if (CM.Config.Scale == 2 && !forced || forced == 2) { // Short scale, 123456789 => 123.457 M
				if (timesTenToPowerThree < CM.Data.shortScale.length + 1) {
					answer += ' ' + CM.Data.shortScale[timesTenToPowerThree - 1];
				}
				else { // If number is too large, revert to scientific notation
					return CM.Disp.Beautify(num, 0, 3);
				}
			}
			else if (CM.Config.Scale == 4 && !forced || forced == 4) { // Engineering notation, 123456789 => 123.457E+6
				answer += 'E+' + (timesTenToPowerThree * 3);
			}
		}
		if (answer === '') {
			console.log("Could not beautify number with CM.Disp.Beautify:" + num);
			answer = CM.Backup.Beautify(num, frac); 
		}
		if (negative) answer = '-' + answer;
		return answer.toString();
	}
	else if (num == Infinity) {
		return "Infinity";
	}
	else {
		console.log("Could not beautify number with CM.Disp.Beautify:" + num);
		return CM.Backup.Beautify(num, frac);
	}
}

/********
 * Section: General functions related to display, drawing and initialization of the page */

/**
 * This function disables and shows the bars created by CookieMonster when the game is "ascending"
 * It is called by CM.Loop()
 */
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

/**
 * This function creates a CSS style that stores certain standard CSS classes used by CookieMonster
 * It is called by CM.DelayInit()
 */
CM.Disp.CreateCssArea = function() {
	CM.Disp.Css = document.createElement('style');
	CM.Disp.Css.type = 'text/css';

	document.head.appendChild(CM.Disp.Css);
}

/**
 * TODO: What does this do? @Aktanusa
 * It is called by CM.Init()
 */
CM.Disp.AddJscolor = function() {
	CM.Disp.Jscolor = document.createElement('script');
	CM.Disp.Jscolor.type = 'text/javascript';
	CM.Disp.Jscolor.setAttribute('src', 'https://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(CM.Disp.Jscolor);
}

/**
 * This function sets the size of the background of the full game and the left column
 * depending on whether certain abrs are activated
 * It is called by CM.Disp.UpdateAscendState() and CM.Disp.UpdateBotTimerBarPosition()
 */
CM.Disp.UpdateBackground = function() {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
}

/**
 * This function handles custom drawing for the Game.Draw() function.
 * It is hooked on 'draw' by CM.RegisterHooks()
 */
CM.Disp.Draw = function () {
	// Draw autosave timer in stats menu
	if (
		(Game.prefs.autosave && Game.drawT % 10 == 0) && // with autosave ON and every 10 ticks
		(Game.onMenu == 'stats' && CM.Config.Stats) // while being on the stats menu only
	) {
		var timer = document.getElementById('CMStatsAutosaveTimer');
		if (timer) {
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.T % (Game.fps * 60)), 4);
		}
	}
}

/********
 * Section: Functions related to the Bottom Bar */

/**
 * This function toggle the bottom bar
 * It is called by CM.Disp.UpdateAscendState() and a change in CM.Config.BotBar
 */
CM.Disp.ToggleBotBar = function() {
	if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.display = '';
		CM.Disp.UpdateBotBar();
	}
	else {
		CM.Disp.BotBar.style.display = 'none';
	}
	CM.Disp.UpdateBotTimerBarPosition();
}

/**
 * This function creates the bottom bar and appends it to l('wrapper')
 * It is called by CM.DelayInit and a change in CM.Config.BotBar
 */
CM.Disp.CreateBotBar = function() {
	CM.Disp.BotBar = document.createElement('div');
	CM.Disp.BotBar.id = 'CMBotBar';
	CM.Disp.BotBar.style.height = '69px';
	CM.Disp.BotBar.style.width = '100%';
	CM.Disp.BotBar.style.position = 'absolute';
	CM.Disp.BotBar.style.display = 'none';
	CM.Disp.BotBar.style.backgroundColor = '#262224';
	// This is old code for very old browsersand should not be needed anymore
	//CM.Disp.BotBar.style.backgroundImage = '-moz-linear-gradient(top, #4d4548, #000000)';
	//CM.Disp.BotBar.style.backgroundImage = '-o-linear-gradient(top, #4d4548, #000000)';
	//CM.Disp.BotBar.style.backgroundImage = '-webkit-linear-gradient(top, #4d4548, #000000)';
	CM.Disp.BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
	CM.Disp.BotBar.style.borderTop = '1px solid black';
	CM.Disp.BotBar.style.overflow = 'auto';
	CM.Disp.BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';

	var table = CM.Disp.BotBar.appendChild(document.createElement('table'));
	table.style.width = '100%';
	table.style.textAlign = 'center';
	table.style.whiteSpace = 'nowrap';
	var tbody = table.appendChild(document.createElement('tbody'));

	var firstCol = function(text, color) {
		var td = document.createElement('td');
		td.style.textAlign = 'right';
		td.className = CM.Disp.colorTextPre + color;
		td.textContent = text;
		return td;
	}
	var type = tbody.appendChild(document.createElement('tr'));
	type.style.fontWeight = 'bold';
	type.appendChild(firstCol(CM.VersionMajor + '.' + CM.VersionMinor, CM.Disp.colorYellow));
	var bonus = tbody.appendChild(document.createElement('tr'));
	bonus.appendChild(firstCol('Bonus Income', CM.Disp.colorBlue));
	var pp = tbody.appendChild(document.createElement('tr'));
	pp.appendChild(firstCol('Payback Period', CM.Disp.colorBlue));
	var time = tbody.appendChild(document.createElement('tr'));
	time.appendChild(firstCol('Time Left', CM.Disp.colorBlue));

	for (var i in Game.Objects) {
		CM.Disp.CreateBotBarBuildingColumn(i);
	}

	l('wrapper').appendChild(CM.Disp.BotBar);
}

/**
 * This function updates the bonus-, pp-, and time-rows in the the bottom bar
 * It is called by CM.Loop()
 */
CM.Disp.UpdateBotBar = function() {
	if (CM.Config.BotBar == 1) {
		var count = 0;
		for (var i in CM.Cache.Objects) {
			var target = 'Objects';
			if (Game.buyBulk == 10) {target = 'Objects10';}
			if (Game.buyBulk == 100) {target = 'Objects100';}
			count++;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].textContent = Game.Objects[i].amount;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify(CM.Cache[target][i].bonus, 2);
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].className = CM.Disp.colorTextPre + CM.Cache[target][i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache[target][i].pp, 2);
			var timeColor = CM.Disp.GetTimeColor((Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].className = CM.Disp.colorTextPre + timeColor.color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
}

/**
 * This function extends the bottom bar (created by CM.Disp.CreateBotBar) with a column for the given building.
 * This function is called by CM.Disp.CreateBotBar on initialization of Cookie Monster,
 * and also in CM.Sim.CopyData if a new building (added by another mod) is discovered.
 * @param	{string}	buildingName	Objectname to be added (e.g., "Cursor")
 */
CM.Disp.CreateBotBarBuildingColumn = function(buildingName) {
	if(!CM.Disp.BotBar) {
		CM.Disp.CreateBotBar();
		return; // CreateBotBar will call this function again
	}

	var type  = CM.Disp.BotBar.firstChild.firstChild.childNodes[0];
	var bonus = CM.Disp.BotBar.firstChild.firstChild.childNodes[1];
	var pp    = CM.Disp.BotBar.firstChild.firstChild.childNodes[2];
	var time  = CM.Disp.BotBar.firstChild.firstChild.childNodes[3];

	var i = buildingName;
	var header = type.appendChild(document.createElement('td'));
	header.appendChild(document.createTextNode((i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' ('));

	var span = header.appendChild(document.createElement('span'));
	span.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;

	header.appendChild(document.createTextNode(')'));
	bonus.appendChild(document.createElement('td'));
	pp.appendChild(document.createElement('td'));
	time.appendChild(document.createElement('td'));
}

/********
 * Section: Functions related to the Timer Bar 

/**
 * This function creates the TimerBar and appends it to l('wrapper')
 * It is called by CM.DelayInit()
 */
CM.Disp.CreateTimerBar = function() {
	CM.Disp.TimerBar = document.createElement('div');
	CM.Disp.TimerBar.id = 'CMTimerBar';
	CM.Disp.TimerBar.style.position = 'absolute';
	CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.TimerBar.style.height = '48px';
	CM.Disp.TimerBar.style.fontSize = '10px';
	CM.Disp.TimerBar.style.fontWeight = 'bold';
	CM.Disp.TimerBar.style.backgroundColor = 'black';

	CM.Disp.TimerBars = {};
	CM.Disp.BuffTimerBars = {};

	// Create standard Golden Cookie bar
	CM.Disp.TimerBars['CMTimerBarGC'] = CM.Disp.TimerBarCreateBar('CMTimerBarGC', 
		'Next Cookie', 
		[{id: 'CMTimerBarGCMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarGCBar', color: CM.Disp.colorPurple}]
		);
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBars['CMTimerBarGC'])

	// Create standard Reindeer bar
	CM.Disp.TimerBars['CMTimerBarRen'] = CM.Disp.TimerBarCreateBar('CMTimerBarRen', 
		'Next Reindeer', 
		[{id: 'CMTimerBarRenMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarRenBar', color: CM.Disp.colorOrange}]
		);
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBars['CMTimerBarRen'])

	l('wrapper').appendChild(CM.Disp.TimerBar);
}

/**
 * This function creates an indivudual timer for the timer bar
 * It is called by CM.DelayInit()
 * @param	{string}					id					An id to identify the timer
 * @param	{string}					name				The title of the timer
 * @param	[{{string}, {string}}, ...]	bars ([id, color])	The id and colours of individual parts of the timer
 */
CM.Disp.TimerBarCreateBar = function(id, name, bars) {
	timerBar = document.createElement('div');
	timerBar.id = 'CMTimerBarGC';
	timerBar.style.height = '12px';
	timerBar.style.margin = '0px 10px';
	timerBar.style.position = 'relative';

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
	type.style.width = '108px';
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
	timer.id = id + 'Time';
	timer.style.marginLeft = '5px';
	timer.style.verticalAlign = 'text-top';
	div.appendChild(timer);
	
	timerBar.appendChild(div);

	return timerBar;
}

/**
 * This function creates an indivudual timer for the timer bar
 * It is called by CM.Loop()
 */
CM.Disp.UpdateTimerBar = function() {
	if (CM.Config.TimerBar == 1) {
		// label width: 113, timer width: 26, div margin: 20
		var maxWidth = CM.Disp.TimerBar.offsetWidth - 159;
		var numberOfTimers = 0;

		// Regulates visibility of Golden Cookie timer
		if (Game.shimmerTypes['golden'].spawned == 0 && !Game.Has('Golden switch [off]')) {
			CM.Disp.TimerBars['CMTimerBarGC'].style.display = '';
			l('CMTimerBarGCMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes['golden'].minTime - Game.shimmerTypes['golden'].time) * maxWidth / Game.shimmerTypes['golden'].maxTime) + 'px';
			if (Game.shimmerTypes['golden'].minTime == Game.shimmerTypes['golden'].maxTime) {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '10px';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '10px';
			}
			else {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '';
			}
			l('CMTimerBarGCBar').style.width = Math.round(Math.min(Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].minTime, Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) * maxWidth / Game.shimmerTypes['golden'].maxTime) + 'px';
			l('CMTimerBarGCTime').textContent = Math.ceil((Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) / Game.fps);
			numberOfTimers++;
		}
		else CM.Disp.TimerBars['CMTimerBarGC'].style.display = 'none';

		// Regulates visibility of Reinder timer
		if (Game.season == 'christmas' && Game.shimmerTypes['reindeer'].spawned == 0) {
			CM.Disp.TimerBars['CMTimerBarRen'].style.display = '';
			l('CMTimerBarRenMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes['reindeer'].minTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenBar').style.width = Math.round(Math.min(Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].minTime, Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenTime').textContent = Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps);
			numberOfTimers++;
		}
		else {
			CM.Disp.TimerBars['CMTimerBarRen'].style.display = 'none';
		}

		// On every frame all buff-timers are deleted and re-created
		for (var i in CM.Disp.BuffTimerBars) {
			CM.Disp.BuffTimerBars[i].remove()
		}
		CM.Disp.BuffTimerBars = {}
		for (var i in Game.buffs) {
			if (Game.buffs[i]) {
				timer = CM.Disp.TimerBarCreateBar(Game.buffs[i].name, Game.buffs[i].name, [{id: Game.buffs[i].name + 'Bar'}])
				timer.style.display = '';
				var classColor = '';
				// Gives specific timers specific colors
				if (typeof CM.Disp.buffColors[Game.buffs[i].name] !== 'undefined') {
					classColor = CM.Disp.buffColors[Game.buffs[i].name];
				}
				else classColor = CM.Disp.colorPurple;
				timer.lastChild.children[1].className = CM.Disp.colorBackPre + classColor;
				timer.lastChild.children[1].style.width = Math.round(Game.buffs[i].time * maxWidth / Game.buffs[i].maxTime) + 'px';
				timer.lastChild.children[2].textContent = Math.ceil(Game.buffs[i].time / Game.fps);
				numberOfTimers++;
				CM.Disp.BuffTimerBars[Game.buffs[i].name] = timer
			}
		}
		for (var i in CM.Disp.BuffTimerBars) {
			CM.Disp.TimerBar.appendChild(CM.Disp.BuffTimerBars[i])
		}

		if (numberOfTimers != 0) {
			var height = 48 / numberOfTimers;
			for (var i in CM.Disp.TimerBars) {
				CM.Disp.TimerBars[i].style.height = height + 'px';
			}
			for (var i in CM.Disp.BuffTimerBars) {
				CM.Disp.BuffTimerBars[i].style.height = height + 'px';
			}
		}
	}
}

/**
 * This function changes the visibility of the timer bar
 * It is called by CM.Disp.UpdateAscendState() or a change in CM.Config.TimerBar
 */
CM.Disp.ToggleTimerBar = function() {
	if (CM.Config.TimerBar == 1) CM.Disp.TimerBar.style.display = '';
	else CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.UpdateBotTimerBarPosition();
}

/**
 * This function changes the position of the timer bar
 * It is called by a change in CM.Config.TimerBarPos
 */
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
	CM.Disp.UpdateBotTimerBarPosition();
}

/********
 * Section: Functions related to the both the bottom and timer bar

/**
 * This function changes the position of both the bottom and timer bar
 * It is called by CM.Disp.ToggleTimerBar(), CM.Disp.ToggleTimerBarPos() and CM.Disp.ToggleBotBar()
 */
CM.Disp.UpdateBotTimerBarPosition = function() {
	if (CM.Config.BotBar == 1 && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 1) {
		CM.Disp.BotBar.style.bottom = '48px';
		l('game').style.bottom = '118px';
	}
	else if (CM.Config.BotBar == 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '70px';
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

/********
 * Section: Functions related to right column of the screen (buildings/upgrades)

/**
 * This function adjusts some things in the column of buildings.
 * It colours them, helps display the correct sell-price and shuffles the order when CM.Config.SortBuildings is set
 * The function is called by CM.Loop(), CM.Disp.UpdateColors() & CM.Disp.RefreshScale()
 * And by changes in CM.Config.BuildColor, CM.Config.SortBuild & CM.ConfigData.BulkBuildColor
 */
CM.Disp.UpdateBuildings = function() {
	if (CM.Config.BuildColor == 1 && Game.buyMode == 1) {
		var target = '';
		if (Game.buyBulk == 10 && CM.Config.BulkBuildColor == 1) target = 'Objects10';
		else if (Game.buyBulk == 100 && CM.Config.BulkBuildColor == 1) target = 'Objects100';
		else target = 'Objects';
		for (var i in CM.Cache[target]) {
			l('productPrice' + Game.Objects[i].id).style.color = CM.Config.Colors[CM.Cache[target][i].color];
		}
	}
	else if (Game.buyMode == -1) {
		for (var i in CM.Cache.Objects) {
			var o = Game.Objects[i];
			l('productPrice' + o.id).style.color = '';
			/*
			 * Fix sell price displayed in the object in the store.
			 *
			 * The buildings sell price displayed by the game itself (without any mod) is incorrect.
			 * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
			 * 
			 * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
			 */
			l('productPrice' + o.id).innerHTML = Beautify(CM.Sim.BuildingSell(o, o.basePrice, o.amount, o.free, Game.buyBulk, 1));
		}
	}
	
	// Build array of pointers, sort by pp, use array index (+2) as the grid row number
	// (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
	// This regulates sorting of buildings
	if (Game.buyMode == 1 && CM.Config.SortBuildings) {
		var arr = Object.keys(CM.Cache[target]).map(k =>
		{
			var o = CM.Cache[target][k];
			o.name = k;
			o.id = Game.Objects[k].id;
			return o;
		});

		arr.sort(function(a, b){ return (a.pp > b.pp ? 1 : (a.pp < b.pp ? -1 : 0)) });

		for (var x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = (x + 2) + "/" + (x + 2);
		}
	} else {
		var arr = Object.keys(CM.Cache.Objects).map(k =>
			{
				var o = CM.Cache.Objects[k];
				o.name = k;
				o.id = Game.Objects[k].id;
				return o;
			});
		arr.sort((a, b) => a.id - b.id);
		for (var x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = (x + 2) + "/" + (x + 2);
		}
	}
}

/**
 * This function adjusts some things in the upgrades section
 * It colours them and shuffles the order when CM.Config.SortBuildings is set
 * The function is called by CM.Loop(), CM.Disp.ToggleUpgradeBarAndColor & CM.Disp.RefreshScale()
 * And by changes in CM.Config.SortUpgrades
 */
CM.Disp.UpdateUpgrades = function() {
	// This counts the amount of upgrades for each pp group and updates the Upgrade Bar
	if (CM.Config.UpBarColor > 0) {
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
	
	// Build array of pointers, sort by pp, set flex positions
	// This regulates sorting of upgrades
	var arr = [];
	for (var x = 0; x < Game.UpgradesInStore.length; x++){
		var o = {};
		o.name = Game.UpgradesInStore[x].name;
		o.price = Game.UpgradesInStore[x].basePrice;
		o.pp = CM.Cache.Upgrades[o.name].pp;
		arr.push(o);
	}

	if (CM.Config.SortUpgrades)
		arr.sort((a, b) => a.pp - b.pp);
	else
		arr.sort((a, b) => a.price - b.price);

	for (var x = 0; x < Game.UpgradesInStore.length; x++){
		l("upgrade" + x).style.order = arr.findIndex(e => e.name === Game.UpgradesInStore[x].name) + 1
	}
}

/********
 * Section: Functions related to the Upgrade Bar

/**
 * This function toggles the upgrade bar and the colours of upgrades
 * It is called by a change in CM.Config.UpBarColor
 */
CM.Disp.ToggleUpgradeBarAndColor = function() {
	if (CM.Config.UpBarColor == 1) { // Colours and bar on
		CM.Disp.UpgradeBar.style.display = '';
		CM.Disp.UpdateUpgrades();
	}
	else if (CM.Config.UpBarColor == 2) {// Colours on and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		CM.Disp.UpdateUpgrades();
	}
	else { // Colours and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
}

/**
 * This function toggles the position of the upgrade bar from fixed or non-fixed mode
 * It is called by a change in CM.Config.UpgradeBarFixedPos
 */
CM.Disp.ToggleUpgradeBarFixedPos = function() {
	if (CM.Config.UpgradeBarFixedPos == 1) { // Fix to top of screen when scrolling
		CM.Disp.UpgradeBar.style.position = 'sticky';
		CM.Disp.UpgradeBar.style.top = '0px';
	}
	else {
		CM.Disp.UpgradeBar.style.position = ''; // Possible to scroll offscreen
	}
}

/**
 * This function creates the upgrade bar above the upgrade-section in the right section of the screen
 * The number (.textContent) of upgrades gets updated by CM.Disp.UpdateUpgrades()
 */
CM.Disp.CreateUpgradeBar = function() {
	CM.Disp.UpgradeBar = document.createElement('div');
	CM.Disp.UpgradeBar.id = 'CMUpgradeBar';
	CM.Disp.UpgradeBar.style.width = '100%';
	CM.Disp.UpgradeBar.style.backgroundColor = 'black';
	CM.Disp.UpgradeBar.style.textAlign = 'center';
	CM.Disp.UpgradeBar.style.fontWeight = 'bold';
	CM.Disp.UpgradeBar.style.display = 'none';
 	CM.Disp.UpgradeBar.style.zIndex = '21';
	CM.Disp.UpgradeBar.onmouseout = function() { Game.tooltip.hide(); };

	var placeholder = document.createElement('div');
	placeholder.appendChild(CM.Disp.CreateUpgradeBarLegend());
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

/**
 * This function creates the legend for the upgrade bar, it is called by CM.Disp.CreateUpgradeBar
 * @returns	{object}	legend	The legend-object to be added
 */
CM.Disp.CreateUpgradeBarLegend = function() {
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

	legend.appendChild(legendLine(CM.Disp.colorBlue, 'Better than best PP building'));
	legend.appendChild(legendLine(CM.Disp.colorGreen, 'Same as best PP building'));
	legend.appendChild(legendLine(CM.Disp.colorYellow, 'Between best and worst PP buildings closer to best'));
	legend.appendChild(legendLine(CM.Disp.colorOrange, 'Between best and worst PP buildings closer to worst'));
	legend.appendChild(legendLine(CM.Disp.colorRed, 'Same as worst PP building'));
	legend.appendChild(legendLine(CM.Disp.colorPurple, 'Worse than worst PP building'));
	legend.appendChild(legendLine(CM.Disp.colorGray, 'Negative or infinity PP'));
	return legend;
}

/********
 * Section: Functions related to the flashes/sound/notifications

/**
 * This function creates a white square over the full screen and appends it to l('wrapper')
 * It is used by CM.Disp.Flash() to create the effect of a flash and called by CM.DelayInit()
 */
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

/**
 * This function creates a flash depending on configs. It is called by all functions 
 * that check game-events and which have settings for Flashes (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{number}	mode	Sets the intensity of the flash, used to recursively dim flash
 * 								All calls of function have use mode == 3
 * @param	{string}	config	The setting in CM.Config that is checked before creating the flash
 */
CM.Disp.Flash = function(mode, config) {
	if ((CM.Config[config] == 1 && mode == 3) || mode == 1) {
		CM.Disp.WhiteScreen.style.opacity = '0.5';
		if (mode == 3) {
			CM.Disp.WhiteScreen.style.display = 'inline';
			setTimeout(function() {CM.Disp.Flash(2, config);}, 1000/Game.fps);
		}
		else {
			setTimeout(function() {CM.Disp.Flash(0, config);}, 1000/Game.fps);
		}
	}
	else if (mode == 2) {
		CM.Disp.WhiteScreen.style.opacity = '1';
		setTimeout(function() {CM.Disp.Flash(1, config);}, 1000/Game.fps);
	}
	else if (mode == 0) CM.Disp.WhiteScreen.style.display = 'none';
}

/**
 * This function plays a sound depending on configs. It is called by all functions 
 * that check game-events and which have settings for sound (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{variable}	url			A variable that gives the url for the sound (e.g., CM.Config.GCSoundURL)
 * @param	{string}	sndConfig	The setting in CM.Config that is checked before creating the sound
 * @param	{string}	volConfig	The setting in CM.Config that is checked to determine volume
 */
CM.Disp.PlaySound = function(url, sndConfig, volConfig) {
	if (CM.Config[sndConfig] == 1) {
		var sound = new realAudio(url);
		sound.volume = (CM.Config[volConfig] / 100) * (Game.volume / 100); 
		sound.play();
	}
}

/**
 * This function creates a notifcation depending on configs. It is called by all functions 
 * that check game-events and which have settings for notifications (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{string}	notifyConfig	The setting in CM.Config that is checked before creating the notification
 * @param	{string}	title			The title of the to-be created notifications
 * @param	{string}	message			The text of the to-be created notifications
 */
CM.Disp.Notification = function(notifyConfig, title, message) {
	if (CM.Config[notifyConfig] == 1 && document.visibilityState == 'hidden') {
		var CookieIcon = 'https://orteil.dashnet.org/cookieclicker/favicon.ico'
		notification = new Notification(title, {body: message, badge: CookieIcon});
	}
}

/********
 * Section: Functions related to updating the tab in the browser's tab-bar

/**
 * This function creates the Favicon, it is called by CM.DelayInit()
 */
CM.Disp.CreateFavicon = function() {
	CM.Disp.Favicon = document.createElement('link');
	CM.Disp.Favicon.id = 'CMFavicon';
	CM.Disp.Favicon.rel = 'shortcut icon';
	CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(CM.Disp.Favicon);
}

/**
 * This function updates the Favicon depending on whether a Golden Cookie has spawned
 * It is called on every loop by CM.Main.CheckGoldenCookie() or by a change in CM.Config.Favicon 
 * By relying on CM.Cache.spawnedGoldenShimmer it only changes for non-user spawned cookie
 */
CM.Disp.UpdateFavicon = function() {
	if (CM.Config.Favicon == 1 && CM.Main.lastGoldenCookieState > 0) {
		if (CM.Cache.spawnedGoldenShimmer.wrath) CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/wrathCookie.ico';
		else CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/goldenCookie.ico';
	}
	else CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
}

/**
 * This function updates the tab title
 * It is called on every loop by Game.Logic() which also sets CM.Cache.Title to Game.cookies
 */
CM.Disp.UpdateTitle = function() {
	if (Game.OnAscend || CM.Config.Title == 0) {
		document.title = CM.Cache.Title;
	}
	else if (CM.Config.Title == 1) {
		var addFC = false;
		var addSP = false;
		var titleGC;
		var titleFC;
		var titleSP;
		
		if (CM.Cache.spawnedGoldenShimmer) {
			if (CM.Cache.spawnedGoldenShimmer.wrath) titleGC = '[W ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
			else titleGC = '[G ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
		}
		else if (!Game.Has('Golden switch [off]')) {
			titleGC = '[' +  Math.ceil((Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) / Game.fps) + ']';
		}
		else titleGC = '[GS]'

		if (CM.Main.lastTickerFortuneState) {
			addFC = true;
			titleFC = '[F]';
		}

		if (Game.season == 'christmas') {
			addSP = true;
			if (CM.Main.lastSeasonPopupState) titleSP = '[R ' +  Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps) + ']';
			else {
				titleSP = '[' +  Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps) + ']';
			}
		}

		// Remove previous timers and add current cookies
		var str = CM.Cache.Title;
		if (str.charAt(0) == '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}
		document.title = titleGC + (addFC ? titleFC : '') + (addSP ? titleSP : '') + ' ' + str;
	}
	else if (CM.Config.Title == 2) {
		var str = '';
		var spawn = false;
		if (CM.Cache.spawnedGoldenShimmer) {
			spawn = true;
			if (CM.Cache.spawnedGoldenShimmer.wrath) str += '[W ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
			else str += '[G ' +  Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps) + ']';
		}
		if (CM.Main.lastTickerFortuneState) {
			spawn = true;
			str += '[F]';
		}
		if (Game.season == 'christmas' && CM.Main.lastSeasonPopupState) {
			str += '[R ' +  Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps) + ']';
			spawn = true;
		}
		if (spawn) str += ' - ';
		var title = 'Cookie Clicker';
		if (Game.season == 'fools') title = 'Cookie Baker';
		str += title;
		document.title = str;
	}
}

/********
 * Section: Functions related to the Golden Cookie Timers

/**
 * This function creates a new Golden Cookie Timer and appends it CM.Disp.GCTimers based on the id of the cookie
 * It is called by CM.Main.CheckGoldenCookie()
 * @param	{object}	cookie	A Golden Cookie object
 */
CM.Disp.CreateGCTimer = function(cookie) {
	GCTimer = document.createElement('div');
	GCTimer.id = 'GCTimer' + cookie.id
	GCTimer.style.width = '96px';
	GCTimer.style.height = '96px';
	GCTimer.style.position = 'absolute';
	GCTimer.style.zIndex = '10000000001';
	GCTimer.style.textAlign = 'center';
	GCTimer.style.lineHeight = '96px';
	GCTimer.style.fontFamily = '\"Kavoon\", Georgia, serif';
	GCTimer.style.fontSize = '35px';
	GCTimer.style.cursor = 'pointer';
	GCTimer.style.display = 'block';
	if (CM.Config.GCTimer == 0) GCTimer.style.display = 'none';
	GCTimer.style.left = cookie.l.style.left;
	GCTimer.style.top = cookie.l.style.top;
	GCTimer.onclick = function () {cookie.pop();};
	GCTimer.onmouseover = function() {cookie.l.style.filter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; cookie.l.style.webkitFilter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))';};
	GCTimer.onmouseout = function() {cookie.l.style.filter = ''; cookie.l.style.webkitFilter = '';};

	CM.Disp.GCTimers[cookie.id] = GCTimer;
	l('shimmers').appendChild(GCTimer);
}

/**
 * This function toggles GC Timers are visible 
 * It is called by a change in CM.Config.GCTimer
 */
CM.Disp.ToggleGCTimer = function() {
	if (CM.Config.GCTimer == 1) {
		for (var i in CM.Disp.GCTimers) {
			CM.Disp.GCTimers[i].style.display = 'block';
			CM.Disp.GCTimers[i].style.left = CM.Cache.goldenShimmersByID[i].l.style.left;
			CM.Disp.GCTimers[i].style.top = CM.Cache.goldenShimmersByID[i].l.style.top;
		}
	}
	else {
		for (var i in CM.Disp.GCTimers) CM.Disp.GCTimers[i].style.display = 'none';
	}
}

/********
 * Section: Functions related to Tooltips

/**
 * This function creates some very basic tooltips, (e.g., the tooltips in the stats page)
 * The tooltips are created with CM.Disp[placeholder].appendChild(desc)
 * It is called by CM.DelayInit()
 * @param	{string}	placeholder	The name used to later refer and spawn the tooltip
 * @param	{string}	text		The text of the tooltip
 * @param	{string}	minWidth	The minimum width of the tooltip
 */
CM.Disp.CreateSimpleTooltip = function(placeholder, text, minWidth) {
	CM.Disp[placeholder] = document.createElement('div');
	var desc = document.createElement('div');
	desc.style.minWidth = minWidth;
	desc.style.marginBottom = '4px';
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = text;
	desc.appendChild(div);
	CM.Disp[placeholder].appendChild(desc);
}

/**
 * This function replaces the original .onmouseover functions of buildings so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'b'
 * It is called by CM.DelayInit()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 */
CM.Disp.ReplaceTooltipBuild = function() {
	CM.Disp.TooltipBuildBackup = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			CM.Disp.TooltipBuildBackup[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'b\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}');
		}
	}
}

/**
 * This function replaces the original .onmouseover functions of upgrades so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'u'
 * It is called by CM.ReplaceNative()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 * 
 */
CM.Disp.ReplaceTooltipUpgrade = function() {
	CM.Disp.TooltipUpgradeBackup = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			CM.Disp.TooltipUpgradeBackup[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() {if (!Game.mouseDown) {Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'u\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}}');
		}
	}
}

/**
 * This function replaces the original .onmouseover functions of the Grimoire minigame so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'g'
 * The function is called by CM.DelayInit()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 */
CM.Disp.ReplaceTooltipGrimoire = function() {
	if (Game.Objects['Wizard tower'].minigameLoaded) {
		CM.Disp.TooltipGrimoireBackup = [];
		for (var i in Game.Objects['Wizard tower'].minigame.spellsById) {
			if (l('grimoireSpell' + i).onmouseover != null) {
				CM.Disp.TooltipGrimoireBackup[i] = l('grimoireSpell' + i).onmouseover;
				eval('l(\'grimoireSpell\' + i).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'g\', \'' + i + '\');}, \'this\'); Game.tooltip.wobble();}');
			}
		}
	}
}

/**
 * This function replaces the original .onmouseover functions of sugar lumps so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 's'
 * The function is called by CM.DelayInit()
 * TODO: Place all ReplaceTooltip functions either under CM.DelayInit() or CM.ReplaceNative()
 * TODO: Move this code to Main.js file
 */
CM.Disp.ReplaceTooltipLump = function() {
	if (Game.canLumps()) {
		CM.Disp.TooltipLumpBackup = l('lumps').onmouseover;
        eval('l(\'lumps\').onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip(\'s\', \'Lump\');}, \'this\'); Game.tooltip.wobble();}');
	}
};

/**
 * This function enhance the standard tooltips by creating and changing l('tooltip')
 * The function is called by .onmouseover events that have replaced original code to use CM.Disp.Tooltip()
 * @param	{string}	type					Type of tooltip (b, u, s or g)
 * @param	{string}	name					Name of the object/item the tooltip relates to
 * @returns {string}	l('tooltip').innerHTML	The HTML of the l('tooltip')-object
 */
CM.Disp.Tooltip = function(type, name) {
	if (type == 'b') { // Buildings
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		// Adds amortization info to the list of info per building
		if (CM.Config.TooltipAmor == 1) {
			var buildPrice = CM.Sim.BuildingGetPrice(Game.Objects[name], Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			var amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML
					.split('so far</div>')
					.join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) == 1 ? 'cookie' : 'cookies') + ' left to amortize (' + CM.Disp.GetTimeColor((buildPrice - Game.Objects[name].totalCookies) / (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');
			}
		}
		if (Game.buyMode == -1) {
			/*
			 * Fix sell price displayed in the object tooltip.
			 *
			 * The buildings sell price displayed by the game itself (without any mod) is incorrect.
			 * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
			 * 
			 * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
			 */
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].bulkPrice)).join(Beautify(CM.Sim.BuildingSell(Game.Objects[name], Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 1)));
		}
	}
	else if (type == 'u') { // Upgrades
		if (!Game.UpgradesInStore[name]) return '';
		l('tooltip').innerHTML = Game.crateTooltip(Game.UpgradesInStore[name], 'store');
	}
	else if (type === 's') l('tooltip').innerHTML = Game.lumpTooltip(); // Sugar Lumps
	else if (type === 'g') l('tooltip').innerHTML = Game.Objects['Wizard tower'].minigame.spellTooltip(name)(); // Grimoire

	// Adds area for extra tooltip-sections
	var area = document.createElement('div');
	area.id = 'CMTooltipArea';
	l('tooltip').appendChild(area);
	
	// Sets global variables used by CM.Disp.UpdateTooltip()
	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	CM.Disp.UpdateTooltip();

	return l('tooltip').innerHTML;
}

/**
 * This function creates a tooltipBox object which contains all CookieMonster added tooltip information.
 * It is called by all CM.Disp.UpdateTooltip functions.
 * @returns {object}	div		An object containing the stylized box
 */
CM.Disp.TooltipCreateTooltipBox = function() {
	l('tooltip').firstChild.style.paddingBottom = '4px'; // Sets padding on base-tooltip
	var tooltipBox = document.createElement('div');
	tooltipBox.style.border = '1px solid';
	tooltipBox.style.padding = '4px';
	tooltipBox.style.margin = '0px -4px';
	tooltipBox.id = 'CMTooltipBorder';
	tooltipBox.className = CM.Disp.colorTextPre + CM.Disp.colorGray;
	return tooltipBox
}

/**
 * This function creates a header object for tooltips. 
 * It is called by all CM.Disp.UpdateTooltip functions.
 * @param	{string}	text	Title of header
 * @returns {object}	div		An object containing the stylized header
 */
CM.Disp.TooltipCreateHeader = function(text) {
	var div = document.createElement('div');
	div.style.fontWeight = 'bold';
	div.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
	div.textContent = text;
	return div;
}

/**
 * This function appends the sections for Bonus Income, PP and Time left (to achiev) to the tooltip-object
 * It is called by CM.Disp.UpdateTooltipBuilding() and CM.Disp.UpdateTooltipUpgrade()
 * The actual data is added by the Update-functions themselves
 * @param	{object}	tooltip		Object of a TooltipBox, normally created by a call to CM.Disp.TooltipCreateTooltipBox()
 */
CM.Disp.TooltipCreateCalculationSection = function(tooltip) {
	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Bonus Income'));
	var income = document.createElement('div');
	income.style.marginBottom = '4px';
	income.style.color = 'white';
	income.id = 'CMTooltipIncome';
	tooltip.appendChild(income);

	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Payback Period'));
	var pp = document.createElement('div');
	pp.style.marginBottom = '4px';
	pp.id = 'CMTooltipPP';
	tooltip.appendChild(pp);

	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Time Left'));
	var time = document.createElement('div');
	time.id = 'CMTooltipTime';
	tooltip.appendChild(time);

	if (CM.Disp.tooltipType == 'b') {
		tooltip.appendChild(CM.Disp.TooltipCreateHeader('Production left till next achievement'));
		tooltip.lastChild.id = 'CMTooltipProductionHeader'; // Assign a id in order to hid when no achiev's are left
		var production = document.createElement('div');
		production.id = 'CMTooltipProduction';
		tooltip.appendChild(production);
	}
}

/**
 * This function creates the tooltip objectm for warnings
 * It is called by CM.Disp.UpdateTooltipWarnings() whenever the tooltip type is 'b' or 'u'
 * The object is also removed by CM.Disp.UpdateTooltipWarnings() when type is 's' or 'g'
 * @returns {object}	CM.Disp.TooltipWarn	The Warnings-tooltip object
 */
CM.Disp.TooltipCreateWarningSection = function() {
	CM.Disp.TooltipWarn = document.createElement('div');
	CM.Disp.TooltipWarn.style.position = 'absolute';
	CM.Disp.TooltipWarn.style.display = 'block';
	CM.Disp.TooltipWarn.style.left = 'auto';
	CM.Disp.TooltipWarn.style.bottom = 'auto';
	CM.Disp.TooltipWarn.id = "CMDispTooltipWarningParent";

	var create = function(boxId, color, labelTextFront, labelTextBack, deficitId) {
		var box = document.createElement('div');
		box.id = boxId;
		box.style.display = 'none';
		// TODO: This is very old code and can probably be removed
		//box.style.WebkitTransition = 'opacity 0.1s ease-out';
		//box.style.MozTransition = 'opacity 0.1s ease-out';
		//box.style.MsTransition = 'opacity 0.1s ease-out';
		//box.style.OTransition = 'opacity 0.1s ease-out';
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
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnLucky', CM.Disp.colorRed, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!"', 'CMDispTooltipWarnLuckyText'));
	CM.Disp.TooltipWarn.firstChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnLuckyFrenzy', CM.Disp.colorYellow, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)', 'CMDispTooltipWarnLuckyFrenzyText'));
	CM.Disp.TooltipWarn.lastChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnConjure', CM.Disp.colorPurple, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods"', 'CMDispTooltipWarnConjureText'));
	 
	return CM.Disp.TooltipWarn;
}

/**
 * This function updates the sections of the tooltips created by CookieMonster
 * It is called when tooltips are created by and CM.Disp.Tooltip() on every loop by CM.Loop()
 */
CM.Disp.UpdateTooltip = function() {
	CM.Sim.CopyData();
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea')) {
		l('CMTooltipArea').innerHTML = '';
		tooltipBox = CM.Disp.TooltipCreateTooltipBox();
		l('CMTooltipArea').appendChild(tooltipBox);
		
		if (CM.Disp.tooltipType == 'b') {
			CM.Disp.UpdateTooltipBuilding();
		}
		else if (CM.Disp.tooltipType == 'u') { 
			CM.Disp.UpdateTooltipUpgrade();
		}
		else if (CM.Disp.tooltipType === 's') {
			CM.Disp.UpdateTooltipSugarLump();
		}
		else if (CM.Disp.tooltipType === 'g') {
			CM.Disp.UpdateTooltipGrimoire();
		}
		CM.Disp.UpdateTooltipWarnings();
	}
	else if (l('CMTooltipArea') == null) { // Remove warnings if its a basic tooltip
		if (l('CMDispTooltipWarningParent') != null) {
			l('CMDispTooltipWarningParent').remove();
		}
	}
}

/**
 * This function adds extra info to the Building tooltips
 * It is called when Building tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipBuilding = function() {
	if (CM.Config.TooltipBuildUp == 1 && Game.buyMode == 1) {
		tooltipBox = l('CMTooltipBorder');
		CM.Disp.TooltipCreateCalculationSection(tooltipBox);

		var target = '';
		// TODO: Change the Cache code and variables to use Objects1, Objectes10, Objects100
		// That would depreciate this target setting code
		if (Game.buyMode == 1 && Game.buyBulk == 10) target = 'Objects10'
		else if (Game.buyMode == 1 && Game.buyBulk == 100) target = 'Objects100';
		else target = 'Objects';

		CM.Disp.TooltipPrice = Game.Objects[CM.Disp.tooltipName].bulkPrice
		CM.Disp.TooltipBonusIncome = CM.Cache[target][CM.Disp.tooltipName].bonus;
		

		if (CM.Config.TooltipBuildUp == 1 && Game.buyMode == 1) {
			l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
			var increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
			}
			l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			l('CMTooltipPP').textContent = Beautify(CM.Cache[target][CM.Disp.tooltipName].pp, 2);
			l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			var timeColor = CM.Disp.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
		}

		// Add "production left till next achievement"-bar
		for (var i in Game.Objects[CM.Disp.tooltipName].productionAchievs) {
			if (!CM.Sim.HasAchiev(Game.Objects[CM.Disp.tooltipName].productionAchievs[i].achiev.name)) {
				var nextProductionAchiev = Game.Objects[CM.Disp.tooltipName].productionAchievs[i]
				break
			}
		}
		if (typeof nextProductionAchiev != "undefined") {
			l('CMTooltipTime').style.marginBottom = '4px';
			l('CMTooltipProductionHeader').style.display = "";
			l('CMTooltipProduction').className = "ProdAchievement" + CM.Disp.tooltipName;
			l('CMTooltipProduction').textContent = Beautify(nextProductionAchiev.pow - CM.Sim.Objects[CM.Disp.tooltipName].totalCookies, 15);
			l('CMTooltipProduction').style.color = "white";
		} else {
			l('CMTooltipProductionHeader').style.display = "none";
			l('CMTooltipTime').style.marginBottom = '0px';
		}
	}
}

/**
 * This function adds extra info to the Upgrade tooltips
 * It is called when Upgrade tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipUpgrade = function() {
	tooltipBox = l('CMTooltipBorder');
	CM.Disp.TooltipCreateCalculationSection(tooltipBox);

	CM.Disp.TooltipBonusIncome = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
	CM.Disp.TooltipPrice = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();

	if (CM.Config.TooltipBuildUp == 1) {
		l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
		var increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
		if (isFinite(increase) && increase != 0) {
			l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
		}
		l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
		l('CMTooltipPP').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].pp, 2);
		l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
		var timeColor = CM.Disp.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
		l('CMTooltipTime').textContent = timeColor.text;
		l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
	}
}

/**
 * This function adds extra info to the Sugar Lump tooltip
 * It is called when the Sugar Lump tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipSugarLump = function() {
	if (CM.Config.TooltipLump === 1) {
		tooltipBox = l('CMTooltipBorder');

		tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Current Sugar Lump'));

		var lumpType = document.createElement('div');
		lumpType.id = 'CMTooltipTime';
		tooltipBox.appendChild(lumpType);
		var lumpColor = CM.Disp.GetLumpColor(Game.lumpCurrentType);
		lumpType.textContent = lumpColor.text;
		lumpType.className = CM.Disp.colorTextPre + lumpColor.color;
	}
}

/**
 * This function adds extra info to the Grimoire tooltips
 * It is called when Grimoire tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipGrimoire = function() {
	var minigame = Game.Objects['Wizard tower'].minigame;
	var spellCost = minigame.getSpellCost(minigame.spellsById[CM.Disp.tooltipName]);

	if (CM.Config.TooltipGrim == 1 && spellCost <= minigame.magicM) {
		tooltipBox = l('CMTooltipBorder');

		// Time left till enough magic for spell
		tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Time Left'));
		var time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltipBox.appendChild(time);
		var timeColor = CM.Disp.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost));
		time.textContent = timeColor.text;
		time.className = CM.Disp.colorTextPre + timeColor.color;

		// Time left untill magic spent is recovered
		if (spellCost <= minigame.magic) {
			tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Recover Time'));
			var recover = document.createElement('div');
			recover.id = 'CMTooltipRecover';
			tooltipBox.appendChild(recover);
			var recoverColor = CM.Disp.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(Math.max(0, minigame.magic - spellCost), minigame.magicM, minigame.magic));
			recover.textContent = recoverColor.text;
			recover.className = CM.Disp.colorTextPre + recoverColor.color;
		}

		// Extra information on cookies gained when spell is Conjure Baked Goods (Name == 0)
		if (CM.Disp.tooltipName == 0) {
			tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Cookies to be gained/lost'));
			var conjure = document.createElement('div');
			conjure.id = 'CMTooltipConjure';
			tooltipBox.appendChild(conjure);
			var reward = document.createElement('span');
			reward.style.color = "#33FF00"
			reward.textContent = Beautify(Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30), 2)
			conjure.appendChild(reward)
			var seperator = document.createElement('span');
			seperator.textContent = ' / '
			conjure.appendChild(seperator)
			var loss = document.createElement('span');
			loss.style.color = "red"
			loss.textContent = Beautify((CM.Cache.NoGoldSwitchCookiesPS * 60 * 15), 2);
			conjure.appendChild(loss)
		}

		l('CMTooltipArea').appendChild(tooltipBox);
	}
}

/**
 * This function updates the warnings section of the building and upgrade tooltips
 * It is called by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipWarnings = function() {
	if (CM.Disp.tooltipType == "b" || CM.Disp.tooltipType == "u") {
		if (document.getElementById("CMDispTooltipWarningParent") == null) {
			warningTooltip = CM.Disp.TooltipCreateWarningSection();
			l('tooltipAnchor').appendChild(warningTooltip);
			CM.Disp.ToggleToolWarnPos();
		}

		if (CM.Config.ToolWarnPos == 0) CM.Disp.TooltipWarn.style.right = '0px';
		else CM.Disp.TooltipWarn.style.top = (l('tooltip').offsetHeight) + 'px';

		CM.Disp.TooltipWarn.style.width = (l('tooltip').offsetWidth - 6) + 'px';
		
		if (CM.Config.ToolWarnLucky == 1) {
			var limitLucky = CM.Cache.Lucky;
			if (CM.Config.ToolWarnBon == 1) {
				var bonusNoFren = CM.Disp.TooltipBonusIncome;
				bonusNoFren /= CM.Sim.getCPSBuffMult();
				limitLucky += ((bonusNoFren * 60 * 15) / 0.15);
			}
			var limitLuckyFrenzy = limitLucky * 7;
			var amount = (Game.cookies + CM.Disp.GetWrinkConfigBank()) - CM.Disp.TooltipPrice;
			if ((amount < limitLucky || amount < limitLuckyFrenzy) && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
				if (amount < limitLucky) {
					l('CMDispTooltipWarnLucky').style.display = '';
					l('CMDispTooltipWarnLuckyText').textContent = Beautify(limitLucky - amount) + ' (' + CM.Disp.FormatTime((limitLucky - amount) / CM.Disp.GetCPS()) + ')';
					l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
					l('CMDispTooltipWarnLuckyFrenzyText').textContent = Beautify(limitLuckyFrenzy - amount) + ' (' + CM.Disp.FormatTime((limitLuckyFrenzy - amount) / CM.Disp.GetCPS()) + ')';
				}
				else if (amount < limitLuckyFrenzy) {
					l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
					l('CMDispTooltipWarnLuckyFrenzyText').textContent = Beautify(limitLuckyFrenzy - amount) + ' (' + CM.Disp.FormatTime((limitLuckyFrenzy - amount) / CM.Disp.GetCPS()) + ')';
					l('CMDispTooltipWarnLucky').style.display = 'none';
				}
			} else {
				l('CMDispTooltipWarnLucky').style.display = 'none';
				l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
			}
		}
		else {
			l('CMDispTooltipWarnLucky').style.display = 'none';
			l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
		}
		
		if (CM.Config.ToolWarnConjure == 1) {
			var limitLucky = CM.Cache.Lucky;
			if (CM.Config.ToolWarnBon == 1) {
				var bonusNoFren = CM.Disp.TooltipBonusIncome;
				bonusNoFren /= CM.Sim.getCPSBuffMult();
				limitLucky += ((bonusNoFren * 60 * 15) / 0.15);
			}
			var limitConjure = limitLucky * 2;
			var amount = (Game.cookies + CM.Disp.GetWrinkConfigBank()) - CM.Disp.TooltipPrice;
			if ((amount < limitConjure) && (CM.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
				l('CMDispTooltipWarnConjure').style.display = '';
				l('CMDispTooltipWarnConjureText').textContent = Beautify(limitConjure - amount) + ' (' + CM.Disp.FormatTime((limitConjure - amount) / CM.Disp.GetCPS()) + ')';
			} else {
				l('CMDispTooltipWarnConjure').style.display = 'none';
			}
		}
		else {
			l('CMDispTooltipWarnConjure').style.display = 'none';
		}
	}
	else {
		if (l('CMDispTooltipWarningParent') != null) {
			l('CMDispTooltipWarningParent').remove();
		}
	}
}

/**
 * This function updates the location of the tooltip
 * It is called by Game.tooltip.update() because of CM.ReplaceNative()
 */
CM.Disp.UpdateTooltipLocation = function() {
	if (Game.tooltip.origin == 'store') {
		var warnOffset = 0;
		if (CM.Config.ToolWarnLucky == 1 && CM.Config.ToolWarnPos == 1 && typeof CM.Disp.TooltipWarn != "undefined") {
			warnOffset = CM.Disp.TooltipWarn.clientHeight - 4;
		}
		Game.tooltip.tta.style.top = Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnOffset - 46) + 'px';
	}
	// Kept for future possible use if the code changes again
	/*else if (!Game.onCrate && !Game.OnAscend && CM.Config.TimerBar == 1 && CM.Config.TimerBarPos == 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	}*/
}

/**
 * This function toggles the position of the warnings created by CM.Disp.TooltipCreateWarningSection()
 * It is called by a change in CM.Config.ToolWarnPos 
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
CM.Disp.ToggleToolWarnPos = function() {
	if (typeof CM.Disp.TooltipWarn != "undefined") {
		if (CM.Config.ToolWarnPos == 0) {
			CM.Disp.TooltipWarn.style.top = 'auto';
			CM.Disp.TooltipWarn.style.margin = '4px -4px';
			CM.Disp.TooltipWarn.style.padding = '3px 4px';
		}
		else {
			CM.Disp.TooltipWarn.style.right = 'auto';
			CM.Disp.TooltipWarn.style.margin = '4px';
			CM.Disp.TooltipWarn.style.padding = '4px 3px';
		}
	}
}

/**
 * This function checks and create a tooltip for the wrinklers
 * It is called by CM.Loop()
 * TODO: Change this code to be the same as other tooltips. (i.d., create tooltip with type "w")
 */
CM.Disp.CheckWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && CM.Disp.TooltipWrinklerArea == 1) { // Latter is set by CM.Main.AddWrinklerAreaDetect
		var showingTooltip = false;
		for (var i in Game.wrinklers) {
			var me = Game.wrinklers[i];
			if (me.phase > 0 && me.selected) {
				showingTooltip = true;
				if (CM.Disp.TooltipWrinklerBeingShown[i] == 0 || CM.Disp.TooltipWrinklerBeingShown[i] == undefined) {
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
					CM.Disp.TooltipWrinklerBeingShown[i] = 1;
				}
				else break;
			}
			else {
				CM.Disp.TooltipWrinklerBeingShown[i] = 0;
			}
		}
		if (!showingTooltip) {
			Game.tooltip.hide();
		}
	}
}

/**
 * This function updates the amount to be displayed by the wrinkler tooltip created by CM.Disp.CheckWrinklerTooltip()
 * It is called by CM.Loop()
 * TODO: Change this code to be the same as other tooltips. Fit this into CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateWrinklerTooltip = function() {
	if (CM.Config.ToolWrink == 1 && l('CMTooltipWrinkler') != null) {
		var sucked = Game.wrinklers[CM.Disp.TooltipWrinkler].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[CM.Disp.TooltipWrinkler].type == 1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		if (CM.Sim.Objects.Temple.minigameLoaded) {
			var godLvl = CM.Sim.hasGod('scorn');
			if (godLvl == 1) sucked *= 1.15;
			else if (godLvl == 2) sucked *= 1.1;
			else if (godLvl == 3) sucked *= 1.05;
		}
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
	}
}

/********
 * Section: Functions related to the dragon aura interface */

/**
 * This functions adds the two extra lines about CPS and time to recover to the aura picker infoscreen
 * It is called by Game.DescribeDragonAura() after CM.ReplaceNative()
 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
 */
CM.Disp.AddAuraInfo = function(aura) {
	if (CM.Config.DragonAuraInfo == 1) {
		var [bonusCPS, priceOfChange] = CM.Sim.CalculateChangeAura(aura);
		var timeToRecover = CM.Disp.FormatTime(priceOfChange / (bonusCPS + Game.cookiesPs));
		var bonusCPSPercentage = CM.Disp.Beautify(bonusCPS / Game.cookiesPs);
		bonusCPS = CM.Disp.Beautify(bonusCPS);

		l('dragonAuraInfo').style.minHeight = "60px"
		l('dragonAuraInfo').style.margin = "8px"
		l('dragonAuraInfo').appendChild(document.createElement("div")).className = "line"
		var div = document.createElement("div");
		div.style.minWidth = "200px";
		div.style.textAlign = "center";
		div.textContent = "Picking this aura will change CPS by " + bonusCPS + " (" + bonusCPSPercentage + "% of current CPS).";
		l('dragonAuraInfo').appendChild(div);
		var div2 = document.createElement("div");
		div2.style.minWidth = "200px";
		div2.style.textAlign = "center";
		div2.textContent = "It will take " + timeToRecover + " to recover the cost.";
		l('dragonAuraInfo').appendChild(div2);
	}
}

/********
 * Section: General functions related to the Options/Stats pages

/**
 * This function adds the calll the functions to add extra info to the stats and options pages
 * It is called by Game.UpdateMenu()
 */
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
	else if (Game.onMenu == 'stats') {
		if (CM.Config.Stats) {
			CM.Disp.AddMenuStats(title);
		}
	}
}

/**
 * This function refreshes the stats page, CM.Config.UpStats determines the rate at which that happens
 * It is called by CM.Loop()
 */
CM.Disp.RefreshMenu = function() {
	if (CM.Config.UpStats && Game.onMenu == 'stats' && (Game.drawT - 1) % (Game.fps * 5) != 0 && (Game.drawT - 1) % Game.fps == 0) Game.UpdateMenu();
}

/********
 * Section: Functions related to the Options/Preferences page

/**
 * This function adds the options/settings of CookieMonster to the options page
 * It is called by CM.Disp.AddMenu
 * @param {function} title	A function that returns the title of CookieMonster pre-styled
 */
CM.Disp.AddMenuPref = function(title) {	
	var frag = document.createDocumentFragment();
	frag.appendChild(title());

	for (var group in CM.ConfigGroups) {
		groupObject = CM.Disp.CreatePrefHeader(group, CM.ConfigGroups[group]) // (group, display-name of group)
		frag.appendChild(groupObject)
		if (CM.Config.OptionsPref[group]) { // 0 is show, 1 is collapsed
			for (var option in CM.ConfigData) {
				if (CM.ConfigData[option].group == group) frag.appendChild(CM.Disp.CreatePrefOption(option))
			}
		}
	}
	
	var resDef = document.createElement('div');
	resDef.className = 'listing';
	var resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function() {CM.RestoreDefault();};
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);
	
	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
}

/**
 * This function creates a header-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
CM.Disp.CreatePrefHeader = function(config, text) {
	var div = document.createElement('div');
	div.className = 'listing';
	div.style.padding = '5px 16px';
	div.style.opacity = '0.7';
	div.style.fontSize = '17px';
	div.style.fontFamily = '\"Kavoon\", Georgia, serif';
	div.appendChild(document.createTextNode(text + ' '));
	var span = document.createElement('span'); // Creates the +/- button
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
	span.textContent = CM.Config.OptionsPref[config] ? '-' : '+';
	span.onclick = function() {CM.ToggleOptionsConfig(config); Game.UpdateMenu();};
	div.appendChild(span);
	return div;
}

/**
 * This function creates an option-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
CM.Disp.CreatePrefOption = function(config) {
	if (CM.ConfigData[config].type == "bool") {
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
		a.textContent = CM.ConfigData[config].label[CM.Config[config]];
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	else if (CM.ConfigData[config].type == "vol") {
		var div = document.createElement('div');
		div.className = 'listing';
		var volume = document.createElement('div');
		volume.className = 'sliderBox';
		var title = document.createElement('div');
		title.style.float = "left";
		title.innerHTML = CM.ConfigData[config].desc;
		volume.appendChild(title);
		var percent = title = document.createElement('div');
		percent.id = "slider" + config + "right";
		percent.style.float = "right";
		percent.innerHTML = CM.Config[config] + "%";
		volume.appendChild(percent);
		var slider = document.createElement('input');
		slider.className = "slider";
		slider.id = "slider" + config;
		slider.style.clear = "both";
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.step = "1";
		slider.value = CM.Config[config];
		slider.oninput = function() {CM.ToggleConfigVolume(config)};
		slider.onchange = function() {CM.ToggleConfigVolume(config)};
		volume.appendChild(slider);
		div.appendChild(volume);
		return div;
	}
	else if (CM.ConfigData[config].type == "url") {
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
		input.readOnly = true;
		input.setAttribute('value', CM.Config[config]);
		input.style.width = '300px';
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		var inputPrompt = document.createElement('input');
		inputPrompt.id = CM.ConfigPrefix + config + 'Prompt';
		inputPrompt.className = 'option';
		inputPrompt.type = 'text';
		inputPrompt.setAttribute('value', CM.Config[config]);
		var a = document.createElement('a');
		a.className = 'option';
		a.onclick = function() {Game.Prompt(inputPrompt.outerHTML, [['Save', 'CM.Config[\'' + config + '\'] = l(CM.ConfigPrefix + \'' + config + '\' + \'Prompt\').value; CM.SaveConfig(CM.Config); Game.ClosePrompt(); Game.UpdateMenu();'], 'Cancel']);};
		a.textContent = 'Edit';
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = CM.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	else if (CM.ConfigData[config].type == "color") {
		for (var i = 0; i < CM.Disp.colors.length; i++) {
			var div = document.createElement('div');
			div.className = 'listing';
			var input = document.createElement('input');
			input.id = CM.ConfigPrefix + 'Color' + CM.Disp.colors[i];
			input.className = 'option';
			input.style.width = '65px';
			input.setAttribute('value', CM.Config.Colors[CM.Disp.colors[i]]);
			div.appendChild(input);
			eval('var change = function() {CM.Config.Colors[\'' + CM.Disp.colors[i] + '\'] = l(CM.ConfigPrefix + \'Color\' + \'' + CM.Disp.colors[i] + '\').value; CM.Disp.UpdateColors(); CM.SaveConfig(CM.Config);}');
			var jscolorpicker = new jscolor.color(input, {hash: true, caps: false, pickerZIndex: 1000000, pickerPosition: 'right', onImmediateChange: change});
			var label = document.createElement('label');
			label.textContent = CM.ConfigData.Colors.desc[CM.Disp.colors[i]];
			div.appendChild(label);
			return div;
		}
	}
}

/**
 * This function changes some of the time-displays in the game to be more detailed
 * It is called by a change in CM.Config.DetailedTime
 */
CM.Disp.ToggleDetailedTime = function() {
	if (CM.Config.DetailedTime == 1) Game.sayTime = CM.Disp.sayTime;
	else Game.sayTime = CM.Backup.sayTime;
}

/**
 * This function refreshes all numbers after a change in scale-setting
 * It is therefore called by a change in CM.Config.Scale and CM.Config.ScaleDecimals
 */
CM.Disp.RefreshScale = function() {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	CM.Disp.UpdateBotBar();
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();
}

/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Config.Colors
 */
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

/********
 * Section: Functions related to the Stats page
 * TODO: Annotate last functions */

/**
 * This function adds stats created by CookieMonster to the stats page
 * It is called by CM.Disp.AddMenu
 * @param {function} title	A function that returns the title of CookieMonster pre-styled
 */
CM.Disp.AddMenuStats = function(title) {
	var stats = document.createElement('div');
	stats.className = 'subsection';
	stats.appendChild(title());

	stats.appendChild(CM.Disp.CreateStatsHeader('Lucky Cookies', 'Lucky'));
	if (CM.Config.StatsPref.Lucky) {
		stats.appendChild(CM.Disp.CreateStatsLuckySection());
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Chain Cookies', 'Chain'));
	if (CM.Config.StatsPref.Chain) {
		stats.appendChild(CM.Disp.CreateStatsChainSection());
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Conjure Baked Goods', 'Conjure'));
	if (CM.Config.StatsPref.Conjure) {
		stats.appendChild(CM.Disp.CreateStatsConjureSection());
 	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Prestige', 'Prestige'));
	if (CM.Config.StatsPref.Prestige) {
		stats.appendChild(CM.Disp.CreateStatsPrestigeSection());
	}

	if (Game.cpsSucked > 0) {
		stats.appendChild(CM.Disp.CreateStatsHeader('Wrinklers', 'Wrink'));
		if (CM.Config.StatsPref.Wrink) {
			var popAllFrag = document.createDocumentFragment();
			popAllFrag.appendChild(document.createTextNode(Beautify(CM.Cache.WrinkBankTotal) + ' / ' + Beautify(CM.Cache.WrinkBankNormal) + ' '));
			var popAllA = document.createElement('a');
			popAllA.textContent = 'Pop All Normal';
			popAllA.className = 'option';
			popAllA.onclick = function() { CM.Disp.PopAllNormalWrinklers(); };
			popAllFrag.appendChild(popAllA);
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rewards of Popping (All/Normal)',  popAllFrag));
		}
	}


	var specDisp = false;
	var missingHalloweenCookies = [];
	for (var i in CM.Data.HalloCookies) {
		if (!Game.Has(CM.Data.HalloCookies[i])) {
			missingHalloweenCookies.push(CM.Data.HalloCookies[i]);
			specDisp = true;
		}
	}
	var missingChristmasCookies = [];
	for (var i in CM.Data.ChristCookies) {
		if (!Game.Has(CM.Data.ChristCookies[i])) {
			missingChristmasCookies.push(CM.Data.ChristCookies[i]);
			specDisp = true;
		}
	}
	var missingValentineCookies = [];
	for (var i in CM.Data.ValCookies) {
		if (!Game.Has(CM.Data.ValCookies[i])) {
			missingValentineCookies.push(CM.Data.ValCookies[i]);
			specDisp = true;
		}
	}
	var missingNormalEggs = [];
	for (var i in Game.eggDrops) {
		if (!Game.HasUnlocked(Game.eggDrops[i])) {
			missingNormalEggs.push(Game.eggDrops[i]);
			specDisp = true;
		}
	}
	var missingRareEggs = [];
	for (var i in Game.rareEggDrops) {
		if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
			missingRareEggs.push(Game.rareEggDrops[i]);
			specDisp = true;
		}
	}
	var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));
	var centEgg = Game.Has('Century egg');
	
	if (Game.season == 'christmas' || specDisp || choEgg || centEgg) {
		stats.appendChild(CM.Disp.CreateStatsHeader('Season Specials', 'Sea'));
		if (CM.Config.StatsPref.Sea) {
			if (specDisp) {
				if (missingHalloweenCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Halloween Cookies Left to Buy', CM.Disp.CreateStatsMissDisp(missingHalloweenCookies)));
				if (missingChristmasCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Christmas Cookies Left to Buy',  CM.Disp.CreateStatsMissDisp(missingChristmasCookies)));
				if (missingValentineCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Valentine Cookies Left to Buy',  CM.Disp.CreateStatsMissDisp(missingValentineCookies)));
				if (missingNormalEggs.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Normal Easter Eggs Left to Unlock',  CM.Disp.CreateStatsMissDisp(missingNormalEggs)));
				if (missingRareEggs.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rare Easter Eggs Left to Unlock',  CM.Disp.CreateStatsMissDisp(missingRareEggs)));
			}

			if (Game.season == 'christmas') stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Reindeer Reward',  document.createTextNode(Beautify(CM.Cache.SeaSpec))));
			if (choEgg) {
				stats.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Chocolate Egg Cookies', document.createTextNode(Beautify(CM.Cache.lastChoEgg)), 'ChoEggTooltipPlaceholder'));
			}
			if (centEgg) {
				stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Century Egg Multiplier', document.createTextNode((Math.round((CM.Cache.CentEgg - 1) * 10000) / 100) + '%')));
			}
		}
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Miscellaneous', 'Misc'));
	if (CM.Config.StatsPref.Misc) {
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 
			'Average Cookies Per Second (Past ' + (CM.Disp.cookieTimes[CM.Config.AvgCPSHist] < 60 ? (CM.Disp.cookieTimes[CM.Config.AvgCPSHist] + ' seconds') : ((CM.Disp.cookieTimes[CM.Config.AvgCPSHist] / 60) + (CM.Config.AvgCPSHist == 3 ? ' minute' : ' minutes'))) + ')', 
			document.createTextNode(Beautify(CM.Cache.AvgCPS, 3))
		));
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Average Cookie Clicks Per Second (Past ' + CM.Disp.clickTimes[CM.Config.AvgClicksHist] + (CM.Config.AvgClicksHist == 0 ? ' second' : ' seconds') + ')', document.createTextNode(Beautify(CM.Cache.AvgClicks, 1))));
		if (Game.Has('Fortune cookies')) {
			var fortunes = [];
			for (var i in CM.Data.Fortunes) {
				if (!Game.Has(CM.Data.Fortunes[i])) {
					fortunes.push(CM.Data.Fortunes[i]);
				}
			}
			if (fortunes.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Fortune Upgrades Left to Buy',  CM.Disp.CreateStatsMissDisp(fortunes)));
		}
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
		if (Game.prefs.autosave) {
			var timer = document.createElement('span');
			timer.id = 'CMStatsAutosaveTimer';
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.OnAscend ? 0 : (Game.T % (Game.fps * 60))), 4);
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Time till autosave', timer));
		}
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);

	if (CM.Config.MissingUpgrades) {
		CM.Disp.AddMissingUpgrades();
	}
}

/**
 * This function creates a header-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
CM.Disp.CreateStatsHeader = function(text, config) {
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

/**
 * This function creates an stats-listing-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		type		The type fo the listing
 * @param 	{string}		name		The name of the option
 * @param 	{object}		text		The text-object of the option
 * @param 	{string}		placeholder	The id of the to-be displayed tooltip if applicable
 * @returns	{object}		div			The option object
 */
CM.Disp.CreateStatsListing = function(type, name, text, placeholder) {
	var div = document.createElement('div');
	div.className = 'listing';

	var listingName = document.createElement('b');
	listingName.textContent = name;
	div.appendChild(listingName);
	if (type == "withTooltip")  {
		div.className = 'listing';
		
		var tooltip = document.createElement('span');
		tooltip.onmouseout = function() { Game.tooltip.hide(); };
		tooltip.onmouseover = function() {Game.tooltip.draw(this, escape(CM.Disp[placeholder].innerHTML));};
		tooltip.style.cursor = 'default';
		tooltip.style.display = 'inline-block';
		tooltip.style.height = '10px';
		tooltip.style.width = '10px';
		tooltip.style.borderRadius = '5px';
		tooltip.style.textAlign = 'center';
		tooltip.style.backgroundColor = '#C0C0C0';
		tooltip.style.color = 'black';
		tooltip.style.fontSize = '9px';
		tooltip.style.verticalAlign = 'bottom';
		tooltip.textContent = '?';
		div.appendChild(tooltip);
		div.appendChild(document.createTextNode(' '));
	}
	div.appendChild(document.createTextNode(': '));
	div.appendChild(text);
	return div;
}

/**
 * This function creates a tooltip containing all missing holiday items contained in the list theMissDisp
 * @param 	{list}			theMissDisp		A list of the missing holiday items
 * @returns	{object}		frag			The tooltip object
 */
CM.Disp.CreateStatsMissDisp = function(theMissDisp) {
	var frag = document.createDocumentFragment();
	frag.appendChild(document.createTextNode(theMissDisp.length + ' '));
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
	for (var i in theMissDisp) {
		var div = document.createElement('div');
		div.style.textAlign = 'center';
		div.appendChild(document.createTextNode(theMissDisp[i]));
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

/**
 * This function creates the "Lucky" section of the stats page
 * @returns	{object}	section		The object contating the Lucky section
 */
CM.Disp.CreateStatsLuckySection = function() {	
	// TODO: Remove this and creater better tooltip!!
	var goldCookTooltip = CM.Sim.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';
	
	var section = document.createElement('div');
	section.className = 'CMStatsLuckySection';
	
	var luckyColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var luckyTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.FormatTime((CM.Cache.Lucky - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
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
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Cookies Required', luckyReqFrag, goldCookTooltip));


	var luckyColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var luckyTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.FormatTime((CM.Cache.LuckyFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
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
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Cookies Required (Frenzy)', luckyReqFrenFrag, goldCookTooltip));
	
	var luckySplit = CM.Cache.LuckyReward != CM.Cache.LuckyWrathReward;

	var luckyRewardMaxSpan = document.createElement('span');
	luckyRewardMaxSpan.style.fontWeight = 'bold';
	luckyRewardMaxSpan.className = CM.Disp.colorTextPre + CM.Cache.LuckyReward;
	luckyRewardMaxSpan.textContent = Beautify(CM.Cache.LuckyReward) + (luckySplit ? (' / ' + Beautify(CM.Cache.LuckyWrathReward)) : '');
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Reward (MAX)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyRewardMaxSpan, goldCookTooltip));

	var luckyRewardFrenzyMaxSpan = document.createElement('span');
	luckyRewardFrenzyMaxSpan.style.fontWeight = 'bold';
	luckyRewardFrenzyMaxSpan.className = CM.Disp.colorTextPre + luckyRewardFrenzyMaxSpan;
	luckyRewardFrenzyMaxSpan.textContent = Beautify(CM.Cache.LuckyRewardFrenzy) + (luckySplit ? (' / ' + Beautify(CM.Cache.LuckyWrathRewardFrenzy)) : '');
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Reward (MAX) (Frenzy)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyRewardFrenzyMaxSpan , goldCookTooltip));
	
	var luckyCurBase = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * CM.Cache.DragonsFortuneMultAdjustment * 60 * 15) + 13;
	var luckyCurSpan = document.createElement('span');
	luckyCurSpan.style.fontWeight = 'bold';
	luckyCurSpan.className = CM.Disp.colorTextPre + luckyCurSpan;
	luckyCurSpan.textContent = Beautify(CM.Cache.GoldenCookiesMult * luckyCurBase) + (luckySplit ? (' / ' + Beautify(CM.Cache.WrathCookiesMult * luckyCurBase)) : '')
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Lucky!\" Reward (CUR)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyCurSpan, goldCookTooltip));
	return section;
}

/**
 * This function creates the "Chain" section of the stats page
 * @returns	{object}	section		The object contating the Chain section
 */
CM.Disp.CreateStatsChainSection = function() {
	// TODO: Remove this and creater better tooltip!!
	var goldCookTooltip = CM.Sim.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';
	
	var section = document.createElement('div');
	section.className = 'CMStatsChainSection';

	var chainColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Chain) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Chain) ? CM.Disp.FormatTime((CM.Cache.Chain - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
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
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required', chainReqFrag, goldCookTooltip));
	
	var chainWrathColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainWrathTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrath) ? CM.Disp.FormatTime((CM.Cache.ChainWrath - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
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
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required (Wrath)', chainWrathReqFrag, goldCookTooltip));
	
	var chainColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzy) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
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
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required (Frenzy)', chainReqFrenFrag, goldCookTooltip));
	
	var chainWrathColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrath) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var chainWrathTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrath) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyWrath - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
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
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Cookies Required (Frenzy) (Wrath)', chainWrathReqFrenFrag, goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Reward (MAX) (Golden / Wrath)', document.createTextNode(Beautify(CM.Cache.ChainReward) + ' / ' + Beautify(CM.Cache.ChainWrathReward)), goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Reward (MAX) (Frenzy) (Golden / Wrath)', document.createTextNode((Beautify(CM.Cache.ChainFrenzyReward) + ' / ' + Beautify(CM.Cache.ChainFrenzyWrathReward))), goldCookTooltip));

	// TODO: Place MaxChainMoni function into CM.Cache.RemakeChain and create global variables to store it
	var chainCurMax = Math.min(CM.Cache.NoGoldSwitchCookiesPS * CM.Cache.DragonsFortuneMultAdjustment * 60 * 60 * 6, (Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.5);
	var chainCur = CM.Cache.MaxChainMoni(7, chainCurMax, CM.Cache.GoldenCookiesMult);
	var chainCurWrath = CM.Cache.MaxChainMoni(6, chainCurMax, CM.Cache.WrathCookiesMult);
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Chain\" Reward (CUR) (Golden / Wrath)', document.createTextNode((Beautify(chainCur) + ' / ' + Beautify(chainCurWrath))), goldCookTooltip));
	return section;
}

/**
 * This function creates the "Conjure" section of the stats page
 * @returns	{object}	section		The object contating the Conjure section
 */
CM.Disp.CreateStatsConjureSection = function() {
	var section = document.createElement('div');
	section.className = 'CMStatsConjureSection';

	var conjureColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	var conjureCur = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30);
	var conjureTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.FormatTime((CM.Cache.Conjure - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	
	var conjureReqFrag = document.createDocumentFragment();
	var conjureReqSpan = document.createElement('span');
	conjureReqSpan.style.fontWeight = 'bold';
	conjureReqSpan.className = CM.Disp.colorTextPre + conjureColor;
	conjureReqSpan.textContent = Beautify(CM.Cache.Conjure);
	conjureReqFrag.appendChild(conjureReqSpan);
	if (conjureTime != '') {
		var conjureReqSmall = document.createElement('small');
		conjureReqSmall.textContent = ' (' + conjureTime + ')';
		conjureReqFrag.appendChild(conjureReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Conjure Baked Goods\" Cookies Required', conjureReqFrag, 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Conjure Baked Goods\" Reward (MAX)', document.createTextNode(CM.Disp.Beautify(CM.Cache.ConjureReward)), 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '\"Conjure Baked Goods\" Reward (CUR)', document.createTextNode(CM.Disp.Beautify(conjureCur)), 'GoldCookTooltipPlaceholder'));
	return section;
}

/**
 * This function creates the "Prestige" section of the stats page
 * @returns	{object}	section		The object contating the Prestige section
 */
CM.Disp.CreateStatsPrestigeSection = function() {
	var section = document.createElement('div');
	section.className = 'CMStatsPrestigeSection';

	var possiblePresMax = Math.floor(Game.HowMuchPrestige(CM.Cache.RealCookiesEarned + 
		Game.cookiesReset + CM.Cache.WrinkGodBank + 
		(Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0)));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Prestige Level (CUR / MAX)', document.createTextNode(Beautify(Game.prestige) + ' / ' + Beautify(possiblePresMax)), 'PrestMaxTooltipPlaceholder'));
	
	var neededCook = Game.HowManyCookiesReset(possiblePresMax + 1) - (CM.Cache.RealCookiesEarned + Game.cookiesReset + CM.Cache.WrinkGodBank + ((Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0) ? CM.Cache.lastChoEgg : 0));
	var cookiesNextFrag = document.createDocumentFragment();
	cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
	var cookiesNextSmall = document.createElement('small');
	cookiesNextSmall.textContent = ' (' + (CM.Disp.FormatTime(neededCook / CM.Cache.AvgCPSChoEgg, 1)) + ')';
	cookiesNextFrag.appendChild(cookiesNextSmall);
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Cookies To Next Level', cookiesNextFrag, 'NextPrestTooltipPlaceholder'));
	
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Heavenly Chips (CUR / MAX)', document.createTextNode(Beautify(Game.heavenlyChips) + ' / ' + Beautify((possiblePresMax - Game.prestige) + Game.heavenlyChips)), 'HeavenChipMaxTooltipPlaceholder'));
	
	var resetBonus = CM.Sim.ResetBonus(possiblePresMax);
	var resetFrag = document.createDocumentFragment();
	resetFrag.appendChild(document.createTextNode(Beautify(resetBonus)));
	var increase = Math.round(resetBonus / Game.cookiesPs * 10000);
	if (isFinite(increase) && increase != 0) {
		var resetSmall = document.createElement('small');
		resetSmall.textContent = ' (' + (increase / 100) + '% of income)';
		resetFrag.appendChild(resetSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Reset Bonus Income', resetFrag, 'ResetTooltipPlaceholder'));

	var currentPrestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset));
	var willHave = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
	var willGet = willHave - currentPrestige;
	if (!Game.Has('Lucky digit')) {
		var delta7 = 7 - (willHave % 10);
		if (delta7 < 0) delta7 += 10;
		var next7Reset = willGet + delta7;
		var next7Total = willHave + delta7;
		var frag7 = document.createDocumentFragment();
		frag7.appendChild(document.createTextNode(next7Total.toLocaleString() + " / " + next7Reset.toLocaleString() + " (+" + delta7 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Digit" (total / reset)', frag7));
	}
	
	if (!Game.Has('Lucky number')) {
		var delta777 = 777 - (willHave % 1000);
		if (delta777 < 0) delta777 += 1000;
		var next777Reset = willGet + delta777;
		var next777Total = willHave + delta777;
		var frag777 = document.createDocumentFragment();
		frag777.appendChild(document.createTextNode(next777Total.toLocaleString() + " / " + next777Reset.toLocaleString() + " (+" + delta777 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Number" (total / reset)', frag777));
	}
	
	if (!Game.Has('Lucky payout')) {
		var delta777777 = 777777 - (willHave % 1000000);
		if (delta777777 < 0) delta777777 += 1000000;
		var next777777Reset = willGet + delta777777;
		var next777777Total = willHave + delta777777;
		var frag777777 = document.createDocumentFragment();
		frag777777.appendChild(document.createTextNode(next777777Total.toLocaleString() + " / " + next777777Reset.toLocaleString() + " (+" + delta777777 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Payout" (total / reset)', frag777777));
	}

	return section;
}

// TODO: Fix and annotate this function.
/**
CM.Disp.AddMissingUpgrades = function() {
	if (CM.Cache.UpgradesOwned != Game.UpgradesOwned) {
		CM.Cache.CalcMissingUpgrades();
		CM.Cache.MissingUpgradesString = null;
        CM.Cache.MissingCookiesString = null;
	}

	// Sort the lists of missing cookies & upgrades
	var sortMap = function(a,b) {
		if (a.order > b.order) return 1;
		else if (a.order < b.order) return -1;
		else return 0;
	}
	CM.Cache.MissingUpgrades.sort(sortMap);
	CM.Cache.MissingCookies.sort(sortMap);;

	// Find Upgrades-section of stats menu
	var upgradesMenu = null;
 	for (var i = 0; i < l("menu").getElementsByClassName("subsection").length && upgradesMenu == null; i++)
 	{
 		if (l("menu").getElementsByClassName("subsection")[i].getElementsByClassName("title")[0].textContent === "Upgrades")
 		{
 			upgradesMenu = l("menu").getElementsByClassName("subsection")[i];
 		}
 	}

	// This function creates div element from given object. It also adds tooltip for it.
	var createUpgradeElement = function (me) {
		return '<div class="crate upgrade disabled noFrame" ' +
			Game.getTooltip(
				'<div style="padding:8px 4px;min-width:350px;">' +
				'<div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48) + 'px ' + (-me.icon[1] * 48) + 'px;"></div>' +
				'<div style="float:right;"><span class="price">' + Beautify(Math.round(me.getPrice())) + '</span></div>' +
				'<div class="name">' + me.name + '</div>' +
				'<div class="line"></div><div class="description">' + me.desc + '</div></div>',
				'top',
				true) +
			' style="background-position:' + (-me.icon[0] * 48) + 'px ' + (-me.icon[1] * 48) + 'px;"></div>';
	};

	// This function creates section of given elements and adds this elements to it.
	var createElementBox = function (elements) {
		var div = document.createElement('div');
		div.className = 'listing crateBox';
		elements.forEach(function (element) {
			div.innerHTML += createUpgradeElement(element);
	});
		return div;
	};

	// This function creates header element with given text.
	var createHeader = function (text) {
		var div = document.createElement('div');
		div.className = 'listing';
		var b = document.createElement('b');
		b.textContent = text;
		div.appendChild(b);
		return div;
	};

	if (CM.Cache.MissingUpgrades.length > 0) {
		upgradesMenu.appendChild(createHeader("Missing Upgrades"));
		if (CM.Cache.MissingUpgradesString == null) {
			CM.Cache.MissingUpgradesString = createElementBox(CM.Cache.MissingUpgrades);
	}
		upgradesMenu.appendChild(CM.Cache.MissingUpgradesString);
	}

	if (CM.Cache.MissingCookies.length > 0) {
		upgradesMenu.appendChild(createHeader("Missing Cookies"));
		if (CM.Cache.MissingCookiesString == null) {
			CM.Cache.MissingCookiesString = createElementBox(CM.Cache.MissingCookies);
		}
		upgradesMenu.appendChild(CM.Cache.MissingCookiesString);
	}
} */

/********
 * Section: Variables used in Disp functions
 */

/**
 * This list is used to make some very basic tooltips.
 * It is used by CM.DelayInit() in the call of CM.Disp.CreateSimpleTooltip()
 * @item	{string}	placeholder	
 * @item	{string}	text		
 * @item	{string}	minWidth	
 */
CM.Disp.TooltipText = [
	['GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px'],
	['GoldCookDragonsFortuneTooltipPlaceholder', 'Calculated with Golden Switch off and at least one golden cookie on-screen', '240px'],
	['PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '320px'], 
	['NextPrestTooltipPlaceholder', 'Calculated with cookies gained from wrinklers and Chocolate egg', '200px'], 
	['HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '330px'], 
	['ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from ascension achievements if you have the same buildings/upgrades after reset', '370px'], 
	['ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and then buying Chocolate egg', '300px']
];

/**
 * These are variables used to create DOM object names and id (e.g., 'CMTextTooltip)
 */
CM.Disp.colorTextPre = 'CMText';
CM.Disp.colorBackPre = 'CMBack';
CM.Disp.colorBorderPre = 'CMBorder';

/**
 * These are variables which can be set in the options by the user to standardize colours throughout CookieMonster
 */
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


/**
 * This array is used to give certain timers specific colours
 */
CM.Disp.buffColors = {'Frenzy': CM.Disp.colorYellow, 'Dragon Harvest': CM.Disp.colorBrown, 'Elder frenzy': CM.Disp.colorGreen, 'Clot': CM.Disp.colorRed, 'Click frenzy': CM.Disp.colorBlue, 'Dragonflight': CM.Disp.colorPink};
CM.Disp.GCTimers = {};
CM.Disp.lastAscendState = -1;

/**
 * These lists are used in the stats page to show 
 * average cookies per {CM.Disp.cookieTimes/CM.Disp.clickTimes} seconds
 */
CM.Disp.cookieTimes = [10, 15, 30, 60, 300, 600, 900, 1800];
CM.Disp.clickTimes = [1, 5, 10, 15, 30];

/**
 * This lists is used to store whether a Wrinkler tooltip is being shown or not
 * [i] = 1 means tooltip is being shown, [i] = 0 means hidden
 * It is used by CM.Disp.CheckWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
CM.Disp.TooltipWrinklerBeingShown = [];

/**
 * These are variables with base-values that get initalized when initliazing CookieMonster 
 * TODO: See if these can be removed or moved
 */
CM.Disp.TooltipWrinklerArea = 0;
CM.Disp.TooltipWrinkler = -1;

