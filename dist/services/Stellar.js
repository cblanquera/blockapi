'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stellarSdk = require('stellar-sdk');

var _stellarSdk2 = _interopRequireDefault(_stellarSdk);

var _stellarBase = require('stellar-base');

var _stellarBase2 = _interopRequireDefault(_stellarBase);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

var _BlockchainInterface2 = require('../contracts/BlockchainInterface');

var _BlockchainInterface3 = _interopRequireDefault(_BlockchainInterface2);

var _Horizon = require('../resources/Horizon');

var _Horizon2 = _interopRequireDefault(_Horizon);

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
    _this.live = live;
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
        address: pair.publicKey(),
        key: pair.secret()
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
      this.logger.log('[XLM]', 'Fetching info...');

      var resource = _Horizon2.default.load(this.live);
      var results = await resource.getBalance(address);

      return results;
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
      this.logger.log('[XLM]', 'Fetching transactions...');

      var resource = _Horizon2.default.load(this.live);
      var results = await resource.getTransactions(address);

      return results;
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
      // validate if the given private key is valid
      if (!_stellarBase2.default.StrKey.isValidEd25519SecretSeed(privateKey)) {
        throw _Exception2.default.for('Invalid private key.');
      }

      // get the source keys
      var keys = _stellarSdk2.default.Keypair.fromSecret(privateKey);

      return {
        address: keys.publicKey(),
        key: keys.secret()
      };
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

      // load up the resource
      var resource = _Horizon2.default.load(this.live);

      console.log('data', data);
      // validate source keys
      if (!_stellarBase2.default.StrKey.isValidEd25519SecretSeed(data.key)) {
        throw _Exception2.default.for('Invalid private key.');
      }

      // validate the destination address by getting it's balance
      var destinationWallet = await resource.getBalance(data.to);
      if (!destinationWallet) {
        throw _Exception2.default.for('Invalid destination wallet address');
      }

      // set the source credentials
      var sourceKeys = _stellarSdk2.default.Keypair.fromSecret(data.key);

      // check the balance of the source wallet
      var sourceAccount = await resource.getAccount(sourceKeys.publicKey());

      // store the balance
      var balance = 0;

      // does it have balances?
      if (!sourceAccount.balances || sourceAccount.balances.length < 1) {
        throw _Exception2.default.for('Invalid source account.');
      }

      // get the native asset type and get its balance
      for (var b in sourceAccount.balances) {
        // check if this is the asset type that we are looking for.
        if (!sourceAccount.balances[b].asset_type || !sourceAccount.balances[b].balance || sourceAccount.balances[b].asset_type !== 'native') {
          continue;
        }

        // found it
        balance = parseFloat(sourceAccount.balances[b].balance);
      }

      // validate the account balance
      if (balance < data.value) {
        throw _Exception2.default.for('Insufficient account balance.');
      }

      // process submission of transaction
      // build the transaction
      var transaction = new _stellarSdk2.default.TransactionBuilder(sourceAccount, {
        fee: _stellarBase2.default.BASE_FEE
      }).addOperation(_stellarSdk2.default.Operation.payment({
        destination: data.to,
        asset: _stellarSdk2.default.Asset.native(),
        amount: data.value
      })).setTimeout(30).build();

      // sign the transaction
      transaction.sign(sourceKeys);
      console.log('fancy');
      // submit
      var result = await resource.sendTransaction(transaction);
      console.log('you');

      // no result?
      if (!result) {
        throw _Exception2.default.for('Either account is invalid or insufficient account balance.');
      }

      return result;
    }
  }]);

  return Stellar;
}(_BlockchainInterface3.default);

exports.default = Stellar;
module.exports = exports.default;