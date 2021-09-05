import { ColourGreen, ColourOrange, ColourRed, ColourYellow } from '../VariablesAndData';
import FormatTime from './FormatTime';

/**
 * This function returns the colour to be used for time-strings
 * @param	{number}			time			Time to be coloured
 * @returns {{string, string}}	{text, colour}	Both the formatted time and colour as strings in an array
 */
export default function GetTimeColour(time) {
  let colour;
  let text;
  if (time <= 0) {
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimeFormat === 1)
      text = '00:00:00:00:00';
    else text = 'Done!';
    colour = ColourGreen;
  } else {
    text = FormatTime(time);
    if (time > 300) colour = ColourRed;
    else if (time > 60) colour = ColourOrange;
    else colour = ColourYellow;
  }
  return { text, colour };
}
