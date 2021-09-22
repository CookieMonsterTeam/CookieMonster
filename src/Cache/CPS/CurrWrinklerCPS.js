import { SimObjects } from '../../Sim/VariablesAndData';
import FillCMDCache from '../FillCMDCache';
import { CacheCurrWrinklerCount, CacheCurrWrinklerCPSMult } from '../VariablesAndData';

/**
 * This functions caches the current Wrinkler CPS multiplier
 * @global	{number}	CM.Cache.CurrWrinklerCount		Current number of wrinklers
 * @global	{number}	CM.Cache.CurrWrinklerCPSMult	Current multiplier of CPS because of wrinklers (excluding their negative sucking effect)
 */
export default function CacheCurrWrinklerCPS() {
  CacheCurrWrinklerCPSMult = 0;
  let count = 0;
  Object.keys(Game.wrinklers).forEach((i) => {
    if (Game.wrinklers[i].phase === 2) count += 1;
  });
  let godMult = 1;
  if (SimObjects.Temple.minigameLoaded) {
    const godLvl = Game.hasGod('scorn');
    if (godLvl === 1) godMult *= 1.15;
    else if (godLvl === 2) godMult *= 1.1;
    else if (godLvl === 3) godMult *= 1.05;
  }
  CacheCurrWrinklerCount = count;
  CacheCurrWrinklerCPSMult =
    count *
    (count * 0.05 * 1.1) *
    (Game.Has('Sacrilegious corruption') * 0.05 + 1) *
    (Game.Has('Wrinklerspawn') * 0.05 + 1) *
    godMult;

  FillCMDCache({ CacheCurrWrinklerCount, CacheCurrWrinklerCPSMult });
}
