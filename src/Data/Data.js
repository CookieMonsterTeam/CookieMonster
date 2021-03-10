import Config from './src/Config';
import ConfigDefault from './src/ConfigDefault';
import {
	Fortunes, HalloCookies, ChristCookies, ValCookies, PlantDrops, Effects,
} from './src/Gamedata';
import { ModDescription, LatestReleaseNotes } from './src/Moddata';
import { metric, shortScale, shortScaleAbbreviated } from './src/Scales';
import { ConfigGroups, ConfigGroupsNotification } from './src/Sectionheader';

const Data = {
	Config: Config,

	ConfigDefault: ConfigDefault,

	Fortunes: Fortunes,
	HalloCookies: HalloCookies,
	ChristCookies: ChristCookies,
	ValCookies: ValCookies,
	PlantDrops: PlantDrops,
	Effects: Effects,

	ModDescription: ModDescription,
	LatestReleaseNotes: LatestReleaseNotes,

	metric: metric,
	shortScale: shortScale,
	shortScaleAbbreviated: shortScaleAbbreviated,

	ConfigGroups: ConfigGroups,
	ConfigGroupsNotification: ConfigGroupsNotification,
};

CM.Data = Data;

export default Data;
