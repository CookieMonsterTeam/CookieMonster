/**
 * Section: Variables used in Disp functions */

export let DispCSS;

/**
 * These are variables used to create DOM object names and id (e.g., 'CMTextTooltip)
 */
export const ColorTextPre = 'CMText';
export const ColorBackPre = 'CMBack';
export const ColorBorderPre = 'CMBorder';

/**
 * These are variables which can be set in the options by the user to standardize colours throughout CookieMonster
 */
export const ColorBlue = 'Blue';
export const ColorGreen = 'Green';
export const ColorYellow = 'Yellow';
export const ColorOrange = 'Orange';
export const ColorRed = 'Red';
export const ColorPurple = 'Purple';
export const ColorGray = 'Gray';
export const ColorPink = 'Pink';
export const ColorBrown = 'Brown';
export const Colors = [ColorGray, ColorBlue, ColorGreen, ColorYellow, ColorOrange, ColorRed, ColorPurple, ColorPink, ColorBrown];

/**
 * This list is used to make some very basic tooltips.
 * It is used by CM.Main.DelayInit() in the call of CM.Disp.CreateSimpleTooltip()
 * @item	{string}	placeholder
 * @item	{string}	text
 * @item	{string}	minWidth
 */
export const TooltipText = [
	['GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px'],
	['GoldCookDragonsFortuneTooltipPlaceholder', 'Calculated with Golden Switch off and at least one golden cookie on-screen', '240px'],
	['PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '320px'],
	['NextPrestTooltipPlaceholder', 'Calculated with cookies gained from wrinklers and Chocolate egg', '200px'],
	['HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '330px'],
	['ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from ascension achievements if you have the same buildings/upgrades after reset', '370px'],
	['ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and then buying Chocolate egg', '300px'],
	['ChainNextLevelPlaceholder', 'Cheated cookies might break this formula', '250px'],
];

/**
 * This array is used to give certain timers specific colours
 */
export const BuffColors = {
	Frenzy: ColorYellow, 'Dragon Harvest': ColorBrown, 'Elder frenzy': ColorGreen, Clot: ColorRed, 'Click frenzy': ColorBlue, Dragonflight: ColorPink,
};

/**
 * This array is used to track GC timers
 */
export const GCTimers = {};

/**
 * These arrays are used in the stats page to show
 * average cookies per {CM.Disp.cookieTimes/CM.Disp.clickTimes} seconds
 */
export const CookieTimes = [10, 15, 30, 60, 300, 600, 900, 1800];
export const ClickTimes = [1, 5, 10, 15, 30];

/**
 * This array is used to store whether a Wrinkler tooltip is being shown or not
 * [i] = 1 means tooltip is being shown, [i] = 0 means hidden
 * It is used by CM.Disp.CheckWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
export const TooltipWrinklerBeingShown = [];

/**
 * These are variables used by the functions that create tooltips for wrinklers
 * See CM.Disp.CheckWrinklerTooltip(), CM.Disp.UpdateWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
export const TooltipWrinklerArea = 0;
export const TooltipWrinkler = -1;

/**
 * Used to store the number of cookies to be displayed in the tab-title
 */
export const Title = '';

/**
 * These are variables used to create various displays when the game is loaded on the "sell all" screen
 */
export const LastTargetBotBar = 1;
export const LastTargetBuildings = 1;
export const LastTargetTooltipBuilding = 1;
