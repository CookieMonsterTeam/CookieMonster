import { CMOptions } from '../../Config/VariablesAndData';
import GetCPS from '../../Disp/HelperFunctions/GetCPS';
import {
  ColorBlue,
  ColorGray,
  ColorGreen,
  ColorOrange,
  ColorPurple,
  ColorRed,
  ColorYellow,
} from '../../Disp/VariablesAndData';
import { CacheMinPP, CachePPArray } from '../VariablesAndData';

/**
 * This functions return the colour assosciated with the given pp value
 * It is called by CM.Cache.CacheBuildingsPP(), CM.Cache.CacheBuildingsBulkPP() and CM.Cache.CacheUpgradePP()
 * @params	{object}	obj		The obj of which the pp value should be checked
 * @params	{number}	price	The price of the object
 * @returns {string}	color	The colour assosciated with the pp value
 */
export default function ColourOfPP(me, price) {
  let color = '';
  // Colour based on PP
  if (me.pp <= 0 || me.pp === Infinity) color = ColorGray;
  else if (me.pp < CacheMinPP) color = ColorBlue;
  else if (me.pp === CacheMinPP) color = ColorGreen;
  else if (me.pp < CachePPArray[10][0]) color = ColorYellow;
  else if (me.pp < CachePPArray[20][0]) color = ColorOrange;
  else if (me.pp > CachePPArray[30][0]) color = ColorRed;
  else color = ColorPurple;

  // Colour based on price in terms of CPS
  if (Number(CMOptions.PPSecondsLowerLimit) !== 0) {
    if (price / GetCPS() < Number(CMOptions.PPSecondsLowerLimit))
      color = ColorBlue;
  }
  // Colour based on being able to purchase
  if (CMOptions.PPOnlyConsiderBuyable) {
    if (price - Game.cookies > 0) color = ColorRed;
  }
  return color;
}
