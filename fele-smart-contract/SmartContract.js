const { Context } = require("./Context");

class SmartContract extends Context {
  ctx = null;

  constructor() {
    super()
    this.ctx = new Context();
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
