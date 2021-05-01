/** General functions to format or beautify strings */

import { CMOptions } from '../../Config/VariablesAndData';
import { metric, shortScale, shortScaleAbbreviated } from '../../Data/Scales.ts';
import { BackupFunctions } from '../../Main/VariablesAndData';

/**
 * This function returns formats number based on the Scale setting
 * @param	{number}	num		Number to be beautified
 * @param 	{any}		floats 	Used in some scenario's by CM.Backup.Beautify (Game's original function)
 * @param	{number}	forced	Used to force (type 3) in certains cases
 * @returns	{string}			Formatted number
 */
export default function Beautify(num, floats, forced) {
  const decimals = CMOptions.ScaleDecimals + 1;
  if (num === Infinity) {
    return 'Infinity';
  }
  if (typeof num === 'undefined') {
    return '0';
  }
  if (CMOptions.Scale === 0) {
    return BackupFunctions.Beautify(num, floats);
  }
  if (Number.isFinite(num)) {
    if (num < 0) {
      return `-${Beautify(Math.abs(num))}`;
    }
    let answer = '';
    if (num === 0) {
      return num.toString();
    }
    if (num > 0.001 && num < CMOptions.ScaleCutoff) {
      if (CMOptions.ScaleSeparator) answer = num.toLocaleString('nl');
      else answer = num.toLocaleString('en');
      return answer;
    }
    if ((CMOptions.Scale === 4 && !forced) || forced === 4) {
      // Scientific notation, 123456789 => 1.235E+8
      answer = num.toExponential(decimals).toString().replace('e', 'E');
    } else {
      const exponential = num.toExponential().toString();
      const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
      answer = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(decimals);
      // answer is now "xxx.xx" (e.g., 123456789 would be 123.46)
      if ((CMOptions.Scale === 1 && !forced) || forced === 1) {
        // Metric scale, 123456789 => 123.457 M
        if (num >= 0.01 && num < Number(`1e${metric.length * 3}`)) {
          answer += ` ${metric[AmountOfTenPowerThree]}`;
        } else answer = Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
      } else if ((CMOptions.Scale === 2 && !forced) || forced === 2) {
        // Short scale, 123456789 => 123.457 M
        if (num >= 0.01 && num < Number(`1e${shortScale.length * 3}`)) {
          answer += ` ${shortScale[AmountOfTenPowerThree]}`;
        } else answer = Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
      } else if ((CMOptions.Scale === 3 && !forced) || forced === 3) {
        // Short scale, 123456789 => 123.457 M
        if (num >= 0.01 && num < Number(`1e${shortScaleAbbreviated.length * 3}`)) {
          answer += ` ${shortScaleAbbreviated[AmountOfTenPowerThree]}`;
        } else answer = Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
      } else if ((CMOptions.Scale === 5 && !forced) || forced === 5) {
        // Engineering notation, 123456789 => 123.457E+6
        answer += `E${AmountOfTenPowerThree * 3}`;
      }
    }
    if (answer === '') {
      // eslint-disable-next-line no-console
      console.log(`Could not beautify number with Cookie Monster Beautify: ${num}`);
      answer = BackupFunctions.Beautify(num, floats);
    }
    if (CMOptions.ScaleSeparator) answer = answer.replace('.', ',');
    return answer;
  }
  console.log(`Could not beautify number with Cookie Monster Beautify: ${num}`); // eslint-disable-line no-console
  return BackupFunctions.Beautify(num, floats);
}
