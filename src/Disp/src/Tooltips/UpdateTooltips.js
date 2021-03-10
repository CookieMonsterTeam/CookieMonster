import * as BeautifyFuncs from '../BeautifyFormatting';
import * as Create from './CreateTooltip';

/** Functions that update specific types of tooltips  */

/**
 * This function adds extra info to the Building tooltips
 */
export function Building() {
	if (CM.Options.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
		const tooltipBox = l('CMTooltipBorder');
		Create.TooltipCreateCalculationSection(tooltipBox);

		let target = `Objects${Game.buyBulk}`;
		if (Game.buyMode === 1) {
			CM.Disp.LastTargetTooltipBuilding = target;
		} else {
			target = CM.Disp.LastTargetTooltipBuilding;
		}

		CM.Disp.TooltipPrice = Game.Objects[CM.Disp.tooltipName].bulkPrice;
		CM.Disp.TooltipBonusIncome = CM.Cache[target][CM.Disp.tooltipName].bonus;

		if (CM.Options.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
			l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
			const increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
			if (Number.isFinite(increase) && increase !== 0) {
				l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
			}
			l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			l('CMTooltipPP').textContent = Beautify(CM.Cache[target][CM.Disp.tooltipName].pp, 2);
			l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			const timeColor = BeautifyFuncs.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			l('CMTooltipTime').textContent = timeColor.text;
			if (timeColor.text === 'Done!' && Game.cookies < CM.Cache[target][CM.Disp.tooltipName].price) {
				l('CMTooltipTime').textContent = `${timeColor.text} (with Wrink)`;
			} else l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
		}

		// Add "production left till next achievement"-bar
		l('CMTooltipProductionHeader').style.display = 'none';
		l('CMTooltipTime').style.marginBottom = '0px';
		for (const i of Object.keys(Game.Objects[CM.Disp.tooltipName].productionAchievs)) {
			if (!Game.HasAchiev(Game.Objects[CM.Disp.tooltipName].productionAchievs[i].achiev.name)) {
				const nextProductionAchiev = Game.Objects[CM.Disp.tooltipName].productionAchievs[i];
				l('CMTooltipTime').style.marginBottom = '4px';
				l('CMTooltipProductionHeader').style.display = '';
				l('CMTooltipProduction').className = `ProdAchievement${CM.Disp.tooltipName}`;
				l('CMTooltipProduction').textContent = Beautify(nextProductionAchiev.pow - CM.Sim.Objects[CM.Disp.tooltipName].totalCookies, 15);
				l('CMTooltipProduction').style.color = 'white';
				break;
			}
		}
	} else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Upgrade tooltips
 */
export function Upgrade() {
	const tooltipBox = l('CMTooltipBorder');
	Create.TooltipCreateCalculationSection(tooltipBox);

	CM.Disp.TooltipBonusIncome = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
	CM.Disp.TooltipPrice = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();
	CM.Disp.TooltipBonusMouse = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonusMouse;

	if (CM.Options.TooltipBuildUpgrade === 1) {
		l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
		const increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
		// Don't display certain parts of tooltip if not applicable
		if (l('CMTooltipIncome').textContent === '0' && (CM.Disp.tooltipType === 'b' || CM.Disp.tooltipType === 'u')) {
			l('Bonus IncomeTitle').style.display = 'none';
			l('CMTooltipIncome').style.display = 'none';
			l('Payback PeriodTitle').style.display = 'none';
			l('CMTooltipPP').style.display = 'none';
		} else {
			if (Number.isFinite(increase) && increase !== 0) {
				l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
			}
			l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
			// If clicking power upgrade
			if (CM.Disp.TooltipBonusMouse) {
				l('CMTooltipCookiePerClick').textContent = Beautify(CM.Disp.TooltipBonusMouse);
				l('CMTooltipCookiePerClick').style.display = 'block';
				l('CMTooltipCookiePerClick').previousSibling.style.display = 'block';
			}
			// If only a clicking power upgrade change PP to click-based period
			if (CM.Disp.TooltipBonusIncome === 0 && CM.Disp.TooltipBonusMouse) {
				l('CMTooltipPP').textContent = `${Beautify(CM.Disp.TooltipPrice / CM.Disp.TooltipBonusMouse)} Clicks`;
				l('CMTooltipPP').style.color = 'white';
			} else {
				l('CMTooltipPP').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].pp, 2);
				l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
			}
		}
		const timeColor = BeautifyFuncs.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
		l('CMTooltipTime').textContent = timeColor.text;
		if (timeColor.text === 'Done!' && Game.cookies < Game.UpgradesInStore[CM.Disp.tooltipName].getPrice()) {
			l('CMTooltipTime').textContent = `${timeColor.text} (with Wrink)`;
		} else l('CMTooltipTime').textContent = timeColor.text;
		l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;

		// Add extra info to Chocolate egg tooltip
		if (Game.UpgradesInStore[CM.Disp.tooltipName].name === 'Chocolate egg') {
			l('CMTooltipBorder').lastChild.style.marginBottom = '4px';
			l('CMTooltipBorder').appendChild(Create.TooltipCreateHeader('Cookies to be gained (Currently/Max)'));
			const chocolate = document.createElement('div');
			chocolate.style.color = 'white';
			chocolate.textContent = `${BeautifyFuncs.Beautify(Game.cookies * 0.05)} / ${BeautifyFuncs.Beautify(CM.Cache.lastChoEgg)}`;
			l('CMTooltipBorder').appendChild(chocolate);
		}
	} else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Sugar Lump tooltip
 * It adds to the additional information to l('CMTooltipArea')
 */
