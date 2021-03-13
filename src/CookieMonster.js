/* eslint-disable no-unused-vars */
import init from './InitSaveLoad/init';
import load from './InitSaveLoad/load';
import save from './InitSaveLoad/save';

const CM = {
	init: init,
	load: load,
	save: save,
};

Game.registerMod('CookieMonster', CM);
