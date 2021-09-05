import init from './InitSaveLoad/init';
import load from './InitSaveLoad/load';
import save from './InitSaveLoad/save';

const CM = {
  init,
  load,
  save,
};

if (typeof Steam !== 'undefined') {
  // Need to add a delay for steam
  setTimeout(function () {
    Game.registerMod('CookieMonster', CM);

    // Game.registerMod also calls CM.load() which calls the loop hook
    // Thus sounds normally play at start up as Season and Garden states are checked
    window.cookieMonsterFrameworkData.isInitializing = false;
  }, 2000);
} else {
  Game.registerMod('CookieMonster', CM);
  window.cookieMonsterFrameworkData.isInitializing = false;
}
