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
}

module.exports = {
    SmartContract
}
