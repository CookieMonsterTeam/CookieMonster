/**
 * This function calculates the total price for buying "increase" of a building
 * @param	{string}	build		Name of the building
 * @param	{number}	basePrice	Base Price of building
 * @param	{number}	start		Starting amount of building
 * @param	{number}	free		Free amount of building
 * @param	{number}	increase	Increase of building
 * @returns {number}	moni		Total price
 */
export default function BuildingGetPrice(build, basePrice, start, free, increase) {
  let partialPrice = 0;
  for (let i = Math.max(0, start); i < Math.max(0, start + increase); i++) {
    partialPrice += Game.priceIncrease ** Math.max(0, i - free);
  }
  let price = basePrice * partialPrice;
  price = Game.modifyBuildingPrice(Game.Objects[build], price);
  return Math.ceil(price);
}
