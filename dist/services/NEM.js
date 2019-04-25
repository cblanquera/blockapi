'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nemSdk = require('nem-sdk');

var _nemSdk2 = _interopRequireDefault(_nemSdk);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

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
    _this.live = live;
    _this.networkId = _nemSdk2.default.model.network.data.mainnet.id;
    _this.network = _nemSdk2.default.model.nodes.defaultMainnet;

    if (!live) {
      _this.networkId = _nemSdk2.default.model.network.data.testnet.id;
      _this.network = _nemSdk2.default.model.nodes.defaultTestnet;
    }
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
      // create private key via random bytes from PRNG and convert to hex
      var rBytes = _nemSdk2.default.crypto.nacl.randomBytes(32);
      var privateKey = _nemSdk2.default.utils.convert.ua2hex(rBytes);

      // create key keyPair
      var nemKeyPair = _nemSdk2.default.crypto.keyPair.create(privateKey);

      // get address based on public key
      var address = _nemSdk2.default.model.address.toAddress(nemKeyPair.publicKey.toString(), this.networkId);

      // return address and private key
      return {
        address: address,
        public: nemKeyPair.publicKey.toString(),
        key: privateKey
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
      // Create an NIS endpoint object
      var endpoint = _nemSdk2.default.model.objects.create('endpoint')(this.network, _nemSdk2.default.model.nodes.defaultPort);

      // get account data
      var result = await _nemSdk2.default.com.requests.account.data(endpoint, address);
      if (!result) {
        throw _Exception2.default.for('Could not fetch balance.');
      }

      // get account balance
      var balance = new _bignumber2.default(result.account.balance || '0').toString();

      // return the balance
      return balance;
    }

    /**
     * Fetches the transactions of the given address.
     * 
     * @param {String} address 
     * 
     * @return {Array}
     */

  }, {
    key: 'getHistory',
    value: async function getHistory(address) {
      // Create an NIS endpoint object
      var endpoint = _nemSdk2.default.model.objects.create('endpoint')(this.network, _nemSdk2.default.model.nodes.defaultPort);

      // get all transactions
      var results = await _nemSdk2.default.com.requests.account.transactions.all(endpoint, address);
      return results.data || [];
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
      // setup the key pair
      var keyPair = _nemSdk2.default.crypto.keyPair.create(privateKey);

      // get address based on public key
      var address = _nemSdk2.default.model.address.toAddress(keyPair.publicKey.toString(), this.networkId);

      // return address and private key
      return {
        address: address,
        public: keyPair.publicKey.toString(),
        key: privateKey
      };
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

      // validate the key
      if (!_nemSdk2.default.utils.helpers.isPrivateKeyValid(data.key)) {
        throw _Exception2.default.for('Invalid private key.');
      }

      // valid public key
      if (!_nemSdk2.default.model.address.isValid(data.to)) {
        throw _Exception2.default.for('Invalid destination address.');
      }

      // parse the amount
      var amount = parseFloat(data.value).toFixed(6);

      // create an NIS endpoint object
      var endpoint = _nemSdk2.default.model.objects.create('endpoint')(this.network, _nemSdk2.default.model.nodes.defaultPort);

      // Create a common object holding key
      var common = _nemSdk2.default.model.objects.create('common')('', data.key);

      // Create an un-prepared transfer transaction object
      var transferTransaction = _nemSdk2.default.model.objects.create('transferTransaction')(data.to, amount, '');

      // Prepare the transfer transaction object
      var transactionEntity = await _nemSdk2.default.model.transactions.prepare('transferTransaction')(common, transferTransaction, this.networkId);

      // let's get the NIS timestamp
      var timestamps = await _nemSdk2.default.com.requests.chain.time(endpoint);

      // set transaction timestamp
      var ts = Math.floor(timestamps.receiveTimeStamp / 1000);
      transactionEntity.timeStamp = ts;

      // set deadline
      var due = 60;
      transactionEntity.deadline = ts + due * 60;

      // send the request
      var result = await _nemSdk2.default.model.transactions.send(common, transactionEntity, endpoint);

      // return the result
      return result;
    }
  }]);

  return NEM;
}(_BlockchainInterface3.default);

exports.default = NEM;
module.exports = exports.default;