import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleUpgradeBarFixedPos from '../../../src/Config/Toggles/ToggleUpgradeBarFixedPos';

describe('ToggleUpgradeBarFixedPos', function () {
  global.l = l;

  beforeEach(function () {
    global.domids = {};
    ToggleUpgradeBarFixedPos();
  });

  describe('UpgradeBarFixedPos = 0', function () {
    before(function () {
      CMOptions.UpgradeBarFixedPos = 0;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMUpgradeBar.style.position, ''); // eslint-disable-line no-undef
    });
  });
  describe('UpgradeBarFixedPos = 1', function () {
    before(function () {
      CMOptions.UpgradeBarFixedPos = 1;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMUpgradeBar.style.position, 'sticky'); // eslint-disable-line no-undef
      assert.equal(domids.CMUpgradeBar.style.top, '0px'); // eslint-disable-line no-undef
    });
  });
});
