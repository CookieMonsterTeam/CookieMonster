import UpdateBuildings from '../BuildingsUpgrades/Buildings';
import {
  ColourBackPre,
  ColourBorderPre,
  ColoursOrdering,
  ColourTextPre,
} from '../VariablesAndData';

/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Options.Colours
 */
export default function UpdateColours() {
  let str = '';
  for (let i = 0; i < ColoursOrdering.length; i++) {
    str += `.${ColourTextPre}${ColoursOrdering[i]} { color: ${
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
        `Colour${ColoursOrdering[i]}`
      ]
    }; }\n`;
  }
  for (let i = 0; i < ColoursOrdering.length; i++) {
    str += `.${ColourBackPre}${ColoursOrdering[i]} { background-color: ${
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
        `Colour${ColoursOrdering[i]}`
      ]
    }; }\n`;
  }
  for (let i = 0; i < ColoursOrdering.length; i++) {
    str += `.${ColourBorderPre}${ColoursOrdering[i]} { border: 1px solid ${
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
        `Colour${ColoursOrdering[i]}`
      ]
    }; }\n`;
  }
  l('CMCSS').textContent = str;
  UpdateBuildings(); // Class has been already set
}
