/**
 * Exceptions are used to give more information
 * of an error that has occured
 */
export default class Exception {
  /**
   * An exception should provide a message and a name
   *
   * @param {String} message
   */
  constructor(message) {
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
  static for(message, ...values) {
    values.forEach(function(value) {
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
  static forErrorsFound(errors) {
    const exception = new this('Invalid Parameters: ' + JSON.stringify(errors));
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
  static forInvalidArgument(index, expected, value) {
    if (typeof expected === 'object') {
      expected = expected.constructor.name;
    } else if (typeof expected === 'function') {
      expected = expected.name;
    }

    let actual = typeof value;
    if (typeof actual === 'object') {
      actual = actual.constructor.name;
    } else if (typeof actual === 'function') {
      actual = actual.name;
    }

    return this.for(
      'Argument %s expecting %s, %s was given',
      index,
      expected,
      actual
    );
  }

  /**
   * 404 expressive error
   *
   * @param {String} key
   * @param {(Integer|String)} id
   *
   * @return {Exception}
   */
  static forNotFound(key, id) {
    return this.for('404 Not Found. (%s: %s)', key, id);
  }

  /**
   * Used in contracts and abstract classes
   *
   * @param {String} method
   *
   * @return {Exception}
   */
  static forUndefinedAbstract(method) {
    return this.for('Undefined abstract %s() called', method)
  }
}
