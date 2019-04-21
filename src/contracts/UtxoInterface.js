import Exception from '../Exception';

export default class UtxoInterface {
    async getUtxo(address) {
        throw Exception.forUndefinedAbstract('getUtxo');
    }
}
