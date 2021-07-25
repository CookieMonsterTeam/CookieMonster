/**
 * This function toggle the locked state of a building
 * @param	{number}	index	Index of the row to change
 */
export default function toggleBuildingLock(index) {
  if (l(`productLock${index}`).innerHTML === 'Lock') {
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames.push(
      index.toString(),
    );
    l(`row${index}`).style.pointerEvents = 'none';
    l(`row${index}`).style.opacity = '0.4';
    l(`productLock${index}`).innerHTML = 'Unlock';
    l(`productLock${index}`).style.pointerEvents = 'auto';
  } else {
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames =
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames.filter(
        (value) => value !== index.toString(),
      );
    l(`productLock${index}`).innerHTML = 'Lock';
    l(`row${index}`).style.pointerEvents = 'auto';
    l(`row${index}`).style.opacity = '1';
  }
}
