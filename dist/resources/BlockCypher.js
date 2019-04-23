'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _UtxoInterface2 = require('../contracts/UtxoInterface');

var _UtxoInterface3 = _interopRequireDefault(_UtxoInterface2);

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var URLS = {
  "test": {
    "token": "78adc26f4d8e4cbfbab5381c090f90b3",
    "url_utxo": "https://api.blockcypher.com/v1/btc/test3/addrs/%s?limit=2000&after=%s&token=%s"
  },
  "live": {
    "token": "78adc26f4d8e4cbfbab5381c090f90b3",
    "url_utxo": "https://api.blockcypher.com/v1/btc/test3/addrs/%s?limit=2000&after=%s&token=%s"
  }
};

var BlockCypher = function (_UtxoInterface) {
  _inherits(BlockCypher, _UtxoInterface);

  function BlockCypher() {
    var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, BlockCypher);

    var _this = _possibleConstructorReturn(this, (BlockCypher.__proto__ || Object.getPrototypeOf(BlockCypher)).call(this));

    _this.settings = URLS.test;
    if (live) {
      _this.settings = URLS.live;
    }
    return _this;
  }

  _createClass(BlockCypher, [{
    key: 'getUtxo',
    value: async function getUtxo(address) {
      var utxos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var maxHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var url = this.settings.url_utxo.replace('%s', address).replace('%s', maxHeight).replace('%s', this.settings.token);

      var response = await _axios2.default.get(url);
      var body = response.data;

      // do we have data?
      if (typeof body === 'undefined' || typeof body.final_balance === 'undefined') {
        throw _Exception2.default.for('Could not fetch UTXO from Blockcypher.');
      }

      body.txrefs = body.txrefs || {};
      Object.keys(body.txrefs).forEach(function (key) {
        var txref = body.txrefs[key];
        // set max height for later
        maxHeight = Math.max(maxHeight, txref.block_height) + 1;

        // is it spent?
        if (typeof txref.spent !== 'undefined' && txref.spent === false) {
          // push this ref
          utxos.push(txref);
        }
      });

      if (typeof body.hasMore !== 'undefined') {
        return await BlockCypher.getUtxo(address, utxos, maxHeight);
      }

      // unconfirmed txrefs
      body.unconfirmed_txrefs = body.unconfirmed_txrefs || [];

      // concat unconfirmed
      return utxos.concat(body.unconfirmed_txrefs);
    }
  }], [{
    key: 'load',
    value: function load() {
      var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      return new BlockCypher(live);
    }
  }]);

  return BlockCypher;
}(_UtxoInterface3.default);

exports.default = BlockCypher;
module.exports = exports.default;