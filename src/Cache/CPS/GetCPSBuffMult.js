/**
 * This function returns the current CPS buff
 * @returns {number}	mult	The multiplier
 */
export default function GetCPSBuffMult() {
  let mult = 1;
  Object.keys(Game.buffs).forEach((i) => {
    if (typeof Game.buffs[i].multCpS !== 'undefined') mult *= Game.buffs[i].multCpS;
  });
  return mult;
}
