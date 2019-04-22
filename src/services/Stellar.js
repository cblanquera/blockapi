import CryptoJS from 'crypto-js';

import app from '@library/AppHandler';

import Exception from '../Exception';
import BlockchainInterface from '../contracts/BlockchainInterface';

/**
 * Stellar Blockchain Class
 */
export default class Stellar extends BlockchainInterface {
  /**
   * Stellar Blockchain Class Constructor
   */
  constructor(live = false, logger = console) {
    super();

    this.logger = logger;
  }

  /**
   * Generates a Stellar wallet.
   *
   * @return {Object}
   */
  async generate() {
    throw Exception.for('TODO generate()');
  }

  /**
   * Get Balance
   *
   * @param {String} address
   *
   * @return {String}
   */
  async getBalance(address) {
    throw Exception.for('TODO getBalance()');
  }

  /**
   * Decodes the private key to get the address.
   *
   * @param {String} privateKey
   *
   * @return {Promise}
   */
  async loadFromPrivateKey(privateKey) {
    throw Exception.for('TODO loadFromPrivateKey()');
  }

  /**
   * Signs a transaction for a Stellar wallet.
   *
   * @param {Object} data
   *
   * @return {Promise}
   */
  async signTransaction(data = {}) {
    throw Exception.for('TODO signTransaction()');
  }
}
