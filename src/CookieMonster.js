/* eslint-disable no-unused-vars */
import init from './InitSaveLoad/init';
import load from './InitSaveLoad/load';
import save from './InitSaveLoad/save';

const CM = {
	init: init,
	load: load,
	save: save,
};

/**
 * Section: Functions related to the initialization of CookieMonster */

/**
 * This functions loads an external script (on the same repository) that creates the
 * functionality needed to dynamiccaly change colours
 * It is called by the last function in the footer
 */
function AddJscolor() {
	const Jscolor = document.createElement('script');
	Jscolor.type = 'text/javascript';
	Jscolor.setAttribute('src', 'https://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(Jscolor);
}

/**
 * This functions starts the initizialization and register CookieMonster
 * It is called as the last function in this script's execution
 */
AddJscolor();
const delay = setInterval(function () {
	if (typeof jscolor !== 'undefined') {
		jscolor.init();
		Game.registerMod('CookieMonster', CM);
		clearInterval(delay);
	}
}, 500);
