import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l, Game } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleUpgradeBarAndColor from '../../../src/Config/Toggles/ToggleUpgradeBarAndColour';

describe('ToggleUpgradeBarAndColor', function () {
  global.l = l;
  global.Game = Game;

  beforeEach(function () {
    global.domids = {};
    ToggleUpgradeBarAndColor();
  });

  describe('UpBarColor = 0', function () {
    before(function () {
      CMOptions.UpBarColor = 0;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColor = 1', function () {
    before(function () {
      CMOptions.UpBarColor = 1;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMUpgradeBar.style.display, ''); // eslint-disable-line no-undef
    });
  });
  describe('UpBarColor = 2', function () {
    before(function () {
      CMOptions.UpBarColor = 2;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMUpgradeBar.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
});
