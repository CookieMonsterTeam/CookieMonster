/* eslint-disable no-unused-vars */
import { CacheStatsCookies } from '../Cache/Stats/Stats';
import { VersionMajor, VersionMinor } from '../Data/Moddata';
import CreateUpgradeBar from '../Disp/BuildingsUpgrades/UpgradeBar';
import { CreateBotBar } from '../Disp/InfoBars/BottomBar';
import { CreateTimerBar } from '../Disp/InfoBars/TimerBar';
import CreateWrinklerButtons from '../Disp/Initialization/CreateWrinklerButton';
import CreateCssArea from '../Disp/Initialization/CssArea';
import UpdateBuildingUpgradeStyle from '../Disp/Initialization/UpdateBuildingUpgradeStyle';
import CreateWhiteScreen from '../Disp/Initialization/WhiteScreen';
import { CreateFavicon } from '../Disp/TabTitle/FavIcon';
import { CreateSimpleTooltip } from '../Disp/Tooltips/Tooltip';
import { TooltipText } from '../Disp/VariablesAndData';
import CreateSimFunctions from '../Sim/CreateSimFunctions/CreateSimFunctions';
import InitData from '../Sim/InitializeData/InitData';
import { LastModCount } from './VariablesAndData';

/**
 * Initialization loop of Cookie Monster
 */
export default function InitializeCookieMonster() {
	// Create CM.Sim functions
	CreateSimFunctions();

	InitData();
	CacheStatsCookies();

	// Stored to check if we need to re-initiliaze data
	LastModCount = Object.keys(Game.mods).length;

	// Creating visual elements
	CreateCssArea();
	CreateBotBar();
	CreateTimerBar();
	CreateUpgradeBar();
	CreateWhiteScreen();
	CreateFavicon();
	for (const i of Object.keys(TooltipText)) {
		CreateSimpleTooltip(TooltipText[i][0], TooltipText[i][1], TooltipText[i][2]);
	}
	CreateWrinklerButtons();
	UpdateBuildingUpgradeStyle();
	/**
	CM.Main.ReplaceTooltips();
	CM.Main.AddWrinklerAreaDetect();

	// Replace native functions
	CM.Main.ReplaceNative();
	CM.Main.ReplaceNativeGrimoire();
	Game.CalculateGains();

	CM.Config.LoadConfig(); // Must be after all things are created!
	CM.Disp.lastAscendState = Game.OnAscend;

	if (Game.prefs.popups) Game.Popup(`Cookie Monster version ${VersionMajor}.${VersionMinor} loaded!`);
	else Game.Notify(`Cookie Monster version ${VersionMajor}.${VersionMinor} loaded!`, '', '', 1, 1);

	Game.Win('Third-party');
	*/
}
