import { CacheGoldenShimmersByID } from '../../Cache/VariablesAndData';
import { GCTimers } from '../../Disp/VariablesAndData';
import { CMOptions } from '../VariablesAndData';

/**
 * This function toggles GC Timers are visible
 * It is called by a change in CM.Options.GCTimer
 */
export default function ToggleGCTimer() {
	if (CMOptions.GCTimer === 1) {
		for (const i of Object.keys(GCTimers)) {
			GCTimers[i].style.display = 'block';
			GCTimers[i].style.left = CacheGoldenShimmersByID[i].l.style.left;
			GCTimers[i].style.top = CacheGoldenShimmersByID[i].l.style.top;
		}
	} else {
		for (const i of Object.keys(GCTimers)) GCTimers[i].style.display = 'none';
	}
}
