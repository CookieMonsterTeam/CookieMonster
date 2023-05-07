import { ChristCookies, HalloCookies } from '../../Data/Gamedata';
import SimHas from '../ReplacedGameFunctions/SimHas';
import SimHasAchiev from '../ReplacedGameFunctions/SimHasAchiev';
import SimWin from '../SimulationData/SimWin';
import { SimObjects, SimUpgradesOwned } from '../VariablesAndData';

/**
 * This function calculates if any special achievements have been obtained
 * If so it SimWin()'s them and the caller function will know to recall CM.Sim.CalculateGains()
 * It is called at the end of any functions that simulates certain behaviour
 */
export default function CheckOtherAchiev() {
  let grandmas = 0;
  Object.keys(Game.GrandmaSynergies).forEach((i) => {
    if (SimHas(Game.GrandmaSynergies[i])) grandmas += 1;
  });
  if (!SimHasAchiev('Elder') && grandmas >= 7) SimWin('Elder');
  if (!SimHasAchiev('Veteran') && grandmas >= 14) SimWin('Veteran');

  let buildingsOwned = 0;
  let mathematician = 1;
  let base10 = 1;
  let minAmount = 100000;
  Object.keys(SimObjects).forEach((i) => {
    buildingsOwned += SimObjects[i].amount;
    minAmount = Math.min(SimObjects[i].amount, minAmount);
    if (!SimHasAchiev('Mathematician')) {
      if (
        SimObjects[i].amount <
        Math.min(128, 2 ** (Game.ObjectsById.length - Game.Objects[i].id - 1))
      )
        mathematician = 0;
    }
    if (!SimHasAchiev('Base 10')) {
      if (SimObjects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id) * 10) base10 = 0;
    }
  });
  if (minAmount >= 1) SimWin('One with everything');
  if (mathematician === 1) SimWin('Mathematician');
  if (base10 === 1) SimWin('Base 10');
  if (minAmount >= 100) SimWin('Centennial');
  if (minAmount >= 150) SimWin('Centennial and a half');
  if (minAmount >= 200) SimWin('Bicentennial');
  if (minAmount >= 250) SimWin('Bicentennial and a half');
  if (minAmount >= 300) SimWin('Tricentennial');
  if (minAmount >= 350) SimWin('Tricentennial and a half');
  if (minAmount >= 400) SimWin('Quadricentennial');
  if (minAmount >= 450) SimWin('Quadricentennial and a half');
  if (minAmount >= 500) SimWin('Quincentennial');
  if (minAmount >= 550) SimWin('Quincentennial and a half');
  if (minAmount >= 600) SimWin('Sexcentennial');
  if (minAmount >= 650) SimWin('Sexcentennial and a half');
  if (minAmount >= 700) SimWin('Septcentennial');

  if (buildingsOwned >= 100) SimWin('Builder');
  if (buildingsOwned >= 500) SimWin('Architect');
  if (buildingsOwned >= 1000) SimWin('Engineer');
  if (buildingsOwned >= 2500) SimWin('Lord of Constructs');
  if (buildingsOwned >= 5000) SimWin('Grand design');
  if (buildingsOwned >= 7500) SimWin('Ecumenopolis');
  if (buildingsOwned >= 10000) SimWin('Myriad');

  if (SimUpgradesOwned >= 20) SimWin('Enhancer');
  if (SimUpgradesOwned >= 50) SimWin('Augmenter');
  if (SimUpgradesOwned >= 100) SimWin('Upgrader');
  if (SimUpgradesOwned >= 200) SimWin('Lord of Progress');
  if (SimUpgradesOwned >= 300) SimWin('The full picture');
  if (SimUpgradesOwned >= 400) SimWin("When there's nothing left to add");
  if (SimUpgradesOwned >= 500) SimWin('Kaizen');
  if (SimUpgradesOwned >= 600) SimWin('Beyond quality');
  if (SimUpgradesOwned >= 700) SimWin("Oft we mar what's well");

  if (buildingsOwned >= 4000 && SimUpgradesOwned >= 300) SimWin('Polymath');
  if (buildingsOwned >= 8000 && SimUpgradesOwned >= 400) SimWin('Renaissance baker');

  if (SimObjects.Cursor.amount + SimObjects.Grandma.amount >= 777) SimWin('The elder scrolls');

  let hasAllHalloCook = true;
  Object.keys(HalloCookies).forEach((i) => {
    if (!SimHas(HalloCookies[i])) hasAllHalloCook = false;
  });
  if (hasAllHalloCook) SimWin('Spooky cookies');

  let hasAllChristCook = true;
  Object.keys(ChristCookies).forEach((i) => {
    if (!SimHas(ChristCookies[i])) hasAllChristCook = false;
  });
  if (hasAllChristCook) SimWin('Let it snow');

  if (SimHas('Fortune cookies')) {
    const list = Game.Tiers.fortune.upgrades;
    let fortunes = 0;
    Object.keys(list).forEach((i) => {
      if (SimHas(list[i].name)) fortunes += 1;
    });
    if (fortunes >= list.length) SimWin('O Fortuna');
  }
}
