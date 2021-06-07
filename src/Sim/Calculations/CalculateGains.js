import GetCPSBuffMult from '../../Cache/CPS/GetCPSBuffMult';
import { CacheCentEgg } from '../../Cache/VariablesAndData';
import { CenturyDateAtBeginLoop, CycliusDateAtBeginLoop } from '../../Main/VariablesAndData';
import SimAuraMult from '../ReplacedGameFunctions/SimAuraMult';
import SimEff from '../ReplacedGameFunctions/SimEff';
import SimGetHeavenlyMultiplier from '../ReplacedGameFunctions/SimGetHeavenlyMultiplier';
import SimHas from '../ReplacedGameFunctions/SimHas';
import SimHasGod from '../ReplacedGameFunctions/SimHasGod';
import SimWin from '../SimulationData/SimWin';
import {
  SimAchievementsOwned,
  SimCookiesPs,
  SimCookiesPsRaw, // eslint-disable-line no-unused-vars
  SimEffs, // eslint-disable-line no-unused-vars
  SimHeavenlyPower,
  SimObjects,
  SimPrestige,
  SimUpgrades,
} from '../VariablesAndData';

/**
 * This function calculates the CPS of the current "sim data"
 * It is similar to Game.CalculateGains()
 * It is called at the start of any function that simulates certain behaviour or actions
 * @global	{number}	CM.Sim.cookiesPs	The CPS of the current sim data
 */
