import { CMOptions } from '../../Config/VariablesAndData';
import Flash from '../../Disp/Notifications/Flash';
import Notification from '../../Disp/Notifications/Notification';
import PlaySound from '../../Disp/Notifications/Sound';
import { LastMagicBarFull } from '../VariablesAndData';

/**
 * This function checks if the magic meter is full
 * It is called by CM.Main.Loop
 */
export default function CheckMagicMeter() {
	if (Game.Objects['Wizard tower'].minigameLoaded && CMOptions.GrimoireBar === 1) {
		const minigame = Game.Objects['Wizard tower'].minigame;
		if (minigame.magic < minigame.magicM) LastMagicBarFull = false;
		else if (!LastMagicBarFull) {
			LastMagicBarFull = true;
			Flash(3, 'MagicFlash');
			PlaySound(CMOptions.MagicSoundURL, 'MagicSound', 'MagicVolume');
			Notification('MagicNotification', 'Magic Meter full', 'Your Magic Meter is full. Cast a spell!');
		}
	}
}
