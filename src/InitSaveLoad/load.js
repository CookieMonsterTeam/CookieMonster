import { LoadConfig } from '../Config/SaveLoadReload/SaveLoadReloadSettings';
import { VersionMajor, VersionMinor } from '../Data/Moddata';
import InitData from '../Sim/InitializeData/InitData';

/**
 * This creates a load function to the CM object. Per Game code/comments:
 * "do stuff with the string data you saved previously"
 */
export default function load(str) {
  const save = JSON.parse(str);
  InitData();
  LoadConfig(save.settings);
  if (save.version !== `${VersionMajor}.${VersionMinor}`) {
    if (Game.prefs.popups)
      Game.Popup(
        'A new version of Cookie Monster has been loaded, check out the release notes in the info tab!',
      );
    else
      Game.Notify(
        'A new version of Cookie Monster has been loaded, check out the release notes in the info tab!',
        '',
        '',
        0,
        1,
      );
  }
}
