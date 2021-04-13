export function l(id) {
  if (global.domids[id] === undefined) global.domids[id] = { style: {} };
  return global.domids[id];
}

export const Game = {
  Background: { canvas: { parentNode: {} } },
  DrawBackground() {},
  LeftBackground: { canvas: { parentNode: {} } },
  RebuildUpgrades() {},
  UpgradesInStore: {},
};
