import init from './InitSaveLoad/init';
import load from './InitSaveLoad/load';
import save from './InitSaveLoad/save';

const CM = {
  init,
  load,
  save,
};

Game.registerMod('CookieMonster', CM);
