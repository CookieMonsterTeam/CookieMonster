/**
 * Section: Functions related to the Stats page

/**
 * This function adds stats created by CookieMonster to the stats page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
CM.Disp.AddMenuInfo = function (title) {
	const info = document.createElement('div');
	info.className = 'subsection';

	const span = document.createElement('span');
	span.style.cursor = 'pointer';
	span.style.display = 'inline-block';
	span.style.height = '14px';
	span.style.width = '14px';
	span.style.borderRadius = '7px';
	span.style.textAlign = 'center';
	span.style.backgroundColor = '#C0C0C0';
	span.style.color = 'black';
	span.style.fontSize = '13px';
	span.style.verticalAlign = 'middle';
	span.textContent = CM.Options.Header.InfoTab ? '-' : '+';
	span.onclick = function () { CM.Config.ToggleHeader('InfoTab'); Game.UpdateMenu(); };
	title.appendChild(span);
	info.appendChild(title);

	if (CM.Options.Header.InfoTab) {
		const description = document.createElement('div');
		description.innerHTML = CM.Data.ModDescription;
		info.appendChild(description);
		const notes = document.createElement('div');
		notes.innerHTML = CM.Data.LatestReleaseNotes;
		info.appendChild(notes);
	}

	const menu = l('menu').children[1];
	menu.insertBefore(info, menu.children[1]);
};
