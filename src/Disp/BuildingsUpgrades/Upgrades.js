/* eslint-disable no-nested-ternary */
import { CacheUpgrades } from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import {
  ColorBackPre,
  ColorBlue,
  ColorGray,
  ColorGreen,
  ColorOrange,
  ColorPurple,
  ColorRed,
  Colors,
  ColorYellow,
} from '../VariablesAndData';

/**
 * This function adjusts some things in the upgrades section
 * It colours them and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.ToggleUpgradeBarAndColor & CM.Disp.RefreshScale()
 * And by changes in CM.Options.SortUpgrades
 */
export default function UpdateUpgrades() {
  // This counts the amount of upgrades for each pp group and updates the Upgrade Bar
  if (CMOptions.UpBarColor > 0) {
    let blue = 0;
    let green = 0;
    let yellow = 0;
    let orange = 0;
    let red = 0;
    let purple = 0;
    let gray = 0;

    Object.keys(Game.UpgradesInStore).forEach((i) => {
      const me = Game.UpgradesInStore[i];
      let addedColor = false;
      for (let j = 0; j < l(`upgrade${i}`).childNodes.length; j += 1) {
        if (
          l(`upgrade${i}`).childNodes[j].className.indexOf(ColorBackPre) !== -1
        ) {
          l(`upgrade${i}`).childNodes[j].className =
            ColorBackPre + CacheUpgrades[me.name].color;
          addedColor = true;
          break;
        }
      }
      if (!addedColor) {
        const div = document.createElement('div');
        div.style.width = '10px';
        div.style.height = '10px';
        div.className = ColorBackPre + CacheUpgrades[me.name].color;
        l(`upgrade${i}`).appendChild(div);
      }
      if (CacheUpgrades[me.name].color === ColorBlue) blue += 1;
      else if (CacheUpgrades[me.name].color === ColorGreen) green += 1;
      else if (CacheUpgrades[me.name].color === ColorYellow) yellow += 1;
      else if (CacheUpgrades[me.name].color === ColorOrange) orange += 1;
      else if (CacheUpgrades[me.name].color === ColorRed) red += 1;
      else if (CacheUpgrades[me.name].color === ColorPurple) purple += 1;
      else if (CacheUpgrades[me.name].color === ColorGray) gray += 1;
    });

    l('CMUpgradeBarBlue').textContent = blue;
    l('CMUpgradeBarGreen').textContent = green;
    l('CMUpgradeBarYellow').textContent = yellow;
    l('CMUpgradeBarOrange').textContent = orange;
    l('CMUpgradeBarRed').textContent = red;
    l('CMUpgradeBarPurple').textContent = purple;
    l('CMUpgradeBarGray').textContent = gray;
  }

  const arr = [];
  // Build array of pointers, sort by pp, set flex positions
  // This regulates sorting of upgrades
  for (let x = 0; x < Game.UpgradesInStore.length; x += 1) {
    const o = {};
    o.name = Game.UpgradesInStore[x].name;
    o.price = Game.UpgradesInStore[x].basePrice;
    o.pp = CacheUpgrades[o.name].pp;
    arr.push(o);
  }

  if (CMOptions.SortUpgrades) {
    arr.sort(function (a, b) {
      return Colors.indexOf(a.color) > Colors.indexOf(b.color)
        ? 1
        : Colors.indexOf(a.color) < Colors.indexOf(b.color)
        ? -1
        : a.pp < b.pp
        ? -1
        : 0;
    });
  } else {
    arr.sort((a, b) => a.price - b.price);
  }

  const nameChecker = function (arr2, upgrade) {
    return arr2.findIndex((e) => e.name === upgrade.name);
  };
  for (let x = 0; x < Game.UpgradesInStore.length; x += 1) {
    l(`upgrade${x}`).style.order =
      nameChecker(arr, Game.UpgradesInStore[x]) + 1;
  }
}
