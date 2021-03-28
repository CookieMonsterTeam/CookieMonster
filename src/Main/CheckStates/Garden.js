import { CMOptions } from '../../Config/VariablesAndData';
import Flash from '../../Disp/Notifications/Flash';
import PlaySound from '../../Disp/Notifications/Sound';
import { LastGardenNextStep } from '../VariablesAndData';

/**
 * This function checks if a garden tick has happened
 */
export default function CheckGardenTick() {
  if (
    Game.Objects.Farm.minigameLoaded &&
    LastGardenNextStep !== Game.Objects.Farm.minigame.nextStep
  ) {
    if (LastGardenNextStep !== 0 && LastGardenNextStep < Date.now()) {
      Flash(3, 'GardFlash', false);
      PlaySound(CMOptions.GardSoundURL, 'GardSound', 'GardVolume', false);
    }
    LastGardenNextStep = Game.Objects.Farm.minigame.nextStep;
  }
}
