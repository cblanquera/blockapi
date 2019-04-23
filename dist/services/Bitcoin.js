'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isaac = require('isaac');

var _isaac2 = _interopRequireDefault(_isaac);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _bitcoinjsLib = require('bitcoinjs-lib');

var _bitcoinjsLib2 = _interopRequireDefault(_bitcoinjsLib);

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

var _BitPay = require('../resources/BitPay');

var _BitPay2 = _interopRequireDefault(_BitPay);

var _BlockCypher = require('../resources/BlockCypher');

var _BlockCypher2 = _interopRequireDefault(_BlockCypher);

var _BlockchainInterface2 = require('../contracts/BlockchainInterface');

var _BlockchainInterface3 = _interopRequireDefault(_BlockchainInterface2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Blockchain Bitcoin Class
 */
var Bitcoin = function (_BlockchainInterface) {
  _inherits(Bitcoin, _BlockchainInterface);

  /**
   * Blockchain Bitcoin Class Constructor
   */
  function Bitcoin() {
    var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var logger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console;

    _classCallCheck(this, Bitcoin);

    var _this = _possibleConstructorReturn(this, (Bitcoin.__proto__ || Object.getPrototypeOf(Bitcoin)).call(this));

    _this.live = live;
    _this.logger = logger;

    // setup the btc network
    _this.network = _bitcoinjsLib2.default.networks.testnet;
    if (live) {
      _this.network = _bitcoinjsLib2.default.networks.bitcoin;
    }
    return _this;
  }

  /**
   * Generates a wallet
   *
   * @return {Object}
   */


  _createClass(Bitcoin, [{
    key: 'generate',
    value: async function generate() {
      this.logger.log('[BTC]', 'Generating wallet...');

      var keyPair = _bitcoinjsLib2.default.ECPair.makeRandom({
        network: this.network,
        rng: this._rng
      });

      var _bitcoin$payments$p2p = _bitcoinjsLib2.default.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: this.network
      }),
          address = _bitcoin$payments$p2p.address;

      this.logger.log('[BTC]', 'Wallet generated "' + address + '"');

      return {
        address: address,
        key: keyPair.toWIF(),
        mnemonic: '',
        public: keyPair.publicKey.toString('hex')
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
      this.logger.log('[BTC]', 'Fetching info...');

      var resource = _BitPay2.default.load(this.live);
      var results = await resource.getInfo(address);

      return String(results.balanceSat);
    }

    /**
     * Get Balance
     *
     * @param {String} address
     *
     * @return {String}
     */

  }, {
    key: 'getHistory',
    value: async function getHistory(address) {
      this.logger.log('[BTC]', 'Fetching info...');

      var resource = _BlockCypher2.default.load(this.live);
      var results = await resource.getUtxo(address);

      return results;
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
      this.logger.log('[BTC]', 'Unlocking wallet...');

      var keyPair = _bitcoinjsLib2.default.ECPair.fromWIF(privateKey, this.network);

      var _bitcoin$payments$p2p2 = _bitcoinjsLib2.default.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: this.network
      }),
          address = _bitcoin$payments$p2p2.address;

      this.logger.log('[BTC]', 'Wallet unlocked');

      return {
        address: address,
        key: keyPair.toWIF(),
        mnemonic: '',
        public: keyPair.publicKey.toString('hex')
      };
    }

    /**
     * Signs a transaction for a Bitcoin wallet.
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

      this.logger.log('[BTC]', 'Unlocking wallet.');

      var btcKeyPair = _bitcoinjsLib2.default.ECPair.fromWIF(data.key, this.network);

      // get the public address
      var hash = _bitcoinjsLib2.default.payments.p2pkh({
        pubkey: btcKeyPair.publicKey,
        network: this.network
      });

      this.logger.log('[BTC]', 'Fetching UTXOs...');

      var resource = _BlockCypher2.default.load(this.live);
      var utxos = await resource.getUtxo(hash.address);

      this.logger.log('[BTC]', 'Building transaction...');

      // set the key pair again
      btcKeyPair = _bitcoinjsLib2.default.ECPair.fromWIF(data.key, this.network);

      // get the public address

      var _bitcoin$payments$p2p3 = _bitcoinjsLib2.default.payments.p2pkh({
        pubkey: btcKeyPair.publicKey,
        network: this.network
      }),
          address = _bitcoin$payments$p2p3.address;

      // initialize the transaction builder


      var txBuilder = new _bitcoinjsLib2.default.TransactionBuilder(this.network);

      // set unspent amount
      var unspentAmount = 0;

      // loop the utxos
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = utxos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var tx = _step.value;

          // check the confirmation
          if (tx.confirmations < 1) {
            // proceed
            continue;
          }

          // set the input
          txBuilder.addInput(tx.tx_hash, tx.tx_output_n);

          unspentAmount += tx.value;
        }

        // set output
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      txBuilder.addOutput(data.to, parseInt(data.value));

      // perform some computations
      if (parseInt(data.value) + parseInt(data.fees) < unspentAmount) {
        // sending less than we have, so the rest should go back
        txBuilder.addOutput(address, parseInt(unspentAmount) - parseInt(data.value) - parseInt(data.fees));
      }

      for (var t = 0; t < utxos.length; t++) {
        // check the confirmation
        if (utxos[t].confirmations < 1) {
          // proceed
          continue;
        }

        txBuilder.sign(t, btcKeyPair);
      }

      return txBuilder.build().toHex();
    }

    /**
     * RNG Functionality to make the address a little bit random
     * Reference: https://github.com/Overtorment/BlueWallet/blob/b9ec7ac420f56454bf517e61e555c2b8e1768324/class/legacy-wallet.js#L49
     *
     * @param {Integer} c
     *
     * @return {Object}
     */

  }, {
    key: '_rng',
    value: function _rng(c) {
      var buf = Buffer.alloc(c);
      var totalhex = '';
      for (var i = 0; i < c; i++) {
        var randomNumber = _isaac2.default.random();
        randomNumber = Math.floor(randomNumber * 256);
        var n = new _bignumber2.default(randomNumber);
        var hex = n.toString(16);
        if (hex.length === 1) {
          hex = '0' + hex;
        }
        totalhex += hex;
      }

      totalhex = _bitcoinjsLib2.default.crypto.sha256('oh hai!' + totalhex).toString('hex');
      totalhex = _bitcoinjsLib2.default.crypto.sha256(totalhex).toString('hex');
      buf.fill(totalhex, 0, 'hex');
      return buf;
    }
  }]);

  return Bitcoin;
}(_BlockchainInterface3.default);

exports.default = Bitcoin;
module.exports = exports.default;