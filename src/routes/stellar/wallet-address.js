import { parse } from 'url';

import StellarService from '../../services/Stellar';

export default async (req, res) => {
  const { query } = parse(req.url, true);
  const { pk, live = false } = query;

  const payload = { error: false };

  if (!pk) {
    payload.error = true;
    payload.message = 'No private key (pk) given';
    return JSON.stringify(payload, null, 4);
  }

  const service = new StellarService(live);

  try {
    payload.results = await service.loadFromPrivateKey(pk);
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  // set the header
  res.setHeader('Content-Type', 'application/json');
  return JSON.stringify(payload, null, 4)
};
