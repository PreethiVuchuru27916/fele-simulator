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
    try{
        const { data } = await couch.insert(databaseName, documentToBeInserted)
        console.info("Channel created successfully!")
        return data.id

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


const getDocumentFromDatabase = async(databaseName, documentToBeSearched) => {
    return couch.get(databaseName, documentToBeSearched).then(({data, headers, status}) => {
        return data
    }, err => {
        //console.log(err)
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