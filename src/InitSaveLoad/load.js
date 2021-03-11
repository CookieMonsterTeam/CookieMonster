/**
 * This creates a load function to the CM object. Per Game code/comments:
 * "do stuff with the string data you saved previously"
 */
export default function load(str) {
	const save = JSON.parse(str);
	CM.Sim.InitData();
	CM.Config.LoadConfig(save.settings);
	if (save.version !== `${CM.VersionMajor}.${CM.VersionMinor}`) {
		if (Game.prefs.popups) Game.Popup('A new version of Cookie Monster has been loaded, check out the release notes in the info tab!');
		else Game.Notify('A new version of Cookie Monster has been loaded, check out the release notes in the info tab!', '', '', 0, 1);
	}
};