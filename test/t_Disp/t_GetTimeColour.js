import { before, describe, it } from 'mocha';
import { expect } from 'chai';

import GetTimeColour from '../../src/Disp/BeautifyAndFormatting/GetTimeColour';
import { CMOptions } from '../../src/Config/VariablesAndData';

describe('GetTimeColour', function () {
  it('Format when time is less than 60', function () {
    expect(GetTimeColour(59).color).to.deep.equal('Yellow');
  });
  it('Format when time is more than 60', function () {
    expect(GetTimeColour(61).color).to.deep.equal('Orange');
  });
  it('Format when time is more than 300', function () {
    expect(GetTimeColour(301).color).to.deep.equal('Red');
  });
  describe('TimeFormat = 0', function () {
    before(function () {
      CMOptions.TimeFormat = 0;
    });
    it('Format when time is 0', function () {
      expect(GetTimeColour(0)).to.deep.equal({ text: 'Done!', color: 'Green' });
    });
    it('Format when time is negative', function () {
      expect(GetTimeColour(-1)).to.deep.equal({
        text: 'Done!',
        color: 'Green',
      });
    });
  });
  describe('TimeFormat = 1', function () {
    before(function () {
      CMOptions.TimeFormat = 1;
    });
    it('Format when time is 0', function () {
      expect(GetTimeColour(0)).to.deep.equal({
        text: '00:00:00:00:00',
        color: 'Green',
      });
    });
    it('Format when time is negative', function () {
      expect(GetTimeColour(-1)).to.deep.equal({
        text: '00:00:00:00:00',
        color: 'Green',
      });
    });
  });
});
