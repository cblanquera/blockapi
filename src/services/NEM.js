import CryptoJS from 'crypto-js';

import app from '@library/AppHandler';

import API from '../../API';
import BlockchainException from '../BlockchainException';
import BlockchainInterface from '../contracts/BlockchainInterface';

/**
 * NEM Blockchain Class
 */
export default class NEM extends BlockchainInterface {
  /**
   * NEM Blockchain Class Constructor
   */
  constructor() {
    super();

    const settings = app.config('settings');

    // instantiate
    this.api = new API(settings);
    this.isDev = false;
  }

  /**
   * Generates a NEM wallet.
   *
   * @return {Object}
   */
  async generate() {
    let api = this.api;

    if (this.isDev) {
      api = api.setAsDev(true);
    }

    api.authenticated();
    const response = await api.post('wallets/generate/xem');

    return {
      address: response.data.address,
      key: response.data.private_key,
      mnemonic: '',
      public: response.data.public_key
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
    let results = await this.getBalance('XEM', address);
    return String(results.balance);
  }

  /**
   * Decodes the private key to get the address.
   *
   * @param {String} privateKey
   *
   * @return {Promise}
   */
  async loadFromPrivateKey(privateKey) {
    app.log('[NEM]', 'Unlocking wallet...');

    let api = this.api;

    if (this.isDev) {
      api = api.setAsDev(true);
    }

    api.authenticated().encrypted();

    const response = await api.post('wallets/extract/xem', {
        wallet_key: privateKey
    });

    return {
      address: response.data.address,
      key: privateKey,
      mnemonic: '',
      public: response.data.public_key
    };
  }

  /**
   * Signs a transaction for a Litecoin wallet.
   *
   * @param {Object} data
   *
   * @return {Promise}
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
