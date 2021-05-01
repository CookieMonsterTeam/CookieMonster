/**
 * This function sets the size of the background of the full game and the left column
 * depending on whether certain abrs are activated
 * It is called by CM.Disp.UpdateAscendState() and CM.Disp.UpdateBotTimerBarPosition()
 */
export default function UpdateBackground() {
  Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
  Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
  Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
  Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
  Game.DrawBackground();
}
