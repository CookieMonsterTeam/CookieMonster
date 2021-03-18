/** Data related directly to Cookie Monster */

export const VersionMajor = '2.031';
export const VersionMinor = '6';

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
The latest update (v 2.031.6) has revamped the way PP is colourcoded. In the previous versions this was not always correct and we had some settings that made it even more incorrect. With this update Cookie Monster compares the PP of a building to all other possibilities (also buying 10 or 100) of a building and colors the PP accordingly.</br>
This means that if it is better to buy 10 of a building immediately rather than to buy in increments of 1 Cookie Monster will now show this! In this case the buy 1 option will be yellow, while the buy 10 option will be green.</br>
This also means that you will see some more diverse colors. Rather than coloring according to arbitrary "middle values" Cookie Monster now uses a top 10, 20 and 30. While this might take some getting used to we believe the new system is much better in conveying useful information to the user while also being more correct!</br>
</br>
This update also implements the following functions:</br>
- Added a tooltip displaying the reward to the extra pop wrinkler buttons</br>
- Added tooltips to the Gods in the Pantheon</br>
- The tooltip for Elder Pledge now displays correctly, although it takes some time to load after Cookie Monster has been loaded</br>
- You can now test the volume and sound of notifications in the settings screen</br>
- The bottom bar will now flicker less and each column has received a bit of padding</br>
- Introduced new colour scheme for PP, see the explanation of colors in the Readme or the settings</br>
- Added option to show buttons that can hide the upgrade and building section</br>
- Added option to display PP as a time unit, note that these are only approximations. PP does not translate directly into time (the name is deceptive, we know...)</br>
- Statistics page now shows chance for random drops when they have not been achieved</br>
</br>
This update fixes the following bugs:</br>
- Incorrect amount for "required for max plant reward" in statistics page</br>
- Fixed the tooltips of the '?' buttons in the statistics page not showing</br>
- Fixed some unclear settings descriptions </br>
</br>
Please submit any bug reports or feature requests to the <a href="https://github.com/Aktanusa/CookieMonster">GitHub page!</a>
</br>
</div>
`;
