import { before, describe, it } from 'mocha';
import { expect } from 'chai';

import GetTimeColour from '../../src/Disp/BeautifyAndFormatting/GetTimeColour';

describe('GetTimeColour', () => {
  it('Format when time is less than 60', () => {
    expect(GetTimeColour(59).colour).to.deep.equal('Yellow');
  });
  it('Format when time is more than 60', () => {
    expect(GetTimeColour(61).colour).to.deep.equal('Orange');
  });
  it('Format when time is more than 300', () => {
    expect(GetTimeColour(301).colour).to.deep.equal('Red');
  });
  describe('TimeFormat = 0', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimeFormat = 0;
    });
    it('Format when time is 0', () => {
      expect(GetTimeColour(0)).to.deep.equal({ text: 'Done!', colour: 'Green' });
    });
    it('Format when time is negative', () => {
      expect(GetTimeColour(-1)).to.deep.equal({
        text: 'Done!',
        colour: 'Green',
      });
    });
  });
  describe('TimeFormat = 1', () => {
    before(() => {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimeFormat = 1;
    });
    it('Format when time is 0', () => {
      expect(GetTimeColour(0)).to.deep.equal({
        text: '00:00:00:00:00',
        colour: 'Green',
      });
    });
    it('Format when time is negative', () => {
      expect(GetTimeColour(-1)).to.deep.equal({
        text: '00:00:00:00:00',
        colour: 'Green',
      });
    });
  });
});
