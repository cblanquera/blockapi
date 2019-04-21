import validator from 'validator';

import BN from 'bignumber.js';
import SHA3 from 'crypto-js/sha3';

import 'ethers/dist/shims.js';
import { ethers } from 'ethers';

import Exception from '../Exception';
import BlockchainInterface from '../contracts/BlockchainInterface';

/**
 * Blockchain Ethereum Class
 */
export default class Ethereum extends BlockchainInterface {
  /**
   * Blockchain Ethereum Class Constructor
   */
  constructor(live = false, logger = console) {
    super();

    this.logger = logger;

    // setup the btc network
    this.network = 'rinkeby';
    if (live) {
      this.network = bitcoin.networks.bitcoin;
    }

    this.network = 'mainnet';

    // setup the provider
    this.provider = ethers.getDefaultProvider(network);
  }

  /**
   * Generates a wallet address.
   *
   * @return {Object}
   */
  async generate() {
    this.logger.log('[ETH]', 'Generating wallet...');

    // create wallet
    const wallet = ethers.Wallet.createRandom();

    this.logger.log('[ETH]', 'Wallet generated "' + wallet.address + '"');

    return {
      address: wallet.address,
      key: wallet.privateKey,
      mnemonic: wallet.mnemonic,
      public: wallet.publicKey
    };
  }

  /**
   * Fetches the balance of the address.
   *
   * @param {String} address
   *
   * @return {String}
   */
  async getBalance(address) {
    let isValidAddress = await this.isAddress(address);

    if (!isValidAddress) {
      throw Exception.for('Invalid address format');
    }

    // check if if the wallet address given has `0x` as prefix
    if (address.indexOf('0x') !== 0) {
      address = `0x${address}`;
    }

    const balance = this.provider.getBalance(address);

    if (typeof balance.message !== 'undefined') {
      throw Exception.forNotFound('Wallet Address', address);
    }

    return balance.toString();
  }

  /**
   * Checks if the given address is a valid Ethereum address.
   * Source: https://github.com/cilphex/ethereum-address/blob/master/index.js
   *
   * @param {String} address
   *
   * @return {Boolean}
   */
  isAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // Check if it has the basic requirements of an address
      return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address)
      || /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
      // If it's all small caps or all all caps, return true
      return true;
    } else {
      // Otherwise check each case
      return this.isChecksumAddress(address);
    }
  }

  /**
  * Checks if the given address is checksummed.
  * Source: https://github.com/cilphex/ethereum-address/blob/master/index.js
  *
  * @param {String} address
  *
  * @return {Boolean}
  */
  isChecksumAddress(address) {
    // Check each case
    address = address.replace('0x','');
    let addressHash = this.sha3(address.toLowerCase());

    for (let i = 0; i < 40; i++ ) {
      // The nth letter should be uppercase if the nth digit of casemap is 1
      if ((parseInt(addressHash[i], 16) > 7
        && address[i].toUpperCase() !== address[i])
        || (parseInt(addressHash[i], 16) <= 7
        && address[i].toLowerCase() !== address[i])
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Decodes the private key to get the address.
   *
   * @param {String} privateKey
   *
   * @return {Object}
   */
  async loadFromPrivateKey(privateKey) {
    this.logger.log('[ETH]', 'Unlocking wallet...');

    if (privateKey.indexOf('0x') !== 0) {
      privateKey = `0x${privateKey}`;
    }

    // unlock the wallet
    const unlockedWallet = new ethers.Wallet(privateKey, this.provider);

    this.logger.log('[ETH]', 'Wallet unlocked');

    return {
      address: unlockedWallet.address,
      key: unlockedWallet.privateKey,
      public: unlockedWallet.publicKey
    };
  }

  /**
   * Get the nonce of a given wallet.
   *
   * @param {String} key
   *
   * @return {Integer}
   */
  async nonce(key) {
    // check if if the private key given has `0x` as prefix
    if (key.indexOf('0x') !== 0) {
      key = `0x${key}`;
    }

    // unlock the wallet
    let wallet = new ethers.Wallet(key, this.provider);

    return await wallet.getTransactionCount();
  }

  /**
   * SHA3 Hasher
   *
   * @param {String} value
   *
   * @return {String}
   */
  sha3(value) {
    return SHA3(value, {
      outputLength: 256
    }).toString();
  }

  /**
   * Signs a transaction for an Ethereum wallet.
   *
   * @param {Object} data
   *
   * @return {String}
   */
  async signTransaction(data = {}) {
    // key
    if (!data.key || validator.isEmpty(String(data.key))) {
      throw Exception.for('Private key is required.');
    }

    // to
    if (!data.to || validator.isEmpty(String(data.to))) {
      throw Exception.for('Recipient is required.');
    }

    // fix the recipient address
    if (data.to.indexOf('0x') !== 0) {
      data.to = `0x${data.to}`;
    }

    const nonce = this.nonce(data.key);

    // build the transaction data
    let transactionData = {
      data: (data.data) ? data.data : '',
      gasLimit: ethers.utils.bigNumberify(data.gas_limit || '21000').toHexString(),
      gasPrice: ethers.utils.bigNumberify(data.gas_price || '1000000000').toHexString(),
      nonce: nonce,
      to: data.to,
      value: ethers.utils.bigNumberify(data.value).toHexString()
    };

    // check if if the private key given has `0x` as prefix
    if (data.key.indexOf('0x') !== 0) {
      data.key = `0x${data.key}`;
    }

    // unlock the wallet
    let wallet = new ethers.Wallet(data.key, this.provider);

    // sign it
    return wallet.sign(transactionData);
  }
}
