import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import ToggleWrinklerButtons from '../../../src/Config/Toggles/ToggleWrinklerButtons';

describe('ToggleWrinklerButtons', () => {
  global.l = l;
  global.Game = Game;

  beforeEach(() => {
    global.domids = {};
    ToggleWrinklerButtons();
  });

  describe('WrinklerButtons = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerButtons = 0;
    });
    describe('Game.elderWrath = 0', () => {
      before(() => {
        Game.elderWrath = 0;
      });
      it('Toggle style correctly', () => {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
      });
    });
    describe('Game.elderWrath = 1', () => {
      before(() => {
        Game.elderWrath = 1;
      });
      it('Toggle style correctly', () => {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
      });
    });
  });
  describe('WrinklerButtons = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerButtons = 1;
    });
    describe('Game.elderWrath = 0', () => {
      before(() => {
        Game.elderWrath = 0;
      });
      it('Toggle style correctly', () => {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, 'none'); // eslint-disable-line no-undef
      });
    });
    describe('Game.elderWrath = 1', () => {
      before(() => {
        Game.elderWrath = 1;
      });
      it('Toggle style correctly', () => {
        assert.equal(domids.PopAllNormalWrinklerButton.style.display, ''); // eslint-disable-line no-undef
        assert.equal(domids.PopFattestWrinklerButton.style.display, ''); // eslint-disable-line no-undef
      });
    });
  });
});
