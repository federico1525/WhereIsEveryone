var Alloy = require("alloy");

/**
 * Main app singleton
 * @type {Object}
 */
var APP = {
    NaviBridge: require("ti.navibridge/ti.navibridge"),
    /**
     * Sets up the app singleton and all it's child dependencies
     * NOTE: This should only be fired in index controller file and only once.
     */
    init: function() {
        APP.NaviBridge.SetApplicationID("ICiAV4Ay");
    }
};

module.exports = APP;