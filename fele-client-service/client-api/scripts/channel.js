const { checkIfNetworkExists, insertToDatabase, getDocumentFromDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const { v4 : uuidv4 } = require('uuid')
const constants = require('../../utils/constants')
const logger = require('../../utils/logger');

const createChannel = async (networkName,  channelConfig) => {
    const channelName = channelConfig.channelName
    const database = constants.DB_PREFIX+networkName;
    const timestamp = new Date().toISOString()
    channelConfig = {
        _id: constants.CHANNEL_ID_PREFIX+uuidv4(),
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
                var dir = "../../../chaincode/"+networkName+"/"+ channelName
                dir = path.join(__dirname, dir)
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

module.exports = {
    createChannel
}