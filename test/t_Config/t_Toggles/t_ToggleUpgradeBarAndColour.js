import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import ToggleUpgradeBarAndColour from '../../../src/Config/Toggles/ToggleUpgradeBarAndColour';

describe('ToggleUpgradeBarAndColour', () => {
  global.l = l;
  global.Game = Game;

  beforeEach(() => {
    global.domids = {};
    ToggleUpgradeBarAndColour();
  });

  describe('UpBarColour = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColour = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColour = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColour = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, ''); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColour = 2', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColour = 2;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
});
