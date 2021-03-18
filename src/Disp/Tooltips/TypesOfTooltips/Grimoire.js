import { CacheNoGoldSwitchCookiesPS } from '../../../Cache/VariablesAndData';
import { CMOptions } from '../../../Config/VariablesAndData';
import {
  Beautify,
  GetTimeColor,
} from '../../BeautifyAndFormatting/BeautifyFormatting';
import CalculateGrimoireRefillTime from '../../HelperFunctions/CalculateGrimoireRefillTime';
import GetWrinkConfigBank from '../../HelperFunctions/GetWrinkConfigBank';
import { ColorTextPre, TooltipName } from '../../VariablesAndData';
import * as Create from '../CreateTooltip';

/**
 * This function adds extra info to the Grimoire tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
export default function Grimoire() {
  const { minigame } = Game.Objects['Wizard tower'];
  const spellCost = minigame.getSpellCost(minigame.spellsById[TooltipName]);

  if (CMOptions.TooltipGrim === 1 && spellCost <= minigame.magicM) {
    const tooltipBox = l('CMTooltipBorder');

    // Time left till enough magic for spell
    tooltipBox.appendChild(Create.TooltipCreateHeader('Time Left'));
    const time = document.createElement('div');
    time.id = 'CMTooltipTime';
    tooltipBox.appendChild(time);
    const timeColor = GetTimeColor(
      CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost),
    );
    time.textContent = timeColor.text;
    time.className = ColorTextPre + timeColor.color;

    // Time left untill magic spent is recovered
    if (spellCost <= minigame.magic) {
      tooltipBox.appendChild(Create.TooltipCreateHeader('Recover Time'));
      const recover = document.createElement('div');
      recover.id = 'CMTooltipRecover';
      tooltipBox.appendChild(recover);
      const recoverColor = GetTimeColor(
        CalculateGrimoireRefillTime(
          Math.max(0, minigame.magic - spellCost),
          minigame.magicM,
          minigame.magic,
        ),
      );
      recover.textContent = recoverColor.text;
      recover.className = ColorTextPre + recoverColor.color;
    }

    // Extra information on cookies gained when spell is Conjure Baked Goods (Name === 0)
    if (TooltipName === '0') {
      tooltipBox.appendChild(
        Create.TooltipCreateHeader('Cookies to be gained/lost'),
      );
      const conjure = document.createElement('div');
      conjure.id = 'x';
      tooltipBox.appendChild(conjure);
      const reward = document.createElement('span');
      reward.style.color = '#33FF00';
      reward.textContent = Beautify(
        Math.min(
          (Game.cookies + GetWrinkConfigBank()) * 0.15,
          CacheNoGoldSwitchCookiesPS * 60 * 30,
        ),
        2,
      );
      conjure.appendChild(reward);
      const seperator = document.createElement('span');
      seperator.textContent = ' / ';
      conjure.appendChild(seperator);
      const loss = document.createElement('span');
      loss.style.color = 'red';
      loss.textContent = Beautify(CacheNoGoldSwitchCookiesPS * 60 * 15, 2);
      conjure.appendChild(loss);
    }

    l('CMTooltipArea').appendChild(tooltipBox);
  } else l('CMTooltipArea').style.display = 'none';
}
