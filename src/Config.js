/**********
 * Config *
 **********/

/********
 * Section: Functions related to saving, loading and restoring configs */

/**
 * This function saves the config of CookieMonster without saving any of the other save-data
 * This allows saving in between the autosave intervals
 * It is called by CM.Config.LoadConfig(), CM.Config.RestoreDefault(), CM.Config.ToggleConfig(), 
 * CM.ToggleConfigVolume() and changes in options with type "url", "color" or "numscale"
 */
CM.Config.SaveConfig = function() {
	let saveString = b64_to_utf8(unescape(localStorage.getItem('CookieClickerGame')).split('!END!')[0]);
	let CookieMonsterSave = saveString.match(/CookieMonster.*(;|$)/);
	if (CookieMonsterSave != null) {
		let newSaveString = saveString.replace(CookieMonsterSave[0], "CookieMonster:" + CM.save());
		localStorage.setItem('CookieClickerGame', escape(utf8_to_b64(newSaveString)+'!END!'));
	}
};

/**
 * This function loads the config of CookieMonster saved in localStorage and loads it into CM.Options
 * It is called by CM.DelayInit() and CM.Config.RestoreDefault()
 */
CM.Config.LoadConfig = function(settings) {
	// This removes cookies left from earlier versions of CookieMonster
	if (typeof localStorage.CMConfig != "undefined") {
		delete localStorage.CMConfig;
	}
	if (settings != null) {
		CM.Options = settings;

		// Check values
		var mod = false;
		for (let i in CM.Data.ConfigDefault) {
			if (typeof CM.Options[i] === 'undefined') {
				mod = true;
				CM.Options[i] = CM.Data.ConfigDefault[i];
			}
			else if (i != 'Header' && i != 'Colors') {
				if (i.indexOf('SoundURL') == -1) {
					if (!(CM.Options[i] > -1 && CM.Options[i] < CM.ConfigData[i].label.length)) {
						mod = true;
						CM.Options[i] = CM.Data.ConfigDefault[i];
					}
				}
				else {  // Sound URLs
					if (typeof CM.Options[i] != 'string') {
						mod = true;
						CM.Options[i] = CM.Data.ConfigDefault[i];
					}
				}
			}
			else if (i == 'Header') {
				for (let j in CM.Data.ConfigDefault.Header) {
					if (typeof CM.Options[i][j] === 'undefined' || !(CM.Options[i][j] > -1 && CM.Options[i][j] < 2)) {
						mod = true;
						CM.Options[i][j] = CM.Data.ConfigDefault[i][j];
					}
				}
			}
			else { // Colors
				for (let j in CM.Data.ConfigDefault.Colors) {
					if (typeof CM.Options[i][j] === 'undefined' || typeof CM.Options[i][j] != 'string') {
						mod = true;
						CM.Options[i][j] = CM.Data.ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) CM.Config.SaveConfig();
		CM.Loop(); // Do loop once
		for (let i in CM.Data.ConfigDefault) {
			if (i != 'Header' && typeof CM.ConfigData[i].func !== 'undefined') {
				CM.ConfigData[i].func();
			}
		}
	}
	else { // Default values
		CM.Config.RestoreDefault();
	}
};

/**
 * This function reloads and resaves the default config as stored in CM.Data.ConfigDefault
 * It is called by resDefBut.onclick loaded in the options page or by CM.Config.LoadConfig if no localStorage is found
 */
CM.Config.RestoreDefault = function() {
	CM.Config.LoadConfig(CM.Data.ConfigDefault);
	CM.Config.SaveConfig();
	Game.UpdateMenu();
};

/********
 * Section: Functions related to toggling or changing configs */

/**
 * This function toggles options by incrementing them with 1 and handling changes
 * It is called by the onclick event of options of the "bool" type
 * @param 	{string}	config	The name of the option
 */
CM.Config.ToggleConfig = function(config) {
	CM.Options[config]++;

	if (CM.Options[config] == CM.ConfigData[config].label.length) {
		CM.Options[config] = 0;
		if (CM.ConfigData[config].toggle) l(CM.Config.ConfigPrefix + config).className = 'option off';
	}
	else l(CM.Config.ConfigPrefix + config).className = 'option';

	if (typeof CM.ConfigData[config].func !== 'undefined') {
		CM.ConfigData[config].func();
	}

	l(CM.Config.ConfigPrefix + config).innerHTML = CM.ConfigData[config].label[CM.Options[config]];
	CM.Config.SaveConfig();
};

/**
 * This function sets the value of the specified volume-option and updates the display in the options menu
 * It is called by the oninput and onchange event of "vol" type options
 * @param 	{string}	config	The name of the option
 */
CM.Config.ToggleConfigVolume = function(config) {
	if (l("slider" + config) != null) {
		l("slider" + config + "right").innerHTML = l("slider" + config).value + "%";
		CM.Options[config] = Math.round(l("slider" + config).value);
	} 
	CM.Config.SaveConfig();
};

/**
 * This function toggles header options by incrementing them with 1 and handling changes
 * It is called by the onclick event of the +/- next to headers
 * @param 	{string}	config	The name of the header
 */
CM.Config.ToggleHeader = function(config) {
	CM.Options.Header[config]++;
	if (CM.Options.Header[config] > 1) CM.Options.Header[config] = 0;
	CM.Config.SaveConfig();
};

/********
 * Section: Functions related to notifications */

/**
 * This function checks if the user has given permissions for notifications
 * It is called by a change in any of the notification options
 * Note that most browsers will stop asking if the user has ignored the prompt around 6 times
 * @param 	{number}	ToggleOnOff		A number indicating whether the option has been turned off (0) or on (1)
 */
CM.Config.CheckNotificationPermissions = function(ToggleOnOff) {
	if (ToggleOnOff == 1)	{
		// Check if browser support Promise version of Notification Permissions
		let checkNotificationPromise = function () {
			try {
				Notification.requestPermission().then();
			} catch(e) {
				return false;
			}
			return true;
		};

		// Check if the browser supports notifications and which type
		if (!('Notification' in window)) {
			console.log("This browser does not support notifications.");
		} 
		else {
			if(checkNotificationPromise()) {
				Notification.requestPermission().then();
			} 
			else {
				Notification.requestPermission();
			}
		}
	}
};

/********
 * Section: Variables used in Config functions */

/**
 * Used to name certain DOM elements and refer to them
 */
CM.Config.ConfigPrefix = 'CMConfig';
