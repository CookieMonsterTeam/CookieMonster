import { CacheWrinklersFattest } from '../../Cache/VariablesAndData';
import PopAllNormalWrinklers from '../HelperFunctions/PopWrinklers';
import { CreateTooltip } from '../Tooltips/Tooltip';

/**
 * This function creates two objects at the bottom of the left column that allowing popping of wrinklers
 */
export default function CreateWrinklerButtons() {
  const popAllA = document.createElement('a');
  popAllA.id = 'PopAllNormalWrinklerButton';
  popAllA.textContent = 'Pop All Normal';
  popAllA.className = 'option';
  popAllA.onclick = function () {
    PopAllNormalWrinklers();
  };
  popAllA.onmouseout = function () {
    Game.tooltip.shouldHide = 1;
  };
  popAllA.onmouseover = function () {
    Game.tooltip.dynamic = 1;
    Game.tooltip.draw(this, () => CreateTooltip('wb', 'PopAll'), 'this');
    Game.tooltip.wobble();
  };
  l('sectionLeftExtra').children[0].append(popAllA);
  const popFattestA = document.createElement('a');
  popFattestA.id = 'PopFattestWrinklerButton';
  popFattestA.textContent = 'Pop Single Fattest';
  popFattestA.className = 'option';
  popFattestA.onclick = function () {
    if (CacheWrinklersFattest[1] !== null) Game.wrinklers[CacheWrinklersFattest[1]].hp = 0;
  };
  popFattestA.onmouseout = function () {
    Game.tooltip.shouldHide = 1;
  };
  popFattestA.onmouseover = function () {
    Game.tooltip.dynamic = 1;
    Game.tooltip.draw(this, () => CreateTooltip('wb', 'PopFattest'), 'this');
    Game.tooltip.wobble();
  };
  l('sectionLeftExtra').children[0].append(popFattestA);
}
