import StellarSdk from 'stellar-sdk';

import UtxoInterface from '../contracts/UtxoInterface';
import Exception from '../Exception';

const URLS = {
    "test": "https://horizon-testnet.stellar.org",
    "live": "https://horizon.stellar.org"
};

/**
 * Horizon Resources Class
 */
export default class Horizon {
    /**
     * Horizon Resources Class Constructor
     * 
     * @param {Boolean} live 
     */
    constructor(live = false) {
        StellarSdk.Network.useTestNetwork();
        this.server = new StellarSdk.Server(URLS.test);

        // are we going to connect to the mainnet?
        if (live) {
            // set the mainnet settings
            StellarSdk.Network.usePublicNetwork();
            this.server = new StellarSdk.Server(URLS.live);
        }
    }

    /**
     * Horizon Resource Load
     * 
     * @param {Boolean} live
     *  
     * @returns {Horizon}
     */
    static load(live = false) {
        return new Horizon(live);
    }

    /**
     * Returns the account details of a given public key.
     * 
     * @param {String} publicKey 
     * 
     * @return {Object}
     */
    async getBalance(publicKey) {
        const account = await this.server.loadAccount(publicKey);
        return account.balances;
    }

    async getTransactions(publicKey) {
        const results = await this.server.transactions()
            .forAccount(publicKey)
            .call();

        return results.records;
    }
}