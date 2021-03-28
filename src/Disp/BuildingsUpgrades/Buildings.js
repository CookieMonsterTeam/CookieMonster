/* eslint-disable no-nested-ternary */
import {
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
} from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import BuildingSell from '../../Sim/SimulationEvents/SellBuilding';
import { Beautify } from '../BeautifyAndFormatting/BeautifyFormatting';
import { ColoursOrdering, LastTargetBuildings } from '../VariablesAndData';

/**
 * Section: Functions related to right column of the screen (buildings/upgrades)

/**
 * This function adjusts some things in the column of buildings.
 * It colours them, helps display the correct sell-price and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.UpdateColours() & CM.Disp.RefreshScale()
 * And by changes in CM.Options.BuildColour, CM.Options.SortBuild & CM.Data.Config.BulkBuildColour
 */
export default function UpdateBuildings() {
  let target = Game.buyBulk;
  if (Game.buyMode === 1) {
    LastTargetBuildings = target;
  } else {
    target = LastTargetBuildings;
  }
  if (target === 1) target = CacheObjects1;
  else if (target === 10) target = CacheObjects10;
  else if (target === 100) target = CacheObjects100;

  if (Game.buyMode === 1) {
    if (CMOptions.BuildColour === 1) {
      Object.keys(target).forEach((i) => {
        l(`productPrice${Game.Objects[i].id}`).style.color =
          CMOptions[`Colour${target[i].color}`];
      });
    } else {
      Object.keys(Game.Objects).forEach((i) => {
        l(`productPrice${Game.Objects[i].id}`).style.removeProperty('color');
      });
    }
  } else if (Game.buyMode === -1) {
    Object.keys(CacheObjects1).forEach((i) => {
      const o = Game.Objects[i];
      l(`productPrice${o.id}`).style.color = '';
      /*
       * Fix sell price displayed in the object in the store.
       *
       * The buildings sell price displayed by the game itself (without any mod) is incorrect.
       * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
       *
       * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
       */
      l(`productPrice${o.id}`).innerHTML = Beautify(
        BuildingSell(o, o.basePrice, o.amount, o.free, Game.buyBulk, 1),
      );
    });
  }

  // Build array of pointers, sort by pp, use array index (+2) as the grid row number
  // (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
  // This regulates sorting of buildings
  if (Game.buyMode === 1 && CMOptions.SortBuildings) {
    let arr;
    if (CMOptions.SortBuildings === 1) {
      arr = Object.keys(CacheObjects1).map((k) => {
        const o = CacheObjects1[k];
        o.name = k;
        o.id = Game.Objects[k].id;
        return o;
      });

      arr.sort(function (a, b) {
        return ColoursOrdering.indexOf(a.color) >
          ColoursOrdering.indexOf(b.color)
          ? 1
          : ColoursOrdering.indexOf(a.color) < ColoursOrdering.indexOf(b.color)
          ? -1
          : a.pp < b.pp
          ? -1
          : 0;
      });
    } else if (CMOptions.SortBuildings === 2) {
      arr = Object.keys(target).map((k) => {
        const o = target[k];
        o.name = k;
        o.id = Game.Objects[k].id;
        return o;
      });

      arr.sort(function (a, b) {
        return ColoursOrdering.indexOf(a.color) >
          ColoursOrdering.indexOf(b.color)
          ? 1
          : ColoursOrdering.indexOf(a.color) < ColoursOrdering.indexOf(b.color)
          ? -1
          : a.pp < b.pp
          ? -1
          : 0;
      });
    }

    for (let x = 0; x < arr.length; x++) {
      Game.Objects[arr[x].name].l.style.gridRow = `${x + 2}/${x + 2}`;
    }
  } else {
    const arr = Object.keys(CacheObjects1).map((k) => {
      const o = CacheObjects1[k];
      o.name = k;
      o.id = Game.Objects[k].id;
      return o;
    });
    arr.sort((a, b) => a.id - b.id);
    for (let x = 0; x < arr.length; x++) {
      Game.Objects[arr[x].name].l.style.gridRow = `${x + 2}/${x + 2}`;
    }
  }
}
