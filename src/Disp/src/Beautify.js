/** General functions to format or beautify strings */

/**
 * This function returns time as a string depending on TimeFormat setting
 * @param  	{number} 	time		Time to be formatted
 * @param  	{number}	longFormat 	1 or 0
 * @returns	{string}				Formatted time
 */
export default function FormatTime(time, longFormat) {
	if (time === Infinity) return time;
	time = Math.ceil(time);
	const y = Math.floor(time / 31557600);
	const d = Math.floor(time % 31557600 / 86400);
	const h = Math.floor(time % 86400 / 3600);
	const m = Math.floor(time % 3600 / 60);
	const s = Math.floor(time % 60);
	let str = '';
	if (CM.Options.TimeFormat) {
		if (time > 3155760000) return 'XX:XX:XX:XX:XX';
		str += `${(y < 10 ? '0' : '') + y}:`;
		str += `${(d < 10 ? '0' : '') + d}:`;
		str += `${(h < 10 ? '0' : '') + h}:`;
		str += `${(m < 10 ? '0' : '') + m}:`;
		str += (s < 10 ? '0' : '') + s;
	} else {
		if (time > 777600000) return longFormat ? 'Over 9000 days!' : '>9000d';
		str += (y > 0 ? `${y + (longFormat ? (y === 1 ? ' year' : ' years') : 'y')}, ` : '');
		str += (d > 0 ? `${d + (longFormat ? (d === 1 ? ' day' : ' days') : 'd')}, ` : '');
		if (str.length > 0 || h > 0) str += `${h + (longFormat ? (h === 1 ? ' hour' : ' hours') : 'h')}, `;
		if (str.length > 0 || m > 0) str += `${m + (longFormat ? (m === 1 ? ' minute' : ' minutes') : 'm')}, `;
		str += s + (longFormat ? (s === 1 ? ' second' : ' seconds') : 's');
	}
	return str;
}
