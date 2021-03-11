/** Functions related to the Bottom Bar */

import { VersionMajor, VersionMinor } from '../../Data/Moddata';
import { Beautify, GetTimeColor } from '../BeautifyFormatting';
import { ColorBlue, ColorTextPre, ColorYellow } from '../VariablesAndData';
import { CreateBotBarBuildingColumn } from './CreateDOMElements';

/**
 * This function creates the bottom bar and appends it to l('wrapper')
 */
export function CreateBotBar() {
	const BotBar = document.createElement('div');
	BotBar.id = 'CMBotBar';
	BotBar.style.height = '69px';
	BotBar.style.width = '100%';
	BotBar.style.position = 'absolute';
	BotBar.style.display = 'none';
	BotBar.style.backgroundColor = '#262224';
	BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
	BotBar.style.borderTop = '1px solid black';
	BotBar.style.overflow = 'auto';
	BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';

	const table = BotBar.appendChild(document.createElement('table'));
	table.style.width = '100%';
	table.style.textAlign = 'center';
	table.style.whiteSpace = 'nowrap';
	const tbody = table.appendChild(document.createElement('tbody'));

	const firstCol = function (text, color) {
		const td = document.createElement('td');
		td.style.textAlign = 'right';
		td.className = ColorTextPre + color;
		td.textContent = text;
		return td;
	};
	const type = tbody.appendChild(document.createElement('tr'));
	type.style.fontWeight = 'bold';
	type.appendChild(firstCol(`CM ${VersionMajor}.${VersionMinor}`, ColorYellow));
	const bonus = tbody.appendChild(document.createElement('tr'));
	bonus.appendChild(firstCol('Bonus Income', ColorBlue));
	const pp = tbody.appendChild(document.createElement('tr'));
	pp.appendChild(firstCol('Payback Period', ColorBlue));
	const time = tbody.appendChild(document.createElement('tr'));
	time.appendChild(firstCol('Time Left', ColorBlue));

	for (const i of Object.keys(Game.Objects)) {
		CreateBotBarBuildingColumn(i);
	}

	l('wrapper').appendChild(BotBar);
}

/**
 * This function updates the bonus-, pp-, and time-rows in the the bottom bar
 */
export function UpdateBotBar() {
	if (CM.Options.BotBar === 1 && CM.Cache.Objects1 && Game.buyMode === 1) {
		let count = 0;
		for (const i of Object.keys(CM.Cache.Objects1)) {
			let target = `Objects${Game.buyBulk}`;
			if (Game.buyMode === 1) {
				CM.Disp.LastTargetBotBar = target;
			} else {
				target = CM.Disp.LastTargetBotBar;
			}
			count++;
			l('BotBar').firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].textContent = Game.Objects[i].amount;
			l('BotBar').firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify(CM.Cache[target][i].bonus, 2);
			l('BotBar').firstChild.firstChild.childNodes[2].childNodes[count].className = ColorTextPre + CM.Cache[target][i].color;
			l('BotBar').firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache[target][i].pp, 2);
			const timeColor = GetTimeColor((Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			l('BotBar').firstChild.firstChild.childNodes[3].childNodes[count].className = ColorTextPre + timeColor.color;
			if (timeColor.text === 'Done!' && Game.cookies < Game.Objects[i].bulkPrice) {
				l('BotBar').firstChild.firstChild.childNodes[3].childNodes[count].textContent = `${timeColor.text} (with Wrink)`;
			} else l('BotBar').firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
}
