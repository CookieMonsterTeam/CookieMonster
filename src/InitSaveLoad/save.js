import { VersionMajor, VersionMinor } from '../Data/Moddata.ts';

/**
 * This creates a save function to the CM object. Per Game code/comments:
 * "use this to store persistent data associated with your mod
 * return 'a string to be saved';"
 */
export default function save() {
  const saveObject = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod;
  saveObject.version = `${VersionMajor}.${VersionMinor}`;
  return JSON.stringify(saveObject);
}
