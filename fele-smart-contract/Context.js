const { NETWORK_PREFIX } = require("../fele-client-service/utils/constants");
const { getDocumentByID, insertToDatabase, deleteDocument, updateDocument, getDocumentFromDatabase } = require("../fele-client-service/utils/db");

class Context {
  static globalState = {
    networkName: '',
    channelName: '',
    invokerName: ''
  };

  constructor() {
    console.log("Constructor state", Context.globalState);
  }

  initState(networkName, channelName, invokerName) {
    Context.globalState = { networkName, channelName, invokerName };
    console.log("Static Global State", Context.globalState);
  }
  
  async getState(key) {
    const databaseName = NETWORK_PREFIX + Context.globalState.networkName;
    try {
      const result = await getDocumentByID(databaseName, key);
      if (result) return result;
      return null;
    } catch(error) {
      throw new Error(error);
    }
  }

  async putState(key, value) {
    const { networkName, channelName, invokerName } = Context.globalState
    console.log("value inside putstate"+value)

    const databaseName = NETWORK_PREFIX + Context.globalState.networkName;
    try {
      value.channelName = Context.globalState.channelName
      value.invokerName = Context.globalState.invokerName
      value.fmt = "Asset"
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

  async deleteState(key) {
    const databaseName = NETWORK_PREFIX + Context.globalState.networkName;
    try {
      const result = await getDocumentByID(databaseName, key);
      if (result) return deleteDocument(databaseName, key, result._rev)
      return null;
    } catch(error) {
      throw new Error(error);
    }
  }

  async getQueryByResult(query) {
    const databaseName = NETWORK_PREFIX + Context.globalState.networkName;
    
    try{
      const result = getDocumentFromDatabase(databaseName, query)
      return result
    } catch(error) {
      throw new Error(error);
    }
  }

}

module.exports = {
  Context
}