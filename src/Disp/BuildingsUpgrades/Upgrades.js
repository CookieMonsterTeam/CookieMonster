import { CacheUpgrades } from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import {
  ColourBackPre,
  ColourBlue,
  ColourGray,
  ColourGreen,
  ColourOrange,
  ColourPurple,
  ColourRed,
  ColoursOrdering,
  ColourYellow,
} from '../VariablesAndData';

/**
 * This function adjusts some things in the upgrades section
 * It colours them and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.ToggleUpgradeBarAndColour & CM.Disp.RefreshScale()
 * And by changes in CM.Options.SortUpgrades
 */
export default function UpdateUpgrades() {
  // This counts the amount of upgrades for each pp group and updates the Upgrade Bar
  if (CMOptions.UpBarColour > 0) {
    let blue = 0;
    let green = 0;
    let yellow = 0;
    let orange = 0;
    let red = 0;
    let purple = 0;
    let gray = 0;

    Object.keys(Game.UpgradesInStore).forEach((i) => {
      const me = Game.UpgradesInStore[i];
      let addedColour = false;
      for (let j = 0; j < l(`upgrade${i}`).childNodes.length; j += 1) {
        if (l(`upgrade${i}`).childNodes[j].className.indexOf(ColourBackPre) !== -1) {
          l(`upgrade${i}`).childNodes[j].className = ColourBackPre + CacheUpgrades[me.name].color;
          addedColour = true;
          break;
        }
      }
      if (!addedColour) {
        const div = document.createElement('div');
        div.style.width = '10px';
        div.style.height = '10px';
        div.className = ColourBackPre + CacheUpgrades[me.name].color;
        l(`upgrade${i}`).appendChild(div);
      }
      if (CacheUpgrades[me.name].color === ColourBlue) blue += 1;
      else if (CacheUpgrades[me.name].color === ColourGreen) green += 1;
      else if (CacheUpgrades[me.name].color === ColourYellow) yellow += 1;
      else if (CacheUpgrades[me.name].color === ColourOrange) orange += 1;
      else if (CacheUpgrades[me.name].color === ColourRed) red += 1;
      else if (CacheUpgrades[me.name].color === ColourPurple) purple += 1;
      else if (CacheUpgrades[me.name].color === ColourGray) gray += 1;
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
    o.color = CacheUpgrades[o.name].color;
    arr.push(o);
  }

  if (CMOptions.SortUpgrades) {
    // Sort by pp colour group, then by pp.
    arr.sort((a, b) =>
      ColoursOrdering.indexOf(a.color) === ColoursOrdering.indexOf(b.color)
        ? a.pp - b.pp
        : ColoursOrdering.indexOf(a.color) - ColoursOrdering.indexOf(b.color)
    );
  } else {
    arr.sort((a, b) => a.price - b.price);
  }

  const nameChecker = function (arr2, upgrade) {
    return arr2.findIndex((e) => e.name === upgrade.name);
  };
  for (let x = 0; x < Game.UpgradesInStore.length; x += 1) {
    l(`upgrade${x}`).style.order = nameChecker(arr, Game.UpgradesInStore[x]) + 1;
  }
}
