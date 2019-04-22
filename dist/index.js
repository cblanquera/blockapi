'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _routes = require('../config/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function forEach(list, callback) {
  for (var results, index = 0; index < list.length; index++) {
    if ((await callback(list[index], index)) === false) {
      break;
    }
  }
}

exports.default = async function (req) {
  var _parse = (0, _url.parse)(req.url),
      pathname = _parse.pathname;

  var response = '{"error": "true", "message": "No route found."}';
  await forEach(_routes2.default, async function (route) {
    if (route.src === pathname) {
      var promise = require('../' + route.dest);
      response = await promise(req);
    }
  });

  return response;
};

module.exports = exports.default;