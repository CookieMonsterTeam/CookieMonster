// ==UserScript==
// @name Cookie Monster
// @include /https?://orteil.dashnet.org/cookieclicker/
// @include /https?://cookieclicker.ee/
// ==/UserScript==

const readyCheck = setInterval(() => {
  const Game = unsafeWindow.Game;

  if (typeof Game !== 'undefined' && typeof Game.ready !== 'undefined' && Game.ready) {
    Game.LoadMod('https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js');
    clearInterval(readyCheck);
  }
}, 1000);
