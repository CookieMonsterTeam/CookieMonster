import SimAuraMult from '../ReplacedGameFunctions/SimAuraMult';
import SimEff from '../ReplacedGameFunctions/SimEff';
import SimGetTieredCpsMult from '../ReplacedGameFunctions/SimGetTieredCpsMult';
import SimHas from '../ReplacedGameFunctions/SimHas';
import { SimObjects } from '../VariablesAndData';

/**
 * This function constructs an object with the static properties of a building,
 * but with a 'cps' method changed to check sim data
 *
 * @param	{string}	buildingName	Name of the building
 * @returns {Object}	you				The static object
 */
export default function InitialBuildingData(buildingName) {
  const me = Game.Objects[buildingName];
  const you = {};
  if (me.name === 'Cursor') {
    you.cps = function (it) {
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
      let mult = 1;
      let num = 0;
      Object.keys(SimObjects).forEach((i) => {
        if (SimObjects[i].name !== 'Cursor') num += SimObjects[i].amount;
      });
      add *= num;
      mult *= SimGetTieredCpsMult(it);
      mult *= Game.magicCpS('Cursor');
      mult *= SimEff('cursorCps');
      return (
        Game.ComputeCps(
          0.1,
          SimHas('Reinforced index finger') +
            SimHas('Carpal tunnel prevention cream') +
            SimHas('Ambidextrous'),
          add,
        ) * mult
      );
    };
  } else if (me.name === 'Grandma') {
    you.cps = function (it) {
      let mult = 1;
      Object.keys(Game.GrandmaSynergies).forEach((i) => {
        if (SimHas(Game.GrandmaSynergies[i])) mult *= 2;
      });
      if (SimHas('Bingo center/Research facility')) mult *= 4;
      if (SimHas('Ritual rolling pins')) mult *= 2;
      if (SimHas('Naughty list')) mult *= 2;

      if (SimHas('Elderwort biscuits')) mult *= 1.02;

      mult *= SimEff('grandmaCps');

      if (SimHas('Cat ladies')) {
        for (let i = 0; i < Game.UpgradesByPool.kitten.length; i++) {
          if (SimHas(Game.UpgradesByPool.kitten[i].name)) mult *= 1.29;
        }
      }

      mult *= SimGetTieredCpsMult(it);

      let add = 0;
      if (SimHas('One mind')) add += SimObjects.Grandma.amount * 0.02;
      if (SimHas('Communal brainsweep')) add += SimObjects.Grandma.amount * 0.02;
      if (SimHas('Elder Pact')) add += SimObjects.Portal.amount * 0.05;

      let num = 0;
      Object.keys(SimObjects).forEach((i) => {
        if (SimObjects[i].name !== 'Grandma') num += SimObjects[i].amount;
      });
      // if (Game.hasAura('Elder Battalion')) mult*=1+0.01*num;
      mult *= 1 + SimAuraMult('Elder Battalion') * 0.01 * num;

      mult *= Game.magicCpS(me.name);

      return (me.baseCps + add) * mult;
    };
  } else {
    you.cps = function (it) {
      let mult = 1;
      mult *= SimGetTieredCpsMult(it);
      mult *= Game.magicCpS(it.name);
      return it.baseCPS * mult;
    };
  }

  // Below is needed for above eval, specifically for the GetTieredCpsMult function
  you.baseCps = me.baseCps;
  you.name = me.name;
  you.tieredUpgrades = me.tieredUpgrades;
  you.synergies = me.synergies;
  you.fortune = me.fortune;
  you.grandma = me.grandma;
  you.baseCPS = me.baseCps;
  you.id = me.id;
  you.vanilla = me.vanilla;
  return you;
}
