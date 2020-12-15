/********
 * Data *
 ********/

CM.Data.Fortunes = [
	'Fortune #001', 
	'Fortune #002', 
	'Fortune #003', 
	'Fortune #004', 
	'Fortune #005', 
	'Fortune #006', 
	'Fortune #007', 
	'Fortune #008', 
	'Fortune #009', 
	'Fortune #010', 
	'Fortune #011', 
	'Fortune #012', 
	'Fortune #013', 
	'Fortune #014', 
	'Fortune #015', 
	'Fortune #016', 
	'Fortune #017', 
	'Fortune #018', 
	'Fortune #100', 
	'Fortune #101', 
	'Fortune #102', 
	'Fortune #103', 
	'Fortune #104'
];
CM.Data.HalloCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
CM.Data.ChristCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
CM.Data.ValCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits', 'Prism heart biscuits'];


/********
 * Section: Data for the various scales used by CookieMonster */
CM.Data.metric = ['', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
CM.Data.shortScale = ['', 'M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec', 'Quattuordec', 'Quindec', 'Sexdec', 'Septendec', 'Octodec', 'Novemdec', 'Vigint', 'Unvigint', 'Duovigint', 'Trevigint', 'Quattuorvigint'];

/********
 * Section: An array containing all Config groups and their to-be displayed title */

CM.ConfigGroups = {
	BarsColors: "Bars/Colors",
	Calculation: "Calculation",
	Notification: "Notification",
	Tooltip: "Tooltips",
	Statistics: "Statitics",
	Other: "Other"}, 

/********
 * Section: An array (CM.ConfigData) containing all Config options
 * 
 * Each array has the following items
 * @item {string}			type	The type of option (bool(ean), vol(ume), url or color)
 * @item {string}			group	The options-group the option belongs to
 * @item {[string, ...]}	label	A list of the various configurations of the option
 * @item {string}			desc 	Description to be used in options menu
 * @item {boolean}			toggle	Whether it should be displayed as a grey/white toggle in the options menu
 * @item {function}			func	A function to be called when the option is toggled
 */

// Barscolors
CM.ConfigData.BotBar = {type: 'bool', group: 'BarsColors', label: ['Bottom Bar OFF', 'Bottom Bar ON'], desc: 'Building Information', toggle: true, func: function() {CM.Disp.ToggleBotBar();}};
CM.ConfigData.TimerBar = {type: 'bool', group: 'BarsColors', label: ['Timer Bar OFF', 'Timer Bar ON'], desc: 'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy', toggle: true, func: function() {CM.Disp.ToggleTimerBar();}};
CM.ConfigData.TimerBarPos = {type: 'bool', group: 'BarsColors', label: ['Timer Bar Position (Top Left)', 'Timer Bar Position (Bottom)'], desc: 'Placement of the Timer Bar', toggle: false, func: function() {CM.Disp.ToggleTimerBarPos();}};
CM.ConfigData.SortBuildings = {type: 'bool', group: 'BarsColors', label: ['Sort Buildings: Default', 'Sort Buildings: PP'], desc: 'Sort the display of buildings in either default order or by PP', toggle: false,	func: function () { CM.Disp.UpdateBuildings();}};
CM.ConfigData.SortUpgrades = {type: 'bool', group: 'BarsColors', label: ['Sort Upgrades: Default', 'Sort Upgrades: PP'], desc: 'Sort the display of upgrades in either default order or by PP', toggle: false, func: function () { CM.Disp.UpdateUpgrades();}};
CM.ConfigData.BuildColor = {type: 'bool', group: 'BarsColors', label: ['Building Colors OFF', 'Building Colors ON'], desc: 'Color code buildings', toggle: true, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.BulkBuildColor = {type: 'bool', group: 'BarsColors', label: ['Bulk Building Colors (Single Building Color)', 'Bulk Building Colors (Calculated Bulk Color)'], desc: 'Color code bulk buildings based on single buildings color or calculated bulk value color', toggle: false, func: function() {CM.Disp.UpdateBuildings();}};
CM.ConfigData.ColorPPBulkMode = {type: 'bool', group: 'BarsColors', label: ['Color of PP (Compared to Single)', 'Color of PP (Compared to Bulk)'], desc: 'Color PP-values based on comparison with single purchase or with selected bulk-buy mode', toggle: false};
CM.ConfigData.UpBarColor = {type: 'bool', group: 'BarsColors', label: ['Upgrade Colors/Bar OFF', 'Upgrade Colors with Bar ON', 'Upgrade Colors without Bar ON'], desc: 'Color code upgrades and optionally add a counter bar', toggle: false, func: function() {CM.Disp.ToggleUpgradeBarAndColor();}};
CM.ConfigData.Colors = { type: 'color', group: 'BarsColors',
	desc: {
		Blue: 'Color Blue.  Used to show better than best PP building, for Click Frenzy bar, and for various labels', 
		Green: 'Color Green.  Used to show best PP building, for Blood Frenzy bar, and for various labels', 
		Yellow: 'Color Yellow.  Used to show between best and worst PP buildings closer to best, for Frenzy bar, and for various labels', 
		Orange: 'Color Orange.  Used to show between best and worst PP buildings closer to worst, for Next Reindeer bar, and for various labels', 
		Red: 'Color Red.  Used to show worst PP building, for Clot bar, and for various labels', 
		Purple: 'Color Purple.  Used to show worse than worst PP building, for Next Cookie bar, and for various labels', 
		Gray: 'Color Gray.  Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar', 
		Pink: 'Color Pink.  Used for Dragonflight bar', 
		Brown: 'Color Brown.  Used for Dragon Harvest bar'
	}, 
	func: function() {CM.Disp.UpdateColors();}
};
CM.ConfigData.UpgradeBarFixedPos = {type: 'bool', group: 'BarsColors', label: ['Upgrade Bar Fixed Position OFF', 'Upgrade Bar Fixed Position ON'], desc: 'Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling', toggle: true, func: function() {CM.Disp.ToggleUpgradeBarFixedPos();}};

// Calculation
CM.ConfigData.CalcWrink = {type: 'bool', group: 'Calculation', label: ['Calculate with Wrinklers OFF', 'Calculate with Wrinklers ON'], desc: 'Calculate times and average Cookies Per Second with Wrinklers', toggle: true};
CM.ConfigData.CPSMode = {type: 'bool', group: 'Calculation', label: ['Current Cookies Per Second', 'Average Cookies Per Second'], desc: 'Calculate times using current Cookies Per Second or average Cookies Per Second', toggle: false};
CM.ConfigData.AvgCPSHist = {type: 'bool', group: 'Calculation', label: ['Average CPS for past 10s', 'Average CPS for past 15s', 'Average CPS for past 30s', 'Average CPS for past 1m', 'Average CPS for past 5m', 'Average CPS for past 10m', 'Average CPS for past 15m', 'Average CPS for past 30m'], desc: 'How much time average Cookies Per Second should consider', toggle: false};
CM.ConfigData.AvgClicksHist = {type: 'bool', group: 'Calculation', label: ['Average Cookie Clicks for past 1s', 'Average Cookie Clicks for past 5s', 'Average Cookie Clicks for past 10s', 'Average Cookie Clicks for past 15s', 'Average Cookie Clicks for past 30s'], desc: 'How much time average Cookie Clicks should consider', toggle: false};
CM.ConfigData.ToolWarnBon = {type: 'bool', group: 'Calculation', label: ['Calculate Tooltip Warning With Bonus CPS OFF', 'Calculate Tooltip Warning With Bonus CPS ON'], desc: 'Calculate the warning with or without the bonus CPS you get from buying', toggle: true};

// Notification
CM.ConfigData.GCNotification = {type: 'bool', group: 'Notification', label: ['Golden Cookie Notification OFF', 'Golden Cookie Notification ON'], desc: 'Create a notification when Golden Cookie spawns', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.GCNotification);}};
CM.ConfigData.GCFlash = {type: 'bool', group: 'Notification', label: ['Golden Cookie Flash OFF', 'Golden Cookie Flash ON'], desc: 'Flash screen on Golden Cookie', toggle: true};
CM.ConfigData.GCSound = {type: 'bool', group: 'Notification', label: ['Golden Cookie Sound OFF', 'Golden Cookie Sound ON'], desc: 'Play a sound on Golden Cookie', toggle: true};
CM.ConfigData.GCVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Golden Cookie'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GCVolume.label[i] = i + '%';
}
CM.ConfigData.GCSoundURL = {type: 'url', group: 'Notification', label: 'Golden Cookie Sound URL:', desc: 'URL of the sound to be played when a Golden Cookie spawns'};
CM.ConfigData.GCTimer = {type: 'bool', group: 'Notification', label: ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'], desc: 'A timer on the Golden Cookie when it has been spawned', toggle: true, func: function() {CM.Disp.ToggleGCTimer();}};
CM.ConfigData.Favicon = {type: 'bool', group: 'Notification', label: ['Favicon OFF', 'Favicon ON'], desc: 'Update favicon with Golden/Wrath Cookie', toggle: true, func: function() {CM.Disp.UpdateFavicon();}};
CM.ConfigData.FortuneNotification = {type: 'bool', group: 'Notification', label: ['Fortune Cookie Notification OFF', 'Fortune Cookie Notification ON'], desc: 'Create a notification when Fortune Cookie is on the Ticker', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.FortuneNotification);}};
CM.ConfigData.FortuneFlash = {type: 'bool', group: 'Notification', label: ['Fortune Cookie Flash OFF', 'Fortune Cookie Flash ON'], desc: 'Flash screen on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneSound = {type: 'bool', group: 'Notification', label: ['Fortune Cookie Sound OFF', 'Fortune Cookie Sound ON'], desc: 'Play a sound on Fortune Cookie', toggle: true};
CM.ConfigData.FortuneVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Fortune Cookie'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.FortuneVolume.label[i] = i + '%';
}
CM.ConfigData.FortuneSoundURL = {type: 'url', group: 'Notification', label: 'Fortune Cookie Sound URL:', desc: 'URL of the sound to be played when the Ticker has a Fortune Cookie'};
CM.ConfigData.SeaNotification = {type: 'bool', group: 'Notification', label: ['Season Special Notification OFF', 'Season Special Notification ON'], desc: 'Create a notification on Season Popup', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.SeaNotification);}};
CM.ConfigData.SeaFlash = {type: 'bool', group: 'Notification', label: ['Season Special Flash OFF', 'Season Special Flash ON'], desc: 'Flash screen on Season Popup', toggle: true};
CM.ConfigData.SeaSound = {type: 'bool', group: 'Notification', label: ['Season Special Sound OFF', 'Season Special Sound ON'], desc: 'Play a sound on Season Popup', toggle: true};
CM.ConfigData.SeaVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Season Special'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.SeaVolume.label[i] = i + '%';
}
CM.ConfigData.SeaSoundURL = {type: 'url', group: 'Notification', label: 'Season Special Sound URL:', desc: 'URL of the sound to be played when a Season Special spawns'};
CM.ConfigData.GardFlash = {type: 'bool', group: 'Notification', label: ['Garden Tick Flash OFF', 'Garden Tick Flash ON'], desc: 'Flash screen on Garden Tick', toggle: true};
CM.ConfigData.GardSound = {type: 'bool', group: 'Notification', label: ['Garden Tick Sound OFF', 'Garden Tick Sound ON'], desc: 'Play a sound on Garden Tick', toggle: true};
CM.ConfigData.GardVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Garden Tick'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.GardVolume.label[i] = i + '%';
}
CM.ConfigData.GardSoundURL = {type: 'url', group: 'Notification', label: 'Garden Tick Sound URL:', desc: 'URL of the sound to be played when the garden ticks'};
CM.ConfigData.MagicNotification = {type: 'bool', group: 'Notification', label: ['Magic Max Notification OFF', 'Magic Max Notification ON'], desc: 'Create a notification when magic reaches maximum', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.MagicNotification);}};
CM.ConfigData.MagicFlash = {type: 'bool', group: 'Notification', label: ['Magic Max Flash OFF', 'Magic Max Flash ON'], desc: 'Flash screen when magic reaches maximum', toggle: true};
CM.ConfigData.MagicSound = {type: 'bool', group: 'Notification', label: ['Magic Max Sound OFF', 'Magic Max Sound ON'], desc: 'Play a sound when magic reaches maximum', toggle: true};
CM.ConfigData.MagicVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Max Magic'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.MagicVolume.label[i] = i + '%';
}
CM.ConfigData.MagicSoundURL = {type: 'url', group: 'Notification', label: 'Magic Max Sound URL:', desc: 'URL of the sound to be played when magic reaches maxium'};
CM.ConfigData.WrinklerNotification = {type: 'bool', group: 'Notification', label: ['Wrinkler Notification OFF', 'Wrinkler Notification ON'], desc: 'Create a notification when a Wrinkler appears', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.WrinklerNotification);}};
CM.ConfigData.WrinklerFlash = {type: 'bool', group: 'Notification', label: ['Wrinkler Flash OFF', 'Wrinkler Flash ON'], desc: 'Flash screen when a Wrinkler appears', toggle: true};
CM.ConfigData.WrinklerSound = {type: 'bool', group: 'Notification', label: ['Wrinkler Sound OFF', 'Wrinkler Sound ON'], desc: 'Play a sound when a Wrinkler appears', toggle: true};
CM.ConfigData.WrinklerVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Wrinkler'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.WrinklerVolume.label[i] = i + '%';
}
CM.ConfigData.WrinklerSoundURL = {type: 'url', group: 'Notification', label: 'Wrinkler Sound URL:', desc: 'URL of the sound to be played when a Wrinkler appears'};
CM.ConfigData.WrinklerMaxNotification = {type: 'bool', group: 'Notification', label: ['Wrinkler Max Notification OFF', 'Wrinkler Max Notification ON'], desc: 'Create a notification when the maximum amount of Wrinklers has appeared', toggle: true, func: function () {CM.CheckNotificationPermissions(CM.Config.WrinklerMaxNotification);}};
CM.ConfigData.WrinklerMaxFlash = {type: 'bool', group: 'Notification', label: ['Wrinkler Max Flash OFF', 'Wrinkler Max Flash ON'], desc: 'Flash screen when the maximum amount of Wrinklers has appeared', toggle: true};
CM.ConfigData.WrinklerMaxSound = {type: 'bool', group: 'Notification', label: ['Wrinkler Max Sound OFF', 'Wrinkler Max Sound ON'], desc: 'Play a sound when the maximum amount of Wrinklers has appeared', toggle: true};
CM.ConfigData.WrinklerMaxVolume = {type: 'vol', group: 'Notification', label: [], desc: 'Volume of Wrinkler Max'};
for (var i = 0; i < 101; i++) {
	CM.ConfigData.WrinklerMaxVolume.label[i] = i + '%';
}
CM.ConfigData.WrinklerMaxSoundURL = {type: 'url', group: 'Notification', label: 'Wrinkler Max Sound URL:', desc: 'URL of the sound to be played when the maximum amount of Wrinklers has appeared'};
CM.ConfigData.Title = {type: 'bool', group: 'Notification', label: ['Title OFF', 'Title ON', 'Title Pinned Tab Highlight'], desc: 'Update title with Golden Cookie/Season Popup timers; pinned tab highlight only changes the title when a Golden Cookie/Season Popup spawns', toggle: true};

