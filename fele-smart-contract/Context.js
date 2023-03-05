const { getDocumentByID, insertToDatabase } = require("../fele-client-service/utils/db");

class Context {
  #databaseName = 'fele__artemis';

  constructor() {
    // TODO
  }
  async getState(key) {
    const databaseName = this.#databaseName;
    try {
      const result = await getDocumentByID(databaseName, key);
      return result;
    } catch(error) {
      throw new Error(error);
    }
  }
  async putState(key, value) {
    const databaseName = this.#databaseName;
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