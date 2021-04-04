import { CacheAverageCookiesFromClicks } from '../Cache/VariablesAndData';

export default function CMClickHook() {
  // Add cookies from click to array that stores average
  CacheAverageCookiesFromClicks.addLatest(Game.computedMouseCps);
}
