import CheckNotificationPermissions from '../Config/CheckNotificationPermissions';
import { ToggleTimerBar, ToggleTimerBarPos } from '../Config/SpecificToggles';
import ToggleBotBar from '../Config/Toggles/ToggleBotBar';
import ToggleDetailedTime from '../Config/Toggles/ToggleDetailedTime';
import ToggleGCTimer from '../Config/Toggles/ToggleGCTimer';
import ToggleSectionHideButtons from '../Config/Toggles/ToggleSectionHideButtons';
import ToggleToolWarnPos from '../Config/Toggles/ToggleToolWarnPos';
import ToggleUpgradeBarAndColour from '../Config/Toggles/ToggleUpgradeBarAndColour';
import ToggleUpgradeBarFixedPos from '../Config/Toggles/ToggleUpgradeBarFixedPos';
import ToggleWrinklerButtons from '../Config/Toggles/ToggleWrinklerButtons';
import { CMOptions } from '../Config/VariablesAndData';
import UpdateBuildings from '../Disp/BuildingsUpgrades/Buildings';
import UpdateUpgradeSectionsHeight from '../Disp/BuildingsUpgrades/UpdateUpgradeSectionsHeight';
import UpdateUpgrades from '../Disp/BuildingsUpgrades/Upgrades';
import RefreshScale from '../Disp/HelperFunctions/RefreshScale';
import { UpdateFavicon } from '../Disp/TabTitle/FavIcon';
import { SimDoSims } from '../Sim/VariablesAndData'; // eslint-disable-line no-unused-vars
import SettingColours from './SettingClasses/SettingColours.ts';
import SettingInputNumber from './SettingClasses/SettingInputNumber.ts';
import SettingStandard from './SettingClasses/SettingStandard.ts';
import SettingVolume from './SettingClasses/SettingVolume.ts';

