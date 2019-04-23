'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

exports.default = async function (req) {
  var payload = { error: false };

  var _parse = (0, _url.parse)(req.url, true),
      query = _parse.query;

  var _query$live = query.live,
      live = _query$live === undefined ? false : _query$live;


  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;