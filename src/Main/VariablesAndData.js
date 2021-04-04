export let LastModCount;
export let TooltipBuildBackup = []; // eslint-disable-line prefer-const
export let TooltipLumpBackup;
export let TooltipGrimoireBackup = []; // eslint-disable-line prefer-const
export let TooltipUpgradeBackup = []; // eslint-disable-line prefer-const
export let BackupGrimoireLaunch;
export let BackupGrimoireLaunchMod;
export let BackupGrimoireDraw;
export let HasReplaceNativeGrimoireLaunch;
export let HasReplaceNativeGrimoireDraw;
export let LoadMinigames;
export let BackupFunctions = {}; // eslint-disable-line prefer-const

export let LastSeasonPopupState;
export let LastTickerFortuneState;
export let LastGardenNextStep;
export let LastGoldenCookieState;
export let LastSpawnedGoldenCookieState;
export let LastMagicBarFull;
export let CurrSpawnedGoldenCookieState;
export let LastWrinklerCount;

/** Stores the date at Game.CalculateGains for God Cyclius
 */
export let CycliusDateAtBeginLoop = Date.now(); // eslint-disable-line prefer-const

/** Stores the date at Game.CalculateGains for the Century egg
 */
export let CenturyDateAtBeginLoop = Date.now(); // eslint-disable-line prefer-const
