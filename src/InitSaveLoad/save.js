import { CMOptions } from '../Config/VariablesAndData';
import { VersionMajor, VersionMinor } from '../Data/Moddata.ts';
import { FavouriteSettings } from '../Disp/VariablesAndData';

/**
 * This creates a save function to the CM object. Per Game code/comments:
 * "use this to store persistent data associated with your mod
 * return 'a string to be saved';"
 */
export default function save() {
  return JSON.stringify({
    favouriteSettings: FavouriteSettings,
    settings: CMOptions,
    version: `${VersionMajor}.${VersionMinor}`,
  });
}
