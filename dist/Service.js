'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bitcoin = require('./services/Bitcoin');

var _Bitcoin2 = _interopRequireDefault(_Bitcoin);

var _Ethereum = require('./services/Ethereum');

var _Ethereum2 = _interopRequireDefault(_Ethereum);

var _Litecoin = require('./services/Litecoin');

var _Litecoin2 = _interopRequireDefault(_Litecoin);

var _NEM = require('./services/NEM');

var _NEM2 = _interopRequireDefault(_NEM);

var _Stellar = require('./services/Stellar');

var _Stellar2 = _interopRequireDefault(_Stellar);

var _BlockchainException = require('./BlockchainException');

var _BlockchainException2 = _interopRequireDefault(_BlockchainException);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function () {
  function Service() {
    _classCallCheck(this, Service);
  }

  _createClass(Service, null, [{
    key: 'load',

    /**
     * Static loader
     *
     * @param {String} type
     *
     * @return {Class|Exception}
     */
    value: function load(type) {
      switch (type.toLowerCase()) {
        case 'btc':
        case 'bitcoin':
          return new _Bitcoin2.default();
          break;
        case 'eth':
        case 'ethereum':
          return new _Ethereum2.default();
          break;
        case 'ltc':
        case 'litecoin':
          return new _Litecoin2.default();
          break;
        case 'xem':
        case 'nem':
          return new _NEM2.default();
          break;
        case 'xlm':
        case 'stellar':
          return new _Stellar2.default();
          break;
        default:
          throw _BlockchainException2.default.forNotFound('currency', type);
          break;
      }
    }
  }]);

  return Service;
}();

exports.default = Service;