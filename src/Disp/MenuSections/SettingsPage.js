/** Functions related to the Options/Preferences page */

import jscolor, * as JsColor from '@eastdesire/jscolor';
import { LoadConfig, SaveConfig } from '../../Config/SaveLoadReload/SaveLoadReloadSettings';
import {
	ConfigPrefix, ToggleConfig, ToggleConfigVolume, ToggleHeader,
} from '../../Config/ToggleSetting';
import { CMOptions } from '../../Config/VariablesAndData';
import { ConfigGroups, ConfigGroupsNotification } from '../../Data/Sectionheaders';
import Config from '../../Data/SettingsData';
import ConfigDefault from '../../Data/SettingsDefault';
import RefreshScale from '../HelperFunctions/RefreshScale';
import UpdateColors from '../HelperFunctions/UpdateColors';
import { Colors } from '../VariablesAndData';

/**
 * This function creates a header-object for the options page
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
function CreatePrefHeader(config, text) {
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
	span.onclick = function () { ToggleHeader(config); Game.UpdateMenu(); };
	div.appendChild(span);
	return div;
}

/**
 * This function creates an option-object for the options page
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
function CreatePrefOption(config) {
	const div = document.createElement('div');
	div.className = 'listing';
	if (Config[config].type === 'bool') {
		const a = document.createElement('a');
		if (Config[config].toggle && CMOptions[config] === 0) {
			a.className = 'option off';
		} else {
			a.className = 'option';
		}
		a.id = ConfigPrefix + config;
		a.onclick = function () { ToggleConfig(config); };
		a.textContent = Config[config].label[CMOptions[config]];
		div.appendChild(a);
		const label = document.createElement('label');
		label.textContent = Config[config].desc;
		div.appendChild(label);
		return div;
	} if (Config[config].type === 'vol') {
		const volume = document.createElement('div');
		volume.className = 'sliderBox';
		const title = document.createElement('div');
		title.style.float = 'left';
		title.innerHTML = Config[config].desc;
		volume.appendChild(title);
		const percent = document.createElement('div');
		percent.id = `slider${config}right`;
		percent.style.float = 'right';
		percent.innerHTML = `${CMOptions[config]}%`;
		volume.appendChild(percent);
		const slider = document.createElement('input');
		slider.className = 'slider';
		slider.id = `slider${config}`;
		slider.style.clear = 'both';
		slider.type = 'range';
		slider.min = '0';
		slider.max = '100';
		slider.step = '1';
		slider.value = CMOptions[config];
		slider.oninput = function () { ToggleConfigVolume(config); };
		slider.onchange = function () { ToggleConfigVolume(config); };
		volume.appendChild(slider);
		div.appendChild(volume);
		return div;
	} if (Config[config].type === 'url') {
		const span = document.createElement('span');
		span.className = 'option';
		span.textContent = `${Config[config].label} `;
		div.appendChild(span);
		const input = document.createElement('input');
		input.id = ConfigPrefix + config;
		input.className = 'option';
		input.type = 'text';
		input.readOnly = true;
		input.setAttribute('value', CMOptions[config]);
		input.style.width = '300px';
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		const inputPrompt = document.createElement('input');
		inputPrompt.id = `${ConfigPrefix + config}Prompt`;
		inputPrompt.className = 'option';
		inputPrompt.type = 'text';
		inputPrompt.setAttribute('value', CMOptions[config]);
		const a = document.createElement('a');
		a.className = 'option';
		a.onclick = function () {
			Game.Prompt(inputPrompt.outerHTML, [['Save', function () { CMOptions[`${config}`] = l(`${ConfigPrefix}${config}Prompt`).value; SaveConfig(); Game.ClosePrompt(); Game.UpdateMenu(); }], 'Cancel']);
		};
		a.textContent = 'Edit';
		div.appendChild(a);
		const label = document.createElement('label');
		label.textContent = Config[config].desc;
		div.appendChild(label);
		return div;
	} if (Config[config].type === 'color') {
		div.className = '';
		for (let i = 0; i < Colors.length; i++) {
			const innerDiv = document.createElement('div');
			innerDiv.className = 'listing';
			const input = document.createElement('input');
			input.id = Colors[i];
			input.style.width = '65px';
			input.setAttribute('value', CMOptions.Colors[Colors[i]]);
			innerDiv.appendChild(input);
			const change = function () {
				CMOptions.Colors[this.targetElement.id] = this.toHEXString();
				UpdateColors();
				SaveConfig();
				Game.UpdateMenu();
			};
			new JsColor(input, { hash: true, position: 'right', onInput: change });
			const label = document.createElement('label');
			label.textContent = Config.Colors.desc[Colors[i]];
			innerDiv.appendChild(label);
			div.appendChild(innerDiv);
		}
		jscolor.init();
		return div;
	} if (Config[config].type === 'numscale') {
		const span = document.createElement('span');
		span.className = 'option';
		span.textContent = `${Config[config].label} `;
		div.appendChild(span);
		const input = document.createElement('input');
		input.id = ConfigPrefix + config;
		input.className = 'option';
		input.type = 'number';
		input.value = (CMOptions[config]);
		input.min = Config[config].min;
		input.max = Config[config].max;
		input.oninput = function () {
			if (this.value > this.max) console.log('TEST');
			CMOptions[config] = this.value;
			SaveConfig();
			RefreshScale();
		};
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		const label = document.createElement('label');
		label.textContent = Config[config].desc;
		div.appendChild(label);
		return div;
	}
	return div;
}

/**
 * This function adds the options/settings of CookieMonster to the options page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
export default function AddMenuPref(title) {
	const frag = document.createDocumentFragment();
	frag.appendChild(title);

	for (const group of Object.keys(ConfigGroups)) {
		const groupObject = CreatePrefHeader(group, ConfigGroups[group]); // (group, display-name of group)
		frag.appendChild(groupObject);
		if (CMOptions.Header[group]) { // 0 is show, 1 is collapsed
			// Make sub-sections of Notification section
			if (group === 'Notification') {
				for (const subGroup of Object.keys(ConfigGroupsNotification)) {
					const subGroupObject = CreatePrefHeader(subGroup, ConfigGroupsNotification[subGroup]); // (group, display-name of group)
					subGroupObject.style.fontSize = '15px';
					subGroupObject.style.opacity = '0.5';
					frag.appendChild(subGroupObject);
					if (CMOptions.Header[subGroup]) {
						for (const option in Config) {
							if (Config[option].group === subGroup) frag.appendChild(CreatePrefOption(option));
						}
					}
				}
			} else {
				for (const option of Object.keys(Config)) {
					if (Config[option].group === group) frag.appendChild(CreatePrefOption(option));
				}
			}
		}
	}

	const resDef = document.createElement('div');
	resDef.className = 'listing';
	const resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function () { LoadConfig(ConfigDefault); };
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);

	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
}
