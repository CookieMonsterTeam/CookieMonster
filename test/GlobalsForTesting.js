export function l(id) {
  if (global.domids[id] === undefined) global.domids[id] = { style: {} };
  return global.domids[id];
}

export const Game = {
  DrawBackground() {},
  Background: { canvas: { parentNode: {} } },
  LeftBackground: { canvas: { parentNode: {} } },
};
