/** Functions related to replacing tooltips */

import { CreateTooltip } from '../../Disp/Tooltips/Tooltip';
import { LoadMinigames, TooltipBuildBackup, TooltipLumpBackup } from '../VariablesAndData'; // eslint-disable-line no-unused-vars
import ReplaceNativeGrimoire from './NativeGrimoire';
import ReplaceTooltipGrimoire from './TooltipGrimoire';

/**
 * This function replaces the original .onmouseover functions of buildings
 */
function ReplaceTooltipBuild() {
  Object.keys(Game.Objects).forEach((i) => {
    const me = Game.Objects[i];
    if (l(`product${me.id}`).onmouseover !== null) {
      TooltipBuildBackup[i] = l(`product${me.id}`).onmouseover;
      l(`product${me.id}`).onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(this, () => CreateTooltip('b', `${i}`), 'store');
        Game.tooltip.wobble();
      };
    }
  });
}

/**
 * This function replaces the original .onmouseover functions of sugar lumps
 */
function ReplaceTooltipLump() {
  if (Game.canLumps()) {
    TooltipLumpBackup = l('lumps').onmouseover;
    l('lumps').onmouseover = function () {
      Game.tooltip.dynamic = 1;
      Game.tooltip.draw(this, () => CreateTooltip('s', 'Lump'), 'this');
      Game.tooltip.wobble();
    };
  }
}

/**
 * This function replaces the original .onmouseover functions of all garden plants
 */
function ReplaceTooltipGarden() {
  if (Game.Objects.Farm.minigameLoaded) {
    l('gardenTool-1').onmouseover = function () {
      Game.tooltip.dynamic = 1;
      Game.tooltip.draw(this, () => CreateTooltip('ha', 'HarvestAllButton'), 'this');
      Game.tooltip.wobble();
    };
    Array.from(l('gardenPlot').children).forEach((child) => {
      const coords = child.id.slice(-3);
      // eslint-disable-next-line no-param-reassign
      child.onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(this, () => CreateTooltip('p', [`${coords[0]}`, `${coords[2]}`]), 'this');
        Game.tooltip.wobble();
      };
    });
  }
}

function ReplaceTooltipPantheon() {
  if (Game.Objects.Temple.minigameLoaded) {
    for (let i = 0; i < 11; i += 1) {
      l(`templeGod${i}`).onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(this, () => CreateTooltip('pag', i), 'this');
        Game.tooltip.wobble();
      };
    }
    for (let i = 0; i < 3; i += 1) {
      l(`templeSlot${i}`).onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(
          this,
          () => CreateTooltip('pas', [i, Game.Objects.Temple.minigame.slot[i]]),
          'this',
        );
        Game.tooltip.wobble();
      };
    }
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
  // eslint-disable-next-line prefer-destructuring
  LoadMinigames = Game.LoadMinigames;
  Game.LoadMinigames = function () {
    LoadMinigames();
    ReplaceTooltipGarden();
    ReplaceTooltipGrimoire();
    ReplaceTooltipPantheon();
    ReplaceNativeGrimoire();
  };
  Game.LoadMinigames();
}
