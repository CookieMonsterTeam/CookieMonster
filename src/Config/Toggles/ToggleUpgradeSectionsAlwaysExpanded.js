import { CMOptions } from '../VariablesAndData';

/**
 * This function toggles the upgrade to be always expanded
 * It is called by a change in CM.Options.ToolWarnPos
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
export default function ToggleUpgradeSectionsAlwaysExpanded() {
  Object.values(document.getElementsByClassName('storeSection')).forEach((section) => {
    if (CMOptions.UpgradesNeverCollapse || section.id === 'products') {
      section.style.height = 'auto'; // eslint-disable-line no-param-reassign
    } else if (section.id === 'vaultUpgrades') {
      section.style.height = '30px'; // eslint-disable-line no-param-reassign
    } else if (section.id === 'upgrades') {
      section.style.height = '60px'; // eslint-disable-line no-param-reassign
    } else {
      section.style.height = '60px'; // eslint-disable-line no-param-reassign
    }
  });
}
