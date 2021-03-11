
/**
 * This function adjusts some things in the upgrades section
 * It colours them and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.ToggleUpgradeBarAndColor & CM.Disp.RefreshScale()
 * And by changes in CM.Options.SortUpgrades
 */
 CM.Disp.UpdateUpgrades = function () {
	// This counts the amount of upgrades for each pp group and updates the Upgrade Bar
	if (CM.Options.UpBarColor > 0) {
		let blue = 0;
		let green = 0;
		let yellow = 0;
		let orange = 0;
		let red = 0;
		let purple = 0;
		let gray = 0;

		for (const i of Object.keys(Game.UpgradesInStore)) {
			const me = Game.UpgradesInStore[i];
			let addedColor = false;
			for (let j = 0; j < l(`upgrade${i}`).childNodes.length; j++) {
				if (l(`upgrade${i}`).childNodes[j].className.indexOf(CM.Disp.colorBackPre) !== -1) {
					l(`upgrade${i}`).childNodes[j].className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
					addedColor = true;
					break;
				}
			}
			if (!addedColor) {
				const div = document.createElement('div');
				div.style.width = '10px';
				div.style.height = '10px';
				div.className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
				l(`upgrade${i}`).appendChild(div);
			}
			if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorBlue) blue++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorGreen) green++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorYellow) yellow++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorOrange) orange++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorRed) red++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorPurple) purple++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorGray) gray++;
		}

		l('CMUpgradeBarBlue').textContent = blue;
		l('CMUpgradeBarGreen').textContent = green;
		l('CMUpgradeBarYellow').textContent = yellow;
		l('CMUpgradeBarOrange').textContent = orange;
		l('CMUpgradeBarRed').textContent = red;
		l('CMUpgradeBarPurple').textContent = purple;
		l('CMUpgradeBarGray').textContent = gray;
	}

	const arr = [];
	// Build array of pointers, sort by pp, set flex positions
	// This regulates sorting of upgrades
	for (let x = 0; x < Game.UpgradesInStore.length; x++) {
		const o = {};
		o.name = Game.UpgradesInStore[x].name;
		o.price = Game.UpgradesInStore[x].basePrice;
		o.pp = CM.Cache.Upgrades[o.name].pp;
		arr.push(o);
	}

	if (CM.Options.SortUpgrades) {
		arr.sort(function (a, b) { return (CM.Disp.colors.indexOf(a.color) > CM.Disp.colors.indexOf(b.color) ? 1 : (CM.Disp.colors.indexOf(a.color) < CM.Disp.colors.indexOf(b.color) ? -1 : (a.pp < b.pp) ? -1 : 0)); });
	} else {
		arr.sort((a, b) => a.price - b.price);
	}

	const nameChecker = function (arr2, upgrade) {
		return arr2.findIndex((e) => e.name === upgrade.name);
	};
	for (let x = 0; x < Game.UpgradesInStore.length; x++) {
		l(`upgrade${x}`).style.order = nameChecker(arr, Game.UpgradesInStore[x]) + 1;
	}
};

/**
 * Section: Functions related to the Upgrade Bar

/**
 * This function toggles the upgrade bar and the colours of upgrades
 * It is called by a change in CM.Options.UpBarColor
 */
CM.Disp.ToggleUpgradeBarAndColor = function () {
	if (CM.Options.UpBarColor === 1) { // Colours and bar on
		CM.Disp.UpgradeBar.style.display = '';
		CM.Disp.UpdateUpgrades();
	} else if (CM.Options.UpBarColor === 2) { // Colours on and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		CM.Disp.UpdateUpgrades();
	} else { // Colours and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
};

/**
 * This function toggles the position of the upgrade bar from fixed or non-fixed mode
 * It is called by a change in CM.Options.UpgradeBarFixedPos
 */
CM.Disp.ToggleUpgradeBarFixedPos = function () {
	if (CM.Options.UpgradeBarFixedPos === 1) { // Fix to top of screen when scrolling
		CM.Disp.UpgradeBar.style.position = 'sticky';
		CM.Disp.UpgradeBar.style.top = '0px';
	} else {
		CM.Disp.UpgradeBar.style.position = ''; // Possible to scroll offscreen
	}
};

