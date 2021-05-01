import jscolor, * as JsColor from '@eastdesire/jscolor';
import ToggleFavouriteSetting from '../../../Config/Toggles/ToggleFavourites';
import { SaveConfig } from '../../../Config/SaveLoadReload/SaveLoadReloadSettings';
import { ConfigPrefix, ToggleConfig, ToggleConfigVolume } from '../../../Config/ToggleSetting';
import { CMOptions } from '../../../Config/VariablesAndData';
import {} from '../../../Data/Sectionheaders.ts';
import Config from '../../../Data/SettingsData';
import RefreshScale from '../../HelperFunctions/RefreshScale';
import UpdateColours from '../../HelperFunctions/UpdateColours';
import Flash from '../../Notifications/Flash';
import PlaySound from '../../Notifications/Sound';
import { FavouriteSettings, SimpleTooltipElements } from '../../VariablesAndData';
import CookieMonsterPrompt from '../Prompt';

/**
 * This function creates the favourite setting star object
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
function CreateFavouriteStar(config) {
  const FavStar = document.createElement('a');
  if (FavouriteSettings.includes(config)) {
    FavStar.innerText = '★';
    FavStar.style.color = 'yellow';
  } else FavStar.innerText = '☆';
  FavStar.className = 'option';
  FavStar.onclick = function () {
    ToggleFavouriteSetting(config);
    SaveConfig();
    Game.UpdateMenu();
  };
  FavStar.onmouseover = function () {
    Game.tooltip.draw(this, escape(SimpleTooltipElements.FavouriteSettingPlaceholder.innerHTML));
  };
  FavStar.onmouseout = function () {
    Game.tooltip.hide();
  };
  FavStar.appendChild(document.createTextNode(' '));
  return FavStar;
}

/**
 * This function creates an option-object for the options page
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
export default function CreatePrefOption(config) {
  const div = document.createElement('div');
  div.className = 'listing';
  if (CMOptions.FavouriteSettings === 1) {
    div.appendChild(CreateFavouriteStar(config));
  }
  if (Config[config].type === 'bool') {
    const a = document.createElement('a');
    if (Config[config].toggle && CMOptions[config] === 0) {
      a.className = 'option off';
    } else {
      a.className = 'option';
    }
    a.id = ConfigPrefix + config;
    a.onclick = function () {
      ToggleConfig(config);
      Game.UpdateMenu();
    };
    a.textContent = Config[config].label[CMOptions[config]];
    div.appendChild(a);
    const label = document.createElement('label');
    label.textContent = Config[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  if (Config[config].type === 'vol') {
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
    slider.oninput = function () {
      ToggleConfigVolume(config);
      Game.UpdateMenu();
    };
    slider.onchange = function () {
      ToggleConfigVolume(config);
      Game.UpdateMenu();
    };
    volume.appendChild(slider);
    div.appendChild(volume);
    const a = document.createElement('a');
    a.className = 'option';
    a.onclick = function () {
      PlaySound(
        CMOptions[config.replace('Volume', 'SoundURL')],
        config.replace('Volume', 'Sound'),
        config,
        true,
      );
    };
    a.textContent = 'Test sound';
    div.appendChild(a);
    return div;
  }
  if (Config[config].type === 'url') {
    const span = document.createElement('span');
    span.className = 'option';
    span.textContent = `${Config[config].label} `;
    span.style.lineHeight = '1.6';
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
      CookieMonsterPrompt(inputPrompt.outerHTML, [
        [
          'Save',
          function () {
            CMOptions[config] = l(`${ConfigPrefix}${config}Prompt`).value;
            SaveConfig();
            Game.ClosePrompt();
            Game.UpdateMenu();
          },
        ],
        [
          'Cancel',
          function () {
            Game.ClosePrompt();
          },
        ],
      ]);
    };
    a.textContent = 'Edit';
    div.appendChild(a);
    const label = document.createElement('label');
    label.textContent = Config[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  if (Config[config].type === 'colour') {
    const innerSpan = document.createElement('span');
    innerSpan.className = 'option';
    const input = document.createElement('input');
    input.id = config;
    input.style.width = '65px';
    input.setAttribute('value', CMOptions[config]);
    innerSpan.appendChild(input);
    const change = function () {
      CMOptions[this.targetElement.id] = this.toHEXString();
      UpdateColours();
      SaveConfig();
      Game.UpdateMenu();
    };
    // eslint-disable-next-line no-new
    new JsColor(input, { hash: true, position: 'right', onInput: change });
    const label = document.createElement('label');
    label.textContent = Config[config].desc;
    label.style.lineHeight = '1.6';
    innerSpan.appendChild(label);
    if (config.includes('Flash')) {
      const a = document.createElement('a');
      a.className = 'option';
      a.onclick = function () {
        Flash(3, config.replace('Colour', ''), true);
      };
      a.textContent = 'Test flash';
      innerSpan.appendChild(a);
    }
    div.appendChild(innerSpan);
    jscolor.init();
    return div;
  }
  if (Config[config].type === 'numscale') {
    const span = document.createElement('span');
    span.className = 'option';
    span.textContent = `${Config[config].label} `;
    span.style.lineHeight = '1.6';
    div.appendChild(span);
    const input = document.createElement('input');
    input.id = ConfigPrefix + config;
    input.className = 'option';
    input.type = 'number';
    input.value = CMOptions[config];
    input.min = Config[config].min;
    input.max = Config[config].max;
    input.oninput = function () {
      CMOptions[config] = this.value;
      SaveConfig();
      RefreshScale();
      Game.UpdateMenu();
    };
    div.appendChild(input);
    div.appendChild(document.createTextNode(' '));
    const label = document.createElement('label');
    label.textContent = Config[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  return div;
}
