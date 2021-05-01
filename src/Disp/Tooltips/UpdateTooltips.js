import CopyData from '../../Sim/SimulationData/CopyData';
import { TooltipName, TooltipType } from '../VariablesAndData';
import * as Create from './CreateTooltip';
import Building from './TypesOfTooltips/Building';
import GardenPlots from './TypesOfTooltips/GardenPlots';
import Grimoire from './TypesOfTooltips/Grimoire';
import HarvestAll from './TypesOfTooltips/HarvestAll';
import PantheonGods from './TypesOfTooltips/PantheonGods';
import SugarLump from './TypesOfTooltips/SugarLump';
import Upgrade from './TypesOfTooltips/Upgrade';
import Warnings from './TypesOfTooltips/Warnings';
import WrinklerButton from './TypesOfTooltips/WrinklerButton';

/**
 * This function updates the sections of the tooltips created by CookieMonster
 */
export default function UpdateTooltips() {
  CopyData();
  if (l('tooltipAnchor').style.display !== 'none' && l('CMTooltipArea')) {
    l('CMTooltipArea').innerHTML = '';
    const tooltipBox = Create.TooltipCreateTooltipBox();
    l('CMTooltipArea').appendChild(tooltipBox);

    if (TooltipType === 'b') {
      Building();
    } else if (TooltipType === 'u') {
      Upgrade();
    } else if (TooltipType === 's') {
      SugarLump();
    } else if (TooltipType === 'g') {
      Grimoire();
    } else if (TooltipType === 'p') {
      GardenPlots();
    } else if (TooltipType === 'ha') {
      HarvestAll();
    } else if (TooltipType === 'wb') {
      WrinklerButton();
    } else if (TooltipType === 'pag' || (TooltipType === 'pas' && TooltipName[1] !== -1)) {
      PantheonGods();
    }
    Warnings();
  } else if (l('CMTooltipArea') === null) {
    // Remove warnings if its a basic tooltip
    if (l('CMDispTooltipWarningParent') !== null) {
      l('CMDispTooltipWarningParent').remove();
    }
  }
}
