/** Main function to create the sections of Cookie Monster on the Statistics page */

import { AddMissingUpgrades } from './CreateMissingUpgrades';
import * as CreateSections from './CreateStatsSections';
import * as CreateElements from './CreateDOMElements';
import * as GameData from '../../../Data/Gamedata.ts';

import {
  CacheAverageClicks,
  CacheAverageCookiesFromClicks,
  CacheObjectsNextAchievement,
  CacheWrinklersFattest,
  CacheWrinklersNormal,
  CacheWrinklersTotal,
} from '../../../Cache/VariablesAndData';
import PopAllNormalWrinklers from '../../HelperFunctions/PopWrinklers';
import { ClickTimes, CookieTimes } from '../../VariablesAndData';
import GetCPS from '../../HelperFunctions/GetCPS';
import Beautify from '../../BeautifyAndFormatting/Beautify';
import AddMissingAchievements from './CreateMissingAchievements';

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
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Lucky) {
    stats.appendChild(CreateSections.LuckySection());
  }

  stats.appendChild(CreateElements.StatsHeader('Chain Cookies', 'Chain'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Chain) {
    stats.appendChild(CreateSections.ChainSection());
  }

  if (Game.Objects['Wizard tower'].minigameLoaded) {
    stats.appendChild(CreateElements.StatsHeader('Spells', 'Spells'));
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Spells) {
      stats.appendChild(CreateSections.SpellsSection());
    }
  }

  if (Game.Objects.Farm.minigameLoaded) {
    stats.appendChild(CreateElements.StatsHeader('Garden', 'Garden'));
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Garden) {
      stats.appendChild(CreateSections.GardenSection());
    }
  }

  stats.appendChild(CreateElements.StatsHeader('Prestige', 'Prestige'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Prestige) {
    stats.appendChild(CreateSections.PrestigeSection());
  }

  if (Game.cpsSucked > 0) {
    stats.appendChild(CreateElements.StatsHeader('Wrinklers', 'Wrink'));
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Wrink) {
      const popAllFrag = document.createDocumentFragment();
      popAllFrag.appendChild(
        document.createTextNode(
          `${Beautify(CacheWrinklersTotal)} / ${Beautify(CacheWrinklersNormal)} `,
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
        CreateElements.StatsListing('basic', 'Rewards of Popping (All/Normal)', popAllFrag),
      );
      const popFattestFrag = document.createDocumentFragment();
      popFattestFrag.appendChild(document.createTextNode(`${Beautify(CacheWrinklersFattest[0])} `));
      const popFattestA = document.createElement('a');
      popFattestA.textContent = 'Pop Single Fattest';
      popFattestA.className = 'option';
      popFattestA.onclick = function () {
        if (CacheWrinklersFattest[1] !== null) Game.wrinklers[CacheWrinklersFattest[1]].hp = 0;
      };
      popFattestFrag.appendChild(popFattestA);
      stats.appendChild(
        CreateElements.StatsListing(
          'basic',
          `Rewards of Popping Single Fattest Non-Shiny Wrinkler (id: ${
            CacheWrinklersFattest[1] !== null ? CacheWrinklersFattest[1] : 'None'
          })`,
          popFattestFrag,
        ),
      );
    }
  }

  stats.appendChild(CreateSections.SeasonSection());

  stats.appendChild(CreateElements.StatsHeader('Achievements', 'Achievs'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Achievs) {
    Object.keys(Game.Objects).forEach((i) => {
      const ObjectsTillNext = CacheObjectsNextAchievement[i];
      stats.appendChild(
        CreateElements.StatsListing(
          'basic',
          i,
          ObjectsTillNext.AmountNeeded < 101
            ? document.createTextNode(
                `Next achievement in ${ObjectsTillNext.AmountNeeded}, price: ${Beautify(
                  ObjectsTillNext.price,
                )}`,
              )
            : document.createTextNode('No new achievement for next 100 buildings'),
        ),
      );
    });
  }

  stats.appendChild(CreateElements.StatsHeader('Miscellaneous', 'Misc'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Misc) {
    stats.appendChild(
      CreateElements.StatsListing(
        'basic',
        `Average cookies per second (past ${
          CookieTimes[
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist
          ] < 60
            ? `${
                CookieTimes[
                  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist
                ]
              } seconds`
            : CookieTimes[
                Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist
              ] /
                60 +
              (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist === 3
                ? ' minute'
                : ' minutes')
        })`,
        document.createTextNode(Beautify(GetCPS(), 3)),
      ),
    );
    stats.appendChild(
      CreateElements.StatsListing(
        'basic',
        `Average cookie clicks per second (past ${
          ClickTimes[
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist
          ]
        }${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist === 0
            ? ' second'
            : ' seconds'
        })`,
        document.createTextNode(Beautify(CacheAverageClicks, 1)),
      ),
    );
    stats.appendChild(
      CreateElements.StatsListing(
        'basic',
        `Cookies from clicking (past ${
          ClickTimes[
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist
          ]
        }${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist === 0
            ? ' second'
            : ' seconds'
        })`,
        document.createTextNode(
          Beautify(
            CacheAverageCookiesFromClicks.calcSum(
              CacheAverageClicks *
                ClickTimes[
                  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist
                ],
            ),
          ),
        ),
      ),
    );
    if (Game.Has('Fortune cookies')) {
      const fortunes = [];
      Object.keys(GameData.Fortunes).forEach((i) => {
        if (!Game.Has(GameData.Fortunes[i])) {
          fortunes.push(GameData.Fortunes[i]);
        }
      });
      if (fortunes.length !== 0)
        stats.appendChild(
          CreateElements.StatsListing(
            'basic',
            'Fortune Upgrades Left to Buy',
            CreateElements.StatsMissDisp(fortunes),
          ),
        );
    }
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ShowMissedGC) {
      stats.appendChild(
        CreateElements.StatsListing(
          'basic',
          'Missed golden cookies',
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
      stats.appendChild(CreateElements.StatsListing('basic', 'Time till autosave', timer));
    }
  }

  l('menu').insertBefore(stats, l('menu').childNodes[2]);

  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MissingUpgrades) {
    AddMissingUpgrades();
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MissingAchievements) {
    AddMissingAchievements();
  }
}
