import { parse } from 'url';

import LitecoinService from '../../services/Litecoin';

export default async (req) => {
  const payload = { error: false };

  const { query } = parse(req.url, true);
  const { live = false } = query;

  const service = new LitecoinService(live);

  //try {
    payload.results = await service.generate();
  //} catch (e) {
    //payload.error = true;
    //payload.message = e.message;
  //}

  return JSON.stringify(payload, null, 4);
};
