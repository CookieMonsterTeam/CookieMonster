/**
 * This function updates the location of the tooltip
 * It is called by Game.tooltip.update() because of CM.Main.ReplaceNative()
 */
export function UpdateTooltipLocation() {
	if (Game.tooltip.origin === 'store') {
		let warnOffset = 0;
		if (CM.Options.ToolWarnLucky === 1 && CM.Options.ToolWarnPos === 1 && l('CMDispTooltipWarningParent') !== null) {
			warnOffset = l('CMDispTooltipWarningParent').clientHeight - 4;
		}
		Game.tooltip.tta.style.top = `${Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnOffset - 46)}px`;
	}
	// Kept for future possible use if the code changes again
	/* else if (!Game.onCrate && !Game.OnAscend && CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	} */
}

/**
 * This function toggles the position of the warnings created by CM.Disp.TooltipCreateWarningSection()
 * It is called by a change in CM.Options.ToolWarnPos
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
export function ToggleToolWarnPos() {
	if (l('CMDispTooltipWarningParent') !== null) {
		if (CM.Options.ToolWarnPos === 0) {
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
