import {
  ColourTextPre,
  ColourBorderPre,
  ColourGray,
  ColourBlue,
  ColourRed,
  ColourYellow,
  ColourPurple,
  TooltipType,
} from '../VariablesAndData';

/** Creates various sections of tooltips */

/**
 * This function creates a tooltipBox object which contains all CookieMonster added tooltip information.
 * @returns {object}	div		An object containing the stylized box
 */
export function TooltipCreateTooltipBox() {
  l('tooltip').firstChild.style.paddingBottom = '4px'; // Sets padding on base-tooltip
  const tooltipBox = document.createElement('div');
  tooltipBox.style.border = '1px solid';
  tooltipBox.style.padding = '4px';
  tooltipBox.style.margin = '0px -4px';
  tooltipBox.id = 'CMTooltipBorder';
  tooltipBox.className = ColourTextPre + ColourGray;
  return tooltipBox;
}

/**
 * This function creates a header object for tooltips.
 * @param	{string}	text	Title of header
 * @returns {object}	div		An object containing the stylized header
 */
export function TooltipCreateHeader(text) {
  const div = document.createElement('div');
  div.style.fontWeight = 'bold';
  div.id = `${text}Title`;
  div.className = ColourTextPre + ColourBlue;
  div.textContent = text;
  return div;
}

/**
 * This function creates the tooltip objectm for warnings
 * The object is also removed by CM.Disp.UpdateTooltipWarnings() when type is 's' or 'g'
 * @returns {object}	TooltipWarn	The Warnings-tooltip object
 */
export function TooltipCreateWarningSection() {
  const TooltipWarn = document.createElement('div');
  TooltipWarn.style.position = 'absolute';
  TooltipWarn.style.display = 'block';
  TooltipWarn.style.left = 'auto';
  TooltipWarn.style.bottom = 'auto';
  TooltipWarn.id = 'CMDispTooltipWarningParent';

  const create = function (boxId, colour, labelTextFront, labelTextBack, deficitId) {
    const box = document.createElement('div');
    box.id = boxId;
    box.style.display = 'none';
    box.style.transition = 'opacity 0.1s ease-out';
    box.className = ColourBorderPre + colour;
    box.style.padding = '2px';
    box.style.background = '#000 url(img/darkNoise.png)';
    const labelDiv = document.createElement('div');
    box.appendChild(labelDiv);
    const labelSpan = document.createElement('span');
    labelSpan.className = ColourTextPre + colour;
    labelSpan.style.fontWeight = 'bold';
    labelSpan.textContent = labelTextFront;
    labelDiv.appendChild(labelSpan);
    labelDiv.appendChild(document.createTextNode(labelTextBack));
    const deficitDiv = document.createElement('div');
    box.appendChild(deficitDiv);
    const deficitSpan = document.createElement('span');
    deficitSpan.id = deficitId;
    deficitDiv.appendChild(document.createTextNode('Deficit: '));
    deficitDiv.appendChild(deficitSpan);
    return box;
  };

  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnLucky',
      ColourRed,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Lucky!"',
      'CMDispTooltipWarnLuckyText',
    ),
  );
  TooltipWarn.firstChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnLuckyFrenzy',
      ColourYellow,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)',
      'CMDispTooltipWarnLuckyFrenzyText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnConjure',
      ColourPurple,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods"',
      'CMDispTooltipWarnConjureText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnConjureFrenzy',
      ColourPurple,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods" (Frenzy)',
      'CMDispTooltipWarnConjureFrenzyText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnEdifice',
      ColourPurple,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies needed for "Spontaneous Edifice" to possibly give you your most expensive building"',
      'CMDispTooltipWarnEdificeText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnUser',
      ColourRed,
      'Warning: ',
      `Purchase of this item will put you under the number of Cookies equal to ${Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnUser} seconds of CPS`,
      'CMDispTooltipWarnUserText',
    ),
  );

  return TooltipWarn;
}

/**
 * This function appends the sections for Bonus Income, PP and Time left (to achiev) to the tooltip-object
 * The actual data is added by the Update-functions themselves
 * @param	{object}	tooltip		Object of a TooltipBox, normally created by a call to CM.Disp.TooltipCreateTooltipBox()
 */
export function TooltipCreateCalculationSection(tooltip) {
  tooltip.appendChild(TooltipCreateHeader('Bonus Income'));
  const income = document.createElement('div');
  income.style.marginBottom = '4px';
  income.style.color = 'white';
  income.id = 'CMTooltipIncome';
  tooltip.appendChild(income);

  tooltip.appendChild(TooltipCreateHeader('Bonus Cookies per Click'));
  tooltip.lastChild.style.display = 'none'; // eslint-disable-line no-param-reassign
  const click = document.createElement('div');
  click.style.marginBottom = '4px';
  click.style.color = 'white';
  click.style.display = 'none';
  click.id = 'CMTooltipCookiePerClick';
  tooltip.appendChild(click);

  tooltip.appendChild(TooltipCreateHeader('Payback Period'));
  const pp = document.createElement('div');
  pp.style.marginBottom = '4px';
  pp.id = 'CMTooltipPP';
  tooltip.appendChild(pp);

  tooltip.appendChild(TooltipCreateHeader('Time Left'));
  const time = document.createElement('div');
  time.id = 'CMTooltipTime';
  tooltip.appendChild(time);

  if (TooltipType === 'b') {
    tooltip.appendChild(TooltipCreateHeader('Production left till next achievement'));
    tooltip.lastChild.id = 'CMTooltipProductionLeftHeader'; // eslint-disable-line no-param-reassign
    const production = document.createElement('div');
    production.id = 'CMTooltipProductionLeft';
    tooltip.appendChild(production);
  }
  if (TooltipType === 'b') {
    tooltip.appendChild(TooltipCreateHeader('Buildings (price / PP) left till next achievement'));
    tooltip.lastChild.id = 'CMTooltipNextAchievementHeader'; // eslint-disable-line no-param-reassign
    const production = document.createElement('div');
    production.id = 'CMTooltipNextAchievement';
    tooltip.appendChild(production);
  }
}
