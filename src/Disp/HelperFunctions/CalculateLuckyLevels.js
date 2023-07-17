const SPECIAL_DIGIT = 7;

/**
 * Count the number of 7s in any number
 * @param	{number}	number	The number to count sevens for
 * @returns	{number}	The number of 7s in the provided number
 */
export function CountSevens(number) {
  let localNumber = number;
  let sevenCount = 0;

  while (localNumber >= SPECIAL_DIGIT) {
    if (localNumber % 10 === SPECIAL_DIGIT) sevenCount += 1;
    localNumber = Math.floor(localNumber / 10); 
  }

  return sevenCount;
}

/**
 * Calculate the delta for the next number where the given digit is a 7
 * @param	{number}	number			The starting number to calculate the delta for
 * @param	{number}	digitPlace	1 for ones place, 10 for tens place, 100 for hundreds place, etc
 * @returns	{number}	The calculated delta
 */
export function CalculateSevenDelta(number, digitPlace) {
  const target = SPECIAL_DIGIT * digitPlace;
  const modulus = digitPlace * 10;

  let delta = target - (number % modulus) + (number % digitPlace);
  if (delta < 0) delta += modulus;

  return delta;
}

/**
 * This function calculates each of the next "lucky" prestige levels
 * @param	{number}	currentLevel	The user's prestige level, including levels earned since the last ascension
 * @returns	{{number}, {number}, {number}}	luckyDigit, luckyNumber, luckyPayout	The next eligible level for each upgrade
 */
export default function CalculateLuckyLevels(currentLevel) {
  const result = {};
  let localLevel = currentLevel;
  let sevenCount = CountSevens(currentLevel);

  if (sevenCount < 1) {
    // find the next 7 for the ones digit
    const delta = CalculateSevenDelta(localLevel, 1);

    localLevel += delta;
    sevenCount = CountSevens(localLevel);
  }

  result.luckyDigit = localLevel;

  while (sevenCount < 2) {
    // find the next 7 in the ones or tens digit
    let delta = CalculateSevenDelta(localLevel, 1);
    if (delta === 0) delta = CalculateSevenDelta(localLevel, 10);

    localLevel += delta;
    sevenCount = CountSevens(localLevel);
  }

  result.luckyNumber = localLevel;

  let digitPlace = 1;
  while (sevenCount < 4) {
    // look for missing 7s in the ones, tens, hundreds, thousands digits
    const delta = CalculateSevenDelta(localLevel, digitPlace);
    if (delta === 0) {
      digitPlace *= 10;
    } else {
      localLevel += delta;
      sevenCount = CountSevens(localLevel);
    }
  }

  result.luckyPayout = localLevel;

  return result;
}
