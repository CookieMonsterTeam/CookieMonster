/**
 * This function toggles the position of the warnings created by CM.Disp.TooltipCreateWarningSection()
 * It is called by a change in CM.Options.ToolWarnPos
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
export default function ToggleToolWarnPos() {
  if (l('CMDispTooltipWarningParent') !== null) {
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnPos === 0) {
      l('CMDispTooltipWarningParent').style.top = 'auto';
      l('CMDispTooltipWarningParent').style.margin = '4px -4px';
      l('CMDispTooltipWarningParent').style.padding = '3px 4px';
    } else {
      l('CMDispTooltipWarningParent').style.right = 'auto';
      l('CMDispTooltipWarningParent').style.margin = '4px';
      l('CMDispTooltipWarningParent').style.padding = '4px 3px';
    }
  }
}
