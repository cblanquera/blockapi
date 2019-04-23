import { parse } from 'url';

import LitecoinService from '../../services/Litecoin';

export default async (req) => {
  const { query } = parse(req.url, true);
  const { pk, live = false } = query;

  const payload = { error: false };

  if (!pk) {
    payload.error = true;
    payload.message = 'No private key (pk) given';
    return JSON.stringify(payload, null, 4);
  }

  const service = new LitecoinService(live);

  try {
    payload.results = await service.loadFromPrivateKey(pk);
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  return JSON.stringify(payload, null, 4);
};
