import { CMOptions } from '../Config/VariablesAndData';
import { VersionMajor, VersionMinor } from '../Data/Moddata';

/**
 * This creates a save function to the CM object. Per Game code/comments:
 * "use this to store persistent data associated with your mod
 * return 'a string to be saved';"
 */
export default function save() {
  return JSON.stringify({
    settings: CMOptions,
    version: `${VersionMajor}.${VersionMinor}`,
  });
}
