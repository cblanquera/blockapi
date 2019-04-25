import nem from 'nem-sdk';
import BigNumber from 'bignumber.js';

import Exception from '../Exception';
import BlockchainInterface from '../contracts/BlockchainInterface';

/**
 * NEM Blockchain Class
 */
export default class NEM extends BlockchainInterface {
  /**
   * NEM Blockchain Class Constructor
   */
  constructor(live = false, logger = console) {
    super();

    this.logger     = logger;
    this.live       = live;
    this.networkId  = nem.model.network.data.mainnet.id;
    this.network    = nem.model.nodes.defaultMainnet;

    if (!live) {
      this.networkId  = nem.model.network.data.testnet.id;
      this.network    = nem.model.nodes.defaultTestnet;
    }
  }

  /**
   * Generates a NEM wallet.
   *
   * @return {Object}
   */
  async generate() {
    // create private key via random bytes from PRNG and convert to hex
    const rBytes      = nem.crypto.nacl.randomBytes(32);
    const privateKey  = nem.utils.convert.ua2hex(rBytes);

    // create key keyPair
    const nemKeyPair = nem.crypto.keyPair.create(privateKey);

    // get address based on public key
    const address = nem.model.address.toAddress(nemKeyPair.publicKey.toString(), this.networkId);

    // return address and private key
    return {
      address,
      public: nemKeyPair.publicKey.toString(),
      key: privateKey
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
    // Create an NIS endpoint object
    const endpoint = nem.model.objects.create('endpoint')(this.network, nem.model.nodes.defaultPort);

    // get account data
    const result = await nem.com.requests.account.data(endpoint, address);
    if (!result) {
      throw Exception.for('Could not fetch balance.');
    }

    // get account balance
    const balance = new BigNumber(result.account.balance || '0').toString();

    // return the balance
    return balance;
  }

  /**
   * Fetches the transactions of the given address.
   * 
   * @param {String} address 
   * 
   * @return {Array}
   */
  async getHistory(address) {
    // Create an NIS endpoint object
    const endpoint = nem.model.objects.create('endpoint')(this.network, nem.model.nodes.defaultPort);

    // get all transactions
    const results = await nem.com.requests.account.transactions.all(endpoint, address);
    return results.data || [];
  }

  /**
   * Decodes the private key to get the address.
   *
   * @param {String} privateKey
   *
   * @return {Promise}
   */
  async loadFromPrivateKey(privateKey) {
    // setup the key pair
    const keyPair = nem.crypto.keyPair.create(privateKey);

    // get address based on public key
    const address = nem.model.address.toAddress(keyPair.publicKey.toString(), this.networkId);

    // return address and private key
    return {
      address,
      public: keyPair.publicKey.toString(),
      key: privateKey
    };
  }

  /**
   * Signs a transaction for a NEM wallet.
   *
   * @param {Object} data
   *
   * @return {Promise}
   */
  async signTransaction(data = {}) {
    // validate the key
    if (!nem.utils.helpers.isPrivateKeyValid(data.key)) {
      throw Exception.for('Invalid private key.');
    }

    // valid public key
    if (!nem.model.address.isValid(data.to)) {
      throw Exception.for('Invalid destination address.');
    }

    // parse the amount
    const amount = parseFloat(data.value).toFixed(6);

    // create an NIS endpoint object
    const endpoint = nem.model.objects.create('endpoint')(this.network, nem.model.nodes.defaultPort);

    // Create a common object holding key
    const common = nem.model.objects.create('common')('', data.key);

    // Create an un-prepared transfer transaction object
    const transferTransaction = nem.model.objects.create('transferTransaction')(
      data.to,
      amount,
      ''
    );

    // Prepare the transfer transaction object
    const transactionEntity = await nem.model.transactions.prepare('transferTransaction')(
      common,
      transferTransaction,
      this.networkId
    );

    // let's get the NIS timestamp
    const timestamps = await nem.com.requests.chain.time(endpoint);
    
    // set transaction timestamp
    const ts = Math.floor(timestamps.receiveTimeStamp / 1000);
    transactionEntity.timeStamp = ts;

    // set deadline
    const due = 60;
    transactionEntity.deadline = ts + due * 60;

    // send the request
    const result = await nem.model.transactions.send(common, transactionEntity, endpoint);

    // return the result
    return result;
  }
}
