const logger = require('../../utils/logger');
const { createChaincode, invokeChaincode} = require('../../client-api/scripts/chaincode')

async function createChaincodeCLI(networkName, channelName, chaincodeName) {
  try {
    await createChaincode(networkName, channelName, chaincodeName);
  } 
  catch (err) {
    logger.error(err);
  }
}

async function invokeChaincodeCLI(networkName, channelName, invokerName, chaincodeName, argumentJSON) {
  try{
    await invokeChaincode(networkName, channelName, invokerName, chaincodeName, argumentJSON);
  }
  catch(err){
    logger.error(err);
  }
}

module.exports = {
  createChaincodeCLI,
  invokeChaincodeCLI
}