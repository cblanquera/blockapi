'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

exports.default = async function (req) {
  var _parse = (0, _url.parse)(req.url, true),
      query = _parse.query;

  var pk = query.pk,
      _query$live = query.live,
      live = _query$live === undefined ? false : _query$live;


  var payload = { error: false };

  if (!pk) {
    payload.error = true;
    payload.message = 'No private key (pk) given';
    return JSON.stringify(payload, null, 4);
  }

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;