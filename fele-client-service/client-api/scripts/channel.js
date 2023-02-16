const { checkIfNetworkExists, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const constants = require('../../utils/constants')
const logger = require('../../utils/logger')

const createChannel = async (networkName, channelName, channelConfigJSON) => {
    const database = constants.DB_PREFIX+networkName;
    try{
        const dbStatus = await checkIfNetworkExists(database)
        if(dbStatus) {
            logger.info(`${database} Network found...`)
            const channelId = await insertToDatabase(database, channelConfigJSON);
            if(channelId) {
                logger.info(`channel with _id: ${channelId} created successfully in ${database} Network`)
                var dir = "../../../chaincode/"+networkName+"/"+ channelName
                dir = path.join(__dirname, dir)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
                return channelId
            }
        }
    } catch(error) {
        logger.error(error)
        return false
    }
    return false
}

module.exports = {
    createChannel
}