/** This includes all options of CookieMonster and their relevant data */
const Config = {
  // Calculation
  CPSMode: new SettingStandard(
    'bool',
    'Calculation',
    ['Current cookies per second', 'Average cookies per second'],
    'Calculate times using current cookies per second or average cookies per second',
    false,
  ),
  AvgCPSHist: new SettingStandard(
    'bool',
    'Calculation',
    [
      'Average CPS in past 10s',
      'Average CPS in past 15s',
      'Average CPS in past 30s',
      'Average CPS in past 1m',
      'Average CPS in past 5m',
      'Average CPS in past 10m',
      'Average CPS in past 15m',
      'Average CPS in past 30m',
    ],
    'How much time average Cookies Per Second should consider',
    false,
  ),
  AvgClicksHist: new SettingStandard(
    'bool',
    'Calculation',
    [
      'Average clicks in past 1s',
      'Average clicks in past 5s',
      'Average clicks in past 10s',
      'Average clicks in past 15s',
      'Average clicks in past 30s',
    ],
    'How much time average Cookie Clicks should consider',
    false,
  ),
  CalcWrink: new SettingStandard(
    'bool',
    'Calculation',
    [
      'Calculate with wrinklers OFF',
      'Calculate with wrinklers ON',
      'Calculate with single fattest wrinkler ON',
    ],
    'Calculate times and average Cookies Per Second with (only the single non-shiny fattest) wrinklers',
    true,
    () => {
      SimDoSims = true;
    },
  ),

  // Notation
  Scale: new SettingStandard(
    'bool',
    'Notation',
    [
      "Game's setting scale",
      'Metric',
      'Short scale',
      'Short scale (Abbreviated)',
      'Scientific notation',
      'Engineering notation',
    ],
    'Change how long numbers are formatted',
    false,
    () => {
      RefreshScale();
    },
  ),
  ScaleDecimals: new SettingStandard(
    'bool',
    'Notation',
    ['1 decimals', '2 decimals', '3 decimals'],
    `Set the number of decimals used when applicable. This only works with Cookie Monster scales and not with "Game's Setting Scale"`,
    false,
    () => {
      RefreshScale();
    },
  ),
  ScaleSeparator: new SettingStandard(
    'bool',
    'Notation',
    ['. for decimals (standard)', '. for thousands'],
    'Set the separator used for decimals and thousands',
    false,
    () => {
      RefreshScale();
    },
  ),
  ScaleCutoff: new SettingInputNumber(
    'numscale',
    'Notation',
    'Notation cut-off point: ',
    'The number from which Cookie Monster will start formatting numbers based on chosen scale. Standard is 999,999. Setting this above 999,999,999 might break certain notations',
    1,
    999999999,
  ),
  TimeFormat: new SettingStandard(
    'bool',
    'Notation',
    ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'],
    'Change the time format',
    false,
  ),
  DetailedTime: new SettingStandard(
    'bool',
    'Notation',
    ['Detailed time OFF', 'Detailed time ON'],
    'Change how time is displayed in certain statistics and tooltips',
    true,
    () => {
      ToggleDetailedTime();
    },
  ),
  PPDisplayTime: new SettingStandard(
    'bool',
    'Notation',
    ['PP as value (standard)', 'PP as time unit'],
    'Display PP as calculated value or as approximate time unit. Note that PP does not translate directly into a time unit and this is therefore only an approximation.',
    false,
  ),

  // Colours
  BuildColour: new SettingStandard(
    'bool',
    'Colours',
    ['Building colours OFF', 'Building colours ON'],
    'Colour code buildings',
    true,
    () => {
      UpdateBuildings();
    },
  ),
  PPOnlyConsiderBuyable: new SettingStandard(
    'bool',
    'Colours',
    ["Don't ignore non-buyable", 'Ignore non-buyable'],
    "Makes Cookie Monster label buildings and upgrades you can't buy right now red, useful in those situations where you just want to spend your full bank 'most optimally'",
    true,
  ),
  PPExcludeTop: new SettingStandard(
    'bool',
    'Colours',
    [
      "Don't ignore any",
      'Ignore 1st best',
      'Ignore 1st and 2nd best',
      'Ignore 1st, 2nd and 3rd best',
    ],
    'Makes Cookie Monster ignore the 1st, 2nd or 3rd best buildings in labeling and colouring PP values',
    true,
  ),
  PPRigidelMode: new SettingStandard(
    'bool',
    'Colours',
    ['Rigidel mode OFF', 'Rigidel mode ON'],
    'Makes Cookie Monster ignore all "buy 1" options when colouring PP in order to stay at a total building count ending in 10 for pantheon god Rigidel',
    true,
  ),
  PPSecondsLowerLimit: new SettingInputNumber(
    'numscale',
    'Colours',
    'Lower limit for PP (in seconds): ',
    'If a building or upgrade costs less than the specified seconds of CPS it will also be considered optimal and label it as such ("PP is less than xx seconds of CPS"); setting to 0 ignores this option',
    0,
    Infinity,
  ),
  ColourBlue: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is blue. Used to show upgrades better than best PP building, for Click Frenzy bar, and for various labels',
  ),
  ColourGreen: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is green. Used to show best PP building, for Blood Frenzy bar, and for various labels',
  ),
  ColourYellow: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is yellow. Used to show buildings within the top 10 of PP, for Frenzy bar, and for various labels',
  ),
  ColourOrange: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is orange. Used to show buildings within the top 20 of PP, for Next Reindeer bar, and for various labels',
  ),
  ColourRed: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is Red. Used to show buildings within the top 30 of PP, for Clot bar, and for various labels',
  ),
  ColourPurple: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is purple. Used to show buildings outside of the top 30 of PP, for Next Cookie bar, and for various labels',
  ),
  ColourGray: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is gray. Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar',
  ),
  ColourPink: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is pink. Used for Dragonflight bar',
  ),
  ColourBrown: new SettingColours(
    'colour',
    'Colours',
    'Standard colour is brown. Used for Dragon Harvest bar',
  ),

  // BarsDisplay
  BotBar: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Bottom bar OFF', 'Bottom bar ON'],
    'Building information',
    true,
    () => {
      ToggleBotBar();
    },
  ),
  TimerBar: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Timer bar OFF', 'Timer bar ON'],
    'Bar with timers for golden cookie, season popup, Frenzy (Normal, Clot, Elder), Click Frenzy',
    true,
    () => {
      ToggleTimerBar();
    },
  ),
  TimerBarPos: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Timer bar position (top left)', 'Timer bar position (bottom)'],
    'Placement of the timer bar',
    false,
    () => {
      ToggleTimerBarPos();
    },
  ),
  TimerBarOverlay: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Timer bar overlay OFF', 'Timer bar overlay only seconds', 'Timer bar overlay full'],
    'Overlay on timers displaying seconds and/or percentage left',
    true,
  ),
  AutosaveTimerBar: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Autosave timer bar OFF', 'Autosave timer bar ON'],
    'Show a timer counting down till next autosave in the timer bar',
    true,
  ),
  UpBarColour: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Upgrade colours/bar OFF', 'Upgrade colours with bar ON', 'Upgrade colours without bar ON'],
    'Colour code upgrades and optionally add a counter bar',
    false,
    () => {
      ToggleUpgradeBarAndColour();
    },
  ),
  UpgradeBarFixedPos: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Upgrade bar fixed position OFF', 'Upgrade bar fixed position ON'],
    'Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling',
    true,
    () => {
      ToggleUpgradeBarFixedPos();
    },
  ),
  SortBuildings: new SettingStandard(
    'bool',
    'BarsDisplay',
    [
      'Sort buildings: default',
      'Sort buildings: PP of x1 purchase',
      'Sort buildings: PP of selected bulk mode',
      'Sort buildings: price until next achievement',
    ],
    'Sort the display of buildings in default order, by PP, or until next achievement',
    false,
    () => {
      UpdateBuildings();
    },
  ),
  SortUpgrades: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Sort upgrades: default', 'Sort upgrades: PP'],
    'Sort the display of upgrades in either default order or by PP',
    false,
    () => {
      UpdateUpgrades();
    },
  ),
  UpgradesNeverCollapse: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Upgrades always expanded OFF', 'Upgrades always expanded ON'],
    'Toggle to make the upgrades sections always expanded to the size needed to display all upgrades',
    true,
    () => {
      UpdateUpgradeSectionsHeight();
    },
  ),
  DragonAuraInfo: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Extra dragon aura info OFF', 'Extra dragon aura info ON'],
    'Shows information about changes in CPS and costs in the dragon aura interface.',
    true,
  ),
  GrimoireBar: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Grimoire magic meter timer OFF', 'Grimoire magic meter timer ON'],
    'A timer overlay showing how long till the Grimoire magic meter is full',
    true,
  ),
  GCTimer: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Golden cookie timer OFF', 'Golden cookie timer ON'],
    'A timer on the golden cookie when it has been spawned',
    true,
    () => {
      ToggleGCTimer();
    },
  ),
  Favicon: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Favicon OFF', 'Favicon ON'],
    'Update favicon with golden/wrath cookie',
    true,
    () => {
      UpdateFavicon();
    },
  ),
  WrinklerButtons: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Extra wrinkler buttons OFF', 'Extra wrinkler buttons ON'],
    'Show buttons for popping wrinklers at bottom of cookie section',
    true,
    () => {
      ToggleWrinklerButtons();
    },
  ),
  HideSectionsButtons: new SettingStandard(
    'bool',
    'BarsDisplay',
    ['Hide buildings/upgrades button OFF', 'Hide buildings/upgrades button ON'],
    'Show buttons for hiding and showing the buildings and upgrades sections in the right column',
    true,
    () => {
      ToggleSectionHideButtons();
    },
  ),

  // Tooltip
  TooltipBuildUpgrade: new SettingStandard(
    'bool',
    'Tooltip',
    ['Building/upgrade tooltip information OFF', 'Building/upgrade tooltip information ON'],
    'Extra information in building/upgrade tooltips',
    true,
  ),
  TooltipAmor: new SettingStandard(
    'bool',
    'Tooltip',
    [
      'Buildings tooltip amortization information OFF',
      'Buildings tooltip amortization information ON',
    ],
    'Add amortization information to buildings tooltip',
    true,
  ),
  ToolWarnLucky: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip lucky warning OFF', 'Tooltip lucky warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Lucky!" rewards',
    true,
  ),
  ToolWarnLuckyFrenzy: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip lucky frenzy warning OFF', 'Tooltip lucky frenzy warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Lucky!" (Frenzy) rewards',
    true,
  ),
  ToolWarnConjure: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip conjure warning OFF', 'Tooltip conjure warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards',
    true,
  ),
  ToolWarnConjureFrenzy: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip conjure frenzy warning OFF', 'Tooltip conjure frenzy warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards with Frenzy active',
    true,
  ),
  ToolWarnEdifice: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip edifice warning OFF', 'Tooltip edifice warning ON'],
    'A warning when buying if it will put the bank under the amount needed for "Spontaneous Edifice" to possibly give you your most expensive building',
    true,
  ),
  ToolWarnUser: new SettingInputNumber(
    'numscale',
    'Tooltip',
    'Tooltip warning at x times CPS: ',
    'Use this to show a customized warning if buying it will put the bank under the amount equal to value times cps; setting to 0 disables the function altogether',
    0,
    Infinity,
  ),
  ToolWarnBon: new SettingStandard(
    'bool',
    'Tooltip',
    ['Calculate tooltip warning with bonus CPS OFF', 'Calculate tooltip warning with bonus CPS ON'],
    'Calculate the warning with or without the bonus CPS you get from buying',
    true,
  ),
  ToolWarnPos: new SettingStandard(
    'bool',
    'Tooltip',
    ['Tooltip warning position (left)', 'Tooltip warning position (bottom)'],
    'Placement of the warning boxes',
    false,
    () => {
      ToggleToolWarnPos();
    },
  ),
  TooltipGrim: new SettingStandard(
    'bool',
    'Tooltip',
    ['Grimoire tooltip information OFF', 'Grimoire tooltip information ON'],
    'Extra information in tooltip for grimoire',
    true,
  ),
  TooltipWrink: new SettingStandard(
    'bool',
    'Tooltip',
    ['Wrinkler tooltip OFF', 'Wrinkler tooltip ON'],
    'Shows the amount of cookies a wrinkler will give when popping it',
    true,
  ),
  TooltipLump: new SettingStandard(
    'bool',
    'Tooltip',
    ['Sugar lump tooltip OFF', 'Sugar lump tooltip ON'],
    'Shows the current Sugar Lump type in Sugar lump tooltip.',
    true,
  ),
  TooltipPlots: new SettingStandard(
    'bool',
    'Tooltip',
    ['Garden plots tooltip OFF', 'Garden plots tooltip ON'],
    'Shows a tooltip for plants that have a cookie reward.',
    true,
  ),
  TooltipPantheon: new SettingStandard(
    'bool',
    'Tooltip',
    ['Pantheon tooltip OFF', 'Pantheon tooltip ON'],
    'Shows additional info in the pantheon tooltip',
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
    ['Missing upgrades OFF', 'Missing upgrades ON'],
    'Shows missing upgrades in statistics menu',
    true,
  ),
  MissingAchievements: new SettingStandard(
    'bool',
    'Statistics',
    ['Missing Achievements OFF', 'Missing Normal Achievements ON'],
    'Shows missing normal achievements in statistics menu.',
    true,
  ),
  UpStats: new SettingStandard(
    'bool',
    'Statistics',
    ['Statistics update rate (default)', 'Statistics update rate (1s)'],
    'Default rate is once every 5 seconds',
    false,
  ),
  HeavenlyChipsTarget: new SettingInputNumber(
    'numscale',
    'Statistics',
    'Heavenly chips target: ',
    'Use this to set a heavenly chips target that will be counted towards in the "prestige" statsistics sections',
    1,
    Infinity,
  ),
  ShowMissedGC: new SettingStandard(
    'bool',
    'Statistics',
    ['Missed GC OFF', 'Missed GC ON'],
    'Show a stat in the statistics screen that counts how many golden cookies you have missed',
    true,
  ),

  // Notification
  Title: new SettingStandard(
    'bool',
    'NotificationGeneral',
    ['Title OFF', 'Title ON', 'Title pinned tab highlight'],
    'Update title with colden cookie/season popup timers; pinned tab highlight only changes the title when a golden cookie/season popup spawns; "!" means that golden cookie/reindeer can spawn',
    true,
  ),
  GeneralSound: new SettingStandard(
    'bool',
    'NotificationGeneral',
    ['Consider game volume setting OFF', 'Consider game volume setting ON'],
    'Turning this toggle to "off" makes Cookie Monster no longer consider the volume setting of the base game, allowing mod notifications to play with base game volume turned down',
    true,
  ),
  GCNotification: new SettingStandard(
    'bool',
    'NotificationGC',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when golden cookie spawns',
    true,
    () => {
      CheckNotificationPermissions(CMOptions.GCNotification);
    },
  ),
  GCFlash: new SettingStandard(
    'bool',
    'NotificationGC',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on golden cookie',
    true,
  ),
  ColourGCFlash: new SettingColours(
    'colour',
    'NotificationGC',
    'The colour of the GC flash, standard colour is white',
  ),
  GCSound: new SettingStandard(
    'bool',
    'NotificationGC',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on golden cookie',
    true,
  ),
  GCVolume: new SettingVolume('vol', 'NotificationGC', [], 'Volume'),
  GCSoundURL: new SettingStandard(
    'url',
    'NotificationGC',
    'Sound URL:',
    'URL of the sound to be played when a golden cookie spawns',
  ),
  FortuneNotification: new SettingStandard(
    'bool',
    'NotificationFC',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when fortune cookie is on the ticker',
    true,
    () => {
      CheckNotificationPermissions(CMOptions.FortuneNotification);
    },
  ),
  FortuneFlash: new SettingStandard(
    'bool',
    'NotificationFC',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on fortune cookie spawn',
    true,
  ),
  ColourFortuneFlash: new SettingColours(
    'colour',
    'NotificationFC',
    'The colour of the fortune flash, standard colour is white',
  ),
  FortuneSound: new SettingStandard(
    'bool',
    'NotificationFC',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on fortune cookie spawn',
    true,
  ),
  FortuneVolume: new SettingVolume('vol', 'NotificationFC', [], 'Volume'),
  FortuneSoundURL: new SettingStandard(
    'url',
    'NotificationFC',
    'Sound URL:',
    'URL of the sound to be played when the ticker has a fortune cookie',
  ),
  SeaNotification: new SettingStandard(
    'bool',
    'NotificationSea',
    ['Notification OFF', 'Notification ON'],
    'Create a notification on season popup',
    true,
    () => {
      CheckNotificationPermissions(CMOptions.SeaNotification);
    },
  ),
  SeaFlash: new SettingStandard(
    'bool',
    'NotificationSea',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on season popup',
    true,
  ),
  ColourSeaFlash: new SettingColours(
    'colour',
    'NotificationSea',
    'The colour of the season popup flash, standard colour is white',
  ),
  SeaSound: new SettingStandard(
    'bool',
    'NotificationSea',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on season popup',
    true,
  ),
  SeaVolume: new SettingVolume('vol', 'NotificationSea', [], 'Volume'),
  SeaSoundURL: new SettingStandard(
    'url',
    'NotificationSea',
    'Sound URL:',
    'URL of the sound to be played when on season popup spawns',
  ),
  GardFlash: new SettingStandard(
    'bool',
    'NotificationGard',
    ['Garden Tick Flash OFF', 'Flash ON'],
    'Flash screen on garden tick',
    true,
  ),
  ColourGardFlash: new SettingColours(
    'colour',
    'NotificationGard',
    'The colour of the garden flash, standard colour is white',
  ),
  GardSound: new SettingStandard(
    'bool',
    'NotificationGard',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on garden tick',
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
    () => {
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
  ColourMagicFlash: new SettingColours(
    'colour',
    'NotificationMagi',
    'The colour of the magic flash, standard colour is white',
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
    'Create a notification when a wrinkler appears',
    true,
    () => {
      CheckNotificationPermissions(CMOptions.WrinklerNotification);
    },
  ),
  WrinklerFlash: new SettingStandard(
    'bool',
    'NotificationWrink',
    ['Flash OFF', 'Flash ON'],
    'Flash screen when a wrinkler appears',
    true,
  ),
  ColourWrinklerFlash: new SettingColours(
    'colour',
    'NotificationWrink',
    'The colour of the wrinkler flash, standard colour is white',
  ),
  WrinklerSound: new SettingStandard(
    'bool',
    'NotificationWrink',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when a wrinkler appears',
    true,
  ),
  WrinklerVolume: new SettingVolume('vol', 'NotificationWrink', [], 'Volume'),
  WrinklerSoundURL: new SettingStandard(
    'url',
    'NotificationWrink',
    'Sound URL:',
    'URL of the sound to be played when a wrinkler appears',
  ),
  WrinklerMaxNotification: new SettingStandard(
    'bool',
    'NotificationWrinkMax',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when the maximum amount of wrinklers has appeared',
    true,
    () => {
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
  ColourWrinklerMaxFlash: new SettingColours(
    'colour',
    'NotificationWrinkMax',
    'The colour of the maximum wrinkler flash, standard colour is white',
  ),
  WrinklerMaxSound: new SettingStandard(
    'bool',
    'NotificationWrinkMax',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when the maximum amount of wrinklers has appeared',
    true,
  ),
  WrinklerMaxVolume: new SettingVolume('vol', 'NotificationWrinkMax', [], 'Volume'),
  WrinklerMaxSoundURL: new SettingStandard(
    'url',
    'NotificationWrinkMax',
    'Sound URL:',
    'URL of the sound to be played when the maximum amount of wrinklers has appeared',
  ),

  // Miscellaneous
  BulkBuyBlock: new SettingStandard(
    'bool',
    'Miscellaneous',
    ['Block bulk buying OFF', 'Block bulk buying ON'],
    "Block clicking bulk buying when you can't buy all. This prevents buying 7 of a building when you are in buy-10 or buy-100 mode.",
    true,
  ),
  FavouriteSettings: new SettingStandard(
    'bool',
    'Miscellaneous',
    [
      'Favourite settings section OFF',
      'Favourite settings section ON',
      'Favourite settings section ON (Locked)',
    ],
    "Show stars before each setting which allows selecting it for a 'favourites' section at the top of the Cookie Monster settings. Setting this to Locked removes the stars but shows the 'favourites' section",
    true,
    () => {
      Game.UpdateMenu();
    },
  ),
};

export default Config;
