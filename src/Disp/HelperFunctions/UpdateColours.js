import { CMOptions } from '../../Config/VariablesAndData';
import UpdateBuildings from '../BuildingsUpgrades/Buildings';
import {
  ColourBackPre,
  ColourBorderPre,
  Colours,
  ColourTextPre,
} from '../VariablesAndData';

/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Options.Colours
 */
export default function UpdateColours() {
  let str = '';
  for (let i = 0; i < Colours.length; i++) {
    str += `.${ColourTextPre}${Colours[i]} { color: ${
      CMOptions.Colours[Colours[i]]
    }; }\n`;
  }
  for (let i = 0; i < Colours.length; i++) {
    str += `.${ColourBackPre}${Colours[i]} { background-color: ${
      CMOptions.Colours[Colours[i]]
    }; }\n`;
  }
  for (let i = 0; i < Colours.length; i++) {
    str += `.${ColourBorderPre}${Colours[i]} { border: 1px solid ${
      CMOptions.Colours[Colours[i]]
    }; }\n`;
  }
  l('CMCSS').textContent = str;
  UpdateBuildings(); // Class has been already set
}
