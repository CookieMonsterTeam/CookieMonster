import SimGetTieredCpsMult from '../ReplacedGameFunctions/SimGetTieredCpsMult';

/**
 * This function constructs an object with the static properties of a building,
 * but with a 'cps' method changed to check sim data
 *
 * @param	{string}	buildingName	Name of the building
 * @returns {Object}	you				The static object
 */
export default function InitialBuildingData(buildingName) {
	const me = Game.Objects[buildingName];
	const you = {};
	you.cps = function (it) {
		let mult = 1;
		mult *= SimGetTieredCpsMult(it);
		mult *= Game.magicCpS(it.name);
		if (typeof it.baseCps === 'function') {
			return it.baseCps(it) * mult;
		}
		return it.baseCPS * mult;
	};
	// Below is needed for above eval, specifically for the GetTieredCpsMult function
	you.baseCps = me.baseCps;
	you.name = me.name;
	you.tieredUpgrades = me.tieredUpgrades;
	you.synergies = me.synergies;
	you.fortune = me.fortune;
	you.grandma = me.grandma;
	you.baseCPS = me.baseCps;
	you.id = me.id;
	you.vanilla = me.vanilla;
	return you;
}
