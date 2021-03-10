import CheckNotificationPermissions from './src/CheckNotificationPermissions';
import { LoadConfig, RestoreDefault, SaveConfig } from './src/SaveLoadReloadSettings';
import { ToggleConfig, ToggleConfigVolume, ToggleHeader } from './src/ToggleSetting';

const Config = {
	CheckNotificationPermissions: CheckNotificationPermissions,

	LoadConfig: LoadConfig,
	SaveConfig: SaveConfig,
	RestoreDefault: RestoreDefault,

	ToggleConfig: ToggleConfig,
	ToggleConfigVolume: ToggleConfigVolume,
	ToggleHeader: ToggleHeader,

	/** Used to name certain DOM elements and refer to them */
	ConfigPrefix: 'CMConfig',
};

CM.Config = Config;

export default Config;
