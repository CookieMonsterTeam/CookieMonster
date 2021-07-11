import { before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import { Game } from '../../GlobalsForTesting';

import ToggleDetailedTime from '../../../src/Config/Toggles/ToggleDetailedTime';
import { BackupFunctions } from '../../../src/Main/VariablesAndData';

describe('ToggleDetailedTime', () => {
  global.Game = Game;

  beforeEach(() => {
    ToggleDetailedTime();
  });

  describe('DetailedTime = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.DetailedTime = 0;
      BackupFunctions.sayTime = 'BackupFunctions.sayTime';
    });
    it('Set correct time function', () => {
      assert.equal(Game.sayTime, 'BackupFunctions.sayTime');
    });
  });
  describe('DetailedTime = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.DetailedTime = 1;
    });
    it('Set correct time function', () => {
      assert.equal(Game.sayTime.name, 'CMSayTime');
    });
  });
});
