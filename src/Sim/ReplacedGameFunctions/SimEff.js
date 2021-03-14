import { SimEffs } from '../VariablesAndData';

/**
 * This functions creates functions similarly to Game.Eff but checks Sim Data instead of Game Data
 */
export default function SimEff(name, def) {
  if (typeof SimEffs[name] === 'undefined') {
    return typeof def === 'undefined' ? 1 : def;
  }
  return SimEffs[name];
}
