'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _AppHandler = require('@library/AppHandler');

var _AppHandler2 = _interopRequireDefault(_AppHandler);

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

var _BlockchainInterface2 = require('../contracts/BlockchainInterface');

var _BlockchainInterface3 = _interopRequireDefault(_BlockchainInterface2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * NEM Blockchain Class
 */
var NEM = function (_BlockchainInterface) {
  _inherits(NEM, _BlockchainInterface);

  /**
   * NEM Blockchain Class Constructor
   */
  function NEM() {
    var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var logger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console;

    _classCallCheck(this, NEM);

    var _this = _possibleConstructorReturn(this, (NEM.__proto__ || Object.getPrototypeOf(NEM)).call(this));

    _this.logger = logger;
    return _this;
  }

  /**
   * Generates a NEM wallet.
   *
   * @return {Object}
   */


  _createClass(NEM, [{
    key: 'generate',
    value: async function generate() {
      throw _Exception2.default.for('TODO generate()');
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
      throw _Exception2.default.for('TODO getBalance()');
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
     * Signs a transaction for a NEM wallet.
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

  return NEM;
}(_BlockchainInterface3.default);

exports.default = NEM;
module.exports = exports.default;