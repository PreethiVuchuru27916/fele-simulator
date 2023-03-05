const { Context } = require("./Context");

class SmartContract extends Context {
  ctx = null;

  constructor() {
    this.ctx = new Context();
  }

  getState(key) {
    return this.ctx.getState(key);
  }

  putState(key, value) {
    return this.ctx.putState(key, value);
  }
}

module.exports = {
    SmartContract
}
