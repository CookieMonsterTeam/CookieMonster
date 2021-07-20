import { notificationsFunctions as nF } from '@cookiemonsterteam/cookiemonsterframework/src/index';
import { LastTickerFortuneState } from '../VariablesAndData';

/**
 * This function checks if there is a fortune cookie on the ticker
 * It is called by CM.Main.Loop
 */
export default function CheckTickerFortune() {
  if (LastTickerFortuneState !== (Game.TickerEffect && Game.TickerEffect.type === 'fortune')) {
    LastTickerFortuneState = Game.TickerEffect && Game.TickerEffect.type === 'fortune';
    if (LastTickerFortuneState) {
      nF.createFlash('cookieMonsterMod', 3, 'FortuneFlash', false);
      nF.playCMSound(
        'cookieMonsterMod',
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FortuneSoundURL,
        'FortuneSound',
        'FortuneVolume',
        false,
      );
      nF.createNotification(
        'cookieMonsterMod',
        'FortuneNotification',
        'Fortune Cookie found',
        'A Fortune Cookie has appeared on the Ticker.',
      );
    }
  }
}
