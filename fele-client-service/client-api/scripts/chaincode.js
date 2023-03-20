const fs = require('fs');
const path = require("path");
const logger = require('../../utils/logger');
const {NETWORK_BASEPATH,USER_WORKSPACE} = require('../../../globals')
const { checkIfDatabaseExists, getDocumentFromDatabase} = require('../../utils/db')
const { NETWORK_PREFIX } = require('../../utils/constants')
const { getChannelSelector, copyFolderSync } = require('../../utils/helpers')


async function createChaincode(networkName, channelName, chaincodeName) {

    const database = NETWORK_PREFIX + networkName;
    const dbStatus = await checkIfDatabaseExists(database)
    if (dbStatus) {
        const { docs } = await getDocumentFromDatabase(database, getChannelSelector(channelName))
        if (docs.length > 0) {
            const chaincodePath = path.join(NETWORK_BASEPATH, networkName, channelName, chaincodeName)
            try {
                if (!fs.existsSync(chaincodePath)) {
                    copyFolderSync(USER_WORKSPACE+'/'+chaincodeName, NETWORK_BASEPATH+'/'+networkName+'/'+channelName+'/'+chaincodeName, {recursive: true})
                } else {
                    console.log('Directory already exists.')
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else{
            logger.error("Channel \""+channelName+"\" not found in "+networkName);
        }
    } 
}

async function invokeChaincode(networkName, channelName, chaincodeName, argumentJSON) {

    // console.log("Argument json", argumentJSON, typeof argumentJSON);

    const database = NETWORK_PREFIX + networkName;
    const dbStatus = await checkIfDatabaseExists(database)
    if (dbStatus) {
        const { docs } = await getDocumentFromDatabase(database, getChannelSelector(channelName))
        if (docs.length > 0) {
            try{
                const chcode = require(NETWORK_BASEPATH+'/'+networkName+'/'+channelName+'/'+chaincodeName+'/index');
                const chClass = new chcode[chaincodeName]();
                const functionToCall = argumentJSON.Args[0];
                const functionArgs = argumentJSON.Args.slice(1);
                console.log("function args"+functionArgs) 
                try{
                    const txnResult = await chClass[functionToCall](...functionArgs)
                    console.log(txnResult)
                    logger.info("Transaction successful");
                }
                catch(err){
                    logger.error(err);
                }
            }
            catch(err){
                logger.error(chaincodeName + " does not exist.");
            }
        }
        else{
            logger.error("Channel \""+channelName+"\" not found in "+networkName);
        }
    }
}

module.exports = {
  createChaincode,
  invokeChaincode
}