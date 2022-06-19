import { SimObjects } from '../VariablesAndData';
import SimHas from './SimHas';

/**
 * This functions creates functions similarly to Game.GetTieredCpsMult but checks Sim Data instead of Game Data
 */
export default function SimGetTieredCpsMult(me) {
  let mult = 1;
  Object.keys(me.tieredUpgrades).forEach((i) => {
    if (!Game.Tiers[me.tieredUpgrades[i].tier].special && SimHas(me.tieredUpgrades[i].name)) {
      let tierMult = 2;
      // unshackled multipliers
      if (
        Game.ascensionMode !== 1 &&
        SimHas(me.unshackleUpgrade) &&
        SimHas(Game.Tiers[me.tieredUpgrades[i].tier].unshackleUpgrade)
      )
        tierMult += me.id === 1 ? 0.5 : (20 - me.id) * 0.1;
      mult *= tierMult;
    }
  });
  Object.keys(me.synergies).forEach((i) => {
    if (SimHas(me.synergies[i].name)) {
      const syn = me.synergies[i];
      if (syn.buildingTie1.name === me.name) mult *= 1 + 0.05 * syn.buildingTie2.amount;
      else if (syn.buildingTie2.name === me.name) mult *= 1 + 0.001 * syn.buildingTie1.amount;
    }
  });
  if (me.fortune && SimHas(me.fortune.name)) mult *= 1.07;
  if (me.grandma && SimHas(me.grandma.name))
    mult *= 1 + SimObjects.Grandma.amount * 0.01 * (1 / (me.id - 1));
  if (typeof me.tieredUpgrades.misfortune === 'object') {
    if (me.vanilla === 1 && SimHas(me.tieredUpgrades.misfortune.name)) {
      switch (Game.elderWrath) {
        default:
          mult *= 1;
          break;
        case 1:
          mult *= 1.02;
          break;
        case 2:
          mult *= 1.04;
          break;
        case 3:
          mult *= 1.06;
          break;
      }
    }
  }
  return mult;
}
