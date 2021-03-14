/**
 * This function calculates the total price for buying "increase" of a building
 * Base Game does not currently allow this
 * It is called by CM.Cache.CacheBuildingsPrices() and CM.Disp.Tooltip()
 * @param	{string}	build		Name of the building
 * @param	{number}	basePrice	Base Price of building
 * @param	{number}	start		Starting amount of building
 * @param	{number}	free		Free amount of building
 * @param	{number}	increase	Increase of building
 * @returns {number}	moni		Total price
 */
export default function BuildingGetPrice(
  build,
  basePrice,
  start,
  free,
  increase,
) {
  let moni = 0;
  for (let i = 0; i < increase; i++) {
    let price = basePrice * Game.priceIncrease ** Math.max(0, start - free);
    price = Game.modifyBuildingPrice(build, price);
    price = Math.ceil(price);
    moni += price;
    start++;
  }
  return moni;
}
