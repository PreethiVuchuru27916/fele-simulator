const { Context } = require("./Context");

class SmartContract {
  static ctx = new Context();
  
  constructor() {
    
  }

  static getState(key, network) {
    return this.ctx.getState(key, network);
  }

  static putState(key, value, network) {
    return this.ctx.putState(key, value, network);
  }

  static deleteState(key, network) {
    return this.ctx.deleteState(key, network);
  }

  static getQueryByResult(query) {
    return this.ctx.getQueryByResult(query);
  }
}

module.exports = {
    SmartContract
}
