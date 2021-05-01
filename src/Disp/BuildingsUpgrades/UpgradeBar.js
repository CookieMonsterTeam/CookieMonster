import {
  ColourBackPre,
  ColourBlue,
  ColourGray,
  ColourGreen,
  ColourOrange,
  ColourPurple,
  ColourRed,
  ColourTextPre,
  ColourYellow,
} from '../VariablesAndData';

/**
 * This function creates the legend for the upgrade bar
 * @returns	{object}	legend	The legend-object to be added
 */
function CreateUpgradeBarLegend() {
  const legend = document.createElement('div');
  legend.style.minWidth = '330px';
  legend.style.marginBottom = '4px';
  const title = document.createElement('div');
  title.className = 'name';
  title.style.marginBottom = '4px';
  title.textContent = 'Legend';
  legend.appendChild(title);

  const legendLine = function (color, text) {
    const div = document.createElement('div');
    div.style.verticalAlign = 'middle';
    const span = document.createElement('span');
    span.className = ColourBackPre + color;
    span.style.display = 'inline-block';
    span.style.height = '10px';
    span.style.width = '10px';
    span.style.marginRight = '4px';
    div.appendChild(span);
    div.appendChild(document.createTextNode(text));
    return div;
  };

  legend.appendChild(legendLine(ColourBlue, 'Better than the best PP of a building option'));
  legend.appendChild(legendLine(ColourGreen, 'Same as the best PP building option'));
  legend.appendChild(legendLine(ColourYellow, 'Within the top 10 of PP for buildings'));
  legend.appendChild(legendLine(ColourOrange, 'Within the top 20 of PP for buildings'));
  legend.appendChild(legendLine(ColourRed, 'Within the top 30 of PP for buildings'));
  legend.appendChild(legendLine(ColourPurple, 'Outside of the top 30 of PP for buildings'));
  legend.appendChild(legendLine(ColourGray, 'Negative or infinity PP'));
  return legend;
}

/**
 * This function creates the upgrade bar above the upgrade-section in the right section of the screen
 */
export default function CreateUpgradeBar() {
  const UpgradeBar = document.createElement('div');
  UpgradeBar.id = 'CMUpgradeBar';
  UpgradeBar.style.width = '100%';
  UpgradeBar.style.backgroundColor = 'black';
  UpgradeBar.style.textAlign = 'center';
  UpgradeBar.style.fontWeight = 'bold';
  UpgradeBar.style.display = 'none';
  UpgradeBar.style.zIndex = '21';
  UpgradeBar.onmouseout = function () {
    Game.tooltip.hide();
  };

  const placeholder = document.createElement('div');
  placeholder.appendChild(CreateUpgradeBarLegend());
  UpgradeBar.onmouseover = function () {
    Game.tooltip.draw(this, escape(placeholder.innerHTML), 'store');
  };

  const upgradeNumber = function (id, color) {
    const span = document.createElement('span');
    span.id = id;
    span.className = ColourTextPre + color;
    span.style.width = '14.28571428571429%';
    span.style.display = 'inline-block';
    span.textContent = '0';
    return span;
  };
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarBlue', ColourBlue));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGreen', ColourGreen));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarYellow', ColourYellow));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarOrange', ColourOrange));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarRed', ColourRed));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarPurple', ColourPurple));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGray', ColourGray));

  l('upgrades').parentNode.insertBefore(UpgradeBar, l('upgrades').parentNode.childNodes[3]);
}
