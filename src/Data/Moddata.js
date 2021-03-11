/** Data related directly to Cookie Monster */

export const VersionMajor = '2.031';
export const VersionMinor = '5';

/** Information about Cookie Monster to be displayed in the info section */
export const ModDescription = `<div class="listing">
 <a href="https://github.com/Aktanusa/CookieMonster" target="blank">Cookie Monster</a>
 offers a wide range of tools and statistics to enhance your game experience.
 It is not a cheat interface – although it does offer helpers for golden cookies and such, everything can be toggled off at will to only leave how much information you want.</br>
 Progess on new updates and all previous release notes can be found on the GitHub page linked above!</br>
 Please also report any bugs you may find over there!</br>
 </div>
 `;

/** Latest releasenotes of Cookie Monster to be displayed in the info section */
export const LatestReleaseNotes = `<div class="listing">
 <b>The latest update (v 2.031.4) has introduced the following features:</b></br>
 - Added a changelog to the info tab and notification indicating a new version</br>
 - Warnings in tooltips are now based on the income after buying the upgrade</br>
 - A new warning and stat for Conjure Baked Goods in combination with Frenzy has been added</br>
 - User can now set a custom tooltip warning ("x times cps") in the settings</br>
 - Garden plots with plants that give cookies on harvest now display a tooltip with current and maximum reward</br>
 - The Harvest All button in the Garden now has a tooltip displaying the current reward </br>
 - The Ascend button can now display additional info (this can be turned off in the settings) </br>
 - The statistics page now displays the Heavenly Chips per second</br>
 - The statistics page now displays the CPS needed for the next level in Chain Cookies</br>
 - The statistics page now displays the cookies needed for optimal rewards for garden plants</br>
 - You can now set a Heavenly Chips target in the settings which will be counted down to in the statistics page</br>
 - The color picker in the settings has been updated to its latest version</br>
 - The overlay of seconds/percentage of timers is now toggle able and more readable</br>
 - You can now toggle to disable bulk-buying from buying less than the selected amount (i.e., buying 7 of a building by pressing the buy 10 when you don't have enough for 10)</br>
 - CookieMonster now uses the Modding API provided by the base game</br>
 - There is a new option that allows the decoupling of the base game volume setting and the volumes of sounds created by the mod</br>
 - The tab title now displays a "!" if a Golden Cookie or Reindeer can spawn</br>
 - PP calculation can now be set to: 1) Exclude the 1st, 2nd or 3rd most optimal building (if you never want to buy that it), 2) Always consider optimal buildings that cost below "xx seconds of CPS" (toggleable in the settings), 3) Ignore any building or upgrade that is not purchasable at the moment</br>
 </br>
 <b>This update fixes the following bugs:</b></br>
 - Minigames with enhanced tooltips will now also show these if the minigames were not loaded when CookieMonster was loaded</br>
 - Sound, Flashes and Notifications will no longer play when the mod is initializing</br>
 - The color picker should now update its display consistently</br>
 - Fixed some typo's</br>
 - Fixed a game breaking bug when the player had not purchased any upgrades</br>
 - Fixed a number of console errors thrown by CM</br>
 - Fixed the integration with mods that provide additional content, they should now no longer break CookieMonster</br>
 - The Timer bar will now disappear correctly when the Golden Switch has been activated</br>
 - Fixed errors in the calculation of the Chain Cookies and Wrinkler stats</br>
 - Fixed buy warnings showing incorrectly</br>
 </div>
 `;
