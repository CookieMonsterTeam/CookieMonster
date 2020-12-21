/**********
 * Footer *
 **********/

/********
 * Section: Functions related to base game modding API */

/**
 * This register a init function to the CM object. Per Game code/comments:
 * "this function is called as soon as the mod is registered
 * declare hooks here"
 * It starts the further initialization of CookieMonster and registers hooks
 */
CM.init = function() {
    var proceed = true;
    if (Game.version != CM.VersionMajor) {
        proceed = confirm('Cookie Monster version ' + CM.VersionMajor + '.' + CM.VersionMinor + ' is meant for Game version ' + CM.VersionMajor + '.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?');
    }
    if (proceed) {
        CM.DelayInit();
        Game.registerHook('draw', CM.Disp.Draw);
    }
}

/**
 * This registers a save function to the CM object. Per Game code/comments:
 * "use this to store persistent data associated with your mod
 * return 'a string to be saved';"
 */
CM.save = function() {
    return JSON.stringify({
        settings: CM.Options,
        version: CM.VersionMajor + '.' + CM.VersionMinor,
    });
}

/**
 * This registers a load function to the CM object. Per Game code/comments:
 * "do stuff with the string data you saved previously"
 */
CM.load = function(str) {
    let save = JSON.parse(str);
    CM.Config.LoadConfig(save.settings);
}

/********
 * Section: Functions related to the initialization of CookieMonster */

/**
 * This functions loads an external script (on the same repository) that creates a Queue() function
 * It is called by the last function in the footer
 */
CM.Footer.AddQueue = function() {
	CM.Footer.Queue = document.createElement('script');
	CM.Footer.Queue.type = 'text/javascript';
	CM.Footer.Queue.src = 'https://aktanusa.github.io/CookieMonster/queue/queue.js';
	document.head.appendChild(CM.Footer.Queue);
}

/**
 * This functions loads an external script (on the same repository) that creates the 
 * functionality needed to dynamiccaly change colours
 * It is called by the last function in the footer
 */
CM.Footer.AddJscolor = function() {
	CM.Footer.Jscolor = document.createElement('script');
	CM.Footer.Jscolor.type = 'text/javascript';
	CM.Footer.Jscolor.setAttribute('src', 'https://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(CM.Footer.Jscolor);
}

/**
 * This functions starts the initizialization and register CookieMonster
 * It is called as the last function in this script's execution
 */
if (!CM.isRunning) {
    CM.Footer.AddQueue();
    CM.Footer.AddJscolor();
    var delay = setInterval(function() {
        if (typeof Queue !== 'undefined' && typeof jscolor !== 'undefined') {
            Game.registerMod('CookieMonster', CM);
            clearInterval(delay);
        }
    }, 500);
    CM.isRunning = 1
}

