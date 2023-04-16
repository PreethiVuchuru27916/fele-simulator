const logger = require('../../utils/logger');
const { checkIfDatabaseExists, getDocumentFromDatabase, deleteDocument, insertToDatabase} = require('../../utils/db')
const { NETWORK_PREFIX, ORG_FMT, ORG_ID_PREFIX } = require('../../utils/constants')
const { v4: uuidv4 } = require('uuid')

const createFeleOrg = async(network, organization) => {
    try{
        const database = NETWORK_PREFIX + network;
        const dbStatus = await checkIfDatabaseExists(database)
        if (dbStatus) {
            let {docs} = await getDocumentFromDatabase(database, {
                selector: {
                    organization: {
                        $eq: organization
                    }
                }
            })
            if(docs.length == 0){
                const timestamp = new Date().toISOString()
                const organizationConfig = {
                    _id: ORG_ID_PREFIX + uuidv4(),
                    fmt: ORG_FMT,
                    created_at: timestamp,
                    updated_at: timestamp,
                    network,
                    [ORG_FMT]: organization,
                    feleUsers:[]
                }
                await insertToDatabase(database, organizationConfig)
                console.log(`Fele Organization ${organization} created successfully`)
                return;
            }
            else{
                throw new Error(`Fele Organization ${organization} already exists.`)
            }
        }
        else{
            throw new Error(`Network ${network} does not exist.`)
        }
    }catch(e){
        logger.error(e)
    }
}

const deleteFeleOrg = async(network, organization) => {
    try{
        const database = NETWORK_PREFIX + network;
        const dbStatus = await checkIfDatabaseExists(database)
        if (dbStatus) {
            let {docs} = await getDocumentFromDatabase(database, {
                selector: {
                    organization: {
                        $eq: organization
                    }
                }
            })
            if(docs.length > 0){
                const { _id, _rev } = docs[0]
                await deleteDocument(database, _id, _rev)
                console.log(`Fele Organization ${organization} deleted successfully`)
                return;
            }
            else{
                throw new Error(`Fele Organization ${organization} does not exists.`)
            }
        }
        else{
            throw new Error(`Network ${network} does not exist.`)
        }
    }catch(e){
        logger.error(e)
    }
}

module.exports = {
    createFeleOrg,
    deleteFeleOrg
}