import { parse } from 'url';

import EthereumService from '../../services/Ethereum';

export default async (req) => {
  const { query } = parse(req.url, true);
  const { address, live = false } = query;

  const payload = { error: false };

  if (!address) {
    payload.error = true;
    payload.message = 'No address given';
    return JSON.stringify(payload, null, 4);
  }

  const service = new EthereumService(live);

  try {
    payload.results = await service.getHistory(address);
  } catch (e) {
    payload.error = true;
    payload.message = e.message;
  }

  return JSON.stringify(payload, null, 4);
};
