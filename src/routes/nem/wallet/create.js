import { parse } from 'url';

export default async (req) => {
  const payload = { error: false };

  payload.error = true;
  payload.message = 'TODO';
  return JSON.stringify(payload, null, 4);
};
