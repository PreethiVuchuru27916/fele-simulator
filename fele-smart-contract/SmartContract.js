const { Context } = require("./Context");

class SmartContract extends Context {
  static ctx = new Context();
  
  constructor() {
    super();
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
