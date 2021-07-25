import GetCPS from '../../Disp/HelperFunctions/GetCPS';
import {
  ColourBlue,
  ColourGray,
  ColourGreen,
  ColourOrange,
  ColourPurple,
  ColourRed,
  ColourYellow,
} from '../../Disp/VariablesAndData';
import { CacheMinPP, CachePPArray } from '../VariablesAndData';

/**
 * This functions return the colour assosciated with the given pp value
 * It is called by CM.Cache.CacheBuildingsPP(), CM.Cache.CacheBuildingsBulkPP() and CM.Cache.CacheUpgradePP()
 * @params	{object}	obj		The obj of which the pp value should be checked
 * @params	{number}	price	The price of the object
 * @returns {string}	colour	The colour assosciated with the pp value
 */
export default function ColourOfPP(me, price) {
  let colour = '';
  // Colour based on PP
  if (me.pp <= 0 || me.pp === Infinity) colour = ColourGray;
  else if (me.pp < CacheMinPP) colour = ColourBlue;
  else if (me.pp === CacheMinPP) colour = ColourGreen;
  else if (me.pp < CachePPArray[10][0]) colour = ColourYellow;
  else if (me.pp < CachePPArray[20][0]) colour = ColourOrange;
  else if (me.pp < CachePPArray[30][0]) colour = ColourRed;
  else colour = ColourPurple;

  // Colour based on price in terms of CPS
  if (
    Number(
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPSecondsLowerLimit,
    ) !== 0
  ) {
    if (
      price / GetCPS() <
      Number(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPSecondsLowerLimit,
      )
    )
      colour = ColourBlue;
  }
  // Colour based on being able to purchase
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPOnlyConsiderBuyable) {
    if (price - Game.cookies > 0) colour = ColourRed;
  }
  return colour;
}
