const { Context } = require("./Context");

class SmartContract {
  static ctx = new Context();
  
  constructor() {
    
  }

  static getState(key) {
    return this.ctx.getState(key);
  }

  static putState(key, value) {
    return this.ctx.putState(key, value);
  }

  static deleteState(key) {
    return this.ctx.deleteState(key);
  }

  static getQueryByResult(query) {
    return this.ctx.getQueryByResult(query);
  }
}

module.exports = {
    SmartContract
}