export function SugarLump() {
	if (CM.Options.TooltipLump === 1) {
		const tooltipBox = l('CMTooltipBorder');

		tooltipBox.appendChild(Create.TooltipCreateHeader('Current Sugar Lump'));

		const lumpType = document.createElement('div');
		lumpType.id = 'CMTooltipTime';
		tooltipBox.appendChild(lumpType);
		const lumpColor = CM.Disp.GetLumpColor(Game.lumpCurrentType);
		lumpType.textContent = lumpColor.text;
		lumpType.className = CM.Disp.colorTextPre + lumpColor.color;
	} else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Grimoire tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
export function Grimoire() {
	const minigame = Game.Objects['Wizard tower'].minigame;
	const spellCost = minigame.getSpellCost(minigame.spellsById[CM.Disp.tooltipName]);

	if (CM.Options.TooltipGrim === 1 && spellCost <= minigame.magicM) {
		const tooltipBox = l('CMTooltipBorder');

		// Time left till enough magic for spell
		tooltipBox.appendChild(Create.TooltipCreateHeader('Time Left'));
		const time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltipBox.appendChild(time);
		const timeColor = BeautifyFuncs.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost));
		time.textContent = timeColor.text;
		time.className = CM.Disp.colorTextPre + timeColor.color;

		// Time left untill magic spent is recovered
		if (spellCost <= minigame.magic) {
			tooltipBox.appendChild(Create.TooltipCreateHeader('Recover Time'));
			const recover = document.createElement('div');
			recover.id = 'CMTooltipRecover';
			tooltipBox.appendChild(recover);
			const recoverColor = BeautifyFuncs.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(Math.max(0, minigame.magic - spellCost), minigame.magicM, minigame.magic));
			recover.textContent = recoverColor.text;
			recover.className = CM.Disp.colorTextPre + recoverColor.color;
		}

		// Extra information on cookies gained when spell is Conjure Baked Goods (Name === 0)
		if (CM.Disp.tooltipName === '0') {
			tooltipBox.appendChild(Create.TooltipCreateHeader('Cookies to be gained/lost'));
			const conjure = document.createElement('div');
			conjure.id = 'x';
			tooltipBox.appendChild(conjure);
			const reward = document.createElement('span');
			reward.style.color = '#33FF00';
			reward.textContent = Beautify(Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30), 2);
			conjure.appendChild(reward);
			const seperator = document.createElement('span');
			seperator.textContent = ' / ';
			conjure.appendChild(seperator);
			const loss = document.createElement('span');
			loss.style.color = 'red';
			loss.textContent = Beautify((CM.Cache.NoGoldSwitchCookiesPS * 60 * 15), 2);
			conjure.appendChild(loss);
		}

		l('CMTooltipArea').appendChild(tooltipBox);
	} else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Garden plots tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
