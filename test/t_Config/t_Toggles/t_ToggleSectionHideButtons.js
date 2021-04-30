import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { l } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleSectionHideButtons from '../../../src/Config/Toggles/ToggleSectionHideButtons';

describe('ToggleSectionHideButtons', () => {
  global.l = l;

  beforeEach(() => {
    global.domids = {};
    ToggleSectionHideButtons();
  });

  describe('HideSectionsButtons = 0', () => {
    before(() => {
      CMOptions.HideSectionsButtons = 0;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMSectionHidButtons.style.display, 'none'); // eslint-disable-line no-undef
    });
  });
  describe('HideSectionsButtons = 1', () => {
    before(() => {
      CMOptions.HideSectionsButtons = 1;
    });
    it('Toggle style correctly', () => {
      assert.equal(domids.CMSectionHidButtons.style.display, ''); // eslint-disable-line no-undef
    });
  });
});
