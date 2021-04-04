import { CMOptions } from '../../Config/VariablesAndData';
import AddMenuStats from './Statistics/AddStatsPage';
import AddMenuInfo from './Info/InfoPage';
import AddMenuPref from './Settings/SettingsPage';

/**
 * This function adds the calll the functions to add extra info to the stats and options pages
 */
export default function AddMenu() {
  const title = document.createElement('div');
  title.className = 'title';

  if (Game.onMenu === 'prefs') {
    title.textContent = 'Cookie Monster Settings';
    AddMenuPref(title);
  } else if (Game.onMenu === 'stats') {
    if (CMOptions.Stats) {
      title.textContent = 'Cookie Monster Statistics';
      AddMenuStats(title);
    }
  } else if (Game.onMenu === 'log') {
    title.textContent = 'Cookie Monster '; // To create space between name and button
    AddMenuInfo(title);
  }
}
