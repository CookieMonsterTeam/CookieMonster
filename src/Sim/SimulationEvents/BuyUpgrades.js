import CalculateGains from '../Calculations/CalculateGains';
import CheckOtherAchiev from '../Calculations/CheckOtherAchiev';
import SimAuraMult from '../ReplacedGameFunctions/SimAuraMult';
import SimEff from '../ReplacedGameFunctions/SimEff';
import SimHas from '../ReplacedGameFunctions/SimHas';
import SimHasGod from '../ReplacedGameFunctions/SimHasGod';
import CopyData from '../SimulationData/CopyData';
import SimWin from '../SimulationData/SimWin';
import {
  SimAchievementsOwned,
  SimCookiesPs,
  SimObjects,
  SimPledges,
  SimUpgrades,
  SimUpgradesOwned, // eslint-disable-line no-unused-vars
} from '../VariablesAndData';

/**
 * This function calculates the cookies per click
 * It is called by CM.Sim.BuyUpgradesBonusIncome() when an upgrades has no bonus-income (and is thus a clicking-upgrade)
 * @returns	{number}	out	The clicking power
 */
function MouseCps() {
  let add = 0;
  if (SimHas('Thousand fingers')) add += 0.1;
  if (SimHas('Million fingers')) add *= 5;
  if (SimHas('Billion fingers')) add *= 10;
  if (SimHas('Trillion fingers')) add *= 20;
  if (SimHas('Quadrillion fingers')) add *= 20;
  if (SimHas('Quintillion fingers')) add *= 20;
  if (SimHas('Sextillion fingers')) add *= 20;
  if (SimHas('Septillion fingers')) add *= 20;
  if (SimHas('Octillion fingers')) add *= 20;
  if (SimHas('Nonillion fingers')) add *= 20;
  let num = 0;
  Object.keys(SimObjects).forEach((i) => {
    num += SimObjects[i].amount;
  });
  num -= SimObjects.Cursor.amount;
  add *= num;

  // Can use SimCookiesPs as function is always called after CM.Sim.CalculateGains()
  if (SimHas('Plastic mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Iron mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Titanium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Adamantium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Unobtainium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Eludium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Wishalloy mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Fantasteel mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Nevercrack mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Armythril mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Technobsidian mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Plasmarble mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Miraculite mouse')) add += SimCookiesPs * 0.01;

  if (SimHas('Fortune #104')) add += SimCookiesPs * 0.01;

  let mult = 1;
  if (SimHas("Santa's helpers")) mult *= 1.1;
  if (SimHas('Cookie egg')) mult *= 1.1;
  if (SimHas('Halo gloves')) mult *= 1.1;
  if (SimHas('Dragon claw')) mult *= 1.03;

  if (SimHas('Aura gloves')) {
    mult *= 1 + 0.05 * Math.min(Game.Objects.Cursor.level, SimHas('Luminous gloves') ? 20 : 10);
  }

  mult *= SimEff('click');
  if (SimObjects.Temple.minigameLoaded) {
    if (SimHasGod) {
      const godLvl = SimHasGod('labor');
      if (godLvl === 1) mult *= 1.15;
      else if (godLvl === 2) mult *= 1.1;
      else if (godLvl === 3) mult *= 1.05;
    }
  }

  Object.keys(Game.buffs).forEach((i) => {
    if (typeof Game.buffs[i].multClick !== 'undefined') mult *= Game.buffs[i].multClick;
  });

  // if (CM.Sim.auraMult('Dragon Cursor')) mult*=1.05;
  mult *= 1 + SimAuraMult('Dragon Cursor') * 0.05;

  // No need to make this function a CM function
  let out =
    mult *
    Game.ComputeCps(
      1,
      SimHas('Reinforced index finger') +
        SimHas('Carpal tunnel prevention cream') +
        SimHas('Ambidextrous'),
      add,
    );

  out = Game.runModHookOnValue('cookiesPerClick', out);

  if (Game.hasBuff('Cursed finger')) out = Game.buffs['Cursed finger'].power;

  return out;
}

/**
 * This function calculates the bonus income of buying a building
 * It is called by CM.Cache.CacheBuildingIncome()
 * @param	{string}				building	The name of the upgrade to be bought
 * @returns {[{number, number}]}				The bonus income of the upgrade and the difference in MouseCPS
 */
export default function BuyUpgradesBonusIncome(upgrade) {
  if (
    Game.Upgrades[upgrade].pool === 'toggle' ||
    (Game.Upgrades[upgrade].bought === 0 &&
      Game.Upgrades[upgrade].unlocked &&
      Game.Upgrades[upgrade].pool !== 'prestige')
  ) {
    CopyData();
    if (SimUpgrades[upgrade].name === 'Shimmering veil [on]') {
      SimUpgrades['Shimmering veil [off]'].bought = 0;
    } else if (SimUpgrades[upgrade].name === 'Golden switch [on]') {
      SimUpgrades['Golden switch [off]'].bought = 0;
    } else {
      SimUpgrades[upgrade].bought = (SimUpgrades[upgrade].bought + 1) % 2;
    }
    if (Game.CountsAsUpgradeOwned(Game.Upgrades[upgrade].pool)) SimUpgradesOwned += 1;

    if (upgrade === 'Elder Pledge') {
      SimPledges += 1;
      if (SimPledges > 0) SimWin('Elder nap');
      if (SimPledges >= 5) SimWin('Elder slumber');
    } else if (upgrade === 'Elder Covenant') {
      SimWin('Elder calm');
    } else if (upgrade === 'Prism heart biscuits') {
      SimWin('Lovely cookies');
    } else if (upgrade === 'Heavenly key') {
      SimWin('Wholesome');
    }

    const lastAchievementsOwned = SimAchievementsOwned;

    CalculateGains();

    CheckOtherAchiev();

    if (lastAchievementsOwned !== SimAchievementsOwned) {
      CalculateGains();
    }

    const diffMouseCPS = MouseCps() - Game.computedMouseCps;
    if (diffMouseCPS) {
      return [SimCookiesPs - Game.cookiesPs, diffMouseCPS];
    }
    return [SimCookiesPs - Game.cookiesPs];
  }
  return [];
}
