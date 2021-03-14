import { CMOptions } from '../../Config/VariablesAndData';
import UpdateBuildings from '../BuildingsUpgrades/Buildings';
import {
	ColorBackPre, ColorBorderPre, Colors, ColorTextPre,
} from '../VariablesAndData';

/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Options.Colors
 */
export default function UpdateColors() {
	let str = '';
	for (let i = 0; i < Colors.length; i++) {
		str += `.${ColorTextPre}${Colors[i]} { color: ${CMOptions.Colors[Colors[i]]}; }\n`;
	}
	for (let i = 0; i < Colors.length; i++) {
		str += `.${ColorBackPre}${Colors[i]} { background-color: ${CMOptions.Colors[Colors[i]]}; }\n`;
	}
	for (let i = 0; i < Colors.length; i++) {
		str += `.${ColorBorderPre}${Colors[i]} { border: 1px solid ${CMOptions.Colors[Colors[i]]}; }\n`;
	}
	l('CMCSS').textContent = str;
	UpdateBuildings(); // Class has been already set
}
