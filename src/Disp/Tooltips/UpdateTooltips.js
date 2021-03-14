import GetCPSBuffMult from '../../Cache/CPS/GetCPSBuffMult';
import {
  CacheEdifice,
  CacheLastChoEgg,
  CacheLucky,
  CacheNoGoldSwitchCookiesPS,
  CacheObjects1,
  CacheObjects10,
  CacheObjects100,
  CacheUpgrades,
} from '../../Cache/VariablesAndData';
import ToggleToolWarnPos from '../../Config/Toggles/ToggleToolWarnPos';
import { CMOptions } from '../../Config/VariablesAndData';
import { SimObjects } from '../../Sim/VariablesAndData';
import {
  Beautify,
  FormatTime,
  GetTimeColor,
} from '../BeautifyAndFormatting/BeautifyFormatting';
import CalculateGrimoireRefillTime from '../HelperFunctions/CalculateGrimoireRefillTime';
import GetCPS from '../HelperFunctions/GetCPS';
import GetLumpColor from '../HelperFunctions/GetLumpColor';
import GetWrinkConfigBank from '../HelperFunctions/GetWrinkConfigBank';
import {
  ColorTextPre,
  LastTargetTooltipBuilding,
  TooltipBonusIncome,
  TooltipBonusMouse,
  TooltipName,
  TooltipPrice,
  TooltipType,
} from '../VariablesAndData';
import * as Create from './CreateTooltip';

/** Functions that update specific types of tooltips  */

/**
 * This function adds extra info to the Building tooltips
 */
