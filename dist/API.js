'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, [{
    key: 'config',

    /**
     * Easily access configuration paths without
     * hardcoding those in other classes
     *
     * @param {String} path
     * @param {String} [key]
     *
     * @return {*}
     */
    value: function config(path, key) {
      var config = null;
      switch (path) {
        case 'services':
          config = require('../config/services');
          break;
      }

      if (key && config[key]) {
        return config[key];
      }

      return config;
    }
  }]);

  return API;
}();

exports.default = new API();