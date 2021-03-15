import {
  CacheWrinklersFattest,
  CacheWrinklersTotal,
} from '../../../Cache/VariablesAndData';
import { TooltipName } from '../../VariablesAndData';
import * as Create from '../CreateTooltip';

/**
 * This function adds extra info to the wrinkler button tooltip
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function WrinklerButton() {
  l('tooltip').innerHTML = '';
  l('tooltip').appendChild(Create.TooltipCreateHeader('Reward:'));

  const WrinklerReward = document.createElement('div');
  WrinklerReward.id = 'CMWrinklerReward';
  if (TooltipName === 'PopAll') {
    WrinklerReward.textContent = CacheWrinklersTotal;
  } else if (TooltipName === 'PopFattest') {
    WrinklerReward.textContent = CacheWrinklersFattest[0];
  }

  l('tooltip').appendChild(WrinklerReward);
}
