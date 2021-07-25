/** Functions to create various DOM elements used by the Bars */

import { ColourBackPre, ColourBlue, ColourTextPre } from '../VariablesAndData';

/**
 * This function creates an indivudual timer for the timer bar
 * @param	{string}					id					An id to identify the timer
 * @param	{string}					name				The title of the timer
 * @param	[{{string}, {string}}, ...]	bars ([id, colour])	The id and colours of individual parts of the timer
 */
export function CreateTimer(id, name, bars) {
  const timerBar = document.createElement('div');
  timerBar.id = id;
  timerBar.style.height = '12px';
  timerBar.style.margin = '0px 10px';
  timerBar.style.position = 'relative';

  const div = document.createElement('div');
  div.style.width = '100%';
  div.style.height = '10px';
  div.style.margin = 'auto';
  div.style.position = 'absolute';
  div.style.left = '0px';
  div.style.top = '0px';
  div.style.right = '0px';
  div.style.bottom = '0px';

  const type = document.createElement('span');
  type.style.display = 'inline-block';
  type.style.textAlign = 'right';
  type.style.fontSize = '10px';
  type.style.width = '108px';
  type.style.marginRight = '5px';
  type.style.verticalAlign = 'text-top';
  type.textContent = name;
  div.appendChild(type);

  for (let i = 0; i < bars.length; i++) {
    const colourBar = document.createElement('span');
    colourBar.id = bars[i].id;
    colourBar.style.display = 'inline-block';
    colourBar.style.height = '10px';
    colourBar.style.verticalAlign = 'text-top';
    colourBar.style.textAlign = 'center';
    if (bars.length - 1 === i) {
      colourBar.style.borderTopRightRadius = '10px';
      colourBar.style.borderBottomRightRadius = '10px';
    }
    if (typeof bars[i].colour !== 'undefined') {
      colourBar.className = ColourBackPre + bars[i].colour;
    }
    div.appendChild(colourBar);
  }

  const timer = document.createElement('span');
  timer.id = `${id}Time`;
  timer.style.marginLeft = '5px';
  timer.style.verticalAlign = 'text-top';
  div.appendChild(timer);

  timerBar.appendChild(div);

  return timerBar;
}

/**
 * This function extends the bottom bar (created by CM.Disp.CreateBotBar) with a column for the given building.
 * @param	{string}	buildingName	Objectname to be added (e.g., "Cursor")
 */
export function CreateBotBarBuildingColumn(buildingName) {
  if (l('CMBotBar') !== null) {
    const type = l('CMBotBar').firstChild.firstChild.childNodes[0];
    const bonus = l('CMBotBar').firstChild.firstChild.childNodes[1];
    const pp = l('CMBotBar').firstChild.firstChild.childNodes[2];
    const time = l('CMBotBar').firstChild.firstChild.childNodes[3];

    const i = buildingName;
    const header = type.appendChild(document.createElement('td'));
    header.appendChild(
      document.createTextNode(`${i.indexOf(' ') !== -1 ? i.substring(0, i.indexOf(' ')) : i} (`),
    );

    const span = header.appendChild(document.createElement('span'));
    span.className = ColourTextPre + ColourBlue;

    header.appendChild(document.createTextNode(')'));
    type.lastChild.style.paddingLeft = '8px';
    bonus.appendChild(document.createElement('td'));
    bonus.lastChild.style.paddingLeft = '8px';
    pp.appendChild(document.createElement('td'));
    pp.lastChild.style.paddingLeft = '8px';
    time.appendChild(document.createElement('td'));
    time.lastChild.style.paddingLeft = '2px';
  }
}
