'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Exception = require('../Exception');

var _Exception2 = _interopRequireDefault(_Exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UtxoInterface = function () {
    function UtxoInterface() {
        _classCallCheck(this, UtxoInterface);
    }

    _createClass(UtxoInterface, [{
        key: 'getUtxo',
        value: async function getUtxo(address) {
            throw _Exception2.default.forUndefinedAbstract('getUtxo');
        }
    }]);

    return UtxoInterface;
}();

exports.default = UtxoInterface;
module.exports = exports.default;