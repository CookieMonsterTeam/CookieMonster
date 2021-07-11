import { ConfigGroups, ConfigGroupsNotification } from '../../../Data/Sectionheaders.ts';
import settings from '../../../Data/settings';
import { FavouriteSettings } from '../../VariablesAndData';
import CreatePrefHeader from './CreateHeader';
import CreatePrefOption from './CreateOption';

/**
 * This function adds the options/settings of CookieMonster to the options page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
export default function AddMenuPref(title) {
  const frag = document.createDocumentFragment();
  frag.appendChild(title);

  Object.keys(ConfigGroups).forEach((group) => {
    if (group === 'Favourite') {
      if (
        FavouriteSettings.length !== 0 &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FavouriteSettings > 0
      ) {
        frag.appendChild(CreatePrefHeader(group, ConfigGroups[group])); // (group, display-name of group)
        if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[group])
          for (let index = 0; index < FavouriteSettings.length; index++) {
            frag.appendChild(CreatePrefOption(FavouriteSettings[index]));
          }
      }
    } else {
      frag.appendChild(CreatePrefHeader(group, ConfigGroups[group])); // (group, display-name of group)
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[group]) {
        // 0 is show, 1 is collapsed
        // Make sub-sections of Notification section
        if (group === 'Notification') {
          Object.keys(ConfigGroupsNotification).forEach((subGroup) => {
            const subGroupObject = CreatePrefHeader(subGroup, ConfigGroupsNotification[subGroup]); // (group, display-name of group)
            subGroupObject.style.fontSize = '15px';
            subGroupObject.style.opacity = '0.5';
            frag.appendChild(subGroupObject);
            if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[subGroup]) {
              Object.keys(settings).forEach((option) => {
                if (settings[option].group === subGroup) frag.appendChild(CreatePrefOption(option));
              });
            }
          });
        } else {
          Object.keys(settings).forEach((option) => {
            if (settings[option].group === group) frag.appendChild(CreatePrefOption(option));
          });
        }
      }
    }
  });

  l('menu').childNodes[2].insertBefore(
    frag,
    l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1],
  );
}
