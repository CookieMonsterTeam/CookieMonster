import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleGCTimer from '../../../src/Config/Toggles/ToggleGCTimer';
import { GCTimers } from '../../../src/Disp/VariablesAndData';
import { CacheGoldenShimmersByID } from '../../../src/Cache/VariablesAndData';

describe('ToggleGCTimer', () => {
  global.l = l;

  beforeEach(() => {
    global.domids = {};
    GCTimers[0] = { style: {} };
    GCTimers[1] = { style: {} };
    CacheGoldenShimmersByID[0] = {
      l: { style: { left: 'Test00', top: 'Test01' } },
    };
    CacheGoldenShimmersByID[1] = {
      l: { style: { left: 'Test10', top: 'Test11' } },
    };
    ToggleGCTimer();
  });

  describe('GCTimer = 0', () => {
    before(() => {
      CMOptions.GCTimer = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(GCTimers[0].style.display, 'none');
      assert.equal(GCTimers[1].style.display, 'none');
    });
  });
  describe('GCTimer = 1', () => {
    before(() => {
      CMOptions.GCTimer = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(GCTimers[0].style.display, 'block');
      assert.equal(GCTimers[0].style.left, 'Test00');
      assert.equal(GCTimers[0].style.top, 'Test01');
      assert.equal(GCTimers[1].style.display, 'block');
    });
  });
});
