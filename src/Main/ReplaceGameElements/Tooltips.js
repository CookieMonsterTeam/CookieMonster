/* eslint-disable no-unused-vars */
/** Functions related to replacing tooltips */

import { CreateTooltip } from '../../Disp/Tooltips/Tooltip';
import {
	LoadMinigames, TooltipBuildBackup, TooltipLumpBackup,
} from '../VariablesAndData';
import ReplaceNativeGrimoire from './NativeGrimoire';
import ReplaceTooltipGrimoire from './TooltipGrimoire';

/**
 * This function replaces the original .onmouseover functions of buildings
 */
function ReplaceTooltipBuild() {
	for (const i of Object.keys(Game.Objects)) {
		const me = Game.Objects[i];
		if (l(`product${me.id}`).onmouseover !== null) {
			TooltipBuildBackup[i] = l(`product${me.id}`).onmouseover;
			l(`product${me.id}`).onmouseover = function () {
				Game.tooltip.dynamic = 1;
				Game.tooltip.draw(this, function () { return CreateTooltip('b', `${i}`); }, 'store');
				Game.tooltip.wobble();
			};
		}
	}
}

/**
 * This function replaces the original .onmouseover functions of sugar lumps
 */
function ReplaceTooltipLump() {
	if (Game.canLumps()) {
		TooltipLumpBackup = l('lumps').onmouseover;
		l('lumps').onmouseover = function () {
			Game.tooltip.dynamic = 1;
			Game.tooltip.draw(this, function () { return CreateTooltip('s', 'Lump'); }, 'this');
			Game.tooltip.wobble();
		};
	}
}

/**
 * This function replaces the original .onmouseover functions of all garden plants
 */
function ReplaceTooltipGarden() {
	if (Game.Objects.Farm.minigameLoaded) {
		l('gardenTool-1').onmouseover = function () { Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function () { return CreateTooltip('ha', 'HarvestAllButton'); }, 'this'); Game.tooltip.wobble(); };
		Array.from(l('gardenPlot').children).forEach((child) => {
			const coords = child.id.slice(-3);
			child.onmouseover = function () {
				Game.tooltip.dynamic = 1;
				Game.tooltip.draw(this, function () { return CreateTooltip('p', [`${coords[0]}`, `${coords[2]}`]); }, 'this');
				Game.tooltip.wobble();
			};
		});
	}
}

/**
 * This function call all functions that replace Game-tooltips with Cookie Monster enhanced tooltips
 */
export default function ReplaceTooltips() {
	ReplaceTooltipBuild();
	ReplaceTooltipLump();

	// Replace Tooltips of Minigames. Nesting it in LoadMinigames makes sure to replace them even if
	// they were not loaded initially
	LoadMinigames = Game.LoadMinigames;
	Game.LoadMinigames = function () {
		LoadMinigames();
		ReplaceTooltipGarden();
		ReplaceTooltipGrimoire();
		ReplaceNativeGrimoire();
	};
	Game.LoadMinigames();
}
