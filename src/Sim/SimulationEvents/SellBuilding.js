import SimGetSellMultiplier from '../ReplacedGameFunctions/SimGetSellMultiplier';
import SimModifyBuildingPrice from '../ReplacedGameFunctions/SimModifyBuidlingPrice';

/**
 * This function calculates the cookies returned for selling a building
 * Base Game does not do this correctly
 * @param	{string}	build		Name of the building
 * @param	{number}	basePrice	Base Price of building
 * @param	{number}	start		Starting amount of building
 * @param	{number}	free		Free amount of building
 * @param	{number}	increase	Increase of building
 * @param	{number}	noSim		1 of 0 depending on if function is called from CM.Sim
 * @returns {number}	moni		Total price gained
 */
export default function BuildingSell(build, basePrice, start, free, amount, noSim) {
  // Calculate money gains from selling buildings
  // If noSim is set, use Game methods to compute price instead of Sim ones.
  const noSimRes = typeof noSim === 'undefined' ? 0 : noSim;
  let toChange = amount;
  let startingAmount = start;
  let moni = 0;
  if (amount === -1) toChange = startingAmount;
  if (!amount) toChange = Game.buyBulk;
  for (let i = 0; i < toChange; i++) {
    let price = basePrice * Game.priceIncrease ** Math.max(0, startingAmount - free);
    price = noSimRes
      ? Game.modifyBuildingPrice(build, price)
      : SimModifyBuildingPrice(build, price);
    price = Math.ceil(price);
    const giveBack = noSimRes ? build.getSellMultiplier() : SimGetSellMultiplier();
    price = Math.floor(price * giveBack);
    if (startingAmount > 0) {
      moni += price;
      startingAmount -= 1;
    }
  }
  return moni;
}
