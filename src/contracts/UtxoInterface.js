import BlockchainException from '../BlockchainException';

export default class UtxoInterface {
    async getUtxo(address) {
        throw BlockchainException.forUndefinedAbstract('getUtxo');
    }
}
