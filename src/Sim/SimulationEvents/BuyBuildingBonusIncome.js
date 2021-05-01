import CalculateGains from '../Calculations/CalculateGains';
import CheckOtherAchiev from '../Calculations/CheckOtherAchiev';
import CopyData from '../SimulationData/CopyData';
import SimWin from '../SimulationData/SimWin';
import { SimAchievementsOwned, SimCookiesPs, SimObjects } from '../VariablesAndData';

/**
 * This function calculates the bonus income of buying a building
 * It is called by CM.Cache.CacheBuildingIncome()
 * @param	{string}	building	The name of the building to be bought
 * @param	{number}	amount		The amount to be bought
 * @returns {number}				The bonus income of the building
 */
export default function BuyBuildingsBonusIncome(building, amount) {
  CopyData();
  SimObjects[building].amount += amount;
  const me = SimObjects[building];

  if (building === 'Cursor') {
    if (me.amount >= 1) SimWin('Click');
    if (me.amount >= 2) SimWin('Double-click');
    if (me.amount >= 50) SimWin('Mouse wheel');
    if (me.amount >= 100) SimWin('Of Mice and Men');
    if (me.amount >= 200) SimWin('The Digital');
    if (me.amount >= 300) SimWin('Extreme polydactyly');
    if (me.amount >= 400) SimWin('Dr. T');
    if (me.amount >= 500) SimWin('Thumbs, phalanges, metacarpals');
    if (me.amount >= 600) SimWin('With her finger and her thumb');
    if (me.amount >= 700) SimWin('Gotta hand it to you');
    if (me.amount >= 800) SimWin("The devil's workshop");
  } else {
    Object.keys(Game.Objects[me.name].tieredAchievs).forEach((j) => {
      if (me.amount >= Game.Tiers[Game.Objects[me.name].tieredAchievs[j].tier].achievUnlock) {
        SimWin(Game.Objects[me.name].tieredAchievs[j].name);
      }
    });
  }

  const lastAchievementsOwned = SimAchievementsOwned;

  CalculateGains();

  CheckOtherAchiev();

  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }

  return SimCookiesPs - Game.cookiesPs;
}
