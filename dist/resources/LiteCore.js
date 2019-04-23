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
        "url_utxo": "https://testnet.litecore.io/api/addr/%s/utxo",
        "url_info": "https://testnet.litecore.io/api/addr/%s"
    },
    "live": {
        "url_utxo": "https://testnet.litecore.io/api/addr/%s/utxo",
        "url_info": "https://testnet.litecore.io/api/addr/%s"
    }
};

var LiteCore = function (_UtxoInterface) {
    _inherits(LiteCore, _UtxoInterface);

    function LiteCore() {
        var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        _classCallCheck(this, LiteCore);

        var _this = _possibleConstructorReturn(this, (LiteCore.__proto__ || Object.getPrototypeOf(LiteCore)).call(this));

        _this.settings = URLS.test;
        if (live) {
            _this.settings = URLS.live;
        }
        return _this;
    }

    _createClass(LiteCore, [{
        key: 'getInfo',
        value: async function getInfo(address) {
            var url = this.settings.url_info.replace('%s', address);

            var response = await _axios2.default.get(url);
            return response.data;
        }
    }, {
        key: 'getUtxo',
        value: async function getUtxo(address) {
            var url = this.settings.url_utxo.replace('%s', address);

            var response = await _axios2.default.get(url);
            return response.data;
        }
    }], [{
        key: 'load',
        value: function load() {
            var live = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return new LiteCore(live);
        }
    }]);

    return LiteCore;
}(_UtxoInterface3.default);

exports.default = LiteCore;
module.exports = exports.default;