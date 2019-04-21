import Exception from '../Exception';

/**
 * Blockchain contract
 */
export default class BlockchainInterface {
  /**
   * Generates a wallet
   *
   * @return BlockchainInterface
   */
  async generate() {
    throw Exception.forUndefinedAbstract('generate');
  }

  /**
   * Fetches the balance of the address.
   *
   * @return BlockchainInterface
   */
  async getBalance() {
    throw Exception.forUndefinedAbstract('getBalance');
  }

  /**
   * Decodes the private key to get the address.
   *
   * @return BlockchainInterface
   */
  async loadFromPrivateKey(privateKey) {
    throw Exception.forUndefinedAbstract('loadFromPrivateKey');
  }

  /**
   * Signs a transaction for a Crypto wallet.
   *
   * @return BlockchainInterface
   */
  async signTransaction(data = {}) {
    throw Exception.forUndefinedAbstract('signTransaction');
  }
}
