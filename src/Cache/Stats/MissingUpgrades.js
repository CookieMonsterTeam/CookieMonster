import { crateMissing } from '../../Disp/MenuSections/Statistics/CreateMissingUpgrades';
import {
  CacheMissingUpgrades, // eslint-disable-line no-unused-vars
  CacheMissingUpgradesCookies, // eslint-disable-line no-unused-vars
  CacheMissingUpgradesPrestige, // eslint-disable-line no-unused-vars
} from '../VariablesAndData';

/**
 * This functions caches variables related to missing upgrades
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{string}	CM.Cache.MissingUpgrades			String containig the HTML to create the "crates" for missing normal upgrades
 * @global	{string}	CM.Cache.MissingUpgradesCookies		String containig the HTML to create the "crates" for missing cookie upgrades
 * @global	{string}	CM.Cache.MissingUpgradesPrestige	String containig the HTML to create the "crates" for missing prestige upgrades
 */
export default function CacheAllMissingUpgrades() {
  CacheMissingUpgrades = '';
  CacheMissingUpgradesCookies = '';
  CacheMissingUpgradesPrestige = '';
  const list = [];
  // sort the upgrades
  Object.keys(Game.Upgrades).forEach((i) => {
    list.push(Game.Upgrades[i]);
  });
  const sortMap = function (a, b) {
    if (a.order > b.order) return 1;
    if (a.order < b.order) return -1;
    return 0;
  };
  list.sort(sortMap);

  Object.keys(list).forEach((i) => {
    const me = list[i];

    if (me.bought === 0) {
      let str = '';

      str += crateMissing(me);
      /* eslint-disable no-unused-vars */
      if (me.pool === 'prestige') CacheMissingUpgradesPrestige += str;
      else if (me.pool === 'cookie') CacheMissingUpgradesCookies += str;
      else if (me.pool !== 'toggle' && me.pool !== 'unused' && me.pool !== 'debug')
        CacheMissingUpgrades += str;
      /* eslint-enable no-unused-vars */
    }
  });
}
