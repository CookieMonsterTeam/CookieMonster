import {
  ColorBackPre,
  ColorBlue,
  ColorGray,
  ColorGreen,
  ColorOrange,
  ColorPurple,
  ColorRed,
  ColorTextPre,
  ColorYellow,
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
    span.className = ColorBackPre + color;
    span.style.display = 'inline-block';
    span.style.height = '10px';
    span.style.width = '10px';
    span.style.marginRight = '4px';
    div.appendChild(span);
    div.appendChild(document.createTextNode(text));
    return div;
  };

  legend.appendChild(legendLine(ColorBlue, 'Better than best PP building'));
  legend.appendChild(legendLine(ColorGreen, 'Same as best PP building'));
  legend.appendChild(
    legendLine(
      ColorYellow,
      'Between best and worst PP buildings closer to best',
    ),
  );
  legend.appendChild(
    legendLine(
      ColorOrange,
      'Between best and worst PP buildings closer to worst',
    ),
  );
  legend.appendChild(legendLine(ColorRed, 'Same as worst PP building'));
  legend.appendChild(legendLine(ColorPurple, 'Worse than worst PP building'));
  legend.appendChild(legendLine(ColorGray, 'Negative or infinity PP'));
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
    span.className = ColorTextPre + color;
    span.style.width = '14.28571428571429%';
    span.style.display = 'inline-block';
    span.textContent = '0';
    return span;
  };
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarBlue', ColorBlue));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGreen', ColorGreen));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarYellow', ColorYellow));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarOrange', ColorOrange));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarRed', ColorRed));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarPurple', ColorPurple));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGray', ColorGray));

  l('upgrades').parentNode.insertBefore(
    UpgradeBar,
    l('upgrades').parentNode.childNodes[3],
  );
}
