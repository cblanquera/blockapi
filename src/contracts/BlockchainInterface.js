import BlockchainException from '../BlockchainException';

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
    throw BlockchainException.forUndefinedAbstract('generate');
  }

  /**
   * Fetches the balance of the address.
   *
   * @return BlockchainInterface
   */
  async getBalance() {
    throw BlockchainException.forUndefinedAbstract('getBalance');
  }

  /**
   * Decodes the private key to get the address.
   *
   * @return BlockchainInterface
   */
  async loadFromPrivateKey(privateKey) {
    throw BlockchainException.forUndefinedAbstract('loadFromPrivateKey');
  }

  /**
   * Signs a transaction for a Crypto wallet.
   *
   * @return BlockchainInterface
   */
  async signTransaction(data = {}) {
    throw BlockchainException.forUndefinedAbstract('signTransaction');
  }
}
