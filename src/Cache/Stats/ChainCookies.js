
/**
 * This functions calculates the max possible payout given a set of variables
 * It is called by CM.Disp.CreateStatsChainSection() and CM.Cache.CacheChain()
 * @param	{number}					digit		Number of Golden Cookies in chain
 * @param	{number}					maxPayout	Maximum payout
 * @param	{number}					mult		Multiplier
 * @returns	[{number, number, number}]				Total cookies earned, cookie needed for this and next level
 */
 CM.Cache.MaxChainCookieReward = function (digit, maxPayout, mult) {
	let totalFromChain = 0;
	let moni = 0;
	let nextMoni = 0;
	let nextRequired = 0;
	let chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	while (nextMoni < maxPayout) {
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * 10 ** chain * digit * mult), maxPayout * mult));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * 10 ** (chain + 1) * digit * mult), maxPayout * mult));
		nextRequired = Math.floor(1 / 9 * 10 ** (chain + 1) * digit * mult);
		totalFromChain += moni;
		chain++;
	}
	return [totalFromChain, moni, nextRequired];
};

/**
 * This functions caches data related to Chain Cookies reward from Golden Cookioes
 * It is called by CM.Main.Loop() upon changes to cps and CM.Cache.InitCache()
 * @global	[{number, number}]	CM.Cache.ChainMaxReward			Total cookies earned, and cookies needed for next level for normal chain
 * @global	{number}			CM.Cache.ChainRequired			Cookies needed for maximum reward for normal chain
 * @global	{number}			CM.Cache.ChainRequiredNext		Total cookies needed for next level for normal chain
 * @global	[{number, number}]	CM.Cache.ChainMaxWrathReward			Total cookies earned, and cookies needed for next level for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequired			Cookies needed for maximum reward for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequiredNext		Total cookies needed for next level for wrath chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyMaxReward			Total cookies earned, and cookies needed for next level for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequired			Cookies needed for maximum reward for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequiredNext		Total cookies needed for next level for normal frenzy chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyWrathMaxReward			Total cookies earned, and cookies needed for next level for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequired			Cookies needed for maximum reward for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequiredNext		Total cookies needed for next level for wrath frenzy chain
 */
CM.Cache.CacheChain = function () {
	let maxPayout = CM.Cache.NoGoldSwitchCookiesPS * 60 * 60 * 6 * CM.Cache.DragonsFortuneMultAdjustment;
	// Removes effect of Frenzy etc.
	const cpsBuffMult = CM.Cache.getCPSBuffMult();
	if (cpsBuffMult > 0) maxPayout /= cpsBuffMult;
	else maxPayout = 0;

	CM.Cache.ChainMaxReward = CM.Cache.MaxChainCookieReward(7, maxPayout, CM.Cache.GoldenCookiesMult);
	CM.Cache.ChainRequired = CM.Cache.ChainMaxReward[1] * 2 / CM.Cache.GoldenCookiesMult;
	CM.Cache.ChainRequiredNext = CM.Cache.ChainMaxReward[2] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;

	CM.Cache.ChainMaxWrathReward = CM.Cache.MaxChainCookieReward(6, maxPayout, CM.Cache.WrathCookiesMult);
	CM.Cache.ChainWrathRequired = CM.Cache.ChainMaxWrathReward[1] * 2 / CM.Cache.WrathCookiesMult;
	CM.Cache.ChainWrathRequiredNext = CM.Cache.ChainMaxWrathReward[2] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;

	CM.Cache.ChainFrenzyMaxReward = CM.Cache.MaxChainCookieReward(7, maxPayout * 7, CM.Cache.GoldenCookiesMult);
	CM.Cache.ChainFrenzyRequired = CM.Cache.ChainFrenzyMaxReward[1] * 2 / CM.Cache.GoldenCookiesMult;
	CM.Cache.ChainFrenzyRequiredNext = CM.Cache.ChainFrenzyMaxReward[2] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;

	CM.Cache.ChainFrenzyMaxWrathReward = CM.Cache.MaxChainCookieReward(6, maxPayout * 7, CM.Cache.WrathCookiesMult);
	CM.Cache.ChainFrenzyWrathRequired = CM.Cache.ChainFrenzyMaxWrathReward[1] * 2 / CM.Cache.WrathCookiesMult;
	CM.Cache.ChainFrenzyWrathRequiredNext = CM.Cache.ChainFrenzyMaxWrathReward[2] / 60 / 60 / 6 / CM.Cache.DragonsFortuneMultAdjustment;
};
