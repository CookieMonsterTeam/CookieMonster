/**
 * Section: Functions related to right column of the screen (buildings/upgrades)

/**
 * This function adjusts some things in the column of buildings.
 * It colours them, helps display the correct sell-price and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.UpdateColors() & CM.Disp.RefreshScale()
 * And by changes in CM.Options.BuildColor, CM.Options.SortBuild & CM.Data.Config.BulkBuildColor
 */
CM.Disp.UpdateBuildings = function () {
	let target = `Objects${Game.buyBulk}`;
	if (Game.buyMode === 1) {
		CM.Disp.LastTargetBuildings = target;
	} else {
		target = CM.Disp.LastTargetBuildings;
	}
	if (Game.buyMode === 1) {
		if (CM.Options.BuildColor === 1) {
			for (const i of Object.keys(CM.Cache[target])) {
				l(`productPrice${Game.Objects[i].id}`).style.color = CM.Options.Colors[CM.Cache[target][i].color];
			}
		} else {
			for (const i of Object.keys(Game.Objects)) {
				l(`productPrice${Game.Objects[i].id}`).style.removeProperty('color');
			}
		}
	} else if (Game.buyMode === -1) {
		for (const i of Object.keys(CM.Cache.Objects1)) {
			const o = Game.Objects[i];
			l(`productPrice${o.id}`).style.color = '';
			/*
			 * Fix sell price displayed in the object in the store.
			 *
			 * The buildings sell price displayed by the game itself (without any mod) is incorrect.
			 * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
			 *
			 * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
			 */
			l(`productPrice${o.id}`).innerHTML = Beautify(CM.Sim.BuildingSell(o, o.basePrice, o.amount, o.free, Game.buyBulk, 1));
		}
	}

	// Build array of pointers, sort by pp, use array index (+2) as the grid row number
	// (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
	// This regulates sorting of buildings
	if (Game.buyMode === 1 && CM.Options.SortBuildings) {
		const arr = Object.keys(CM.Cache[target]).map((k) => {
			const o = CM.Cache[target][k];
			o.name = k;
			o.id = Game.Objects[k].id;
			return o;
		});

		arr.sort(function (a, b) { return (CM.Disp.colors.indexOf(a.color) > CM.Disp.colors.indexOf(b.color) ? 1 : (CM.Disp.colors.indexOf(a.color) < CM.Disp.colors.indexOf(b.color) ? -1 : (a.pp < b.pp) ? -1 : 0)); });

		for (let x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = `${x + 2}/${x + 2}`;
		}
	} else {
		const arr = Object.keys(CM.Cache.Objects1).map((k) => {
			const o = CM.Cache.Objects1[k];
			o.name = k;
			o.id = Game.Objects[k].id;
			return o;
		});
		arr.sort((a, b) => a.id - b.id);
		for (let x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = `${x + 2}/${x + 2}`;
		}
	}
};
