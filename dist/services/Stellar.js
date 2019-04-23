'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _AppHandler = require('@library/AppHandler');

var _AppHandler2 = _interopRequireDefault(_AppHandler);

var _stellarSdk = require('stellar-sdk');

var _stellarSdk2 = _interopRequireDefault(_stellarSdk);

var _stellarBase = require('stellar-base');

var _stellarBase2 = _interopRequireDefault(_stellarBase);

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

var _BlockchainInterface2 = require('../contracts/BlockchainInterface');

var _BlockchainInterface3 = _interopRequireDefault(_BlockchainInterface2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Stellar Blockchain Class
 */
var Stellar = function (_BlockchainInterface) {
  _inherits(Stellar, _BlockchainInterface);

  /**
   * Stellar Blockchain Class Constructor
   */
  function Stellar() {
    var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var logger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console;

    _classCallCheck(this, Stellar);

    var _this = _possibleConstructorReturn(this, (Stellar.__proto__ || Object.getPrototypeOf(Stellar)).call(this));

    _this.logger = logger;

    _this.network = '';
    if (live) {
      _this.network = '';
    }
    return _this;
  }

  /**
   * Generates a Stellar wallet.
   *
   * @return {Object}
   */


  _createClass(Stellar, [{
    key: 'generate',
    value: async function generate() {
      // generate keys
      var pair = _stellarSdk2.default.Keypair.random();

      // return whatever we have generated here
      return {
        public: pair.publicKey(),
        secret: pair.secret()
      };
    }

    /**
     * Get Balance
     *
     * @param {String} address
     *
     * @return {String}
     */

  }, {
    key: 'getBalance',
    value: async function getBalance(address) {
      // init server
      _stellarSdk2.default.Network.useTestNetwork();
      var server = new _stellarSdk2.default.Server(testNetUrl);

      if (settings.env === 'production') {
        // set test network and server
        _stellarSdk2.default.Network.usePublicNetwork();
        server = new _stellarSdk2.default.Server(liveNetUrl);
      }

      // set the request
      return new Promise(function (resolve, reject) {
        server.loadAccount(publicKey).then(function (account) {
          // return whatever we have
          resolve(account.balances);
        }).catch(function (error) {
          // return error
          reject(error);
        });
      });
    }

    /**
     * Decodes the private key to get the address.
     *
     * @param {String} privateKey
     *
     * @return {Promise}
     */

  }, {
    key: 'loadFromPrivateKey',
    value: async function loadFromPrivateKey(privateKey) {
      throw _Exception2.default.for('TODO loadFromPrivateKey()');
    }

    /**
     * Signs a transaction for a Stellar wallet.
     *
     * @param {Object} data
     *
     * @return {Promise}
     */

  }, {
    key: 'signTransaction',
    value: async function signTransaction() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      throw _Exception2.default.for('TODO signTransaction()');
    }
  }]);

  return Stellar;
}(_BlockchainInterface3.default);

exports.default = Stellar;
module.exports = exports.default;