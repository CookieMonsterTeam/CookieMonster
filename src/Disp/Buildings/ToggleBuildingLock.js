/**
 * This function toggle the locked state of a building
 * @param	{number}	index	Index of the row to change
 */
export default function ToggleBuildingLock(index) {
  if (l(`productLock${index}`).innerHTML === 'Unlocked') {
    l(`productLock${index}`).innerHTML = 'Locked';
    l(`row${index}`).children[3].style.pointerEvents = 'none';
  } else {
    l(`productLock${index}`).innerHTML = 'Unlocked';
    l(`row${index}`).children[3].style.pointerEvents = 'auto';
  }
}
