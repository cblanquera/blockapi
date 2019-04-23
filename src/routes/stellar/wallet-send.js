import { parse } from 'url';

export default async (req) => {
  const { query } = parse(req.url, true);
  const { pk, destination, amount, fees = 0, live = false } = query;

  const payload = { error: false };
  const errors = {};

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
