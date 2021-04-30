import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
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
      CMOptions.UpBarColor = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColor = 1', () => {
    before(() => {
      CMOptions.UpBarColor = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, ''); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColor = 2', () => {
    before(() => {
      CMOptions.UpBarColor = 2;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
});
