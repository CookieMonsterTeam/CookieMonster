import {
	ColorGray, ColorGreen, ColorOrange, ColorPurple, ColorRed, ColorYellow,
} from '../VariablesAndData';

/**
 * This function returns Name and Color as object for sugar lump type that is given as input param.
 * It is called by CM.Disp.UpdateTooltipSugarLump()
 * @param 	{string} 				type 			Sugar Lump Type.
 * @returns {{string}, {string}}	text, color		An array containing the text and display-color of the sugar lump
 */
export default function GetLumpColor(type) {
	if (type === 0) {
		return { text: 'Normal', color: ColorGray };
	} if (type === 1) {
		return { text: 'Bifurcated', color: ColorGreen };
	} if (type === 2) {
		return { text: 'Golden', color: ColorYellow };
	} if (type === 3) {
		return { text: 'Meaty', color: ColorOrange };
	} if (type === 4) {
		return { text: 'Caramelized', color: ColorPurple };
	}
	return { text: 'Unknown Sugar Lump', color: ColorRed };
}
