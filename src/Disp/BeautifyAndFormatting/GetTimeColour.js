import { CMOptions } from '../../Config/VariablesAndData';
import { ColourGreen, ColourOrange, ColourRed, ColourYellow } from '../VariablesAndData';
import FormatTime from './FormatTime';

/**
 * This function returns the color to be used for time-strings
 * @param	{number}			time			Time to be coloured
 * @returns {{string, string}}	{text, color}	Both the formatted time and color as strings in an array
 */
export default function GetTimeColour(time) {
  let color;
  let text;
  if (time <= 0) {
    if (CMOptions.TimeFormat) text = '00:00:00:00:00';
    else text = 'Done!';
    color = ColourGreen;
  } else {
    text = FormatTime(time);
    if (time > 300) color = ColourRed;
    else if (time > 60) color = ColourOrange;
    else color = ColourYellow;
  }
  return { text, color };
}
