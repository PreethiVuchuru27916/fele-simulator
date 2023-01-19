const NodeCouchDb = require('node-couchdb');
const { couchdb } = require('../../conf/feleConf.json')

const couch = new NodeCouchDb({
    auth: {
        user: couchdb.username,
        pass: couchdb.password
    }
});

const getState = async(databaseName, document_id) => {
    return couch.get(databaseName, document_id).then(({data, headers, status}) => {
        return JSON.stringify(data)
    }, err => {
        return "error"
    });
}

const putState = async(databaseName, documentToBeInserted) => {
    return couch.insert(databaseName, documentToBeInserted).then(({data, headers, status}) => {
        return true
    }, err => {
        console.log(err)
        return false
    });
}

module.exports = {
    getState,
    putState
}

