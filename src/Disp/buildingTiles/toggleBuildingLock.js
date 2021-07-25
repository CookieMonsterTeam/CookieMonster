/**
 * This function toggle the locked state of a building
 * @param	{number}	index	Index of the row to change
 */
export default function toggleBuildingLock(index) {
  if (l(`productLock${index}`).innerHTML === 'Lock') {
    // Add to storing array
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames.push(
      index.toString(),
    );

    // Update styles
    l(`row${index}`).style.pointerEvents = 'none';
    l(`row${index}`).style.opacity = '0.4';
    l(`productLock${index}`).innerHTML = 'Unlock';
    l(`productLock${index}`).style.pointerEvents = 'auto';
  } else {
    // Remove from storing array
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames.includes(
        index.toString(),
      )
    ) {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames =
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.lockedMinigames.filter(
          (value) => value !== index.toString(),
        );
    }

    // Update styles
    l(`productLock${index}`).innerHTML = 'Lock';
    l(`row${index}`).style.pointerEvents = 'auto';
    l(`row${index}`).style.opacity = '1';
  }
}
