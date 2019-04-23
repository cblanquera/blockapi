'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _Bitcoin = require('../../services/Bitcoin');

var _Bitcoin2 = _interopRequireDefault(_Bitcoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var service = new _Bitcoin2.default(live);

  try {
    payload.results = await service.loadFromPrivateKey(pk);
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;