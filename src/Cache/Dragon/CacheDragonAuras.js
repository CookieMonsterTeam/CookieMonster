/* eslint-disable no-unused-vars */
import { CacheDragonAura, CacheDragonAura2 } from '../VariablesAndData';

/**
 * This functions caches the currently selected Dragon Auras
 */
export default function CacheDragonAuras() {
	CacheDragonAura = Game.dragonAura;
	CacheDragonAura2 = Game.dragonAura2;
}
