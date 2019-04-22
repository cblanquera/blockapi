import Bitcoin from './services/Bitcoin';
import Ethereum from './services/Ethereum';
import Litecoin from './services/Litecoin';
import NEM from './services/NEM';
import Stellar from './services/Stellar';
import Exception from './Exception';

export default class Service {
  /**
   * Static loader
   *
   * @param {String} type
   *
   * @return {Class|Exception}
   */
  static load(type) {
    switch (type.toLowerCase()) {
      case 'btc':
      case 'bitcoin':
        return new Bitcoin();
        break;
      case 'eth':
      case 'ethereum':
        return new Ethereum();
        break;
      case 'ltc':
      case 'litecoin':
        return new Litecoin();
        break;
      case 'xem':
      case 'nem':
        return new NEM();
        break;
      case 'xlm':
      case 'stellar':
        return new Stellar();
        break;
      default:
        throw Exception.forNotFound('currency', type);
        break;
    }
  }
}
