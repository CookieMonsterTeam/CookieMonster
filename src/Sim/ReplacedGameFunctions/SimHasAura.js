import { SimDragonAura, SimDragonAura2 } from '../VariablesAndData';

/**
 * This functions creates functions similarly to Game.hasAura but checks Sim Data instead of Game Data
 */
export default function SimHasAura(what) {
  if (
    Game.dragonAuras[SimDragonAura].name === what ||
    Game.dragonAuras[SimDragonAura2].name === what
  ) {
    return true;
  }
  return false;
}
