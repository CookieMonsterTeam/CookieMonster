import SimHas from '../ReplacedGameFunctions/SimHas';
import SimHasGod from '../ReplacedGameFunctions/SimHasGod';
import { SimObjects } from '../VariablesAndData';

/**
 * This function constructs an object with the static properties of an upgrade
 * @param	{string}	upgradeName		Name of the Upgrade
 * @returns {Object}	you				The static object
 */
export default function InitUpgrade(upgradeName) {
  const me = Game.Upgrades[upgradeName];
  const you = {};
  // Some upgrades have a function for .power (notably the valentine cookies)
  you.power = me.power;
  if (typeof you.power === 'function') {
    if (me.name === 'Sugar crystal cookies') {
      you.power = function () {
        let n = 5;
        Object.keys(SimObjects).forEach((i) => {
          if (SimObjects[i].level >= 10) n += 1;
        });
        return n;
      };
    } else {
      you.power = function () {
        let pow = 2;
        if (SimHas('Starlove')) pow = 3;
        if (Game.hasGod) {
          const godLvl = SimHasGod('seasons');
          if (godLvl === 1) pow *= 1.3;
          else if (godLvl === 2) pow *= 1.2;
          else if (godLvl === 3) pow *= 1.1;
        }
        return pow;
      };
    }
  }
  you.pool = me.pool;
  you.name = me.name;
  return you;
}
