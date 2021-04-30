import { FavouriteSettings } from '../../Disp/VariablesAndData';

/**
 * This function toggles whether a setting is part of the favourites section in setting or not
 * @param {string} config	The name of the toggleable config option
 */
export default function ToggleFavouriteSetting(config) {
  if (FavouriteSettings.includes(config))
    FavouriteSettings = FavouriteSettings.filter((ele) => ele !== config);
  else FavouriteSettings.push(config);
}
