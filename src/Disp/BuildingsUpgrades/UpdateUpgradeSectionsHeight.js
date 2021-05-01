import { CMOptions } from '../../Config/VariablesAndData';

/**
 * This function toggles the upgrade to be always expanded
 * It is called by a change in CM.Options.ToolWarnPos
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
export default function UpdateUpgradeSectionsHeight() {
  Object.values(document.getElementsByClassName('storeSection')).forEach((section) => {
    if (CMOptions.UpgradesNeverCollapse || section.id === 'products') {
      section.style.height = 'auto'; // eslint-disable-line no-param-reassign
    } else if (section.id === 'vaultUpgrades') {
      section.style.height = ''; // eslint-disable-line no-param-reassign
      section.style.minHeight = '0px'; // eslint-disable-line no-param-reassign
    } else if (section.id === 'upgrades') {
      section.style.height = ''; // eslint-disable-line no-param-reassign
      if (section.className.includes('hasMenu')) {
        section.style.minHeight = '82px'; // eslint-disable-line no-param-reassign
      } else {
        section.style.minHeight = '60px'; // eslint-disable-line no-param-reassign
      }
    } else {
      section.style.height = ''; // eslint-disable-line no-param-reassign
      section.style.minHeight = '60px'; // eslint-disable-line no-param-reassign
    }
  });
}
