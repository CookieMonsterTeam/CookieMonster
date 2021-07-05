import ToggleBuildingLock from './ToggleBuildingLock';

/**
 * This function adds a lock button to the "building view" in the middle section
 */
export default function CreateBuildingLockButtons() {
  Object.keys(l('rows').children).forEach((index) => {
    const productButtons = l('rows').children[index].children[1];
    const button = document.createElement('div');
    button.id = `productLock${Number(index) + 1}`;
    button.className = 'productButton';
    button.innerHTML = 'Unlocked';
    button.onclick = function () {
      ToggleBuildingLock(Number(index) + 1);
    };
    productButtons.appendChild(button);
  });
}
