/* eslint-disable no-unused-vars */
import CheckNotificationPermissions from '../Config/CheckNotificationPermissions';
import { ToggleTimerBar, ToggleTimerBarPos } from '../Config/SpecificToggles';
import ToggleBotBar from '../Config/Toggles/ToggleBotBar';
import ToggleDetailedTime from '../Config/Toggles/ToggleDetailedTime';
import ToggleGCTimer from '../Config/Toggles/ToggleGCTimer';
import ToggleToolWarnPos from '../Config/Toggles/ToggleToolWarnPos';
import ToggleUpgradeBarAndColor from '../Config/Toggles/ToggleUpgradeBarAndColor';
import ToggleUpgradeBarFixedPos from '../Config/Toggles/ToggleUpgradeBarFixedPos';
import ToggleWrinklerButtons from '../Config/Toggles/ToggleWrinklerButtons';
import { CMOptions } from '../Config/VariablesAndData';
import UpdateBuildings from '../Disp/BuildingsUpgrades/Buildings';
import UpdateUpgrades from '../Disp/BuildingsUpgrades/Upgrades';
import RefreshScale from '../Disp/HelperFunctions/RefreshScale';
import UpdateColors from '../Disp/HelperFunctions/UpdateColors';
import { UpdateFavicon } from '../Disp/TabTitle/FavIcon';
import { SimDoSims } from '../Sim/VariablesAndData';
import {
  SettingStandard,
  SettingColours,
  SettingVolume,
  SettingInputNumber,
} from './SettingClasses';

