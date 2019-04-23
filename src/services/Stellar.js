import StellarSdk from 'stellar-sdk';
import StellarBase from 'stellar-base';

import Exception from '../Exception';
import BlockchainInterface from '../contracts/BlockchainInterface';
import Horizon from '../resources/Horizon';

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
    this.live = live;
  }

  /**
   * Generates a Stellar wallet.
   *
   * @return {Object}
   */
  async generate() {
    // generate keys
    const pair = StellarSdk.Keypair.random();

    // return whatever we have generated here
    return {
      address: pair.publicKey(),
      key: pair.secret()
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
    this.logger.log('[XLM]', 'Fetching info...');
    
    const resource = Horizon.load(this.live);
    const results = await resource.getBalance(address);

    return results;
  }

  /**
   * Fetches the transactions of the given address.
   * 
   * @param {String} address 
   * 
   * @return {Array}
   */
  async getHistory(address) {
    this.logger.log('[XLM]', 'Fetching transactions...');

    const resource = Horizon.load(this.live);
    const results = await resource.getTransactions(address);

    return results;
  }

  /**
   * Decodes the private key to get the address.
   *
   * @param {String} privateKey
   *
   * @return {Promise}
   */
  async loadFromPrivateKey(privateKey) {
    // validate if the given private key is valid
    if (!StellarBase.StrKey.isValidEd25519SecretSeed(privateKey)) {
      throw Exception.for('Invalid private key.')
    }

    // get the source keys
    const keys = StellarSdk.Keypair.fromSecret(privateKey);

    return {
      address: keys.publicKey(),
      key: keys.secret()
    }
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
