import {
  ColourGray,
  ColourGreen,
  ColourOrange,
  ColourPurple,
  ColourRed,
  ColourYellow,
} from '../VariablesAndData';

/**
 * This function returns Name and Colour as object for sugar lump type that is given as input param.
 * It is called by CM.Disp.UpdateTooltipSugarLump()
 * @param 	{string} 				type 			Sugar Lump Type.
 * @returns {{string}, {string}}	text, color		An array containing the text and display-color of the sugar lump
 */
export default function GetLumpColour(type) {
  if (type === 0) {
    return { text: 'Normal', color: ColourGray };
  }
  if (type === 1) {
    return { text: 'Bifurcated', color: ColourGreen };
  }
  if (type === 2) {
    return { text: 'Golden', color: ColourYellow };
  }
  if (type === 3) {
    return { text: 'Meaty', color: ColourOrange };
  }
  if (type === 4) {
    return { text: 'Caramelized', color: ColourPurple };
  }
  return { text: 'Unknown Sugar Lump', color: ColourRed };
}
