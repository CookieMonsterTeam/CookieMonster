import { CMOptions } from '../../Config/VariablesAndData';
import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank';
import { ColourGray } from '../../Disp/VariablesAndData';
import {
  CacheMinPP, // eslint-disable-line no-unused-vars
  CacheMinPPBulk, // eslint-disable-line no-unused-vars
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
function CacheColour(target, amount) {
  Object.keys(target).forEach((i) => {
    if (CMOptions.PPRigidelMode && amount === 1) {
      target[i].color = ColourGray; // eslint-disable-line no-param-reassign
      return;
    }
    // eslint-disable-next-line no-param-reassign
    target[i].color = ColourOfPP(target[i], Game.Objects[i].getSumPrice(amount));
    // Colour based on excluding certain top-buildings
    for (let j = 0; j < CMOptions.PPExcludeTop; j++) {
      if (target[i].pp === CachePPArray[j][0]) target[i].color = ColourGray; // eslint-disable-line no-param-reassign
    }
  });
}

function CachePP(target, amount) {
  Object.keys(target).forEach((i) => {
    const price = Game.Objects[i].getSumPrice(amount);
    if (Game.cookiesPs) {
      target[i].pp = // eslint-disable-line no-param-reassign
        Math.max(price - (Game.cookies + GetWrinkConfigBank()), 0) / Game.cookiesPs +
        price / target[i].bonus;
    } else target[i].pp = price / target[i].bonus; // eslint-disable-line no-param-reassign
    if (!(CMOptions.PPRigidelMode && amount === 1))
      CachePPArray.push([target[i].pp, amount, price]);
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
  let indexOfMin = CMOptions.PPExcludeTop;
  if (CMOptions.PPOnlyConsiderBuyable) {
    while (CachePPArray[indexOfMin][2] > Game.cookies) {
      indexOfMin += 1;
      if (CachePPArray.length === indexOfMin + 1) {
        break;
      }
    }
  }
  CacheMinPP = CachePPArray[indexOfMin][0];
  CacheMinPPBulk = CachePPArray[indexOfMin][1];

  CacheColour(CacheObjects1, 1);
  CacheColour(CacheObjects10, 10);
  CacheColour(CacheObjects100, 100);
}
