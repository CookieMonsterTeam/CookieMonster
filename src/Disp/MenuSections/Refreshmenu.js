/**
 * This function refreshes the stats page, CM.Options.UpStats determines the rate at which that happens
 * It is called by CM.Disp.Draw()
 */
export default function RefreshMenu() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpStats &&
    Game.onMenu === 'stats' &&
    (Game.drawT - 1) % (Game.fps * 5) !== 0 &&
    (Game.drawT - 1) % Game.fps === 0
  )
    Game.UpdateMenu();
}
