const fs = require('fs');
const path = require("path");
const logger = require('../../utils/logger');
const {NETWORK_BASEPATH,USER_WORKSPACE} = require('../../../globals')
const { checkIfDatabaseExists, getDocumentFromDatabase} = require('../../utils/db')
const { NETWORK_PREFIX } = require('../../utils/constants')
const { getChannelSelector, copyFolderSync } = require('../../utils/helpers');
const { Context } = require('../../../fele-smart-contract/Context');


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

async function invokeChaincode(networkName, channelName, invokerName, chaincodeName, argumentJSON) {
    console.log("argumentJson"+JSON.stringify(argumentJSON));
    const ctx = new Context();
    ctx.initState(networkName, channelName, invokerName);
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
                try{
                    const txnResult = await chClass[functionToCall](...functionArgs, networkName)
                    console.log(txnResult)
                    logger.info("Transaction successful");
                    return txnResult
                }
                catch(err){
                    console.log(err);
                    logger.error(err);
                    throw new Error(err.message)
                }
            }
            catch(err){
                console.log(err);
                logger.error(chaincodeName + " does not exist.");
                throw new Error(chaincodeName + " does not exist.")
            }
        }
        else{
            logger.error("Channel \""+channelName+"\" not found in "+networkName);
            throw new Error("Channel " + channelName +  " not found in " + networkName)
        }
    }
}

module.exports = {
  createChaincode,
  invokeChaincode
}