/** Functions to create the individual sections of the Statistics page */

/**
 * This function creates the "Lucky" section of the stats page
 * @returns	{object}	section		The object contating the Lucky section
 */
export function LuckySection() {
	// This sets which tooltip to display for certain stats
	const goldCookTooltip = Game.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';

	const section = document.createElement('div');
	section.className = 'CMStatsLuckySection';

	const luckyColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const luckyTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.FormatTime((CM.Cache.Lucky - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	const luckyReqFrag = document.createDocumentFragment();
	const luckyReqSpan = document.createElement('span');
	luckyReqSpan.style.fontWeight = 'bold';
	luckyReqSpan.className = CM.Disp.colorTextPre + luckyColor;
	luckyReqSpan.textContent = Beautify(CM.Cache.Lucky);
	luckyReqFrag.appendChild(luckyReqSpan);
	if (luckyTime !== '') {
		const luckyReqSmall = document.createElement('small');
		luckyReqSmall.textContent = ` (${luckyTime})`;
		luckyReqFrag.appendChild(luckyReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Lucky!" Cookies Required', luckyReqFrag, goldCookTooltip));

	const luckyColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const luckyTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.FormatTime((CM.Cache.LuckyFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	const luckyReqFrenFrag = document.createDocumentFragment();
	const luckyReqFrenSpan = document.createElement('span');
	luckyReqFrenSpan.style.fontWeight = 'bold';
	luckyReqFrenSpan.className = CM.Disp.colorTextPre + luckyColorFrenzy;
	luckyReqFrenSpan.textContent = Beautify(CM.Cache.LuckyFrenzy);
	luckyReqFrenFrag.appendChild(luckyReqFrenSpan);
	if (luckyTimeFrenzy !== '') {
		const luckyReqFrenSmall = document.createElement('small');
		luckyReqFrenSmall.textContent = ` (${luckyTimeFrenzy})`;
		luckyReqFrenFrag.appendChild(luckyReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Lucky!" Cookies Required (Frenzy)', luckyReqFrenFrag, goldCookTooltip));

	const luckySplit = CM.Cache.LuckyReward !== CM.Cache.LuckyWrathReward;

	const luckyRewardMaxSpan = document.createElement('span');
	luckyRewardMaxSpan.style.fontWeight = 'bold';
	luckyRewardMaxSpan.className = CM.Disp.colorTextPre + CM.Cache.LuckyReward;
	luckyRewardMaxSpan.textContent = Beautify(CM.Cache.LuckyReward) + (luckySplit ? (` / ${Beautify(CM.Cache.LuckyWrathReward)}`) : '');
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', `"Lucky!" Reward (MAX)${luckySplit ? ' (Golden / Wrath)' : ''}`, luckyRewardMaxSpan, goldCookTooltip));

	const luckyRewardFrenzyMaxSpan = document.createElement('span');
	luckyRewardFrenzyMaxSpan.style.fontWeight = 'bold';
	luckyRewardFrenzyMaxSpan.className = CM.Disp.colorTextPre + luckyRewardFrenzyMaxSpan;
	luckyRewardFrenzyMaxSpan.textContent = Beautify(CM.Cache.LuckyRewardFrenzy) + (luckySplit ? (` / ${Beautify(CM.Cache.LuckyWrathRewardFrenzy)}`) : '');
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', `"Lucky!" Reward (MAX) (Frenzy)${luckySplit ? ' (Golden / Wrath)' : ''}`, luckyRewardFrenzyMaxSpan, goldCookTooltip));

	const luckyCurBase = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * CM.Cache.DragonsFortuneMultAdjustment * 60 * 15) + 13;
	const luckyCurSpan = document.createElement('span');
	luckyCurSpan.style.fontWeight = 'bold';
	luckyCurSpan.className = CM.Disp.colorTextPre + luckyCurSpan;
	luckyCurSpan.textContent = Beautify(CM.Cache.GoldenCookiesMult * luckyCurBase) + (luckySplit ? (` / ${Beautify(CM.Cache.WrathCookiesMult * luckyCurBase)}`) : '');
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', `"Lucky!" Reward (CUR)${luckySplit ? ' (Golden / Wrath)' : ''}`, luckyCurSpan, goldCookTooltip));
	return section;
}

/**
 * This function creates the "Chain" section of the stats page
 * @returns	{object}	section		The object contating the Chain section
 */
export function ChainSection() {
	// This sets which tooltip to display for certain stats
	const goldCookTooltip = Game.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';

	const section = document.createElement('div');
	section.className = 'CMStatsChainSection';

	const chainColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const chainTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainRequired) ? CM.Disp.FormatTime((CM.Cache.ChainRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	const chainReqFrag = document.createDocumentFragment();
	const chainReqSpan = document.createElement('span');
	chainReqSpan.style.fontWeight = 'bold';
	chainReqSpan.className = CM.Disp.colorTextPre + chainColor;
	chainReqSpan.textContent = Beautify(CM.Cache.ChainRequired);
	chainReqFrag.appendChild(chainReqSpan);
	if (chainTime !== '') {
		const chainReqSmall = document.createElement('small');
		chainReqSmall.textContent = ` (${chainTime})`;
		chainReqFrag.appendChild(chainReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Chain" Cookies Required', chainReqFrag, goldCookTooltip));

	const chainWrathColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrathRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const chainWrathTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrathRequired) ? CM.Disp.FormatTime((CM.Cache.ChainWrathRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	const chainWrathReqFrag = document.createDocumentFragment();
	const chainWrathReqSpan = document.createElement('span');
	chainWrathReqSpan.style.fontWeight = 'bold';
	chainWrathReqSpan.className = CM.Disp.colorTextPre + chainWrathColor;
	chainWrathReqSpan.textContent = Beautify(CM.Cache.ChainWrathRequired);
	chainWrathReqFrag.appendChild(chainWrathReqSpan);
	if (chainWrathTime !== '') {
		const chainWrathReqSmall = document.createElement('small');
		chainWrathReqSmall.textContent = ` (${chainWrathTime})`;
		chainWrathReqFrag.appendChild(chainWrathReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Chain" Cookies Required (Wrath)', chainWrathReqFrag, goldCookTooltip));

	const chainColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const chainTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyRequired) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	const chainReqFrenFrag = document.createDocumentFragment();
	const chainReqFrenSpan = document.createElement('span');
	chainReqFrenSpan.style.fontWeight = 'bold';
	chainReqFrenSpan.className = CM.Disp.colorTextPre + chainColorFrenzy;
	chainReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzyRequired);
	chainReqFrenFrag.appendChild(chainReqFrenSpan);
	if (chainTimeFrenzy !== '') {
		const chainReqFrenSmall = document.createElement('small');
		chainReqFrenSmall.textContent = ` (${chainTimeFrenzy})`;
		chainReqFrenFrag.appendChild(chainReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Chain" Cookies Required (Frenzy)', chainReqFrenFrag, goldCookTooltip));

	const chainWrathColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrathRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const chainWrathTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrathRequired) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyWrathRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	const chainWrathReqFrenFrag = document.createDocumentFragment();
	const chainWrathReqFrenSpan = document.createElement('span');
	chainWrathReqFrenSpan.style.fontWeight = 'bold';
	chainWrathReqFrenSpan.className = CM.Disp.colorTextPre + chainWrathColorFrenzy;
	chainWrathReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzyWrathRequired);
	chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSpan);
	if (chainWrathTimeFrenzy !== '') {
		const chainWrathReqFrenSmall = document.createElement('small');
		chainWrathReqFrenSmall.textContent = ` (${chainWrathTimeFrenzy})`;
		chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Chain" Cookies Required (Frenzy) (Wrath)', chainWrathReqFrenFrag, goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Chain" Reward (MAX) (Golden / Wrath)', document.createTextNode(`${Beautify(CM.Cache.ChainMaxReward[0])} / ${Beautify(CM.Cache.ChainMaxWrathReward[0])}`), goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Chain" Reward (MAX) (Frenzy) (Golden / Wrath)', document.createTextNode((`${Beautify(CM.Cache.ChainFrenzyMaxReward[0])} / ${Beautify(CM.Cache.ChainFrenzyMaxWrathReward[0])}`)), goldCookTooltip));

	const chainCurMax = Math.min(Game.cookiesPs * 60 * 60 * 6 * CM.Cache.DragonsFortuneMultAdjustment, Game.cookies * 0.5);
	const chainCur = CM.Cache.MaxChainCookieReward(7, chainCurMax, CM.Cache.GoldenCookiesMult)[0];
	const chainCurWrath = CM.Cache.MaxChainCookieReward(6, chainCurMax, CM.Cache.WrathCookiesMult)[0];
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Chain" Reward (CUR) (Golden / Wrath)', document.createTextNode((`${Beautify(chainCur)} / ${Beautify(chainCurWrath)}`)), goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', 'CPS Needed For Next Level (G / W)', document.createTextNode((`${Beautify(CM.Cache.ChainRequiredNext)} / ${Beautify(CM.Cache.ChainWrathRequiredNext)}`)), 'ChainNextLevelPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', 'CPS Needed For Next Level (Frenzy) (G / W)', document.createTextNode((`${Beautify(CM.Cache.ChainFrenzyRequiredNext)} / ${Beautify(CM.Cache.ChainFrenzyWrathRequiredNext)}`)), 'ChainNextLevelPlaceholder'));
	return section;
}

/**
 * This function creates the "Spells" section of the stats page
 * @returns	{object}	section		The object contating the Spells section
 */
export function SpellsSection() {
	const section = document.createElement('div');
	section.className = 'CMStatsSpellsSection';

	const conjureColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const conjureTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.FormatTime((CM.Cache.Conjure - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';

	const conjureReqFrag = document.createDocumentFragment();
	const conjureReqSpan = document.createElement('span');
	conjureReqSpan.style.fontWeight = 'bold';
	conjureReqSpan.className = CM.Disp.colorTextPre + conjureColor;
	conjureReqSpan.textContent = Beautify(CM.Cache.Conjure);
	conjureReqFrag.appendChild(conjureReqSpan);
	if (conjureTime !== '') {
		const conjureReqSmall = document.createElement('small');
		conjureReqSmall.textContent = ` (${conjureTime})`;
		conjureReqFrag.appendChild(conjureReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Conjure Baked Goods" Cookies Required', conjureReqFrag, 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Conjure Baked Goods" Reward (MAX)', document.createTextNode(CM.Disp.Beautify(CM.Cache.ConjureReward)), 'GoldCookTooltipPlaceholder'));

	const conjureFrenzyColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure * 7) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const conjureFrenzyCur = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30);
	const conjureFrenzyTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure * 7) ? CM.Disp.FormatTime((CM.Cache.Conjure * 7 - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';

	const conjureFrenzyReqFrag = document.createDocumentFragment();
	const conjureFrenzyReqSpan = document.createElement('span');
	conjureFrenzyReqSpan.style.fontWeight = 'bold';
	conjureFrenzyReqSpan.className = CM.Disp.colorTextPre + conjureFrenzyColor;
	conjureFrenzyReqSpan.textContent = Beautify(CM.Cache.Conjure * 7);
	conjureFrenzyReqFrag.appendChild(conjureFrenzyReqSpan);
	if (conjureFrenzyTime !== '') {
		const conjureFrenzyReqSmall = document.createElement('small');
		conjureFrenzyReqSmall.textContent = ` (${conjureFrenzyTime})`;
		conjureFrenzyReqFrag.appendChild(conjureFrenzyReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Conjure Baked Goods" Cookies Required (Frenzy)', conjureFrenzyReqFrag, 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Conjure Baked Goods" Reward (MAX) (Frenzy)', document.createTextNode(CM.Disp.Beautify(CM.Cache.ConjureReward * 7)), 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Conjure Baked Goods" Reward (CUR)', document.createTextNode(CM.Disp.Beautify(conjureFrenzyCur)), 'GoldCookTooltipPlaceholder'));
	if (CM.Cache.Edifice) {
		section.appendChild(CM.Disp.CreateStatsListing('withTooltip', '"Spontaneous Edifice" Cookies Required (most expensive building)', document.createTextNode(`${CM.Disp.Beautify(CM.Cache.Edifice)} (${CM.Cache.EdificeBuilding})`), 'GoldCookTooltipPlaceholder'));
	}
	return section;
}

/**
 * This function creates the "Garden" section of the stats page
 * @returns	{object}	section		The object contating the Spells section
 */
export function GardenSection() {
	const section = document.createElement('div');
	section.className = 'CMStatsGardenSection';

	const bakeberryColor = (Game.cookies < Game.cookiesPs * 60 * 30) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const bakeberryFrag = document.createElement('span');
	bakeberryFrag.style.fontWeight = 'bold';
	bakeberryFrag.className = CM.Disp.colorTextPre + bakeberryColor;
	bakeberryFrag.textContent = Beautify(Game.cookiesPs * 60 * 30);
	section.appendChild(CM.Disp.CreateStatsListing('basic', 'Cookies required for max reward of Bakeberry: ', bakeberryFrag));

	const chocorootColor = (Game.cookies < Game.cookiesPs * 60 * 3) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const chocorootFrag = document.createElement('span');
	chocorootFrag.style.fontWeight = 'bold';
	chocorootFrag.className = CM.Disp.colorTextPre + chocorootColor;
	chocorootFrag.textContent = Beautify(Game.cookiesPs * 60 * 3);
	section.appendChild(CM.Disp.CreateStatsListing('basic', 'Cookies required for max reward of Chocoroot: ', chocorootFrag));

	const queenbeetColor = (Game.cookies < Game.cookiesPs * 60 * 60) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const queenbeetFrag = document.createElement('span');
	queenbeetFrag.style.fontWeight = 'bold';
	queenbeetFrag.className = CM.Disp.colorTextPre + queenbeetColor;
	queenbeetFrag.textContent = Beautify(Game.cookiesPs * 60 * 60);
	section.appendChild(CM.Disp.CreateStatsListing('basic', 'Cookies required for max reward of Queenbeet: ', queenbeetFrag));

	const duketaterColor = (Game.cookies < Game.cookiesPs * 60 * 120) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	const duketaterFrag = document.createElement('span');
	duketaterFrag.style.fontWeight = 'bold';
	duketaterFrag.className = CM.Disp.colorTextPre + duketaterColor;
	duketaterFrag.textContent = Beautify(Game.cookiesPs * 60 * 120);
	section.appendChild(CM.Disp.CreateStatsListing('basic', 'Cookies required for max reward of Duketater: ', duketaterFrag));
	return section;
}

/**
 * This function creates the "Prestige" section of the stats page
 * @returns	{object}	section		The object contating the Prestige section
 */
export function PrestigeSection() {
	const section = document.createElement('div');
	section.className = 'CMStatsPrestigeSection';

	const possiblePresMax = Math.floor(Game.HowMuchPrestige(CM.Cache.RealCookiesEarned
		+ Game.cookiesReset + CM.Cache.WrinklersTotal
		+ (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0)));
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', 'Prestige Level (CUR / MAX)', document.createTextNode(`${Beautify(Game.prestige)} / ${Beautify(possiblePresMax)}`), 'PrestMaxTooltipPlaceholder'));

	const neededCook = Game.HowManyCookiesReset(possiblePresMax + 1) - (CM.Cache.RealCookiesEarned + Game.cookiesReset + CM.Cache.WrinklersTotal + ((Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0) ? CM.Cache.lastChoEgg : 0));
	const cookiesNextFrag = document.createDocumentFragment();
	cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
	const cookiesNextSmall = document.createElement('small');
	cookiesNextSmall.textContent = ` (${CM.Disp.FormatTime(neededCook / CM.Cache.AvgCPSWithChoEgg, 1)})`;
	cookiesNextFrag.appendChild(cookiesNextSmall);
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', 'Cookies To Next Level', cookiesNextFrag, 'NextPrestTooltipPlaceholder'));

	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', 'Heavenly Chips (CUR / MAX)', document.createTextNode(`${Beautify(Game.heavenlyChips)} / ${Beautify((possiblePresMax - Game.prestige) + Game.heavenlyChips)}`), 'HeavenChipMaxTooltipPlaceholder'));

	section.appendChild(CM.Disp.CreateStatsListing('basic', 'Heavenly Chips Per Second (last 5 seconds)', document.createTextNode(Beautify(CM.Cache.HCPerSecond, 2))));

	const HCTarget = Number(CM.Options.HeavenlyChipsTarget);
	if (!isNaN(HCTarget)) {
		const CookiesTillTarget = HCTarget - Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
		if (CookiesTillTarget > 0) {
			section.appendChild(CM.Disp.CreateStatsListing('basic', 'Heavenly Chips To Target Set In Settings (CUR)', document.createTextNode(Beautify(CookiesTillTarget))));
			section.appendChild(CM.Disp.CreateStatsListing('basic', 'Time To Target (CUR, Current 5 Second Average)', document.createTextNode(CM.Disp.FormatTime(CookiesTillTarget / CM.Cache.HCPerSecond))));
		}
	}

	const resetBonus = CM.Sim.ResetBonus(possiblePresMax);
	const resetFrag = document.createDocumentFragment();
	resetFrag.appendChild(document.createTextNode(Beautify(resetBonus)));
	const increase = Math.round(resetBonus / Game.cookiesPs * 10000);
	if (isFinite(increase) && increase !== 0) {
		const resetSmall = document.createElement('small');
		resetSmall.textContent = ` (${increase / 100}% of income)`;
		resetFrag.appendChild(resetSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing('withTooltip', 'Reset Bonus Income', resetFrag, 'ResetTooltipPlaceholder'));

	const currentPrestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset));
	const willHave = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
	const willGet = willHave - currentPrestige;
	if (!Game.Has('Lucky digit')) {
		let delta7 = 7 - (willHave % 10);
		if (delta7 < 0) delta7 += 10;
		const next7Reset = willGet + delta7;
		const next7Total = willHave + delta7;
		const frag7 = document.createDocumentFragment();
		frag7.appendChild(document.createTextNode(`${next7Total.toLocaleString()} / ${next7Reset.toLocaleString()} (+${delta7})`));
		section.appendChild(CM.Disp.CreateStatsListing('basic', 'Next "Lucky Digit" (total / reset)', frag7));
	}

	if (!Game.Has('Lucky number')) {
		let delta777 = 777 - (willHave % 1000);
		if (delta777 < 0) delta777 += 1000;
		const next777Reset = willGet + delta777;
		const next777Total = willHave + delta777;
		const frag777 = document.createDocumentFragment();
		frag777.appendChild(document.createTextNode(`${next777Total.toLocaleString()} / ${next777Reset.toLocaleString()} (+${delta777})`));
		section.appendChild(CM.Disp.CreateStatsListing('basic', 'Next "Lucky Number" (total / reset)', frag777));
	}

	if (!Game.Has('Lucky payout')) {
		let delta777777 = 777777 - (willHave % 1000000);
		if (delta777777 < 0) delta777777 += 1000000;
		const next777777Reset = willGet + delta777777;
		const next777777Total = willHave + delta777777;
		const frag777777 = document.createDocumentFragment();
		frag777777.appendChild(document.createTextNode(`${next777777Total.toLocaleString()} / ${next777777Reset.toLocaleString()} (+${delta777777})`));
		section.appendChild(CM.Disp.CreateStatsListing('basic', 'Next "Lucky Payout" (total / reset)', frag777777));
	}

	return section;
}
