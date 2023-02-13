const NodeCouchDb = require('node-couchdb');
const { couchdb } = require('../../conf/feleConf')

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
    console.log("Inserttodatabase called!")
    try{

        const channelId = await couch.insert(databaseName, documentToBeInserted)
        console.info("Channel created successfully!")
        return channelId

    } catch(error) {
        console.err("Error inserting data: ", error)
            return false
    }
}

const checkIfNetworkExists = async (databaseName) => {
    console.info(`checking if ${databaseName} DB exists....`)
    const dbs = await couch.listDatabases()
    for(let i =0; i<dbs.length; i++) {
        if(dbs[i] === databaseName) {
            return true
        }
    }
    return false
}

module.exports = {
    createDatabase,
    deleteDatabase,
    insertToDatabase,
    checkIfNetworkExists
}