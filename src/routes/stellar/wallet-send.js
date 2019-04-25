import { parse } from 'url';

import StellarService from '../../services/Stellar'

export default async (req) => {
  const { query } = parse(req.url, true);
  const { pk, to, amount, fees = 0, live = false } = query;

  const payload = { error: false };
  const errors = {};

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

  const service = new StellarService(live);

  try {
    payload.results = await service.signTransaction({
      key: pk,
      to: to,
      value: amount
    });
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  return JSON.stringify(payload, null, 4)
};
