'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicUnfetch = require('isomorphic-unfetch');

var _isomorphicUnfetch2 = _interopRequireDefault(_isomorphicUnfetch);

var _UtxoInterface2 = require('../contracts/UtxoInterface');

var _UtxoInterface3 = _interopRequireDefault(_UtxoInterface2);

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

var _API = require('../API');

var _API2 = _interopRequireDefault(_API);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LiteCore = function (_UtxoInterface) {
    _inherits(LiteCore, _UtxoInterface);

    function LiteCore() {
        _classCallCheck(this, LiteCore);

        var _this = _possibleConstructorReturn(this, (LiteCore.__proto__ || Object.getPrototypeOf(LiteCore)).call(this));

        _this.settings = _API2.default.config('services', 'litecore');
        return _this;
    }

    _createClass(LiteCore, [{
        key: 'getUtxo',
        value: async function getUtxo(address) {
            var url = this.settings.url_utxo.replace('%s', address);

            var response = await (0, _isomorphicUnfetch2.default)(url);
            return response.data;
        }
    }]);

    return LiteCore;
}(_UtxoInterface3.default);

exports.default = new LiteCore();