import { before, describe, it } from 'mocha';
import { expect } from 'chai';

import GetTimeColour from '../../src/Disp/BeautifyAndFormatting/GetTimeColour';
import { CMOptions } from '../../src/Config/VariablesAndData';

describe('GetTimeColour', () => {
  it('Format when time is less than 60', () => {
    expect(GetTimeColour(59).color).to.deep.equal('Yellow');
  });
  it('Format when time is more than 60', () => {
    expect(GetTimeColour(61).color).to.deep.equal('Orange');
  });
  it('Format when time is more than 300', () => {
    expect(GetTimeColour(301).color).to.deep.equal('Red');
  });
  describe('TimeFormat = 0', () => {
    before(() => {
      CMOptions.TimeFormat = 0;
    });
    it('Format when time is 0', () => {
      expect(GetTimeColour(0)).to.deep.equal({ text: 'Done!', color: 'Green' });
    });
    it('Format when time is negative', () => {
      expect(GetTimeColour(-1)).to.deep.equal({
        text: 'Done!',
        color: 'Green',
      });
    });
  });
  describe('TimeFormat = 1', () => {
    before(() => {
      CMOptions.TimeFormat = 1;
    });
    it('Format when time is 0', () => {
      expect(GetTimeColour(0)).to.deep.equal({
        text: '00:00:00:00:00',
        color: 'Green',
      });
    });
    it('Format when time is negative', () => {
      expect(GetTimeColour(-1)).to.deep.equal({
        text: '00:00:00:00:00',
        color: 'Green',
      });
    });
  });
});
