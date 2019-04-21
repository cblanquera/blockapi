import { parse } from 'url';

export default (req, res) => {
  let payload = { error: false };

  payload.error = true;
  payload.message = 'TODO';
  res.end(JSON.stringify(payload, null, 4));
};
