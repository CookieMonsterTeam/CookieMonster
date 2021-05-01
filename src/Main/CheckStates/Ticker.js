import { CMOptions } from '../../Config/VariablesAndData';
import Flash from '../../Disp/Notifications/Flash';
import CreateNotification from '../../Disp/Notifications/Notification';
import PlaySound from '../../Disp/Notifications/Sound';
import { LastTickerFortuneState } from '../VariablesAndData';

/**
 * This function checks if there is a fortune cookie on the ticker
 * It is called by CM.Main.Loop
 */
export default function CheckTickerFortune() {
  if (LastTickerFortuneState !== (Game.TickerEffect && Game.TickerEffect.type === 'fortune')) {
    LastTickerFortuneState = Game.TickerEffect && Game.TickerEffect.type === 'fortune';
    if (LastTickerFortuneState) {
      Flash(3, 'FortuneFlash', false);
      PlaySound(CMOptions.FortuneSoundURL, 'FortuneSound', 'FortuneVolume', false);
      CreateNotification(
        'FortuneNotification',
        'Fortune Cookie found',
        'A Fortune Cookie has appeared on the Ticker.',
      );
    }
  }
}
