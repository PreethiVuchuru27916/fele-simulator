const NodeCouchDb = require('node-couchdb');
const { couchdb } = require('../../conf/feleConf')
const logger = require('./logger')

const couch = new NodeCouchDb({
    auth: {
        user: couchdb.username,
        pass: couchdb.password
    }
});

const createDatabase = async(databaseName) => {
    console.log(databaseName)
    return couch.createDatabase(databaseName).then(() => {
        return true
    }, err => {
        console.log(err)
        return false
    });
}

const deleteDatabase = async(databaseName) => {
    return couch.dropDatabase(databaseName).then(() => {
        return true
    }, err => {
        return false
    });
}

const insertToDatabase = async(databaseName, documentToBeInserted) => {
    try{
        const { data } = await couch.insert(databaseName, documentToBeInserted)
        return data.id

    } catch(error) {
        logger.error("Error inserting data: ", error)
        return false
    }
}

const checkIfNetworkExists = async (databaseName) => {
    logger.info(`checking if ${databaseName} Network exists....`)
    const dbs = await couch.listDatabases()
    for(let i =0; i<dbs.length; i++) {
        if(dbs[i] === databaseName) {
            logger.info(`${databaseName} newtwork found in DB.`)
            return true
        }
    }
    logger.info(`${databaseName} newtwork not found in DB.`)
    return false
}

/**
 * @param {String} databaseName 
 * @param {Object} updatedDocument Should contain both "_id" and "_rev" fields
 * @retrun {Object} 
 */
const updateDocument = async (databaseName, updatedDocument) => {
    try{
        const update = await couch.update(databaseName, updatedDocument)
        return {
            error: false,
            update
        }
    } catch(err) {
        logger.error("Update failed: ", err)
        return {
            error: true,
            shortMessage: "Update failed",
            errorMessage: err
        }
    }
}

const getDocumentFromDatabase = async(databaseName, selector) => {
    try{
        const data = await couch.mango(databaseName, selector)
        console.log("data: ", data)
        return data
    }
    catch(err) {
        logger.error(err)
        return false
    }
}
 
module.exports = {
    createDatabase,
    deleteDatabase,
    insertToDatabase,
    checkIfNetworkExists,
    getDocumentFromDatabase
}