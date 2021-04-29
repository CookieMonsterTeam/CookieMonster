import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleSectionHideButtons from '../../../src/Config/Toggles/ToggleSectionHideButtons';

describe('ToggleSectionHideButtons', function () {
  global.l = l;

  beforeEach(function () {
    global.domids = {};
    ToggleSectionHideButtons();
  });

  describe('HideSectionsButtons = 0', function () {
    before(function () {
      CMOptions.HideSectionsButtons = 0;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMSectionHidButtons.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('HideSectionsButtons = 1', function () {
    before(function () {
      CMOptions.HideSectionsButtons = 1;
    });
    it('Toggle style correctly', function () {
      assert.equal(domids.CMSectionHidButtons.style.display, ''); // eslint-disable-line no-undef
    });
  });
});
