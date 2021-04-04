import { CacheDragonAura, CacheDragonAura2 } from '../VariablesAndData';

/**
 * This functions caches the currently selected Dragon Auras
 */
export default function CacheDragonAuras() {
  CacheDragonAura = Game.dragonAura; // eslint-disable-line no-unused-vars
  CacheDragonAura2 = Game.dragonAura2; // eslint-disable-line no-unused-vars
}
