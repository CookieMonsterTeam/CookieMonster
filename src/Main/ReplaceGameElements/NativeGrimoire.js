import { CMOptions } from '../../Config/VariablesAndData';
import FormatTime from '../../Disp/BeautifyAndFormatting/FormatTime';
import CalculateGrimoireRefillTime from '../../Disp/HelperFunctions/CalculateGrimoireRefillTime';
import {
  BackupGrimoireDraw,
  BackupGrimoireLaunch, // eslint-disable-line no-unused-vars
  BackupGrimoireLaunchMod,
  HasReplaceNativeGrimoireDraw,
  HasReplaceNativeGrimoireLaunch,
} from '../VariablesAndData';
import ReplaceTooltipGrimoire from './TooltipGrimoire';

/**
 * This function fixes replaces the .draw function of the Grimoire
 */
function ReplaceNativeGrimoireDraw() {
  if (!HasReplaceNativeGrimoireDraw && Game.Objects['Wizard tower'].minigameLoaded) {
    const { minigame } = Game.Objects['Wizard tower'];
    BackupGrimoireDraw = minigame.draw;
    Game.Objects['Wizard tower'].minigame.draw = function () {
      BackupGrimoireDraw();
      if (CMOptions.GrimoireBar === 1 && minigame.magic < minigame.magicM) {
        minigame.magicBarTextL.innerHTML += ` (${FormatTime(
          CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, minigame.magicM),
        )})`;
      }
    };
    HasReplaceNativeGrimoireDraw = true;
  }
}

/**
 * This function fixes replaces the .launch function of the Grimoire
 */
function ReplaceNativeGrimoireLaunch() {
  if (!HasReplaceNativeGrimoireLaunch && Game.Objects['Wizard tower'].minigameLoaded) {
    const { minigame } = Game.Objects['Wizard tower'];
    BackupGrimoireLaunch = minigame.launch;
    BackupGrimoireLaunchMod = new Function( // eslint-disable-line no-new-func
      `return ${minigame.launch
        .toString()
        .split('=this')
        .join("= Game.Objects['Wizard tower'].minigame")}`,
    );
    Game.Objects['Wizard tower'].minigame.launch = function () {
      BackupGrimoireLaunchMod();
      ReplaceTooltipGrimoire();
      HasReplaceNativeGrimoireDraw = false;
      ReplaceNativeGrimoireDraw();

      HasReplaceNativeGrimoireLaunch = true;
    };
  }
}

/**
 * This function fixes replaces the Launch and Draw functions of the Grimoire
 */
export default function ReplaceNativeGrimoire() {
  ReplaceNativeGrimoireLaunch();
  ReplaceNativeGrimoireDraw();
}
