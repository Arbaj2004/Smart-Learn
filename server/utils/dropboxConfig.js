const dropboxV2Api = require("dropbox-v2-api");

// Dropbox API Initialization

const dropbox = dropboxV2Api.authenticate({
  token: process.env.DROPBOX_ACCESS_TOKEN,
});

module.exports = dropbox;
