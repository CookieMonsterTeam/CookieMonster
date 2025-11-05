/** Functions related to replacing tooltips */

import CalculateAllPlotChances from '../../Disp/HelperFunctions/CalculateAllPlotChances.js';
import { CreateTooltip } from '../../Disp/Tooltips/Tooltip.js';
import { LoadMinigames, TooltipBuildBackup, TooltipLumpBackup } from '../VariablesAndData.js'; // eslint-disable-line no-unused-vars
import ReplaceNativeGrimoire from './NativeGrimoire.js';
import ReplaceTooltipGrimoire from './TooltipGrimoire.js';

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
 * Replaces functions for the garden minigame
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

    // overwrite the harvesting function to allow CachePlotChances to be updated
    const OldBuildPlot = Game.Objects.Farm.minigame.buildPlot;
    Game.Objects.Farm.minigame.buildPlot = function () {
      OldBuildPlot(arguments); // eslint-disable-line prefer-rest-params
      CalculateAllPlotChances(Game.Objects.Farm.minigame, Game.auraMult('Supreme Intellect'));
    };
  }
}

/**
 * This function replaces the original .onmouseover functions of all stocks
 */
function ReplaceTooltipMarket() {
  if (Game.Objects.Bank.minigameLoaded) {
    for (let i = 0; i < Game.Objects.Bank.minigame.goodsById.length; i++) {
      l(`bankGood-${i}`).firstChild.onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(this, () => CreateTooltip('sm', i), 'this');
        Game.tooltip.wobble();
      };
    }
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
    ReplaceTooltipMarket();
    ReplaceTooltipPantheon();
    ReplaceNativeGrimoire();
  };
  Game.LoadMinigames();
}
