'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _Bitcoin = require('../../services/Bitcoin');

var _Bitcoin2 = _interopRequireDefault(_Bitcoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (req) {
  var _parse = (0, _url.parse)(req.url, true),
      query = _parse.query;

  var pk = query.pk,
      to = query.to,
      amount = query.amount,
      _query$fees = query.fees,
      fees = _query$fees === undefined ? 0 : _query$fees,
      _query$live = query.live,
      live = _query$live === undefined ? false : _query$live;


  var payload = { error: false };
  var errors = {};

  if (!pk) {
    errors.pk = 'No secret given';
  }

  if (!to) {
    errors.to = 'No destination address given';
  }

  if (!amount) {
    errors.amount = 'No amount given';
  } else if (isNaN(parseFloat(amount))) {
    errors.amount = 'Should use a valid number format';
  } else if (amount <= 0) {
    errors.amount = 'Should be greater than 0';
  }

  if (isNaN(parseFloat(fees))) {
    errors.fees = 'Should use a valid number format';
  } else if (fees < 0) {
    errors.fees = 'Should be 0 or greater';
  }

  if (Object.keys(errors).length) {
    payload.error = true;
    payload.message = 'Invalid parameters';
    payload.validation = errors;
    return JSON.stringify(payload, null, 4);
  }

  var service = new _Bitcoin2.default(live);

  try {
    payload.results = await service.signTransaction({
      key: pk,
      to: to,
      value: amount,
      fees: fees
    });
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;