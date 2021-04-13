import { beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';

import ToggleFavouriteSetting from '../../../src/Config/Toggles/ToggleFavourites';
import { FavouriteSettings } from '../../../src/Disp/VariablesAndData';

describe('ToggleFavouriteSetting', function () {
  beforeEach(function () {
    global.domids = {};
  });
  // TODO: Can't write test for checking existing config due to Babel/Typescript problem
  it('New config', function () {
    FavouriteSettings.push('TestConfig');
    ToggleFavouriteSetting('TestConfig2');
    assert.deepEqual(FavouriteSettings, ['TestConfig', 'TestConfig2']);
  });
});
