import { LoadConfig } from '../../../Config/SaveLoadReload/SaveLoadReloadSettings';
import { CMOptions } from '../../../Config/VariablesAndData';
import { ConfigGroups, ConfigGroupsNotification } from '../../../Data/Sectionheaders.ts';
import Config from '../../../Data/SettingsData';
import ConfigDefault from '../../../Data/SettingsDefault.ts';
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
      if (FavouriteSettings.length !== 0 && CMOptions.FavouriteSettings > 0) {
        frag.appendChild(CreatePrefHeader(group, ConfigGroups[group])); // (group, display-name of group)
        if (CMOptions.Header[group])
          for (let index = 0; index < FavouriteSettings.length; index++) {
            frag.appendChild(CreatePrefOption(FavouriteSettings[index]));
          }
      }
    } else {
      frag.appendChild(CreatePrefHeader(group, ConfigGroups[group])); // (group, display-name of group)
      if (CMOptions.Header[group]) {
        // 0 is show, 1 is collapsed
        // Make sub-sections of Notification section
        if (group === 'Notification') {
          Object.keys(ConfigGroupsNotification).forEach((subGroup) => {
            const subGroupObject = CreatePrefHeader(subGroup, ConfigGroupsNotification[subGroup]); // (group, display-name of group)
            subGroupObject.style.fontSize = '15px';
            subGroupObject.style.opacity = '0.5';
            frag.appendChild(subGroupObject);
            if (CMOptions.Header[subGroup]) {
              Object.keys(Config).forEach((option) => {
                if (Config[option].group === subGroup) frag.appendChild(CreatePrefOption(option));
              });
            }
          });
        } else {
          Object.keys(Config).forEach((option) => {
            if (Config[option].group === group) frag.appendChild(CreatePrefOption(option));
          });
        }
      }
    }
  });

  const resDef = document.createElement('div');
  resDef.className = 'listing';
  const resDefBut = document.createElement('a');
  resDefBut.className = 'option';
  resDefBut.onclick = function () {
    LoadConfig(ConfigDefault);
  };
  resDefBut.textContent = 'Restore Default';
  resDef.appendChild(resDefBut);
  frag.appendChild(resDef);

  l('menu').childNodes[2].insertBefore(
    frag,
    l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1],
  );
}
