const { NETWORK_PREFIX } = require("../fele-client-service/utils/constants");
const { getDocumentByID, insertToDatabase } = require("../fele-client-service/utils/db");

class Context {
  #globalState = {
    networkName: '',
    channelName: ''
  };

  constructor() {
    this.#globalState = {
      networkName: 'artemis',
      channelName: ''
    };
  }
  
  async getState(key) {
    const databaseName = NETWORK_PREFIX + this.#globalState.networkName;
    try {
      const result = await getDocumentByID(databaseName, key);
      return result;
    } catch(error) {
      throw new Error(error);
    }
  }

  async putState(key, value) {
    const databaseName = NETWORK_PREFIX + this.#globalState.networkName;
    try {
      const document = { ...value, _id: key };
      const result = await insertToDatabase(databaseName, document);
      return result;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = {
  Context
}