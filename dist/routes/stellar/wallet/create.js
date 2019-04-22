'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

exports.default = async function (req) {
  var payload = { error: false };

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;