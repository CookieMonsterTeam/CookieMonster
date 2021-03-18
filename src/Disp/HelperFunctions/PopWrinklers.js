/**
 * This function pops all normal wrinklers
 * It is called by a click of the 'pop all' button created by CM.Disp.AddMenuStats()
 */
export default function PopAllNormalWrinklers() {
  Object.keys(Game.wrinklers).forEach((i) => {
    if (Game.wrinklers[i].sucked > 0 && Game.wrinklers[i].type === 0) {
      Game.wrinklers[i].hp = 0;
    }
  });
}
