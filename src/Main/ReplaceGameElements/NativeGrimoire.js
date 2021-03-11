/* eslint-disable no-unused-vars */
import { FormatTime } from '../../Disp/BeautifyFormatting';
import { BackupGrimoireDraw, BackupGrimoireLaunch, BackupGrimoireLaunchMod, HasReplaceNativeGrimoireDraw, HasReplaceNativeGrimoireLaunch } from '../VariablesAndData';
import { ReplaceTooltipGrimoire } from './Tooltips';

/**
 * This function fixes replaces the .launch function of the Grimoire
 */
function ReplaceNativeGrimoireLaunch() {
	if (!HasReplaceNativeGrimoireLaunch && Game.Objects['Wizard tower'].minigameLoaded) {
		const minigame = Game.Objects['Wizard tower'].minigame;
		BackupGrimoireLaunch = minigame.launch;
		BackupGrimoireLaunchMod = minigame.launch.toString().split('=this').join('= Game.Objects[\'Wizard tower\'].minigame')};
		Game.Objects['Wizard tower'].minigame.launch = function () {
			BackupGrimoireLaunchMod();
			ReplaceTooltipGrimoire();
			HasReplaceNativeGrimoireDraw = false;
			ReplaceNativeGrimoireDraw();
		};
		HasReplaceNativeGrimoireLaunch = true;
	}
}

/**
 * This function fixes replaces the .draw function of the Grimoire
 */
function ReplaceNativeGrimoireDraw() {
	if (!HasReplaceNativeGrimoireDraw && Game.Objects['Wizard tower'].minigameLoaded) {
		const minigame = Game.Objects['Wizard tower'].minigame;
		BackupGrimoireDraw = minigame.draw;
		Game.Objects['Wizard tower'].minigame.draw = function () {
			BackupGrimoireDraw();
			if (CM.Options.GrimoireBar === 1 && minigame.magic < minigame.magicM) {
				minigame.magicBarTextL.innerHTML += ` (${FormatTime(CM.Disp.CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, minigame.magicM))})`;
			}
		};
		HasReplaceNativeGrimoireDraw = true;
	}
}

/**
 * This function fixes replaces the Launch and Draw functions of the Grimoire
 */
export default function ReplaceNativeGrimoire() {
	ReplaceNativeGrimoireLaunch();
	ReplaceNativeGrimoireDraw();
}
