import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { Game } from '../../GlobalsForTesting';

import { CMOptions } from '../../../src/Config/VariablesAndData';
import ToggleDetailedTime from '../../../src/Config/Toggles/ToggleDetailedTime';
import { BackupFunctions } from '../../../src/Main/VariablesAndData';

describe('ToggleDetailedTime', function () {
  global.Game = Game;

  beforeEach(function () {
    ToggleDetailedTime();
  });

  describe('DetailedTime = 0', function () {
    before(function () {
      CMOptions.DetailedTime = 0;
      BackupFunctions.sayTime = 'BackupFunctions.sayTime';
    });
    it('Set correct time function', function () {
      assert.equal(Game.sayTime, 'BackupFunctions.sayTime');
    });
  });
  describe('DetailedTime = 1', function () {
    before(function () {
      CMOptions.DetailedTime = 1;
    });
    it('Set correct time function', function () {
      assert.equal(Game.sayTime.name, 'CMSayTime');
    });
  });
});
