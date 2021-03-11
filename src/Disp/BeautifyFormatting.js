/** General functions to format or beautify strings */

/**
 * This function returns formats number based on the Scale setting
 * @param	{number}	num		Number to be beautified
 * @param 	{any}		floats 	Used in some scenario's by CM.Backup.Beautify (Game's original function)
 * @param	{number}	forced	Used to force (type 3) in certains cases
 * @returns	{string}			Formatted number
 */
export function Beautify(num, floats, forced) {
	const decimals = CM.Options.ScaleDecimals + 1;
	if (num === Infinity) {
		return 'Infinity';
	} else if (typeof num === 'undefined') {
		return '0';
	} else if (CM.Options.Scale === 0) {
		return CM.Backup.Beautify(num, floats);
	} else if (Number.isFinite(num)) {
		let answer = '';
		if (num === 0) {
			return num.toString();
		} else if (num > 0.001 && num < CM.Options.ScaleCutoff) {
			answer = num.toFixed(2);
			if (CM.Options.ScaleSeparator) answer = answer.toLocaleString('nl');
			for (let i = 0; i < 3; i++) {
				if (answer[answer.length - 1] === '0' || answer[answer.length - 1] === '.') answer = answer.slice(0, -1);
			}
			return answer;
		} else if (CM.Options.Scale === 4 && !forced || forced === 4) { // Scientific notation, 123456789 => 1.235E+8
			answer = num.toExponential(decimals).toString().replace('e', 'E');
		} else {
			const exponential = num.toExponential().toString();
			const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
			answer = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(decimals);
			// answer is now "xxx.xx" (e.g., 123456789 would be 123.46)
			if (CM.Options.Scale === 1 && !forced || forced === 1) { // Metric scale, 123456789 => 123.457 M
				if (num >= 0.01 && num < Number(`1e${CM.Data.metric.length * 3}`)) {
					answer += ` ${CM.Data.metric[AmountOfTenPowerThree]}`;
				} else answer = CM.Disp.Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
			} else if (CM.Options.Scale === 2 && !forced || forced === 2) { // Short scale, 123456789 => 123.457 M
				if (num >= 0.01 && num < Number(`1e${CM.Data.shortScale.length * 3}`)) {
					answer += ` ${CM.Data.shortScale[AmountOfTenPowerThree]}`;
				} else answer = CM.Disp.Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
			} else if (CM.Options.Scale === 3 && !forced || forced === 3) { // Short scale, 123456789 => 123.457 M
				if (num >= 0.01 && num < Number(`1e${CM.Data.shortScaleAbbreviated.length * 3}`)) {
					answer += ` ${CM.Data.shortScaleAbbreviated[AmountOfTenPowerThree]}`;
				} else answer = CM.Disp.Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
			} else if (CM.Options.Scale === 5 && !forced || forced === 5) { // Engineering notation, 123456789 => 123.457E+6
				answer += `E${AmountOfTenPowerThree * 3}`;
			}
		}
		if (answer === '') {
			console.log(`Could not beautify number with CM.Disp.Beautify: ${num}`);
			answer = CM.Backup.Beautify(num, floats);
		}
		if (CM.Options.ScaleSeparator) answer = answer.replace('.', ',');
		return answer;
	} else {
		console.log(`Could not beautify number with CM.Disp.Beautify: ${num}`);
		return CM.Backup.Beautify(num, floats);
	}
}

/**
 * This function returns time as a string depending on TimeFormat setting
 * @param  	{number} 	time		Time to be formatted
 * @param  	{number}	longFormat 	1 or 0
 * @returns	{string}				Formatted time
 */
export function FormatTime(time, longFormat) {
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

/**
 * This function returns the color to be used for time-strings
 * @param	{number}			time			Time to be coloured
 * @returns {{string, string}}	{text, color}	Both the formatted time and color as strings in an array
 */
export function GetTimeColor(time) {
	let color;
	let text;
	if (time < 0) {
		if (CM.Options.TimeFormat) text = '00:00:00:00:00';
		else text = 'Done!';
		color = CM.Disp.colorGreen;
	} else {
		text = CM.Disp.FormatTime(time);
		if (time > 300) color = CM.Disp.colorRed;
		else if (time > 60) color = CM.Disp.colorOrange;
		else color = CM.Disp.colorYellow;
	}
	return { text, color };
}
