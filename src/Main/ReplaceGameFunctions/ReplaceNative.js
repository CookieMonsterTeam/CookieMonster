import jscolor from '@eastdesire/jscolor';

import CMBeautify from '../../Disp/BeautifyAndFormatting/Beautify';
import FormatTime from '../../Disp/BeautifyAndFormatting/FormatTime';
import { AddAuraInfo, AddDragonLevelUpTooltip } from '../../Disp/Dragon/Dragon';
import AddMenu from '../../Disp/MenuSections/AddMenus';
import UpdateTitle from '../../Disp/TabTitle/TabTitle';
import ReplaceAscendTooltip from '../../Disp/Tooltips/AscendButton';
import UpdateTooltipLocation from '../../Disp/Tooltips/PositionLocation';
import { CMSayTime, Title } from '../../Disp/VariablesAndData'; // eslint-disable-line no-unused-vars
import { SimDoSims } from '../../Sim/VariablesAndData'; // eslint-disable-line no-unused-vars
import ReplaceTooltipUpgrade from '../ReplaceGameElements/TooltipUpgrades';
import {
  BackupFunctions,
  CenturyDateAtBeginLoop, // eslint-disable-line no-unused-vars
  CycliusDateAtBeginLoop, // eslint-disable-line no-unused-vars
} from '../VariablesAndData';
import FixMouseY from './FixMouse';

/**
 * This function replaces certain native (from the base-game) functions
 */
export default function ReplaceNative() {
  // eslint-disable-next-line no-undef
  BackupFunctions.Beautify = Beautify;
  // eslint-disable-next-line no-undef
  Beautify = CMBeautify;

  BackupFunctions.CalculateGains = Game.CalculateGains;
  Game.CalculateGains = function () {
    BackupFunctions.CalculateGains();
    SimDoSims = 1;
    CycliusDateAtBeginLoop = Date.now();
    CenturyDateAtBeginLoop = Date.now();
  };

  BackupFunctions.tooltip = {};
  BackupFunctions.tooltip.draw = Game.tooltip.draw;
  BackupFunctions.tooltip.drawMod = new Function( // eslint-disable-line no-new-func
    `return ${Game.tooltip.draw.toString().split('this').join('Game.tooltip')}`,
  )();
  Game.tooltip.draw = function (from, text, origin) {
    BackupFunctions.tooltip.drawMod(from, text, origin);
  };

  BackupFunctions.tooltip.update = Game.tooltip.update;
  BackupFunctions.tooltip.updateMod = new Function( // eslint-disable-line no-new-func
    `return ${Game.tooltip.update.toString().split('this.').join('Game.tooltip.')}`,
  )();
  Game.tooltip.update = function () {
    BackupFunctions.tooltip.updateMod();
    UpdateTooltipLocation();
  };

  BackupFunctions.UpdateWrinklers = Game.UpdateWrinklers;
  Game.UpdateWrinklers = function () {
    FixMouseY(BackupFunctions.UpdateWrinklers);
  };

  BackupFunctions.UpdateSpecial = Game.UpdateSpecial;
  Game.UpdateSpecial = function () {
    FixMouseY(BackupFunctions.UpdateSpecial);
  };

  // Assumes newer browsers
  l('bigCookie').removeEventListener('click', Game.ClickCookie, false);
  l('bigCookie').addEventListener(
    'click',
    (event) => {
      FixMouseY(() => Game.ClickCookie(event, 0));
    },
    false,
  );

  BackupFunctions.RebuildUpgrades = Game.RebuildUpgrades;
  Game.RebuildUpgrades = function () {
    BackupFunctions.RebuildUpgrades();
    ReplaceTooltipUpgrade();
    Game.CalculateGains();
  };

  BackupFunctions.ClickProduct = Game.ClickProduct;
  /**
   * This function adds a check to the purchase of a building to allow BulkBuyBlock to work.
   * If the options is 1 (on) bulkPrice is under cookies you can't buy the building.
   */
  Game.ClickProduct = function (what) {
    if (
      !Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BulkBuyBlock ||
      Game.ObjectsById[what].bulkPrice <= Game.cookies ||
      Game.buyMode === -1
    ) {
      BackupFunctions.ClickProduct(what);
    }
  };

  BackupFunctions.DescribeDragonAura = Game.DescribeDragonAura;
  /**
   * This function adds the function CM.Disp.AddAuraInfo() to Game.DescribeDragonAura()
   * This adds information about CPS differences and costs to the aura choosing interface
   * @param	{number}	aura	The number of the aura currently selected by the mouse/user
   */
  Game.DescribeDragonAura = function (aura) {
    BackupFunctions.DescribeDragonAura(aura);
    AddAuraInfo(aura);
  };

  BackupFunctions.ToggleSpecialMenu = Game.ToggleSpecialMenu;
  /**
   * This function adds the code to display the tooltips for the levelUp button of the dragon
   */
  Game.ToggleSpecialMenu = function (on) {
    BackupFunctions.ToggleSpecialMenu(on);
    AddDragonLevelUpTooltip();
  };

  BackupFunctions.UpdateMenu = Game.UpdateMenu;
  Game.UpdateMenu = function () {
    if (typeof jscolor.picker === 'undefined' || typeof jscolor.picker.owner === 'undefined') {
      BackupFunctions.UpdateMenu();
      AddMenu();
    }
  };

  BackupFunctions.sayTime = Game.sayTime;
  // eslint-disable-next-line no-unused-vars
  CMSayTime = function (time, detail) {
    if (Number.isNaN(time) || time <= 0) return BackupFunctions.sayTime(time, detail);
    return FormatTime(time / Game.fps, 1);
  };

  BackupFunctions.Logic = Game.Logic;
  Game.Logic = function () {
    BackupFunctions.Logic();

    // Update tab title
    let title = 'Cookie Clicker';
    if (Game.season === 'fools') title = 'Cookie Baker';
    // eslint-disable-next-line no-unused-vars
    Title = `${Game.OnAscend ? 'Ascending! ' : ''}${CMBeautify(Game.cookies)} ${
      Game.cookies === 1 ? 'cookie' : 'cookies'
    } - ${title}`;
    UpdateTitle();

    // Since the Ascend Tooltip is not actually a tooltip we need to add our additional info here...
    ReplaceAscendTooltip();
  };
}
