/* eslint-disable no-continue */

import { CachePlotChances } from '../../Cache/VariablesAndData.js';
import CalculateSingleTileChances from './CalculateSingleTileChances.js';

/**
 * Calculates the possible plants for the next garden tick and updates **`CachePlotChances`** accordingly (expensive.)
 *
 * @param {Object} minigame a reference to the garden minigame
 * @param {number} auraMult the current value of the "Supreme Intellect" dragon aura multiplier
 */
export default function CalculateAllPlotChances(minigame, auraMult) {
  const { plantsById, soilsById, soil, isTileUnlocked, getTile } = minigame;
  const dragonBoost = 1 + 0.05 * auraMult;

  // calculate boosts from neighbors for next tick
  const boosts = [];
  for (let y = 0; y < 6; y++) {
    boosts[y] = [];
    for (let x = 0; x < 6; x++) boosts[y].push([1, 1]); // [aging, weed]
  }

  const ApplyMultsToNearbyTiles = function (x, y, range, mults) {
    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        if ((dx !== 0 || dy !== 0) && isTileUnlocked(x + dx, y + dy)) {
          boosts[y + dy][x + dx][0] *= mults[0];
          boosts[y + dy][x + dx][1] *= mults[1];
        }
      }
    }
  };

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      const tile = getTile(x, y);
      if (tile[0] === 0) continue;

      let ageMult;
      let weedMult;
      let range;
      const id = tile[0] - 1;
      switch (id) {
        case 7:
          ageMult = 1.03;
          weedMult = 1;
          range = 1;
          break;
        case 31:
          ageMult = 1;
          weedMult = 0;
          range = 2;
          break;
        case 32:
          ageMult = 1;
          weedMult = 0;
          range = 1;
          break;
        case 33:
          ageMult = 0.5;
          weedMult = 1;
          range = 1;
          break;
        default:
          continue;
      }

      let mult = soilsById[soil].effMult;
      const matureAge = plantsById[id].mature;
      const stage = 1 + (tile[1] >= matureAge ? 3 : Math.floor(tile[1] / (matureAge * 0.333)));

      // eslint-disable-next-line default-case
      switch (stage) {
        case 1:
          mult *= 0.1;
          break;
        case 2:
          mult *= 0.25;
          break;
        case 3:
          mult *= 0.5;
          break;
      }

      if (ageMult > 1 || mult < 1) ageMult = (ageMult - 1) * mult + 1;
      else ageMult /= mult;

      ApplyMultsToNearbyTiles(x, y, range, [ageMult, weedMult]);
    }
  }

  // initialize all probabilities to current state
  const plotOutcomes = [[], [], [], [], [], []];

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      if (!isTileUnlocked(x, y)) continue;

      const tile = getTile(x, y);
      if (tile[0] === 0) plotOutcomes[y][x] = [{ plantId: -1, isMature: false, p: 1 }];
      else {
        const plantId = tile[0] - 1;
        plotOutcomes[y][x] = [{ plantId, isMature: tile[1] >= plantsById[plantId].mature, p: 1 }];
      }
    }
  }

  // update each tile's chances
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      if (!isTileUnlocked(x, y)) continue;

      // collect neighbor probabilities
      const neighResults = [];
      const cardinals = [];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if ((dx !== 0 || dy !== 0) && isTileUnlocked(x + dx, y + dy)) {
            neighResults.push(plotOutcomes[y + dy][x + dx]);
            if (dx === 0 || dy === 0) cardinals.push(neighResults.length - 1); // save indices of cardinal neighbors
          }
        }

      const tile = getTile(x, y);

      plotOutcomes[y][x] = CalculateSingleTileChances(
        minigame,
        tile[0] - 1,
        tile[1],
        neighResults,
        cardinals,
        boosts[y][x],
        dragonBoost,
      );

      // save results
      CachePlotChances[y][x] = [];

      const emptyP = plotOutcomes[y][x]
        .filter((o) => o.plantId === -1)
        .reduce((s, o) => s + o.p, 0);
      if (emptyP > 0) CachePlotChances[y][x].push({ plantId: -1, maturityP: 0, p: emptyP });

      for (let id = 0; id < plantsById.length; id++) {
        const matches = plotOutcomes[y][x].filter((o) => o.plantId === id);
        if (matches.length > 1) {
          const plantP = matches.reduce((s, o) => s + o.p, 0);
          const maturityP =
            matches.filter((o) => o.isMature === true).reduce((s, o) => s + o.p, 0) / plantP;
          CachePlotChances[y][x].push({ plantId: id, maturityP, p: plantP });
        } else if (matches.length === 1)
          CachePlotChances[y][x].push({
            plantId: id,
            maturityP: matches[0].isMature ? 1 : 0,
            p: matches[0].p,
          });
      }

      CachePlotChances[y][x].sort((a, b) => a.plantId - b.plantId);
    }
  }
}
