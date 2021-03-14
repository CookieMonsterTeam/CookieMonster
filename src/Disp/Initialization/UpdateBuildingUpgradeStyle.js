/**
 * This function updates the style of the building and upgrade sections to make these sortable
 */
export default function UpdateBuildingUpgradeStyle() {
  l('products').style.display = 'grid';
  l('storeBulk').style.gridRow = '1/1';

  l('upgrades').style.display = 'flex';
  l('upgrades').style['flex-wrap'] = 'wrap';
}
