/** Called by the "func" of individual settings */

/**
 * This function changes the position of both the bottom and timer bar
 */
export function UpdateBotTimerBarPosition() {
	if (CM.Options.BotBar === 1 && CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 1) {
		CM.Disp.BotBar.style.bottom = l('CMTimerBar').style.height;
		l('game').style.bottom = `${Number(l('CMTimerBar').style.height.replace('px', '')) + 70}px`;
	} else if (CM.Options.BotBar === 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '70px';
	} else if (CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 1) {
		l('game').style.bottom = l('CMTimerBar').style.height;
	} else { // No bars
		l('game').style.bottom = '0px';
	}

	if (CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 0) {
		l('sectionLeft').style.top = l('CMTimerBar').style.height;
	} else {
		l('sectionLeft').style.top = '';
	}

	CM.Disp.UpdateBackground();
}

/**
 * This function changes the visibility of the timer bar
 */
export function ToggleTimerBar() {
	if (CM.Options.TimerBar === 1) l('CMTimerBar').style.display = '';
	else l('CMTimerBar').style.display = 'none';
	UpdateBotTimerBarPosition();
}

/**
 * This function changes the position of the timer bar
 */
export function ToggleTimerBarPos() {
	if (CM.Options.TimerBarPos === 0) {
		l('CMTimerBar').style.width = '30%';
		l('CMTimerBar').style.bottom = '';
		l('game').insertBefore(l('CMTimerBar'), l('sectionLeft'));
	} else {
		l('CMTimerBar').style.width = '100%';
		l('CMTimerBar').style.bottom = '0px';
		l('wrapper').appendChild(l('CMTimerBar'));
	}
	UpdateBotTimerBarPosition();
}

/**
 * This function toggle the bottom bar
 * It is called by CM.Disp.UpdateAscendState() and a change in CM.Options.BotBar
 */
export function ToggleBotBar() {
	if (CM.Options.BotBar === 1) {
		CM.Disp.BotBar.style.display = '';
		if (!CM.Footer.isInitzializing) {
			CM.Disp.UpdateBotBar();
		}
	} else {
		CM.Disp.BotBar.style.display = 'none';
	}
	UpdateBotTimerBarPosition();
}
