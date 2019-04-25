'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _Stellar = require('../../services/Stellar');

var _Stellar2 = _interopRequireDefault(_Stellar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (req, res) {
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

  var service = new _Stellar2.default(live);

  try {
    payload.results = await service.loadFromPrivateKey(pk);
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  // set the header
  // res.setHeader('Content-Type', 'application/json');
  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;