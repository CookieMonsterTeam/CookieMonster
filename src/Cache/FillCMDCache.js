/**
 * Insert the provided values into `window.CookieMonsterData.Cache`.
 *
 * The initial 'Cache' is dropped from the name, so e.g. `CacheWrinklersTotal`
 * becomes `window.CookieMonsterData.Cache.WrinklersTotal`.
 */
export default function FillCMDCache(caches) {
  if (!('Cache' in window.CookieMonsterData)) {
    window.CookieMonsterData.Cache = {};
  }

  Object.keys(caches).forEach((name) => {
    const exportName = name.replace(/^Cache/, '');

    if (typeof caches[name] === 'undefined') {
      window.CookieMonsterData.Cache[exportName] = undefined;
    } else {
      // Passing through JSON ensures that no references are retained.
      window.CookieMonsterData.Cache[exportName] = JSON.parse(JSON.stringify(caches[name]));
    }
  });
}
