/* eslint-disable no-unused-vars */
import {
	SimAuraMult, SimEff, SimGetHeavenlyMultiplier, SimGetTieredCpsMult, SimHas, SimHasAchiev, SimHasAura,
} from '../VariablesAndData';
import ReplaceFunction from './ReplaceFunction';

/**
 * This functions creates all functions by CM.Sim to check the current Sim Data instead of Game data
 * It follows naming of the vanilla functions
 */
export default function CreateSimFunctions() {
	SimHas = new Function(`return ${ReplaceFunction(Game.Has)}`)();
	SimHasAchiev = new Function(`return ${ReplaceFunction(Game.HasAchiev)}`)();
	SimHasAura = new Function(`return ${ReplaceFunction(Game.hasAura)}`)();
	SimGetHeavenlyMultiplier = new Function(`return ${ReplaceFunction(Game.GetHeavenlyMultiplier)}`)();
	SimAuraMult = new Function(`return ${ReplaceFunction(Game.auraMult)}`)();
	SimEff = new Function(`return ${ReplaceFunction(Game.eff)}`)();
	SimGetTieredCpsMult = new Function(`return ${ReplaceFunction(Game.GetTieredCpsMult)}`)();
}
