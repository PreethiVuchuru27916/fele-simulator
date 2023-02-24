const { checkIfNetworkExists, insertToDatabase, getDocumentFromDatabase, deleteDocument } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const { v4 : uuidv4 } = require('uuid')
const logger = require('../../utils/logger');
const {CHANNEL_ID_PREFIX, DB_PREFIX} = require('../../utils/constants')
const {NETWORK_BASEPATH} = require('../../../globals')

const createChannel = async (networkName,  channelConfig) => {
    const channelName = channelConfig.channelName
    const database = DB_PREFIX+networkName;
    const timestamp = new Date().toISOString()
    channelConfig = {
        _id: CHANNEL_ID_PREFIX+uuidv4(),
        fmt: "Channel",
        created_at: timestamp,
        updated_at: timestamp,
        ...channelConfig
    }
    try{
        //Checking if Network exists
        const dbStatus = await checkIfNetworkExists(database)
        if(dbStatus) {
            //Checking if there is an existing channel with the specified name
            const {data} = await getDocumentFromDatabase(database, {
                selector: {
                    channelName: {
                        $eq: channelName
                    }
                }
            })
            if(data.docs.length > 0) {
                return {
                    error: true,
                    errorMessage: `Document insert conflict: Channel with name ${channelName} already exists`,
                }
            }
            // Creating the new channel
            const channelId = await insertToDatabase(database, channelConfig);

            if(channelId) {
                logger.info(`channel with _id: ${channelId} created successfully in ${database} Network`)
                dir = path.join(NETWORK_BASEPATH, networkName, channelName)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
                return {
                    success: true,
                    channelId,
                    channelName,
                    message: "Channel created successfully"
                }
            }
        }
    } catch(err) {
        logger.error(err)
        return {
            error: true,
            errorMessage: `Error creating channel`
        }
    }
    return {
        error: true,
        shortMessage: `Error creating channel`,
    }
}


const deleteChannel = async (networkName, channelName) => {
    networkName = DB_PREFIX+networkName
    const dbStatus = await checkIfNetworkExists(networkName)
    if(dbStatus) {
        const {data} = await getDocumentFromDatabase(networkName, {
            selector: {
                channelName: {
                    $eq: channelName
                }
            }
        })

        if(data.docs.length > 0) {
            const {_id, _rev} = data.docs[0]
            const status = await deleteDocument(networkName, _id, _rev)
            if(status) {
                return {
                    success: true,
                    message: "Channel deleted successfully"
                }
            }
        }
        return {
            error: true,
            errorMessage: `Error deleting the channel`
        }

    }
    return {
        error: true,
        errorMessage: `Network not found`
    }
}

module.exports = {
    createChannel,
    deleteChannel
}