import {
  CacheMinPPBulk,
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
  CacheObjectsNextAchievement,
} from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import BuildingSell from '../../Sim/SimulationEvents/SellBuilding';
import Beautify from '../BeautifyAndFormatting/Beautify';
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

  // Remove colour if applied
  l(`storeBulk1`).style.removeProperty('color');
  l(`storeBulk10`).style.removeProperty('color');
  l(`storeBulk100`).style.removeProperty('color');

  if (Game.buyMode === 1) {
    if (CMOptions.BuildColour === 1) {
      Object.keys(target).forEach((i) => {
        l(`productPrice${Game.Objects[i].id}`).style.color = CMOptions[`Colour${target[i].color}`];
      });
      l(`storeBulk${CacheMinPPBulk}`).style.color = CMOptions.ColourGreen;
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

  // Build array of pointers and sort according to the user's configured sort option.
  // This regulates sorting of buildings.
  let arr;
  if (Game.buyMode !== 1 || !CMOptions.SortBuildings) {
    arr = Object.keys(CacheObjects1).map(k => {
      const o = {};
      o.name = k;
      o.id = Game.Objects[k].id;
      return o;
    });
    // Sort using default order.
    arr.sort((a, b) => a.id - b.id);
  } else if (CMOptions.SortBuildings === 1) {
    arr = Object.keys(CacheObjects1).map(k => {
      const o = {};
      o.name = k;
      o.pp = CacheObjects1[k].pp;
      o.color = CacheObjects1[k].color;
      return o;
    });
    // Sort by pp colour group, then by pp.
    arr.sort((a, b) =>
      ColoursOrdering.indexOf(a.color) === ColoursOrdering.indexOf(b.color)
        ? a.pp - b.pp
        : ColoursOrdering.indexOf(a.color) - ColoursOrdering.indexOf(b.color)
    );
  } else if (CMOptions.SortBuildings === 2) {
    arr = Object.keys(target).map(k => {
      const o = {};
      o.name = k;
      o.pp = target[k].pp;
      o.color = target[k].color;
      return o;
    });
    // Sort by pp colour group, then by pp.
    arr.sort((a, b) =>
      ColoursOrdering.indexOf(a.color) === ColoursOrdering.indexOf(b.color)
        ? a.pp - b.pp
        : ColoursOrdering.indexOf(a.color) - ColoursOrdering.indexOf(b.color)
    );
  } else if (CMOptions.SortBuildings === 3) {
    arr = Object.keys(CacheObjectsNextAchievement).map(k => {
      const o = {};
      o.name = k;
      o.id = Game.Objects[k].id;
      o.amountUntilNext = CacheObjectsNextAchievement[k].AmountNeeded;
      o.priceUntilNext = CacheObjectsNextAchievement[k].price;
      return o;
    });
    // First, sort using default order.
    arr.sort((a, b) => a.id - b.id);
    // Sort by price until next achievement.
    // Buildings that aren't within 100 of an achievement are placed at the end, still in
    // default order relative to each other because sort() is guaranteed stable.
    arr.sort((a, b) =>
      (a.amountUntilNext !== 101 ? a.priceUntilNext : Infinity) -
      (b.amountUntilNext !== 101 ? b.priceUntilNext : Infinity)
    );
  }

  // Use array index (+2) as the grid row number.
  // (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
  for (let x = 0; x < arr.length; x++) {
    Game.Objects[arr[x].name].l.style.gridRow = `${x + 2}/${x + 2}`;
  }
}
