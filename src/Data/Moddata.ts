/** Data related directly to Cookie Monster */

export const VersionMajor = '2.031';
export const VersionMinor = '9';

/** Information about Cookie Monster to be displayed in the info section */
export const ModDescription = `<a href="https://github.com/CookieMonsterTeam/CookieMonster" target="blank">Cookie Monster</a>
 offers a wide range of tools and statistics to enhance your game experience.
 It is not a cheat interface – although it does offer helpers for golden cookies and such, everything can be toggled off at will to only leave how much information you want.</br>
 Progess on new updates and all previous release notes can be found on the GitHub page linked above!</br>
 Please also report any bugs you may find over there!</br>
 `;

/** Latest releasenotes of Cookie Monster to be displayed in the info section */
export const LatestReleaseNotes = `This update implements the following functions:</br>
- HOTFIX: Fixed the possibility of clicking Golden Cookies multiple times with autoclickers</br>
- For developers: we now expose some data calculated by Cookie Monster to the global scope. You can access it through the CookieMonsterData object</br>
- The column with the most optimal building now has a green coloured indicator whenever colour coding is turned on</br>
- The current season in the seasons statistics section is now displayed with green text for easier identification</br>
- New option to show a timer bar that counts down till next autosave</br>
- New option to sort buildings based on the "cost till next achievement"</br>
- Added extra information about achievements in statistics page</br>
</br>
This update fixes the following bugs:</br>
- Fixed a bug where ignoring certain buildings in rare cases did not create a "most optimal building"</br>
- Fixed some issues related to "left till achievement"</br>
- Fixed some cases where upgrades and buildings were not correctly sorted</br>
- Fixed the tooltip of "Pop all normal wrinklers" displaying an incorrect reward when Shiny's are present</br>
`;
