import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l } from '../../GlobalsForTesting';

import ToggleUpgradeBarFixedPos from '../../../src/Config/Toggles/ToggleUpgradeBarFixedPos';

describe('ToggleUpgradeBarFixedPos', () => {
  global.l = l;

  beforeEach(() => {
    global.domids = {};
    ToggleUpgradeBarFixedPos();
  });

  describe('UpgradeBarFixedPos = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpgradeBarFixedPos = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.position, ''); // eslint-disable-line no-undef
    });
  });
  describe('UpgradeBarFixedPos = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpgradeBarFixedPos = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMUpgradeBar.style.position, 'sticky'); // eslint-disable-line no-undef
      assert.equal(domids.CMUpgradeBar.style.top, '0px'); // eslint-disable-line no-undef
    });
  });
});