// Tooltip
CM.ConfigData.TooltipBuildUp = {type: 'bool', group: 'Tooltip', label: ['Buildings/Upgrades Tooltip Information OFF', 'Buildings/Upgrades Tooltip Information ON'], desc: 'Extra information in tooltip for buildings/upgrades', toggle: true};
CM.ConfigData.TooltipAmor = {type: 'bool', group: 'Tooltip', label: ['Buildings Tooltip Amortization Information OFF', 'Buildings Tooltip Amortization Information ON'], desc: 'Add amortization information to buildings tooltip', toggle: true};
CM.ConfigData.ToolWarnLucky = {type: 'bool', group: 'Tooltip', label: ['Tooltip Lucky Warning OFF', 'Tooltip Lucky Warning ON'], desc: 'A warning when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards', toggle: true};
CM.ConfigData.ToolWarnConjure = {type: 'bool', group: 'Tooltip', label: ['Tooltip Conjure Warning OFF', 'Tooltip Conjure Warning ON'], desc: 'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards', toggle: true};
CM.ConfigData.ToolWarnPos = {type: 'bool', group: 'Tooltip', label: ['Tooltip Warning Position (Left)', 'Tooltip Warning Position (Bottom)'], desc: 'Placement of the warning boxes', toggle: false, func: function() {CM.Disp.ToggleToolWarnPos();}};
CM.ConfigData.TooltipGrim = {type: 'bool', group: 'Tooltip', label: ['Grimoire Tooltip Information OFF', 'Grimoire Tooltip Information ON'], desc: 'Extra information in tooltip for grimoire', toggle: true};
CM.ConfigData.ToolWrink = {type: 'bool', group: 'Tooltip', label: ['Wrinkler Tooltip OFF', 'Wrinkler Tooltip ON'], desc: 'Shows the amount of cookies a wrinkler will give when popping it', toggle: true};
CM.ConfigData.TooltipLump = {type: 'bool', group: 'Tooltip', label: ['Sugar Lump Tooltip OFF', 'Sugar Lump Tooltip ON'], desc: 'Shows the current Sugar Lump type in Sugar lump tooltip.', toggle: true};
CM.ConfigData.DragonAuraInfo = {type: 'bool', group: 'Tooltip', label: ['Extra Dragon Aura Info OFF', 'Extra Dragon Aura Info ON'], desc: 'Shows information about changes in CPS and costs in the dragon aura interface.', toggle: true};

