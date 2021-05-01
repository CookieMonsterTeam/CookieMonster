import { CMOptions } from '../../Config/VariablesAndData';

/**
 * This function returns time as a string depending on TimeFormat setting
 * @param  	{number} 	time		Time to be formatted
 * @param  	{number}	longFormat 	1 or 0
 * @returns	{string}				Formatted time
 */
export default function FormatTime(time, longFormat) {
  let formattedTime = time;
  if (time === Infinity) return time;
  if (time < 0) return 'Negative time period';
  formattedTime = Math.ceil(time);
  const y = Math.floor(formattedTime / 31536000);
  const d = Math.floor((formattedTime % 31536000) / 86400);
  const h = Math.floor(((formattedTime % 31536000) % 86400) / 3600);
  const m = Math.floor((((formattedTime % 31536000) % 86400) % 3600) / 60);
  const s = Math.floor((((formattedTime % 31536000) % 86400) % 3600) % 60);
  let str = '';
  if (CMOptions.TimeFormat) {
    if (formattedTime > 3155760000) return 'XX:XX:XX:XX:XX';
    str += `${(y < 10 ? '0' : '') + y}:`;
    str += `${(d < 10 ? '0' : '') + d}:`;
    str += `${(h < 10 ? '0' : '') + h}:`;
    str += `${(m < 10 ? '0' : '') + m}:`;
    str += (s < 10 ? '0' : '') + s;
  } else {
    if (formattedTime > 777600000) return longFormat ? 'Over 9000 days!' : '>9000d';
    str +=
      y > 0
        ? `${y + (longFormat ? (y === 1 ? ' year' : ' years') : 'y')}, ` // eslint-disable-line no-nested-ternary
        : '';
    if (str.length > 0 || d > 0)
      str += `${d + (longFormat ? (d === 1 ? ' day' : ' days') : 'd')}, `; // eslint-disable-line no-nested-ternary
    if (str.length > 0 || h > 0)
      str += `${h + (longFormat ? (h === 1 ? ' hour' : ' hours') : 'h')}, `; // eslint-disable-line no-nested-ternary
    if (str.length > 0 || m > 0)
      str += `${m + (longFormat ? (m === 1 ? ' minute' : ' minutes') : 'm')}, `; // eslint-disable-line no-nested-ternary
    str += s + (longFormat ? (s === 1 ? ' second' : ' seconds') : 's'); // eslint-disable-line no-nested-ternary
  }
  return str;
}
