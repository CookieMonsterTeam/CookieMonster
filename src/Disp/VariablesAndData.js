/**
 * Section: Variables used in Disp functions */

export let DispCSS;

/**
 * These are variables used to create DOM object names and id (e.g., 'CMTextTooltip)
 */
export const ColourTextPre = 'CMText';
export const ColourBackPre = 'CMBack';
export const ColourBorderPre = 'CMBorder';

/**
 * These are variables which can be set in the options by the user to standardize colours throughout CookieMonster
 */
export const ColourBlue = 'Blue';
export const ColourGreen = 'Green';
export const ColourYellow = 'Yellow';
export const ColourOrange = 'Orange';
export const ColourRed = 'Red';
export const ColourPurple = 'Purple';
export const ColourGray = 'Gray';
export const ColourPink = 'Pink';
export const ColourBrown = 'Brown';
export const ColoursOrdering = [
  ColourBlue,
  ColourGreen,
  ColourYellow,
  ColourOrange,
  ColourRed,
  ColourPurple,
  ColourPink,
  ColourBrown,
  ColourGray,
];

/**
 * This list is used to make some very basic tooltips.
 * It is used by CM.Main.DelayInit() in the call of CM.Disp.CreateSimpleTooltip()
 * @item	{string}	placeholder
 * @item	{string}	text
 * @item	{string}	minWidth
 */
export const TooltipText = [
  ['GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px'],
  [
    'GoldCookDragonsFortuneTooltipPlaceholder',
    'Calculated with Golden Switch off and at least one golden cookie on-screen',
    '240px',
  ],
  [
    'PrestMaxTooltipPlaceholder',
    'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg',
    '320px',
  ],
  [
    'NextPrestTooltipPlaceholder',
    'Calculated with cookies gained from wrinklers and Chocolate egg',
    '200px',
  ],
  [
    'HeavenChipMaxTooltipPlaceholder',
    'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg',
    '330px',
  ],
  [
    'ResetTooltipPlaceholder',
    'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from ascension achievements if you have the same buildings/upgrades after reset',
    '370px',
  ],
  [
    'ChoEggTooltipPlaceholder',
    'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and then buying Chocolate egg',
    '300px',
  ],
  ['ChainNextLevelPlaceholder', 'Cheated cookies might break this formula', '250px'],
  [
    'FavouriteSettingPlaceholder',
    "Click to set this setting as favourite and show it in 'favourite' settings at the top of the Cookie Monster Settings",
    '250px',
  ],
];
export const SimpleTooltipElements = {};

/**
 * These are variables used by the functions that create tooltips for wrinklers
 * See CM.Disp.CheckWrinklerTooltip(), CM.Disp.UpdateWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
export let TooltipWrinklerArea = 0; // eslint-disable-line prefer-const
export let TooltipWrinkler = -1; // eslint-disable-line prefer-const

/**
 * This array is used to store whether a Wrinkler tooltip is being shown or not
 * [i] = 1 means tooltip is being shown, [i] = 0 means hidden
 * It is used by CM.Disp.CheckWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
export let TooltipWrinklerBeingShown = []; // eslint-disable-line prefer-const

export let CMLastAscendState;
export let CMSayTime = function () {}; // eslint-disable-line prefer-const

/**
 * These are variables used to create various displays when the game is loaded on the "sell all" screen
 */
export let LastTargetBotBar = 1; // eslint-disable-line prefer-const
export let LastTargetBuildings = 1; // eslint-disable-line prefer-const
export let LastTargetTooltipBuilding = 1; // eslint-disable-line prefer-const

/**
 * These arrays are used in the stats page to show
 * average cookies per {CM.Disp.cookieTimes/CM.Disp.clickTimes} seconds
 */
export const CookieTimes = [10, 15, 30, 60, 300, 600, 900, 1800];
export const ClickTimes = [1, 5, 10, 15, 30];

/**
 * This array is used to give certain timers specific colours
 */
export const BuffColours = {
  Frenzy: ColourYellow,
  'Dragon Harvest': ColourBrown,
  'Elder frenzy': ColourGreen,
  Clot: ColourRed,
  'Click frenzy': ColourBlue,
  Dragonflight: ColourPink,
};

/**
 * This array is used to track GC timers
 */
export let GCTimers = {}; // eslint-disable-line prefer-const

/**
 * Used to store the number of cookies to be displayed in the tab-title
 */
export let Title = ''; // eslint-disable-line prefer-const

export let TooltipPrice;
export let TooltipBonusIncome;
export let TooltipType;
export let TooltipName;
export let TooltipBonusMouse;

export let LastAscendState;
export let LastNumberOfTimers;

/**
 * This stores the names of settings shown in the favourites section
 */
export let FavouriteSettings = []; // eslint-disable-line prefer-const
