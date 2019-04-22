import { parse } from 'url';

import { routes } from '../now'

async function forEach(list, callback) {
  for (let results, index = 0; index < list.length; index++) {
    if (await callback(list[index], index) === false) {
      break;
    }
  }
}

export default async (req) => {
  const { pathname } = parse(req.url);

  let response = '';
  await forEach(routes, async (route) => {
    if (route.src === pathname) {
        let promise = require('../' + route.dest);
        response = await promise.default(req);
    }
  });

  return response;
};
