import fetch from 'isomorphic-unfetch';

import UtxoInterface from '../contracts/UtxoInterface';
import Exception from '../Exception';

import API from '../API';

class BlockCypher extends UtxoInterface {
    constructor() {
        super();
        this.settings = API.config('services', 'blockcypher');
    }

    async getUtxo(address, utxos = [], maxHeight = 0) {
        const url = this.settings.url_utxo
            .replace('%s', address)
            .replace('%s', maxHeight)
            .replace('%s', this.settings.token);

        const response = await fetch(url);
        const body = response.data;

        // do we have data?
        if (
          typeof body === 'undefined'
          || typeof body.final_balance === 'undefined'
        ) {
          throw Exception.for('Could not fetch UTXO from Blockcypher.');
        }

        body.txrefs = body.txrefs || {};
        for (let txref of body.txrefs) {
          // set max height for later
          maxHeight = Math.max(maxHeight, txref.block_height) + 1;

          // is it spent?
          if (typeof txref.spent !== 'undefined'
            && txref.spent === false
          ) {
            // push this ref
            utxos.push(txref);
          }
        }

        if (typeof body.hasMore !== 'undefined') {
          return await BlockCypher.getUtxo(address, utxos, maxHeight);
        }

        // unconfirmed txrefs
        body.unconfirmed_txrefs = body.unconfirmed_txrefs || [];

        // concat unconfirmed
        return utxos.concat(body.unconfirmed_txrefs);
    }
}

export default new BlockCypher();
