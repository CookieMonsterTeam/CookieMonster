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
    Game.dragonAuras[SimDragonAura2].name === 'Reality Bending'
  )
    n += 0.1;
  return n;
}
