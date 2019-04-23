import axios from 'axios';

import UtxoInterface from '../contracts/UtxoInterface';
import Exception from '../Exception';

const URLS = {
  "test": {
    "url_utxo": "https://testnet.litecore.io/api/addr/%s/utxo",
    "url_info": "https://testnet.litecore.io/api/addr/%s"
  },
  "live": {
    "url_utxo": "https://testnet.litecore.io/api/addr/%s/utxo",
    "url_info": "https://testnet.litecore.io/api/addr/%s"
  },
};

export default class LiteCore extends UtxoInterface {
    constructor(live = false) {
        super();
        this.settings = URLS.test;
        if (live) {
            this.settings = URLS.live;
        }
    }

    static load(live = false) {
      return new LiteCore(live);
    }

    async getInfo(address) {
        const url = this.settings.url_info.replace('%s', address);

        const response = await axios.get(url);
        return response.data;
    }

    async getUtxo(address) {
        const url = this.settings.url_utxo.replace('%s', address);

        const response = await axios.get(url);
        return response.data;
    }
}
