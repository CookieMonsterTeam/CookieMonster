import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import ToggleBotBar from '../../../src/Config/Toggles/ToggleBotBar';

describe('ToggleBotBar', () => {
  global.l = l;
  global.Game = Game;

  beforeEach(() => {
    global.domids = {};
    ToggleBotBar();
  });

  describe('BotBar = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMBotBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('BotBar = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMBotBar.style.display, ''); // eslint-disable-line no-undef
    });
  });
});