export function Building() {
  if (CMOptions.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
    const tooltipBox = l('CMTooltipBorder');
    Create.TooltipCreateCalculationSection(tooltipBox);

    let target;
    if (Game.buyMode === 1) {
      LastTargetTooltipBuilding = target;
    } else {
      target = LastTargetTooltipBuilding;
    }
    if (Game.buyBulk === 1) target = CacheObjects1;
    else if (Game.buyBulk === 10) target = CacheObjects10;
    else if (Game.buyBulk === 100) target = CacheObjects100;

    TooltipPrice = Game.Objects[TooltipName].bulkPrice;
    TooltipBonusIncome = target[TooltipName].bonus;

    if (CMOptions.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
      l('CMTooltipIncome').textContent = Beautify(TooltipBonusIncome, 2);
      const increase = Math.round(
        (TooltipBonusIncome / Game.cookiesPs) * 10000,
      );
      if (Number.isFinite(increase) && increase !== 0) {
        l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
      }
      l('CMTooltipBorder').className = ColorTextPre + target[TooltipName].color;
      l('CMTooltipPP').textContent = Beautify(target[TooltipName].pp, 2);
      l('CMTooltipPP').className = ColorTextPre + target[TooltipName].color;
      const timeColor = GetTimeColor(
        (TooltipPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
      );
      l('CMTooltipTime').textContent = timeColor.text;
      if (
        timeColor.text === 'Done!' &&
        Game.cookies < target[TooltipName].price
      ) {
        l('CMTooltipTime').textContent = `${timeColor.text} (with Wrink)`;
      } else l('CMTooltipTime').textContent = timeColor.text;
      l('CMTooltipTime').className = ColorTextPre + timeColor.color;
    }

    // Add "production left till next achievement"-bar
    l('CMTooltipProductionHeader').style.display = 'none';
    l('CMTooltipTime').style.marginBottom = '0px';
    for (const i of Object.keys(Game.Objects[TooltipName].productionAchievs)) {
      if (
        !Game.HasAchiev(
          Game.Objects[TooltipName].productionAchievs[i].achiev.name,
        )
      ) {
        const nextProductionAchiev =
          Game.Objects[TooltipName].productionAchievs[i];
        l('CMTooltipTime').style.marginBottom = '4px';
        l('CMTooltipProductionHeader').style.display = '';
        l('CMTooltipProduction').className = `ProdAchievement${TooltipName}`;
        l('CMTooltipProduction').textContent = Beautify(
          nextProductionAchiev.pow - SimObjects[TooltipName].totalCookies,
          15,
        );
        l('CMTooltipProduction').style.color = 'white';
        break;
      }
    }
  } else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Upgrade tooltips
 */
export function Upgrade() {
  const tooltipBox = l('CMTooltipBorder');
  Create.TooltipCreateCalculationSection(tooltipBox);

  TooltipBonusIncome =
    CacheUpgrades[Game.UpgradesInStore[TooltipName].name].bonus;
  TooltipPrice = Game.Upgrades[
    Game.UpgradesInStore[TooltipName].name
  ].getPrice();
  TooltipBonusMouse =
    CacheUpgrades[Game.UpgradesInStore[TooltipName].name].bonusMouse;

  if (CMOptions.TooltipBuildUpgrade === 1) {
    l('CMTooltipIncome').textContent = Beautify(TooltipBonusIncome, 2);
    const increase = Math.round((TooltipBonusIncome / Game.cookiesPs) * 10000);
    // Don't display certain parts of tooltip if not applicable
    if (
      l('CMTooltipIncome').textContent === '0' &&
      (TooltipType === 'b' || TooltipType === 'u')
    ) {
      l('Bonus IncomeTitle').style.display = 'none';
      l('CMTooltipIncome').style.display = 'none';
      l('Payback PeriodTitle').style.display = 'none';
      l('CMTooltipPP').style.display = 'none';
    } else {
      if (Number.isFinite(increase) && increase !== 0) {
        l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
      }
      l('CMTooltipBorder').className =
        ColorTextPre +
        CacheUpgrades[Game.UpgradesInStore[TooltipName].name].color;
      // If clicking power upgrade
      if (TooltipBonusMouse) {
        l('CMTooltipCookiePerClick').textContent = Beautify(TooltipBonusMouse);
        l('CMTooltipCookiePerClick').style.display = 'block';
        l('CMTooltipCookiePerClick').previousSibling.style.display = 'block';
      }
      // If only a clicking power upgrade change PP to click-based period
      if (TooltipBonusIncome === 0 && TooltipBonusMouse) {
        l('CMTooltipPP').textContent = `${Beautify(
          TooltipPrice / TooltipBonusMouse,
        )} Clicks`;
        l('CMTooltipPP').style.color = 'white';
      } else {
        l('CMTooltipPP').textContent = Beautify(
          CacheUpgrades[Game.UpgradesInStore[TooltipName].name].pp,
          2,
        );
        l('CMTooltipPP').className =
          ColorTextPre +
          CacheUpgrades[Game.UpgradesInStore[TooltipName].name].color;
      }
    }
    const timeColor = GetTimeColor(
      (TooltipPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
    );
    l('CMTooltipTime').textContent = timeColor.text;
    if (
      timeColor.text === 'Done!' &&
      Game.cookies < Game.UpgradesInStore[TooltipName].getPrice()
    ) {
      l('CMTooltipTime').textContent = `${timeColor.text} (with Wrink)`;
    } else l('CMTooltipTime').textContent = timeColor.text;
    l('CMTooltipTime').className = ColorTextPre + timeColor.color;

    // Add extra info to Chocolate egg tooltip
    if (Game.UpgradesInStore[TooltipName].name === 'Chocolate egg') {
      l('CMTooltipBorder').lastChild.style.marginBottom = '4px';
      l('CMTooltipBorder').appendChild(
        Create.TooltipCreateHeader('Cookies to be gained (Currently/Max)'),
      );
      const chocolate = document.createElement('div');
      chocolate.style.color = 'white';
      chocolate.textContent = `${Beautify(Game.cookies * 0.05)} / ${Beautify(
        CacheLastChoEgg,
      )}`;
      l('CMTooltipBorder').appendChild(chocolate);
    }
  } else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Sugar Lump tooltip
 * It adds to the additional information to l('CMTooltipArea')
 */
export function SugarLump() {
  if (CMOptions.TooltipLump === 1) {
    const tooltipBox = l('CMTooltipBorder');

    tooltipBox.appendChild(Create.TooltipCreateHeader('Current Sugar Lump'));

    const lumpType = document.createElement('div');
    lumpType.id = 'CMTooltipTime';
    tooltipBox.appendChild(lumpType);
    const lumpColor = GetLumpColor(Game.lumpCurrentType);
    lumpType.textContent = lumpColor.text;
    lumpType.className = ColorTextPre + lumpColor.color;
  } else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Grimoire tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
export function Grimoire() {
  const minigame = Game.Objects['Wizard tower'].minigame;
  const spellCost = minigame.getSpellCost(minigame.spellsById[TooltipName]);

  if (CMOptions.TooltipGrim === 1 && spellCost <= minigame.magicM) {
    const tooltipBox = l('CMTooltipBorder');

    // Time left till enough magic for spell
    tooltipBox.appendChild(Create.TooltipCreateHeader('Time Left'));
    const time = document.createElement('div');
    time.id = 'CMTooltipTime';
    tooltipBox.appendChild(time);
    const timeColor = GetTimeColor(
      CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost),
    );
    time.textContent = timeColor.text;
    time.className = ColorTextPre + timeColor.color;

    // Time left untill magic spent is recovered
    if (spellCost <= minigame.magic) {
      tooltipBox.appendChild(Create.TooltipCreateHeader('Recover Time'));
      const recover = document.createElement('div');
      recover.id = 'CMTooltipRecover';
      tooltipBox.appendChild(recover);
      const recoverColor = GetTimeColor(
        CalculateGrimoireRefillTime(
          Math.max(0, minigame.magic - spellCost),
          minigame.magicM,
          minigame.magic,
        ),
      );
      recover.textContent = recoverColor.text;
      recover.className = ColorTextPre + recoverColor.color;
    }

    // Extra information on cookies gained when spell is Conjure Baked Goods (Name === 0)
    if (TooltipName === '0') {
      tooltipBox.appendChild(
        Create.TooltipCreateHeader('Cookies to be gained/lost'),
      );
      const conjure = document.createElement('div');
      conjure.id = 'x';
      tooltipBox.appendChild(conjure);
      const reward = document.createElement('span');
      reward.style.color = '#33FF00';
      reward.textContent = Beautify(
        Math.min(
          (Game.cookies + GetWrinkConfigBank()) * 0.15,
          CacheNoGoldSwitchCookiesPS * 60 * 30,
        ),
        2,
      );
      conjure.appendChild(reward);
      const seperator = document.createElement('span');
      seperator.textContent = ' / ';
      conjure.appendChild(seperator);
      const loss = document.createElement('span');
      loss.style.color = 'red';
      loss.textContent = Beautify(CacheNoGoldSwitchCookiesPS * 60 * 15, 2);
      conjure.appendChild(loss);
    }

    l('CMTooltipArea').appendChild(tooltipBox);
  } else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Garden plots tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
export function GardenPlots() {
  const minigame = Game.Objects.Farm.minigame;
  if (
    CMOptions.TooltipPlots &&
    minigame.plot[TooltipName[1]][TooltipName[0]][0] !== 0
  ) {
    const mature =
      minigame.plot[TooltipName[1]][TooltipName[0]][1] >
      minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1]
        .matureBase;
    const plantName =
      minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1]
        .name;
    l('CMTooltipBorder').appendChild(
      Create.TooltipCreateHeader('Reward (Current / Maximum)'),
    );
    const reward = document.createElement('div');
    reward.id = 'CMTooltipPlantReward';
    l('CMTooltipBorder').appendChild(reward);
    if (plantName === 'Bakeberry') {
      l('CMTooltipPlantReward').textContent = `${
        mature
          ? Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30))
          : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 30)}`;
    } else if (plantName === 'Chocoroot' || plantName === 'White chocoroot') {
      l('CMTooltipPlantReward').textContent = `${
        mature
          ? Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3))
          : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 3)}`;
    } else if (plantName === 'Queenbeet') {
      l('CMTooltipPlantReward').textContent = `${
        mature
          ? Beautify(Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60))
          : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 60)}`;
    } else if (plantName === 'Duketater') {
      l('CMTooltipPlantReward').textContent = `${
        mature
          ? Beautify(Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120))
          : '0'
      } / ${Beautify(Game.cookiesPs * 60 * 120)}`;
    } else l('CMTooltipArea').style.display = 'none';
  } else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function adds extra info to the Garden Harvest All tooltip
 * It is called when the Harvest All tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
export function HarvestAll() {
  const minigame = Game.Objects.Farm.minigame;
  if (CMOptions.TooltipLump) {
    l('CMTooltipBorder').appendChild(
      Create.TooltipCreateHeader('Cookies gained from harvesting:'),
    );
    let totalGain = 0;
    let mortal = 0;
    if (Game.keys[16] && Game.keys[17]) mortal = 1;
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        if (minigame.plot[y][x][0] >= 1) {
          const tile = minigame.plot[y][x];
          const me = minigame.plantsById[tile[0] - 1];
          const plantName = me.name;

          let count = true;
          if (mortal && me.immortal) count = false;
          if (tile[1] < me.matureBase) count = false;
          if (count && plantName === 'Bakeberry') {
            totalGain += Math.min(
              Game.cookies * 0.03,
              Game.cookiesPs * 60 * 30,
            );
          } else if (
            (count && plantName === 'Chocoroot') ||
            plantName === 'White chocoroot'
          ) {
            totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3);
          } else if (count && plantName === 'Queenbeet') {
            totalGain += Math.min(
              Game.cookies * 0.04,
              Game.cookiesPs * 60 * 60,
            );
          } else if (count && plantName === 'Duketater') {
            totalGain += Math.min(
              Game.cookies * 0.08,
              Game.cookiesPs * 60 * 120,
            );
          }
        }
      }
    }
    l('CMTooltipBorder').appendChild(
      document.createTextNode(Beautify(totalGain)),
    );
  } else l('CMTooltipArea').style.display = 'none';
}

/**
 * This function updates the warnings section of the building and upgrade tooltips
 * It is called by CM.Disp.UpdateTooltip()
 */
export function Warnings() {
  if (TooltipType === 'b' || TooltipType === 'u') {
    if (document.getElementById('CMDispTooltipWarningParent') === null) {
      l('tooltipAnchor').appendChild(Create.TooltipCreateWarningSection());
      ToggleToolWarnPos();
    }

    if (CMOptions.ToolWarnPos === 0)
      l('CMDispTooltipWarningParent').style.right = '0px';
    else
      l('CMDispTooltipWarningParent').style.top = `${
        l('tooltip').offsetHeight
      }px`;

    l('CMDispTooltipWarningParent').style.width = `${
      l('tooltip').offsetWidth - 6
    }px`;

    const amount = Game.cookies + GetWrinkConfigBank() - TooltipPrice;
    const bonusIncomeUsed = CMOptions.ToolWarnBon ? TooltipBonusIncome : 0;
    let limitLucky = CacheLucky;
    if (CMOptions.ToolWarnBon === 1) {
      let bonusNoFren = TooltipBonusIncome;
      bonusNoFren /= GetCPSBuffMult();
      limitLucky += (bonusNoFren * 60 * 15) / 0.15;
    }

    if (CMOptions.ToolWarnLucky === 1) {
      if (amount < limitLucky && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnLucky').style.display = '';
        l('CMDispTooltipWarnLuckyText').textContent = `${Beautify(
          limitLucky - amount,
        )} (${FormatTime(
          (limitLucky - amount) / (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnLucky').style.display = 'none';
    } else l('CMDispTooltipWarnLucky').style.display = 'none';

    if (CMOptions.ToolWarnLuckyFrenzy === 1) {
      const limitLuckyFrenzy = limitLucky * 7;
      if (
        amount < limitLuckyFrenzy &&
        (TooltipType !== 'b' || Game.buyMode === 1)
      ) {
        l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
        l('CMDispTooltipWarnLuckyFrenzyText').textContent = `${Beautify(
          limitLuckyFrenzy - amount,
        )} (${FormatTime(
          (limitLuckyFrenzy - amount) / (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
    } else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';

    if (CMOptions.ToolWarnConjure === 1) {
      const limitConjure = limitLucky * 2;
      if (
        amount < limitConjure &&
        (TooltipType !== 'b' || Game.buyMode === 1)
      ) {
        l('CMDispTooltipWarnConjure').style.display = '';
        l('CMDispTooltipWarnConjureText').textContent = `${Beautify(
          limitConjure - amount,
        )} (${FormatTime(
          (limitConjure - amount) / (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnConjure').style.display = 'none';
    } else l('CMDispTooltipWarnConjure').style.display = 'none';

    if (CMOptions.ToolWarnConjureFrenzy === 1) {
      const limitConjureFrenzy = limitLucky * 2 * 7;
      if (
        amount < limitConjureFrenzy &&
        (TooltipType !== 'b' || Game.buyMode === 1)
      ) {
        l('CMDispTooltipWarnConjureFrenzy').style.display = '';
        l('CMDispTooltipWarnConjureFrenzyText').textContent = `${Beautify(
          limitConjureFrenzy - amount,
        )} (${FormatTime(
          (limitConjureFrenzy - amount) / (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';
    } else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';

    if (
      CMOptions.ToolWarnEdifice === 1 &&
      Game.Objects['Wizard tower'].minigameLoaded
    ) {
      if (
        CacheEdifice &&
        amount < CacheEdifice &&
        (TooltipType !== 'b' || Game.buyMode === 1)
      ) {
        l('CMDispTooltipWarnEdifice').style.display = '';
        l('CMDispTooltipWarnEdificeText').textContent = `${Beautify(
          CacheEdifice - amount,
        )} (${FormatTime(
          (CacheEdifice - amount) / (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnEdifice').style.display = 'none';
    } else l('CMDispTooltipWarnEdifice').style.display = 'none';

    if (CMOptions.ToolWarnUser > 0) {
      if (
        amount < CMOptions.ToolWarnUser * GetCPS() &&
        (TooltipType !== 'b' || Game.buyMode === 1)
      ) {
        l('CMDispTooltipWarnUser').style.display = '';
        // Need to update tooltip text dynamically
        l(
          'CMDispTooltipWarnUser',
        ).children[0].textContent = `Purchase of this item will put you under the number of Cookies equal to ${CMOptions.ToolWarnUser} seconds of CPS`;
        l('CMDispTooltipWarnUserText').textContent = `${Beautify(
          CMOptions.ToolWarnUser * GetCPS() - amount,
        )} (${FormatTime(
          (CMOptions.ToolWarnUser * GetCPS() - amount) /
            (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnUser').style.display = 'none';
    } else l('CMDispTooltipWarnUser').style.display = 'none';
  } else if (l('CMDispTooltipWarningParent') !== null) {
    l('CMDispTooltipWarningParent').remove();
  }
}
