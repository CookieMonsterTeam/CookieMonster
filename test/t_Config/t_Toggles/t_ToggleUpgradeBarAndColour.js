import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import ToggleUpgradeBarAndColor from '../../../src/Config/Toggles/ToggleUpgradeBarAndColour';

describe('ToggleUpgradeBarAndColor', () => {
  global.l = l;
  global.Game = Game;

  beforeEach(() => {
    global.domids = {};
    ToggleUpgradeBarAndColor();
  });

  describe('UpBarColor = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColor = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColor = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColor = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, ''); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColor = 2', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColor = 2;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
});
