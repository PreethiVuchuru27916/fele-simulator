const fs = require('fs');
const path = require("path");
const fsExtra = require('fs-extra');

function createChaincode(networkName, channelName, chaincodeName) {
  const chaincodePath = "../../../chaincode/"+networkName+"/"+channelName+"/"+chaincodeName
  try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
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
 