// Statistics
CM.ConfigData.Stats = {type: 'bool', group: 'Statistics', label: ['Statistics OFF', 'Statistics ON'], desc: 'Extra Cookie Monster statistics!', toggle: true};
CM.ConfigData.MissingUpgrades = {type: 'bool', group: 'Statistics', label: ['Missing Upgrades OFF', 'Missing Upgrades ON'], desc: 'Shows Missing upgrades in Stats Menu. This feature can be laggy for users with a low amount of unlocked achievements.', toggle: true};
CM.ConfigData.UpStats = {type: 'bool', group: 'Statistics', label: ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'], desc: 'Default Game rate is once every 5 seconds', toggle: false};
CM.ConfigData.TimeFormat = {type: 'bool', group: 'Statistics', label: ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'], desc: 'Change the time format', toggle: false};
CM.ConfigData.DetailedTime = {type: 'bool', group: 'Statistics', label: ['Detailed Time OFF', 'Detailed Time ON'], desc: 'Change how time is displayed in certain statistics and tooltips', toggle: true, func: function() {CM.Disp.ToggleDetailedTime();}};
CM.ConfigData.GrimoireBar = {type: 'bool', group: 'Statistics', label: ['Grimoire Magic Meter Timer OFF', 'Grimoire Magic Meter Timer ON'], desc: 'A timer on how long before the Grimoire magic meter is full', toggle: true};

// Statistics
CM.ConfigData.Scale = {type: 'bool', group: 'Other', label: ['Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation', 'Engineering Notation'], desc: 'Change how long numbers are handled', toggle: false, func: function() {CM.Disp.RefreshScale();}};

