import { parse } from 'url';

export default (req, res) => {
  const payload = { error: false };

  payload.error = true;
  payload.message = 'TODO';
  res.end(JSON.stringify(payload, null, 4));
};