export default function CalculateGains() {
  SimCookiesPs = 0;
  let mult = 1;
  // Include minigame effects
  const effs = {};
  Object.keys(Game.Objects).forEach((i) => {
    if (Game.Objects[i].minigameLoaded && Game.Objects[i].minigame.effs) {
      const myEffs = Game.Objects[i].minigame.effs;
      Object.keys(myEffs).forEach((ii) => {
        if (effs[ii]) effs[ii] *= myEffs[ii];
        else effs[ii] = myEffs[ii];
      });
    }
  });
  SimEffs = effs;

  if (Game.ascensionMode !== 1)
    mult += parseFloat(SimPrestige) * 0.01 * SimHeavenlyPower * SimGetHeavenlyMultiplier();

  mult *= SimEff('cps');

  if (SimHas('Heralds') && Game.ascensionMode !== 1) mult *= 1 + 0.01 * Game.heralds;

  Object.keys(Game.cookieUpgrades).forEach((i) => {
    const me = Game.cookieUpgrades[i];
    if (SimHas(me.name)) {
      // Some upgrades have a functio as .power (notably the valentine cookies)
      // CM.Sim.InitialBuildingData has changed to use CM.Sim.Has instead of Game.Has etc.
      // Therefore this call is to the .power of the Sim.Object
      if (typeof me.power === 'function') {
        mult *= 1 + SimUpgrades[me.name].power(SimUpgrades[me.name]) * 0.01;
      } else mult *= 1 + me.power * 0.01;
    }
  });

  if (SimHas('Specialized chocolate chips')) mult *= 1.01;
  if (SimHas('Designer cocoa beans')) mult *= 1.02;
  if (SimHas('Underworld ovens')) mult *= 1.03;
  if (SimHas('Exotic nuts')) mult *= 1.04;
  if (SimHas('Arcane sugar')) mult *= 1.05;

  if (SimHas('Increased merriness')) mult *= 1.15;
  if (SimHas('Improved jolliness')) mult *= 1.15;
  if (SimHas('A lump of coal')) mult *= 1.01;
  if (SimHas('An itchy sweater')) mult *= 1.01;
  if (SimHas("Santa's dominion")) mult *= 1.2;

  if (SimHas('Fortune #100')) mult *= 1.01;
  if (SimHas('Fortune #101')) mult *= 1.07;

  if (SimHas('Dragon scale')) mult *= 1.03;

  // Check effect of chosen Gods
  let buildMult = 1;
  if (SimHasGod) {
    let godLvl = SimHasGod('asceticism');
    if (godLvl === 1) mult *= 1.15;
    else if (godLvl === 2) mult *= 1.1;
    else if (godLvl === 3) mult *= 1.05;

    godLvl = SimHasGod('ages');
    if (godLvl === 1)
      mult *= 1 + 0.15 * Math.sin((CycliusDateAtBeginLoop / 1000 / (60 * 60 * 3)) * Math.PI * 2);
    else if (godLvl === 2)
      mult *= 1 + 0.15 * Math.sin((CycliusDateAtBeginLoop / 1000 / (60 * 60 * 12)) * Math.PI * 2);
    else if (godLvl === 3)
      mult *= 1 + 0.15 * Math.sin((CycliusDateAtBeginLoop / 1000 / (60 * 60 * 24)) * Math.PI * 2);

    godLvl = SimHasGod('decadence');
    if (godLvl === 1) buildMult *= 0.93;
    else if (godLvl === 2) buildMult *= 0.95;
    else if (godLvl === 3) buildMult *= 0.98;

    godLvl = SimHasGod('industry');
    if (godLvl === 1) buildMult *= 1.1;
    else if (godLvl === 2) buildMult *= 1.06;
    else if (godLvl === 3) buildMult *= 1.03;

    godLvl = SimHasGod('labor');
    if (godLvl === 1) buildMult *= 0.97;
    else if (godLvl === 2) buildMult *= 0.98;
    else if (godLvl === 3) buildMult *= 0.99;
  }

  if (SimHas("Santa's legacy")) mult *= 1 + (Game.santaLevel + 1) * 0.03;

  const milkProgress = SimAchievementsOwned / 25;
  let milkMult = 1;
  if (SimHas("Santa's milk and cookies")) milkMult *= 1.05;
  // if (CM.Sim.hasAura('Breath of Milk')) milkMult *= 1.05;
  milkMult *= 1 + SimAuraMult('Breath of Milk') * 0.05;
  if (SimHasGod) {
    const godLvl = SimHasGod('mother');
    if (godLvl === 1) milkMult *= 1.1;
    else if (godLvl === 2) milkMult *= 1.05;
    else if (godLvl === 3) milkMult *= 1.03;
  }
  milkMult *= SimEff('milk');

  let catMult = 1;

  if (SimHas('Kitten helpers')) catMult *= 1 + milkProgress * 0.1 * milkMult;
  if (SimHas('Kitten workers')) catMult *= 1 + milkProgress * 0.125 * milkMult;
  if (SimHas('Kitten engineers')) catMult *= 1 + milkProgress * 0.15 * milkMult;
  if (SimHas('Kitten overseers')) catMult *= 1 + milkProgress * 0.175 * milkMult;
  if (SimHas('Kitten managers')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten accountants')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten specialists')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten experts')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten consultants')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten assistants to the regional manager'))
    catMult *= 1 + milkProgress * 0.175 * milkMult;
  if (SimHas('Kitten marketeers')) catMult *= 1 + milkProgress * 0.15 * milkMult;
  if (SimHas('Kitten analysts')) catMult *= 1 + milkProgress * 0.125 * milkMult;
  if (SimHas('Kitten executives')) catMult *= 1 + milkProgress * 0.115 * milkMult;
  if (SimHas('Kitten angels')) catMult *= 1 + milkProgress * 0.1 * milkMult;
  if (SimHas('Fortune #103')) catMult *= 1 + milkProgress * 0.05 * milkMult;

  Object.keys(SimObjects).forEach((i) => {
    const me = SimObjects[i];
    let storedCps = me.cps(me);
    if (Game.ascensionMode !== 1) storedCps *= (1 + me.level * 0.01) * buildMult;
    if (me.name === 'Grandma' && SimHas('Milkhelp&reg; lactose intolerance relief tablets'))
      storedCps *= 1 + 0.05 * milkProgress * milkMult;
    SimCookiesPs += me.amount * storedCps;
  });

  if (SimHas('"egg"')) SimCookiesPs += 9; // "egg"

  mult *= catMult;

  let eggMult = 1;
  if (SimHas('Chicken egg')) eggMult *= 1.01;
  if (SimHas('Duck egg')) eggMult *= 1.01;
  if (SimHas('Turkey egg')) eggMult *= 1.01;
  if (SimHas('Quail egg')) eggMult *= 1.01;
  if (SimHas('Robin egg')) eggMult *= 1.01;
  if (SimHas('Ostrich egg')) eggMult *= 1.01;
  if (SimHas('Cassowary egg')) eggMult *= 1.01;
  if (SimHas('Salmon roe')) eggMult *= 1.01;
  if (SimHas('Frogspawn')) eggMult *= 1.01;
  if (SimHas('Shark egg')) eggMult *= 1.01;
  if (SimHas('Turtle egg')) eggMult *= 1.01;
  if (SimHas('Ant larva')) eggMult *= 1.01;
  if (SimHas('Century egg')) {
    // The boost increases a little every day, with diminishing returns up to +10% on the 100th day
    let day =
      (Math.floor((CenturyDateAtBeginLoop - Game.startDate) / 1000 / 10) * 10) / 60 / 60 / 24;
    day = Math.min(day, 100);
    // Sets a Cache value to be displayed in the Stats page, could be moved...
    CacheCentEgg = 1 + (1 - (1 - day / 100) ** 3) * 0.1;
    eggMult *= CacheCentEgg;
  }
  mult *= eggMult;

  if (SimHas('Sugar baking')) mult *= 1 + Math.min(100, Game.lumps) * 0.01;

  // if (CM.Sim.hasAura('Radiant Appetite')) mult *= 2;
  mult *= 1 + SimAuraMult('Radiant Appetite');

  const rawCookiesPs = SimCookiesPs * mult;
  Object.keys(Game.CpsAchievements).forEach((i) => {
    if (rawCookiesPs >= Game.CpsAchievements[i].threshold) SimWin(Game.CpsAchievements[i].name);
  });

  SimCookiesPsRaw = rawCookiesPs;

  const { n } = Game.shimmerTypes.golden;
  const auraMult = SimAuraMult("Dragon's Fortune");
  for (let i = 0; i < n; i++) {
    mult *= 1 + auraMult * 1.23;
  }

  const name = Game.bakeryName.toLowerCase();
  if (name === 'orteil') mult *= 0.99;
  else if (name === 'ortiel') mult *= 0.98;

  if (SimHas('Elder Covenant')) mult *= 0.95;

  if (SimHas('Golden switch [off]')) {
    let goldenSwitchMult = 1.5;
    if (SimHas('Residual luck')) {
      const upgrades = Game.goldenCookieUpgrades;
      Object.keys(upgrades).forEach((i) => {
        if (SimHas(upgrades[i])) goldenSwitchMult += 0.1;
      });
    }
    mult *= goldenSwitchMult;
  }
  if (SimHas('Shimmering veil [off]')) {
    let veilMult = 0.5;
    if (SimHas('Reinforced membrane')) veilMult += 0.1;
    mult *= 1 + veilMult;
  }

  if (SimHas('Magic shenanigans')) mult *= 1000;
  if (SimHas('Occult obstruction')) mult *= 0;

  SimCookiesPs = Game.runModHookOnValue('cps', SimCookiesPs);

  mult *= GetCPSBuffMult();

  SimCookiesPs *= mult;

  // if (Game.hasBuff('Cursed finger')) Game.cookiesPs = 0;
}
