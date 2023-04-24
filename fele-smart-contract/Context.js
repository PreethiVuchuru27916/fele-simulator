const { NETWORK_PREFIX } = require("../fele-client-service/utils/constants");
const { getDocumentByID, insertToDatabase, deleteDocument, updateDocument } = require("../fele-client-service/utils/db");

class Context {
  #globalState = {
    networkName: '',
    channelName: ''
  };

  constructor() {
    this.#globalState = {
      networkName: '',
      channelName: '',
      invokerName: ''
    };
  }
  
  async getState(key, network) {
    this.#globalState.networkName = network
    const databaseName = NETWORK_PREFIX + this.#globalState.networkName;
    try {
      const result = await getDocumentByID(databaseName, key);
      if (result) return result;
      return null;
    } catch(error) {
      throw new Error(error);
    }
  }

  async putState(key, value, network) {
    this.#globalState.networkName = network
    const databaseName = NETWORK_PREFIX + this.#globalState.networkName;
    try {
      const document = { ...value, _id: key };
      const assetExists = await getDocumentByID(databaseName, key);
      if (assetExists) {
        document._rev = assetExists._rev;
        return await updateDocument(databaseName, document);
      }
      return await insertToDatabase(databaseName, document);
    } catch(error) {
      throw new Error(error);
    }
  }

  async deleteState(key, network) {
    this.#globalState.networkName = network
    const databaseName = NETWORK_PREFIX + this.#globalState.networkName;
    try {
      const result = await getDocumentByID(databaseName, key);
      if (result) return deleteDocument(databaseName, key, result._rev)
      return null;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = {
  Context
}