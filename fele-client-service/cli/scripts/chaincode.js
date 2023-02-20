const fs = require('fs');
const path = require("path");
const fsExtra = require('fs-extra');

function createChaincode(networkName, channelName, chaincodeName) {
  const chaincodePath = "../../../chaincode/"+networkName+"/"+channelName+"/"+chaincodeName
  const dir = path.join(__dirname, chaincodePath);
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
 
