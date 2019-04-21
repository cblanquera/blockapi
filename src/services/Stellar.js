import CryptoJS from 'crypto-js';

import app from '@library/AppHandler';

import API from '../../API';
import BlockchainException from '../BlockchainException';
import BlockchainInterface from '../contracts/BlockchainInterface';

/**
 * Stellar Blockchain Class
 */
export default class Stellar extends BlockchainInterface {
  /**
   * Stellar Blockchain Class Constructor
   */
  constructor() {
    super();

    const settings = app.config('settings');

    // instantiate
    this.api = new API(settings);
  }

  /**
   * Generates a Stellar wallet.
   *
   * @return {Object}
   */
  async generate() {
    let api = this.api;

    if (this.isDev) {
      api = api.setAsDev(true);
    }

    api.authenticated();

    const response = await api.post('wallets/generate/xlm');

    return {
      address: response.data.public,
      key: response.data.secret,
      mnemonic: '',
      public: ''
    };
  }

  /**
   * Get Balance
   *
   * @param {String} address
   *
   * @return {String}
   */
  async getBalance(address) {
    let results = await this.getBalance('XLM', address);
    return String(parseFloat(results.balance) * 10 ** 7);
  }

  /**
   * Decodes the private key to get the address.
   *
   * @param {String} privateKey
   *
   * @return {Object}
   */
  async loadFromPrivateKey(privateKey) {
    app.log('[XLM]', 'Unlocking wallet...');

    let api = this.api;

    if (this.isDev) {
      api = api.setAsDev(true);
    }

    api.authenticated().encrypted();
    let response = await api.post('wallets/extract/xlm', {
        wallet_key: privateKey
    });

    return {
      address: response.data.public_key,
      key: privateKey,
      mnemonic: '',
      public: ''
    };
  }

  /**
  * Encrypts the transaction data and we'll let the the server to process and
  * send the transaction to the blockchain.
  *
  * @param {Object} data
  *
  * @return {String}
  */
  async signTransaction(data = {}) {
    const rawData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        settings.salt
    );

    // return it back
    return rawData.toString();
  }

  /**
   * Sets the api call as a dev request
   *
   * @param {Boolean} [dev]
   *
   * @return {Class}
   */
  setDev(dev = true) {
    this.isDev = dev;
    return this;
  }
}
