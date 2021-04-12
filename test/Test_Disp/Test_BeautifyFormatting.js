import { before, describe, it } from 'mocha';
import { assert } from 'chai';

import FormatTime from '../../src/Disp/BeautifyAndFormatting/FormatTime';
import { CMOptions } from '../../src/Config/VariablesAndData';

describe('FormatTime', function () {
  it('Format when time is Infinity', function () {
    assert.equal(FormatTime(Infinity, 0), Infinity);
  });
  it('Format when time is negative', function () {
    assert.equal(FormatTime(-1, 0), 'Negative time period');
  });
  describe('TimeFormat = 0', function () {
    before(function () {
      CMOptions.TimeFormat = 0;
    });
    describe('Longformat = 0', function () {
      it('Format when time is 0', function () {
        assert.equal(FormatTime(0, 0), '0s');
      });
      it('Format when time is 1 second', function () {
        assert.equal(FormatTime(1, 0), '1s');
      });
      it('Format when time is over 1 minute', function () {
        assert.equal(FormatTime(61, 0), '1m, 1s');
      });
      it('Format when time is over 1 hour', function () {
        assert.equal(FormatTime(3601, 0), '1h, 0m, 1s');
      });
      it('Format when time is over 1 day', function () {
        assert.equal(FormatTime(86401, 0), '1d, 0h, 0m, 1s');
      });
      it('Format when time is over 1 year', function () {
        assert.equal(FormatTime(31536001, 0), '1y, 0d, 0h, 0m, 1s');
      });
      it('Format when time is over >9000 days', function () {
        assert.equal(FormatTime(777600001, 0), '>9000d');
      });
      it('Format when time is over >99.9 years', function () {
        assert.equal(FormatTime(3155760001, 0), '>9000d');
      });
    });
    describe('Longformat = 1', function () {
      it('Format when time is 0', function () {
        assert.equal(FormatTime(0, 1), '0 seconds');
      });
      it('Format when time is 1 second', function () {
        assert.equal(FormatTime(1, 1), '1 second');
      });
      it('Format when time is over 1 minute', function () {
        assert.equal(FormatTime(61, 1), '1 minute, 1 second');
      });
      it('Format when time is over 1 hour', function () {
        assert.equal(FormatTime(3601, 1), '1 hour, 0 minutes, 1 second');
      });
      it('Format when time is over 1 day', function () {
        assert.equal(
          FormatTime(86401, 1),
          '1 day, 0 hours, 0 minutes, 1 second',
        );
      });
      it('Format when time is over 1 year', function () {
        assert.equal(
          FormatTime(31536001, 1),
          '1 year, 0 days, 0 hours, 0 minutes, 1 second',
        );
      });
      it('Format when time is over >9000 days', function () {
        assert.equal(FormatTime(777600001, 1), 'Over 9000 days!');
      });
      it('Format when time is over >99.9 years', function () {
        assert.equal(FormatTime(3155760001, 1), 'Over 9000 days!');
      });
    });
  });
  describe('TimeFormat = 1', function () {
    before(function () {
      CMOptions.TimeFormat = 1;
    });
    it('Format when time is 0', function () {
      assert.equal(FormatTime(0, 0), '00:00:00:00:00');
    });
    it('Format when time is 1 second', function () {
      assert.equal(FormatTime(1, 0), '00:00:00:00:01');
    });
    it('Format when time is over 1 minute', function () {
      assert.equal(FormatTime(61, 0), '00:00:00:01:01');
    });
    it('Format when time is over 1 hour', function () {
      assert.equal(FormatTime(3601, 0), '00:00:01:00:01');
    });
    it('Format when time is over 1 day', function () {
      assert.equal(FormatTime(86401, 0), '00:01:00:00:01');
    });
    it('Format when time is over 1 year', function () {
      assert.equal(FormatTime(31536001, 0), '01:00:00:00:01');
    });
    it('Format when time is over >9000 days', function () {
      assert.equal(FormatTime(777600001, 0), '24:240:00:00:01');
    });
    it('Format when time is over >99.9 years', function () {
      assert.equal(FormatTime(3155760001, 0), 'XX:XX:XX:XX:XX');
    });
  });
});
