'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _now = require('../now');

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

  var response = '';
  await forEach(_now.routes, async function (route) {
    if (route.src === pathname) {
      var promise = require('../' + route.dest);
      console.log(promise.default);
      response = await promise.default(req);
    }
  });

  return response;
};