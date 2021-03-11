import * as UpdateTooltip from './UpdateTooltips';
import { TooltipCreateTooltipBox } from './CreateTooltip';

/** All general functions related to creating and updating tooltips */

/**
 * This function creates some very basic tooltips, (e.g., the tooltips in the stats page)
 * The tooltips are created with CM.Disp[placeholder].appendChild(desc)
 * @param	{string}	placeholder	The name used to later refer and spawn the tooltip
 * @param	{string}	text		The text of the tooltip
 * @param	{string}	minWidth	The minimum width of the tooltip
 */
export function CreateSimpleTooltip(placeholder, text, minWidth) {
	const Tooltip = document.createElement('div');
	Tooltip.id = placeholder;
	const desc = document.createElement('div');
	desc.style.minWidth = minWidth;
	desc.style.marginBottom = '4px';
	const div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = text;
	desc.appendChild(div);
	Tooltip.appendChild(desc);
}

/**
 * This function enhance the standard tooltips by creating and changing l('tooltip')
 * The function is called by .onmouseover events that have replaced original code to use CM.Disp.Tooltip()
 * @param	{string}	type					Type of tooltip (b, u, s or g)
 * @param	{string}	name					Name of the object/item the tooltip relates to
 * @returns {string}	l('tooltip').innerHTML	The HTML of the l('tooltip')-object
 */
export function CreateTooltip(type, name) {
	if (type === 'b') { // Buildings
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		// Adds amortization info to the list of info per building
		if (CM.Options.TooltipAmor === 1) {
			const buildPrice = CM.Sim.BuildingGetPrice(Game.Objects[name], Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			const amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML
					.split('so far</div>')
					.join(`so far<br/>&bull; <b>${Beautify(amortizeAmount)}</b> ${Math.floor(amortizeAmount) === 1 ? 'cookie' : 'cookies'} left to amortize (${CM.Disp.GetTimeColor((buildPrice - Game.Objects[name].totalCookies) / (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text})</div>`);
			}
		}
		if (Game.buyMode === -1) {
			/*
             * Fix sell price displayed in the object tooltip.
             *
             * The buildings sell price displayed by the game itself (without any mod) is incorrect.
             * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
             *
             * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
             */
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].bulkPrice)).join(Beautify(CM.Sim.BuildingSell(Game.Objects[name], Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 1)));
		}
	} else if (type === 'u') { // Upgrades
		if (!Game.UpgradesInStore[name]) return '';
		l('tooltip').innerHTML = Game.crateTooltip(Game.UpgradesInStore[name], 'store');
	} else if (type === 's') l('tooltip').innerHTML = Game.lumpTooltip(); // Sugar Lumps
	else if (type === 'g') l('tooltip').innerHTML = Game.Objects['Wizard tower'].minigame.spellTooltip(name)(); // Grimoire
	else if (type === 'p') l('tooltip').innerHTML = Game.ObjectsById[2].minigame.tileTooltip(name[0], name[1])(); // Garden plots
	else if (type === 'ha') l('tooltip').innerHTML = Game.ObjectsById[2].minigame.toolTooltip(1)(); // Harvest all button in garden

	// Adds area for extra tooltip-sections
	if ((type === 'b' && Game.buyMode === 1) || type === 'u' || type === 's' || type === 'g' || (type === 'p' && !Game.keys[16]) || type === 'ha') {
		const area = document.createElement('div');
		area.id = 'CMTooltipArea';
		l('tooltip').appendChild(area);
	}

	// Sets global variables used by CM.Disp.UpdateTooltip()
	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	UpdateTooltips();

	return l('tooltip').innerHTML;
}

/**
 * This function updates the sections of the tooltips created by CookieMonster
 */
export function UpdateTooltips() {
	CM.Sim.CopyData();
	if (l('tooltipAnchor').style.display !== 'none' && l('CMTooltipArea')) {
		l('CMTooltipArea').innerHTML = '';
		const tooltipBox = TooltipCreateTooltipBox();
		l('CMTooltipArea').appendChild(tooltipBox);

		if (CM.Disp.tooltipType === 'b') {
			UpdateTooltip.Building();
		} else if (CM.Disp.tooltipType === 'u') {
			UpdateTooltip.Upgrade();
		} else if (CM.Disp.tooltipType === 's') {
			UpdateTooltip.SugarLump();
		} else if (CM.Disp.tooltipType === 'g') {
			UpdateTooltip.Grimoire();
		} else if (CM.Disp.tooltipType === 'p') {
			UpdateTooltip.GardenPlots();
		} else if (CM.Disp.tooltipType === 'ha') {
			UpdateTooltip.HarvestAll();
		}
		UpdateTooltip.Warnings();
	} else if (l('CMTooltipArea') === null) { // Remove warnings if its a basic tooltip
		if (l('CMDispTooltipWarningParent') !== null) {
			l('CMDispTooltipWarningParent').remove();
		}
	}
}
