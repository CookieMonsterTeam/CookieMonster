
/**
 * This functions caches the heavenly chips per second in the last five seconds
 * It is called by CM.Cache.LoopCache()
 * @global	{number}	CM.Cache.HCPerSecond	The Heavenly Chips per second in the last five seconds
 */
 CM.Cache.CacheHeavenlyChipsPS = function () {
	const currDate = Math.floor(Date.now() / 1000);
	// Only calculate every new second
	if ((Game.T / Game.fps) % 1 === 0) {
		const chipsOwned = Game.HowMuchPrestige(Game.cookiesReset);
		const ascendNowToOwn = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
		const ascendNowToGet = ascendNowToOwn - Math.floor(chipsOwned);

		// Add recent gains to AvgQueue's
		const timeDiff = currDate - CM.Cache.lastHeavenlyCheck;
		const heavenlyChipsDiffAvg = Math.max(0, (ascendNowToGet - CM.Cache.lastHeavenlyChips)) / timeDiff;
		for (let i = 0; i < timeDiff; i++) {
			CM.Cache.HeavenlyChipsDiff.addLatest(heavenlyChipsDiffAvg);
		}

		// Store current data for next loop
		CM.Cache.lastHeavenlyCheck = currDate;
		CM.Cache.lastHeavenlyChips = ascendNowToGet;

		// Get average gain over period of 5 seconds
		CM.Cache.HCPerSecond = CM.Cache.HeavenlyChipsDiff.calcAverage(5);
	}
};