const { checkIfNetworkExists, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const constants = require('../../utils/constants')

const createChannel = async (networkName, channelName, channelConfigJSON) => {
    const database = constants.DB_PREFIX+networkName;
    try{
        const dbStatus = await checkIfNetworkExists(database)
        if(dbStatus) {
            const channelId = await insertToDatabase(database, channelConfigJSON);
            if(channelId) {
                var dir = "../../../chaincode/"+networkName+"/"+ channelName
                dir = path.join(__dirname, dir)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
                return channelId
            }
        }
    } catch(error) {
        return false
    }
    return false
}

module.exports = {
    createChannel
}