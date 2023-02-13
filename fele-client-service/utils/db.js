const NodeCouchDb = require('node-couchdb');
const { couchdb } = require('../../conf/feleConf.json')

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
    couch.insert(databaseName, documentToBeInserted);
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
    getDocumentFromDatabase
}