import { parse } from 'url';

export default async (req) => {
  const payload = { error: false };

  const { query } = parse(req.url, true);
  const { live = false } = query;

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};
