import CryptoJS from 'crypto-js';

import app from '@library/AppHandler';

import StellarSdk from 'stellar-sdk';
import StellarBase from 'stellar-base';

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

    this.network = '';
    if (live) {
      this.network = '';
    }
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
      public: pair.publicKey(),
      secret: pair.secret()
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
    // init server
    StellarSdk.Network.useTestNetwork();
    let server = new StellarSdk.Server(testNetUrl);

    if (settings.env === 'production') {
      // set test network and server
      StellarSdk.Network.usePublicNetwork();
      server = new StellarSdk.Server(liveNetUrl);
    }

    // set the request
    return new Promise((resolve, reject) => {
      server.loadAccount(publicKey)
        .then((account) => {
          // return whatever we have
          resolve(account.balances);
        }).catch((error) => {
          // return error
          reject(error);
        });
    });
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
