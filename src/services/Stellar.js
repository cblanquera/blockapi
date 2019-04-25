import StellarSdk from 'stellar-sdk';
import StellarBase from 'stellar-base';
import validator from 'validator';

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
    // load up the resource
    const resource = Horizon.load(this.live);

    // validate source keys
    if (!StellarBase.StrKey.isValidEd25519SecretSeed(data.key)) {
      throw Exception.for('Invalid private key.');
    }

    // validate the destination address by getting it's balance
    const destinationWallet = await resource.getBalance(data.to);

    if (!destinationWallet) {
      throw Exception.for('Invalid destination wallet address');
    }

    // set the source credentials
    const sourceKeys = StellarSdk.Keypair.fromSecret(data.key);

    // check the balance of the source wallet
    const sourceAccount = await resource.getBalance(sourceKeys.publicKey());

    // store the balance
    let balance = 0;

    // does it have balances?
    if (!sourceAccount.balances || sourceAccount.balances.length < 1) {
      throw Exception.for('Invalid source account.')
    }

    // get the native asset type and get its balance
    for (let b in sourceAccount.balances) {
      // check if this is the asset type that we are looking for.
      if (!sourceAccount.balances[b].asset_type
        || !sourceAccount.balances[b].balance
        || sourceAccount.balances[b].asset_type !== 'native'
      ) {
        continue;
      }

      // found it
      balance = parseFloat(sourceAccount.balances[b].balance);
    }

    // validate the account balance
    if (balance < data.value) {
      throw Exception.for('Insufficient account balance.');
    }

    // process submission of transaction
    // build the transaction
    let transaction = new StellarSdk.TransactionBuilder(sourceAccount)
      .addOperation(StellarSdk.Operation.payment({
        destination: data.to,
        asset: StellarSdk.Asset.native(),
        amount: data.value
      }))
      .build();

    // sign the transaction
    transaction.sign(sourceKeys);

    // submit
    const result = await resource.sendTransaction(transaction);

    // no result?
    if (!result) {
      throw Exception.for('Either account is invalid or insufficient account balance.');
    }

    return result;
  }
}
