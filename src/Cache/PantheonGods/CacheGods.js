import CalculateChangeGod from '../../Sim/SimulationEvents/GodChange';
import FillCMDCache from '../FillCMDCache';
import { CacheGods } from '../VariablesAndData';

/**
 * This functions caches the cps effect of each God in slot 1, 2 or 3
 */
export default function CachePantheonGods() {
  for (let god = 0; god < 11; god += 1) {
    for (let slot = 0; slot < 3; slot += 1) {
      CacheGods[god][slot] = CalculateChangeGod(god, slot);
    }
  }

  FillCMDCache({ CacheGods });
}
