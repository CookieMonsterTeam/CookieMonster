/** Section: Functions related to the creation of basic DOM elements page */

import { ToggleHeader } from '../../../Config/ToggleSetting';
import { CMOptions } from '../../../Config/VariablesAndData';
import { SimpleTooltipElements } from '../../VariablesAndData';

/**
 * This function creates a header-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
export function StatsHeader(text, config) {
  const div = document.createElement('div');
  div.className = 'title';
  div.style.padding = '0px 16px';
  div.style.opacity = '0.7';
  div.style.fontSize = '17px';
  div.style.fontFamily = '"Kavoon", Georgia, serif';
  div.appendChild(document.createTextNode(`${text} `));
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
  span.textContent = CMOptions.Header[config] ? '-' : '+';
  span.onclick = function () {
    ToggleHeader(config);
    Game.UpdateMenu();
  };
  div.appendChild(span);
  return div;
}

/**
 * This function creates an stats-listing-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		type		The type fo the listing
 * @param 	{string}		name		The name of the option
 * @param 	{object}		text		The text-object of the option
 * @param 	{string}		placeholder	The id of the to-be displayed tooltip if applicable
 * @returns	{object}		div			The option object
 */
export function StatsListing(type, name, text, placeholder) {
  const div = document.createElement('div');
  div.className = 'listing';

  const listingName = document.createElement('b');
  listingName.textContent = name;
  div.appendChild(listingName);
  if (type === 'withTooltip') {
    div.className = 'listing';
    div.appendChild(document.createTextNode(' '));

    const tooltip = document.createElement('span');
    tooltip.onmouseout = function () {
      Game.tooltip.hide();
    };
    tooltip.onmouseover = function () {
      Game.tooltip.draw(this, escape(SimpleTooltipElements[placeholder].innerHTML));
    };
    tooltip.style.cursor = 'default';
    tooltip.style.display = 'inline-block';
    tooltip.style.height = '10px';
    tooltip.style.width = '10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.textAlign = 'center';
    tooltip.style.backgroundColor = '#C0C0C0';
    tooltip.style.color = 'black';
    tooltip.style.fontSize = '9px';
    tooltip.style.verticalAlign = 'bottom';
    tooltip.textContent = '?';
    div.appendChild(tooltip);
  }
  div.appendChild(document.createTextNode(': '));
  div.appendChild(text);
  return div;
}

/**
 * This function creates an stats-listing-object for the stats page for missing items displays
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		type		The type fo the listing
 * @param 	{string}		name		The name of the option
 * @param 	{object}		text		The text-object of the option
 * @param 	{bool}		  current Whether the season of the item is the current season
 * @returns	{object}		div			The option object
 */
export function StatsMissDispListing(type, name, text, current) {
  const div = document.createElement('div');
  div.className = 'listing';

  const listingName = document.createElement('b');
  listingName.textContent = name;
  if (current === true) listingName.style.color = CMOptions.ColourGreen;
  div.appendChild(listingName);
  div.appendChild(document.createTextNode(': '));
  div.appendChild(text);
  return div;
}

/**
 * This function creates a tooltip containing all missing holiday items contained in the list theMissDisp
 * @param 	{list}			theMissDisp		A list of the missing holiday items
 * @returns	{object}		frag			The tooltip object
 */
export function StatsMissDisp(theMissDisp) {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createTextNode(`${theMissDisp.length} `));
  const span = document.createElement('span');
  span.onmouseout = function () {
    Game.tooltip.hide();
  };
  const placeholder = document.createElement('div');
  const missing = document.createElement('div');
  missing.style.minWidth = '140px';
  missing.style.marginBottom = '4px';
  const title = document.createElement('div');
  title.className = 'name';
  title.style.marginBottom = '4px';
  title.style.textAlign = 'center';
  title.textContent = 'Missing';
  missing.appendChild(title);
  Object.keys(theMissDisp).forEach((i) => {
    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.appendChild(document.createTextNode(theMissDisp[i]));
    missing.appendChild(div);
  });
  placeholder.appendChild(missing);
  span.onmouseover = function () {
    Game.tooltip.draw(this, escape(placeholder.innerHTML));
  };
  span.style.cursor = 'default';
  span.style.display = 'inline-block';
  span.style.height = '10px';
  span.style.width = '10px';
  span.style.borderRadius = '5px';
  span.style.textAlign = 'center';
  span.style.backgroundColor = '#C0C0C0';
  span.style.color = 'black';
  span.style.fontSize = '9px';
  span.style.verticalAlign = 'bottom';
  span.textContent = '?';
  frag.appendChild(span);
  return frag;
}
