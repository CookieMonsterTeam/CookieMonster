import { ToggleHeader } from '../../../Config/ToggleSetting';
import { CMOptions } from '../../../Config/VariablesAndData';

/**
 * This function creates a header-object for the options page
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
export default function CreatePrefHeader(config, text) {
  const div = document.createElement('div');
  div.className = 'title';

  div.style.opacity = '0.7';
  div.style.fontSize = '17px';
  div.appendChild(document.createTextNode(`${text} `));
  const span = document.createElement('span'); // Creates the +/- button
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
