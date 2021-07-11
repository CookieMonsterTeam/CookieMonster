import { before, describe, it } from 'mocha';
import { assert } from 'chai';

import FormatTime from '../../src/Disp/BeautifyAndFormatting/FormatTime';

describe('FormatTime', () => {
  it('Format when time is Infinity', () => {
    assert.equal(FormatTime(Infinity, 0), Infinity);
  });
  it('Format when time is negative', () => {
    assert.equal(FormatTime(-1, 0), 'Negative time period');
  });
  describe('TimeFormat = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimeFormat = 0;
    });
    describe('Longformat = 0', () => {
      it('Format when time is 0', () => {
        assert.equal(FormatTime(0, 0), '0s');
      });
      it('Format when time is 1 second', () => {
        assert.equal(FormatTime(1, 0), '1s');
      });
      it('Format when time is over 1 minute', () => {
        assert.equal(FormatTime(61, 0), '1m, 1s');
      });
      it('Format when time is over 1 hour', () => {
        assert.equal(FormatTime(3601, 0), '1h, 0m, 1s');
      });
      it('Format when time is over 1 day', () => {
        assert.equal(FormatTime(86401, 0), '1d, 0h, 0m, 1s');
      });
      it('Format when time is over 1 year', () => {
        assert.equal(FormatTime(31536001, 0), '1y, 0d, 0h, 0m, 1s');
      });
      it('Format when time is over >9000 days', () => {
        assert.equal(FormatTime(777600001, 0), '>9000d');
      });
      it('Format when time is over >99.9 years', () => {
        assert.equal(FormatTime(3155760001, 0), '>9000d');
      });
    });
    describe('Longformat = 1', () => {
      it('Format when time is 0', () => {
        assert.equal(FormatTime(0, 1), '0 seconds');
      });
      it('Format when time is 1 second', () => {
        assert.equal(FormatTime(1, 1), '1 second');
      });
      it('Format when time is over 1 minute', () => {
        assert.equal(FormatTime(61, 1), '1 minute, 1 second');
      });
      it('Format when time is over 1 hour', () => {
        assert.equal(FormatTime(3601, 1), '1 hour, 0 minutes, 1 second');
      });
      it('Format when time is over 1 day', () => {
        assert.equal(FormatTime(86401, 1), '1 day, 0 hours, 0 minutes, 1 second');
      });
      it('Format when time is over 1 year', () => {
        assert.equal(FormatTime(31536001, 1), '1 year, 0 days, 0 hours, 0 minutes, 1 second');
      });
      it('Format when time is over >9000 days', () => {
        assert.equal(FormatTime(777600001, 1), 'Over 9000 days!');
      });
      it('Format when time is over >99.9 years', () => {
        assert.equal(FormatTime(3155760001, 1), 'Over 9000 days!');
      });
    });
  });
  describe('TimeFormat = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimeFormat = 1;
    });
    it('Format when time is 0', () => {
      assert.equal(FormatTime(0, 0), '00:00:00:00:00');
    });
    it('Format when time is 1 second', () => {
      assert.equal(FormatTime(1, 0), '00:00:00:00:01');
    });
    it('Format when time is over 1 minute', () => {
      assert.equal(FormatTime(61, 0), '00:00:00:01:01');
    });
    it('Format when time is over 1 hour', () => {
      assert.equal(FormatTime(3601, 0), '00:00:01:00:01');
    });
    it('Format when time is over 1 day', () => {
      assert.equal(FormatTime(86401, 0), '00:01:00:00:01');
    });
    it('Format when time is over 1 year', () => {
      assert.equal(FormatTime(31536001, 0), '01:00:00:00:01');
    });
    it('Format when time is over >9000 days', () => {
      assert.equal(FormatTime(777600001, 0), '24:240:00:00:01');
    });
    it('Format when time is over >99.9 years', () => {
      assert.equal(FormatTime(3155760001, 0), 'XX:XX:XX:XX:XX');
    });
  });
});
