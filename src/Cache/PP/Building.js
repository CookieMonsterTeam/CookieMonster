/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { CMOptions } from '../../Config/VariablesAndData';
import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank';
import { ColorGray } from '../../Disp/VariablesAndData';
import {
  CacheMinPP,
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
  CachePPArray,
} from '../VariablesAndData';
import ColourOfPP from './ColourOfPP';

/**
 * This functions caches the buildings of bulk-buy mode when PP is compared against optimal single-purchase building
 * It saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CacheBuildingsPP()
 */
function CacheColor(target, amount) {
  Object.keys(target).forEach((i) => {
    target[i].color = ColourOfPP(
      target[i],
      Game.Objects[i].getSumPrice(amount),
    );
    // Colour based on excluding certain top-buildings
    for (let j = 0; j < CMOptions.PPExcludeTop; j++) {
      if (target[i].pp === CachePPArray[j][0]) target[i].color = ColorGray;
    }
  });
}

function CachePP(target, amount) {
  Object.keys(target).forEach((i) => {
    const price = Game.Objects[i].getSumPrice(amount);
    if (Game.cookiesPs) {
      target[i].pp =
        Math.max(price - (Game.cookies + GetWrinkConfigBank()), 0) /
          Game.cookiesPs +
        price / target[i].bonus;
    } else target[i].pp = price / target[i].bonus;
    CachePPArray.push([target[i].pp, amount]);
  });
}

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CachePP()
 */
export default function CacheBuildingsPP() {
  CacheMinPP = Infinity;
  CachePPArray = [];
  if (typeof CMOptions.PPExcludeTop === 'undefined') CMOptions.PPExcludeTop = 0; // Otherwise breaks during initialization

  // Calculate PP and colors
  CachePP(CacheObjects1, 1);
  CachePP(CacheObjects10, 10);
  CachePP(CacheObjects100, 100);

  // Set CM.Cache.min to best non-excluded buidliung
  CachePPArray.sort((a, b) => a[0] - b[0]);
  let indexOfMin = 0;
  if (CMOptions.PPOnlyConsiderBuyable) {
    while (CachePPArray[indexOfMin][1] > Game.cookies) {
      if (CachePPArray.length === indexOfMin - 1) {
        break;
      }
      indexOfMin += 1;
    }
  }
  CacheMinPP = CachePPArray[CMOptions.PPExcludeTop][indexOfMin];

  CacheColor(CacheObjects1, 1);
  CacheColor(CacheObjects10, 10);
  CacheColor(CacheObjects100, 100);
}
