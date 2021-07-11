import saveFramework from '@cookiemonsterteam/cookiemonsterframework/src/saveDataFunctions/saveFramework';
import jscolor, * as JsColor from '@eastdesire/jscolor';
import ToggleFavouriteSetting from '../../../Config/Toggles/ToggleFavourites';
import { ConfigPrefix, ToggleConfig, ToggleConfigVolume } from '../../../Config/ToggleSetting';
import {} from '../../../Data/Sectionheaders.ts';
import settings from '../../../Data/settings';
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
    saveFramework();
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
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FavouriteSettings === 1) {
    div.appendChild(CreateFavouriteStar(config));
  }
  if (settings[config].type === 'bool') {
    const a = document.createElement('a');
    if (
      settings[config].toggle &&
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] === 0
    ) {
      a.className = 'option off';
    } else {
      a.className = 'option';
    }
    a.id = ConfigPrefix + config;
    a.onclick = function () {
      ToggleConfig(config);
      Game.UpdateMenu();
    };
    a.textContent =
      settings[config].label[
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config]
      ];
    div.appendChild(a);
    const label = document.createElement('label');
    label.textContent = settings[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  if (settings[config].type === 'vol') {
    const volume = document.createElement('div');
    volume.className = 'sliderBox';
    const title = document.createElement('div');
    title.style.float = 'left';
    title.innerHTML = settings[config].desc;
    volume.appendChild(title);
    const percent = document.createElement('div');
    percent.id = `slider${config}right`;
    percent.style.float = 'right';
    percent.innerHTML = `${Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config]}%`;
    volume.appendChild(percent);
    const slider = document.createElement('input');
    slider.className = 'slider';
    slider.id = `slider${config}`;
    slider.style.clear = 'both';
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.step = '1';
    slider.value = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config];
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
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
          config.replace('Volume', 'SoundURL')
        ],
        config.replace('Volume', 'Sound'),
        config,
        true,
      );
    };
    a.textContent = 'Test sound';
    div.appendChild(a);
    return div;
  }
  if (settings[config].type === 'url') {
    const span = document.createElement('span');
    span.className = 'option';
    span.textContent = `${settings[config].label} `;
    span.style.lineHeight = '1.6';
    div.appendChild(span);
    const input = document.createElement('input');
    input.id = ConfigPrefix + config;
    input.className = 'option';
    input.type = 'text';
    input.readOnly = true;
    input.setAttribute(
      'value',
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config],
    );
    input.style.width = '300px';
    div.appendChild(input);
    div.appendChild(document.createTextNode(' '));
    const inputPrompt = document.createElement('input');
    inputPrompt.id = `${ConfigPrefix + config}Prompt`;
    inputPrompt.className = 'option';
    inputPrompt.type = 'text';
    inputPrompt.setAttribute(
      'value',
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config],
    );
    const a = document.createElement('a');
    a.className = 'option';
    a.onclick = function () {
      CookieMonsterPrompt(inputPrompt.outerHTML, [
        [
          'Save',
          function () {
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = l(
              `${ConfigPrefix}${config}Prompt`,
            ).value;
            saveFramework();
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
    label.textContent = settings[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  if (settings[config].type === 'colour') {
    const innerSpan = document.createElement('span');
    innerSpan.className = 'option';
    const input = document.createElement('input');
    input.id = config;
    input.style.width = '65px';
    input.setAttribute(
      'value',
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config],
    );
    innerSpan.appendChild(input);
    const change = function () {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[this.targetElement.id] =
        this.toHEXString();
      UpdateColours();
      saveFramework();
      Game.UpdateMenu();
    };
    // eslint-disable-next-line no-new
    new JsColor(input, { hash: true, position: 'right', onInput: change });
    const label = document.createElement('label');
    label.textContent = settings[config].desc;
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
  if (settings[config].type === 'numscale') {
    const span = document.createElement('span');
    span.className = 'option';
    span.textContent = `${settings[config].label} `;
    span.style.lineHeight = '1.6';
    div.appendChild(span);
    const input = document.createElement('input');
    input.id = ConfigPrefix + config;
    input.className = 'option';
    input.type = 'number';
    input.value = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config];
    input.min = settings[config].min;
    input.max = settings[config].max;
    input.oninput = function () {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = this.value;
      saveFramework();
      RefreshScale();
      Game.UpdateMenu();
    };
    div.appendChild(input);
    div.appendChild(document.createTextNode(' '));
    const label = document.createElement('label');
    label.textContent = settings[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  return div;
}