/** This includes all options of CookieMonster and their relevant data */
const Config = {
  // Barscolors
  BotBar: new SettingStandard(
    'bool',
    'BarsColors',
    ['Bottom Bar OFF', 'Bottom Bar ON'],
    'Building Information',
    true,
    function () {
      ToggleBotBar();
    },
  ),
  TimerBar: new SettingStandard(
    'bool',
    'BarsColors',
    ['Timer Bar OFF', 'Timer Bar ON'],
    'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy',
    true,
    function () {
      ToggleTimerBar();
    },
  ),
  TimerBarPos: new SettingStandard(
    'bool',
    'BarsColors',
    ['Timer Bar Position (Top Left)', 'Timer Bar Position (Bottom)'],
    'Placement of the Timer Bar',
    false,
    function () {
      ToggleTimerBarPos();
    },
  ),
  TimerBarOverlay: new SettingStandard(
    'bool',
    'BarsColors',
    [
      'Timer Bar Overlay OFF',
      'Timer Bar Overlay Only Seconds',
      'Timer Bar Overlay Full',
    ],
    'Overlay on timers displaying seconds and/or percentage left',
    true,
  ),
  SortBuildings: new SettingStandard(
    'bool',
    'BarsColors',
    [
      'Sort Buildings: Default',
      'Sort Buildings: PP of x1 purchase',
      'Sort Buildings: PP of selected bulk mode',
    ],
    'Sort the display of buildings in either default order or by PP',
    false,
    function () {
      UpdateBuildings();
    },
  ),
  SortUpgrades: new SettingStandard(
    'bool',
    'BarsColors',
    ['Sort Upgrades: Default', 'Sort Upgrades: PP'],
    'Sort the display of upgrades in either default order or by PP',
    false,
    function () {
      UpdateUpgrades();
    },
  ),
  BuildColor: new SettingStandard(
    'bool',
    'BarsColors',
    ['Building Colors OFF', 'Building Colors ON'],
    'Color code buildings',
    true,
    function () {
      UpdateBuildings();
    },
  ),
  PPDisplayTime: new SettingStandard(
    'bool',
    'BarsColors',
    ['PP As Value (Standard)', 'PP As Time Unit'],
    'Display PP as calculated value or as approximate time unit. Note that PP does not translate directly into a time unit and this is therefore only an approximation.',
    false,
  ),
  UpBarColor: new SettingStandard(
    'bool',
    'BarsColors',
    [
      'Upgrade Colors/Bar OFF',
      'Upgrade Colors with Bar ON',
      'Upgrade Colors without Bar ON',
    ],
    'Color code upgrades and optionally add a counter bar',
    false,
    function () {
      ToggleUpgradeBarAndColor();
    },
  ),
  Colors: new SettingColours(
    'color',
    'BarsColors',
    {
      Blue:
        'Color Blue.  Used to show upgrades better than best PP building, for Click Frenzy bar, and for various labels',
      Green:
        'Color Green.  Used to show best PP building, for Blood Frenzy bar, and for various labels',
      Yellow:
        'Color Yellow.  Used to show buildings within the top 10 of PP, for Frenzy bar, and for various labels',
      Orange:
        'Color Orange.  Used to show buildings within the top 20 of PP, for Next Reindeer bar, and for various labels',
      Red:
        'Color Red.  Used to show buildings within the top 30 of PP, for Clot bar, and for various labels',
      Purple:
        'Color Purple.  Used to show buildings outside of the top 30 of PP, for Next Cookie bar, and for various labels',
      Gray:
        'Color Gray.  Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar',
      Pink: 'Color Pink.  Used for Dragonflight bar',
      Brown: 'Color Brown.  Used for Dragon Harvest bar',
    },
    function () {
      UpdateColors();
    },
  ),
  UpgradeBarFixedPos: new SettingStandard(
    'bool',
    'BarsColors',
    ['Upgrade Bar Fixed Position OFF', 'Upgrade Bar Fixed Position ON'],
    'Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling',
    true,
    function () {
      ToggleUpgradeBarFixedPos();
    },
  ),

  // Calculation
  CalcWrink: new SettingStandard(
    'bool',
    'Calculation',
    [
      'Calculate with Wrinklers OFF',
      'Calculate with Wrinklers ON',
      'Calculate with Single Fattest Wrinkler ON',
    ],
    'Calculate times and average Cookies Per Second with (only the single non-shiny fattest) Wrinklers',
    true,
    function () {
      SimDoSims = true;
    },
  ),
  CPSMode: new SettingStandard(
    'bool',
    'Calculation',
    ['Current Cookies Per Second', 'Average Cookies Per Second'],
    'Calculate times using current Cookies Per Second or average Cookies Per Second',
    false,
  ),
  AvgCPSHist: new SettingStandard(
    'bool',
    'Calculation',
    [
      'Average CPS for past 10s',
      'Average CPS for past 15s',
      'Average CPS for past 30s',
      'Average CPS for past 1m',
      'Average CPS for past 5m',
      'Average CPS for past 10m',
      'Average CPS for past 15m',
      'Average CPS for past 30m',
    ],
    'How much time average Cookies Per Second should consider',
    false,
  ),
  AvgClicksHist: new SettingStandard(
    'bool',
    'Calculation',
    [
      'Average Cookie Clicks for past 1s',
      'Average Cookie Clicks for past 5s',
      'Average Cookie Clicks for past 10s',
      'Average Cookie Clicks for past 15s',
      'Average Cookie Clicks for past 30s',
    ],
    'How much time average Cookie Clicks should consider',
    false,
  ),
  PPExcludeTop: new SettingStandard(
    'bool',
    'Calculation',
    [
      "Don't Ignore Any",
      'Ignore 1st Best',
      'Ignore 1st and 2nd Best',
      'Ignore 1st, 2nd and 3rd Best',
    ],
    'Makes CookieMonster ignore the 1st, 2nd or 3rd best buildings in labeling and colouring PP values',
    true,
  ),
  PPSecondsLowerLimit: new SettingInputNumber(
    'numscale',
    'Calculation',
    'Lower limit for PP (in seconds): ',
    'If a building or upgrade costs less than the specified seconds of CPS it will also be considered optimal and label it as such ("PP is less than xx seconds of CPS"); setting to 0 ignores this option',
    0,
    Infinity,
  ),
  PPOnlyConsiderBuyable: new SettingStandard(
    'bool',
    'Calculation',
    ["Don't Ignore Non-Buyable", 'Ignore Non-Buyable'],
    "Makes CookieMonster label buildings and upgrades you can't buy right now red, useful in those situations where you just want to spend your full bank 'most optimally'",
    true,
  ),
  ToolWarnBon: new SettingStandard(
    'bool',
    'Calculation',
    [
      'Calculate Tooltip Warning With Bonus CPS OFF',
      'Calculate Tooltip Warning With Bonus CPS ON',
    ],
    'Calculate the warning with or without the bonus CPS you get from buying',
    true,
  ),

  // Notification
  Title: new SettingStandard(
    'bool',
    'NotificationGeneral',
    ['Title OFF', 'Title ON', 'Title Pinned Tab Highlight'],
    'Update title with Golden Cookie/Season Popup timers; pinned tab highlight only changes the title when a Golden Cookie/Season Popup spawns; "!" means that Golden Cookie/Reindeer can spawn',
    true,
  ),
  GeneralSound: new SettingStandard(
    'bool',
    'NotificationGeneral',
    ['Consider Game Volume Setting OFF', 'Consider Game Volume Setting ON'],
    'Turning this toggle to "off" makes Cookie Monster no longer consider the volume setting of the base game, allowing mod notifications to play with base game volume turned down',
    true,
  ),
  GCNotification: new SettingStandard(
    'bool',
    'NotificationGC',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when Golden Cookie spawns',
    true,
    function () {
      CheckNotificationPermissions(CMOptions.GCNotification);
    },
  ),
  GCFlash: new SettingStandard(
    'bool',
    'NotificationGC',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on Golden Cookie',
    true,
  ),
  GCSound: new SettingStandard(
    'bool',
    'NotificationGC',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on Golden Cookie',
    true,
  ),
  GCVolume: new SettingVolume('vol', 'NotificationGC', [], 'Volume'),
  GCSoundURL: new SettingStandard(
    'url',
    'NotificationGC',
    'Sound URL:',
    'URL of the sound to be played when a Golden Cookie spawns',
  ),
  FortuneNotification: new SettingStandard(
    'bool',
    'NotificationFC',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when Fortune Cookie is on the Ticker',
    true,
    function () {
      CheckNotificationPermissions(CMOptions.FortuneNotification);
    },
  ),
  FortuneFlash: new SettingStandard(
    'bool',
    'NotificationFC',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on Fortune Cookie',
    true,
  ),
  FortuneSound: new SettingStandard(
    'bool',
    'NotificationFC',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on Fortune Cookie',
    true,
  ),
  FortuneVolume: new SettingVolume('vol', 'NotificationFC', [], 'Volume'),

  FortuneSoundURL: new SettingStandard(
    'url',
    'NotificationFC',
    'Sound URL:',
    'URL of the sound to be played when the Ticker has a Fortune Cookie',
  ),
  SeaNotification: new SettingStandard(
    'bool',
    'NotificationSea',
    ['Notification OFF', 'Notification ON'],
    'Create a notification on Season Popup',
    true,
    function () {
      CheckNotificationPermissions(CMOptions.SeaNotification);
    },
  ),
  SeaFlash: new SettingStandard(
    'bool',
    'NotificationSea',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on Season Popup',
    true,
  ),
  SeaSound: new SettingStandard(
    'bool',
    'NotificationSea',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on Season Popup',
    true,
  ),
  SeaVolume: new SettingVolume('vol', 'NotificationSea', [], 'Volume'),
  SeaSoundURL: new SettingStandard(
    'url',
    'NotificationSea',
    'Sound URL:',
    'URL of the sound to be played when a Season Special spawns',
  ),
  GardFlash: new SettingStandard(
    'bool',
    'NotificationGard',
    ['Garden Tick Flash OFF', 'Flash ON'],
    'Flash screen on Garden Tick',
    true,
  ),
  GardSound: new SettingStandard(
    'bool',
    'NotificationGard',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on Garden Tick',
    true,
  ),
  GardVolume: new SettingVolume('vol', 'NotificationGard', [], 'Volume'),
  GardSoundURL: new SettingStandard(
    'url',
    'NotificationGard',
    'Garden Tick Sound URL:',
    'URL of the sound to be played when the garden ticks',
  ),
  MagicNotification: new SettingStandard(
    'bool',
    'NotificationMagi',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when magic reaches maximum',
    true,
    function () {
      CheckNotificationPermissions(CMOptions.MagicNotification);
    },
  ),
  MagicFlash: new SettingStandard(
    'bool',
    'NotificationMagi',
    ['Flash OFF', 'Flash ON'],
    'Flash screen when magic reaches maximum',
    true,
  ),
  MagicSound: new SettingStandard(
    'bool',
    'NotificationMagi',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when magic reaches maximum',
    true,
  ),
  MagicVolume: new SettingVolume('vol', 'NotificationMagi', [], 'Volume'),
  MagicSoundURL: new SettingStandard(
    'url',
    'NotificationMagi',
    'Sound URL:',
    'URL of the sound to be played when magic reaches maxium',
  ),
  WrinklerNotification: new SettingStandard(
    'bool',
    'NotificationWrink',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when a Wrinkler appears',
    true,
    function () {
      CheckNotificationPermissions(CMOptions.WrinklerNotification);
    },
  ),
  WrinklerFlash: new SettingStandard(
    'bool',
    'NotificationWrink',
    ['Flash OFF', 'Flash ON'],
    'Flash screen when a Wrinkler appears',
    true,
  ),
  WrinklerSound: new SettingStandard(
    'bool',
    'NotificationWrink',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when a Wrinkler appears',
    true,
  ),
  WrinklerVolume: new SettingVolume('vol', 'NotificationWrink', [], 'Volume'),
  WrinklerSoundURL: new SettingStandard(
    'url',
    'NotificationWrink',
    'Sound URL:',
    'URL of the sound to be played when a Wrinkler appears',
  ),
  WrinklerMaxNotification: new SettingStandard(
    'bool',
    'NotificationWrinkMax',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when the maximum amount of Wrinklers has appeared',
    true,
    function () {
      CheckNotificationPermissions(CMOptions.WrinklerMaxNotification);
    },
  ),
  WrinklerMaxFlash: new SettingStandard(
    'bool',
    'NotificationWrinkMax',
    ['Flash OFF', 'Flash ON'],
    'Flash screen when the maximum amount of Wrinklers has appeared',
    true,
  ),
  WrinklerMaxSound: new SettingStandard(
    'bool',
    'NotificationWrinkMax',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when the maximum amount of Wrinklers has appeared',
    true,
  ),
  WrinklerMaxVolume: new SettingVolume(
    'vol',
    'NotificationWrinkMax',
    [],
    'Volume',
  ),
  WrinklerMaxSoundURL: new SettingStandard(
    'url',
    'NotificationWrinkMax',
    'Sound URL:',
    'URL of the sound to be played when the maximum amount of Wrinklers has appeared',
  ),

  // Tooltip
  TooltipBuildUpgrade: new SettingStandard(
    'bool',
    'Tooltip',
    [
      'Building/Upgrade Tooltip Information OFF',
      'Building/Upgrade  Tooltip Information ON',
    ],
    'Extra information in Building/Upgrade tooltips',
    true,
  ),
  TooltipAmor: new SettingStandard(
    'bool',
    'Tooltip',
    [
      'Buildings Tooltip Amortization Information OFF',
      'Buildings Tooltip Amortization Information ON',
    ],
    'Add amortization information to buildings tooltip',
    true,
  ),
  ToolWarnLucky: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip Lucky Warning OFF', 'Tooltip Lucky Warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Lucky!" rewards',
    true,
  ),
  ToolWarnLuckyFrenzy: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip Lucky Frenzy Warning OFF', 'Tooltip Lucky Frenzy Warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Lucky!" (Frenzy) rewards',
    true,
  ),
  ToolWarnConjure: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip Conjure Warning OFF', 'Tooltip Conjure Warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards',
    true,
  ),
  ToolWarnConjureFrenzy: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip Conjure Frenzy Warning OFF', 'Tooltip Conjure Frenzy Warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards with Frenzy active',
    true,
  ),
  ToolWarnEdifice: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip Edifice Warning OFF', 'Tooltip Edifice Warning ON'],
    'A warning when buying if it will put the bank under the amount needed for "Spontaneous Edifice" to possibly give you your most expensive building',
    true,
  ),
  ToolWarnUser: new SettingInputNumber(
    'numscale',
    'Tooltip',
    'Tooltip Warning At x times CPS: ',
    'Use this to show a customized warning if buying it will put the bank under the amount equal to value times cps; setting to 0 disables the function altogether',
    0,
    Infinity,
  ),
  ToolWarnPos: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip Warning Position (Left)', 'Tooltip Warning Position (Bottom)'],
    'Placement of the warning boxes',
    false,
    function () {
      ToggleToolWarnPos();
    },
  ),
  TooltipGrim: new SettingStandard(
    'bool',
    'Tooltip',
    ['Grimoire Tooltip Information OFF', 'Grimoire Tooltip Information ON'],
    'Extra information in tooltip for grimoire',
    true,
  ),
  TooltipWrink: new SettingStandard(
    'bool',
    'Tooltip',
    ['Wrinkler Tooltip OFF', 'Wrinkler Tooltip ON'],
    'Shows the amount of cookies a wrinkler will give when popping it',
    true,
  ),
  TooltipLump: new SettingStandard(
    'bool',
    'Tooltip',
    ['Sugar Lump Tooltip OFF', 'Sugar Lump Tooltip ON'],
    'Shows the current Sugar Lump type in Sugar lump tooltip.',
    true,
  ),
  TooltipPlots: new SettingStandard(
    'bool',
    'Tooltip',
    ['Garden Plots Tooltip OFF', 'Garden Plots Tooltip ON'],
    'Shows a tooltip for plants that have a cookie reward.',
    true,
  ),
  TooltipPantheon: new SettingStandard(
    'bool',
    'Tooltip',
    [
      'Show Extra Info Pantheon Tooltip OFF',
      'Show Extra Info Pantheon Tooltip ON',
    ],
    'Shows additional info in the pantheon tooltip',
    true,
  ),
  DragonAuraInfo: new SettingStandard(
    'bool',
    'Tooltip',
    ['Extra Dragon Aura Info OFF', 'Extra Dragon Aura Info ON'],
    'Shows information about changes in CPS and costs in the dragon aura interface.',
    true,
  ),
  TooltipAscendButton: new SettingStandard(
    'bool',
    'Tooltip',
    ['Show Extra Info Ascend Tooltip OFF', 'Show Extra Info Ascend Tooltip ON'],
    'Shows additional info in the ascend tooltip',
    true,
  ),

  // Statistics
  Stats: new SettingStandard(
    'bool',
    'Statistics',
    ['Statistics OFF', 'Statistics ON'],
    'Extra Cookie Monster statistics!',
    true,
  ),
  MissingUpgrades: new SettingStandard(
    'bool',
    'Statistics',
    ['Missing Upgrades OFF', 'Missing Upgrades ON'],
    'Shows Missing upgrades in Stats Menu. This feature can be laggy for users with a low amount of unlocked achievements.',
    true,
  ),
  UpStats: new SettingStandard(
    'bool',
    'Statistics',
    ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'],
    'Default Game rate is once every 5 seconds',
    false,
  ),
  TimeFormat: new SettingStandard(
    'bool',
    'Statistics',
    ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'],
    'Change the time format',
    false,
  ),
  DetailedTime: new SettingStandard(
    'bool',
    'Statistics',
    ['Detailed Time OFF', 'Detailed Time ON'],
    'Change how time is displayed in certain statistics and tooltips',
    true,
    function () {
      ToggleDetailedTime();
    },
  ),
  GrimoireBar: new SettingStandard(
    'bool',
    'Statistics',
    ['Grimoire Magic Meter Timer OFF', 'Grimoire Magic Meter Timer ON'],
    'A timer on how long before the Grimoire magic meter is full',
    true,
  ),
  HeavenlyChipsTarget: new SettingInputNumber(
    'numscale',
    'Statistics',
    'Heavenly Chips Target: ',
    'Use this to set a Heavenly Chips target that will be counted towards in the "prestige" statsistics sections',
    1,
    Infinity,
  ),
  ShowMissedGC: new SettingStandard(
    'bool',
    'Statistics',
    ['Missed GC OFF', 'Missed GC ON'],
    'Show a stat in the statistics screen that counts how many Golden Cookies you have missed',
    true,
  ),

  // Notation
  Scale: new SettingStandard(
    'bool',
    'Notation',
    [
      "Game's Setting Scale",
      'Metric',
      'Short Scale',
      'Short Scale (Abbreviated)',
      'Scientific Notation',
      'Engineering Notation',
    ],
    'Change how long numbers are handled',
    false,
    function () {
      RefreshScale();
    },
  ),
  ScaleDecimals: new SettingStandard(
    'bool',
    'Notation',
    ['1 decimals', '2 decimals', '3 decimals'],
    'Set the number of decimals used when applicable',
    false,
    function () {
      RefreshScale();
    },
  ),
  ScaleSeparator: new SettingStandard(
    'bool',
    'Notation',
    ['. for decimals (Standard)', '. for thousands'],
    'Set the separator used for decimals and thousands',
    false,
    function () {
      RefreshScale();
    },
  ),
  ScaleCutoff: new SettingInputNumber(
    'numscale',
    'Notation',
    'Notation Cut-off Point: ',
    'The number from which CookieMonster will start formatting numbers based on chosen scale. Standard is 999,999. Setting this above 999,999,999 might break certain notations',
    1,
    999999999,
  ),

  // Miscellaneous
  GCTimer: new SettingStandard(
    'bool',
    'Miscellaneous',
    ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'],
    'A timer on the Golden Cookie when it has been spawned',
    true,
    function () {
      ToggleGCTimer();
    },
  ),
  Favicon: new SettingStandard(
    'bool',
    'Miscellaneous',
    ['Favicon OFF', 'Favicon ON'],
    'Update favicon with Golden/Wrath Cookie',
    true,
    function () {
      UpdateFavicon();
    },
  ),
  WrinklerButtons: new SettingStandard(
    'bool',
    'Miscellaneous',
    ['Extra Buttons OFF', 'Extra Buttons ON'],
    'Show buttons for popping wrinklers at bottom of cookie section',
    true,
    function () {
      ToggleWrinklerButtons();
    },
  ),
  BulkBuyBlock: new SettingStandard(
    'bool',
    'Miscellaneous',
    ['Block Bulk Buying OFF', 'Block Bulk Buying ON'],
    "Block clicking bulk buying when you can't buy all. This prevents buying 7 of a building when you are in buy-10 or buy-100 mode.",
    true,
  ),
};

export default Config;
