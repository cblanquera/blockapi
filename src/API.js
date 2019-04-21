class API {
  /**
   * Easily access configuration paths without
   * hardcoding those in other classes
   *
   * @param {String} path
   * @param {String} [key]
   *
   * @return {*}
   */
  config(path, key) {
    const config = require('../../config/' + path);
    if (key && config[key]) {
        return config[key];
    }

    return config;
  }
}

export default new API();
