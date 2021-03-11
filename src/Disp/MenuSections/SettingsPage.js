
/**
 * Section: Functions related to the Options/Preferences page

/**
 * This function adds the options/settings of CookieMonster to the options page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
 CM.Disp.AddMenuPref = function (title) {
	const frag = document.createDocumentFragment();
	frag.appendChild(title);

	for (const group of Object.keys(CM.Data.ConfigGroups)) {
		const groupObject = CM.Disp.CreatePrefHeader(group, CM.Data.ConfigGroups[group]); // (group, display-name of group)
		frag.appendChild(groupObject);
		if (CM.Options.Header[group]) { // 0 is show, 1 is collapsed
			// Make sub-sections of Notification section
			if (group === 'Notification') {
				for (const subGroup of Object.keys(CM.Data.ConfigGroupsNotification)) {
					const subGroupObject = CM.Disp.CreatePrefHeader(subGroup, CM.Data.ConfigGroupsNotification[subGroup]); // (group, display-name of group)
					subGroupObject.style.fontSize = '15px';
					subGroupObject.style.opacity = '0.5';
					frag.appendChild(subGroupObject);
					if (CM.Options.Header[subGroup]) {
						for (const option in CM.Data.Config) {
							if (CM.Data.Config[option].group === subGroup) frag.appendChild(CM.Disp.CreatePrefOption(option));
						}
					}
				}
			} else {
				for (const option of Object.keys(CM.Data.Config)) {
					if (CM.Data.Config[option].group === group) frag.appendChild(CM.Disp.CreatePrefOption(option));
				}
			}
		}
	}

	const resDef = document.createElement('div');
	resDef.className = 'listing';
	const resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function () { CM.Config.RestoreDefault(); };
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);

	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
};

/**
 * This function creates a header-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
CM.Disp.CreatePrefHeader = function (config, text) {
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
	span.textContent = CM.Options.Header[config] ? '-' : '+';
	span.onclick = function () { CM.Config.ToggleHeader(config); Game.UpdateMenu(); };
	div.appendChild(span);
	return div;
};

/**
 * This function creates an option-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
CM.Disp.CreatePrefOption = function (config) {
	const div = document.createElement('div');
	div.className = 'listing';
	if (CM.Data.Config[config].type === 'bool') {
		const a = document.createElement('a');
		if (CM.Data.Config[config].toggle && CM.Options[config] === 0) {
			a.className = 'option off';
		} else {
			a.className = 'option';
		}
		a.id = CM.Config.ConfigPrefix + config;
		a.onclick = function () { CM.Config.ToggleConfig(config); };
		a.textContent = CM.Data.Config[config].label[CM.Options[config]];
		div.appendChild(a);
		const label = document.createElement('label');
		label.textContent = CM.Data.Config[config].desc;
		div.appendChild(label);
		return div;
	} else if (CM.Data.Config[config].type === 'vol') {
		const volume = document.createElement('div');
		volume.className = 'sliderBox';
		const title = document.createElement('div');
		title.style.float = 'left';
		title.innerHTML = CM.Data.Config[config].desc;
		volume.appendChild(title);
		const percent = document.createElement('div');
		percent.id = `slider${config}right`;
		percent.style.float = 'right';
		percent.innerHTML = `${CM.Options[config]}%`;
		volume.appendChild(percent);
		const slider = document.createElement('input');
		slider.className = 'slider';
		slider.id = `slider${config}`;
		slider.style.clear = 'both';
		slider.type = 'range';
		slider.min = '0';
		slider.max = '100';
		slider.step = '1';
		slider.value = CM.Options[config];
		slider.oninput = function () { CM.Config.ToggleConfigVolume(config); };
		slider.onchange = function () { CM.Config.ToggleConfigVolume(config); };
		volume.appendChild(slider);
		div.appendChild(volume);
		return div;
	} else if (CM.Data.Config[config].type === 'url') {
		const span = document.createElement('span');
		span.className = 'option';
		span.textContent = `${CM.Data.Config[config].label} `;
		div.appendChild(span);
		const input = document.createElement('input');
		input.id = CM.Config.ConfigPrefix + config;
		input.className = 'option';
		input.type = 'text';
		input.readOnly = true;
		input.setAttribute('value', CM.Options[config]);
		input.style.width = '300px';
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		const inputPrompt = document.createElement('input');
		inputPrompt.id = `${CM.Config.ConfigPrefix + config}Prompt`;
		inputPrompt.className = 'option';
		inputPrompt.type = 'text';
		inputPrompt.setAttribute('value', CM.Options[config]);
		const a = document.createElement('a');
		a.className = 'option';
		a.onclick = function () { Game.Prompt(inputPrompt.outerHTML, [['Save', `CM.Options['${config}'] = l(CM.Config.ConfigPrefix + '${config}' + 'Prompt').value; CM.Config.SaveConfig(); Game.ClosePrompt(); Game.UpdateMenu();`], 'Cancel']); };
		a.textContent = 'Edit';
		div.appendChild(a);
		const label = document.createElement('label');
		label.textContent = CM.Data.Config[config].desc;
		div.appendChild(label);
		return div;
	} else if (CM.Data.Config[config].type === 'color') {
		div.className = '';
		for (let i = 0; i < CM.Disp.colors.length; i++) {
			const innerDiv = document.createElement('div');
			innerDiv.className = 'listing';
			const input = document.createElement('input');
			input.id = CM.Disp.colors[i];
			input.style.width = '65px';
			input.setAttribute('value', CM.Options.Colors[CM.Disp.colors[i]]);
			innerDiv.appendChild(input);
			const change = function () { CM.Options.Colors[this.targetElement.id] = this.toHEXString(); CM.Disp.UpdateColors(); CM.Config.SaveConfig(); Game.UpdateMenu(); };
			new JSColor(input, { hash: true, position: 'right', onInput: change });
			const label = document.createElement('label');
			label.textContent = CM.Data.Config.Colors.desc[CM.Disp.colors[i]];
			innerDiv.appendChild(label);
			div.appendChild(innerDiv);
		}
		return div;
	} else if (CM.Data.Config[config].type === 'numscale') {
		const span = document.createElement('span');
		span.className = 'option';
		span.textContent = `${CM.Data.Config[config].label} `;
		div.appendChild(span);
		const input = document.createElement('input');
		input.id = CM.Config.ConfigPrefix + config;
		input.className = 'option';
		input.type = 'number';
		input.value = (CM.Options[config]);
		input.min = CM.Data.Config[config].min;
		input.max = CM.Data.Config[config].max;
		input.oninput = function () {
			if (this.value > this.max) console.log('TEST');
			CM.Options[config] = this.value;
			CM.Config.SaveConfig();
			CM.Disp.RefreshScale();
		};
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		const label = document.createElement('label');
		label.textContent = CM.Data.Config[config].desc;
		div.appendChild(label);
		return div;
	}
	return div;
};