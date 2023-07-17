import { describe, it } from 'mocha';
import { expect } from 'chai';

import CalculateLuckyLevels, { CalculateSevenDelta, CountSevens } from '../../src/Disp/HelperFunctions/CalculateLuckyLevels';

describe('CountSevens', () => {
  const examples = [
    { input: 1234567890, output: 1 },
    { input: 7777777777, output: 10 },
    { input: 1111111111, output: 0 },
    { input: 7897897897, output: 4 }
  ];

  examples.forEach((example) => {
    it(`Counts sevens in ${example.input}`, () => {
      expect(CountSevens(example.input)).to.equal(example.output);
    })
  });
});

describe('CalculateSevenDelta', () => {
  const examples = [
    { number: 123, digit: 1, output: 4 },
    { number: 123, digit: 10, output: 50 },
    { number: 123, digit: 100, output: 600 },
    { number: 123, digit: 1000, output: 7000 },
    { number: 7777, digit: 1, output: 0 },
    { number: 7777, digit: 10, output: 0 },
    { number: 7777, digit: 100, output: 0 },
    { number: 7777, digit: 1000, output: 0 },
    { number: 9999, digit: 1, output: 8 },
    { number: 9999, digit: 10, output: 80 },
    { number: 9999, digit: 100, output: 800 },
    { number: 9999, digit: 1000, output: 8000 },
  ];

  examples.forEach((example) => {
    it(`Calculates delta from ${example.number} to the next 7 in the ${example.digit}s digit`, () => {
      expect(CalculateSevenDelta(example.number, example.digit)).to.equal(example.output);
    });
  })
});

describe('CalculateLuckyLevels', () => {
  const examples = [
    { input: 0, luckyDigit: 7, luckyNumber: 77, luckyPayout: 7777 },
    { input: 123, luckyDigit: 127, luckyNumber: 177, luckyPayout: 7777 },
    { input: 77777, luckyDigit: 77777, luckyNumber: 77777, luckyPayout: 77777 },
    { input: 799999, luckyDigit: 799999, luckyNumber: 800077, luckyPayout: 807777 },
    { input: 999999, luckyDigit: 1000007, luckyNumber: 1000077, luckyPayout: 1007777 },
  ];

  examples.forEach((example) => {
    it(`Calculates the next lucky levels for the starting level ${example.input}`, () => {
      expect(CalculateLuckyLevels(example.input)).to.deep.equal({
        luckyDigit: example.luckyDigit,
        luckyNumber: example.luckyNumber,
        luckyPayout: example.luckyPayout
      })
    });
  })
});
