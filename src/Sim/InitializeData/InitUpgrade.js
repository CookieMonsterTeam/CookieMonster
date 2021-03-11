import ReplaceFunction from '../CreateSimFunctions/ReplaceFunction';

/**
 * This function constructs an object with the static properties of an upgrade
 * @param	{string}	upgradeName		Name of the Upgrade
 * @returns {Object}	you				The static object
 */
export default function InitUpgrade(upgradeName) {
	const me = Game.Upgrades[upgradeName];
	const you = {};
	// Some upgrades have a function for .power (notably the valentine cookies)
	you.power = me.power;
	if (typeof (me.power) === 'function') {
		me.power = new Function(`return ${ReplaceFunction(me.power)}`)();
	}
	you.pool = me.pool;
	you.name = me.name;
	return you;
}
