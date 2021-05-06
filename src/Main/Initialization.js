import InitCache from '../Cache/CacheInit';
import { CacheStatsCookies } from '../Cache/Stats/Stats';
import { LoadConfig } from '../Config/SaveLoadReload/SaveLoadReloadSettings';
import { VersionMajor, VersionMinor } from '../Data/Moddata.ts';
import CreateUpgradeBar from '../Disp/BuildingsUpgrades/UpgradeBar';
import { CreateBotBar } from '../Disp/InfoBars/BottomBar';
import { CreateTimerBar } from '../Disp/InfoBars/TimerBar';
import CreateSectionHideButtons from '../Disp/Initialization/CreateSectionHideButtons';
import CreateWrinklerButtons from '../Disp/Initialization/CreateWrinklerButton';
import CreateCssArea from '../Disp/Initialization/CssArea';
import UpdateBuildingUpgradeStyle from '../Disp/Initialization/UpdateBuildingUpgradeStyle';
import CreateFlashScreen from '../Disp/Initialization/FlashScreen';
import { CreateFavicon } from '../Disp/TabTitle/FavIcon';
import { CreateSimpleTooltip } from '../Disp/Tooltips/Tooltip';
import { CMLastAscendState, TooltipText } from '../Disp/VariablesAndData'; // eslint-disable-line no-unused-vars
import InitData from '../Sim/InitializeData/InitData';
import ReplaceNativeGrimoire from './ReplaceGameElements/NativeGrimoire';
import ReplaceTooltips from './ReplaceGameElements/Tooltips';
import ReplaceNative from './ReplaceGameFunctions/ReplaceNative';
import { LastModCount } from './VariablesAndData'; // eslint-disable-line no-unused-vars
import AddWrinklerAreaDetect from './WrinklerArea/AddDetectArea';

/**
 * Initialization loop of Cookie Monster
 */
export default function InitializeCookieMonster() {
  // Create global data object
  window.CookieMonsterData = {};

  InitData();
  CacheStatsCookies();
  InitCache();

  // Stored to check if we need to re-initiliaze data
  LastModCount = Object.keys(Game.mods).length;

  // Creating visual elements
  CreateCssArea();
  CreateBotBar();
  CreateTimerBar();
  CreateUpgradeBar();
  CreateFlashScreen();
  CreateSectionHideButtons();
  CreateFavicon();
  Object.keys(TooltipText).forEach((i) => {
    CreateSimpleTooltip(TooltipText[i][0], TooltipText[i][1], TooltipText[i][2]);
  });
  CreateWrinklerButtons();
  UpdateBuildingUpgradeStyle();

  ReplaceTooltips();
  AddWrinklerAreaDetect();

  // Replace native functions
  ReplaceNative();
  ReplaceNativeGrimoire();
  Game.CalculateGains();

  LoadConfig();
  CMLastAscendState = Game.OnAscend;

  if (Game.prefs.popups)
    Game.Popup(`Cookie Monster version ${VersionMajor}.${VersionMinor} loaded!`);
  else Game.Notify(`Cookie Monster version ${VersionMajor}.${VersionMinor} loaded!`, '', '', 1, 1);

  Game.Win('Third-party');
}
