import fetch from 'isomorphic-unfetch';

import UtxoInterface from '../contracts/UtxoInterface';
import Exception from '../Exception';

import API from '../API';

class BitPay extends UtxoInterface {
    constructor() {
        super();
        this.settings = API.config('services', 'bitpay');
    }

    async getUtxo(address) {
        const url = this.settings.url_utxo.replace('%s', address);

        const response = await fetch(url);
        return response.data;
    }
}

export default new BitPay();
