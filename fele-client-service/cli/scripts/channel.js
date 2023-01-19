const fs = require('fs');
const path = require("path");

function createChannel(networkName, channelName) {
  var dir = "../../../chaincode/"+networkName+"/"+channelName
  dir = path.join(__dirname, dir);
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
    createChannel
}
 
