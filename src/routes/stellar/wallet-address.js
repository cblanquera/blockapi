import { parse } from 'url';

export default async (req) => {
  const { query } = parse(req.url, true);
  const { pk, live = false } = query;

  const payload = { error: false };

  if (!pk) {
    payload.error = true;
    payload.message = 'No private key (pk) given';
    return JSON.stringify(payload, null, 4);
  }

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};
