import AddMenuStats from './Statistics/AddStatsPage';

/**
 * This function adds the calll the functions to add extra info to the stats and options pages
 */
export default function AddMenu() {
  const title = document.createElement('div');
  title.className = 'title';

  if (Game.onMenu === 'stats') {
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Stats) {
      title.textContent = 'Cookie Monster Statistics';
      AddMenuStats(title);
    }
  }
}
