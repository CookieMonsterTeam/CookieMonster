import { GCTimers } from '../Disp/VariablesAndData';

/**
 * This is called when the user ascends
 * It is called by CM.Main.Loop
 */
export default function CMRestHook() {
  Object.keys(GCTimers).forEach((i) => {
    GCTimers[i].parentNode.removeChild(GCTimers[i]);
    delete GCTimers[i];
  });
}
