import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleToolWarnPos from '../../../src/Config/Toggles/ToggleToolWarnPos';

describe('ToggleToolWarnPos', () => {
  global.l = l;

  beforeEach(() => {
    global.domids = {};
    ToggleToolWarnPos();
  });

  describe('ToolWarnPos = 0', () => {
    before(() => {
      CMOptions.ToolWarnPos = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMDispTooltipWarningParent.style.top, 'auto'); // eslint-disable-line no-undef
      assert.equal(domids.CMDispTooltipWarningParent.style.margin, '4px -4px'); // eslint-disable-line no-undef
      assert.equal(domids.CMDispTooltipWarningParent.style.padding, '3px 4px'); // eslint-disable-line no-undef
    });
  });
  describe('ToolWarnPos = 1', () => {
    before(() => {
      CMOptions.ToolWarnPos = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMDispTooltipWarningParent.style.right, 'auto'); // eslint-disable-line no-undef
      assert.equal(domids.CMDispTooltipWarningParent.style.margin, '4px'); // eslint-disable-line no-undef
      assert.equal(domids.CMDispTooltipWarningParent.style.padding, '4px 3px'); // eslint-disable-line no-undef
    });
  });
});
