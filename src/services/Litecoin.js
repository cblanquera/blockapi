import isaac from 'isaac';
import validator from 'validator';

import BN from 'bignumber.js';
import CryptoJS from 'crypto-js';
import bitcoin from 'bitcoinjs-lib';

import Exception from '../Exception';
import LiteCore from '../resources/LiteCore';
import BlockchainInterface from '../contracts/BlockchainInterface';

/**
 * Blockchain Litecoin Class
 */
export default class Litecoin extends BlockchainInterface {
  /**
   * Blockchain Litecoin Class Constructor
   */
  constructor(live = false, logger = console) {
    super();

    this.live = live;
    this.logger = logger;

    // setup the btc network
    this.network = {};
    if (!live) {
      this.network = {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
          public: 0x043587cf,
          private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4, //  for segwit (start with 2)
        wif: 0xef
      };
    }
  }

  /**
   * Generates a wallet
   *
   * @return {Object}
   */
  async generate() {
    this.logger.log('[LTC]', 'Generating wallet...');

    const keyPair = bitcoin.ECPair.makeRandom({
      network: this.network,
      rng: this._rng
    });

    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: this.network
    });

    this.logger.log('[LTC]', 'Wallet generated "' + address + '"');

    return {
      address,
      key: keyPair.toWIF(),
      mnemonic: '',
      public: keyPair.publicKey.toString('hex')
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
    this.logger.log('[Litecoin]', 'Fetching info...');

    const resource = LiteCore.load(this.live);
    const results = await resource.getInfo(address);

    return String(results.balanceSat);
  }

  /**
   * Get Balance
   *
   * @param {String} address
   *
   * @return {String}
   */
  async getHistory(address) {
    this.logger.log('[BTC]', 'Fetching info...');

    const resource = LiteCore.load(this.live);
    const results = await resource.getUtxo(address);

    return results;
  }

  /**
   * Decodes the private key to get the address.
   *
   * @param {String} privateKey
   *
   * @return {Object}
   */
  async loadFromPrivateKey(privateKey) {
    this.logger.log('[LTC]', 'Unlocking wallet...');

    const keyPair = bitcoin.ECPair.fromWIF(privateKey, this.network);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: this.network
    });

    this.logger.log('[LTC]', 'Wallet unlocked');

    return {
      address,
      key: keyPair.toWIF(),
      mnemonic: '',
      public: keyPair.publicKey.toString('hex')
    };
  }

  /**
   * Signs a transaction for a Litecoin wallet.
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

    this.logger.log('[LTC]', 'Unlocking wallet.');

    let ltcKeyPair = bitcoin.ECPair.fromWIF(data.key, this.network);

    // get the public address
    const hash = bitcoin.payments.p2pkh({
      pubkey: ltcKeyPair.publicKey,
      network: this.network
    });

    this.logger.log('[LTC]', 'Fetching UTXOs...');

    const resource = LiteCore.load(this.live);
    let utxos = await resource.getUtxo(hash.address);

    this.logger.log('[LTC]', 'Building transaction...');

    // set the key pair again
    ltcKeyPair = bitcoin.ECPair.fromWIF(data.key, this.network);

    // get the public address
    const { address } = bitcoin.payments.p2pkh({
      pubkey: ltcKeyPair.publicKey,
      network: this.network
    });

    // initialize the transaction builder
    let txBuilder = new bitcoin.TransactionBuilder(this.network);

    // set unspent amount
    let unspentAmount = 0;

    // loop the utxos
    for (let tx of utxos) {
      // check the confirmation
      if (tx.confirmations < 1) {
        // proceed
        continue;
      }

      // set the input
      txBuilder.addInput(tx.txid, tx.vout);

      unspentAmount += tx.satoshis;
    }

    // set output
    txBuilder.addOutput(data.to, parseInt(data.value));

    // perform some computations
    if (parseInt(data.value) + parseInt(data.fees) < unspentAmount) {
      // sending less than we have, so the rest should go back
      txBuilder.addOutput(
        address,
        parseInt(unspentAmount) - parseInt(data.value) - parseInt(data.fees)
      );
    }

    for (let t = 0; t < utxos.length; t++) {
      // check the confirmation
      if (utxos[t].confirmations < 1) {
        // proceed
        continue;
      }

      txBuilder.sign(t, ltcKeyPair);
    }

    return txBuilder.build().toHex();
  }

  /**
   * RNG Functionality to make the address a little bit random
   * Reference: https://github.com/Overtorment/BlueWallet/blob/b9ec7ac420f56454bf517e61e555c2b8e1768324/class/legacy-wallet.js#L49
   *
   * @param {Integer} c
   *
   * @return {Object}
   */
  _rng(c) {
    let buf = Buffer.alloc(c);
    let totalhex = '';
    for (let i = 0; i < c; i++) {
      let randomNumber = isaac.random();
      randomNumber = Math.floor(randomNumber * 256);

      let n = new BN(randomNumber);
      let hex = n.toString(16);
      if (hex.length === 1) {
        hex = '0' + hex;
      }

      totalhex += hex;
    }

    totalhex = bitcoin.crypto.sha256('oh hai!' + totalhex).toString('hex');
    totalhex = bitcoin.crypto.sha256(totalhex).toString('hex');
    buf.fill(totalhex, 0, 'hex');
    return buf;
  }
}
