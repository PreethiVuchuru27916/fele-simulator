const { checkIfNetworkExists, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const USER_WORKSPACE = "../../../tmpworkspaceforuser/"

function createChannel(networkName, channelName, channelConfig)
{
  const database = "fele__"+networkName;
  try{
    const dbStatus = checkIfNetworkExists(database)
    if(dbStatus){
        console.log("Network "+ database+" exists")
        if(channelConfig.includes(".json")) {
          const fileName = USER_WORKSPACE+channelConfig;
          channelConfig = require(fileName);
          channelConfig = JSON.stringify(channelConfig)
        } else {
          channelConfig = channelConfig.replace(/\\/g,'')
        }
        const cconfig = insertToDatabase(database, JSON.parse(channelConfig));
        if (cconfig){
          var dir = "../../../chaincode/"+networkName+"/"+ channelName
          dir = path.join(__dirname, dir)
          if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir)
              console.log('Directory created.')
              }
          else {
              console.log('Directory already exists.')
              }
          }
        }
     }catch(error) {
         return false
     }
     return false
 }

 module.exports = {
  createChannel
}