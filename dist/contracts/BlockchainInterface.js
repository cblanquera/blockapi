'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Blockchain contract
 */
var BlockchainInterface = function () {
  function BlockchainInterface() {
    _classCallCheck(this, BlockchainInterface);
  }

  _createClass(BlockchainInterface, [{
    key: 'generate',

    /**
     * Generates a wallet
     *
     * @return BlockchainInterface
     */
    value: async function generate() {
      throw _Exception2.default.forUndefinedAbstract('generate');
    }

    /**
     * Fetches the balance of the address.
     *
     * @return BlockchainInterface
     */

  }, {
    key: 'getBalance',
    value: async function getBalance() {
      throw _Exception2.default.forUndefinedAbstract('getBalance');
    }

    /**
     * Decodes the private key to get the address.
     *
     * @return BlockchainInterface
     */

  }, {
    key: 'loadFromPrivateKey',
    value: async function loadFromPrivateKey(privateKey) {
      throw _Exception2.default.forUndefinedAbstract('loadFromPrivateKey');
    }

    /**
     * Signs a transaction for a Crypto wallet.
     *
     * @return BlockchainInterface
     */

  }, {
    key: 'signTransaction',
    value: async function signTransaction() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      throw _Exception2.default.forUndefinedAbstract('signTransaction');
    }
  }]);

  return BlockchainInterface;
}();

exports.default = BlockchainInterface;
module.exports = exports.default;