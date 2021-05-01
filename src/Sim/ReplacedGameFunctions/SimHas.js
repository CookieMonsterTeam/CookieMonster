import { SimUpgrades } from '../VariablesAndData';

/**
 * This functions creates functions similarly to Game.Has but checks Sim Data instead of Game Data
 */
export default function SimHas(what) {
  const it = SimUpgrades[what];
  if (Game.ascensionMode === 1 && (it.pool === 'prestige' || it.tier === 'fortune')) return 0;
  return it ? it.bought : 0;
}
