'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _Litecoin = require('../../services/Litecoin');

var _Litecoin2 = _interopRequireDefault(_Litecoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (req) {
  var payload = { error: false };

  var _parse = (0, _url.parse)(req.url, true),
      query = _parse.query;

  var _query$live = query.live,
      live = _query$live === undefined ? false : _query$live;


  var service = new _Litecoin2.default(live);

  //try {
  payload.results = await service.generate();
  //} catch (e) {
  //payload.error = true;
  //payload.message = e.message;
  //}

  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;