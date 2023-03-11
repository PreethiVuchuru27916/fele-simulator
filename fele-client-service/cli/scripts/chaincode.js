const fs = require('fs');
const path = require("path");
const logger = require('../../utils/logger');
const {NETWORK_BASEPATH,USER_WORKSPACE} = require('../../../globals')

function createChaincodeCLI(networkName, channelName, chaincodeName) {

  const chaincodePath = path.join(NETWORK_BASEPATH, networkName, channelName, chaincodeName)
  try {
      if (!fs.existsSync(chaincodePath)) {
        fs.mkdirSync(chaincodePath)
        console.log('Directory created.')
      } else {
        console.log('Directory already exists.')
      }
      fs.copyFileSync(USER_WORKSPACE+'/'+chaincodeName+'.js',NETWORK_BASEPATH+'/'+networkName+'/'+channelName+'/'+chaincodeName+'/'+chaincodeName+'.js')
  } catch (err) {
    console.log(err)
  }
}

async function invokeChaincodeCLI(networkName, channelName, chaincodeName, argumentJSON) {

  const chcode = require(NETWORK_BASEPATH+'/'+networkName+'/'+channelName+'/'+chaincodeName+'/'+chaincodeName);
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