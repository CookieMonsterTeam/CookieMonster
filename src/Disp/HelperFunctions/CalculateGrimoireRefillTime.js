/**
 * This function calculates the time it takes to reach a certain magic level
 * @param	{number}	currentMagic		The current magic level
 * @param	{number}	maxMagic			The user's max magic level
 * @param	{number}	targetMagic			The target magic level
 * @returns	{number}	count / Game.fps	The time it takes to reach targetMagic
 */
export default function CalculateGrimoireRefillTime(currentMagic, maxMagic, targetMagic) {
	let count = 0;
	while (currentMagic < targetMagic) {
		currentMagic += Math.max(0.002, (currentMagic / Math.max(maxMagic, 100)) ** 0.5) * 0.002;
		count++;
	}
	return count / Game.fps;
}
