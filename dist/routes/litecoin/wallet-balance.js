'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _Litecoin = require('../../services/Litecoin');

var _Litecoin2 = _interopRequireDefault(_Litecoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (req) {
  var _parse = (0, _url.parse)(req.url, true),
      query = _parse.query;

  var address = query.address,
      _query$live = query.live,
      live = _query$live === undefined ? false : _query$live;


  var payload = { error: false };

  if (!address) {
    payload.error = true;
    payload.message = 'No address given';
    return JSON.stringify(payload, null, 4);
  }

  var service = new _Litecoin2.default(live);

  try {
    payload.results = await service.getBalance(address);
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;