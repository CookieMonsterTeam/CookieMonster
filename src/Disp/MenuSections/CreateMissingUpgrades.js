/** Functions related to displaying the missing upgrades in the Statistics page */

/**
 * This function creates the missing upgrades sections for prestige, normal and cookie upgrades
 */
export function AddMissingUpgrades() {
	for (const menuSection of (l('menu').children)) {
		if (menuSection.children[0]) {
			if (menuSection.children[0].innerHTML === 'Prestige' && CM.Cache.MissingUpgradesPrestige) {
				const prestigeUpgradesMissing = CM.Cache.MissingUpgradesPrestige.match(new RegExp('div', 'g') || []).length / 2;
				const title = document.createElement('div');
				title.id = 'CMMissingUpgradesPrestigeTitle';
				title.className = 'listing';
				const titlefrag = document.createElement('div');
				titlefrag.innerHTML = `<b>Missing Prestige upgrades:</b> ${prestigeUpgradesMissing}/${Game.PrestigeUpgrades.length} (${Math.floor((prestigeUpgradesMissing / Game.PrestigeUpgrades.length) * 100)}%)`;
				title.appendChild(titlefrag);
				menuSection.appendChild(title);
				const upgrades = document.createElement('div');
				upgrades.className = 'listing crateBox';
				upgrades.innerHTML = CM.Cache.MissingUpgradesPrestige;
				menuSection.appendChild(upgrades);
			} else if (menuSection.children[0].innerHTML === 'Upgrades') {
				if (CM.Cache.MissingUpgrades) {
					const normalUpgradesMissing = CM.Cache.MissingUpgrades.match(new RegExp('div', 'g') || []).length / 2;
					const title = document.createElement('div');
					title.id = 'CMMissingUpgradesTitle';
					title.className = 'listing';
					const titlefrag = document.createElement('div');
					titlefrag.innerHTML = `<b>Missing normal upgrades:</b> ${normalUpgradesMissing}/${Game.UpgradesByPool[''].length + Game.UpgradesByPool.tech.length} (${Math.floor((normalUpgradesMissing / (Game.UpgradesByPool[''].length + Game.UpgradesByPool.tech.length)) * 100)}%)`;
					title.appendChild(titlefrag);
					menuSection.insertBefore(title, menuSection.childNodes[3]);
					const upgrades = document.createElement('div');
					upgrades.className = 'listing crateBox';
					upgrades.innerHTML = CM.Cache.MissingUpgrades;
					menuSection.insertBefore(upgrades, document.getElementById('CMMissingUpgradesTitle').nextSibling);
				}
				if (CM.Cache.MissingUpgradesCookies) {
					const cookieUpgradesMissing = CM.Cache.MissingUpgradesCookies.match(new RegExp('div', 'g') || []).length / 2;
					const title = document.createElement('div');
					title.id = 'CMMissingUpgradesCookiesTitle';
					title.className = 'listing';
					const titlefrag = document.createElement('div');
					titlefrag.innerHTML = `<b>Missing Cookie upgrades:</b> ${cookieUpgradesMissing}/${Game.UpgradesByPool.cookie.length} (${Math.floor((cookieUpgradesMissing / Game.UpgradesByPool.cookie.length) * 100)}%)`;
					title.appendChild(titlefrag);
					menuSection.appendChild(title);
					const upgrades = document.createElement('div');
					upgrades.className = 'listing crateBox';
					upgrades.innerHTML = CM.Cache.MissingUpgradesCookies;
					menuSection.appendChild(upgrades);
				}
			}
		}
	}
}

/**
 * This function returns the "crates" (icons) for missing upgrades in the stats sections
 * It returns a html string that gets appended to the respective CM.Cache.MissingUpgrades-variable by CM.Cache.CacheMissingUpgrades()
 * @param	{object}	me	The upgrade object
 * @returns	{string}	?	The HTML string that creates the icon.
 */
export function crateMissing(me) {
	let classes = 'crate upgrade missing';
	if (me.pool === 'prestige') classes += ' heavenly';

	let noFrame = 0;
	if (!Game.prefs.crates) noFrame = 1;
	if (noFrame) classes += ' noFrame';

	let icon = me.icon;
	if (me.iconFunction) icon = me.iconFunction();
	const tooltip = `function() {return Game.crateTooltip(Game.UpgradesById[${me.id}], 'stats');}`;
	return `<div class="${classes}"
	${Game.getDynamicTooltip(tooltip, 'top', true)}
	style = "${(`${icon[2] ? `background-image: url(${icon[2]});` : ''}background-position:${-icon[0] * 48}px ${-icon[1] * 48}px`)};">
	</div>`;
}
