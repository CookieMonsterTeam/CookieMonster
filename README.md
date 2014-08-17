# Cookie Monster

**Cookie Monster** is an addon you can load into Cookie Clicker, that offers a wide range of tools and statistics to enhance the game. It is **not** a cheat interface – although it does offer helpers for golden cookies and such, everything can be toggled off at will to only leave how much information you want.

This is a helper, and it is here to help you at *whichever* degree you want, if you only need some help shortening long numbers, it does that. If you need to be accompanied by hand to pick the best buildings to buy, it does that, but **everything is an option**.

## Current version

You can see the current version, and a full history of all versions and what they changed by consulting the [releases page](https://github.com/Aktanusa/CookieMonster/releases).

## What it does

At its core, Cookie Monster computes an index on both buildings and upgrades :

* **Base Cost per Income (BCI)** : Indicates how much a building is worth by comparing how much it costs to how much income gained

Cookie Monster also indicates the time left before being able to buy an upgrade or building, and takes it into consideration. It will take *everything* in consideration, meaning if buying a building also unlocks an achievement which boosts your income, which unlocks an achievement, it will know and highlight that building's value.

This index is computed for buildings and upgrades. If the relevant option is enabled, it will color-code each of them based on their value :

* Light Blue : (upgrades) This item has a better BCI than any building
* Green : This item has the best BCI
* Yellow : This item is not the best, but it is closer to best than it is to worst
* Orange : This item is not the worst, but it is closer to worst than it is to best
* Red : This item has the worst BCI
* Purple : (upgrades) This item has a worse BCI than any building
* Gray : (upgrades) This item has not been calculated and/or cannot be calculated due to no definitive worth.

Note : For this index, **lower is better**, meaning a building with a BCI of 1 is more interesting than one with a BCI of 3.

## What it doesn't do

Most likely you'll find items in gray like Golden Cookie upgrades, clicking upgrades – everything that doesn't earn you a direct bonus to your income will display as gray. This means the following upgrades are **not** taken into account by Cookie Monster :

* Plastic mouse
* Iron mouse
* Titanium mouse
* Adamantium mouse
* Unobtainium mouse
* Lucky day
* Serendipity
* Get lucky
* Elder Pledge
* Sacrificial rolling pins
* **etc.**

Do note though that, although these upgrades have no direct value, if buying them earns you an achievement of some sort which in return gives you milk and income, Cookie Monster **will** display that value.

# Using

## Bookmarklet

Copy this code and save it as a bookmark. Paste it in the URL section. To activate, click the bookmark when the game's open.

```javascript
javascript: (function () {
	Game.LoadMod('http://aktanusa.github.io/CookieMonster/CookieMonster.js');
}());
```

If (for some reason) the above doesn't work, trying pasting everything after the <code>javascript:</code> bit into your browser's console.

## Userscript

If you'd rather use the addon as a script via per example *Greasemonkey* or *Tampermonkey*, you can use the following script, which will automatically load *Cookie Monster* every time the original game loads. You may need to specify <code>http://orteil.dashnet.org/cookieclicker/</code> when asked for a *namespace* or *includes*. For how to add an userscript to your browser, refer to your browser/plugin's documentation as the method changes for each one.

```javascript
// ==UserScript==
// @name Cookie Monster
// @namespace Cookie
// @include http://orteil.dashnet.org/cookieclicker/
// @version 1
// @grant none
// ==/UserScript==

javascript:(function() {
    var checkReady = setInterval(function() {
        if (Game.ready != undefined && Game.ready) {
            Game.LoadMod('http://aktanusa.github.io/CookieMonster/CookieMonster.js');
            clearInterval(checkReady);
        }
    }, 1000);
}());
```

# Bugs and suggestions

Any bug or suggestion should be **opened as an issue** [in the repository](https://github.com/Aktanusa/CookieMonster/issues) for easier tracking. This allows me to close issues once they're fixed.

Before submitting a bug, make sure to give a shot at the latest version of the addon on the <code>dev</code> branch. For this, use the following bookmarklet:

```javascript
javascript: (function () {
	Game.LoadMod('https://raw.githubusercontent.com/Aktanusa/CookieMonster/dev/CookieMonster.js');
}());
```

If the bug is still here, you can submit an issue for it.

All suggestions are welcome, even the smallest ones.

#Contributors

* **[Raving_Kumquat](http://cookieclicker.wikia.com/wiki/User:Raving_Kumquat)** : Original author
* **[Maxime Fabre](https://github.com/Anahkiasen)** : Previous maintainer
* **Alderi Tokori** : ROI calculations (unused now)
* **[Aktanusa](https://github.com/Aktanusa)** : Current maintainer