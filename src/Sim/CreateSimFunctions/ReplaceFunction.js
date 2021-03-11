import {
	SimAchievements,
	SimAuraMult, SimEff, SimGetTieredCpsMult, SimHas, SimObjects,
} from '../VariablesAndData';

/**
 * This functions helps create functions that check sim data
 * For example, instead of Game.Has, a function that has gone through CM.Sim.ReplaceFunction will use CM.Sim.Has()
 * Subsequently the function rather than checking Game.Upgrades, will check CM.Sim.Upgrades
 *
 * It is called by CM.Sim.ReplaceRelevantFunctions()
 * @param	{function}	funcToBeReplaced	Function to be replaced
 * @returns {string}						The function in string form with only calls to CM.Sim
 */
export default function ReplaceFunction(funcToBeReplaced) {
	return funcToBeReplaced.toString()
		.split('Game.Upgrades[') // Include '[' to not replace Game.UpgradesByPool
		.join('CM.Sim.Upgrades[')
		.split('Game.Achievements')
		.join(SimAchievements)
		.split('Game.Has')
		.join(`${SimHas}`)
		.split('Game.dragonAura]')
		.join('CM.Sim.dragonAura]')
		.split('Game.dragonAura2]')
		.join('CM.Sim.dragonAura2]')
		.split('Game.auraMult')
		.join(SimAuraMult)
		.split('Game.hasGod')
		.join('CM.Sim.hasGod')
		.split('Game.effs') // Replaces code in the Pantheon minigame
		.join('CM.Sim.effs')
		.split('Game.Objects')
		.join(SimObjects)
		.split('Game.GetTieredCpsMult') // Replace in .cps of building objects
		.join(SimGetTieredCpsMult)
		.split('Game.eff') // Replace in .cps of building objects
		.join(SimEff);
	// .split('syn.buildingTie1.amount')
	// .join('CM.Sim.Objects[syn.buildingTie1.name].amount')
	// .split('syn.buildingTie2.amount')
	// .join('CM.Sim.Objects[syn.buildingTie2.name].amount')
}
