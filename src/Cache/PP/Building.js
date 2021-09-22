import GetWrinkConfigBank from '../../Disp/HelperFunctions/GetWrinkConfigBank';
import { ColourGray } from '../../Disp/VariablesAndData';
import BuildingGetPrice from '../../Sim/SimulationEvents/BuyBuilding';
import FillCMDCache from '../FillCMDCache';
import {
  CacheMinPP,
  CacheMinPPBulk,
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
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPRigidelMode &&
      amount === 1
    ) {
      target[i].colour = ColourGray; // eslint-disable-line no-param-reassign
      return;
    }
    // eslint-disable-next-line no-param-reassign
    target[i].colour = ColourOfPP(
      target[i],
      BuildingGetPrice(
        i,
        Game.Objects[i].basePrice,
        Game.Objects[i].amount,
        Game.Objects[i].free,
        amount,
      ),
    );
    // Colour based on excluding certain top-buildings
    for (
      let j = 0;
      j < Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop;
      j++
    ) {
      if (target[i].pp === CachePPArray[j][0]) target[i].colour = ColourGray; // eslint-disable-line no-param-reassign
    }
  });
}

function CachePP(target, amount) {
  Object.keys(target).forEach((i) => {
    const price = BuildingGetPrice(
      i,
      Game.Objects[i].basePrice,
      Game.Objects[i].amount,
      Game.Objects[i].free,
      amount,
    );
    if (Game.cookiesPs) {
      target[i].pp = // eslint-disable-line no-param-reassign
        Math.max(price - (Game.cookies + GetWrinkConfigBank()), 0) / Game.cookiesPs +
        price / target[i].bonus;
    } else target[i].pp = price / target[i].bonus; // eslint-disable-line no-param-reassign
    if (
      !(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPRigidelMode &&
        amount === 1
      )
    )
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
  if (
    typeof Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop ===
    'undefined'
  )
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop = 0; // Otherwise breaks during initialization

  // Calculate PP and colours
  CachePP(CacheObjects1, 1);
  CachePP(CacheObjects10, 10);
  CachePP(CacheObjects100, 100);

  // Set CM.Cache.min to best non-excluded buidliung
  CachePPArray.sort((a, b) => a[0] - b[0]);
  let indexOfMin = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPOnlyConsiderBuyable) {
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

  FillCMDCache({ CacheMinPP, CacheMinPPBulk, CachePPArray });
}
