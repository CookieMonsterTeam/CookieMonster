/* eslint-disable prefer-const */

export let CacheDragonAura = 0;
export let CacheDragonAura2 = 0;
export let CacheLastDragonLevel = 0;
export let CacheCostDragonUpgrade = 0;
export let CacheLucky = 0;
export let CacheLuckyReward = 0;
export let CacheLuckyWrathReward = 0;
export let CacheLuckyFrenzy = 0;
export let CacheLuckyRewardFrenzy = 0;
export let CacheLuckyWrathRewardFrenzy = 0;
export let CacheConjure = 0;
export let CacheConjureReward = 0;
export let CacheEdifice = 0;
export let CacheEdificeBuilding = 0;
export let CacheNoGoldSwitchCookiesPS = 0;
export let CacheDragonsFortuneMultAdjustment = 1;
export let CacheGoldenCookiesMult = 1;
export let CacheWrathCookiesMult = 1;

export let CacheHCPerSecond = 0;

export let CacheCentEgg = 0;
export let CacheSeaSpec = 0;
export let CacheLastChoEgg = 0;

export let CacheObjects1 = {};
export let CacheObjects10 = {};
export let CacheObjects100 = {};
export let CacheObjectsNextAchievement = {};

export let CacheWrinklersTotal = 0;
export let CacheWrinklersNormal = 0;
export let CacheWrinklersFattest = [0, null];

export let CacheCurrWrinklerCPSMult = 0;
export let CacheCurrWrinklerCount = 0;

export let CacheUpgrades = {};

export let CacheAverageClicks = {};
export let CacheAverageCookiesFromClicks;

export let CacheMissingUpgrades = {};
export let CacheMissingUpgradesPrestige = {};
export let CacheMissingUpgradesCookies = {};

export let CacheChainRequired = 0;
export let CacheChainRequiredNext = 0;
export let CacheChainMaxReward = [];
export let CacheChainWrathRequired = 0;
export let CacheChainWrathRequiredNext = 0;
export let CacheChainWrathMaxReward = [];
export let CacheChainFrenzyRequired = 0;
export let CacheChainFrenzyRequiredNext = 0;
export let CacheChainFrenzyMaxReward = [];
export let CacheChainFrenzyWrathRequired = 0;
export let CacheChainFrenzyWrathRequiredNext = 0;
export let CacheChainFrenzyWrathMaxReward = [];

export let CacheRealCookiesEarned = 0;
export let CacheAvgCPSWithChoEgg = 0;

export let CacheSpawnedGoldenShimmer = {};
export let CacheSeasonPopShimmer = {};

export let CacheTimeTillNextPrestige = 0;

/** Stores lowest PP value */
export let CacheMinPP = 0;
/** Stores lowest PP value category */
export let CacheMinPPBulk = 0;
/** Stores all PP values of all buildings for all buy settings (1, 10, 100) */
export let CachePPArray = [];

export let CacheGoldenShimmersByID = {};

export let CacheSellForChoEgg = 0;

export let CookiesDiff;
export let WrinkDiff;
export let WrinkFattestDiff;
export let ChoEggDiff;
export let ClicksDiff;
export let HeavenlyChipsDiff;

export let CacheLastCPSCheck;
export let CacheLastCookies;
export let CacheLastWrinkCookies;
export let CacheLastWrinkFattestCookies;
export let CacheLastClicks;

export let CacheAverageGainBank;
export let CacheAverageGainWrink;
export let CacheAverageGainWrinkFattest;
export let CacheAverageGainChoEgg;
export let CacheAverageCPS;

export let CacheLastHeavenlyCheck;
export let CacheLastHeavenlyChips;

export let CacheDoRemakeBuildPrices;

export let CacheHadBuildAura;

/** Store the CPS effect of each god if it was put into each slot */
export let CacheGods = {
  0: [0, 0, 0],
  1: [0, 0, 0],
  2: [0, 0, 0],
  3: [0, 0, 0],
  4: [0, 0, 0],
  5: [0, 0, 0],
  6: [0, 0, 0],
  7: [0, 0, 0],
  8: [0, 0, 0],
  9: [0, 0, 0],
  10: [0, 0, 0],
};
