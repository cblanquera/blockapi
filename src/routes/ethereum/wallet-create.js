import { parse } from 'url';

import EthereumService from '../../services/Ethereum';

export default async (req) => {
  const payload = { error: false };

  const { query } = parse(req.url, true);
  const { live = false } = query;

  const service = new EthereumService(live);

  try {
    payload.results = await service.generate();
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  return JSON.stringify(payload, null, 4);
};
