const { Context } = require("./Context");

class SmartContract extends Context {
  static ctx = new Context();
  
  constructor() {
    super();
  }

  static getState(key) {
    const value = this.ctx.getState(key);
    if (value) return value
    return null;
  }

  static putState(key, value) {
    return this.ctx.putState(key, value);
  }
}

module.exports = {
    SmartContract
}
