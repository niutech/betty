var _          = require('lodash');
var phone      = require('./utils/phone');
var jsonConfig = require('./../config/index.json') || false; 

function fail(msg) {
    console.error(msg);
    process.exit(1);
}

var config = {
    'port': jsonConfig.port ? jsonConfig.port : process.env.PORT || 3000,
    'host': jsonConfig.host ? jsonConfig.host : process.env.HOST,
    'secret': jsonConfig.secret ? jsonConfig.secret : process.env.SECRET,

    // List of phone numbers
    'phones': _.map((jsonConfig.phones || process.env.PHONES).split(','), function(num) {
        return phone.normalize(num);
    }),

    // Profile to use for conversation
    'profile': jsonConfig.profile ? jsonConfig.profile : process.env.PROFILE || "betty",

    // List of team members
    'team': _.map((jsonConfig.team || process.env.TEAM).split(','), function(t) {
        var parts = t.split(':');
        return {
            name: parts[0],
            phone: phone.normalize(parts[1])
        };
    }),

    // Session configuration
    'session': {
        'secret': jsonConfig.secret ? jsonConfig.secret : process.env.SESSION_SECRET || process.env.SECRET
    },

    // Organization infos
    'org': {
        'name': jsonConfig.org ? jsonConfig.org : process.env.ORG_NAME
    },

    // Twilio API config
    'twilio': {
        'sid': jsonConfig.twilio ? jsonConfig.twilio.sid : process.env.TWILIO_SID,
        'token': jsonConfig.twilio ? jsonConfig.twilio.token : process.env.TWILIO_TOKEN,
        'app': jsonConfig.twilio ? jsonConfig.twilio.app ? process.env.TWILIO_APPID
    },

    'call': {
        // Limit in seconds that Betty waits for the called party to answer the call.
        'timeout': Number(jsonConfig.timeout ? jsonConfig.timeout : process.env.CALL_TIMEOUT || 180)
    }
};

config.host = config.host || "http://localhost:"+config.port;

// Valid configuration
if (!config.twilio.sid || !config.twilio.token || !config.twilio.app) {
    fail("Need TWILIO_SID, TWILIO_TOKEN and TWILIO_APPID environment variables");
}
if (!config.secret) {
    fail("Need SECRET environment variable");
}

module.exports = config;