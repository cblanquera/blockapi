'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _sha = require('crypto-js/sha3');

var _sha2 = _interopRequireDefault(_sha);

require('ethers/dist/shims.js');

var _ethers = require('ethers');

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

var _BlockchainInterface2 = require('../contracts/BlockchainInterface');

var _BlockchainInterface3 = _interopRequireDefault(_BlockchainInterface2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Blockchain Ethereum Class
 */
var Ethereum = function (_BlockchainInterface) {
  _inherits(Ethereum, _BlockchainInterface);

  /**
   * Blockchain Ethereum Class Constructor
   */
  function Ethereum() {
    var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var logger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console;

    _classCallCheck(this, Ethereum);

    var _this = _possibleConstructorReturn(this, (Ethereum.__proto__ || Object.getPrototypeOf(Ethereum)).call(this));

    _this.logger = logger;

    // setup the btc network
    _this.network = 'rinkeby';
    if (live) {
      _this.network = bitcoin.networks.bitcoin;
    }

    _this.network = 'mainnet';

    // setup the provider
    _this.provider = _ethers.ethers.getDefaultProvider(network);
    return _this;
  }

  /**
   * Generates a wallet address.
   *
   * @return {Object}
   */


  _createClass(Ethereum, [{
    key: 'generate',
    value: async function generate() {
      this.logger.log('[ETH]', 'Generating wallet...');

      // create wallet
      var wallet = _ethers.ethers.Wallet.createRandom();

      this.logger.log('[ETH]', 'Wallet generated "' + wallet.address + '"');

      return {
        address: wallet.address,
        key: wallet.privateKey,
        mnemonic: wallet.mnemonic,
        public: wallet.publicKey
      };
    }

    /**
     * Fetches the balance of the address.
     *
     * @param {String} address
     *
     * @return {String}
     */

  }, {
    key: 'getBalance',
    value: async function getBalance(address) {
      var isValidAddress = await this.isAddress(address);

      if (!isValidAddress) {
        throw _Exception2.default.for('Invalid address format');
      }

      // check if if the wallet address given has `0x` as prefix
      if (address.indexOf('0x') !== 0) {
        address = '0x' + address;
      }

      var balance = this.provider.getBalance(address);

      if (typeof balance.message !== 'undefined') {
        throw _Exception2.default.forNotFound('Wallet Address', address);
      }

      return balance.toString();
    }

    /**
     * Checks if the given address is a valid Ethereum address.
     * Source: https://github.com/cilphex/ethereum-address/blob/master/index.js
     *
     * @param {String} address
     *
     * @return {Boolean}
     */

  }, {
    key: 'isAddress',
    value: function isAddress(address) {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // Check if it has the basic requirements of an address
        return false;
      } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
      } else {
        // Otherwise check each case
        return this.isChecksumAddress(address);
      }
    }

    /**
    * Checks if the given address is checksummed.
    * Source: https://github.com/cilphex/ethereum-address/blob/master/index.js
    *
    * @param {String} address
    *
    * @return {Boolean}
    */

  }, {
    key: 'isChecksumAddress',
    value: function isChecksumAddress(address) {
      // Check each case
      address = address.replace('0x', '');
      var addressHash = this.sha3(address.toLowerCase());

      for (var i = 0; i < 40; i++) {
        // The nth letter should be uppercase if the nth digit of casemap is 1
        if (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i] || parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i]) {
          return false;
        }
      }

      return true;
    }

    /**
     * Decodes the private key to get the address.
     *
     * @param {String} privateKey
     *
     * @return {Object}
     */

  }, {
    key: 'loadFromPrivateKey',
    value: async function loadFromPrivateKey(privateKey) {
      this.logger.log('[ETH]', 'Unlocking wallet...');

      if (privateKey.indexOf('0x') !== 0) {
        privateKey = '0x' + privateKey;
      }

      // unlock the wallet
      var unlockedWallet = new _ethers.ethers.Wallet(privateKey, this.provider);

      this.logger.log('[ETH]', 'Wallet unlocked');

      return {
        address: unlockedWallet.address,
        key: unlockedWallet.privateKey,
        public: unlockedWallet.publicKey
      };
    }

    /**
     * Get the nonce of a given wallet.
     *
     * @param {String} key
     *
     * @return {Integer}
     */

  }, {
    key: 'nonce',
    value: async function nonce(key) {
      // check if if the private key given has `0x` as prefix
      if (key.indexOf('0x') !== 0) {
        key = '0x' + key;
      }

      // unlock the wallet
      var wallet = new _ethers.ethers.Wallet(key, this.provider);

      return await wallet.getTransactionCount();
    }

    /**
     * SHA3 Hasher
     *
     * @param {String} value
     *
     * @return {String}
     */

  }, {
    key: 'sha3',
    value: function sha3(value) {
      return (0, _sha2.default)(value, {
        outputLength: 256
      }).toString();
    }

    /**
     * Signs a transaction for an Ethereum wallet.
     *
     * @param {Object} data
     *
     * @return {String}
     */

  }, {
    key: 'signTransaction',
    value: async function signTransaction() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // key
      if (!data.key || _validator2.default.isEmpty(String(data.key))) {
        throw _Exception2.default.for('Private key is required.');
      }

      // to
      if (!data.to || _validator2.default.isEmpty(String(data.to))) {
        throw _Exception2.default.for('Recipient is required.');
      }

      // fix the recipient address
      if (data.to.indexOf('0x') !== 0) {
        data.to = '0x' + data.to;
      }

      var nonce = this.nonce(data.key);

      // build the transaction data
      var transactionData = {
        data: data.data ? data.data : '',
        gasLimit: _ethers.ethers.utils.bigNumberify(data.gas_limit || '21000').toHexString(),
        gasPrice: _ethers.ethers.utils.bigNumberify(data.gas_price || '1000000000').toHexString(),
        nonce: nonce,
        to: data.to,
        value: _ethers.ethers.utils.bigNumberify(data.value).toHexString()
      };

      // check if if the private key given has `0x` as prefix
      if (data.key.indexOf('0x') !== 0) {
        data.key = '0x' + data.key;
      }

      // unlock the wallet
      var wallet = new _ethers.ethers.Wallet(data.key, this.provider);

      // sign it
      return wallet.sign(transactionData);
    }
  }]);

  return Ethereum;
}(_BlockchainInterface3.default);

exports.default = Ethereum;
module.exports = exports.default;