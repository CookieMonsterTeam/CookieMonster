import SimAuraMult from './SimAuraMult';
import SimHas from './SimHas';
import SimHasGod from './SimHasGod';

/**
 * This functions creates functions similarly to Game.GetHeavenlyMultiplier but checks Sim Data instead of Game Data
 */
export default function SimGetHeavenlyMultiplier() {
  let heavenlyMult = 0;
  if (SimHas('Heavenly chip secret')) heavenlyMult += 0.05;
  if (SimHas('Heavenly cookie stand')) heavenlyMult += 0.2;
  if (SimHas('Heavenly bakery')) heavenlyMult += 0.25;
  if (SimHas('Heavenly confectionery')) heavenlyMult += 0.25;
  if (SimHas('Heavenly key')) heavenlyMult += 0.25;
  // if (SimHasAura('Dragon God')) heavenlyMult*=1.05;
  heavenlyMult *= 1 + SimAuraMult('Dragon God') * 0.05;
  if (SimHas('Lucky digit')) heavenlyMult *= 1.01;
  if (SimHas('Lucky number')) heavenlyMult *= 1.01;
  if (SimHas('Lucky payout')) heavenlyMult *= 1.01;
  if (Game.hasGod) {
    const godLvl = SimHasGod('creation');
    if (godLvl === 1) heavenlyMult *= 0.7;
    else if (godLvl === 2) heavenlyMult *= 0.8;
    else if (godLvl === 3) heavenlyMult *= 0.9;
  }
  return heavenlyMult;
}
