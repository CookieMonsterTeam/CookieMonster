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
      if (
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GrimoireBar === 1 &&
        minigame.magic < minigame.magicM &&
        (typeof Steam === 'undefined' || Game.drawT % 5 === 0)
      ) {
        minigame.magicBarTextL.innerHTML += ` (${FormatTime(
          CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, minigame.magicM),
        )})`;
        minigame.magicBarL.style.width = "75%" // TODO: Fix this after Orteil pushes fix to main game;
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
