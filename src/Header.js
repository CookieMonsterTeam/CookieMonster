/**********
 * Header *
 **********/

/**
 * This functions creates the necessary objects and is run when they do not already exist
 */
const RunCookieMonsterHeader = function() {
    CM = {};
    CM.VersionMajor = '2.031';
    CM.VersionMinor = '3';

    CM.Backup = {};

    CM.Cache = {};

    CM.Config = {};

    CM.ConfigData = {};

    CM.Data = {};

    CM.Disp = {};

    CM.Footer = {};

    CM.Main = {};

    CM.Options = {};

    CM.Sim = {};
};

if (typeof CM == "undefined") {
    RunCookieMonsterHeader();
}

