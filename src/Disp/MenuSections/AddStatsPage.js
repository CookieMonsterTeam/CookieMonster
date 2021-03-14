/** Main function to create the sections of Cookie Monster on the Statistics page */

import { AddMissingUpgrades } from './CreateMissingUpgrades';
import * as CreateSections from './CreateStatsSections';
import * as CreateElements from './CreateDOMElements';
import * as GameData from '../../Data/Gamedata';
import { CMOptions } from '../../Config/VariablesAndData';

import {
  CacheAverageClicks,
  CacheCentEgg,
  CacheLastChoEgg,
  CacheSeaSpec,
  CacheWrinklersFattest,
  CacheWrinklersNormal,
  CacheWrinklersTotal,
} from '../../Cache/VariablesAndData';
import PopAllNormalWrinklers from '../HelperFunctions/PopWrinklers';
import { ClickTimes, CookieTimes } from '../VariablesAndData';
import GetCPS from '../HelperFunctions/GetCPS';
import { Beautify } from '../BeautifyAndFormatting/BeautifyFormatting';

/**
 * This function adds stats created by CookieMonster to the stats page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
export default function AddMenuStats(title) {
  const stats = document.createElement('div');
  stats.className = 'subsection';
  stats.appendChild(title);

  stats.appendChild(CreateElements.StatsHeader('Lucky Cookies', 'Lucky'));
  if (CMOptions.Header.Lucky) {
    stats.appendChild(CreateSections.LuckySection());
  }

  stats.appendChild(CreateElements.StatsHeader('Chain Cookies', 'Chain'));
  if (CMOptions.Header.Chain) {
    stats.appendChild(CreateSections.ChainSection());
  }

  if (Game.Objects['Wizard tower'].minigameLoaded) {
    stats.appendChild(CreateElements.StatsHeader('Spells', 'Spells'));
    if (CMOptions.Header.Spells) {
      stats.appendChild(CreateSections.SpellsSection());
    }
  }

  if (Game.Objects.Farm.minigameLoaded) {
    stats.appendChild(CreateElements.StatsHeader('Garden', 'Garden'));
    if (CMOptions.Header.Garden) {
      stats.appendChild(CreateSections.GardenSection());
    }
  }

  stats.appendChild(CreateElements.StatsHeader('Prestige', 'Prestige'));
  if (CMOptions.Header.Prestige) {
    stats.appendChild(CreateSections.PrestigeSection());
  }

  if (Game.cpsSucked > 0) {
    stats.appendChild(CreateElements.StatsHeader('Wrinklers', 'Wrink'));
    if (CMOptions.Header.Wrink) {
      const popAllFrag = document.createDocumentFragment();
      popAllFrag.appendChild(
        document.createTextNode(
          `${Beautify(CacheWrinklersTotal)} / ${Beautify(
            CacheWrinklersNormal,
          )} `,
        ),
      );
      const popAllA = document.createElement('a');
      popAllA.textContent = 'Pop All Normal';
      popAllA.className = 'option';
      popAllA.onclick = function () {
        PopAllNormalWrinklers();
      };
      popAllFrag.appendChild(popAllA);
      stats.appendChild(
        CreateElements.StatsListing(
          'basic',
          'Rewards of Popping (All/Normal)',
          popAllFrag,
        ),
      );
      const popFattestFrag = document.createDocumentFragment();
      popFattestFrag.appendChild(
        document.createTextNode(`${Beautify(CacheWrinklersFattest[0])} `),
      );
      const popFattestA = document.createElement('a');
      popFattestA.textContent = 'Pop Single Fattest';
      popFattestA.className = 'option';
      popFattestA.onclick = function () {
        if (CacheWrinklersFattest[1] !== null)
          Game.wrinklers[CacheWrinklersFattest[1]].hp = 0;
      };
      popFattestFrag.appendChild(popFattestA);
      stats.appendChild(
        CreateElements.StatsListing(
          'basic',
          `Rewards of Popping Single Fattest Non-Shiny Wrinkler (id: ${
            CacheWrinklersFattest[1] !== null
              ? CacheWrinklersFattest[1]
              : 'None'
          })`,
          popFattestFrag,
        ),
      );
    }
  }

  let specDisp = false;
  const missingHalloweenCookies = [];
  for (const i of Object.keys(GameData.HalloCookies)) {
    if (!Game.Has(GameData.HalloCookies[i])) {
      missingHalloweenCookies.push(GameData.HalloCookies[i]);
      specDisp = true;
    }
  }
  const missingChristmasCookies = [];
  for (const i of Object.keys(GameData.ChristCookies)) {
    if (!Game.Has(GameData.ChristCookies[i])) {
      missingChristmasCookies.push(GameData.ChristCookies[i]);
      specDisp = true;
    }
  }
  const missingValentineCookies = [];
  for (const i of Object.keys(GameData.ValCookies)) {
    if (!Game.Has(GameData.ValCookies[i])) {
      missingValentineCookies.push(GameData.ValCookies[i]);
      specDisp = true;
    }
  }
  const missingNormalEggs = [];
  for (const i of Object.keys(Game.eggDrops)) {
    if (!Game.HasUnlocked(Game.eggDrops[i])) {
      missingNormalEggs.push(Game.eggDrops[i]);
      specDisp = true;
    }
  }
  const missingRareEggs = [];
  for (const i of Object.keys(Game.rareEggDrops)) {
    if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
      missingRareEggs.push(Game.rareEggDrops[i]);
      specDisp = true;
    }
  }
  const missingPlantDrops = [];
  for (const i of Object.keys(GameData.PlantDrops)) {
    if (!Game.HasUnlocked(GameData.PlantDrops[i])) {
      missingPlantDrops.push(GameData.PlantDrops[i]);
      specDisp = true;
    }
  }
  const choEgg =
    Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg');
  const centEgg = Game.Has('Century egg');

  if (Game.season === 'christmas' || specDisp || choEgg || centEgg) {
    stats.appendChild(CreateElements.StatsHeader('Season Specials', 'Sea'));
    if (CMOptions.Header.Sea) {
      if (missingHalloweenCookies.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Halloween Cookies Left to Buy',
            CreateElements.StatsMissDisp(missingHalloweenCookies),
          ),
        );
      if (missingChristmasCookies.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Christmas Cookies Left to Buy',
            CreateElements.StatsMissDisp(missingChristmasCookies),
          ),
        );
      if (missingValentineCookies.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Valentine Cookies Left to Buy',
            CreateElements.StatsMissDisp(missingValentineCookies),
          ),
        );
      if (missingNormalEggs.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Normal Easter Eggs Left to Unlock',
            CreateElements.StatsMissDisp(missingNormalEggs),
          ),
        );
      if (missingRareEggs.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Rare Easter Eggs Left to Unlock',
            CreateElements.StatsMissDisp(missingRareEggs),
          ),
        );
      if (missingPlantDrops.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Rare Plant Drops Left to Unlock',
            CreateElements.StatsMissDisp(missingPlantDrops),
          ),
        );

      if (Game.season === 'christmas')
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Reindeer Reward',
            document.createTextNode(Beautify(CacheSeaSpec)),
          ),
        );
      if (choEgg) {
        stats.appendChild(
          CreateElements.StatsListing(
            'withTooltip',
            'Chocolate Egg Cookies',
            document.createTextNode(Beautify(CacheLastChoEgg)),
            'ChoEggTooltipPlaceholder',
          ),
        );
      }
      if (centEgg) {
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Century Egg Multiplier',
            document.createTextNode(
              `${Math.round((CacheCentEgg - 1) * 10000) / 100}%`,
            ),
          ),
        );
      }
    }
  }

  stats.appendChild(CreateElements.StatsHeader('Miscellaneous', 'Misc'));
  if (CMOptions.Header.Misc) {
    stats.appendChild(
      CreateElements.StatsListing(
        'basic',
        `Average Cookies Per Second (Past ${
          CookieTimes[CMOptions.AvgCPSHist] < 60
            ? `${CookieTimes[CMOptions.AvgCPSHist]} seconds`
            : CookieTimes[CMOptions.AvgCPSHist] / 60 +
              (CMOptions.AvgCPSHist === 3 ? ' minute' : ' minutes')
        })`,
        document.createTextNode(Beautify(GetCPS(), 3)),
      ),
    );
    stats.appendChild(
      CreateElements.StatsListing(
        'basic',
        `Average Cookie Clicks Per Second (Past ${
          ClickTimes[CMOptions.AvgClicksHist]
        }${CMOptions.AvgClicksHist === 0 ? ' second' : ' seconds'})`,
        document.createTextNode(Beautify(CacheAverageClicks, 1)),
      ),
    );
    if (Game.Has('Fortune cookies')) {
      const fortunes = [];
      for (const i of Object.keys(GameData.Fortunes)) {
        if (!Game.Has(GameData.Fortunes[i])) {
          fortunes.push(GameData.Fortunes[i]);
        }
      }
      if (fortunes.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Fortune Upgrades Left to Buy',
            CreateElements.StatsMissDisp(fortunes),
          ),
        );
    }
    if (CMOptions.ShowMissedGC) {
      stats.appendChild(
        CreateElements.StatsListing(
          'basic',
          'Missed Golden Cookies',
          document.createTextNode(Beautify(Game.missedGoldenClicks)),
        ),
      );
    }
    if (Game.prefs.autosave) {
      const timer = document.createElement('span');
      timer.id = 'CMStatsAutosaveTimer';
      timer.innerText = Game.sayTime(
        Game.fps * 60 - (Game.OnAscend ? 0 : Game.T % (Game.fps * 60)),
        4,
      );
      stats.appendChild(
        CreateElements.StatsListing('basic', 'Time till autosave', timer),
      );
    }
  }

  l('menu').insertBefore(stats, l('menu').childNodes[2]);

  if (CMOptions.MissingUpgrades) {
    AddMissingUpgrades();
  }
}
