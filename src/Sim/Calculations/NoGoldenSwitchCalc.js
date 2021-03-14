import CopyData from '../SimulationData/CopyData';
import { SimCookiesPs, SimUpgrades } from '../VariablesAndData';
import CalculateGains from './CalculateGains';

/**
 * This function calculates CPS without the Golden Switch
 * It is called by CM.Cache.NoGoldSwitchCPS()
 */
export default function CalcNoGoldSwitchCPS() {
  CopyData();
  SimUpgrades['Golden switch [off]'].bought = 0;
  CalculateGains();
  return SimCookiesPs;
}
