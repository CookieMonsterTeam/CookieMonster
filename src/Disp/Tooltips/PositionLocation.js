/**
 * This function updates the location of the tooltip
 * It is called by Game.tooltip.update() because of CM.Main.ReplaceNative()
 */
export default function UpdateTooltipLocation() {
  if (Game.tooltip.origin === 'store') {
    let warnOffset = 0;
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnLucky === 1 &&
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnPos === 1 &&
      l('CMDispTooltipWarningParent') !== null
    ) {
      warnOffset = l('CMDispTooltipWarningParent').clientHeight - 4;
    }
    Game.tooltip.tta.style.top = `${Math.min(
      parseInt(Game.tooltip.tta.style.top, 10),
      l('game').clientHeight +
        l('topBar').clientHeight -
        Game.tooltip.tt.clientHeight -
        warnOffset -
        46,
    )}px`;
  }
  // Kept for future possible use if the code changes again
  /* else if (!Game.onCrate && !Game.OnAscend && CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	} */
}
