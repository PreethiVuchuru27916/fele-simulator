const { checkIfDatabaseExists, insertToDatabase, getDocumentFromDatabase, deleteDocument } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid')
const logger = require('../../utils/logger');
const { CHANNEL_ID_PREFIX, NETWORK_PREFIX } = require('../../utils/constants')
const { NETWORK_BASEPATH } = require('../../../globals')
const { getChannelSelector } = require('../../utils/helpers')

const createChannel = async (networkName, channelConfig) => {
    const channelName = channelConfig.channelName
    const database = NETWORK_PREFIX + networkName;
    const timestamp = new Date().toISOString()
    channelConfig = {
        _id: CHANNEL_ID_PREFIX + uuidv4(),
        fmt: "Channel",
        created_at: timestamp,
        updated_at: timestamp,
        ...channelConfig
    }

    const dbStatus = await checkIfDatabaseExists(database)
    if (dbStatus) {
        const { docs } = await getDocumentFromDatabase(database, getChannelSelector(channelName))
        if (docs.length > 0) {
            const errorMsg = `Document insert conflict: Channel with name ${channelName} already exists`
            logger.error(errorMsg)
            throw new Error(errorMsg)
        }

        const channelId = await insertToDatabase(database, channelConfig);
        logger.info(`channel with _id: ${channelId} created successfully in ${database} Network`)

        dir = path.join(NETWORK_BASEPATH, networkName, channelName)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        return {
            channelId,
            channelName,
            message: "Channel created successfully"
        }
    } else {
        const errorMsg = `Network ${networkName} not found`
        logger.error(errorMsg)
        throw new Error(errorMsg)
    }
}


const deleteChannel = async (networkName, channelName) => {
    networkName = NETWORK_PREFIX + networkName
    const dbStatus = await checkIfDatabaseExists(networkName)
    if (dbStatus) {
        const { docs } = await getDocumentFromDatabase(networkName, getChannelSelector(channelName))

        if (docs.length > 0) {
            const { _id, _rev } = docs[0]
            await deleteDocument(networkName, _id, _rev)
            return {
                message: "Channel deleted successfully"
            }
        }
        throw new Error(`Channel with name ${channelName} not found`)
    }
    throw new Error(`Network ${networkName} not found`)
}

module.exports = {
    createChannel,
    deleteChannel
}