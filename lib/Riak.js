var HttpClient = require('./HttpClient');

module.exports = getClient;

function getClient(options) {
  if (options == undefined) options = {};

  if (options.api == undefined) {
    options.api = 'http';
  }

  return getClient[options.api](options);
}


getClient.http = function(options) {
  return new HttpClient(options);
};