import CacheDragonAuras from '../../Cache/Dragon/CacheDragonAuras';
import { CacheDragonAura, CacheDragonAura2 } from '../../Cache/VariablesAndData';
import { CreateBotBarBuildingColumn } from '../../Disp/InfoBars/CreateDOMElements';
import InitAchievement from '../InitializeData/InitAchievement';
import InitialBuildingData from '../InitializeData/InitialBuildingData';
import InitUpgrade from '../InitializeData/InitUpgrade';
import {
  SimAchievements,
  SimAchievementsOwned, // eslint-disable-line no-unused-vars
  SimDragonAura, // eslint-disable-line no-unused-vars
  SimDragonAura2, // eslint-disable-line no-unused-vars
  SimGod1, // eslint-disable-line no-unused-vars
  SimGod2, // eslint-disable-line no-unused-vars
  SimGod3, // eslint-disable-line no-unused-vars
  SimHeavenlyPower, // eslint-disable-line no-unused-vars
  SimObjects,
  SimPledges, // eslint-disable-line no-unused-vars
  SimPrestige, // eslint-disable-line no-unused-vars
  SimUpgrades,
  SimUpgradesOwned, // eslint-disable-line no-unused-vars
} from '../VariablesAndData';

/**
 * This function copies all relevant data and therefore sets a new iteration of the "sim data"
 * It is called at the start of any function that simulates certain behaviour or actions
 */
export default function CopyData() {
  // Other variables
  SimUpgradesOwned = Game.UpgradesOwned;
  SimPledges = Game.pledges;
  SimAchievementsOwned = Game.AchievementsOwned;
  SimHeavenlyPower = Game.heavenlyPower;
  SimPrestige = Game.prestige;

  // Buildings
  Object.keys(Game.Objects).forEach((i) => {
    const me = Game.Objects[i];
    let you = SimObjects[i];
    if (you === undefined) {
      // New building!
      SimObjects[i] = InitialBuildingData(i);
      you = SimObjects[i];
      CreateBotBarBuildingColumn(i); // Add new building to the bottom bar
    }
    you.amount = me.amount;
    you.level = me.level;
    you.totalCookies = me.totalCookies;
    you.basePrice = me.basePrice;
    you.free = me.free;
    if (me.minigameLoaded) {
      if (me.name === 'Temple') {
        SimGod1 = me.minigame.slot[0];
        SimGod2 = me.minigame.slot[1];
        SimGod3 = me.minigame.slot[2];
      }
      you.minigameLoaded = me.minigameLoaded;
      you.minigame = me.minigame;
    }
    SimObjects[i] = you;
  });

  // Upgrades
  Object.keys(Game.Upgrades).forEach((i) => {
    const me = Game.Upgrades[i];
    let you = SimUpgrades[i];
    if (you === undefined) {
      SimUpgrades[i] = InitUpgrade(i);
      you = SimUpgrades[i];
    }
    you.bought = me.bought;
    SimUpgrades[i] = you;
  });

  // Achievements
  Object.keys(Game.Achievements).forEach((i) => {
    const me = Game.Achievements[i];
    let you = SimAchievements[i];
    if (you === undefined) {
      SimAchievements[i] = InitAchievement(i);
      you = SimAchievements[i];
    }
    you.won = me.won;
    SimAchievements[i] = you;
  });

  // Auras
  CacheDragonAuras();
  SimDragonAura = CacheDragonAura;
  SimDragonAura2 = CacheDragonAura2;
}
