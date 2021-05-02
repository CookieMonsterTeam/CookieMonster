import { CacheRealCookiesEarned } from '../../Cache/VariablesAndData';
import CalculateGains from '../Calculations/CalculateGains';
import CheckOtherAchiev from '../Calculations/CheckOtherAchiev';
import CopyData from '../SimulationData/CopyData';
import SimWin from '../SimulationData/SimWin';
import { SimAchievementsOwned, SimCookiesPs, SimPrestige, SimUpgrades } from '../VariablesAndData'; // eslint-disable-line no-unused-vars

/**
 * This function calculates the cookies per click difference betwene current and after a ascension
 * It is called by CM.Disp.CreateStatsPrestigeSection()
 * @param	{number}	newHeavenlyChips	The total heavenly chips after ascension
 * @returns	{number}	ResetCPS			The CPS difference after reset
 */
export default function ResetBonus(newHeavenlyChips) {
  // Calculate CPS with all Heavenly upgrades
  let curCPS = Game.cookiesPs;

  CopyData();

  if (SimUpgrades['Heavenly key'].bought === 0) {
    SimUpgrades['Heavenly chip secret'].bought = 1;
    SimUpgrades['Heavenly cookie stand'].bought = 1;
    SimUpgrades['Heavenly bakery'].bought = 1;
    SimUpgrades['Heavenly confectionery'].bought = 1;
    SimUpgrades['Heavenly key'].bought = 1;

    CalculateGains();

    curCPS = SimCookiesPs;

    CopyData();
  }

  if (CacheRealCookiesEarned >= 1000000) SimWin('Sacrifice');
  if (CacheRealCookiesEarned >= 1000000000) SimWin('Oblivion');
  if (CacheRealCookiesEarned >= 1000000000000) SimWin('From scratch');
  if (CacheRealCookiesEarned >= 1000000000000000) SimWin('Nihilism');
  if (CacheRealCookiesEarned >= 1000000000000000000) SimWin('Dematerialize');
  if (CacheRealCookiesEarned >= 1000000000000000000000) SimWin('Nil zero zilch');
  if (CacheRealCookiesEarned >= 1000000000000000000000000) SimWin('Transcendence');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000) SimWin('Obliterate');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000) SimWin('Negative void');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000) SimWin('To crumbs, you say?');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000) SimWin('You get nothing');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000)
    SimWin('Humble rebeginnings');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000)
    SimWin('The end of the world');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000)
    SimWin("Oh, you're back");
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000000)
    SimWin('Lazarus');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000000000)
    SimWin('Smurf account');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000000000000)
    SimWin("If at first you don't succeed");

  SimUpgrades['Heavenly chip secret'].bought = 1;
  SimUpgrades['Heavenly cookie stand'].bought = 1;
  SimUpgrades['Heavenly bakery'].bought = 1;
  SimUpgrades['Heavenly confectionery'].bought = 1;
  SimUpgrades['Heavenly key'].bought = 1;

  SimPrestige = newHeavenlyChips;

  const lastAchievementsOwned = SimAchievementsOwned;

  CalculateGains();

  CheckOtherAchiev();

  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }

  const ResetCPS = SimCookiesPs - curCPS;

  // Reset Pretige level after calculation as it is used in CM.Sim.CalculateGains() so can't be local
  SimPrestige = Game.prestige;

  return ResetCPS;
}
