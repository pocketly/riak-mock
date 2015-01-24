var db = require('./DB');
function noop() {}

function HttpClient(options) {
  this.config = options;
}

module.exports = HttpClient;

/**
 * Perform a get call, fetch an object and its metadata.
 *
 * @param {String} bucket
 * @param {String} key
 * @param {Object|Meta} options [optional]
 * @param {Function} callback(err, data, meta) [optional]. If `stream: true`, `data` will be a `Stream`.
 * @api public
 */
HttpClient.prototype.get = function(bucket, key, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback !== 'function') {
    callback = noop;
  }

  if (!db[bucket] || !db[bucket][key]) {
    return callback(new Error('Does not exist'));
  }

  return callback(null, db[bucket][key].data, db[bucket][key].meta);
};

/**
 * Saves `data` to an object. Attempts to detect the content type, which can also be provided in the `options`.
 * If no key is supplied, Riak will assign one (which can be later retrieved with `meta.location`).
 * The stored object will only be returned if `options` contains `returnbody: true`.
 * @param {String} bucket
 * @param {String} key
 * @param {String|Object|Buffer|Stream} data
 * @param {Object|Meta} options [optional]
 * @param {Function} callback(err, _, meta) [optional]
 * @api public
 */
HttpClient.prototype.save = function(bucket, key, data, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback !== 'function') {
    callback = noop;
  }

  createBucketIfNotExist(bucket);

  db[bucket][key] = {
    data: data,
    meta: options
  };

  callback(null, null, options);
};

/**
 * Remove an object.
 *
 * @param {String} bucket
 * @param {String} key
 * @param {Object|Meta} options [optional]
 * @param {Function} callback(err, _, meta) [optional]
 * @api public
 */
HttpClient.prototype.remove = function(bucket, key, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback !== 'function') {
    callback = noop;
  }

  if (!db[bucket] || !db[bucket][key]) {
    return callback(new Error('Does not exist'));
  }

  delete db[bucket][key];

  callback(null, null, options);
};

function createBucketIfNotExist(bucket) {
  if (!db[bucket]) {
    db[bucket] = {};
  }
}