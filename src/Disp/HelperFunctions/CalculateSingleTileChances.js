/* eslint-disable guard-for-in */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

/**
 * Calculates the possible plants for a tile after the next garden tick.
 *
 * @param {Object} minigame A reference to the garden minigame
 * @param {number} plantId The ID of the tile's current plant (-1 if empty)
 * @param {number} age The age of the tile's current plant (ignored if empty)
 * @param {Object[][]} neighResults The calculated results of each neighboring tile
 * @param {number[]} cardinals The indices of orthogonally adjacent tiles in `neighResults`
 * @param {number[]} tileBoosts The boosts to aging and weed spawning this tile is recieving from nearby tiles in the format `[ageMult, weedMult]`
 * @param {number} dragonBoost The current calculated value of the boost from the "Supreme Intellect" dragon aura
 * @returns {{plantId: number, isMature: boolean, p: number}[]} The possible resulting tile states and their probabilities
 */
export default function CalculateSingleTileChances(
  minigame,
  plantId,
  age,
  neighResults,
  cardinals,
  tileBoosts,
  dragonBoost,
) {
  const { getMuts, plants, plantsById, plantContam, soilsById, soil } = minigame;
  const soilWeedMult = soilsById[soil].weedMult;

  const epsilon = 1e-12;
  const futureStates = [];
  const AddOutcome = function (outcome) {
    if (outcome.p < epsilon) return;

    const existing = futureStates.find(
      (o) =>
        o.plantId === outcome.plantId &&
        (outcome.plantId === -1 || o.isMature === outcome.isMature),
    );
    if (existing) existing.p += outcome.p;
    else futureStates.push(outcome);
  };
  let runningP = 1;

  if (plantId !== -1) {
    // tile has plant
    const currentPlant = plantsById[plantId];

    const AgeThresholdP = function (multiplier, threshold) {
      // probability that plant's age increases by at least threshold
      const minAge = currentPlant.ageTick * multiplier;
      const maxAge = minAge + currentPlant.ageTickR * multiplier;

      if (Math.abs(maxAge - minAge) < epsilon) {
        if (minAge >= threshold) return 1;
        if (minAge < threshold - 1) return 0;
        return minAge - (threshold - 1);
      }

      if (threshold <= minAge) return 1;
      if (threshold - 1 >= maxAge) return 0;

      const lower = Math.max(minAge, threshold - 1);
      const upper = Math.min(maxAge, threshold);

      const a = 0.5 * (upper - (threshold - 1)) ** 2 - 0.5 * (lower - (threshold - 1)) ** 2;
      const b = Math.max(0, maxAge - Math.max(minAge, threshold));

      return (a + b) / (maxAge - minAge);
    };

    // death
    if (!currentPlant.immortal) {
      const deathP = AgeThresholdP(tileBoosts[0] * dragonBoost, 100 - age);
      AddOutcome({ plantId: -1, isMature: false, p: deathP * runningP });
      runningP -= deathP * runningP;
    }

    // contamination
    if (!currentPlant.noContam) {
      const contamChances = [];

      for (const key in plantContam) {
        let inclusionP = plantContam[key];
        if (plants[key].weed) inclusionP *= soilWeedMult;
        contamChances.push([key, inclusionP]);
      }

      let totalContamP = 0;
      for (const [key1, inclusionP1] of contamChances) {
        if (plants[key1].id === plantId || inclusionP1 === 0) continue;

        let hasNeighborP = 0;
        for (const i of cardinals) {
          let isNeighborP = 0;
          for (const o of neighResults[i]) {
            if (o.plantId === key1 && o.isMature) isNeighborP += o.p;
          }
          hasNeighborP += isNeighborP * (1 - hasNeighborP);
        }
        if (hasNeighborP < epsilon) continue;

        let q = [1];
        for (const [key2, inclusionP2] of contamChances) {
          if (key1 !== key2) {
            const newQ = Array(q.length + 1).fill(0);
            for (let k = 0; k < q.length; k++) {
              newQ[k] += q[k] * (1 - inclusionP2);
              newQ[k + 1] += q[k] * inclusionP2;
            }
            q = newQ;
          }
        }

        const E = q.reduce((acc, probXk, k) => acc + probXk / (1 + k), 0);
        const contamP = inclusionP1 * E * hasNeighborP * runningP;
        AddOutcome({ plantId: plants[key1].id, isMature: false, p: contamP });
        totalContamP += contamP;
      }
      runningP -= totalContamP;
    }

    // survival (remaining probability)
    const maturityP = AgeThresholdP(tileBoosts[0] * dragonBoost, currentPlant.mature - age);
    AddOutcome({ plantId, isMature: true, p: maturityP * runningP });
    AddOutcome({ plantId, isMature: false, p: (1 - maturityP) * runningP });
  } else {
    // tile is empty
    let noNeighborsChance = 1;
    neighResults.forEach((neighbor) => {
      let emptyChance = 0;
      const emptyOutcome = neighbor.find((outcome) => outcome.plantId === -1);
      if (emptyOutcome) emptyChance = emptyOutcome.p;
      noNeighborsChance *= emptyChance;
    });

    // weeds
    const weedChance = 0.002 * soilWeedMult * tileBoosts[1];
    AddOutcome({ plantId: 13, isMature: false, p: weedChance * noNeighborsChance });
    AddOutcome({ plantId: -1, isMature: false, p: (1 - weedChance) * noNeighborsChance });

    runningP -= noNeighborsChance;

    // mutation
    if (noNeighborsChance < 1) {
      let totalMutationP = 0;

      const CombineNeighbors = function (i = 0, current = [], comboP = 1, results = []) {
        if (i >= neighResults.length) {
          results.push({ tiles: current.slice(), comboP });
          return results;
        }

        for (const state of neighResults[i])
          CombineNeighbors(i + 1, [...current, state], comboP * state.p, results);

        return results;
      };

      const loopsBase = (soilsById[soil].key === 'woodchips' ? 3 : 1) * dragonBoost;
      for (const combo of CombineNeighbors()) {
        // possible combinations of neighboring tiles
        const neighs = {};
        const neighsM = {};

        for (const tile of combo.tiles) {
          if (tile.plantId === -1) continue;
          const { key } = plantsById[tile.plantId];
          neighs[key] = (neighs[key] || 0) + 1;
          if (tile.isMature) neighsM[key] = (neighsM[key] || 0) + 1;
        }

        const muts = getMuts(neighs, neighsM);

        let perLoopMutationP = 0; // probability that any mutation occurs on a single loop with this combo
        const mutationChances = [];
        for (const [key, mutValue] of muts) {
          let inclusionP = mutValue;
          if (plants[key].weed) inclusionP *= soilWeedMult;
          if (plants[key].weed || plants[key].fungus) inclusionP *= tileBoosts[1];
          if (inclusionP > 0) mutationChances.push([key, inclusionP]);
        }

        const perLoopMutations = [];
        for (const [key1, inclusionP1] of mutationChances) {
          let q = [1];
          for (const [key2, inclusionP2] of mutationChances) {
            if (key1 !== key2) {
              const newQ = Array(q.length + 1).fill(0);
              for (let k = 0; k < q.length; k++) {
                newQ[k] += q[k] * (1 - inclusionP2);
                newQ[k + 1] += q[k] * inclusionP2;
              }
              q = newQ;
            }
          }

          const E = q.reduce((acc, probXk, k) => acc + probXk / (1 + k), 0);
          const mutationP = inclusionP1 * E;
          perLoopMutationP += mutationP;
          perLoopMutations.push([key1, mutationP * combo.comboP * runningP]);
        }

        if (perLoopMutationP === 0) continue;

        let loopsBoost = 1;
        if (loopsBase > 1) {
          if (Number.isInteger(loopsBase)) {
            loopsBoost = (1 - (1 - perLoopMutationP) ** loopsBase) / perLoopMutationP;
          } else {
            const loopsFloor = Math.floor(loopsBase);
            const loopsFrac = loopsBase % 1;
            const boostN = (1 - (1 - perLoopMutationP) ** loopsFloor) / perLoopMutationP;
            const boostNp1 = (1 - (1 - perLoopMutationP) ** (loopsFloor + 1)) / perLoopMutationP;
            loopsBoost = (1 - loopsFrac) * boostN + loopsFrac * boostNp1;
          }
        }

        for (const [key, mutationP] of perLoopMutations) {
          AddOutcome({ plantId: plants[key].id, maturityP: 0, p: mutationP * loopsBoost });
          totalMutationP += mutationP * loopsBoost;
        }
      }

      runningP -= totalMutationP;
    }

    // nothing (remaining probability)
    AddOutcome({ plantId: -1, isMature: false, p: runningP });
  }

  const total = futureStates.reduce((sum, o) => sum + o.p, 0);
  if (Math.abs(total - 1) > 1e-9) {
    futureStates.forEach((o) => {
      o.p /= total;
    });
  }

  return futureStates;
}
