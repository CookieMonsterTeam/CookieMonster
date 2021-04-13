import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import ToggleBotBar from '../../../src/Config/Toggles/ToggleBotBar';
import { CMOptions } from '../../../src/Config/VariablesAndData';

describe('ToggleBotBar', function () {
  global.l = l;
  global.Game = Game;

  beforeEach(function () {
    global.domids = {};
    ToggleBotBar();
  });

  describe('BotBar = 0', function () {
    before(function () {
      CMOptions.BotBar = 0;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMBotBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('BotBar = 1', function () {
    before(function () {
      CMOptions.BotBar = 1;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMBotBar.style.display, ''); // eslint-disable-line no-undef
    });
  });
});
