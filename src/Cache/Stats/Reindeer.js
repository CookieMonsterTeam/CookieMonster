/**
 * This functions caches the reward of popping a reindeer
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{number}	CM.Cache.SeaSpec	The reward for popping a reindeer
 */
 CM.Cache.CacheSeaSpec = function () {
	if (Game.season === 'christmas') {
		let val = Game.cookiesPs * 60;
		if (Game.hasBuff('Elder frenzy')) val *= 0.5;
		if (Game.hasBuff('Frenzy')) val *= 0.75;
		CM.Cache.SeaSpec = Math.max(25, val);
		if (Game.Has('Ho ho ho-flavored frosting')) CM.Cache.SeaSpec *= 2;
	}
};

