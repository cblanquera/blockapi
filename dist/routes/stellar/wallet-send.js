'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

exports.default = async function (req) {
  var _parse = (0, _url.parse)(req.url, true),
      query = _parse.query;

  var pk = query.pk,
      destination = query.destination,
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

  if (!destination) {
    errors.destination = 'No destination address given';
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

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};

module.exports = exports.default;