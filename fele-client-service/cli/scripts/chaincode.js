const fs = require('fs');
const path = require("path");
const {NETWORK_BASEPATH} = require('../../../globals')

function createChaincode(networkName, channelName, chaincodeName) {

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

module.exports = {
  createChaincode
}
 
