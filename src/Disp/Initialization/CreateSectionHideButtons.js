/**
 * This function creates two objects at the top of the right column that allowing hiding the upgrade and building section
 */
export default function CreateSectionHideButtons() {
  const div = document.createElement('div');
  div.id = 'CMSectionHidButtons';
  div.style.textAlign = 'center';
  const a = document.createElement('a');
  a.className = 'option';
  a.onclick = function () {
    if (l('upgrades').style.display === 'flex') {
      l('upgrades').style.display = 'none';
      l('toggleUpgrades').style.display = 'none';
      l('techUpgrades').style.display = 'none';
      l('vaultUpgrades').style.display = 'none';
    } else {
      l('upgrades').style.display = 'flex';
      if (l('toggleUpgrades').children.length !== 0) l('toggleUpgrades').style.display = 'block';
      if (l('techUpgrades').children.length !== 0) l('techUpgrades').style.display = 'block';
      if (l('vaultUpgrades').children.length !== 0) l('vaultUpgrades').style.display = 'block';
    }
  };
  a.textContent = 'Hide/Show Upgrades';
  div.appendChild(a);
  const b = document.createElement('a');
  b.className = 'option';
  b.onclick = function () {
    if (l('products').style.display === 'grid') l('products').style.display = 'none';
    else l('products').style.display = 'grid';
  };
  b.textContent = 'Hide/Show Buildings';
  div.appendChild(b);
  l('store').insertBefore(div, l('store').childNodes[2]);
}
