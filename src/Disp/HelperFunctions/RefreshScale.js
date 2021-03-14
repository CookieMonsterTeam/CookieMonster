import UpdateBuildings from '../BuildingsUpgrades/Buildings';
import UpdateUpgrades from '../BuildingsUpgrades/Upgrades';
import { UpdateBotBar } from '../InfoBars/BottomBar';

/**
 * This function refreshes all numbers after a change in scale-setting
 * It is therefore called by a changes in CM.Options.Scale, CM.Options.ScaleDecimals, CM.Options.ScaleSeparator and CM.Options.ScaleCutoff
 */
export default function RefreshScale() {
  BeautifyAll();
  Game.RefreshStore();
  Game.RebuildUpgrades();

  UpdateBotBar();
  UpdateBuildings();
  UpdateUpgrades();
}
