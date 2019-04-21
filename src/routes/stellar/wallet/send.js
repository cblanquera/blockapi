import { parse } from 'url';

export default async (req) => {
  const { query } = parse(req.url, true);
  const { secret, destination, amount } = query;

  const payload = { error: false };
  const errors = {};

  if (!secret) {
    errors.secret = 'No secret given';
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
