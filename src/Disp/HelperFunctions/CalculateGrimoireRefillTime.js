/**
 * This function calculates the time it takes to reach a certain magic level
 * @param	{number}	currentMagic		The current magic level
 * @param	{number}	maxMagic			The user's max magic level
 * @param	{number}	targetMagic			The target magic level
 * @returns	{number}	count / Game.fps	The time it takes to reach targetMagic
 */
export default function CalculateGrimoireRefillTime(currentMagic, maxMagic, targetMagic) {
  let magic = currentMagic;
  let count = 0;
  while (magic < targetMagic) {
    magic += Math.max(0.002, (magic / Math.max(maxMagic, 100)) ** 0.5) * 0.002;
    count += 1;
  }
  return count / Game.fps;
}
