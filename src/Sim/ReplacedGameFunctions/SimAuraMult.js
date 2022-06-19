import { SimDragonAura, SimDragonAura2 } from '../VariablesAndData';

/**
 * This functions creates functions similarly to Game.auraMult but checks Sim Data instead of Game Data
 */
export default function SimAuraMult(what) {
  let n = 0;
  if (
    Game.dragonAuras[SimDragonAura].name === what ||
    Game.dragonAuras[SimDragonAura2].name === what
  )
    n = 1;
  if (
    Game.dragonAuras[SimDragonAura].name === 'Reality Bending' ||
    (Game.dragonAuras[SimDragonAura2].name === 'Reality Bending' &&
      Game.dragonLevel >= Game.dragonAurasBN[what].id + 4)
  )
    n += 0.1;
  return n;
}
