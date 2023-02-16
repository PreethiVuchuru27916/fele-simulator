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
    logger.info(`checking if ${databaseName} DB exists....`)
    const dbs = await couch.listDatabases()
    for(let i =0; i<dbs.length; i++) {
        if(dbs[i] === databaseName) {
            return true
        }
    }
    return false
}


const getDocumentFromDatabase = async(databaseName, documentToBeSearched) => {
    return couch.get(databaseName, documentToBeSearched).then(({data, headers, status}) => {
        return data
    }, err => {
        logger.error("Error retrieving document from database: ", err)
        return null
    });
}
 
module.exports = {
    createDatabase,
    deleteDatabase,
    insertToDatabase,
    checkIfNetworkExists,
    getDocumentFromDatabase
}