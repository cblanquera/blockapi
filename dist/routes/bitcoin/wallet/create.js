'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _Bitcoin = require('../../../services/Bitcoin');

var _Bitcoin2 = _interopRequireDefault(_Bitcoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (req) {
  var payload = { error: false };

  var _parse = (0, _url.parse)(req.url, true),
      query = _parse.query;

  var service = new _Bitcoin2.default(query.live);

  payload.results = await service.generate();
  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;