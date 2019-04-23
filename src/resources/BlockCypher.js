import axios from 'axios';

import UtxoInterface from '../contracts/UtxoInterface';
import Exception from '../Exception';

const URLS = {
  "test": {
    "token": "78adc26f4d8e4cbfbab5381c090f90b3",
    "url_utxo": "https://api.blockcypher.com/v1/btc/test3/addrs/%s?limit=2000&after=%s&token=%s"
  },
  "live": {
    "token": "78adc26f4d8e4cbfbab5381c090f90b3",
    "url_utxo": "https://api.blockcypher.com/v1/btc/test3/addrs/%s?limit=2000&after=%s&token=%s"
  },
};

export default class BlockCypher extends UtxoInterface {
    constructor(live = false) {
        super();
        this.settings = URLS.test;
        if (live) {
            this.settings = URLS.live;
        }
    }

    static load(live = false) {
      return new BlockCypher(live);
    }

    async getUtxo(address, utxos = [], maxHeight = 0) {
        const url = this.settings.url_utxo
            .replace('%s', address)
            .replace('%s', maxHeight)
            .replace('%s', this.settings.token);

        const response = await axios.get(url);
        const body = response.data;

        // do we have data?
        if (
          typeof body === 'undefined'
          || typeof body.final_balance === 'undefined'
        ) {
          throw Exception.for('Could not fetch UTXO from Blockcypher.');
        }

        body.txrefs = body.txrefs || {};
        Object.keys(body.txrefs).forEach(key => {
          const txref = body.txrefs[key];
          // set max height for later
          maxHeight = Math.max(maxHeight, txref.block_height) + 1;

          // is it spent?
          if (typeof txref.spent !== 'undefined'
            && txref.spent === false
          ) {
            // push this ref
            utxos.push(txref);
          }
        });

        if (typeof body.hasMore !== 'undefined') {
          return await BlockCypher.getUtxo(address, utxos, maxHeight);
        }

        // unconfirmed txrefs
        body.unconfirmed_txrefs = body.unconfirmed_txrefs || [];

        // concat unconfirmed
        return utxos.concat(body.unconfirmed_txrefs);
    }
}