export function GardenPlots() {
	const minigame = Game.Objects.Farm.minigame;
	if (CM.Options.TooltipPlots && minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][0] !== 0) {
		const mature = minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][1] > minigame.plantsById[minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][0] - 1].matureBase;
		const plantName = minigame.plantsById[minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][0] - 1].name;
		l('CMTooltipBorder').appendChild(Create.TooltipCreateHeader('Reward (Current / Maximum)'));
		const reward = document.createElement('div');
		reward.id = 'CMTooltipPlantReward';
		l('CMTooltipBorder').appendChild(reward);
		if (plantName === 'Bakeberry') {
			l('CMTooltipPlantReward').textContent = `${mature ? BeautifyFuncs.Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30)) : '0'} / ${BeautifyFuncs.Beautify(Game.cookiesPs * 60 * 30)}`;
		} else if (plantName === 'Chocoroot' || plantName === 'White chocoroot') {
			l('CMTooltipPlantReward').textContent = `${mature ? BeautifyFuncs.Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3)) : '0'} / ${BeautifyFuncs.Beautify(Game.cookiesPs * 60 * 3)}`;
		} else if (plantName === 'Queenbeet') {
			l('CMTooltipPlantReward').textContent = `${mature ? BeautifyFuncs.Beautify(Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60)) : '0'} / ${BeautifyFuncs.Beautify(Game.cookiesPs * 60 * 60)}`;
		} else if (plantName === 'Duketater') {
			l('CMTooltipPlantReward').textContent = `${mature ? BeautifyFuncs.Beautify(Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120)) : '0'} / ${BeautifyFuncs.Beautify(Game.cookiesPs * 60 * 120)}`;
		} else l('CMTooltipArea').style.display = 'none';
	} else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Garden Harvest All tooltip
 * It is called when the Harvest All tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
export function HarvestAll() {
	const minigame = Game.Objects.Farm.minigame;
	if (CM.Options.TooltipLump) {
		l('CMTooltipBorder').appendChild(Create.TooltipCreateHeader('Cookies gained from harvesting:'));
		let totalGain = 0;
		let mortal = 0;
		if (Game.keys[16] && Game.keys[17]) mortal = 1;
		for (let y = 0; y < 6; y++) {
			for (let x = 0; x < 6; x++) {
				if (minigame.plot[y][x][0] >= 1) {
					const tile = minigame.plot[y][x];
					const me = minigame.plantsById[tile[0] - 1];
					const plantName = me.name;

					let count = true;
					if (mortal && me.immortal) count = false;
					if (tile[1] < me.matureBase) count = false;
					if (count && plantName === 'Bakeberry') {
						totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30);
					} else if (count && plantName === 'Chocoroot' || plantName === 'White chocoroot') {
						totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3);
					} else if (count && plantName === 'Queenbeet') {
						totalGain += Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60);
					} else if (count && plantName === 'Duketater') {
						totalGain += Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120);
					}
				}
			}
		}
		l('CMTooltipBorder').appendChild(document.createTextNode(BeautifyFuncs.Beautify(totalGain)));
	} else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function updates the warnings section of the building and upgrade tooltips
 * It is called by CM.Disp.UpdateTooltip()
 */
