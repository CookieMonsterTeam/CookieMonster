import { CacheSpawnedGoldenShimmer } from '../../Cache/VariablesAndData';
import { CMOptions } from '../../Config/VariablesAndData';
import { LastGoldenCookieState } from '../../Main/VariablesAndData';

/**
 * This function creates the Favicon, it is called by CM.Main.DelayInit()
 */
export function CreateFavicon() {
  const Favicon = document.createElement('link');
  Favicon.id = 'CMFavicon';
  Favicon.rel = 'shortcut icon';
  Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
  document.getElementsByTagName('head')[0].appendChild(Favicon);
}

/**
 * This function updates the Favicon depending on whether a Golden Cookie has spawned
 * By relying on CM.Cache.spawnedGoldenShimmer it only changes for non-user spawned cookie
 */
export function UpdateFavicon() {
  if (CMOptions.Favicon === 1 && LastGoldenCookieState > 0) {
    if (CacheSpawnedGoldenShimmer.wrath)
      l('CMFavicon').href =
        'https://CookieMonsterTeam.github.io/CookieMonster/favicon/wrathCookie.ico';
    else
      l('CMFavicon').href =
        'https://CookieMonsterTeam.github.io/CookieMonster/favicon/goldenCookie.ico';
  } else l('CMFavicon').href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
}
