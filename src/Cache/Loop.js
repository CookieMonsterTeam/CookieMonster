/**
 * This functions caches variables that are needed every loop
 * It is called by CM.Main.Loop()
 * @global	{string}	CM.Cache.TimeTillNextPrestige	Time requried till next prestige level
 */
 CM.Cache.LoopCache = function () {
	// Update Wrinkler Bank
	CM.Cache.CacheWrinklers();

	CM.Cache.CachePP();
	CM.Cache.CacheCurrWrinklerCPS();
	CM.Cache.CacheAvgCPS();
	CM.Cache.CacheHeavenlyChipsPS();

	const cookiesToNext = Game.HowManyCookiesReset(Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned)) + 1) - (Game.cookiesEarned + Game.cookiesReset);
	CM.Cache.TimeTillNextPrestige = CM.Disp.FormatTime(cookiesToNext / CM.Disp.GetCPS());
};
