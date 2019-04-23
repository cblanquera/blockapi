import { parse } from 'url';

export default async (req) => {
  const { query } = parse(req.url, true);
  const { address, live = false } = query;

  const payload = { error: false };

  if (!address) {
    payload.error = true;
    payload.message = 'No address given';
    return JSON.stringify(payload, null, 4);
  }

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};
