const NodeCouchDb = require('node-couchdb');
const { couchdb } = require('../../conf/feleConf')
const logger = require('./logger')

const couch = new NodeCouchDb({
    auth: {
        user: couchdb.username,
        pass: couchdb.password
    }
});

const createDatabase = async (databaseName) => {
    try{
        return await couch.createDatabase(databaseName)
    } catch(e) {
        logger.error(e)
        throw new Error(`Error creating database ${databaseName}`)
    }
}

const deleteDatabase = async (databaseName) => {
    try {
        await couch.dropDatabase(databaseName)
        logger.info(`${databaseName} deleted successfully`)
    } catch (e) {
        logger.error(e)
        throw new Error(`Error deleting database ${databaseName}`)
    }
}

const insertToDatabase = async (databaseName, documentToBeInserted) => {
    try {
        const { data } = await couch.insert(databaseName, documentToBeInserted)
        return data.id
    } catch (e) {
        logger.error(e)
        throw new Error(`Error inserting document to ${databaseName}`)
    }
}

const checkIfDatabaseExists = async (databaseName) => {
    try {
        const dbs = await couch.listDatabases()
        for (let i = 0; i < dbs.length; i++) {
            if (dbs[i] === databaseName) {
                logger.info(`${databaseName} database found.`)
                return true
            }
        }
        logger.info(`${databaseName} database not found`)
        return false
    } catch (e) {
        logger.error(e)
        throw new Error(`Error listing databases`)
    }
}

const getDocumentByID = async (databaseName, documentId) => {
    try {
        const { data } = await couch.get(databaseName, documentId);
        return data;
    }
    catch (e) {
        logger.error(e)
    }
}

/**
 * @param {String} databaseName 
 * @param {Object} updatedDocument Should contain both "_id" and "_rev" fields
 * @retrun {Object} 
 */
const updateDocument = async (databaseName, updatedDocument) => {
    try {
        console.log(updatedDocument)
        const update = await couch.update(databaseName, updatedDocument)
        return update
    } catch (e) {
        logger.error(e)
        throw new Error(`Error updating the document`)
    }
}

const getDocumentFromDatabase = async (databaseName, selector) => {
    try {
        const { data } = await couch.mango(databaseName, selector)
        return data
    }
    catch (e) {
        logger.error(e)
        throw new Error(`Error retrieving data from ${databaseName}`)
    }
}

const deleteDocument = async (databaseName, _id, _rev) => {
    try {
        await couch.del(databaseName, _id, _rev)
        return true
    }
    catch (err) {
        logger.error(e)
        throw new Error(`Error deleting the document with id ${_id}`)
    }
}

module.exports = {
    createDatabase,
    deleteDatabase,
    insertToDatabase,
    checkIfDatabaseExists,
    getDocumentFromDatabase,
    deleteDocument,
    getDocumentByID,
    updateDocument
}