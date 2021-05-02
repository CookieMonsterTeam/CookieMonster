import GetCPSBuffMult from '../CPS/GetCPSBuffMult';
import {
  CacheChainFrenzyMaxReward,
  CacheChainFrenzyRequired, // eslint-disable-line no-unused-vars
  CacheChainFrenzyRequiredNext, // eslint-disable-line no-unused-vars
  CacheChainFrenzyWrathMaxReward,
  CacheChainFrenzyWrathRequired, // eslint-disable-line no-unused-vars
  CacheChainFrenzyWrathRequiredNext, // eslint-disable-line no-unused-vars
  CacheChainMaxReward,
  CacheChainRequired, // eslint-disable-line no-unused-vars
  CacheChainRequiredNext, // eslint-disable-line no-unused-vars
  CacheChainWrathMaxReward,
  CacheChainWrathRequired, // eslint-disable-line no-unused-vars
  CacheChainWrathRequiredNext, // eslint-disable-line no-unused-vars
  CacheDragonsFortuneMultAdjustment,
  CacheGoldenCookiesMult,
  CacheNoGoldSwitchCookiesPS,
  CacheWrathCookiesMult,
} from '../VariablesAndData';

/**
 * This functions calculates the max possible payout given a set of variables
 * It is called by CM.Disp.CreateStatsChainSection() and CM.Cache.CacheChain()
 * @param	{number}					digit		Number of Golden Cookies in chain
 * @param	{number}					maxPayout	Maximum payout
 * @param	{number}					mult		Multiplier
 * @returns	[{number, number, number}]				Total cookies earned, cookie needed for this and next level
 */
export function MaxChainCookieReward(digit, maxPayout, mult) {
  let totalFromChain = 0;
  let moni = 0;
  let nextMoni = 0;
  let nextRequired = 0;
  let chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
  while (nextMoni < maxPayout * mult) {
    moni = Math.max(
      digit,
      Math.min(Math.floor((1 / 9) * 10 ** chain * digit * mult), maxPayout * mult),
    );
    nextMoni = Math.max(
      digit,
      Math.min(Math.floor((1 / 9) * 10 ** (chain + 1) * digit * mult), maxPayout * mult),
    );
    nextRequired = Math.floor((1 / 9) * 10 ** (chain + 1) * digit * mult);
    totalFromChain += moni;
    chain += 1;
  }
  return [totalFromChain, moni, nextRequired];
}

/**
 * This functions caches data related to Chain Cookies reward from Golden Cookioes
 * It is called by CM.Main.Loop() upon changes to cps and CM.Cache.InitCache()
 * @global	[{number, number}]	CM.Cache.ChainMaxReward			Total cookies earned, and cookies needed for next level for normal chain
 * @global	{number}			CM.Cache.ChainRequired			Cookies needed for maximum reward for normal chain
 * @global	{number}			CM.Cache.ChainRequiredNext		Total cookies needed for next level for normal chain
 * @global	[{number, number}]	CM.Cache.ChainMaxWrathReward			Total cookies earned, and cookies needed for next level for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequired			Cookies needed for maximum reward for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequiredNext		Total cookies needed for next level for wrath chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyMaxReward			Total cookies earned, and cookies needed for next level for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequired			Cookies needed for maximum reward for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequiredNext		Total cookies needed for next level for normal frenzy chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyWrathMaxReward			Total cookies earned, and cookies needed for next level for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequired			Cookies needed for maximum reward for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequiredNext		Total cookies needed for next level for wrath frenzy chain
 */
export function CacheChain() {
  let maxPayout = CacheNoGoldSwitchCookiesPS * 60 * 60 * 6 * CacheDragonsFortuneMultAdjustment;
  // Removes effect of Frenzy etc.
  const cpsBuffMult = GetCPSBuffMult();
  if (cpsBuffMult > 0) maxPayout /= cpsBuffMult;
  else maxPayout = 0;

  CacheChainMaxReward = MaxChainCookieReward(7, maxPayout, CacheGoldenCookiesMult);
  CacheChainRequired = (CacheChainMaxReward[1] * 2) / CacheGoldenCookiesMult;
  CacheChainRequiredNext = CacheChainMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;

  CacheChainWrathMaxReward = MaxChainCookieReward(6, maxPayout, CacheWrathCookiesMult);
  CacheChainWrathRequired = (CacheChainWrathMaxReward[1] * 2) / CacheWrathCookiesMult;
  CacheChainWrathRequiredNext =
    CacheChainWrathMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;

  CacheChainFrenzyMaxReward = MaxChainCookieReward(7, maxPayout * 7, CacheGoldenCookiesMult);
  CacheChainFrenzyRequired = (CacheChainFrenzyMaxReward[1] * 2) / CacheGoldenCookiesMult;
  CacheChainFrenzyRequiredNext =
    CacheChainFrenzyMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;

  CacheChainFrenzyWrathMaxReward = MaxChainCookieReward(6, maxPayout * 7, CacheWrathCookiesMult);
  CacheChainFrenzyWrathRequired = (CacheChainFrenzyWrathMaxReward[1] * 2) / CacheWrathCookiesMult;
  CacheChainFrenzyWrathRequiredNext =
    CacheChainFrenzyWrathMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;
}
