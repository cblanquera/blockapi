import { parse } from 'url';

import BitcoinService from '../../../services/Bitcoin';

export default async (req) => {
  const payload = { error: false };

  const { query } = parse(req.url, true);

  const service = new BitcoinService(query.live);

  payload.results = await service.generate();
  return JSON.stringify(payload, null, 4);
};
