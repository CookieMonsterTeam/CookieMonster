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
 * @returns {{string}, {string}}	text, colour		An array containing the text and display-colour of the sugar lump
 */
export default function GetLumpColour(type) {
  if (type === 0) {
    return { text: 'Normal', colour: ColourGray };
  }
  if (type === 1) {
    return { text: 'Bifurcated', colour: ColourGreen };
  }
  if (type === 2) {
    return { text: 'Golden', colour: ColourYellow };
  }
  if (type === 3) {
    return { text: 'Meaty', colour: ColourOrange };
  }
  if (type === 4) {
    return { text: 'Caramelized', colour: ColourPurple };
  }
  return { text: 'Unknown Sugar Lump', colour: ColourRed };
}
