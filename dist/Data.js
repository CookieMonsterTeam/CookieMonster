(()=>{"use strict";const o=function(o){if(1===o){const o=function(){try{Notification.requestPermission().then()}catch(o){return!1}return!0};"Notification"in window?o()?Notification.requestPermission().then():Notification.requestPermission():console.log("This browser does not support notifications.")}};class e{constructor(o,e){this.type=o,this.group=e}}class i extends e{constructor(o,e,i,n,t,a=null){super(o,e),this.label=i,this.desc=n,this.toggle=t,a&&(this.func=a)}}class n extends e{constructor(o,e,i,n){super(o,e),this.label=i,this.desc=n;for(let o=0;o<101;o++)this.label[o]=`${o}%`}}class t extends e{constructor(o,e,i,n,t,a){super(o,e),this.label=i,this.desc=n,this.min=t,this.max=a}}const a={Config:{BotBar:new i("bool","BarsColors",["Bottom Bar OFF","Bottom Bar ON"],"Building Information",!0,(function(){CM.Disp.ToggleBotBar()})),TimerBar:new i("bool","BarsColors",["Timer Bar OFF","Timer Bar ON"],"Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy",!0,(function(){CM.Disp.ToggleTimerBar()})),TimerBarPos:new i("bool","BarsColors",["Timer Bar Position (Top Left)","Timer Bar Position (Bottom)"],"Placement of the Timer Bar",!1,(function(){CM.Disp.ToggleTimerBarPos()})),TimerBarOverlay:new i("bool","BarsColors",["Timer Bar Overlay OFF","Timer Bar Overlay Only Seconds","Timer Bar Overlay Full"],"Overlay on timers displaying seconds and/or percentage left",!0),SortBuildings:new i("bool","BarsColors",["Sort Buildings: Default","Sort Buildings: PP"],"Sort the display of buildings in either default order or by PP",!1,(function(){CM.Disp.UpdateBuildings()})),SortUpgrades:new i("bool","BarsColors",["Sort Upgrades: Default","Sort Upgrades: PP"],"Sort the display of upgrades in either default order or by PP",!1,(function(){CM.Disp.UpdateUpgrades()})),BuildColor:new i("bool","BarsColors",["Building Colors OFF","Building Colors ON"],"Color code buildings",!0,(function(){CM.Disp.UpdateBuildings()})),BulkBuildColor:new i("bool","BarsColors",["Bulk Building Colors (Single Building Color)","Bulk Building Colors (Calculated Bulk Color)"],"Color code bulk buildings based on single buildings color or calculated bulk value color",!1,(function(){CM.Disp.UpdateBuildings()})),UpBarColor:new i("bool","BarsColors",["Upgrade Colors/Bar OFF","Upgrade Colors with Bar ON","Upgrade Colors without Bar ON"],"Color code upgrades and optionally add a counter bar",!1,(function(){CM.Disp.ToggleUpgradeBarAndColor()})),Colors:new class extends e{constructor(o,e,i,n){super(o,e),this.desc=i,this.func=n}}("color","BarsColors",{Blue:"Color Blue.  Used to show better than best PP building, for Click Frenzy bar, and for various labels",Green:"Color Green.  Used to show best PP building, for Blood Frenzy bar, and for various labels",Yellow:"Color Yellow.  Used to show between best and worst PP buildings closer to best, for Frenzy bar, and for various labels",Orange:"Color Orange.  Used to show between best and worst PP buildings closer to worst, for Next Reindeer bar, and for various labels",Red:"Color Red.  Used to show worst PP building, for Clot bar, and for various labels",Purple:"Color Purple.  Used to show worse than worst PP building, for Next Cookie bar, and for various labels",Gray:"Color Gray.  Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar",Pink:"Color Pink.  Used for Dragonflight bar",Brown:"Color Brown.  Used for Dragon Harvest bar"},(function(){CM.Disp.UpdateColors()})),UpgradeBarFixedPos:new i("bool","BarsColors",["Upgrade Bar Fixed Position OFF","Upgrade Bar Fixed Position ON"],"Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling",!0,(function(){CM.Disp.ToggleUpgradeBarFixedPos()})),CalcWrink:new i("bool","Calculation",["Calculate with Wrinklers OFF","Calculate with Wrinklers ON","Calculate with Single Fattest Wrinkler ON"],"Calculate times and average Cookies Per Second with (only the single non-shiny fattest) Wrinklers",!0),CPSMode:new i("bool","Calculation",["Current Cookies Per Second","Average Cookies Per Second"],"Calculate times using current Cookies Per Second or average Cookies Per Second",!1),AvgCPSHist:new i("bool","Calculation",["Average CPS for past 10s","Average CPS for past 15s","Average CPS for past 30s","Average CPS for past 1m","Average CPS for past 5m","Average CPS for past 10m","Average CPS for past 15m","Average CPS for past 30m"],"How much time average Cookies Per Second should consider",!1),AvgClicksHist:new i("bool","Calculation",["Average Cookie Clicks for past 1s","Average Cookie Clicks for past 5s","Average Cookie Clicks for past 10s","Average Cookie Clicks for past 15s","Average Cookie Clicks for past 30s"],"How much time average Cookie Clicks should consider",!1),ColorPPBulkMode:new i("bool","Calculation",["Color of PP (Compared to Single)","Color of PP (Compared to Bulk)"],"Color PP-values based on comparison with single purchase or with selected bulk-buy mode",!1,(function(){CM.Cache.CachePP()})),PPExcludeTop:new i("bool","Calculation",["Don't Ignore Any","Ignore 1st Best","Ignore 1st and 2nd Best","Ignore 1st, 2nd and 3rd Best"],"Makes CookieMonster ignore the 1st, 2nd or 3rd best buildings in labeling and colouring PP values",!0),PPSecondsLowerLimit:new t("numscale","Calculation","Lower limit for PP (in seconds): ",'If a building or upgrade costs less than the specified seconds of CPS it will also be considered optimal and label it as such ("PP is less than xx seconds of CPS"); setting to 0 ignores this option',0,1/0),PPOnlyConsiderBuyable:new i("bool","Calculation",["Don't Ignore Non-Buyable","Ignore Non-Buyable"],"Makes CookieMonster label buildings and upgrades you can't buy right now red, useful in those situations where you just want to spend your full bank 'most optimally'",!0),ToolWarnBon:new i("bool","Calculation",["Calculate Tooltip Warning With Bonus CPS OFF","Calculate Tooltip Warning With Bonus CPS ON"],"Calculate the warning with or without the bonus CPS you get from buying",!0),Title:new i("bool","NotificationGeneral",["Title OFF","Title ON","Title Pinned Tab Highlight"],'Update title with Golden Cookie/Season Popup timers; pinned tab highlight only changes the title when a Golden Cookie/Season Popup spawns; "!" means that Golden Cookie/Reindeer can spawn',!0),GeneralSound:new i("bool","NotificationGeneral",["Consider Game Volume Setting OFF","Consider Game Volume Setting ON"],'Turning this toggle to "off" makes Cookie Monster no longer consider the volume setting of the base game, allowing mod notifications to play with base game volume turned down',!0),GCNotification:new i("bool","NotificationGC",["Notification OFF","Notification ON"],"Create a notification when Golden Cookie spawns",!0,(function(){o(CM.Options.GCNotification)})),GCFlash:new i("bool","NotificationGC",["Flash OFF","Flash ON"],"Flash screen on Golden Cookie",!0),GCSound:new i("bool","NotificationGC",["Sound OFF","Sound ON"],"Play a sound on Golden Cookie",!0),GCVolume:new n("vol","NotificationGC",[],"Volume"),GCSoundURL:new i("url","NotificationGC","Sound URL:","URL of the sound to be played when a Golden Cookie spawns"),FortuneNotification:new i("bool","NotificationFC",["Notification OFF","Notification ON"],"Create a notification when Fortune Cookie is on the Ticker",!0,(function(){o(CM.Options.FortuneNotification)})),FortuneFlash:new i("bool","NotificationFC",["Flash OFF","Flash ON"],"Flash screen on Fortune Cookie",!0),FortuneSound:new i("bool","NotificationFC",["Sound OFF","Sound ON"],"Play a sound on Fortune Cookie",!0),FortuneVolume:new n("vol","NotificationFC",[],"Volume"),FortuneSoundURL:new i("url","NotificationFC","Sound URL:","URL of the sound to be played when the Ticker has a Fortune Cookie"),SeaNotification:new i("bool","NotificationSea",["Notification OFF","Notification ON"],"Create a notification on Season Popup",!0,(function(){o(CM.Options.SeaNotification)})),SeaFlash:new i("bool","NotificationSea",["Flash OFF","Flash ON"],"Flash screen on Season Popup",!0),SeaSound:new i("bool","NotificationSea",["Sound OFF","Sound ON"],"Play a sound on Season Popup",!0),SeaVolume:new n("vol","NotificationSea",[],"Volume"),SeaSoundURL:new i("url","NotificationSea","Sound URL:","URL of the sound to be played when a Season Special spawns"),GardFlash:new i("bool","NotificationGard",["Garden Tick Flash OFF","Flash ON"],"Flash screen on Garden Tick",!0),GardSound:new i("bool","NotificationGard",["Sound OFF","Sound ON"],"Play a sound on Garden Tick",!0),GardVolume:new n("vol","NotificationGard",[],"Volume"),GardSoundURL:new i("url","NotificationGard","Garden Tick Sound URL:","URL of the sound to be played when the garden ticks"),MagicNotification:new i("bool","NotificationMagi",["Notification OFF","Notification ON"],"Create a notification when magic reaches maximum",!0,(function(){o(CM.Options.MagicNotification)})),MagicFlash:new i("bool","NotificationMagi",["Flash OFF","Flash ON"],"Flash screen when magic reaches maximum",!0),MagicSound:new i("bool","NotificationMagi",["Sound OFF","Sound ON"],"Play a sound when magic reaches maximum",!0),MagicVolume:new n("vol","NotificationMagi",[],"Volume"),MagicSoundURL:new i("url","NotificationMagi","Sound URL:","URL of the sound to be played when magic reaches maxium"),WrinklerNotification:new i("bool","NotificationWrink",["Notification OFF","Notification ON"],"Create a notification when a Wrinkler appears",!0,(function(){o(CM.Options.WrinklerNotification)})),WrinklerFlash:new i("bool","NotificationWrink",["Flash OFF","Flash ON"],"Flash screen when a Wrinkler appears",!0),WrinklerSound:new i("bool","NotificationWrink",["Sound OFF","Sound ON"],"Play a sound when a Wrinkler appears",!0),WrinklerVolume:new n("vol","NotificationWrink",[],"Volume"),WrinklerSoundURL:new i("url","NotificationWrink","Sound URL:","URL of the sound to be played when a Wrinkler appears"),WrinklerMaxNotification:new i("bool","NotificationWrinkMax",["Notification OFF","Notification ON"],"Create a notification when the maximum amount of Wrinklers has appeared",!0,(function(){o(CM.Options.WrinklerMaxNotification)})),WrinklerMaxFlash:new i("bool","NotificationWrinkMax",["Flash OFF","Flash ON"],"Flash screen when the maximum amount of Wrinklers has appeared",!0),WrinklerMaxSound:new i("bool","NotificationWrinkMax",["Sound OFF","Sound ON"],"Play a sound when the maximum amount of Wrinklers has appeared",!0),WrinklerMaxVolume:new n("vol","NotificationWrinkMax",[],"Volume"),WrinklerMaxSoundURL:new i("url","NotificationWrinkMax","Sound URL:","URL of the sound to be played when the maximum amount of Wrinklers has appeared"),TooltipBuildUpgrade:new i("bool","Tooltip",["Building/Upgrade Tooltip Information OFF","Building/Upgrade  Tooltip Information ON"],"Extra information in Building/Upgrade tooltips",!0),TooltipAmor:new i("bool","Tooltip",["Buildings Tooltip Amortization Information OFF","Buildings Tooltip Amortization Information ON"],"Add amortization information to buildings tooltip",!0),ToolWarnLucky:new i("bool","Tooltip",["Tooltip Lucky Warning OFF","Tooltip Lucky Warning ON"],'A warning when buying if it will put the bank under the amount needed for max "Lucky!" rewards',!0),ToolWarnLuckyFrenzy:new i("bool","Tooltip",["Tooltip Lucky Frenzy Warning OFF","Tooltip Lucky Frenzy Warning ON"],'A warning when buying if it will put the bank under the amount needed for max "Lucky!" (Frenzy) rewards',!0),ToolWarnConjure:new i("bool","Tooltip",["Tooltip Conjure Warning OFF","Tooltip Conjure Warning ON"],'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards',!0),ToolWarnConjureFrenzy:new i("bool","Tooltip",["Tooltip Conjure Frenzy Warning OFF","Tooltip Conjure Frenzy Warning ON"],'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards with Frenzy active',!0),ToolWarnEdifice:new i("bool","Tooltip",["Tooltip Edifice Warning OFF","Tooltip Edifice Warning ON"],'A warning when buying if it will put the bank under the amount needed for "Spontaneous Edifice" to possibly give you your most expensive building',!0),ToolWarnUser:new t("numscale","Tooltip","Tooltip Warning At x times CPS: ","Use this to show a customized warning if buying it will put the bank under the amount equal to value times cps; setting to 0 disables the function altogether",0,1/0),ToolWarnPos:new i("bool","Tooltip",["Tooltip Warning Position (Left)","Tooltip Warning Position (Bottom)"],"Placement of the warning boxes",!1,(function(){CM.Disp.ToggleToolWarnPos()})),TooltipGrim:new i("bool","Tooltip",["Grimoire Tooltip Information OFF","Grimoire Tooltip Information ON"],"Extra information in tooltip for grimoire",!0),TooltipWrink:new i("bool","Tooltip",["Wrinkler Tooltip OFF","Wrinkler Tooltip ON"],"Shows the amount of cookies a wrinkler will give when popping it",!0),TooltipLump:new i("bool","Tooltip",["Sugar Lump Tooltip OFF","Sugar Lump Tooltip ON"],"Shows the current Sugar Lump type in Sugar lump tooltip.",!0),TooltipPlots:new i("bool","Tooltip",["Garden Plots Tooltip OFF","Garden Plots Tooltip ON"],"Shows a tooltip for plants that have a cookie reward.",!0),DragonAuraInfo:new i("bool","Tooltip",["Extra Dragon Aura Info OFF","Extra Dragon Aura Info ON"],"Shows information about changes in CPS and costs in the dragon aura interface.",!0),TooltipAscendButton:new i("bool","Tooltip",["Show Extra Info Ascend Tooltip OFF","Show Extra Info Ascend Tooltip ON"],"Shows additional info in the ascend tooltip",!0),Stats:new i("bool","Statistics",["Statistics OFF","Statistics ON"],"Extra Cookie Monster statistics!",!0),MissingUpgrades:new i("bool","Statistics",["Missing Upgrades OFF","Missing Upgrades ON"],"Shows Missing upgrades in Stats Menu. This feature can be laggy for users with a low amount of unlocked achievements.",!0),UpStats:new i("bool","Statistics",["Statistics Update Rate (Default)","Statistics Update Rate (1s)"],"Default Game rate is once every 5 seconds",!1),TimeFormat:new i("bool","Statistics",["Time XXd, XXh, XXm, XXs","Time XX:XX:XX:XX:XX"],"Change the time format",!1),DetailedTime:new i("bool","Statistics",["Detailed Time OFF","Detailed Time ON"],"Change how time is displayed in certain statistics and tooltips",!0,(function(){CM.Disp.ToggleDetailedTime()})),GrimoireBar:new i("bool","Statistics",["Grimoire Magic Meter Timer OFF","Grimoire Magic Meter Timer ON"],"A timer on how long before the Grimoire magic meter is full",!0),HeavenlyChipsTarget:new t("numscale","Statistics","Heavenly Chips Target: ",'Use this to set a Heavenly Chips target that will be counted towards in the "prestige" statsistics sections',1,1/0),ShowMissedGC:new i("bool","Statistics",["Missed GC OFF","Missed GC ON"],"Show a stat in the statistics screen that counts how many Golden Cookies you have missed",!0),Scale:new i("bool","Notation",["Game's Setting Scale","Metric","Short Scale","Short Scale (Abbreviated)","Scientific Notation","Engineering Notation"],"Change how long numbers are handled",!1,(function(){CM.Disp.RefreshScale()})),ScaleDecimals:new i("bool","Notation",["1 decimals","2 decimals","3 decimals"],"Set the number of decimals used when applicable",!1,(function(){CM.Disp.RefreshScale()})),ScaleSeparator:new i("bool","Notation",[". for decimals (Standard)",". for thousands"],"Set the separator used for decimals and thousands",!1,(function(){CM.Disp.RefreshScale()})),ScaleCutoff:new t("numscale","Notation","Notation Cut-off Point: ","The number from which CookieMonster will start formatting numbers based on chosen scale. Standard is 999,999. Setting this above 999,999,999 might break certain notations",1,999999999),GCTimer:new i("bool","Miscellaneous",["Golden Cookie Timer OFF","Golden Cookie Timer ON"],"A timer on the Golden Cookie when it has been spawned",!0,(function(){CM.Disp.ToggleGCTimer()})),Favicon:new i("bool","Miscellaneous",["Favicon OFF","Favicon ON"],"Update favicon with Golden/Wrath Cookie",!0,(function(){CM.Disp.UpdateFavicon()})),WrinklerButtons:new i("bool","Miscellaneous",["Extra Buttons OFF","Extra Buttons ON"],"Show buttons for popping wrinklers at bottom of cookie section",!0,(function(){CM.Disp.UpdateWrinklerButtons()})),BulkBuyBlock:new i("bool","Miscellaneous",["Block Bulk Buying OFF","Block Bulk Buying ON"],"Block clicking bulk buying when you can't buy all. This prevents buying 7 of a building when you are in buy-10 or buy-100 mode.",!0)},ConfigDefault:{BotBar:1,TimerBar:1,TimerBarPos:0,TimerBarOverlay:2,BuildColor:1,BulkBuildColor:0,UpBarColor:1,UpgradeBarFixedPos:1,CalcWrink:0,CPSMode:1,AvgCPSHist:3,AvgClicksHist:0,ColorPPBulkMode:1,PPExcludeTop:0,PPSecondsLowerLimit:0,PPOnlyConsiderBuyable:0,ToolWarnBon:0,Title:1,GeneralSound:1,GCNotification:0,GCFlash:1,GCSound:1,GCVolume:100,GCSoundURL:"https://freesound.org/data/previews/66/66717_931655-lq.mp3",FortuneNotification:0,FortuneFlash:1,FortuneSound:1,FortuneVolume:100,FortuneSoundURL:"https://freesound.org/data/previews/174/174027_3242494-lq.mp3",SeaNotification:0,SeaFlash:1,SeaSound:1,SeaVolume:100,SeaSoundURL:"https://www.freesound.org/data/previews/121/121099_2193266-lq.mp3",GardFlash:1,GardSound:1,GardVolume:100,GardSoundURL:"https://freesound.org/data/previews/103/103046_861714-lq.mp3",MagicNotification:0,MagicFlash:1,MagicSound:1,MagicVolume:100,MagicSoundURL:"https://freesound.org/data/previews/221/221683_1015240-lq.mp3",WrinklerNotification:0,WrinklerFlash:1,WrinklerSound:1,WrinklerVolume:100,WrinklerSoundURL:"https://freesound.org/data/previews/124/124186_8043-lq.mp3",WrinklerMaxNotification:0,WrinklerMaxFlash:1,WrinklerMaxSound:1,WrinklerMaxVolume:100,WrinklerMaxSoundURL:"https://freesound.org/data/previews/152/152743_15663-lq.mp3",TooltipBuildUpgrade:1,TooltipAmor:0,ToolWarnLucky:1,ToolWarnLuckyFrenzy:1,ToolWarnConjure:1,ToolWarnConjureFrenzy:1,ToolWarnEdifice:1,ToolWarnUser:0,ToolWarnPos:1,TooltipGrim:1,TooltipWrink:1,TooltipLump:1,TooltipPlots:1,DragonAuraInfo:1,TooltipAscendButton:1,Stats:1,MissingUpgrades:1,UpStats:1,TimeFormat:0,DetailedTime:1,GrimoireBar:1,HeavenlyChipsTarget:1,ShowMissedGC:1,Scale:2,ScaleDecimals:2,ScaleSeparator:0,ScaleCutoff:999999,Colors:{Blue:"#4bb8f0",Green:"#00ff00",Yellow:"#ffff00",Orange:"#ff7f00",Red:"#ff0000",Purple:"#ff00ff",Gray:"#b3b3b3",Pink:"#ff1493",Brown:"#8b4513"},SortBuildings:0,SortUpgrades:0,GCTimer:1,Favicon:1,WrinklerButtons:1,BulkBuyBlock:0,Header:{BarsColors:1,Calculation:1,Notification:1,NotificationGeneral:1,NotificationGC:1,NotificationFC:1,NotificationSea:1,NotificationGard:1,NotificationMagi:1,NotificationWrink:1,NotificationWrinkMax:1,Tooltip:1,Statistics:1,Notation:1,Miscellaneous:1,Lucky:1,Chain:1,Spells:1,Garden:1,Prestige:1,Wrink:1,Sea:1,Misc:1,InfoTab:1}},Fortunes:["Fortune #001","Fortune #002","Fortune #003","Fortune #004","Fortune #005","Fortune #006","Fortune #007","Fortune #008","Fortune #009","Fortune #010","Fortune #011","Fortune #012","Fortune #013","Fortune #014","Fortune #015","Fortune #016","Fortune #017","Fortune #018","Fortune #100","Fortune #101","Fortune #102","Fortune #103","Fortune #104"],HalloCookies:["Skull cookies","Ghost cookies","Bat cookies","Slime cookies","Pumpkin cookies","Eyeball cookies","Spider cookies"],ChristCookies:["Christmas tree biscuits","Snowflake biscuits","Snowman biscuits","Holly biscuits","Candy cane biscuits","Bell biscuits","Present biscuits"],ValCookies:["Pure heart biscuits","Ardent heart biscuits","Sour heart biscuits","Weeping heart biscuits","Golden heart biscuits","Eternal heart biscuits","Prism heart biscuits"],PlantDrops:["Elderwort biscuits","Bakeberry cookies","Duketater cookies","Green yeast digestives","Wheat slims","Fern tea","Ichor syrup"],Effects:{buildingCost:"Building prices",click:"Cookies per click",cps:"Total CPS",cursorCps:"Cursor CPS",goldenCookieDur:"Golden cookie duration",goldenCookieEffDur:"Golden cookie effect duration",goldenCookieFreq:"Golden cookie frequency",goldenCookieGain:"Golden cookie gains",grandmaCps:"Grandma CPS",itemDrops:"Random item drop chance",milk:"Effect from milk",reindeerDur:"Reindeer duration",reindeerFreq:"Reindeer frequency",reindeerGain:"Reindeer gains",upgradeCost:"Upgrade prices",wrathCookieDur:"Wrath cookie duration",wrathCookieEffDur:"Wrath cookie effect duration",wrathCookieFreq:"Wrath cookie frequency",wrathCookieGain:"Wrath cookie gains",wrinklerEat:"Wrinkler ",wrinklerSpawn:"Wrinkler spawn frequency"},ModDescription:'<div class="listing">\n <a href="https://github.com/Aktanusa/CookieMonster" target="blank">Cookie Monster</a>\n offers a wide range of tools and statistics to enhance your game experience.\n It is not a cheat interface – although it does offer helpers for golden cookies and such, everything can be toggled off at will to only leave how much information you want.</br>\n Progess on new updates and all previous release notes can be found on the GitHub page linked above!</br>\n Please also report any bugs you may find over there!</br>\n </div>\n ',LatestReleaseNotes:'<div class="listing">\n <b>The latest update (v 2.031.4) has introduced the following features:</b></br>\n - Added a changelog to the info tab and notification indicating a new version</br>\n - Warnings in tooltips are now based on the income after buying the upgrade</br>\n - A new warning and stat for Conjure Baked Goods in combination with Frenzy has been added</br>\n - User can now set a custom tooltip warning ("x times cps") in the settings</br>\n - Garden plots with plants that give cookies on harvest now display a tooltip with current and maximum reward</br>\n - The Harvest All button in the Garden now has a tooltip displaying the current reward </br>\n - The Ascend button can now display additional info (this can be turned off in the settings) </br>\n - The statistics page now displays the Heavenly Chips per second</br>\n - The statistics page now displays the CPS needed for the next level in Chain Cookies</br>\n - The statistics page now displays the cookies needed for optimal rewards for garden plants</br>\n - You can now set a Heavenly Chips target in the settings which will be counted down to in the statistics page</br>\n - The color picker in the settings has been updated to its latest version</br>\n - The overlay of seconds/percentage of timers is now toggle able and more readable</br>\n - You can now toggle to disable bulk-buying from buying less than the selected amount (i.e., buying 7 of a building by pressing the buy 10 when you don\'t have enough for 10)</br>\n - CookieMonster now uses the Modding API provided by the base game</br>\n - There is a new option that allows the decoupling of the base game volume setting and the volumes of sounds created by the mod</br>\n - The tab title now displays a "!" if a Golden Cookie or Reindeer can spawn</br>\n - PP calculation can now be set to: 1) Exclude the 1st, 2nd or 3rd most optimal building (if you never want to buy that it), 2) Always consider optimal buildings that cost below "xx seconds of CPS" (toggleable in the settings), 3) Ignore any building or upgrade that is not purchasable at the moment</br>\n </br>\n <b>This update fixes the following bugs:</b></br>\n - Minigames with enhanced tooltips will now also show these if the minigames were not loaded when CookieMonster was loaded</br>\n - Sound, Flashes and Notifications will no longer play when the mod is initializing</br>\n - The color picker should now update its display consistently</br>\n - Fixed some typo\'s</br>\n - Fixed a game breaking bug when the player had not purchased any upgrades</br>\n - Fixed a number of console errors thrown by CM</br>\n - Fixed the integration with mods that provide additional content, they should now no longer break CookieMonster</br>\n - The Timer bar will now disappear correctly when the Golden Switch has been activated</br>\n - Fixed errors in the calculation of the Chain Cookies and Wrinkler stats</br>\n - Fixed buy warnings showing incorrectly</br>\n </div>\n ',metric:["","","M","G","T","P","E","Z","Y"],shortScale:["","","M","B","Tr","Quadr","Quint","Sext","Sept","Oct","Non","Dec","Undec","Duodec","Tredec","Quattuordec","Quindec","Sexdec","Septendec","Octodec","Novemdec","Vigint","Unvigint","Duovigint","Trevigint","Quattuorvigint"],shortScaleAbbreviated:["","K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","De","UDe","DDe","TDe","QaDe","QiDe","SxDe","SpDe","ODe","NDe","Vi","UVi","DVi","TVi","QaVi","QiVi","SxVi","SpVi","OVi","NVi","Tr","UTr","DTr","TTr","QaTr","QiTr","SxTr","SpTr","OTr","NTr","Qaa","UQa","DQa","TQa","QaQa","QiQa","SxQa","SpQa","OQa","NQa","Qia","UQi","DQi","TQi","QaQi","QiQi","SxQi","SpQi","OQi","NQi","Sxa","USx","DSx","TSx","QaSx","QiSx","SxSx","SpSx","OSx","NSx","Spa","USp","DSp","TSp","QaSp","QiSp","SxSp","SpSp","OSp","NSp","Oco","UOc","DOc","TOc","QaOc","QiOc","SxOc","SpOc","OOc","NOc","Noa","UNo","DNo","TNo","QaNo","QiNo","SxNo","SpNo","ONo","NNo","Ct","UCt"],ConfigGroups:{BarsColors:"Bars/Colors",Calculation:"Calculation",Notification:"Notification",Tooltip:"Tooltips and additional insights",Statistics:"Statistics",Notation:"Notation",Miscellaneous:"Miscellaneous"},ConfigGroupsNotification:{NotificationGeneral:"General Notifications",NotificationGC:"Golden Cookie",NotificationFC:"Fortune Cookie",NotificationSea:"Season Special",NotificationGard:"Garden Tick",NotificationMagi:"Full Magic Bar",NotificationWrink:"Wrinkler",NotificationWrinkMax:"Maximum Wrinklers"}};CM.Data=a})();