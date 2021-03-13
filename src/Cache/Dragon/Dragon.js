/* eslint-disable no-unused-vars */
/** Functions related to the Dragon */

import { Beautify } from '../../Disp/BeautifyAndFormatting/BeautifyFormatting';
import CopyData from '../../Sim/SimulationData/CopyData';
import { SimDoSims, SimObjects } from '../../Sim/VariablesAndData';
import {
	CacheCostDragonUpgrade, CacheDragonAura, CacheDragonAura2, CacheLastDragonLevel,
} from '../VariablesAndData';

/**
 * This functions caches the current cost of upgrading the dragon level so it can be displayed in the tooltip
 */
export default function CacheDragonCost() {
	if (CacheLastDragonLevel !== Game.dragonLevel || SimDoSims) {
		if (Game.dragonLevel < 25 && Game.dragonLevels[Game.dragonLevel].buy.toString().includes('sacrifice')) {
			let target = Game.dragonLevels[Game.dragonLevel].buy.toString().match(/Objects\[(.*)\]/)[1];
			const amount = Game.dragonLevels[Game.dragonLevel].buy.toString().match(/sacrifice\((.*?)\)/)[1];
			if (target !== 'i') {
				target = target.replaceAll("'", '');
				if (Game.Objects[target].amount < amount) {
					CacheCostDragonUpgrade = 'Not enough buildings to sell';
				} else {
					let cost = 0;
					CopyData();
					for (let i = 0; i < amount; i++) {
						let price = SimObjects[target].basePrice * Game.priceIncrease ** Math.max(0, SimObjects[target].amount - 1 - SimObjects[target].free);
						price = Game.modifyBuildingPrice(SimObjects[target], price);
						price = Math.ceil(price);
						cost += price;
						SimObjects[target].amount--;
					}
					CacheCostDragonUpgrade = `Cost to rebuy: ${(cost)}`;
				}
			} else {
				let cost = 0;
				CopyData();
				for (const j of Object.keys(Game.Objects)) {
					target = j;
					if (Game.Objects[target].amount < amount) {
						CacheCostDragonUpgrade = 'Not enough buildings to sell';
						break;
					} else {
						for (let i = 0; i < amount; i++) {
							let price = SimObjects[target].basePrice * Game.priceIncrease ** Math.max(0, SimObjects[target].amount - 1 - SimObjects[target].free);
							price = Game.modifyBuildingPrice(SimObjects[target], price);
							price = Math.ceil(price);
							cost += price;
							SimObjects[target].amount--;
						}
					}
					CacheCostDragonUpgrade = `Cost to rebuy: ${Beautify(cost)}`;
				}
			}
		}
		CacheLastDragonLevel = Game.dragonLevel;
	}
}
