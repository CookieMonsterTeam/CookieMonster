/**
 * This function constructs an object with the static properties of an achievement
 * @param	{string}	achievementName	Name of the Achievement
 * @returns {Object}	you				The static object
 */
export default function InitAchievement(achievementName) {
  const me = Game.Achievements[achievementName];
  const you = {};
  you.name = me.name;
  return you;
}
