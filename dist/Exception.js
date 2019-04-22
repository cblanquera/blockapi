'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Exceptions are used to give more information
 * of an error that has occured
 */
var Exception = function () {
  /**
   * An exception should provide a message and a name
   *
   * @param {String} message
   */
  function Exception(message) {
    _classCallCheck(this, Exception);

    this.message = message;
    this.name = this.constructor.name;
    this.errors = {};
  }

  /**
   * General use expressive reasons
   *
   * @param {String} message
   * @param {(...*)} values
   *
   * @return {Exception}
   */


  _createClass(Exception, null, [{
    key: 'for',
    value: function _for(message) {
      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      values.forEach(function (value) {
        message = message.replace('%s', value);
      });

      return new this(message);
    }

    /**
     * Expressive error report
     *
     * @param {*}
     *
     * @return {Exception}
     */

  }, {
    key: 'forErrorsFound',
    value: function forErrorsFound(errors) {
      var exception = new this('Invalid Parameters: ' + JSON.stringify(errors));
      exception.errors = errors;
      return exception;
    }

    /**
     * Expressive argument type mismatch
     *
     * @param {Integer} index
     * @param {*} expected
     * @param {*} value
     *
     * @return {Exception}
     */

  }, {
    key: 'forInvalidArgument',
    value: function forInvalidArgument(index, expected, value) {
      if ((typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) === 'object') {
        expected = expected.constructor.name;
      } else if (typeof expected === 'function') {
        expected = expected.name;
      }

      var actual = typeof value === 'undefined' ? 'undefined' : _typeof(value);
      if ((typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) === 'object') {
        actual = actual.constructor.name;
      } else if (typeof actual === 'function') {
        actual = actual.name;
      }

      return this.for('Argument %s expecting %s, %s was given', index, expected, actual);
    }

    /**
     * 404 expressive error
     *
     * @param {String} key
     * @param {(Integer|String)} id
     *
     * @return {Exception}
     */

  }, {
    key: 'forNotFound',
    value: function forNotFound(key, id) {
      return this.for('404 Not Found. (%s: %s)', key, id);
    }

    /**
     * Used in contracts and abstract classes
     *
     * @param {String} method
     *
     * @return {Exception}
     */

  }, {
    key: 'forUndefinedAbstract',
    value: function forUndefinedAbstract(method) {
      return this.for('Undefined abstract %s() called', method);
    }
  }]);

  return Exception;
}();

exports.default = Exception;
module.exports = exports.default;