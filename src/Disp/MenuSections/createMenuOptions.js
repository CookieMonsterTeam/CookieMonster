import { menuFunctions as mF } from '@cookiemonsterteam/cookiemonsterframework';
import { ConfigGroups, ConfigGroupsNotification } from '../../Data/Sectionheaders.ts';
import settings from '../../Data/settings';
import UpdateColours from '../HelperFunctions/UpdateColours';
import RefreshScale from '../HelperFunctions/RefreshScale';

/**
 * Creates the <div> to be added to the Options section
 * @returns {object} menuDiv	Object of the <div> of Cookie Monster in options tab
 */
export default function createMenuOptions() {
  const menuDiv = mF.createModMenuSection('cookieMonsterMod', 'Cookie Monster', 'optionsMenu');

  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.optionsMenu) {
    Object.keys(ConfigGroups).forEach((group) => {
      if (group === 'Favourite') {
        if (
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.favouriteSettings.length !==
            0 &&
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FavouriteSettings > 0
        ) {
          menuDiv.appendChild(
            mF.listings.createOptionsSubHeader('cookieMonsterMod', group, ConfigGroups[group]),
          );
          if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[group])
            for (
              let index = 0;
              index <
              Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.favouriteSettings.length;
              index++
            ) {
              menuDiv.appendChild(
                mF.listings.createOptionsListing(
                  'cookieMonsterMod',
                  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.favouriteSettings[
                    index
                  ],
                  settings,
                  UpdateColours,
                  RefreshScale,
                ),
              );
            }
        }
      } else {
        menuDiv.appendChild(
          mF.listings.createOptionsSubHeader('cookieMonsterMod', group, ConfigGroups[group]),
        );
        if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[group]) {
          // 0 is show, 1 is collapsed
          // Make sub-sections of Notification section
          if (group === 'Notification') {
            Object.keys(ConfigGroupsNotification).forEach((subGroup) => {
              const subGroupObject = mF.listings.createOptionsSubHeader(
                'cookieMonsterMod',
                subGroup,
                ConfigGroupsNotification[subGroup],
              );
              subGroupObject.style.fontSize = '15px';
              subGroupObject.style.opacity = '0.5';
              menuDiv.appendChild(subGroupObject);
              if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[subGroup]) {
                Object.keys(settings).forEach((option) => {
                  if (settings[option].group === subGroup)
                    menuDiv.appendChild(
                      mF.listings.createOptionsListing(
                        'cookieMonsterMod',
                        option,
                        settings,
                        UpdateColours,
                        RefreshScale,
                      ),
                    );
                });
              }
            });
          } else {
            Object.keys(settings).forEach((option) => {
              if (settings[option].group === group)
                menuDiv.appendChild(
                  mF.listings.createOptionsListing(
                    'cookieMonsterMod',
                    option,
                    settings,
                    UpdateColours,
                    RefreshScale,
                  ),
                );
            });
          }
        }
      }
    });
  }
  return menuDiv;
}
