import { parse } from 'url';

export default async (req) => {
  const { query } = parse(req.url, true);
  const { secret } = query;

  const payload = { error: false };

  if (!secret) {
    payload.error = true;
    payload.message = 'No secret given';
    return JSON.stringify(payload, null, 4);
  }

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};
