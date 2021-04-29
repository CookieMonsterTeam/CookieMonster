import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleWrinklerButtons from '../../../src/Config/Toggles/ToggleWrinklerButtons';

describe('ToggleWrinklerButtons', function () {
  global.l = l;
  global.Game = Game;

  beforeEach(function () {
    global.domids = {};
    ToggleWrinklerButtons();
  });

  describe('WrinklerButtons = 0', function () {
    before(function () {
      CMOptions.WrinklerButtons = 0;
    });
    describe('Game.elderWrath = 0', function () {
      before(function () {
        Game.elderWrath = 0;
      });
      it('Toggle style correctly', function () {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
      });
    });
    describe('Game.elderWrath = 1', function () {
      before(function () {
        Game.elderWrath = 1;
      });
      it('Toggle style correctly', function () {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
      });
    });
  });
  describe('WrinklerButtons = 1', function () {
    before(function () {
      CMOptions.WrinklerButtons = 1;
    });
    describe('Game.elderWrath = 0', function () {
      before(function () {
        Game.elderWrath = 0;
      });
      it('Toggle style correctly', function () {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
      });
    });
    describe('Game.elderWrath = 1', function () {
      before(function () {
        Game.elderWrath = 1;
      });
      it('Toggle style correctly', function () {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, ''); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, ''); // eslint-disable-line no-undef
      });
    });
  });
});
