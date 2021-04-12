/* global describe, it */
const { assert } = require('../../node_modules/chai/chai');
const {
  FormatTime,
} = require('../../src/Disp/BeautifyAndFormatting/Beautify');

describe('FormatTime', function () {
  it('should return -1 when the value is not present', function () {
    assert.equal(FormatTime(1, 0), '1 s');
  });
});
