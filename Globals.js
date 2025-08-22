// Globals.js
// Central storage for global IDs, constants, and shared config

module.exports = {
  Guilds: {
    MAIN: '1400081340132626432',   // Main Discord
    WIKI: '1408595595958161562',   // Wiki Discord
  },

  Roles: {
    BOOSTER_MAIN: 'ROLE_ID_MAINBOOSTER',
    BOOSTER_WIKI: 'ROLE_ID_WIKIBOOSTER',
    // other global role references
  },

  Commands: { // Commands config
    PingOfftopic: [ // /pingofftopic command whitelisted channels only
      '1401596819976486963', // MAIN: Offtopic
    ],
  },

  // Misc constants can go here too
  Bot: {
    NAME: 'Forgekeeper',
    VERSION: '2.0.0',
  },
};
