"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stellarSdk = require("stellar-sdk");

var _stellarSdk2 = _interopRequireDefault(_stellarSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URLS = {
    "test": "https://horizon-testnet.stellar.org",
    "live": "https://horizon.stellar.org"
};

/**
 * Horizon Resources Class
 */

var Horizon = function () {
    /**
     * Horizon Resources Class Constructor
     * 
     * @param {Boolean} live 
     */
    function Horizon() {
        var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        _classCallCheck(this, Horizon);

        _stellarSdk2.default.Network.useTestNetwork();
        this.server = new _stellarSdk2.default.Server(URLS.test);

        // are we going to connect to the mainnet?
        if (live) {
            // set the mainnet settings
            _stellarSdk2.default.Network.usePublicNetwork();
            this.server = new _stellarSdk2.default.Server(URLS.live);
        }
    }

    /**
     * Horizon Resource Load
     * 
     * @param {Boolean} live
     *  
     * @returns {Horizon}
     */


    _createClass(Horizon, [{
        key: "getAccount",


        /**
         * Fetches the account details based on the given public key.
         * 
         * @param {String} publicKey 
         * 
         * @return {Object}
         */
        value: async function getAccount(publicKey) {
            var account = await this.server.loadAccount(publicKey);
            return account;
        }

        /**
         * Returns the account details of a given public key.
         * 
         * @param {String} publicKey 
         * 
         * @return {Object}
         */

    }, {
        key: "getBalance",
        value: async function getBalance(publicKey) {
            var account = await this.getAccount(publicKey);
            return account.balances;
        }

        /**
         * Returns the list of completed transactions.
         * 
         * @param {String} publicKey 
         * 
         * @return {Array}
         */

    }, {
        key: "getTransactions",
        value: async function getTransactions(publicKey) {
            var results = await this.server.transactions().forAccount(publicKey).call();

            return results.records;
        }

        /**
         * Submits a signed transaction to the blockchain.
         * 
         * @param {String} transaction 
         * 
         * @return {Object}
         */

    }, {
        key: "sendTransaction",
        value: async function sendTransaction(transaction) {
            var result = await this.server.submitTransaction(transaction);
            return result;
        }
    }], [{
        key: "load",
        value: function load() {
            var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return new Horizon(live);
        }
    }]);

    return Horizon;
}();

exports.default = Horizon;
module.exports = exports.default;