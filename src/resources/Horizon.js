import StellarSdk from 'stellar-sdk';

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
     * Fetches the account details based on the given public key.
     * 
     * @param {String} publicKey 
     * 
     * @return {Object}
     */
    async getAccount(publicKey) {
        const account = await this.server.loadAccount(publicKey);
        return account;
    }

    /**
     * Returns the account details of a given public key.
     * 
     * @param {String} publicKey 
     * 
     * @return {Object}
     */
    async getBalance(publicKey) {
        const account = await this.getAccount(publicKey);
        return account.balances;
    }

    /**
     * Returns the list of completed transactions.
     * 
     * @param {String} publicKey 
     * 
     * @return {Array}
     */
    async getTransactions(publicKey) {
        const results = await this.server.transactions()
            .forAccount(publicKey)
            .call();

        return results.records;
    }

    /**
     * Submits a signed transaction to the blockchain.
     * 
     * @param {String} transaction 
     * 
     * @return {Object}
     */
    async sendTransaction(transaction) {
        const result = await this.server.submitTransaction(transaction)
        return result;
    }
}