export function Warnings() {
	if (CM.Disp.tooltipType === 'b' || CM.Disp.tooltipType === 'u') {
		if (document.getElementById('CMDispTooltipWarningParent') === null) {
			l('tooltipAnchor').appendChild(Create.TooltipCreateWarningSection());
			CM.Disp.ToggleToolWarnPos();
		}

		if (CM.Options.ToolWarnPos === 0) l('CMDispTooltipWarningParent').style.right = '0px';
		else l('CMDispTooltipWarningParent').style.top = `${l('tooltip').offsetHeight}px`;

		l('CMDispTooltipWarningParent').style.width = `${l('tooltip').offsetWidth - 6}px`;

		const amount = (Game.cookies + CM.Disp.GetWrinkConfigBank()) - CM.Disp.TooltipPrice;
		const bonusIncomeUsed = CM.Options.ToolWarnBon ? CM.Disp.TooltipBonusIncome : 0;
		let limitLucky = CM.Cache.Lucky;
		if (CM.Options.ToolWarnBon === 1) {
			let bonusNoFren = CM.Disp.TooltipBonusIncome;
			bonusNoFren /= CM.Cache.getCPSBuffMult();
			limitLucky += ((bonusNoFren * 60 * 15) / 0.15);
		}

		if (CM.Options.ToolWarnLucky === 1) {
			if (amount < limitLucky && (CM.Disp.tooltipType !== 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnLucky').style.display = '';
				l('CMDispTooltipWarnLuckyText').textContent = `${Beautify(limitLucky - amount)} (${BeautifyFuncs.FormatTime((limitLucky - amount) / (CM.Disp.GetCPS() + bonusIncomeUsed))})`;
			} else l('CMDispTooltipWarnLucky').style.display = 'none';
		} else l('CMDispTooltipWarnLucky').style.display = 'none';

		if (CM.Options.ToolWarnLuckyFrenzy === 1) {
			const limitLuckyFrenzy = limitLucky * 7;
			if (amount < limitLuckyFrenzy && (CM.Disp.tooltipType !== 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
				l('CMDispTooltipWarnLuckyFrenzyText').textContent = `${Beautify(limitLuckyFrenzy - amount)} (${BeautifyFuncs.FormatTime((limitLuckyFrenzy - amount) / (CM.Disp.GetCPS() + bonusIncomeUsed))})`;
			} else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
		} else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';

		if (CM.Options.ToolWarnConjure === 1) {
			const limitConjure = limitLucky * 2;
			if ((amount < limitConjure) && (CM.Disp.tooltipType !== 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnConjure').style.display = '';
				l('CMDispTooltipWarnConjureText').textContent = `${Beautify(limitConjure - amount)} (${BeautifyFuncs.FormatTime((limitConjure - amount) / (CM.Disp.GetCPS() + bonusIncomeUsed))})`;
			} else l('CMDispTooltipWarnConjure').style.display = 'none';
		} else l('CMDispTooltipWarnConjure').style.display = 'none';

		if (CM.Options.ToolWarnConjureFrenzy === 1) {
			const limitConjureFrenzy = limitLucky * 2 * 7;
			if ((amount < limitConjureFrenzy) && (CM.Disp.tooltipType !== 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnConjureFrenzy').style.display = '';
				l('CMDispTooltipWarnConjureFrenzyText').textContent = `${Beautify(limitConjureFrenzy - amount)} (${BeautifyFuncs.FormatTime((limitConjureFrenzy - amount) / (CM.Disp.GetCPS() + bonusIncomeUsed))})`;
			} else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';
		} else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';

		if (CM.Options.ToolWarnEdifice === 1 && Game.Objects['Wizard tower'].minigameLoaded) {
			if (CM.Cache.Edifice && amount < CM.Cache.Edifice && (CM.Disp.tooltipType !== 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnEdifice').style.display = '';
				l('CMDispTooltipWarnEdificeText').textContent = `${Beautify(CM.Cache.Edifice - amount)} (${BeautifyFuncs.FormatTime((CM.Cache.Edifice - amount) / (CM.Disp.GetCPS() + bonusIncomeUsed))})`;
			} else l('CMDispTooltipWarnEdifice').style.display = 'none';
		} else l('CMDispTooltipWarnEdifice').style.display = 'none';

		if (CM.Options.ToolWarnUser > 0) {
			if (amount < CM.Options.ToolWarnUser * CM.Disp.GetCPS() && (CM.Disp.tooltipType !== 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnUser').style.display = '';
				// Need to update tooltip text dynamically
				l('CMDispTooltipWarnUser').children[0].textContent = `Purchase of this item will put you under the number of Cookies equal to ${CM.Options.ToolWarnUser} seconds of CPS`;
				l('CMDispTooltipWarnUserText').textContent = `${Beautify(CM.Options.ToolWarnUser * CM.Disp.GetCPS() - amount)} (${BeautifyFuncs.FormatTime((CM.Options.ToolWarnUser * CM.Disp.GetCPS() - amount) / (CM.Disp.GetCPS() + bonusIncomeUsed))})`;
			} else l('CMDispTooltipWarnUser').style.display = 'none';
		} else l('CMDispTooltipWarnUser').style.display = 'none';
	} else if (l('CMDispTooltipWarningParent') !== null) {
		l('CMDispTooltipWarningParent').remove();
	}
}
