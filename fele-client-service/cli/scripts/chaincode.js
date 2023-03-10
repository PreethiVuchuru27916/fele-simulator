const fs = require('fs');
const path = require("path");
const logger = require('../../utils/logger');
const {NETWORK_BASEPATH} = require('../../../globals')

function createChaincodeCLI(networkName, channelName, chaincodeName) {

  const chaincodePath = path.join(NETWORK_BASEPATH, networkName, channelName, chaincodeName)
  try {
      if (!fs.existsSync(__dirname, chaincodePath)) {
        fs.mkdirSync(__dirname, chaincodePath)
        console.log('Directory created.')
      } else {
        console.log('Directory already exists.')
      }
  } catch (err) {
    console.log(err)
  }
}

async function invokeChaincodeCLI(networkName, channelName, chaincodeName, argumentJSON) {

  const chcode = require(NETWORK_BASEPATH+'/'+networkName+'/'+channelName+'/'+chaincodeName);
  const chClass = new chcode[chaincodeName]();
  const functionToCall = argumentJSON.Args[0];
  const functionArgs = argumentJSON.Args.slice(1);
  try{
    const result = await chClass[functionToCall](...functionArgs)
    console.log(result);
  }
  catch(err){
    logger.error(err);
  }
}

module.exports = {
  createChaincodeCLI,
  invokeChaincodeCLI
}
 
